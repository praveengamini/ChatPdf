const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()
const authRouter = require('./routes/auth-routes')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')

// Updated CORS configuration
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

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
})