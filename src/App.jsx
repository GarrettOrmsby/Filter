import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import HomePage from './Frontend/pages/HomePage';
import AlbumsPage from './Frontend/pages/AlbumsPage';
import NavBar from './Frontend/HomePageComponents/NavBar';

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/albums' element={<AlbumsPage />} />
      </Routes>
    </Router>
    
  )
}

export default App
