import mongoose, { Schema, Document } from 'mongoose';
import { IResume } from '../types';

export interface IResumeDocument extends Omit<IResume, '_id'>, Document {}

const experienceSchema = new Schema(
  {
    company: { type: String, default: '' },
    position: { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    current: { type: Boolean, default: false },
    description: { type: String, default: '' },
  },
  { _id: true }
);

const educationSchema = new Schema(
  {
    institution: { type: String, default: '' },
    degree: { type: String, default: '' },
    field: { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { _id: true }
);

const personalInfoSchema = new Schema(
  {
    fullName: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    website: { type: String, default: '' },
    summary: { type: String, default: '' },
  },
  { _id: false }
);

const resumeSchema = new Schema<IResumeDocument>(
  {
    title: { type: String, required: true, default: 'Untitled Resume' },
    personalInfo: { type: personalInfoSchema, default: () => ({}) },
    experience: { type: [experienceSchema], default: [] },
    education: { type: [educationSchema], default: [] },
    skills: { type: [String], default: [] },
    template: { type: String, enum: ['modern', 'classic', 'minimal'], default: 'classic' },
  },
  { timestamps: true }
);

export const Resume = mongoose.model<IResumeDocument>('Resume', resumeSchema);
