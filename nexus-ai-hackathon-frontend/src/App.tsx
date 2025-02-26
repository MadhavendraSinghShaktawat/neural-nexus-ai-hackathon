import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/landing-page'
import './App.css'

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
    </Routes>
  )
}

export default App
