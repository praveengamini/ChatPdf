import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const uploadPdf = createAsyncThunk(
  'pdfChat/uploadPdf',
  async ({ file, userId }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);

      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/pdf/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const sendMessageToChat = createAsyncThunk(
  'pdfChat/sendMessageToChat',
  async ({ pdfId, userId, message }, thunkAPI) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/chat/send/${pdfId}/${userId}`, {
        sender: 'user',
        message,
      });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const getUserPdfs = createAsyncThunk(
  'pdfChat/getUserPdfs',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/pdf/user/${userId}`);
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
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/pdf/deletePdf/${pdfId}/`);
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
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/chat/getchat/${pdfId}`);
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
    error: null,
  },
  reducers: {
    resetPdfChat: (state) => {
      state.pdfId = null;
      state.chat = [];
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadPdf.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadPdf.fulfilled, (state, action) => {
        state.loading = false;
        state.pdfId = action.payload.pdfId;
        state.chat = [
          {
            sender: 'system',
            message: `PDF uploaded successfully: ID ${action.payload.pdfId}`,
          },
        ];
      })
      .addCase(uploadPdf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      .addCase(sendMessageToChat.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessageToChat.fulfilled, (state, action) => {
        state.loading = false;
        state.chat = action.payload.messages;
      })
      .addCase(sendMessageToChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      .addCase(getUserPdfs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPdfs.fulfilled, (state, action) => {
        state.loading = false;
        state.userPdfs = action.payload.data || [];
        state.error = null;
      })
      .addCase(getUserPdfs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.userPdfs = [];
      })

      .addCase(deletePdf.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePdf.fulfilled, (state, action) => {
        state.loading = false;
        state.userPdfs = state.userPdfs.filter((pdf) => pdf._id !== action.payload.pdfId);
        if (state.pdfId === action.payload.pdfId) {
          state.pdfId = null;
          state.chat = [];
        }
        state.error = null;
      })
      .addCase(deletePdf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getChatByPdf.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChatByPdf.fulfilled, (state, action) => {
        state.loading = false;
        state.chat = action.payload.chat?.messages || [];
        state.pdfId = action.payload.chat?.pdfId || null;
        state.error = null;
      })
      .addCase(getChatByPdf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.chat = [];
      });
  },
});

export const { resetPdfChat, clearError } = pdfChatSlice.actions;
export default pdfChatSlice.reducer;
