    import React, { useState } from 'react'
    import { Label } from '../../components/ui/label'
    import { Input } from '../../components/ui/input'
    import { useNavigate } from 'react-router-dom'
    import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa'
    import axios from 'axios'
    import { login } from '../../store/auth'
    import { toast } from 'sonner';
    import { useDispatch } from 'react-redux'
    const Login = () => {
        const navigate = useNavigate()
        const [email, setEmail] = useState("")
        const [password, setPassword] = useState("")
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

        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
                    <div className="bg-blue-600 py-4 px-6">
                        <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
                        <p className="text-blue-100">Login to access your ChatPDF account</p>
                    </div>
                    
                    <form onSubmit={handleLogin} className="p-6 space-y-6">
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
                            Login <FaSignInAlt />
                        </button>
                    </form>

                    <div className="px-6 pb-6 text-center">
                        <p className="text-gray-400">
                            Don't have an account? {' '}
                            <span 
                                onClick={() => navigate('/auth/register')}
                                className="text-blue-400 hover:text-blue-300 cursor-pointer underline transition-colors"
                            >
                                Register here
                            </span>
                        </p>
                    </div>
                    <div className="px-6 pb-6 text-center">
                        <p className="text-gray-400">
                            Forgot Password? {' '}
                            <span 
                                onClick={() => navigate('/auth/forgot')}
                                className="text-blue-400 hover:text-blue-300 cursor-pointer underline transition-colors"
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