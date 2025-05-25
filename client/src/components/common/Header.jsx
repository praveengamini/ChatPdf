import React from 'react'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import {logoutUser} from '../../store/auth/index'
import { useDispatch } from 'react-redux'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle
} from "../../components/ui/sheet"
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userName = useSelector(state => state.auth.user?.userName);
  const email = useSelector(state => state.auth.user?.email);
  const handleLogout = () => {
    dispatch(logoutUser())
  }

  return (
    <header className="bg-gray-800 shadow-md py-4 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-400">ChatPDF</h1>
      
      <Sheet>
        <SheetTrigger asChild>
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold cursor-pointer hover:bg-blue-700 transition-colors">
            {userName?.[0]?.toUpperCase() || '?'}
          </div>
        </SheetTrigger>
        
        <SheetContent side="right" className="bg-gray-800 border-l border-gray-700 text-white">
              <SheetTitle className="sr-only"></SheetTitle>

          <div className="flex flex-col h-full">
            <div className="px-4 py-6 border-b border-gray-700">
              <div className="text-xl font-semibold">{userName}</div>
              <div className="text-sm text-gray-400 mt-1">{email}</div>
            </div>
            
            <div className="flex-1 flex flex-col py-4">
              <button 
                className="px-4 py-3 text-left hover:bg-gray-700 transition-colors text-green-400"
                onClick={() => {
                  navigate('/auth/setpassword')
                }}
              >
                Change password
              </button>
              <button 
                className="px-4 py-3 text-left hover:bg-gray-700 transition-colors text-red-400"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}

export default Header