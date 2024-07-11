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

import './App.css';
import Navbar from './components/Navbar';

function logout() {
  sessionStorage.clear();
  window.location.reload();
}

export default function App() {
  const { token, setToken } = useToken();

  return (
    <>
      <Navbar isLoggedIn={token ? true : false } logout={logout} />
      <Routes>
        <Route path="/" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<SignUp setToken={setToken} />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
