import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { Download } from 'lucide-react';
import { Resume } from '../../types';
import Button from '../Button';
import ResumePdfDocument from './ResumePdfDocument';

interface ResumePdfDownloadButtonProps {
  resume: Resume;
}

export default function ResumePdfDownloadButton({ resume }: ResumePdfDownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const blob = await pdf(<ResumePdfDocument resume={resume} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const safeName = (resume.title || 'resume').replace(/[^\w\s-]/g, '').trim() || 'resume';
      link.href = url;
      link.download = `${safeName}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Failed to generate PDF');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Button variant="secondary" size="sm" onClick={handleDownload} loading={downloading}>
      <Download className="h-4 w-4" />
      Download PDF
    </Button>
  );
}
