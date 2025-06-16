import React, { useState } from 'react'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'
import { FaEnvelope, FaLock, FaKey, FaSave, FaEye, FaEyeSlash } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { changePassword } from '../../store/auth'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const SetPassword = () => {
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [showOldPassword, setShowOldPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('')
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const email = useSelector(state => state.auth.user?.email);
    const userName = useSelector(state => state.auth.user?.userName);
    
    const handleSetPassword = async (event) => {
        event.preventDefault()
        setIsLoading(true)
        
        try {
             const formData =  {
                    email: email,
                    password: oldPassword,
                    newPassword: newPassword
                }
           const data = await dispatch(changePassword(formData))
           const payload = data.payload
           console.log(payload.success);
           
           if(payload.success)
           {
               setTimeout(()=>{
                toast('Password updated successfully!')
                 setMessage(payload.message)
                },1000)
                navigate('/chat/home')
            }
           else{
            toast.error(payload.message)
           }
           
        } catch (error) {
            setMessage('Failed to update password. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const toggleOldPasswordVisibility = () => {
        setShowOldPassword(!showOldPassword)
    }

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword)
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white/5 backdrop-blur-3xl rounded-xl shadow-2xl overflow-hidden border border-white/30 backdrop-saturate-150">
                <div className="bg-white/5 backdrop-blur-2xl py-4 px-6 border-b border-white/20 backdrop-saturate-150">
                    <h2 className="text-2xl font-bold text-white">Change Password {userName}</h2>
                    <p className="text-white/80">Update your account password</p>
                </div>

                <form onSubmit={handleSetPassword} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-white/90 flex items-center gap-2">
                            <FaEnvelope className="text-white" /> Email
                        </Label>
                        <Input
                            type="email"
                            id="email"
                            value={email}
                            className="bg-white/1 backdrop-blur-xl border-white/20 text-white/60 focus:ring-2 focus:ring-white/30 focus:border-white/30 cursor-not-allowed backdrop-saturate-150"
                            required
                            readOnly
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="oldPassword" className="text-white/90 flex items-center gap-2">
                            <FaLock className="text-white" /> Current Password
                        </Label>
                        <div className="relative">
                            <Input
                                type={showOldPassword ? "text" : "password"}
                                id="oldPassword"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="bg-white/3 backdrop-blur-xl border-white/40 text-white placeholder:text-white/60 focus:ring-2 focus:ring-white/60 focus:border-white/60 backdrop-saturate-150 pr-12"
                            
                                required
                            />
                            <button
                                type="button"
                                onClick={toggleOldPasswordVisibility}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors focus:outline-none"
                            >
                                {showOldPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-white/90 flex items-center gap-2">
                            <FaKey className="text-white" /> New Password
                        </Label>
                        <div className="relative">
                            <Input
                                type={showNewPassword ? "text" : "password"}
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="bg-white/3 backdrop-blur-xl border-white/40 text-white placeholder:text-white/60 focus:ring-2 focus:ring-white/60 focus:border-white/60 backdrop-saturate-150 pr-12"
                                required
                            />
                            <button
                                type="button"
                                onClick={toggleNewPasswordVisibility}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors focus:outline-none"
                            >
                                {showNewPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !email || !oldPassword || !newPassword}
                        className={`w-full mt-6 bg-white/10 backdrop-blur-2xl hover:bg-white/20 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 border border-white/50 hover:border-white/70 backdrop-saturate-150 ${
                            (isLoading || !email || !oldPassword || !newPassword) ? 'opacity-50 cursor-not-allowed hover:bg-white/10' : ''
                        }`}
                    >
                        {isLoading ? 'Updating...' : 'Update Password'} <FaSave />
                    </button>

                    {message && (
                        <div className={`p-3 rounded-lg text-sm backdrop-blur-xl border backdrop-saturate-150 ${
                            message.includes('Failed') ? 'bg-red-500/10 text-red-200 border-red-500/30' : 'bg-white/10 text-white border-white/30'
                        }`}>
                            {message}
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}

export default SetPassword