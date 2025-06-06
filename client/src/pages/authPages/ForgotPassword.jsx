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
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white/5 backdrop-blur-3xl rounded-xl shadow-2xl overflow-hidden border border-white/30 backdrop-saturate-150">
                <div className="bg-white/5 backdrop-blur-2xl py-4 px-6 border-b border-white/20 backdrop-saturate-150">
                    <h2 className="text-2xl font-bold text-white">Reset Password</h2>
                    <p className="text-white/80">Enter your email to receive a reset OTP</p>
                </div>

                <form className="p-6 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-white/90 flex items-center gap-2">
                            <FaEnvelope className="text-white" /> Email
                        </Label>
                        <Input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`bg-white/3 backdrop-blur-xl border-white/40 text-white placeholder:text-white/60 focus:ring-2 focus:ring-white/60 focus:border-white/60 backdrop-saturate-150 ${sentOtp ? 'pointer-events-none bg-white/1 text-white/50 border-white/20' : ''}`}
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
                            className={`w-full bg-white/10 backdrop-blur-2xl hover:bg-white/20 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 border border-white/50 hover:border-white/70 backdrop-saturate-150 ${(isLoading || !email) ? 'opacity-50 cursor-not-allowed hover:bg-white/10' : ''}`}
                        >
                            {isLoading ? 'Sending...' : 'Send OTP'} <FaPaperPlane />
                        </button>
                    ) : (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-white/90 flex items-center gap-2">
                                    <FaKey className="text-white" /> Enter OTP
                                </Label>
                                <div className="flex justify-center">
                                    <InputOTP 
                                        maxLength={6} 
                                        onChange={(value) => setOtp(value)}
                                        className="justify-center"
                                    >
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} className="bg-white/3 backdrop-blur-xl border-white/40 text-white backdrop-saturate-150" />
                                            <InputOTPSlot index={1} className="bg-white/3 backdrop-blur-xl border-white/40 text-white backdrop-saturate-150" />
                                            <InputOTPSlot index={2} className="bg-white/3 backdrop-blur-xl border-white/40 text-white backdrop-saturate-150" />
                                        </InputOTPGroup>
                                        <InputOTPSeparator className="text-white/60" />
                                        <InputOTPGroup>
                                            <InputOTPSlot index={3} className="bg-white/3 backdrop-blur-xl border-white/40 text-white backdrop-saturate-150" />
                                            <InputOTPSlot index={4} className="bg-white/3 backdrop-blur-xl border-white/40 text-white backdrop-saturate-150" />
                                            <InputOTPSlot index={5} className="bg-white/3 backdrop-blur-xl border-white/40 text-white backdrop-saturate-150" />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                            </div>

                            <button
                                type="submit"
                                onClick={handleVerifyOtp}
                                disabled={isLoading || otp.length !== 6}
                                className={`w-full bg-white/10 backdrop-blur-2xl hover:bg-white/20 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 border border-white/50 hover:border-white/70 backdrop-saturate-150 ${(isLoading || otp.length !== 6) ? 'opacity-50 cursor-not-allowed hover:bg-white/10' : ''}`}
                            >
                                {isLoading ? 'Verifying...' : 'Reset Password'} <FaArrowRight />
                            </button>
                        </div>
                    )}

                    {message && (
                        <div className={`p-3 rounded-lg text-sm backdrop-blur-xl border backdrop-saturate-150 ${message.includes('failed') || message.includes('Invalid') ? 'bg-red-500/10 text-red-200 border-red-500/30' : 'bg-white/10 text-white border-white/30'}`}>
                            {message}
                            <br />
                            <Button 
                                className='mt-2 bg-white/20 backdrop-blur-xl hover:bg-white/30 text-white border border-white/40 hover:border-white/60 backdrop-saturate-150' 
                                onClick={()=>{navigate('/auth/login')}}
                            >
                                Login
                            </Button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword