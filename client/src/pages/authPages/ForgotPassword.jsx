import React, { useState } from 'react'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../../components/ui/input-otp"
import { FaEnvelope, FaKey, FaArrowRight, FaPaperPlane } from 'react-icons/fa'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { sendOtp } from '../../store/auth'
import { verifyOtp } from '../../store/auth'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import {Button} from '../../components/ui/button'
const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const [sentOtp, setSentOtp] = useState(false)
    const [otp, setOtp] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleSendOtp = async (event) => {
        const formData = {
            email : email,
            otp: '',
            otpsent:false
        }
        event.preventDefault()
        setIsLoading(true)
        try {
          const data=  await  dispatch(sendOtp(formData))
          console.log(data);
          
            setSentOtp(true)
            setMessage(`OTP sent to ${email}`)
        } catch (error) {
            setMessage('Failed to send OTP. Please try again.'+error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerifyOtp = async (event) => {
        event.preventDefault()
        setIsLoading(true)
        const formData = {
          email : email,
          otp: parseInt(otp),
          otpsent:true
      }
        try {
            const data = await dispatch(verifyOtp(formData))
            const payload  = data.payload
            if(payload.success)
            {
                toast('otp enetered is correct')
                setMessage(`${payload.message}. Change it after you logged in`);
            }
            else{
                toast('incorrect otp entered')
            }

           
        } catch (error) {
            setMessage('Invalid OTP. Please try again.'+error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
                <div className="bg-blue-600 py-4 px-6">
                    <h2 className="text-2xl font-bold text-white">Reset Password</h2>
                    <p className="text-blue-100">Enter your email to receive a reset OTP</p>
                </div>

                <form className="p-6 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-300 flex items-center gap-2">
                            <FaEnvelope className="text-blue-400" /> Email
                        </Label>
                        <Input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500 ${sentOtp ? 'pointer-events-none bg-gray-600 text-gray-400' : ''}`}
                            placeholder="your@email.com"
                            required
                            disabled={sentOtp}
                        />
                    </div>

                    {!sentOtp ? (
                        <button
                            type="submit"
                            onClick={handleSendOtp}
                            disabled={isLoading || !email}
                            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${(isLoading || !email) ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Sending...' : 'Send OTP'} <FaPaperPlane />
                        </button>
                    ) : (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-gray-300 flex items-center gap-2">
                                    <FaKey className="text-blue-400" /> Enter OTP
                                </Label>
                                <div className="flex justify-center">
                                    <InputOTP 
                                        maxLength={6} 
                                        onChange={(value) => setOtp(value)}
                                        className="justify-center"
                                    >
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} className="bg-gray-700 border-gray-600 text-white" />
                                            <InputOTPSlot index={1} className="bg-gray-700 border-gray-600 text-white" />
                                            <InputOTPSlot index={2} className="bg-gray-700 border-gray-600 text-white" />
                                        </InputOTPGroup>
                                        <InputOTPSeparator className="text-gray-400" />
                                        <InputOTPGroup>
                                            <InputOTPSlot index={3} className="bg-gray-700 border-gray-600 text-white" />
                                            <InputOTPSlot index={4} className="bg-gray-700 border-gray-600 text-white" />
                                            <InputOTPSlot index={5} className="bg-gray-700 border-gray-600 text-white" />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                            </div>

                            <button
                                type="submit"
                                onClick={handleVerifyOtp}
                                disabled={isLoading || otp.length !== 6}
                                className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${(isLoading || otp.length !== 6) ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? 'Verifying...' : 'Reset Password'} <FaArrowRight />
                            </button>
                        </div>
                    )}

                    {message && (
                        <div className={`p-3 rounded-lg text-sm ${message.includes('failed') || message.includes('Invalid') ? 'bg-red-900 text-red-200' : 'bg-blue-900 text-blue-200'}`}>
                            {message}
                            <br />
                            <Button className='' onClick={()=>{navigate('/auth/login')}}>Login</Button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword