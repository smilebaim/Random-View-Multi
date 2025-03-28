
import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import Navbar from "@/components/Navbar"
import Home from "@/pages/Home"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import Dashboard from "@/pages/Dashboard"
import RandomWebsite from "@/pages/RandomWebsite"
import { useAuth } from "@/hooks/useAuth"

export default function App() {
  const { isAuthenticated, isAdmin } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/random" element={<RandomWebsite />} />
          <Route 
            path="/login" 
            element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/register" 
            element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
          />
        </Routes>
      </AnimatePresence>
    </div>
  )
}
