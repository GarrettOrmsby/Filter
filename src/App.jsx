import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import HomePage from './Frontend/pages/HomePage';
import AlbumsPage from './Frontend/pages/AlbumsPage';
import ReviewPage from './Frontend/pages/ReviewPage';

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/albums' element={<AlbumsPage />} />
        <Route path='/album/:id' element={<ReviewPage />} />
      </Routes>
    </Router>
    
  )
}

export default App
