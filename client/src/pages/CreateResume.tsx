import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PenLine, Sparkles, ArrowLeft, FileText } from 'lucide-react';
import { resumeApi } from '../api';

export default function CreateResume() {
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);

  const handleManual = async () => {
    setCreating(true);
    try {
      const { data } = await resumeApi.create({ title: 'Untitled Resume' });
      navigate(`/editor/${data._id}`);
    } catch {
      alert('Failed to create resume');
      setCreating(false);
    }
  };

  const handleAI = () => {
    navigate('/editor/new?mode=ai');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="text-center mb-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 mx-auto mb-4">
          <FileText className="h-7 w-7 text-brand-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">How would you like to build your resume?</h1>
        <p className="mt-2 text-gray-600">Choose the approach that works best for you</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <button
          type="button"
          onClick={handleManual}
          disabled={creating}
          className="group text-left p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-brand-400 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-60"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 group-hover:bg-brand-100 transition-colors mb-4">
            <PenLine className="h-6 w-6 text-gray-600 group-hover:text-brand-600 transition-colors" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Build Manually</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Start with a blank resume and fill in your details section by section at your own pace.
          </p>
          <span className="inline-block mt-4 text-sm font-medium text-brand-600 group-hover:text-brand-700">
            {creating ? 'Creating...' : 'Start from scratch →'}
          </span>
        </button>

        <button
          type="button"
          onClick={handleAI}
          disabled={creating}
          className="group text-left p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-brand-400 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-60"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 group-hover:bg-brand-100 transition-colors mb-4">
            <Sparkles className="h-6 w-6 text-brand-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Build with AI</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Enter your target job title and let AI generate a complete professional resume for you.
          </p>
          <span className="inline-block mt-4 text-sm font-medium text-brand-600 group-hover:text-brand-700">
            Generate with AI →
          </span>
        </button>
      </div>
    </div>
  );
}
