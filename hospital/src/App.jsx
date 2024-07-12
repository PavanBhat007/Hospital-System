import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";

import useToken from "./hooks/useToken";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import NotFound from "./pages/NotFound";
import About from './pages/About';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import Appointment from './pages/Appointment';

import './App.css';

function logout() {
  sessionStorage.clear();
  window.location.reload();
  window.location.href = "/login";
}

export default function App() {
  const { token, setToken } = useToken();
  
  return (
    <>
      <Navbar 
        isLoggedIn={token ? true : false } 
        logout={logout} 
        username={token ? token.username : ""} 
      />
      <Routes>
        {token && <Route path="/contact" element={<Contact />} />}
        {token && <Route path="/about" element={<About />} />}
        {token && <Route path="/services" element={<Services user_id={token.user_id} />} />}
        {token && <Route path="/profile" element={<Profile user_id={token.user_id} role={token.role} />} />}
        {token && <Route 
                    path="/appointment" 
                    element={
                      token.role === "user"
                      ? <Appointment user_id={token.user_id}/> 
                      : <Navigate to="/profile" />
                    } 
                  />
        }
        
        <Route path="/" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<SignUp setToken={setToken} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
