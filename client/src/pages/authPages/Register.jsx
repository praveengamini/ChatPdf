import React, { useState } from 'react'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'
import { useNavigate } from 'react-router-dom'
import { FaUser, FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa'
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { register } from '../../store/auth'
import axios from 'axios'
const Register = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const dispatch = useDispatch()

   async function handleRegister(event) {
    const formData = {
    email: email,
    password: password,
    userName:name,
    };
    event.preventDefault();
    try {
        const data = await dispatch(register(formData));
        console.log(data);
        
        const payload = data?.payload;
        console.log(payload);
        
        if (payload?.success) {
        toast(payload.message);  
        navigate('/auth/login');
        } else {
        toast.error(payload?.message || "An error occurred during registration");
        }
    }catch (error) 
    {
         toast.error("An unexpected error occurred");
    }
  }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
                <div className="bg-blue-600 py-4 px-6">
                    <h2 className="text-2xl font-bold text-white">Create Account</h2>
                    <p className="text-blue-100">Join us to start using ChatPDF</p>
                </div>
                
                <form onSubmit={handleRegister} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="username" className="text-gray-300 flex items-center gap-2">
                            <FaUser className="text-blue-400" /> Username
                        </Label>
                        <Input
                            type="text"
                            id="username"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-300 flex items-center gap-2">
                            <FaEnvelope className="text-blue-400" /> Email
                        </Label>
                        <Input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="your@email.com"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-gray-300 flex items-center gap-2">
                            <FaLock className="text-blue-400" /> Password
                        </Label>
                        <Input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                        Register <FaArrowRight />
                    </button>
                </form>

                <div className="px-6 pb-6 text-center">
                    <p className="text-gray-400">
                        Already have an account? {' '}
                        <span 
                            onClick={() => navigate('/auth/login')}
                            className="text-blue-400 hover:text-blue-300 cursor-pointer underline transition-colors"
                        >
                            Login here
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register