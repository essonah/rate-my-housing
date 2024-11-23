import React from 'react';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import FAQ from './components/faq';
import Testimonials from './components/Testimonials';

function App() {
  return (
    <div className='App'>
      <header className='header'></header>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/testimonials" element={<Testimonials />} />
       
      </Routes>
      </BrowserRouter>
     
    </div>
  );
}
export default App;