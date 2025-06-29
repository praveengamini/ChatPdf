import React, { useState, useRef, useEffect } from 'react'
import SideBar from '../../components/common/SideBar'
import Header from '../../components/common/Header'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { IoSend } from 'react-icons/io5'
import { BsFilePdf } from 'react-icons/bs'
import { Textarea } from "../../components/ui/textarea"
import axios from 'axios' 
import { uploadPdf, sendMessageToChat } from '../../store/home'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

const Home = () => {
  const dispatch = useDispatch()
  const pdfId = useSelector(state => state.pdfChat.pdfId)
  const chatFromRedux = useSelector(state => state.pdfChat.chat)
  
  const [pdfUploaded, setPdfUploaded] = useState(false)
  const [messages, setMessages] = useState([])
  const [query, setQuery] = useState('')
  const [pdfFile, setPdfFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingPdf, setIsUploadingPdf] = useState(false)
  const [pdfUploadFailed, setPdfUploadFailed] = useState(false)
  const [currentPdfName, setCurrentPdfName] = useState('')
  const fileInputRef = useRef(null)
  const messagesEndRef = useRef(null)
  const [searchDialogOpen, setSearchDialogOpen] = useState(false)
  const user = useSelector(state => state.auth.user)

  const convertReduxChatToMessages = (reduxChat) => {
    return reduxChat.map(msg => ({
      text: msg.message,
      sender: msg.sender,
      timestamp: msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString()
    }))
  }

  useEffect(() => {
    if (chatFromRedux && chatFromRedux.length > 0) {
      const convertedMessages = convertReduxChatToMessages(chatFromRedux)
      setMessages(convertedMessages)
      setPdfUploaded(true)
      scrollToBottom()
    }
  }, [chatFromRedux])

  useEffect(() => {
    if (pdfId) {
      setPdfUploaded(true)
    } else {
      setPdfUploaded(false)
      setMessages([])
      setCurrentPdfName('')
    }
  }, [pdfId])

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setPdfFile(file)
      setCurrentPdfName(file.name)
      setPdfUploadFailed(false)
      setIsUploadingPdf(true)
      
      try {
        const resultAction = await dispatch(uploadPdf({ file, userId: user.id }))
        
        if (uploadPdf.fulfilled.match(resultAction)) {
          setPdfUploaded(true)
          setMessages([{
            text: `PDF uploaded: ${file.name}`,
            sender: 'system',
            timestamp: new Date().toLocaleTimeString()
          }])
        } else {
          throw new Error(resultAction.payload?.message || 'Upload failed')
        }
      } catch (error) {
        console.error('Upload failed', error)
        setPdfUploadFailed(true)
        setMessages([{
          text: `Failed to upload PDF: ${file.name}`,
          sender: 'system',
          timestamp: new Date().toLocaleTimeString()
        }])
      } finally {
        setIsUploadingPdf(false)
      }
    }
  }

  const handleSendMessage = async () => {
    if (query.trim() === '') return

    const userMessage = {
      text: query,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    }

    setMessages(prevMessages => [...prevMessages, userMessage])
    const currentQuery = query
    setQuery('')
    setIsLoading(true)

    try {
      let pdfIdToSend = pdfId
      if (typeof pdfId === 'object' && pdfId !== null) {
        pdfIdToSend = pdfId._id || pdfId.id || pdfId
      }
      pdfIdToSend = String(pdfIdToSend)
      
      const resultAction = await dispatch(sendMessageToChat({
        pdfId: pdfIdToSend,
        userId: user.id,
        message: currentQuery
      }))
      
      if (sendMessageToChat.fulfilled.match(resultAction)) {
        const updatedChat = resultAction.payload.chat
        const aiMessageObj = updatedChat.messages[updatedChat.messages.length - 1]

        const aiMessage = {
          text: aiMessageObj.message,
          sender: aiMessageObj.sender,
          timestamp: aiMessageObj.timestamp || new Date().toLocaleTimeString()
        }

        setMessages(prevMessages => [...prevMessages, aiMessage])
      } else {
        throw new Error(resultAction.payload?.message || 'Message failed to send.')
      }
    } catch (error) {
      console.error('Error getting response:', error)
      
      setMessages(prevMessages => [...prevMessages, {
        text: "Error: Failed to get response from server.",
        sender: 'system',
        timestamp: new Date().toLocaleTimeString()
      }])
    } finally {
      setIsLoading(false)
      scrollToBottom()
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleDocumentSelect = (pdf) => {
    if (!pdf || !pdf.pdfId) {
      console.error("No PDF ID provided")
      return
    }
    
    setCurrentPdfName(pdf.fileName)
    setPdfUploaded(true)
  }

  const handleNewChat = () => {
    setPdfUploaded(false)
    setMessages([])
    setCurrentPdfName('')
    setPdfFile(null)
    setQuery('')
    setPdfUploadFailed(false)
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Header />
      <div className="flex flex-1">
        <SideBar 
          searchDialogOpen={searchDialogOpen} 
          setSearchDialogOpen={setSearchDialogOpen}
          onDocumentSelect={handleDocumentSelect}
          onNewChat={handleNewChat}
        />
        <main className="flex-1 p-4 md:p-6 ml-0 lg:ml-64 flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {!pdfUploaded ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-12 shadow-2xl">
                  {isUploadingPdf ? (
                    <div className="flex flex-col items-center">
                      <div className="relative mb-6">
                        <BsFilePdf className="text-6xl text-white animate-pulse" />
                        <div className="absolute inset-0 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-4">
                        Uploading PDF
                        <span className="animate-pulse">
                          <span className="animate-bounce inline-block mx-1">.</span>
                          <span className="animate-bounce inline-block mx-1" style={{animationDelay: '0.1s'}}>.</span>
                          <span className="animate-bounce inline-block mx-1" style={{animationDelay: '0.2s'}}>.</span>
                        </span>
                      </h2>
                      <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden mb-4">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                      </div>
                      <p className="text-white/70 text-sm">Please wait while we process your document...</p>
                    </div>
                  ) : (
                    <>
                      <BsFilePdf className="text-6xl text-white mb-6 mx-auto drop-shadow-lg" />
                      <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">Upload a PDF to start chatting</h2>
                      <p className="text-white/70 mb-8 text-lg">Ask questions and get answers from your documents</p>
                      <Label className="cursor-pointer backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl inline-block">
                        Select PDF
                        <Input 
                          ref={fileInputRef}
                          type="file" 
                          accept="application/pdf" 
                          className="hidden"
                          onChange={handleFileUpload}
                          disabled={isUploadingPdf}
                        />
                      </Label>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <>
                {currentPdfName && (
                  <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 mb-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <BsFilePdf className="text-2xl text-white/80" />
                      <div>
                        <h3 className="text-lg font-medium text-white truncate">{currentPdfName}</h3>
                        <p className="text-white/50 text-sm">Active Document</p>
                      </div>
                    </div>
                  </div>
                )}
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-3/4 rounded-2xl p-4 backdrop-blur-md border shadow-lg ${message.sender === 'user' 
                      ? 'bg-white/10 border-white/20 text-white rounded-tr-sm' 
                      : message.sender === 'ai' 
                        ? 'bg-white/5 border-white/10 text-white rounded-tl-sm' 
                        : 'bg-white/5 border-white/10 text-white/70'}`}
                    >
                      <p className="leading-relaxed whitespace-pre-line">{message.text}</p>
                      <p className="text-xs mt-2 text-white/50">{message.timestamp}</p>
                      {pdfUploadFailed && message.text.startsWith('Failed to upload PDF') && (
                        <button
                          onClick={() => handleFileUpload({ target: { files: [pdfFile] } })}
                          className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded shadow transition-all duration-300"
                          disabled={isUploadingPdf}
                        >
                          {isUploadingPdf ? 'Retrying...' : 'Retry'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="text-white/50 text-sm italic text-center animate-pulse">
                    Thinking...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
          {pdfUploaded && (
            <div className="sticky bottom-0 backdrop-blur-md bg-white/5 border border-white/10 p-6 rounded-2xl shadow-2xl">
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <Textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask a question about the PDF..."
                    className="w-full p-4 backdrop-blur-md bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-white/30 resize-none transition-all duration-300"
                    rows={3}
                  />
                </div>
                <button 
                  onClick={handleSendMessage}
                  disabled={!query.trim() || isLoading}
                  className={`p-4 rounded-xl backdrop-blur-md border transition-all duration-300 ${
                    query.trim() && !isLoading
                      ? 'bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/30 text-white hover:scale-105 shadow-lg hover:shadow-xl' 
                      : 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
                  }`}
                >
                  <IoSend className="text-xl" />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Home
