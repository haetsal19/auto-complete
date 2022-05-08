import React from 'react';
import './App.css';
import Home from './routes/Home';
import About from './routes/About';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about/:id" element={<About />} />
    </Routes>
  );
}

export default App;