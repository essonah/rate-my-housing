
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Rate from './components/Rate';
import Navbar from './components/navbar';
import DormModal from './components/DormModal';
import ReviewsPage from './components/ReviewsPage';
import FAQ from './components/faq';
import Login from './components/Login';
import Signin from './components/Sign';
import { RouteMatcher } from 'next/dist/server/future/route-matchers/route-matcher';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rate" element={<Rate />} />
            <Route path="/navbar" element={<Navbar />} />
            <Route path="/dorm/:id" element={<DormModal />} />
           <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signin" element={<Signin />} />
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;