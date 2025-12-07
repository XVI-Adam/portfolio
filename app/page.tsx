import SpotlightCard from '@/components/ui/SpotlightCard';
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-12 md:py-24">
      
      {/* HERO SECTION */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
        
        {/* Left Column: Text */}
        <div className="space-y-6 relative z-10">
          <div className="inline-block">
             <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-2">
              <span className="bg-gradient-to-r from-amber-200 via-orange-400 to-red-400 bg-clip-text text-transparent pb-2">
                Adam Martinez
              </span>
            </h1>
          </div>

          <h2 className="text-xl md:text-2xl text-slate-300 font-medium">
            Software Developer, AI Builder & <span className="text-orange-300"> Artist Manager</span>.
          </h2>
          
          <p className="max-w-xl text-slate-400 leading-relaxed text-lg">
            Based in NYC. I blend full-stack engineering with artist management and financial modeling. 
            Currently working in tech while building the future of artist resources at Mistxxked.
          </p>
        </div>

        {/* Right Column: Image & Glow */}
        <div className="relative flex justify-center md:justify-end group">
           <div className="absolute -inset-4 bg-gradient-to-r from-orange-600 to-amber-600 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
           
           {/* IMAGE CONTAINER */}
           <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden border-2 border-slate-800 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500 bg-slate-900">
               <Image  
                 src="/profilePic.jpeg"  
                 alt="Adam Martinez" 
                 fill 
                 className="object-cover"
                 priority
               />
           </div>
        </div>
      </section>

      {/* CHOOSE YOUR TRACK */}
      <section>
        <div className="mb-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
          <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Select a World</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <SpotlightCard
              title="Resume & Career"
              description="My professional history in software engineering. Tech stack, experience, and education."
              href="/resume"
              color="rgba(56, 189, 248, 0.15)"
            />
          </div>

          <SpotlightCard
            title="Tech Consulting"
            description="Freelance services: Full-stack dev, AI agents, and automation for your business."
            href="/consulting"
            color="rgba(251, 146, 60, 0.15)"
          />

          <SpotlightCard
            title="Finance Lab"
            description="Personal finance tools, loan payoff simulators, and experimental dashboards."
            href="/finance"
            color="rgba(16, 185, 129, 0.15)"
          />

          <SpotlightCard
            title="Music / Mistxxked"
            description="Artist management for Drxxco14. NYC artist resources and future AI tools."
            href="/music"
            color="rgba(217, 70, 239, 0.15)"
          />

          <div className="md:col-span-2 lg:col-span-1">
             <SpotlightCard
              title="Health & Performance"
              description="Calisthenics tracking, push-up leaderboards, and productivity systems."
              href="/health"
              color="rgba(249, 115, 22, 0.15)"
            />
          </div>
        </div>
      </section>
    </div>
  );
}