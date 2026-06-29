import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import { resumeApi } from '../api';
import { DEFAULT_RESUME_FONT, ResumeFont } from '../constants/resumeFonts';
import { DEFAULT_RESUME_FONT_SIZE, ResumeFontSize } from '../constants/resumeFontSizes';
import { Resume } from '../types';
import Button from '../components/Button';
import ResumeFontPicker from '../components/ResumeFontPicker';
import ResumeFontSizePicker from '../components/ResumeFontSizePicker';
import ResumePdfDownloadButton from '../components/pdf/ResumePdfDownloadButton';
import ResumePdfViewer from '../components/pdf/ResumePdfViewer';

export default function ResumePreviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingStyles, setSavingStyles] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate('/dashboard');
      return;
    }

    const loadResume = async () => {
      try {
        const { data } = await resumeApi.getOne(id);
        setResume({
          ...data,
          fontFamily: data.fontFamily || DEFAULT_RESUME_FONT,
          fontSize: data.fontSize || DEFAULT_RESUME_FONT_SIZE,
        });
      } catch {
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadResume();
  }, [id, navigate]);

  const saveResumeField = useCallback(
    async <K extends 'fontFamily' | 'fontSize'>(key: K, value: Resume[K]) => {
      if (!resume || !id) return;

      const previous = resume[key];
      setResume((prev) => (prev ? { ...prev, [key]: value } : prev));
      setSavingStyles(true);

      try {
        await resumeApi.update(id, { ...resume, [key]: value });
      } catch {
        setResume((prev) => (prev ? { ...prev, [key]: previous } : prev));
        alert(`Failed to save ${key === 'fontFamily' ? 'font' : 'font size'} change`);
      } finally {
        setSavingStyles(false);
      }
    },
    [resume, id]
  );

  const handleFontChange = useCallback(
    (fontFamily: ResumeFont) => saveResumeField('fontFamily', fontFamily),
    [saveResumeField]
  );

  const handleFontSizeChange = useCallback(
    (fontSize: ResumeFontSize) => saveResumeField('fontSize', fontSize),
    [saveResumeField]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin h-8 w-8 border-4 border-brand-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!resume) return null;

  return (
    <div className="resume-pdf-page min-h-[calc(100vh-4rem)] flex flex-col bg-gray-100">
      <div className="resume-pdf-toolbar bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0 gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => navigate(`/editor/${id}`)}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 shrink-0"
            aria-label="Back to editor"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h3 className="font-semibold truncate">{resume.title || 'Resume Preview'}</h3>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
          <ResumeFontPicker
            compact
            value={resume.fontFamily || DEFAULT_RESUME_FONT}
            onChange={handleFontChange}
            disabled={savingStyles}
          />
          <ResumeFontSizePicker
            compact
            value={resume.fontSize || DEFAULT_RESUME_FONT_SIZE}
            onChange={handleFontSizeChange}
            disabled={savingStyles}
          />
          <ResumePdfDownloadButton resume={resume} />
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <X className="h-4 w-4" />
            Close
          </Button>
        </div>
      </div>
      <div className="resume-pdf-body flex-1 flex flex-col p-4 sm:p-6 min-h-0">
        <p className="text-sm text-gray-600 mb-4 text-center">
          Adjust font and size above — the PDF preview updates instantly.
        </p>
        <div className="resume-pdf-viewer-container">
          <ResumePdfViewer resume={resume} />
        </div>
      </div>
    </div>
  );
}
