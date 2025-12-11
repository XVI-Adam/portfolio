'use client';

import { PageShell } from '@/components/layout/PageShell';
import { FormEvent, KeyboardEvent, useState } from 'react';

type Accent = 'blue' | 'fuchsia' | 'emerald' | 'slate';

type Project = {
  title: string;
  badge: string;
  description: string;
  tags: string[];
  accent: Accent;
  href?: string;
};

const accentStyles: Record<
  Accent,
  { hoverBorder: string; hoverShadow: string; badgeBg: string; badgeText: string; titleHover: string }
> = {
  blue: {
    hoverBorder: 'hover:border-blue-500/50',
    hoverShadow: 'hover:shadow-blue-900/20',
    badgeBg: 'bg-blue-900/30',
    badgeText: 'text-blue-300',
    titleHover: 'group-hover:text-blue-400',
  },
  fuchsia: {
    hoverBorder: 'hover:border-fuchsia-500/50',
    hoverShadow: 'hover:shadow-fuchsia-900/20',
    badgeBg: 'bg-fuchsia-900/30',
    badgeText: 'text-fuchsia-300',
    titleHover: 'group-hover:text-fuchsia-400',
  },
  emerald: {
    hoverBorder: 'hover:border-emerald-500/50',
    hoverShadow: 'hover:shadow-emerald-900/20',
    badgeBg: 'bg-emerald-900/30',
    badgeText: 'text-emerald-300',
    titleHover: 'group-hover:text-emerald-400',
  },
  slate: {
    hoverBorder: 'hover:border-slate-600/70',
    hoverShadow: 'hover:shadow-slate-900/30',
    badgeBg: 'bg-slate-800/70',
    badgeText: 'text-slate-200',
    titleHover: 'group-hover:text-slate-50',
  },
};

const initialProjects: Project[] = [
  {
    title: 'AI Workflows Hackathon',
    badge: 'Fractal Tech',
    description:
      'Built a multi-agent educational app using CrewAI and OpenAI. Agents automatically summarized Arxiv papers and generated quiz content for students.',
    tags: ['#CrewAI', '#Python', '#LLM'],
    accent: 'blue',
    href: 'https://github.com/EmmS21/AIWorkflowsHackathon',
  },
  {
    title: 'Artist Analytics Site',
    badge: 'Personal',
    description:
      'A responsive TypeScript site integrating the Spotify API. Displayed real-time streaming stats and resulted in a 30% increase in engagement for the artist.',
    tags: ['#TypeScript', '#SpotifyAPI', '#Analytics'],
    accent: 'fuchsia',
  },
  {
    title: 'AI Shopping Assistant',
    badge: 'E-Comm',
    description:
      'Virtual assistant built with Google Gemini and Taipy GUI. Handled conversational product search and managed cart state via Firestore.',
    tags: ['#Gemini', '#Firestore', '#Python'],
    accent: 'emerald',
    href: 'https://github.com/XVI-Adam/gemini-jewelry-chatbot',
  },
];

const createBlankProject = (): Project => ({
  title: '',
  badge: 'Personal',
  description: '',
  tags: [],
  href: '',
  accent: 'slate',
});

