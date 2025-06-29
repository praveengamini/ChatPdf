import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthOutlet = () => {
  return (
    <div className="min-h-screen bg-black flex">
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-20 w-24 h-24 bg-white/3 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
        
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-center">
          <div className="mb-6">
            <h1 className="text-5xl font-bold text-white mb-2">
              Chat<span className="text-red-400">PDF</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-red-400 mx-auto rounded-full"></div>
          </div>
          
          <p className="text-xl text-white/80 max-w-md leading-relaxed mb-8">
            Transform your PDFs into interactive conversations. Chat, learn, and discover insights instantly.
          </p>
          
          <div className="space-y-4 text-white/70">
            <div className="flex items-center gap-3 justify-center">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <span>Upload any PDF document</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Ask questions naturally</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span>Get instant, accurate answers</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center min-h-screen p-4">
        <div className="lg:hidden absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">
              Chat<span className="text-red-400">PDF</span>
            </h1>
            <div className="w-16 h-0.5 bg-gradient-to-r from-cyan-400 to-red-400 mx-auto mt-2 rounded-full"></div>
          </div>
        </div>
        
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthOutlet;