import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import HomePage from './Frontend/pages/HomePage';
import AlbumsPage from './Frontend/pages/AlbumsPage';
import ReviewPage from './Frontend/pages/ReviewPage';
import ArtistPage from './Frontend/pages/ArtistPage';
import SearchPage from './Frontend/pages/SearchPage';

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/albums' element={<AlbumsPage />} />
        <Route path='/album/:id' element={<ReviewPage />} />
        <Route path='/artist/:id' element={<ArtistPage />} />
        <Route path='/search/:query' element={<SearchPage />} />
      </Routes>
    </Router>
    
  )
}

export default App
