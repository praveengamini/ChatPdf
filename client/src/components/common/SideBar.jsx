import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CiSearch } from "react-icons/ci"
import { MdDelete } from "react-icons/md"
import { IoAdd } from "react-icons/io5"
import { getUserPdfs, deletePdf, getChatByPdf, resetPdfChat } from '../../store/home/index'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Input } from '../ui/input'

const SideBar = ({ searchDialogOpen, setSearchDialogOpen, onDocumentSelect, onNewChat }) => {
  const dispatch = useDispatch()
  const [searchQuery, setSearchQuery] = useState('')
  const [deletingPdfId, setDeletingPdfId] = useState(null)
  const [selectedPdfId, setSelectedPdfId] = useState(null)
  const userId = useSelector((state) => state.auth.user?.id)
  const currentPdfId = useSelector((state) => state.pdfChat.pdfId)
  
  const { userPdfs, loading, error } = useSelector(state => state.pdfChat)
  
  // Filter PDFs based on search query
  const filteredPdfs = userPdfs.filter(pdf => 
    pdf.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  useEffect(() => {
    if (userId) {
      dispatch(getUserPdfs(userId))
    }
  }, [dispatch, userId])

  const handleDeletePdf = async (pdfId, event) => {
    event.stopPropagation() // Prevent triggering the parent click handler
    
    if (window.confirm('Are you sure you want to delete this PDF?')) {
      setDeletingPdfId(pdfId)
      try {
        await dispatch(deletePdf(pdfId)).unwrap()
      } catch (error) {
        console.error('Failed to delete PDF:', error)
      } finally {
        setDeletingPdfId(null)
      }
    }
  }

  const handleDocumentClick = async (pdf) => {
    try {
      setSelectedPdfId(pdf._id)
      // Dispatch getChatByPdf to load existing chat
      await dispatch(getChatByPdf(pdf._id)).unwrap()
      // Call the callback to update Home component
      if (onDocumentSelect) {
        onDocumentSelect(pdf)
      }
    } catch (error) {
      console.error('Failed to load chat:', error)
    }
  }

  const handleNewChat = () => {
    dispatch(resetPdfChat())
    setSelectedPdfId(null)
    if (onNewChat) {
      onNewChat()
    }
  }

  const handleSearchDocumentClick = (pdf) => {
    handleDocumentClick(pdf)
    setSearchDialogOpen(false)
  }

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-10 w-64 backdrop-blur-md bg-black/70 text-white transform -translate-x-full lg:translate-x-0 transition-transform duration-200 ease-in-out shadow-2xl">
        <div className="flex flex-col h-full p-4 border-r border-white/10">
          <div className="text-xl font-bold text-white mb-8 p-2 drop-shadow-lg">ChatPDF</div>
          
          {/* New Chat Button */}
          <div className="mb-4">
            <button
              onClick={handleNewChat}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 text-white font-medium transition-all duration-300 hover:scale-102 shadow-md hover:shadow-lg"
            >
              <IoAdd className="text-lg" />
              New Chat
            </button>
          </div>
          
          <div className="mb-6">
            <div 
              className="flex items-center justify-between p-3 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer transition-all duration-300 hover:scale-102 shadow-md"
              onClick={() => setSearchDialogOpen(true)}
            >
              <span className="text-white font-medium">Search</span>
              <CiSearch className="text-xl text-white/80" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <h3 className="text-lg font-medium text-white/70 mb-4 p-2 drop-shadow-md">History</h3>
            
            {loading && (
              <div className="text-white/50 text-sm p-3">Loading PDFs...</div>
            )}
            
            {error && (
              <div className="text-red-400 text-sm p-3">Error: {error}</div>
            )}
            
            {!loading && !error && userPdfs.length === 0 && (
              <div className="text-white/50 text-sm p-3">No PDFs found</div>
            )}
            
            <div className="space-y-2">
              {userPdfs.map(pdf => (
                <div 
                  key={pdf._id} 
                  className={`group relative p-3 rounded-xl backdrop-blur-md border cursor-pointer text-sm transition-all duration-300 hover:scale-102 shadow-md hover:shadow-lg ${
                    selectedPdfId === pdf._id || currentPdfId === pdf._id
                      ? 'bg-white/20 border-white/30 text-white'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                  }`}
                  onClick={() => handleDocumentClick(pdf)}
                >
                  <div className="font-medium truncate pr-8">{pdf.fileName}</div>
                  <div className="text-white/50 text-xs mt-1">
                    {new Date(pdf.createdAt).toLocaleDateString()}
                  </div>
                  
                  {/* Delete Button */}
                  <button
                    onClick={(e) => handleDeletePdf(pdf._id, e)}
                    disabled={deletingPdfId === pdf._id}
                    className="absolute top-2 right-2 p-1 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-all duration-200 disabled:opacity-50"
                    title="Delete PDF"
                  >
                    {deletingPdfId === pdf._id ? (
                      <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <MdDelete className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Search Dialog */}
      <Dialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen}>
        <DialogContent className="backdrop-blur-md bg-black/90 border border-white/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-bold drop-shadow-lg">
              Search Documents
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center backdrop-blur-md bg-white/5 border border-white/20 rounded-xl p-3 shadow-lg">
              <Input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 backdrop-blur-md bg-transparent border-none focus:ring-0 text-white placeholder-white/50 text-lg"
                placeholder="Search by document name..."
                autoFocus
              />
              <CiSearch className="text-2xl text-white/80 ml-3" />
            </div>
            
            <div className="max-h-96 overflow-y-auto space-y-2">
              <h4 className="text-white/70 font-medium mb-3">
                {searchQuery ? `Results for "${searchQuery}"` : 'All Documents'}
                <span className="text-white/50 text-sm ml-2">
                  ({searchQuery ? filteredPdfs.length : userPdfs.length})
                </span>
              </h4>
              
              {searchQuery && filteredPdfs.length === 0 && (
                <div className="text-white/50 text-center py-8">
                  No documents found matching "{searchQuery}"
                </div>
              )}
              
              {(searchQuery ? filteredPdfs : userPdfs).map(pdf => (
                <div 
                  key={pdf._id} 
                  className="group relative p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer transition-all duration-300 hover:scale-102 shadow-md hover:shadow-lg"
                  onClick={() => handleSearchDocumentClick(pdf)}
                >
                  <div className="font-medium text-white mb-1 pr-8">
                    {searchQuery ? (
                      <span dangerouslySetInnerHTML={{
                        __html: pdf.fileName.replace(
                          new RegExp(`(${searchQuery})`, 'gi'),
                          '<mark class="bg-yellow-400/30 text-yellow-200 px-1 rounded">$1</mark>'
                        )
                      }} />
                    ) : (
                      pdf.fileName
                    )}
                  </div>
                  <div className="text-white/50 text-sm">
                    Created: {new Date(pdf.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-white/40 text-xs mt-1">
                    Click to open document
                  </div>
                  
                  {/* Delete Button in Search Dialog */}
                  <button
                    onClick={(e) => handleDeletePdf(pdf._id, e)}
                    disabled={deletingPdfId === pdf._id}
                    className="absolute top-3 right-3 p-1 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-all duration-200 disabled:opacity-50"
                    title="Delete PDF"
                  >
                    {deletingPdfId === pdf._id ? (
                      <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <MdDelete className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SideBar