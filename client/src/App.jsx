import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/authPages/Login';
import Register from './pages/authPages/Register';
import ForgotPassword from './pages/authPages/ForgotPassword';
import SetPassword from './pages/authPages/SetPassword';
import Home from './pages/chatPages/Home';
import NotFound from './pages/authPages/NotFound';
import CheckAuth from './components/common/CheckAuth';
import AuthOutlet from './components/layout/AuthOutlet'; // Import the new AuthOutlet
import { useSelector } from 'react-redux';
import { Toaster } from 'sonner';
import { checkAuthUser } from './store/auth';
import { useDispatch } from 'react-redux';

const App = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch()
  
  useEffect(()=>{
    dispatch(checkAuthUser())
  },[dispatch])
  
  return (
    <div>
      <CheckAuth isAuthenticated={isAuthenticated} />
      <Routes>
        <Route path="/auth" element={<AuthOutlet />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot" element={<ForgotPassword />} />
          <Route path="setpassword" element={<SetPassword />} />
        </Route>
        
        <Route path="/chat">
          <Route path="home" element={<Home />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <Toaster richColors position="bottom-right" />
    </div>
  );
};

export default App;