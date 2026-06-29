import api from './client';
import { Resume } from '../types';

export const resumeApi = {
  getAll: () => api.get<Resume[]>('/resumes'),
  getOne: (id: string) => api.get<Resume>(`/resumes/${id}`),
  create: (data: Partial<Resume>) => api.post<Resume>('/resumes', data),
  update: (id: string, data: Partial<Resume>) => api.put<Resume>(`/resumes/${id}`, data),
  delete: (id: string) => api.delete(`/resumes/${id}`),
};

export const aiApi = {
  generate: (data: {
    fullName: string;
    jobTitle: string;
    yearsOfExperience?: string;
    skills?: string[];
    industry?: string;
  }) => api.post<Partial<Resume>>('/ai/generate', data),
  improve: (data: { section: 'summary' | 'experience' | 'skills'; content: string; jobTitle?: string }) =>
    api.post<{ improved: string }>('/ai/improve', data),
  suggestSkills: (data: { jobTitle: string; currentSkills?: string[] }) =>
    api.post<{ skills: string[] }>('/ai/suggest-skills', data),
};
