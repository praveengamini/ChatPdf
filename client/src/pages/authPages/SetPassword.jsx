import React, { useState } from 'react'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'
import { FaEnvelope, FaLock, FaKey, FaSave } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { changePassword } from '../../store/auth'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
const SetPassword = () => {
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
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

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
                <div className="bg-blue-600 py-4 px-6">
                    <h2 className="text-2xl font-bold text-white">Change Password {userName }</h2>
                    <p className="text-blue-100">Update your account password</p>
                </div>

                <form onSubmit={handleSetPassword} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-300 flex items-center gap-2">
                            <FaEnvelope className="text-blue-400" /> Email
                        </Label>
                        <Input
                            type="email"
                            id="email"
                            value={email}
                            className="bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500 cursor-not-allowed"
                            required
                            readonly
                            
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="oldPassword" className="text-gray-300 flex items-center gap-2">
                            <FaLock className="text-blue-400" /> Current Password
                        </Label>
                        <Input
                            type="password"
                            id="oldPassword"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-gray-300 flex items-center gap-2">
                            <FaKey className="text-blue-400" /> New Password
                        </Label>
                        <Input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !email || !oldPassword || !newPassword}
                        className={`w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                            (isLoading || !email || !oldPassword || !newPassword) ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                        {isLoading ? 'Updating...' : 'Update Password'} <FaSave />
                    </button>

                    {message && (
                        <div className={`p-3 rounded-lg text-sm ${
                            message.includes('Failed') ? 'bg-red-900 text-red-200' : 'bg-blue-900 text-blue-200'
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