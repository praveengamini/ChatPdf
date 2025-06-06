const User = require('../models/User')
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer')
const registerUser = async(req,res)=>{
    const {userName,email,password} = req.body;
    
    try{
      const check = await User.findOne({ email });        
        if (check) {
            return res.json({
                success: false,
                message: "User already exists!"
            });
        }
        else{
              const newUser =new User( {
                    name: userName,
                    email:email,
                    password:password
                })
                await newUser.save()
                return res.status(200).json({
                    success:true,
                    message:"successfully registered"
                })
        }
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"some error occured"
        })
    }
}

const loginUser = async(req,res)=>{
     const {userName,email,password} = req.body;
    
    try{
      const checkUser = await User.findOne({ email });        
        if (checkUser) {
            if(checkUser.password === password)
          {
                const token = jwt.sign(
                {
                        id: checkUser._id,
                        email: checkUser.email,
                        userName: checkUser.name,
                },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: "60m" }
                );

                res.cookie("token", token, { httpOnly: true, secure: false }).json({
                success: true,
                message: "Logged in successfully",
                user: {
                    id: checkUser._id,
                    email: checkUser.email,                    
                    userName: checkUser.name,
                },
                });
            }   
            else{
                return res.json({
                    success:false,
                    message:"Invalid Password. Try again!"
                })
            }
           
        }
        else{
               return res.json({
                success: false,
                message: "user Doesn't  exists!"
            });
        }
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"some error occured"
        })
    }
}

const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully!",
  });
};

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorised user!"
    });
  }
};
    
const forgotPassword = async (req, res) => {
  const { email, otp, otpsent } = req.body;
  console.log(email+" "+ typeof(otp)+" "+ otpsent);
  

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "You haven't created an account. Please sign up first.",
      });
    }

    if (!otpsent) {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000);
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

      await User.updateOne(
        { email },
        { $set: { otp: generatedOtp, otpExpiresAt } }
      );

      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.FROM_OTP_SENDING_MAIL,
          pass: process.env.OTP_MAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.FROM_OTP_SENDING_MAIL,
        to: email,
        subject: 'OTP for Password Reset',
        text: `Your 6-digit OTP is: ${generatedOtp}\nDo not share this OTP with anyone.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ success: false, message: "Failed to send OTP email." });
        } else {
          console.log('Email sent: ' + info.response);
          return res.json({
            success: true,
            message: "OTP sent successfully.",
          });
        }
      });

    } else {
      if (!user.otp) {
        return res.json({ success: false, message: "No OTP found. Please request again." });
      }

      const now = new Date();
      if (now > user.otpExpiresAt) {
        return res.json({ success: false, message: "OTP has expired. Please request a new one." });
      }

      if (user.otp === parseInt(otp)) {
        const generateNewPassword = Math.floor(100000 + Math.random() * 900000);
         await User.updateOne(
          { email },
          { $set: { password: generateNewPassword } }
        );

        return res.json({
          success: true,
          message: "OTP verified.Copy your new password is : "+generateNewPassword,
        });
      } else {
        return res.json({ success: false, message: "Incorrect OTP. Please try again." });
      }
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

const setnewpassword = async(req,res)=>{
  const { email, password,newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.json("usernotfound");
    }
    if(password===user.password)
    {
        await User.updateOne({ email }, { $set: { password: newPassword } });    
        res.json({
            success:true,
            message:"your password has been changed"
        });

    }
    else{
        res.json({
            success:false,
            message:"you're old password is incorrect"
        })
    }
  } catch (error) {
    console.error("Error updating password:", error);
    res.json({
        success:false,
        message:"error"
    });
  }
}

module.exports = {registerUser,loginUser,logoutUser,authMiddleware,setnewpassword,forgotPassword}