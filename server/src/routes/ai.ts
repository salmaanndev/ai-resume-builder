import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { chatComplete, isOpenRouterConfigured, parseJsonResponse } from '../config/openrouter';
import {
  ATS_SINGLE_PAGE_RULES,
  enforceSinglePageExperience,
  enforceSinglePageResume,
  enforceSinglePageSkills,
  enforceSinglePageSummary,
  GeneratedResumePayload,
  IMPROVE_SINGLE_PAGE_RULES,
  SINGLE_PAGE_LIMITS,
} from '../utils/resumeContentLimits';

const router = Router();

const generateSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  yearsOfExperience: z.string().optional(),
  skills: z.array(z.string()).optional(),
  industry: z.string().optional(),
});

const improveSchema = z.object({
  section: z.enum(['summary', 'experience', 'skills']),
  content: z.string().min(1, 'Content is required'),
  jobTitle: z.string().optional(),
});

const suggestSkillsSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required'),
  currentSkills: z.array(z.string()).optional(),
});

const aiNotConfigured = (res: Response): void => {
  res.status(503).json({
    message: 'OpenRouter API key not configured. Add OPENROUTER_API_KEY to server/.env',
  });
};

router.post('/generate', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isOpenRouterConfigured()) {
      aiNotConfigured(res);
      return;
    }

    const data = generateSchema.parse(req.body);

    const prompt = `Generate a professional ATS-friendly resume in JSON format for a ${data.jobTitle} position.
Candidate full name: ${data.fullName}
Use this exact full name in personalInfo.fullName — do not use a placeholder or invent a different name.
${data.yearsOfExperience ? `Years of experience: ${data.yearsOfExperience}` : ''}
${data.industry ? `Industry: ${data.industry}` : ''}
${data.skills?.length ? `Skills to include: ${data.skills.join(', ')}` : ''}
${ATS_SINGLE_PAGE_RULES}

Return ONLY valid JSON with this exact structure (no markdown, no explanation):
{
  "title": "Resume title",
  "personalInfo": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1 555-0100",
    "location": "City, State",
    "linkedin": "linkedin.com/in/johndoe",
    "website": "",
    "summary": "Professional summary paragraph"
  },
  "experience": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "startDate": "2020-01",
      "endDate": "2024-01",
      "current": false,
      "description": "Achievement-focused bullet points"
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "degree": "Bachelor of Science",
      "field": "Computer Science",
      "startDate": "2016",
      "endDate": "2020",
      "description": ""
    }
  ],
  "skills": ["Skill1", "Skill2", "Skill3"]
}`;

    const content = await chatComplete(prompt, true);
    const resume = enforceSinglePageResume(parseJsonResponse(content) as GeneratedResumePayload);
    if (resume.personalInfo) {
      resume.personalInfo.fullName = data.fullName.trim();
    } else {
      resume.personalInfo = { fullName: data.fullName.trim() };
    }
    res.json(resume);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0].message });
      return;
    }
    console.error('AI generate error:', error);
    res.status(500).json({ message: 'Failed to generate resume' });
  }
});

router.post('/improve', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isOpenRouterConfigured()) {
      aiNotConfigured(res);
      return;
    }

    const data = improveSchema.parse(req.body);

    const sectionLabels: Record<string, string> = {
      summary: 'professional summary',
      experience: 'work experience description',
      skills: 'skills list',
    };

    const prompt = `Improve this resume ${sectionLabels[data.section]} to be more professional, impactful, and ATS-friendly.
${data.jobTitle ? `Target job title: ${data.jobTitle}` : ''}
${IMPROVE_SINGLE_PAGE_RULES[data.section]}
The entire resume must remain on a single A4 page — do not make this section longer than the limits above.

Original content:
${data.content}

Return ONLY the improved text, no explanations or markdown.`;

    let improved = (await chatComplete(prompt)).trim();

    if (data.section === 'summary') {
      improved = enforceSinglePageSummary(improved);
    } else if (data.section === 'experience') {
      improved = enforceSinglePageExperience(improved);
    } else if (data.section === 'skills') {
      improved = enforceSinglePageSkills(
        improved.split(/[,\n]/).map((s) => s.trim()).filter(Boolean)
      ).join(', ');
    }

    res.json({ improved });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0].message });
      return;
    }
    console.error('AI improve error:', error);
    res.status(500).json({ message: 'Failed to improve content' });
  }
});

router.post('/suggest-skills', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isOpenRouterConfigured()) {
      aiNotConfigured(res);
      return;
    }

    const data = suggestSkillsSchema.parse(req.body);
    const remaining = Math.max(
      0,
      SINGLE_PAGE_LIMITS.maxSkills - (data.currentSkills?.length || 0)
    );

    if (remaining === 0) {
      res.json({ skills: [] });
      return;
    }

    const suggestCount = Math.min(remaining, SINGLE_PAGE_LIMITS.maxSuggestedSkills);

    const prompt = `Suggest ${suggestCount} relevant ATS-friendly skills for a ${data.jobTitle} position.
${data.currentSkills?.length ? `Already has: ${data.currentSkills.join(', ')}. Suggest additional skills only — do not repeat existing ones.` : ''}
The full resume must fit on one A4 page — suggest at most ${suggestCount} skills.
Use standard industry skill names that applicant tracking systems recognize.
Return ONLY a JSON object with a "skills" array of skill strings, e.g. {"skills": ["Skill1", "Skill2"]}`;

    const content = await chatComplete(prompt, true);
    const parsed = parseJsonResponse(content) as { skills?: string[] } | string[];
    const rawSkills = Array.isArray(parsed) ? parsed : parsed.skills || [];
    const skills = enforceSinglePageSkills([
      ...(data.currentSkills || []),
      ...rawSkills,
    ]).slice(data.currentSkills?.length || 0);

    res.json({ skills });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0].message });
      return;
    }
    console.error('AI suggest-skills error:', error);
    res.status(500).json({ message: 'Failed to suggest skills' });
  }
});

export default router;
