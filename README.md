# 📄 ChatPDF

> **Intelligent PDF Chat Assistant** - Transform your documents into interactive conversations using AI

ChatPDF is a cutting-edge full-stack application that revolutionizes how you interact with PDF documents. Upload any PDF and start having intelligent conversations with your content using advanced AI technology.

[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.8%2B-blue)](https://python.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)

## ✨ Features

- 🔍 **Semantic Search** - Find relevant information across your entire document
- 💬 **Natural Language Queries** - Ask questions in plain English
- 🔐 **Secure Authentication** - JWT-based user authentication with OTP verification
- ⚡ **Real-time Chat** - Instant responses with context-aware answers
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🎯 **Context Preservation** - Maintains conversation context for follow-up questions
- 📊 **Multiple PDF Support** - Upload and chat with multiple documents

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │    │  Express Server │    │ FastAPI Service │
│   (Port 5173)   │◄──►│   (Port 5000)   │◄──►│   (Port 8000)   │
│                 │    │                 │    │                 │
│ • UI/UX         │    │ • Authentication│    │ • PDF Processing│
│ • State Mgmt    │    │ • File Upload   │    │ • AI/ML Models  │
│ • API Calls     │    │ • Database      │    │ • Vector Search │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   MongoDB       │
                    │   Database      │
                    └─────────────────┘
```

## 📁 Project Structure

```
ChatPDF/
├── 📁 client/                    # Frontend Application
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/              # Application pages
│   │   ├── store/              # Redux store configuration
│   ├── package.json
│   └── vite.config.js
│
├── 📁 server/                   # Backend API
│   ├── controllers/            # Route handlers
│   ├── models/                # Database models
│   ├── routes/                # API routes
│   ├── utils/                 # Utility functions
│   └── package.json
│
└── 📁 PythonMicroService/       # AI/ML Microservice
    ├── model.py               # FastAPI application
    ├── requirements.txt       # Python dependencies
    └── chroma_db/          # ChromDb vector storage
```

## 🛠️ Tech Stack

### Frontend
- **⚛️ React 19** - Modern UI library with latest features
- **⚡ Vite** - Lightning-fast build tool
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **🔄 Redux Toolkit** - Predictable state management
- **💾 Redux Persist** - State persistence
- **🎭 Radix UI** - Accessible component primitives
- **🎯 React Icons** - Beautiful icon library

### Backend
- **🟢 Node.js & Express.js** - Server runtime and framework
- **🍃 MongoDB & Mongoose** - Database and ODM
- **🔐 JWT Authentication** - Secure token-based auth
- **📁 Multer** - File upload handling
- **📧 Nodemailer** - Email service for OTP
- **📄 PDF Processing** - `pdf-lib` and `pdf-parse`

### AI/ML Microservice
- **🚀 FastAPI** - High-performance Python web framework
- **🦜 LangChain** - LLM application framework
- **🤗 HuggingFace Transformers** - State-of-the-art NLP models
- **🔍 FAISS** - Efficient similarity search
- **📊 Sentence Transformers** - Semantic text embeddings
- **✅ Pydantic** - Data validation and serialization

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **MongoDB** (local or cloud instance)
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/praveengamini/ChatPDF.git
cd ChatPDF
```

### 2. Environment Setup

Create a `.env` file in the `server/` directory:

```env
# Database
MONGO_URL=mongodb://localhost:27017/chatpdf
# or use MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/chatpdf

# Server Configuration
PORT=5000
JWT_SECRET_KEY=your_super_secret_jwt_key_here

# Email Configuration (for OTP)
FROM_OTP_SENDING_MAIL=your-email@gmail.com
OTP_MAIL_PASS=your_app_password_here

# Ip address of python micro service
IP_PY_MICRO=ip_address_where_Python_microservice_running
```

### 3. Install Dependencies

#### Frontend
```bash
cd client
npm install
```

#### Backend
```bash
cd ../server
npm install
```

#### Python Microservice
```bash
cd ../PythonMicroService
pip install -r requirements.txt
```

### 4. Start the Application

Open **three terminal windows** and run:

#### Terminal 1 - Frontend
```bash
cd client
npm run dev
```
🌐 Frontend runs at: http://localhost:5173

#### Terminal 2 - Backend
```bash
cd server
npm run dev
```
🔧 Backend runs at: http://localhost:5000

#### Terminal 3 - AI Microservice
```bash
cd PythonMicroService
python -m uvicorn model:app --host 0.0.0.0 --port 8000 --reload
```
🤖 AI Service runs at: http://localhost:8000
📚 API docs at: http://localhost:8000/docs

## 📖 Usage

1. **Sign Up/Login** - Create an account or log in with existing credentials
2. **Upload PDF** - Click the upload button and select your PDF document
3. **Start Chatting** - Ask questions about your document in natural language
4. **Get Answers** - Receive contextual answers based on your PDF content

### Example Queries

- "What is the main topic of this document?"
- "Summarize the key findings in chapter 3"
- "What are the conclusions mentioned in the research?"
- "Find all mentions of 'artificial intelligence'"


## 🤝 Contributing

Welcoming contributions! 


## 📞 Support

If you encounter any issues or have questions:

- 📧 **Email**: praveengamini009@gmail.com

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

</div>
