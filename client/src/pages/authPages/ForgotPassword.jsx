import React, { useState } from 'react'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../../components/ui/input-otp"
import { FaEnvelope, FaKey, FaArrowRight, FaPaperPlane, FaLock, FaEye, FaEyeSlash, FaCopy, FaCheck } from 'react-icons/fa'
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
    const [otpVerified, setOtpVerified] = useState(false)
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [generatedPassword, setGeneratedPassword] = useState('') // Store the generated password
    const [copied, setCopied] = useState(false)
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
        setMessage('') 
        
        try {
            const data = await dispatch(sendOtp(formData))
            const payload = data.payload
            
            if (payload.success) {
                setSentOtp(true)
                setMessage(`OTP sent to ${email}`)
                toast.success('OTP sent successfully!')
            } else {
                setMessage(payload.message || 'Failed to send OTP. Please check your email and try again.')
                toast.error(payload.message || 'Failed to send OTP')
            }
        } catch (error) {
            console.error('Error sending OTP:', error)
            setMessage('Failed to send OTP. Please try again.')
            toast.error('Failed to send OTP')
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerifyOtp = async (event) => {
        event.preventDefault()
        setIsLoading(true)
        setMessage('') 
        
        const formData = {
          email : email,
          otp: parseInt(otp),
          otpsent:true
        }
        
        try {
            const data = await dispatch(verifyOtp(formData))
            const payload = data.payload
            
            if(payload.success) {
                toast.success('OTP verified successfully!')
                setOtpVerified(true)
                const newPass =  payload.password 
                setGeneratedPassword(newPass)
                setMessage(payload.message || 'OTP verified! Your new password has been generated.')
            } else {
                toast.error(payload.message || 'Incorrect OTP')
                setMessage(payload.message || 'Invalid OTP. Please try again.')
            }
        } catch (error) {
            console.error('Error verifying OTP:', error)
            setMessage('Invalid OTP. Please try again.')
            toast.error('Failed to verify OTP')
        } finally {
            setIsLoading(false)
        }
    }

    const handleCopyPassword = async () => {
        try {
            await navigator.clipboard.writeText(generatedPassword)
            setCopied(true)
            toast.success('Password copied to clipboard!')
            setTimeout(() => setCopied(false), 2000) 
        } catch (error) {
            console.error('Failed to copy password:', error)
            toast.error('Failed to copy password')
        }
    }

    const handleResetPassword = async (event) => {
        event.preventDefault()
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match!')
            return
        }
        if (newPassword.length < 6) {
            setMessage('Password must be at least 6 characters long!')
            return
        }
        
        setIsLoading(true)
        try {
            toast.success('Password reset successfully!')
            setMessage('Password reset successfully! You can now login with your new password.')
        } catch (error) {
            setMessage('Failed to reset password. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword)
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    const handleBackToEmail = () => {
        setSentOtp(false)
        setOtp('')
        setMessage('')
        setGeneratedPassword('')
        setCopied(false)
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white/5 backdrop-blur-3xl rounded-xl shadow-2xl overflow-hidden border border-white/30 backdrop-saturate-150">
                <div className="bg-white/5 backdrop-blur-2xl py-4 px-6 border-b border-white/20 backdrop-saturate-150">
                    <h2 className="text-2xl font-bold text-white">Reset Password</h2>
                    <p className="text-white/80">
                        {!sentOtp ? 'Enter your email to receive a reset OTP' : 
                         !otpVerified ? 'Enter the OTP sent to your email' : 
                         'Your new password has been generated'}
                    </p>
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
                    ) : !otpVerified ? (
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
                                {isLoading ? 'Verifying...' : 'Verify OTP'} <FaArrowRight />
                            </button>

                            <button
                                type="button"
                                onClick={handleBackToEmail}
                                className="w-full bg-transparent hover:bg-white/5 text-white/70 py-2 px-4 rounded-lg font-medium transition-all duration-300 border border-white/30 hover:border-white/50"
                            >
                                Back to Email
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-400/40 backdrop-blur-xl backdrop-saturate-150 shadow-lg">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-green-500/20 backdrop-blur-xl flex items-center justify-center border border-green-400/30">
                                        <FaLock className="text-green-300 text-lg" />
                                    </div>
                                    <div>
                                        <h3 className="text-green-200 font-semibold text-lg">New Password Generated!</h3>
                                        <p className="text-green-300/80 text-sm">Copy and save your new password</p>
                                    </div>
                                </div>
                                
                                <div className="bg-black/30 backdrop-blur-xl rounded-lg p-4 border border-green-400/20">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex-1">
                                            <Label className="text-green-300/90 text-sm font-medium mb-2 block">Your New Password:</Label>
                                            <div className="bg-white/5 backdrop-blur-xl rounded-lg p-3 border border-white/20 font-mono text-white text-lg tracking-wider break-all">
                                                {generatedPassword}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <button
                                        type="button"
                                        onClick={handleCopyPassword}
                                        className="w-full mt-4 bg-green-500/20 hover:bg-green-500/30 text-green-200 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 border border-green-400/40 hover:border-green-400/60 backdrop-blur-xl backdrop-saturate-150"
                                    >
                                        {copied ? (
                                            <>
                                                <FaCheck className="text-green-300" />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <FaCopy className="text-green-300" />
                                                Copy Password
                                            </>
                                        )}
                                    </button>
                                </div>
                                
                                <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-400/30 backdrop-blur-xl">
                                    <p className="text-amber-200 text-sm flex items-start gap-2">
                                        <span className="text-amber-400 mt-0.5">⚠️</span>
                                        <span>Please save this password securely. You can change it after logging in.</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {message && !otpVerified && (
                        <div className={`p-3 rounded-lg text-sm backdrop-blur-xl border backdrop-saturate-150 ${
                            message.includes('Failed') || 
                            message.includes('Invalid') || 
                            message.includes('do not match') || 
                            message.includes('must be') ||
                            message.includes("haven't created") ||
                            message.includes('expired') ||
                            message.includes('Incorrect') 
                                ? 'bg-red-500/10 text-red-200 border-red-500/30' 
                                : 'bg-white/10 text-white border-white/30'
                        }`}>
                            {message}
                        </div>
                    )}

                    {otpVerified && (
                        <div className="space-y-3">
                            <Button 
                                className='w-full bg-white/20 backdrop-blur-xl hover:bg-white/30 text-white border border-white/40 hover:border-white/60 backdrop-saturate-150 py-3 text-base font-medium flex items-center justify-center gap-2' 
                                onClick={()=>{navigate('/auth/login')}}
                            >
                                <FaArrowRight />
                                Continue to Login
                            </Button>
                            
                            <button
                                type="button"
                                onClick={handleBackToEmail}
                                className="w-full bg-transparent hover:bg-white/5 text-white/70 py-2 px-4 rounded-lg font-medium transition-all duration-300 border border-white/30 hover:border-white/50"
                            >
                                Reset Another Password
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword