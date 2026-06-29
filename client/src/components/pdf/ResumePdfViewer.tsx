import { useEffect, useRef, useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { Document, Page, pdfjs } from 'react-pdf';
import { Resume } from '../../types';
import ResumePdfDocument from './ResumePdfDocument';

import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

interface ResumePdfViewerProps {
  resume: Resume;
}

export default function ResumePdfViewer({ resume }: ResumePdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [pageWidth, setPageWidth] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;

    const generate = async () => {
      setLoading(true);
      setError(false);
      setNumPages(0);
      setPdfUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });

      try {
        const blob = await pdf(<ResumePdfDocument resume={resume} />).toBlob();
        if (!active) return;
        objectUrl = URL.createObjectURL(blob);
        setPdfUrl(objectUrl);
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    generate();

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [resume]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateWidth = () => {
      const padding = 48;
      const maxA4Width = 794;
      const available = container.clientWidth - padding;
      setPageWidth(Math.min(Math.max(available, 280), maxA4Width));
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="resume-pdf-scroll-view">
      {loading && (
        <div className="resume-pdf-status">
          <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full" />
          <p>Generating PDF preview…</p>
        </div>
      )}

      {error && (
        <div className="resume-pdf-status">
          <p>Failed to load PDF preview. Try downloading the PDF instead.</p>
        </div>
      )}

      {pdfUrl && !loading && !error && pageWidth > 0 && (
        <Document
          file={pdfUrl}
          onLoadSuccess={({ numPages: total }) => setNumPages(total)}
          loading={null}
          error={<p className="text-white text-sm">Failed to render PDF.</p>}
        >
          <div className="resume-pdf-pages">
            {Array.from({ length: numPages }, (_, index) => (
              <Page
                key={`page-${index + 1}`}
                pageNumber={index + 1}
                width={pageWidth}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="resume-pdf-page-canvas"
              />
            ))}
          </div>
        </Document>
      )}
    </div>
  );
}
