import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Rate from './components/Rate';
import Navbar from './components/navbar';
import DormModal from './components/DormModal';
import ReviewsPage from './components/ReviewsPage';
import FAQ from './components/faq';
import ReviewDorm from './components/ReviewDorm';
import Login from './components/Login';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter basename="/rate-my-housing">
          <Routes>
            <Route path="/" element={<div>Home Page</div>} />
            <Route path="/rate" element={<Rate />} />
            <Route path="/navbar" element={<Navbar />} />
            <Route path="/dorm/:id" element={<DormModal />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/reviewdorm" element={<ReviewDorm />} />
            <Route path="/login" element={<Login />} />
            {/* Catch-all route */}
            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;