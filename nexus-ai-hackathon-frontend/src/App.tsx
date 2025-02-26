import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/landing-page'
import { ChatPage } from './pages/chat-page'
import './App.css'

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  )
}

export default App
