import { Link } from 'react-router-dom';
import { Sparkles, FileText, Wand2, Download, ArrowRight } from 'lucide-react';
import Button from '../components/Button';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Generation',
    description: 'Generate a complete professional resume from just a job title and your experience level.',
  },
  {
    icon: Wand2,
    title: 'Smart Content Improvement',
    description: 'Enhance your summary, experience descriptions, and skills with AI suggestions.',
  },
  {
    icon: FileText,
    title: 'Multiple Templates',
    description: 'Choose from modern, classic, or minimal templates to match your style.',
  },
  {
    icon: Download,
    title: 'Export & Print',
    description: 'Preview your resume in real-time and print or save as PDF.',
  },
];

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-indigo-50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%236366f1%22 fill-opacity=%220.04%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Powered by AI
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 tracking-tight">
              Build Your Perfect Resume with{' '}
              <span className="text-brand-600">AI</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
              Create professional, ATS-friendly resumes in minutes. Let AI generate content,
              suggest skills, and polish your experience descriptions.
            </p>
            <div className="mt-10 flex justify-center">
              <Link to="/create">
                <Button size="lg">
                  Start Building Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything you need to land your dream job
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl border border-gray-200 hover:border-brand-200 hover:shadow-md transition-all"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100 mb-4">
                  <feature.icon className="h-6 w-6 text-brand-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
