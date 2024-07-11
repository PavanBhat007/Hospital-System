import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import useToken from "./hooks/useToken";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Services from "./pages/Services";
import NotFound from "./pages/NotFound";

function App() {
  const { token, setToken } = useToken();

  return (
    <div className="wrapper">
      <h1>Application</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={token ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/signup" element={<SignUp setToken={setToken} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/services" element={<Services />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
