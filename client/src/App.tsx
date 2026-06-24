import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CreateResume from './pages/CreateResume';
import ResumeEditor from './pages/ResumeEditor';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<CreateResume />} />
          <Route path="/editor/:id" element={<ResumeEditor />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
