import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Save,
  Sparkles,
  Wand2,
  Plus,
  Trash2,
  Eye,
  ArrowLeft,
  X,
} from 'lucide-react';
import { resumeApi, aiApi } from '../api';
import { Resume, Experience, Education, emptyResume } from '../types';
import { DEFAULT_RESUME_FONT } from '../constants/resumeFonts';
import { DEFAULT_RESUME_FONT_SIZE } from '../constants/resumeFontSizes';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Button from '../components/Button';
import ResumeFontPicker from '../components/ResumeFontPicker';
import ResumeFontSizePicker from '../components/ResumeFontSizePicker';

export default function ResumeEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isNew = id === 'new';
  const isAiMode = searchParams.get('mode') === 'ai';

  const [resume, setResume] = useState<Resume>(emptyResume());
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [showAiGenerate, setShowAiGenerate] = useState(isNew && isAiMode);
  const [aiLoading, setAiLoading] = useState(false);
  const [improving, setImproving] = useState<string | null>(null);

  const [aiForm, setAiForm] = useState({
    jobTitle: '',
    yearsOfExperience: '',
    industry: '',
    skills: '',
  });

  useEffect(() => {
    if (isNew && !isAiMode) {
      navigate('/create', { replace: true });
      return;
    }
    if (!isNew && id) loadResume(id);
  }, [id, isNew, isAiMode, navigate]);

  const loadResume = async (resumeId: string) => {
    try {
      const { data } = await resumeApi.getOne(resumeId);
      setResume({
        ...data,
        fontFamily: data.fontFamily || DEFAULT_RESUME_FONT,
        fontSize: data.fontSize || DEFAULT_RESUME_FONT_SIZE,
      });
    } catch {
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const closeAiGenerate = () => {
    setShowAiGenerate(false);
    if (isNew) navigate('/create');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isNew || !resume._id) {
        const { data } = await resumeApi.create(resume);
        navigate(`/editor/${data._id}`, { replace: true });
      } else {
        const { data } = await resumeApi.update(resume._id, resume);
        setResume(data);
      }
    } catch {
      alert('Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  const handleAiGenerate = async () => {
    if (!aiForm.jobTitle) return;
    setAiLoading(true);
    try {
      const { data } = await aiApi.generate({
        jobTitle: aiForm.jobTitle,
        yearsOfExperience: aiForm.yearsOfExperience || undefined,
        industry: aiForm.industry || undefined,
        skills: aiForm.skills ? aiForm.skills.split(',').map((s) => s.trim()) : undefined,
      });
      setResume((prev) => ({
        ...prev,
        ...data,
        title: data.title || `${aiForm.jobTitle} Resume`,
        personalInfo: { ...prev.personalInfo, ...data.personalInfo },
      }));
      setShowAiGenerate(false);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      alert(message || 'AI generation failed');
    } finally {
      setAiLoading(false);
    }
  };

  const handleImprove = async (section: 'summary' | 'experience' | 'skills', content: string, key?: string) => {
    if (!content.trim()) return;
    setImproving(key || section);
    try {
      const { data } = await aiApi.improve({ section, content });
      if (section === 'summary') {
        setResume((prev) => ({
          ...prev,
          personalInfo: { ...prev.personalInfo, summary: data.improved },
        }));
      } else if (section === 'experience' && key?.startsWith('exp-')) {
        const index = parseInt(key.split('-')[1], 10);
        setResume((prev) => {
          const experience = [...prev.experience];
          experience[index] = { ...experience[index], description: data.improved };
          return { ...prev, experience };
        });
      } else if (section === 'skills') {
        const skills = data.improved.split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
        setResume((prev) => ({ ...prev, skills }));
      }
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      alert(message || 'AI improvement failed');
    } finally {
      setImproving(null);
    }
  };

  const handleSuggestSkills = async () => {
    setImproving('suggest-skills');
    try {
      const { data } = await aiApi.suggestSkills({
        jobTitle: aiForm.jobTitle || resume.title,
        currentSkills: resume.skills,
      });
      setResume((prev) => ({
        ...prev,
        skills: [...new Set([...prev.skills, ...data.skills])],
      }));
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      alert(message || 'Failed to suggest skills');
    } finally {
      setImproving(null);
    }
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setResume((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const addExperience = () => {
    const exp: Experience = {
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
    setResume((prev) => ({ ...prev, experience: [...prev.experience, exp] }));
  };

  const updateExperience = (index: number, field: keyof Experience, value: string | boolean) => {
    setResume((prev) => {
      const experience = [...prev.experience];
      experience[index] = { ...experience[index], [field]: value };
      return { ...prev, experience };
    });
  };

  const removeExperience = (index: number) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const addEducation = () => {
    const edu: Education = {
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      description: '',
    };
    setResume((prev) => ({ ...prev, education: [...prev.education, edu] }));
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    setResume((prev) => {
      const education = [...prev.education];
      education[index] = { ...education[index], [field]: value };
      return { ...prev, education };
    });
  };

  const removeEducation = (index: number) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const addSkill = (skill: string) => {
    if (!skill.trim() || resume.skills.includes(skill.trim())) return;
    setResume((prev) => ({ ...prev, skills: [...prev.skills, skill.trim()] }));
  };

  const removeSkill = (index: number) => {
    setResume((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const handlePreview = async () => {
    setPreviewing(true);
    try {
      let resumeId = resume._id;
      if (isNew || !resumeId) {
        const { data } = await resumeApi.create(resume);
        resumeId = data._id;
        setResume(data);
        navigate(`/editor/${data._id}`, { replace: true });
      } else {
        await resumeApi.update(resumeId, resume);
      }
      navigate(`/preview/${resumeId}`);
    } catch {
      alert('Failed to save resume before preview');
    } finally {
      setPreviewing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin h-8 w-8 border-4 border-brand-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="resume-editor-page min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="resume-print-hide sticky top-16 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <Input
              value={resume.title}
              onChange={(e) => setResume((prev) => ({ ...prev, title: e.target.value }))}
              className="!border-0 !shadow-none !text-lg !font-semibold !bg-transparent max-w-xs"
              placeholder="Resume title"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setShowAiGenerate(true)}>
              <Sparkles className="h-4 w-4" />
              AI Generate
            </Button>
            <Button variant="secondary" size="sm" onClick={handlePreview} loading={previewing}>
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button size="sm" onClick={handleSave} loading={saving}>
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      </div>

      <div className="resume-print-hide max-w-3xl mx-auto px-4 py-8 space-y-8">
        <p className="text-sm text-gray-500 text-center -mt-4">
          AI generates content to fill a full A4 page — ATS-friendly single-page format
        </p>

        {/* Font */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Typography</h2>
          <p className="text-sm text-gray-500 mb-4">Choose the font and size for your resume preview and PDF export.</p>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Font</label>
              <ResumeFontPicker
                value={resume.fontFamily || DEFAULT_RESUME_FONT}
                onChange={(fontFamily) => setResume((prev) => ({ ...prev, fontFamily }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Font size</label>
              <ResumeFontSizePicker
                value={resume.fontSize || DEFAULT_RESUME_FONT_SIZE}
                onChange={(fontSize) => setResume((prev) => ({ ...prev, fontSize }))}
              />
            </div>
          </div>
        </section>

        {/* Personal Info */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Full Name" value={resume.personalInfo.fullName} onChange={(e) => updatePersonalInfo('fullName', e.target.value)} />
            <Input label="Email" type="email" value={resume.personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} />
            <Input label="Phone" value={resume.personalInfo.phone} onChange={(e) => updatePersonalInfo('phone', e.target.value)} />
            <Input label="Location" value={resume.personalInfo.location} onChange={(e) => updatePersonalInfo('location', e.target.value)} />
            <Input label="LinkedIn" value={resume.personalInfo.linkedin} onChange={(e) => updatePersonalInfo('linkedin', e.target.value)} />
            <Input label="Website" value={resume.personalInfo.website} onChange={(e) => updatePersonalInfo('website', e.target.value)} />
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">Professional Summary</label>
              <button
                onClick={() => handleImprove('summary', resume.personalInfo.summary)}
                disabled={improving === 'summary'}
                className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 disabled:opacity-50"
              >
                <Wand2 className="h-3 w-3" />
                {improving === 'summary' ? 'Improving...' : 'AI Improve'}
              </button>
            </div>
            <Textarea
              value={resume.personalInfo.summary}
              onChange={(e) => updatePersonalInfo('summary', e.target.value)}
              placeholder="Write a compelling professional summary..."
              rows={4}
            />
          </div>
        </section>

        {/* Experience */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Experience</h2>
            <Button variant="secondary" size="sm" onClick={addExperience}>
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
          {resume.experience.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">No experience added yet</p>
          ) : (
            <div className="space-y-6">
              {resume.experience.map((exp, i) => (
                <div key={i} className="p-4 rounded-lg border border-gray-100 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-medium text-gray-500">Position {i + 1}</span>
                    <button onClick={() => removeExperience(i)} className="text-gray-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Input label="Position" value={exp.position} onChange={(e) => updateExperience(i, 'position', e.target.value)} />
                    <Input label="Company" value={exp.company} onChange={(e) => updateExperience(i, 'company', e.target.value)} />
                    <Input label="Start Date" value={exp.startDate} onChange={(e) => updateExperience(i, 'startDate', e.target.value)} placeholder="2020-01" />
                    <Input label="End Date" value={exp.endDate} onChange={(e) => updateExperience(i, 'endDate', e.target.value)} placeholder="2024-01" disabled={exp.current} />
                  </div>
                  <label className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) => updateExperience(i, 'current', e.target.checked)}
                      className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                    />
                    Currently working here
                  </label>
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm font-medium text-gray-700">Description</label>
                      <button
                        onClick={() => handleImprove('experience', exp.description, `exp-${i}`)}
                        disabled={improving === `exp-${i}`}
                        className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 disabled:opacity-50"
                      >
                        <Wand2 className="h-3 w-3" />
                        {improving === `exp-${i}` ? 'Improving...' : 'AI Improve'}
                      </button>
                    </div>
                    <Textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(i, 'description', e.target.value)}
                      placeholder="Describe your responsibilities and achievements..."
                      rows={3}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Education */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Education</h2>
            <Button variant="secondary" size="sm" onClick={addEducation}>
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
          {resume.education.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">No education added yet</p>
          ) : (
            <div className="space-y-6">
              {resume.education.map((edu, i) => (
                <div key={i} className="p-4 rounded-lg border border-gray-100 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-medium text-gray-500">Education {i + 1}</span>
                    <button onClick={() => removeEducation(i)} className="text-gray-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Input label="Institution" value={edu.institution} onChange={(e) => updateEducation(i, 'institution', e.target.value)} />
                    <Input label="Degree" value={edu.degree} onChange={(e) => updateEducation(i, 'degree', e.target.value)} />
                    <Input label="Field of Study" value={edu.field} onChange={(e) => updateEducation(i, 'field', e.target.value)} />
                    <Input label="Start Date" value={edu.startDate} onChange={(e) => updateEducation(i, 'startDate', e.target.value)} />
                    <Input label="End Date" value={edu.endDate} onChange={(e) => updateEducation(i, 'endDate', e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Skills */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSuggestSkills}
              loading={improving === 'suggest-skills'}
            >
              <Sparkles className="h-4 w-4" />
              AI Suggest
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {resume.skills.map((skill, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-sm"
              >
                {skill}
                <button onClick={() => removeSkill(i)} className="hover:text-brand-900">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = (e.target as HTMLFormElement).skill as HTMLInputElement;
              addSkill(input.value);
              input.value = '';
            }}
            className="flex gap-2"
          >
            <Input name="skill" placeholder="Add a skill and press Enter" className="flex-1" />
            <Button type="submit" variant="secondary" size="sm">Add</Button>
          </form>
        </section>
      </div>

      {/* AI Generate Modal */}
      {showAiGenerate && (
        <div className="resume-print-hide fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-brand-600" />
                AI Resume Generator
              </h3>
              <button onClick={closeAiGenerate} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <Input
                label="Target Job Title"
                value={aiForm.jobTitle}
                onChange={(e) => setAiForm((prev) => ({ ...prev, jobTitle: e.target.value }))}
                placeholder="e.g. Software Engineer"
                required
              />
              <Input
                label="Years of Experience"
                value={aiForm.yearsOfExperience}
                onChange={(e) => setAiForm((prev) => ({ ...prev, yearsOfExperience: e.target.value }))}
                placeholder="e.g. 5 years"
              />
              <Input
                label="Industry"
                value={aiForm.industry}
                onChange={(e) => setAiForm((prev) => ({ ...prev, industry: e.target.value }))}
                placeholder="e.g. Technology"
              />
              <Input
                label="Skills (comma-separated)"
                value={aiForm.skills}
                onChange={(e) => setAiForm((prev) => ({ ...prev, skills: e.target.value }))}
                placeholder="e.g. React, Node.js, TypeScript"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="secondary" className="flex-1" onClick={closeAiGenerate}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleAiGenerate} loading={aiLoading}>
                Generate Resume
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
