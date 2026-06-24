import mongoose from 'mongoose';

export interface IExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface IEducation {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface IPersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  summary: string;
}

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
  | 'roboto'
  | 'open-sans'
  | 'lato';

export interface IResume {
  _id: mongoose.Types.ObjectId;
  title: string;
  personalInfo: IPersonalInfo;
  experience: IExperience[];
  education: IEducation[];
  skills: string[];
  template: 'modern' | 'classic' | 'minimal';
  fontFamily: ResumeFont;
  createdAt: Date;
  updatedAt: Date;
}
