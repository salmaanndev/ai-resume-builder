/** Hard caps so AI-generated resumes stay on a single A4 page at 10pt. */

export const SINGLE_PAGE_LIMITS = {
  summaryMaxWords: 65,
  maxExperienceEntries: 3,
  maxBulletsPerExperience: 3,
  maxBulletChars: 120,
  maxEducationEntries: 2,
  educationDescriptionMaxWords: 15,
  maxSkills: 16,
  maxSuggestedSkills: 10,
} as const;

interface ExperienceEntry {
  company?: string;
  position?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

interface EducationEntry {
  institution?: string;
  degree?: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

interface PersonalInfo {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  website?: string;
  summary?: string;
}

export interface GeneratedResumePayload {
  title?: string;
  personalInfo?: PersonalInfo;
  experience?: ExperienceEntry[];
  education?: EducationEntry[];
  skills?: string[];
  template?: string;
  fontFamily?: string;
  fontSize?: string;
}

const truncateWords = (text: string | undefined, maxWords: number): string => {
  if (!text) return '';
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text.trim();
  return `${words.slice(0, maxWords).join(' ')}…`;
};

const formatBullets = (text: string): string[] =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-•*]\s*/, ''));

const truncateBullets = (
  text: string | undefined,
  maxBullets: number,
  maxChars: number
): string => {
  if (!text) return '';
  return formatBullets(text)
    .slice(0, maxBullets)
    .map((bullet) => (bullet.length > maxChars ? `${bullet.slice(0, maxChars - 1)}…` : bullet))
    .join('\n');
};

export const enforceSinglePageResume = (resume: GeneratedResumePayload): GeneratedResumePayload => {
  const { summaryMaxWords, maxExperienceEntries, maxBulletsPerExperience, maxBulletChars } =
    SINGLE_PAGE_LIMITS;
  const { maxEducationEntries, educationDescriptionMaxWords, maxSkills } = SINGLE_PAGE_LIMITS;

  return {
    ...resume,
    personalInfo: resume.personalInfo
      ? {
          ...resume.personalInfo,
          summary: truncateWords(resume.personalInfo.summary, summaryMaxWords),
        }
      : resume.personalInfo,
    experience: (resume.experience || []).slice(0, maxExperienceEntries).map((entry) => ({
      ...entry,
      description: truncateBullets(entry.description, maxBulletsPerExperience, maxBulletChars),
    })),
    education: (resume.education || []).slice(0, maxEducationEntries).map((entry) => ({
      ...entry,
      description: truncateWords(entry.description, educationDescriptionMaxWords),
    })),
    skills: [...new Set((resume.skills || []).map((s) => s.trim()).filter(Boolean))].slice(
      0,
      maxSkills
    ),
  };
};

export const enforceSinglePageExperience = (content: string): string =>
  truncateBullets(content, SINGLE_PAGE_LIMITS.maxBulletsPerExperience, SINGLE_PAGE_LIMITS.maxBulletChars);

export const enforceSinglePageSummary = (content: string): string =>
  truncateWords(content, SINGLE_PAGE_LIMITS.summaryMaxWords);

export const enforceSinglePageSkills = (skills: string[]): string[] =>
  [...new Set(skills.map((s) => s.trim()).filter(Boolean))].slice(0, SINGLE_PAGE_LIMITS.maxSkills);

export const ATS_SINGLE_PAGE_RULES = `
CRITICAL — SINGLE A4 PAGE ONLY (210mm × 297mm at 10pt). The resume MUST NOT exceed one page. When unsure, generate LESS content:
- ONE page maximum — never produce enough text for a second page
- Summary: 3–4 sentences, 50–65 words total
- Experience: 2–3 roles only, each with exactly 3 short bullet points (one line each, ~15 words max per bullet)
- Education: 1–2 entries; leave description empty unless one brief line is needed
- Skills: 12–16 skills in the JSON array — no more
- Use concise, high-impact language; no filler, no duplicate roles, no long paragraphs
- Plain text only — no tables, columns, icons, or graphics
- Standard ATS section headings and keywords recruiters expect`;

export const IMPROVE_SINGLE_PAGE_RULES: Record<string, string> = {
  summary:
    'Rewrite to 3–4 sentences (50–65 words max). Keep it concise so the full resume stays on one A4 page.',
  experience:
    'Return exactly 3 short one-line bullet points (newline-separated). Each bullet ~15 words max. Do not exceed 3 bullets.',
  skills:
    'Return a comma-separated list of 12–16 relevant skills only. Do not exceed 16 skills.',
};
