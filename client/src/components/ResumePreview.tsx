import { useEffect, useRef, useState } from 'react';
import { getResumeFontFamily } from '../constants/resumeFonts';
import { Resume } from '../types';

interface ResumePreviewProps {
  resume: Resume;
  showOverflowWarning?: boolean;
}

const formatBullets = (text: string): string[] =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-•*]\s*/, ''));

const contactParts = (info: Resume['personalInfo']) =>
  [info.email, info.phone, info.location, info.linkedin, info.website].filter(Boolean);

export default function ResumePreview({ resume, showOverflowWarning = true }: ResumePreviewProps) {
  const { personalInfo, experience, education, skills } = resume;
  const pageRef = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);
  const [underflows, setUnderflows] = useState(false);

  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;

    const check = () => {
      setOverflows(el.scrollHeight > el.clientHeight + 2);
      const header = el.querySelector('.resume-header') as HTMLElement | null;
      const body = el.querySelector('.resume-body') as HTMLElement | null;
      if (header && body) {
        const available = el.clientHeight - header.offsetHeight;
        setUnderflows(body.scrollHeight < available * 0.88);
      }
    };
    check();

    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [resume]);

  const contact = contactParts(personalInfo);

  return (
    <div className="resume-preview-wrapper">
      {showOverflowWarning && overflows && (
        <p className="resume-overflow-warning">
          Content exceeds one A4 page. Shorten sections or use AI Improve to trim content.
        </p>
      )}
      {showOverflowWarning && underflows && !overflows && (
        <p className="resume-underflow-hint">
          Page has empty space. Use AI Generate or Improve to add more content and fill the full A4 page.
        </p>
      )}

      <article
        id="resume-print"
        ref={pageRef}
        className="resume-a4"
        style={{ fontFamily: getResumeFontFamily(resume.fontFamily) }}
      >
        <header className="resume-header">
          <h1 className="resume-name">{personalInfo.fullName || 'Your Name'}</h1>
          {contact.length > 0 && (
            <p className="resume-contact">{contact.join(' | ')}</p>
          )}
        </header>

        <div className="resume-body">
          {personalInfo.summary && (
            <section className="resume-section">
              <h2 className="resume-section-title">Professional Summary</h2>
              <p className="resume-text">{personalInfo.summary}</p>
            </section>
          )}

          {experience.length > 0 && (
            <section className="resume-section resume-section-grow">
              <h2 className="resume-section-title">Professional Experience</h2>
              {experience.map((exp, i) => (
                <div key={exp._id || i} className="resume-entry">
                  <div className="resume-entry-header">
                    <span className="resume-entry-title">
                      {exp.position}
                      {exp.company ? `, ${exp.company}` : ''}
                    </span>
                    {(exp.startDate || exp.endDate || exp.current) && (
                      <span className="resume-entry-date">
                        {exp.startDate}
                        {exp.startDate && (exp.endDate || exp.current) ? ' – ' : ''}
                        {exp.current ? 'Present' : exp.endDate}
                      </span>
                    )}
                  </div>
                  {exp.description && (
                    <ul className="resume-bullets">
                      {formatBullets(exp.description).map((bullet, j) => (
                        <li key={j}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}

          {education.length > 0 && (
            <section className="resume-section">
              <h2 className="resume-section-title">Education</h2>
              {education.map((edu, i) => (
                <div key={edu._id || i} className="resume-entry">
                  <div className="resume-entry-header">
                    <span className="resume-entry-title">
                      {edu.degree}
                      {edu.field ? ` in ${edu.field}` : ''}
                      {edu.institution ? `, ${edu.institution}` : ''}
                    </span>
                    {(edu.startDate || edu.endDate) && (
                      <span className="resume-entry-date">
                        {edu.startDate}
                        {edu.startDate && edu.endDate ? ' – ' : ''}
                        {edu.endDate}
                      </span>
                    )}
                  </div>
                  {edu.description && <p className="resume-text">{edu.description}</p>}
                </div>
              ))}
            </section>
          )}

          {skills.length > 0 && (
            <section className="resume-section">
              <h2 className="resume-section-title">Skills</h2>
              <p className="resume-skills">{skills.join(' • ')}</p>
            </section>
          )}
        </div>
      </article>
    </div>
  );
}
