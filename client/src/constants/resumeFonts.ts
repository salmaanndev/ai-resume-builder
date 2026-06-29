export type ResumeFont =
  | 'arial'
  | 'calibri'
  | 'cambria'
  | 'georgia'
  | 'garamond'
  | 'times-new-roman'
  | 'helvetica'
  | 'verdana'
  | 'tahoma'
  | 'trebuchet'
  | 'roboto';

export interface ResumeFontOption {
  id: ResumeFont;
  label: string;
  family: string;
}

export const RESUME_FONTS: ResumeFontOption[] = [
  { id: 'arial', label: 'Arial', family: 'Arial, Helvetica, sans-serif' },
  { id: 'calibri', label: 'Calibri', family: 'Calibri, "Segoe UI", sans-serif' },
  { id: 'cambria', label: 'Cambria', family: 'Cambria, Georgia, serif' },
  { id: 'georgia', label: 'Georgia', family: 'Georgia, "Times New Roman", serif' },
  { id: 'garamond', label: 'Garamond', family: 'Garamond, "Times New Roman", serif' },
  { id: 'times-new-roman', label: 'Times New Roman', family: '"Times New Roman", Times, serif' },
  { id: 'helvetica', label: 'Helvetica', family: 'Helvetica, Arial, sans-serif' },
  { id: 'verdana', label: 'Verdana', family: 'Verdana, Geneva, sans-serif' },
  { id: 'tahoma', label: 'Tahoma', family: 'Tahoma, Geneva, sans-serif' },
  { id: 'trebuchet', label: 'Trebuchet MS', family: '"Trebuchet MS", Helvetica, sans-serif' },
  { id: 'roboto', label: 'Roboto', family: 'Roboto, Arial, sans-serif' },
];

export const DEFAULT_RESUME_FONT: ResumeFont = 'arial';

export const getResumeFontFamily = (font: ResumeFont | undefined): string => {
  const match = RESUME_FONTS.find((f) => f.id === font);
  return match?.family ?? RESUME_FONTS[0].family;
};

export const normalizeResumeFont = (font: string | undefined): ResumeFont => {
  if (font && RESUME_FONT_IDS.includes(font as ResumeFont)) {
    return font as ResumeFont;
  }
  return DEFAULT_RESUME_FONT;
};

export const RESUME_FONT_IDS = RESUME_FONTS.map((f) => f.id);
