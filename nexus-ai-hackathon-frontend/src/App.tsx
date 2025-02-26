import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/landing-page'
import { ChatPage } from './pages/chat-page'
import { VideoChatPage } from './pages/video-chat-page'
import './App.css'

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/video-chat" element={<VideoChatPage />} />
    </Routes>
  )
}

export default App
