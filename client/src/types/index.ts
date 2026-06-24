export interface Experience {
  _id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  _id?: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  summary: string;
}

import { DEFAULT_RESUME_FONT, ResumeFont } from '../constants/resumeFonts';

export interface Resume {
  _id?: string;
  title: string;
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  template: 'modern' | 'classic' | 'minimal';
  fontFamily: ResumeFont;
  createdAt?: string;
  updatedAt?: string;
}
export const emptyPersonalInfo = (): PersonalInfo => ({
  fullName: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  website: '',
  summary: '',
});

export const emptyResume = (): Resume => ({
  title: 'Untitled Resume',
  personalInfo: emptyPersonalInfo(),
  experience: [],
  education: [],
  skills: [],
  template: 'classic',
  fontFamily: DEFAULT_RESUME_FONT,
});
