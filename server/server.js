const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()
const authRouter = require('./routes/auth-routes')
const chatRouter = require('./routes/chat-routes')
const pdfRouter = require('./routes/pdf-routes')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')

const corsOptions = {
  origin: 'http://localhost:5173',  
  credentials: true,               
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Cache-Control',        
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
};

dotenv.config()
app.use(express.json())
app.use(cors(corsOptions))
app.use(cookieParser());
app.use(morgan('tiny'))

const PORT = process.env.PORT
mongoose.connect(process.env.MONGO_URL,{
}).then(() => console.log('mongodb is connected')).catch((error)=>{
    console.log("failed connecting mongodb", error);
});

app.use('/api/auth', authRouter)
app.use('/api/pdf', pdfRouter)
app.use('/api/chat', chatRouter)

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
})