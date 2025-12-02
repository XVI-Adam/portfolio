import SpotlightCard from '@/components/ui/SpotlightCard';


export default function Home() {
  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-24">
      
      {/* Hero Section */}
      <section className="mb-20 space-y-4">
        <h1 className="text-5xl font-bold tracking-tight text-white mb-2">
          Adam Martinez
        </h1>
        <h2 className="text-xl text-slate-400 font-medium">
          Software Developer, AI Builder & Systems-Driven Artist Manager.
        </h2>
        <p className="max-w-2xl text-slate-500 leading-relaxed">
          Based in NYC. I blend full-stack engineering with artist management and financial modeling. 
          Currently working in tech while building the future of artist resources at Mistxxked.
        </p>
      </section>

      {/* Choose Your Track */}
      <section>
        <div className="mb-8 flex items-center gap-2">
          <div className="h-px flex-1 bg-slate-800"></div>
          <span className="text-xs uppercase tracking-widest text-slate-600">Explore Worlds</span>
          <div className="h-px flex-1 bg-slate-800"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <div className="md:col-span-2">
            <SpotlightCard
              title="Resume & Career"
              description="My professional history in software engineering. Tech stack, experience, and education."
              href="/resume"
              color="rgba(56, 189, 248, 0.15)" // Light Blue
            />
          </div>

          <SpotlightCard
            title="Tech Consulting"
            description="Freelance services: Full-stack dev, AI agents, and automation for your business."
            href="/consulting"
            color="rgba(99, 102, 241, 0.15)" // Indigo
          />

          <SpotlightCard
            title="Finance Lab"
            description="Personal finance tools, loan payoff simulators, and experimental dashboards."
            href="/finance"
            color="rgba(16, 185, 129, 0.15)" // Emerald
          />

          <SpotlightCard
            title="Music / Mistxxked"
            description="Artist management for Drxxco14. NYC artist resources and future AI tools."
            href="/music"
            color="rgba(217, 70, 239, 0.15)" // Fuchsia
          />

          <div className="md:col-span-2 lg:col-span-1">
             <SpotlightCard
              title="Health & Performance"
              description="Calisthenics tracking, push-up leaderboards, and productivity systems."
              href="/health"
              color="rgba(249, 115, 22, 0.15)" // Orange
            />
          </div>

        </div>
      </section>
    </div>
  );
}
