import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'

const initialData = {
  user: null,
  isAuthenticated: false,
  isLoading: false
}

export const register = createAsyncThunk(
  '/auth/register',
  async (formData) => {
    const response = await axios.post("https://chatpdf-backend-5fv2.onrender.com/api/auth/register", formData, {
      withCredentials: true
    })
    
    return response.data
  }   
)

export const login = createAsyncThunk(
  '/auth/login',
  async (formData) => {
    const response = await axios.post(
      "https://chatpdf-backend-5fv2.onrender.com/api/auth/login",
      formData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

export const logoutUser = createAsyncThunk(
  "/auth/logout",
  async (_, { dispatch }) => {
    const response = await axios.post(
      "https://chatpdf-backend-5fv2.onrender.com/api/auth/logout", 
      {},
      { withCredentials: true }
    );
    
    // Clear PDF chat data on logout
    dispatch({ type: 'pdfChat/resetPdfChat' });
    
    return response.data;
  }
);

export const checkAuthUser = createAsyncThunk(
  "/auth/checkauth",
  async () => {
    const response = await axios.get(
      "https://chatpdf-backend-5fv2.onrender.com/api/auth/check-auth",
      {
        withCredentials: true,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );

    return response.data;
  }
);

export const changePassword = createAsyncThunk(
  '/auth/changePassword',
  async (formData) => {
    const response = await axios.post('https://chatpdf-backend-5fv2.onrender.com/api/auth/setnewpassword', formData)
    console.log(response.data.payload);
    
    return response.data
  }
)

export const sendOtp = createAsyncThunk(
  '/api/hadlesendotp', 
  async (formData) => {
    const response = await axios.post('https://chatpdf-backend-5fv2.onrender.com/api/auth/forgotpassword', formData)
    console.log(response.data);
    return response.data
  }
)

export const verifyOtp = createAsyncThunk(
  '/verify/otp', 
  async (formData) => {
    const response = await axios.post('https://chatpdf-backend-5fv2.onrender.com/api/auth/forgotpassword', formData)
    console.log(response.data);
    return response.data
  }
) 

const authSlice = createSlice({
  name: "auth",
  initialState: initialData,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isLoading = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isAuthenticated = false;
        state.user = action.payload.user;
        state.isLoading = false;
      })

      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isLoading = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log(action);

        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuthUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuthUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;