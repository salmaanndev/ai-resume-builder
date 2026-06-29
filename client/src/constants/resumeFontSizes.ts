export type ResumeFontSize = 'small' | 'medium' | 'large';

export interface ResumeFontSizeOption {
  id: ResumeFontSize;
  label: string;
  basePt: number;
}

export const RESUME_FONT_SIZES: ResumeFontSizeOption[] = [
  { id: 'small', label: 'Small', basePt: 9 },
  { id: 'medium', label: 'Medium', basePt: 10 },
  { id: 'large', label: 'Large', basePt: 11 },
];

export const DEFAULT_RESUME_FONT_SIZE: ResumeFontSize = 'medium';

export const getResumeFontSizePt = (size: ResumeFontSize | undefined): number => {
  const match = RESUME_FONT_SIZES.find((s) => s.id === size);
  return match?.basePt ?? RESUME_FONT_SIZES[1].basePt;
};

export interface PdfFontSizes {
  body: number;
  name: number;
  contact: number;
  sectionTitle: number;
  entryTitle: number;
  entryDate: number;
  pageNumber: number;
}

/** Scales all PDF text sizes proportionally from a base body size (default 10pt). */
export const getPdfFontSizes = (size: ResumeFontSize | undefined): PdfFontSizes => {
  const base = getResumeFontSizePt(size);
  const ratio = base / 10;

  return {
    body: base,
    name: 18 * ratio,
    contact: 9 * ratio,
    sectionTitle: 10.5 * ratio,
    entryTitle: 10 * ratio,
    entryDate: 9 * ratio,
    pageNumber: 8 * ratio,
  };
};
