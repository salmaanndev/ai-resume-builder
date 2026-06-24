import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { chatComplete, isOpenRouterConfigured, parseJsonResponse } from '../config/openrouter';

const router = Router();

const generateSchema = z.object({
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

const ATS_PAGE_RULES = `
CRITICAL: Generate content for a SINGLE-PAGE A4 ATS-friendly resume:
- Must fit on one A4 page when printed (be concise)
- Use standard section names and plain text only (no tables, columns, icons, or graphics)
- Summary: 2-3 sentences maximum (under 50 words)
- Experience: 2-3 most relevant roles only, each with 2-3 one-line bullet points using action verbs and metrics
- Education: 1-2 entries maximum
- Skills: 10-12 relevant skills as a flat list
- Experience descriptions: newline-separated bullet points (no markdown)
- Use common job titles and keywords recruiters and ATS systems scan for`;

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
${data.yearsOfExperience ? `Years of experience: ${data.yearsOfExperience}` : ''}
${data.industry ? `Industry: ${data.industry}` : ''}
${data.skills?.length ? `Skills to include: ${data.skills.join(', ')}` : ''}
${ATS_PAGE_RULES}

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
    const resume = parseJsonResponse(content);
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
Keep content concise for a single-page A4 ATS resume. Summary: max 3 sentences. Experience: max 3 bullet points, one line each. Skills: comma-separated list of 10-12 items max.

Original content:
${data.content}

Return ONLY the improved text, no explanations or markdown.`;

    const improved = (await chatComplete(prompt)).trim();
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

    const prompt = `Suggest 10-12 relevant ATS-friendly skills for a ${data.jobTitle} position.
${data.currentSkills?.length ? `Already has: ${data.currentSkills.join(', ')}. Suggest additional skills only.` : ''}
Use standard industry skill names that applicant tracking systems recognize.
Return ONLY a JSON object with a "skills" array of skill strings, e.g. {"skills": ["Skill1", "Skill2"]}`;

    const content = await chatComplete(prompt, true);
    const parsed = parseJsonResponse(content) as { skills?: string[] } | string[];
    const skills = Array.isArray(parsed) ? parsed : parsed.skills || [];
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
