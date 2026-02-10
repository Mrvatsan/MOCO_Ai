import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ReportPage from './pages/ReportPage';
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0f172a]">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/report/:id" element={<ReportPage />} />
          {/* Dashboard and Report routes will be added later */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
