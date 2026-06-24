import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { Resume } from '../models/Resume';

const router = Router();

const resumeSchema = z.object({
  title: z.string().min(1).optional(),
  personalInfo: z
    .object({
      fullName: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
      location: z.string().optional(),
      linkedin: z.string().optional(),
      website: z.string().optional(),
      summary: z.string().optional(),
    })
    .optional(),
  experience: z
    .array(
      z.object({
        company: z.string().optional(),
        position: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        current: z.boolean().optional(),
        description: z.string().optional(),
      })
    )
    .optional(),
  education: z
    .array(
      z.object({
        institution: z.string().optional(),
        degree: z.string().optional(),
        field: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .optional(),
  skills: z.array(z.string()).optional(),
  template: z.enum(['modern', 'classic', 'minimal']).optional(),
  fontFamily: z
    .enum([
      'arial',
      'calibri',
      'cambria',
      'georgia',
      'garamond',
      'times-new-roman',
      'helvetica',
      'verdana',
      'tahoma',
      'trebuchet',
      'roboto',
      'open-sans',
      'lato',
    ])
    .optional(),
});

router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const resumes = await Resume.find().sort({ updatedAt: -1 });
    res.json(resumes);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }
    res.json(resume);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const data = resumeSchema.parse(req.body);
    const resume = await Resume.create(data);
    res.status(201).json(resume);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0].message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const data = resumeSchema.parse(req.body);
    const resume = await Resume.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!resume) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }
    res.json(resume);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0].message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const resume = await Resume.findByIdAndDelete(req.params.id);
    if (!resume) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }
    res.json({ message: 'Resume deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
