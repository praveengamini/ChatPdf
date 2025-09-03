# 📄 ChatPDF

> **Intelligent PDF Chat Assistant** - Transform your documents into interactive conversations using AI

ChatPDF is a cutting-edge full-stack application that revolutionizes how you interact with PDF documents. Upload any PDF and start having intelligent conversations with your content using advanced AI technology.

[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.8%2B-blue)](https://python.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)

## ✨ Features

- 🔍 **Semantic Search** - Find relevant information across your entire document
- 💬 **Natural Language Queries** - Ask questions in plain English
- 🔐 **Secure Authentication** - JWT-based user authentication with OTP verification
- ⚡ **Real-time Chat** - Instant responses with context-aware answers
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🎯 **Context Preservation** - Maintains conversation context for follow-up questions
- 📊 **Multiple PDF Support** - Upload and chat with multiple documents

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │    │  Express Server │    │ FastAPI Service │
│   (Port 5173)   │◄──►│   (Port 5000)   │◄──►│   (Port 8000)   │
│                 │    │                 │    │                 │
│ • UI/UX         │    │ • Authentication│    │ • PDF Processing│
│ • State Mgmt    │    │ • File Upload   │    │ • AI/ML Models  │
│ • API Calls     │    │ • Database      │    │ • Vector Search │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   MongoDB       │
                    │   Database      │
                    └─────────────────┘
```

## 📁 Project Structure

```
ChatPDF/
├── 📁 client/                    # Frontend Application
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/              # Application pages
│   │   ├── store/              # Redux store configuration
│   ├── package.json
│   └── vite.config.js
│
├── 📁 server/                   # Backend API
│   ├── controllers/            # Route handlers
│   ├── models/                # Database models
│   ├── routes/                # API routes
│   ├── utils/                 # Utility functions
│   └── package.json
│
└── 📁 PythonMicroService/       # AI/ML Microservice
    ├── model.py               # FastAPI application
    ├── requirements.txt       # Python dependencies
    ├── chroma_db/          # ChromDb vector storage
    └── .env               # Python service environment variables
```

## 🛠️ Tech Stack

### Frontend
- **⚛️ React 19** - Modern UI library with latest features
- **⚡ Vite** - Lightning-fast build tool
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **🔄 Redux Toolkit** - Predictable state management
- **💾 Redux Persist** - State persistence
- **🎭 Radix UI** - Accessible component primitives
- **🎯 React Icons** - Beautiful icon library

### Backend
- **🟢 Node.js & Express.js** - Server runtime and framework
- **🍃 MongoDB & Mongoose** - Database and ODM
- **🔐 JWT Authentication** - Secure token-based auth
- **📁 Multer** - File upload handling
- **📧 Nodemailer** - Email service for OTP
- **📄 PDF Processing** - `pdf-lib` and `pdf-parse`

### AI/ML Microservice
- **🚀 FastAPI** - High-performance Python web framework
- **🦜 LangChain** - LLM application framework
- **🤖 Google Gemini AI** - Advanced language model for document analysis
- **🔍 FAISS/ChromaDB** - Efficient similarity search and vector storage
- **📊 Sentence Transformers** - Semantic text embeddings
- **✅ Pydantic** - Data validation and serialization

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **MongoDB** (local or cloud instance)
- **Google AI API Key** (for Gemini integration)
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/praveengamini/ChatPDF.git
cd ChatPDF
```

### 2. Environment Setup

#### Backend Server (.env in `server/` directory)

Create a `.env` file in the `server/` directory:

```env
# Database
MONGO_URL=mongodb://localhost:27017/chatpdf
# or use MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/chatpdf

# Server Configuration
PORT=5000
JWT_SECRET_KEY=your_super_secret_jwt_key_here

# Email Configuration (for OTP)
FROM_OTP_SENDING_MAIL=your-email@gmail.com
OTP_MAIL_PASS=your_app_password_here

# Python Microservice URL
IP_PY_MICRO=http://localhost:8000
# For remote deployment: IP_PY_MICRO=http://your-server-ip:8000
```

#### Python Microservice (.env in `PythonMicroService/` directory)

Create a `.env` file in the `PythonMicroService/` directory:

```env
# Server Configuration
PORT=8000

# Google AI Configuration
GEMINI_API_KEY=your_google_gemini_api_key_here

# Optional: Additional AI Service Configuration
# OPENAI_API_KEY=your_openai_key_here
# HUGGINGFACE_API_TOKEN=your_hf_token_here
```

### 3. Get Your API Keys

#### Google Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key and add it to your `.env` file

#### Email Configuration (for OTP)
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in `OTP_MAIL_PASS`

### 4. Install Dependencies

#### Frontend
```bash
cd client
npm install
```

#### Backend
```bash
cd ../server
npm install
```

#### Python Microservice
```bash
cd ../PythonMicroService
pip install -r requirements.txt
```

### 5. Start the Application

Open **three terminal windows** and run:

#### Terminal 1 - Frontend
```bash
cd client
npm run dev
```
🌐 Frontend runs at: http://localhost:5173

#### Terminal 2 - Backend
```bash
cd server
npm run dev
```
🔧 Backend runs at: http://localhost:5000

#### Terminal 3 - AI Microservice
```bash
cd PythonMicroService
python -m uvicorn model:app --host 0.0.0.0 --port 8000 --reload
```
🤖 AI Service runs at: http://localhost:8000
📚 API docs at: http://localhost:8000/docs

## 📖 Usage

1. **Sign Up/Login** - Create an account or log in with existing credentials
2. **Upload PDF** - Click the upload button and select your PDF document
3. **Start Chatting** - Ask questions about your document in natural language
4. **Get Answers** - Receive contextual answers based on your PDF content powered by Google Gemini AI

### Example Queries

- "What is the main topic of this document?"
- "Summarize the key findings in chapter 3"
- "What are the conclusions mentioned in the research?"
- "Find all mentions of 'artificial intelligence'"
- "Compare the data in tables 1 and 2"
- "Extract all the important dates mentioned"

## 🔧 Configuration Notes

### Environment Variables Explanation

#### Server Environment
- `MONGO_URL`: Your MongoDB connection string
- `JWT_SECRET_KEY`: Secret key for JWT token generation (use a strong, random string)
- `FROM_OTP_SENDING_MAIL`: Gmail address for sending OTP emails
- `OTP_MAIL_PASS`: Gmail App Password (not your regular password)
- `IP_PY_MICRO`: URL where Python microservice is running

#### Python Microservice Environment
- `PORT`: Port for the FastAPI service (default: 8000)
- `GEMINI_API_KEY`: Your Google Gemini AI API key for document processing and chat

### Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use strong JWT secrets** (at least 32 characters)
3. **Rotate API keys** regularly
4. **Use App Passwords** for Gmail, not your account password
5. **Set proper CORS origins** in production


## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string format
   - Verify network access for MongoDB Atlas

2. **Python Service Not Starting**
   - Check if port 8000 is available
   - Verify Python dependencies are installed
   - Ensure GEMINI_API_KEY is valid

3. **OTP Email Not Sending**
   - Verify Gmail App Password
   - Check if 2FA is enabled
   - Ensure "Less secure app access" is disabled (use App Password instead)

4. **PDF Processing Errors**
   - Check file size limits
   - Verify PDF is not password protected
   - Ensure sufficient disk space for ChromaDB

## 🤝 Contributing

Welcoming contributions! Please check out our contributing guidelines and feel free to submit issues or pull requests.

## 📞 Support

If you encounter any issues or have questions:

- 📧 **Email**: praveengamini009@gmail.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/praveengamini/ChatPDF/issues)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Built with ❤️ using React, Node.js, FastAPI, and Google Gemini AI

</div>
