import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CreateResume from './pages/CreateResume';
import ResumeEditor from './pages/ResumeEditor';

const ResumePreviewPage = lazy(() => import('./pages/ResumePreviewPage'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="animate-spin h-8 w-8 border-4 border-brand-600 border-t-transparent rounded-full" />
    </div>
  );
}

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
          <Route
            path="/preview/:id"
            element={
              <Suspense fallback={<PageLoader />}>
                <ResumePreviewPage />
              </Suspense>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
