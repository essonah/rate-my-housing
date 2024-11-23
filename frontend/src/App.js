import React from 'react';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import FAQ from './components/faq';
import Testimonials from './components/Testimonials';
import ReviewsPage from './components/ReviewsPage';
import Navbar from './components/navbar';
import Rate from './components/Rate';
import DormModal from './components/DormModal';
import ReviewDorm from './components/ReviewDorm';
import Login from './components/Login';

function App() {
  return (
    <div className='App'>
      <header className='header'></header>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rate" element={<Rate />} />
        <Route path ="/navbar" element={<Navbar />} />
        <Route path= "/dorm:id" element={<DormModal />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path ="/reviews" element={<ReviewsPage />} />
        <Route path ="reviewdorm" element={<ReviewDorm />} />
        <Route path = "/login" element={<Login />} />
       
      </Routes>
      </BrowserRouter>
     
    </div>
  );
}
export default App;