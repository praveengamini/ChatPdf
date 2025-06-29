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
    <header className="backdrop-blur-md bg-white/5 border-b border-white/10 shadow-2xl py-4 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-white drop-shadow-lg max-lg:invisible ">ChatPDF</h1>
      <h1 className="text-2xl font-bold text-white drop-shadow-lg">Hi, {userName}!</h1>
      
      <Sheet>
        <SheetTrigger asChild>
          <div className="w-10 h-10 rounded-full backdrop-blur-md bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold cursor-pointer hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            {userName?.[0]?.toUpperCase() || '?'}
          </div>
        </SheetTrigger>
        
        <SheetContent side="right" className="backdrop-blur-md bg-black/80 border-l border-white/10 text-white shadow-2xl">
          <SheetTitle className="sr-only"></SheetTitle>

          <div className="flex flex-col h-full">
            <div className="px-4 py-6 border-b border-white/10">
              <div className="text-xl font-semibold text-white drop-shadow-md">{userName}</div>
              <div className="text-sm text-white/70 mt-1">{email}</div>
            </div>
            
            <div className="flex-1 flex flex-col py-4">
              <button 
                className="px-4 py-3 text-left backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300 text-white border border-white/10 rounded-lg mx-2 mb-2 hover:scale-102 shadow-md"
                onClick={() => {
                  navigate('/auth/setpassword')
                }}
              >
                Change password
              </button>
              <button 
                className="px-4 py-3 text-left backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300 text-white/90 hover:text-white border border-white/10 rounded-lg mx-2 hover:scale-102 shadow-md"
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