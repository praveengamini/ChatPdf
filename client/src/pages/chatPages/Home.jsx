import React, { useState, useRef } from 'react'
import SideBar from '../../components/common/SideBar'
import Header from '../../components/common/Header'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { IoSend } from 'react-icons/io5'
import { BsFilePdf } from 'react-icons/bs'
import { Textarea } from "../../components/ui/textarea"

const Home = () => {
  const [pdfUploaded, setPdfUploaded] = useState(false)
  const [messages, setMessages] = useState([])
  const [query, setQuery] = useState('')
  const fileInputRef = useRef(null)
  const messagesEndRef = useRef(null)

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPdfUploaded(true)
      // Add system message about PDF upload
      setMessages([{
        text: `PDF uploaded: ${file.name}`,
        sender: 'system',
        timestamp: new Date().toLocaleTimeString()
      }])
    }
  }

  const handleSendMessage = () => {
    if (query.trim() === '') return
    
    // Add user message
    const newMessages = [...messages, {
      text: query,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    }]
    setMessages(newMessages)
    setQuery('')
    
    // Here you would typically call your API to get the AI response
    // For now, we'll simulate a response
    setTimeout(() => {
      setMessages([...newMessages, {
        text: "This is a simulated response based on your PDF content. In a real implementation, this would come from your AI backend.",
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      }])
      scrollToBottom()
    }, 1000)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <Header />
      <div className="flex flex-1">
        <SideBar />
        <main className="flex-1 p-4 md:p-6 ml-0 lg:ml-64 flex flex-col">
          {/* Chat area */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {!pdfUploaded ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <BsFilePdf className="text-6xl text-blue-400 mb-4" />
                <h2 className="text-2xl font-bold text-blue-300 mb-2">Upload a PDF to start chatting</h2>
                <p className="text-gray-400 mb-6">Ask questions and get answers from your documents</p>
                <Label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
                  Select PDF
                  <Input 
                    ref={fileInputRef}
                    type="file" 
                    accept="application/pdf" 
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </Label>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-3/4 rounded-lg p-4 ${message.sender === 'user' 
                      ? 'bg-blue-600 rounded-tr-none' 
                      : message.sender === 'ai' 
                        ? 'bg-gray-700 rounded-tl-none' 
                        : 'bg-gray-800 text-gray-400'}`}
                    >
                      <p>{message.text}</p>
                      <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input area */}
          {pdfUploaded && (
            <div className="sticky bottom-0 bg-gray-800 p-4 rounded-lg shadow-lg">
              <div className="flex items-center gap-2">
                <Textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask a question about the PDF..."
                  className="flex-1 p-4 border border-blue-500 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!query.trim()}
                  className={`p-3 rounded-full ${query.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 cursor-not-allowed'} transition-colors`}
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