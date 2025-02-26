import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/landing-page'
import { ChatPage } from './pages/chat-page'
import { VideoChatPage } from './pages/video-chat-page'
import MoodTrackerPage from './pages/mood-tracker-page'
import MoodHistoryPage from './pages/mood-history-page'
import ParentDashboardPage from './pages/parent-dashboard-page'
import './App.css'

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/video-chat" element={<VideoChatPage />} />
      <Route path="/mood-tracker" element={<MoodTrackerPage />} />
      <Route path="/mood-history" element={<MoodHistoryPage />} />
      <Route path="/parent-dashboard" element={<ParentDashboardPage />} />
    </Routes>
  )
}

export default App
