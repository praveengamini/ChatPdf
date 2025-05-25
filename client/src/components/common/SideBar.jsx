import React, { useState } from 'react'
import { Input } from '../ui/input'
import { CiSearch } from "react-icons/ci"

const SideBar = () => {
  const [openSearch, setOpenSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const handleSearch = () => {
    // Search functionality here
    console.log('Searching for:', searchQuery)
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-10 w-64 bg-gray-800 text-white transform -translate-x-full lg:translate-x-0 transition-transform duration-200 ease-in-out">
      <div className="flex flex-col h-full p-4 border-r border-gray-700">
        <div className="text-xl font-bold text-blue-400 mb-8 p-2">ChatPDF</div>
        
        <div className="mb-6">
          <div 
            className="flex items-center justify-between p-2 rounded hover:bg-gray-700 cursor-pointer"
            onClick={() => setOpenSearch(!openSearch)}
          >
            <span>Search</span>
            <svg className={`w-4 h-4 transition-transform ${openSearch ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {openSearch && (
            <div className="mt-2 flex items-center bg-gray-700 rounded p-2">
              <Input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-gray-700 border-none focus:ring-0 text-white"
                placeholder="Search..."
              />
              <CiSearch 
                onClick={handleSearch} 
                className="text-xl text-blue-400 cursor-pointer hover:text-blue-300 ml-2" 
              />
            </div>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <h3 className="text-lg font-medium text-gray-400 mb-2 p-2">History</h3>
          {/* History items would go here */}
          <div className="space-y-1">
            {[1, 2, 3].map(item => (
              <div key={item} className="p-2 rounded hover:bg-gray-700 cursor-pointer text-sm">
                Document {item}.pdf
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}

export default SideBar