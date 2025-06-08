// redux/pdfChatSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Async thunk to upload PDF
export const uploadPdf = createAsyncThunk(
  'pdfChat/uploadPdf',
  async ({ file, userId }, thunkAPI) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', userId)

      const res = await axios.post('http://localhost:5000/api/pdf/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      return res.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: error.message })
    }
  }
)
// Async thunk to send message
export const sendMessageToChat = createAsyncThunk(
  'pdfChat/sendMessageToChat',
  async ({ pdfId, userId, message }, thunkAPI) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/chat/send/${pdfId}/${userId}`, {
        sender: 'user',
        message,
      })
      return res.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: error.message })
    }
  }
)

// Async thunk to get user PDFs
export const getUserPdfs = createAsyncThunk(
  'pdfChat/getUserPdfs',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/pdf/user/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch PDFs');
    }
  }
);
export const deletePdf = createAsyncThunk(
  'pdfChat/deletePdf',
  async (pdfId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/pdf/deletePdf/${pdfId}/`);
      return { pdfId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete PDF');
    }
  }
);
export const getChatByPdf = createAsyncThunk(
  'pdfChat/getChatByPdf',
  async (pdfId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/chat/getchat/${pdfId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch chat');
    }
  }
);
const pdfChatSlice = createSlice({
  name: 'pdfChat',
  initialState: {
    pdfId: null,
    chat: [],
    userPdfs: [],
    loading: false,
    error: null
  },
  reducers: {
    resetPdfChat: (state) => {
      state.pdfId = null
      state.chat = []
      state.loading = false
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // PDF Upload
      .addCase(uploadPdf.pending, (state) => {
        state.loading = true
      })
      .addCase(uploadPdf.fulfilled, (state, action) => {
        state.loading = false
        state.pdfId = action.payload.pdfId
        state.chat = [{
          sender: 'system',
          message: `PDF uploaded successfully: ID ${action.payload.pdfId}`
        }]
      })
      .addCase(uploadPdf.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.message
      })

      // Sending chat message
      .addCase(sendMessageToChat.pending, (state) => {
        state.loading = true
      })
      .addCase(sendMessageToChat.fulfilled, (state, action) => {
        state.loading = false
        state.chat = action.payload.messages
      })
      .addCase(sendMessageToChat.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.message
      })

      // Get user PDFs
      .addCase(getUserPdfs.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getUserPdfs.fulfilled, (state, action) => {
        console.log('getUserPdfs fulfilled:', action.payload)
        state.loading = false
        state.userPdfs = action.payload.data || []
        state.error = null
      })
      .addCase(getUserPdfs.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.userPdfs = []
      }).addCase(deletePdf.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deletePdf.fulfilled, (state, action) => {
        state.loading = false
        // Remove the deleted PDF from userPdfs array
        state.userPdfs = state.userPdfs.filter(pdf => pdf._id !== action.payload.pdfId)
        // If the deleted PDF was the current one, reset the chat
        if (state.pdfId === action.payload.pdfId) {
          state.pdfId = null
          state.chat = []
        }
        state.error = null
      })
      .addCase(deletePdf.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })  .addCase(getChatByPdf.pending, (state) => {
        state.loading = true
        state.error = null
      })
     .addCase(getChatByPdf.fulfilled, (state, action) => {
      state.loading = false
      state.chat = action.payload.chat?.messages || []
      // Make sure to set the pdfId from the response
      state.pdfId = action.payload.chat?.pdfId || null
      state.error = null
    })
      .addCase(getChatByPdf.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.chat = []
      })
  }
})

export const { resetPdfChat, clearError } = pdfChatSlice.actions
export default pdfChatSlice.reducer 