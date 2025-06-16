import React, { useState } from 'react'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'
import { useNavigate } from 'react-router-dom'
import { FaEnvelope, FaLock, FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa'
import axios from 'axios'
import { login } from '../../store/auth'
import { toast } from 'sonner';
import { useDispatch } from 'react-redux'

const Login = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const dispatch = useDispatch()
    
    const handleLogin = async(event) => {
        event.preventDefault();
        const formData = {
            email: email,
            password: password,
        };
        try {
            const data = await dispatch(login(formData));
            console.log(data);
            const payload = data?.payload;                
            if (payload?.success) {
            toast(payload.message);  
            navigate('/chat/home');
            } else {
            toast.error(payload?.message || "An error occurred during Login");
            }
        }catch (error) 
        {
            toast.error("An unexpected error occurred");
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white/5 backdrop-blur-3xl rounded-xl shadow-2xl overflow-hidden border border-white/30 backdrop-saturate-150">
                <div className="bg-white/5 backdrop-blur-2xl py-4 px-6 border-b border-white/20 backdrop-saturate-150">
                    <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
                    <p className="text-white/80">Login to access your ChatPDF account</p>
                </div>
                
                <form onSubmit={handleLogin} className="p-6 space-y-6">
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
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-white/3 backdrop-blur-xl border-white/40 text-white placeholder:text-white/60 focus:ring-2 focus:ring-white/60 focus:border-white/60 backdrop-saturate-150 pr-12"
                                placeholder="enter your password"
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors focus:outline-none"
                            >
                                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-white/10 backdrop-blur-2xl hover:bg-white/20 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 border border-white/50 hover:border-white/70 backdrop-saturate-150"
                    >
                        Login <FaSignInAlt />
                    </button>
                </form>

                <div className="px-6 pb-6 text-center">
                    <p className="text-white/70">
                        Don't have an account? {' '}
                        <span 
                            onClick={() => navigate('/auth/register')}
                            className="text-white hover:text-white/80 cursor-pointer underline transition-colors"
                        >
                            Register here
                        </span>
                    </p>
                </div>
                <div className="px-6 pb-6 text-center">
                    <p className="text-white/70">
                        Forgot Password? {' '}
                        <span 
                            onClick={() => navigate('/auth/forgot')}
                            className="text-white hover:text-white/80 cursor-pointer underline transition-colors"
                        >
                            Click here
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login