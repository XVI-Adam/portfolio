import { PageShell } from '@/components/layout/PageShell';

export default function ResumePage() {
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
            
            {/* Resume Project 1: AI Hackathon */}
            <div className="group p-6 rounded-xl bg-gradient-to-br from-slate-900 to-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-900/20">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">AI Workflows Hackathon</h3>
                    <span className="text-xs bg-blue-900/30 text-blue-300 px-2 py-1 rounded">Fractal Tech</span>
                </div>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                    Built a multi-agent educational app using CrewAI and OpenAI. Agents automatically summarized Arxiv papers and generated quiz content for students.
                </p>
                <div className="flex gap-2 text-xs text-slate-500 font-mono">
                    <span>#CrewAI</span>
                    <span>#Python</span>
                    <span>#LLM</span>
                </div>
            </div>

            {/* Resume Project 2: Music Site */}
            <div className="group p-6 rounded-xl bg-gradient-to-br from-slate-900 to-slate-900 border border-slate-800 hover:border-fuchsia-500/50 transition-all hover:shadow-lg hover:shadow-fuchsia-900/20">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-white group-hover:text-fuchsia-400 transition-colors">Artist Analytics Site</h3>
                    <span className="text-xs bg-fuchsia-900/30 text-fuchsia-300 px-2 py-1 rounded">Personal</span>
                </div>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                    A responsive TypeScript site integrating the Spotify API. Displayed real-time streaming stats and resulted in a 30% increase in engagement for the artist.
                </p>
                <div className="flex gap-2 text-xs text-slate-500 font-mono">
                    <span>#TypeScript</span>
                    <span>#SpotifyAPI</span>
                    <span>#Analytics</span>
                </div>
            </div>
            
            {/* Resume Project 3: Jewelry AI */}
            <a
              href="https://github.com/XVI-Adam/gemini-jewelry-chatbot"
              target="_blank"
              rel="noreferrer"
              className="group block p-6 rounded-xl bg-gradient-to-br from-slate-900 to-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all hover:shadow-lg hover:shadow-emerald-900/20"
            >
              <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">AI Shopping Assistant</h3>
                  <span className="text-xs bg-emerald-900/30 text-emerald-300 px-2 py-1 rounded">E-Comm</span>
              </div>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                  Virtual assistant built with Google Gemini and Taipy GUI. Handled conversational product search and managed cart state via Firestore.
              </p>
              <div className="flex gap-2 text-xs text-slate-500 font-mono">
                  <span>#Gemini</span>
                  <span>#Firestore</span>
                  <span>#Python</span>
              </div>
            </a>

            {/* NEW SLOT: Add your extra project here */}
            <div className="group p-6 rounded-xl bg-slate-900/30 border border-slate-800 border-dashed hover:border-slate-600 transition-all flex flex-col justify-center items-center text-center cursor-pointer">
                <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 group-hover:bg-slate-700 transition-colors">
                    <span className="text-2xl text-slate-400">+</span>
                </div>
                <h3 className="text-slate-300 font-medium">Add Your Next Project</h3>
                <p className="text-slate-500 text-sm mt-2">
                    Use this space for finance algorithms, fitness apps, or other experiments.
                </p>
            </div>

        </div>
      </section>

    </PageShell>
  );
}
