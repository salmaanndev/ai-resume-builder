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

export interface Resume {
  _id?: string;
  title: string;
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  template: 'modern' | 'classic' | 'minimal';
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
});
