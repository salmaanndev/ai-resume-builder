import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CreateResume from './pages/CreateResume';
import ResumeEditor from './pages/ResumeEditor';

const ResumePreviewPage = lazy(() => import('./pages/ResumePreviewPage'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin h-8 w-8 border-4 border-brand-600 border-t-transparent rounded-full" />
    </div>
  );
}

function AppLayout() {
  const location = useLocation();
  const isPreview = location.pathname.startsWith('/preview/');

  return (
    <div
      className={
        isPreview
          ? 'app-preview-layout h-dvh max-h-dvh overflow-hidden flex flex-col bg-gray-50'
          : 'min-h-screen bg-gray-50'
      }
    >
      <Navbar />
      <main className={isPreview ? 'flex-1 min-h-0 overflow-hidden' : undefined}>
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
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
