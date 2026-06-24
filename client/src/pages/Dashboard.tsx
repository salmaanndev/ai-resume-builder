import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, Trash2, Clock } from 'lucide-react';
import { resumeApi } from '../api';
import { Resume } from '../types';
import Button from '../components/Button';

export default function Dashboard() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const { data } = await resumeApi.getAll();
      setResumes(data);
    } catch {
      setResumes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this resume?')) return;
    setDeleting(id);
    try {
      await resumeApi.delete(id);
      setResumes((prev) => prev.filter((r) => r._id !== id));
    } catch {
      alert('Failed to delete resume');
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Resumes</h1>
          <p className="text-gray-600 mt-1">Create and manage your AI-powered resumes</p>
        </div>
        <Link to="/create">
          <Button>
            <Plus className="h-4 w-4" />
            New Resume
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : resumes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes yet</h3>
          <p className="text-gray-600 mb-6">Build manually or let AI generate one for you</p>
          <Link to="/create">
            <Button>
              <Plus className="h-4 w-4" />
              Create Resume
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <div
              key={resume._id}
              className="group bg-white rounded-xl border border-gray-200 p-6 hover:border-brand-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100">
                  <FileText className="h-5 w-5 text-brand-600" />
                </div>
                <button
                  onClick={() => resume._id && handleDelete(resume._id)}
                  disabled={deleting === resume._id}
                  className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <Link to={`/editor/${resume._id}`}>
                <h3 className="font-semibold text-gray-900 hover:text-brand-600 transition-colors">
                  {resume.title}
                </h3>
              </Link>
              <p className="text-sm text-gray-500 mt-1">
                {resume.personalInfo.fullName || 'No name set'}
              </p>
              <div className="flex items-center gap-1 mt-3 text-xs text-gray-400">
                <Clock className="h-3 w-3" />
                Updated {formatDate(resume.updatedAt)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