export default function ResumePage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProject, setNewProject] = useState<Project>(createBlankProject());
  const [tagInput, setTagInput] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleAddTag = () => {
    const cleaned = tagInput.trim();
    if (!cleaned) return;

    const tag = cleaned.startsWith('#') ? cleaned : `#${cleaned}`;
    if (newProject.tags.includes(tag)) {
      setTagInput('');
      return;
    }

    setNewProject((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewProject((prev) => ({ ...prev, tags: prev.tags.filter((tag) => tag !== tagToRemove) }));
  };

  const handleProjectSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newProject.title.trim() || !newProject.description.trim()) {
      setFormError('Add a title and description before saving.');
      return;
    }

    const cleanedTags = newProject.tags.length ? newProject.tags : ['#Project'];
    const href = newProject.href?.trim();

    setProjects((prev) => [
      ...prev,
      {
        ...newProject,
        title: newProject.title.trim(),
        badge: newProject.badge.trim() || 'Personal',
        description: newProject.description.trim(),
        tags: cleanedTags,
        href: href ? href : undefined,
      },
    ]);

    setNewProject(createBlankProject());
    setTagInput('');
    setFormError(null);
    setIsAddingProject(false);
  };

  const handleCancel = () => {
    setNewProject(createBlankProject());
    setTagInput('');
    setFormError(null);
    setIsAddingProject(false);
  };

  const handleTagKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      handleAddTag();
    }
  };

  const ProjectCard = ({ project }: { project: Project }) => {
    const accent = accentStyles[project.accent];
    const className = `group block p-6 rounded-xl bg-gradient-to-br from-slate-900 to-slate-900 border border-slate-800 transition-all hover:shadow-lg ${accent.hoverBorder} ${accent.hoverShadow}`;

    const content = (
      <>
        <div className="flex justify-between items-start mb-4">
          <h3 className={`text-lg font-bold text-white ${accent.titleHover}`}>{project.title}</h3>
          <span className={`text-xs px-2 py-1 rounded ${accent.badgeBg} ${accent.badgeText}`}>{project.badge}</span>
        </div>
        <p className="text-slate-400 text-sm mb-4 leading-relaxed">{project.description}</p>
        <div className="flex gap-2 flex-wrap text-xs text-slate-500 font-mono">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </>
    );

    return project.href ? (
      <a href={project.href} target="_blank" rel="noreferrer" className={className}>
        {content}
      </a>
    ) : (
      <div className={className}>{content}</div>
    );
  };

  return (
    <PageShell title="Resume & Career" subtitle="Software Developer with Ops & Full Stack Experience.">
      
      {/* 1. PROFESSIONAL SUMMARY */}
      <section className="mb-16 max-w-3xl">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
          <span className="h-1 w-8 bg-blue-500 rounded-full"></span>
          Professional Summary
        </h2>
        <p className="text-slate-300 leading-relaxed text-lg">
          Software Developer focused on building internal tools with robust reliability. 
          Skilled in logging, error handling, config management, and full lifecycle delivery. 
          I specialize in optimizing warehouse workflows and automating data operations for high-volume environments.
        </p>
      </section>

      {/* 2. EXPERIENCE (Timeline) */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
          <span className="h-1 w-8 bg-indigo-500 rounded-full"></span>
          Work Experience
        </h2>
        
        <div className="border-l-2 border-slate-800 pl-8 ml-2 space-y-12">
          
          {/* Role: Sigo Signs */}
          <div className="relative group">
            {/* Timeline Dot */}
            <span className="absolute -left-[41px] top-1 h-5 w-5 rounded-full border-4 border-slate-950 bg-indigo-500 group-hover:scale-125 transition-transform"></span>
            
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
              <h3 className="text-2xl font-bold text-white">Associate Software Developer | Internal Tools</h3>
              <span className="text-indigo-400 font-mono text-sm">Oct 2025 — Present</span>
            </div>
            <div className="text-slate-500 mb-4">Sigo Signs • Norwood, NJ</div>
            
            <ul className="list-disc pl-4 space-y-3 text-slate-300 leading-relaxed marker:text-indigo-500/50">
              <li>
                Built internal tools (ASIN Dimensions, Bed Sizes, Report Damages) that improved warehouse efficiency and normalized critical data.
              </li>
              <li>
                Developed <span className="text-white font-medium">Python automation for 100k+ file operations</span> using throttling, retries, and permission-aware handling (WinError 5).
              </li>
              <li>
                Engineered a performant "Order List" dashboard in <span className="text-white font-medium">Next.js + TypeScript</span>, featuring debounce refresh, global search, and multi-criteria filtering.
              </li>
              <li>
                Optimized server-side pagination for <span className="text-white font-medium">6,000+ active orders</span> using Prisma queryRaw + SQL stored procedures with window functions.
              </li>
              <li>
                Built and deployed a .NET Core Web API with Swagger documentation for seamless internal use.
              </li>
              <li>
                Implemented production-grade observability: structured logs, CSV audit trails, and rollback artifacts.
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* 3. SKILLS */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
           <span className="h-1 w-8 bg-emerald-500 rounded-full"></span>
           Technical Arsenal
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                <h3 className="text-emerald-400 text-sm font-mono uppercase tracking-wider mb-4">Languages</h3>
                <div className="flex flex-wrap gap-2">
                    {["Python (Automation/CLI)", "TypeScript", "Node.js", "C# / .NET", "SQL / T-SQL", "Java", "Next.js"].map(tech => (
                        <span key={tech} className="px-3 py-1 bg-slate-800 text-slate-200 rounded-md text-sm border border-slate-700">
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
            
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                <h3 className="text-emerald-400 text-sm font-mono uppercase tracking-wider mb-4">Core Stack & Tools</h3>
                <div className="flex flex-wrap gap-2">
                    {["React", "Prisma", "MongoDB", "Firestore", "Supabase", "LangChain", "Git", "Docker"].map(tech => (
                        <span key={tech} className="px-3 py-1 bg-slate-800 text-slate-200 rounded-md text-sm border border-slate-700">
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* 4. EDUCATION */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
           <span className="h-1 w-8 bg-fuchsia-500 rounded-full"></span>
           Education
        </h2>
        <div className="bg-slate-900/30 p-8 rounded-2xl border border-slate-800/50">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="text-xl font-bold text-white">Manhattan University</h3>
                    <p className="text-slate-400">Riverdale, NY</p>
                </div>
                <span className="text-slate-500 font-mono text-sm">Graduated May 2025</span>
            </div>
            <p className="text-fuchsia-400 font-medium mb-4">B.S. Computer Information Systems, Minor in CS (GPA 3.06)</p>
            
            <div className="space-y-2 text-sm text-slate-400">
                <p><strong className="text-slate-300">Activities:</strong> ACM Club, GDSC Club Lead Tech Dev, Division 1 eSports Athlete (Super Smash Bros Ultimate), CodePath, ColorStack.</p>
                <p><strong className="text-slate-300">Coursework:</strong> Data Structures & Algo I/II, Database Systems, Data Mining, Business Statistics.</p>
            </div>
        </div>
      </section>

      {/* 5. THE VAULT (Extended Projects) */}
      <section>
        <div className="flex items-end gap-4 mb-8">
            <h2 className="text-3xl font-bold text-white">The Project Vault</h2>
            <p className="text-slate-500 pb-1 mb-1">Experiments that didn&apos;t fit on the resume.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <ProjectCard key={`${project.title}-${index}`} project={project} />
            ))}

            {isAddingProject ? (
              <form
                onSubmit={handleProjectSubmit}
                className="md:col-span-2 space-y-4 p-6 rounded-xl bg-slate-900/40 border border-slate-800"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-white font-semibold">Add a project</p>
                    <p className="text-xs text-slate-500">Drop in a quick description, link, and tags/tech.</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-widest text-slate-500">Accent</label>
                    <select
                      value={newProject.accent}
                      onChange={(event) => {
                        setFormError(null);
                        setNewProject((prev) => ({ ...prev, accent: event.target.value as Accent }));
                      }}
                      className="bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg px-3 py-2"
                    >
                      <option value="blue">Blue</option>
                      <option value="fuchsia">Fuchsia</option>
                      <option value="emerald">Emerald</option>
                      <option value="slate">Slate</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">Project title</label>
                    <input
                      value={newProject.title}
                      onChange={(event) => {
                        setFormError(null);
                        setNewProject((prev) => ({ ...prev, title: event.target.value }));
                      }}
                      className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
                      placeholder="Warehouse automations, finance tool, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">Badge / context</label>
                    <input
                      value={newProject.badge}
                      onChange={(event) => {
                        setFormError(null);
                        setNewProject((prev) => ({ ...prev, badge: event.target.value }));
                      }}
                      className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
                      placeholder="Personal, Client, Hackathon..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Description</label>
                  <textarea
                    value={newProject.description}
                    onChange={(event) => {
                      setFormError(null);
                      setNewProject((prev) => ({ ...prev, description: event.target.value }));
                    }}
                    rows={3}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
                    placeholder="What you built, tech used, and the outcome."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">Link (optional)</label>
                    <input
                      value={newProject.href}
                      onChange={(event) => {
                        setFormError(null);
                        setNewProject((prev) => ({ ...prev, href: event.target.value }));
                      }}
                      type="url"
                      className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
                      placeholder="https://github.com/your-project"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">Tags / tech (press Enter)</label>
                    <div className="flex gap-2">
                      <input
                        value={tagInput}
                        onChange={(event) => setTagInput(event.target.value)}
                        onKeyDown={handleTagKeyDown}
                        className="flex-1 rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
                        placeholder="#TypeScript"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-3 py-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700"
                      >
                        Add
                      </button>
                    </div>
                    {newProject.tags.length ? (
                      <div className="flex flex-wrap gap-2">
                        {newProject.tags.map((tag) => (
                          <span
                            key={tag}
                            className="flex items-center gap-2 px-2 py-1 rounded-full bg-slate-800 text-xs text-slate-200 border border-slate-700"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="text-slate-500 hover:text-white focus:outline-none"
                            >
                              x
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">Example: #Automation, #React, #Prisma</p>
                    )}
                  </div>
                </div>

                {formError ? <p className="text-sm text-amber-300">{formError}</p> : null}

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors"
                  >
                    Save project
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors border border-slate-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingProject(true)}
                className="group p-6 rounded-xl bg-slate-900/30 border border-slate-800 border-dashed hover:border-slate-600 transition-all flex flex-col justify-center items-center text-center cursor-pointer"
              >
                <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 group-hover:bg-slate-700 transition-colors">
                    <span className="text-2xl text-slate-400">+</span>
                </div>
                <h3 className="text-slate-300 font-medium">Add Your Next Project</h3>
                <p className="text-slate-500 text-sm mt-2">
                    Use this space for finance algorithms, fitness apps, or other experiments.
                </p>
              </button>
            )}

        </div>
      </section>

    </PageShell>
  );
}
