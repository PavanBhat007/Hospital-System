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
import Profile from './pages/Profile';
import Appointment from './pages/Appointment';
import KnowYourMed from './pages/KnowYourMed';
import Pharmacy from './pages/Pharmacy';
import Donation from './pages/Donation';

import Navbar from './components/Navbar';
import Calendar from './components/Calendar';

import { createClient } from '@supabase/supabase-js'
import  { SessionContextProvider } from '@supabase/auth-helpers-react'

import './App.css';
import AskAI from './components/AskAI';
import Prescription from './pages/Prescription';

const supabase = createClient("https://zgghpphzjtlxthoudljn.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnZ2hwcGh6anRseHRob3VkbGpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA4NTEzODAsImV4cCI6MjAzNjQyNzM4MH0.7kIkJ2URLi6L5mAjQ7Wa-r3ELTsK2XIKFnuRSBEu-KA");

function logout() {
  sessionStorage.clear();
  window.location.reload();
  window.location.href = "/login";
}

export default function App() {
  const { token, setToken } = useToken();
  
  return (
    <SessionContextProvider supabaseClient={supabase}>
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
        {token && <Route path="/donation" element={<Donation user_id={token.user_id} />} />}
        {token && <Route path="/pharmacy" element={<Pharmacy />} />}
        {token && <Route path="/prescription" element={<Prescription />} />}
        
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<SignUp setToken={setToken} />} />
        <Route path="/know-your-med" element={<KnowYourMed />} />
        <Route path="/ask-ai" element={<AskAI />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </SessionContextProvider>
  );
}
