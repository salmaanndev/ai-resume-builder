import { Link } from 'react-router-dom';
import { FileText, LayoutDashboard } from 'lucide-react';
import Button from './Button';

export default function Navbar() {
  return (
    <nav className="app-navbar border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">AI-Resume Builder</span>
          </Link>

          <Link to="/dashboard">
            <Button variant="secondary" size="sm">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
