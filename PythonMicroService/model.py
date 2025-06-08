import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.llms.base import LLM
from langchain.memory import ConversationBufferWindowMemory
from langchain.chains import ConversationalRetrievalChain
from langchain.schema import BaseMessage, HumanMessage, AIMessage
from typing import Optional, List, Mapping, Any, Dict
import requests
import chromadb
from chromadb.config import Settings
import json
import uuid
from datetime import datetime

app = FastAPI()
chroma_client = chromadb.PersistentClient(path="./chroma_db")

class LocalMistralChatLLM(LLM, BaseModel):
    url: str
    model_name: str = "mistral-7b-instruct-v0.3"

    def _call(self, prompt: str, stop: Optional[List[str]] = None) -> str:
        payload = {
            "model": self.model_name,
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 500,
            "temperature": 0.7,
        }
        response = requests.post(self.url, json=payload)
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"]

    @property
    def _identifying_params(self) -> Mapping[str, Any]:
        return {"url": self.url, "model_name": self.model_name}

    @property
    def _llm_type(self) -> str:
        return "local-mistral-chat"

class ChromaDBChatMemory:
    def __init__(self, pdf_id: str, session_id: str, k: int = 5):
        self.pdf_id = pdf_id
        self.session_id = session_id
        self.k = k
        self.collection_name = f"chat_history_{pdf_id}_{session_id}".replace("-", "_")
        try:
            self.collection = chroma_client.create_collection(
                name=self.collection_name,
                metadata={"hnsw:space": "cosine"}
            )
        except Exception:
            self.collection = chroma_client.get_collection(name=self.collection_name)
    
    def add_message(self, message: BaseMessage):
        message_id = str(uuid.uuid4())
        timestamp = datetime.now().isoformat()
        message_data = {
            "content": message.content,
            "type": "human" if isinstance(message, HumanMessage) else "ai",
            "timestamp": timestamp,
            "pdf_id": self.pdf_id,
            "session_id": self.session_id
        }
        self.collection.add(
            documents=[message.content],
            metadatas=[message_data],
            ids=[message_id]
        )
    
    def get_recent_messages(self) -> List[BaseMessage]:
        try:
            results = self.collection.get(include=["documents", "metadatas"])
            if not results["documents"]:
                return []
            messages_with_metadata = list(zip(results["documents"], results["metadatas"]))
            messages_with_metadata.sort(key=lambda x: x[1]["timestamp"], reverse=True)
            recent_messages = messages_with_metadata[:self.k * 2]
            recent_messages.reverse()
            langchain_messages = []
            for content, metadata in recent_messages:
                if metadata["type"] == "human":
                    langchain_messages.append(HumanMessage(content=content))
                else:
                    langchain_messages.append(AIMessage(content=content))
            return langchain_messages
        except Exception as e:
            print(f"Error retrieving messages: {e}")
            return []
     
    def clear_history(self):
        try:
            chroma_client.delete_collection(name=self.collection_name)
            self.collection = chroma_client.create_collection(
                name=self.collection_name,
                metadata={"hnsw:space": "cosine"}
            )
        except Exception as e:
            print(f"Error clearing history: {e}")
    
    def get_message_count(self) -> int:
        try:
            results = self.collection.get()
            return len(results["documents"])
        except Exception:
            return 0

vectorstores = {}
memory_instances = {}

class EmbedRequest(BaseModel):
    text: str
    pdfId: str

class GenerateRequest(BaseModel):
    pdfId: str
    message: str
    sessionId: Optional[str] = "default"

class ClearHistoryRequest(BaseModel):
    pdfId: str
    sessionId: Optional[str] = "default"

@app.post("/embed")
async def embed_text(request: EmbedRequest):
    try:
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
        texts = text_splitter.create_documents([request.text])
        embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        vectorstore = FAISS.from_documents(texts, embeddings)
        vectorstores[request.pdfId] = vectorstore
        return {"message": f"Embedding stored for PDF ID: {request.pdfId}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error embedding text: {str(e)}")

@app.post("/api/generate")
def generate_answer(request: GenerateRequest):
    vectorstore = vectorstores.get(request.pdfId)
    if not vectorstore:
        raise HTTPException(status_code=404, detail="No embeddings found for this PDF ID")
    try:
        session_key = f"{request.pdfId}_{request.sessionId}"
        if session_key not in memory_instances:
            memory_instances[session_key] = ChromaDBChatMemory(
                pdf_id=request.pdfId,
                session_id=request.sessionId,
                k=5
            )
        memory = memory_instances[session_key]
        mistral_llm = LocalMistralChatLLM(url="http://127.0.0.1:1234/v1/chat/completions")
        chat_history = memory.get_recent_messages()
        retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
        relevant_docs = retriever.get_relevant_documents(request.message)
        context = "\n\n".join([doc.page_content for doc in relevant_docs])
        history_string = ""
        for msg in chat_history:
            if isinstance(msg, HumanMessage):
                history_string += f"Human: {msg.content}\n"
            elif isinstance(msg, AIMessage):
                history_string += f"Assistant: {msg.content}\n"
        enhanced_prompt = f"""Context from document:
{context}

Previous conversation:
{history_string}

Current question: {request.message}

Please answer the question based on the provided context and conversation history. If the answer cannot be found in the context, say so clearly."""
        answer = mistral_llm._call(enhanced_prompt)
        memory.add_message(HumanMessage(content=request.message))
        memory.add_message(AIMessage(content=answer))
        return {
            "answer": answer,
            "source_documents": len(relevant_docs),
            "session_id": request.sessionId,
            "message_count": memory.get_message_count()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating answer: {str(e)}")

@app.get("/health")
def health_check():
    try:
        collections = chroma_client.list_collections()
        collection_count = len(collections)
        return {
            "status": "healthy",
            "loaded_pdf_ids": list(vectorstores.keys()),
            "chromadb_collections": collection_count,
            "active_memory_instances": len(memory_instances)
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "loaded_pdf_ids": list(vectorstores.keys()),
            "active_memory_instances": len(memory_instances)
        }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
