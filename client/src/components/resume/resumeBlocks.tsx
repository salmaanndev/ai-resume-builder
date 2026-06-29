import { Resume } from '../../types';

export const formatBullets = (text: string): string[] =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-•*]\s*/, ''));

export const contactParts = (info: Resume['personalInfo']) =>
  [info.email, info.phone, info.location, info.linkedin, info.website].filter(Boolean);
