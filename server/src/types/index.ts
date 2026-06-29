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
  | 'roboto';

export type ResumeFontSize = 'small' | 'medium' | 'large';

export interface IResume {
  _id: mongoose.Types.ObjectId;
  title: string;
  personalInfo: IPersonalInfo;
  experience: IExperience[];
  education: IEducation[];
  skills: string[];
  template: 'modern' | 'classic' | 'minimal';
  fontFamily: ResumeFont;
  fontSize: ResumeFontSize;
  createdAt: Date;
  updatedAt: Date;
}
