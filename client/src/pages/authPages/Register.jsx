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
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white/5 backdrop-blur-3xl rounded-xl shadow-2xl overflow-hidden border border-white/30 backdrop-saturate-150">
                <div className="bg-white/5 backdrop-blur-2xl py-4 px-6 border-b border-white/20 backdrop-saturate-150">
                    <h2 className="text-2xl font-bold text-white">Create Account</h2>
                    <p className="text-white/80">Join us to start using ChatPDF</p>
                </div>
                
                <form onSubmit={handleRegister} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="username" className="text-white/90 flex items-center gap-2">
                            <FaUser className="text-white" /> Username
                        </Label>
                        <Input
                            type="text"
                            id="username"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-white/3 backdrop-blur-xl border-white/40 text-white placeholder:text-white/60 focus:ring-2 focus:ring-white/60 focus:border-white/60 backdrop-saturate-150"
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-white/90 flex items-center gap-2">
                            <FaEnvelope className="text-white" /> Email
                        </Label>
                        <Input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-white/3 backdrop-blur-xl border-white/40 text-white placeholder:text-white/60 focus:ring-2 focus:ring-white/60 focus:border-white/60 backdrop-saturate-150"
                            placeholder="your@email.com"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-white/90 flex items-center gap-2">
                            <FaLock className="text-white" /> Password
                        </Label>
                        <Input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-white/3 backdrop-blur-xl border-white/40 text-white placeholder:text-white/60 focus:ring-2 focus:ring-white/60 focus:border-white/60 backdrop-saturate-150"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-white/10 backdrop-blur-2xl hover:bg-white/20 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 border border-white/50 hover:border-white/70 backdrop-saturate-150"
                    >
                        Register <FaArrowRight />
                    </button>
                </form>

                <div className="px-6 pb-6 text-center">
                    <p className="text-white/70">
                        Already have an account? {' '}
                        <span 
                            onClick={() => navigate('/auth/login')}
                            className="text-white hover:text-white/80 cursor-pointer underline transition-colors"
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