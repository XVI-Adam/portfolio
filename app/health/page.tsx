import { PageShell } from '@/components/layout/PageShell';

export default function HealthPage() {
  return (
    <PageShell title="Health & Performance" subtitle="Optimizing the human operating system.">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Stat Card */}
        <div className="bg-slate-900 border border-orange-900/30 p-6 rounded-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-32 bg-orange-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
             <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Push-up Counter</h3>
             <div className="text-5xl font-bold text-white mb-2">1,240</div>
             <p className="text-orange-400 text-sm">Year to date</p>
        </div>

        {/* Routine */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-white font-bold mb-4">Current Split</h3>
            <ul className="space-y-3">
                <li className="flex justify-between text-sm">
                    <span className="text-slate-400">Monday</span>
                    <span className="text-slate-200">Legs / Mobility</span>
                </li>
                <li className="flex justify-between text-sm">
                    <span className="text-slate-400">Tuesday</span>
                    <span className="text-slate-200">Calisthenics / Pull Day</span>
                </li>
                <li className="flex justify-between text-sm">
                    <span className="text-slate-400">Wednesday</span>
                    <span className="text-slate-200">Push Day / Calisthenics</span>
                </li>
                <li className="flex justify-between text-sm">
                    <span className="text-slate-400">Thursday</span>
                    <span className="text-slate-200">Basketball / Stretches</span>
                </li>
            </ul>
        </div>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="relative lg:col-span-2 overflow-hidden rounded-2xl border border-orange-900/40 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8">
          <div className="absolute -right-16 -top-16 h-52 w-52 bg-orange-500/20 rounded-full blur-3xl"></div>
          <div className="absolute left-6 -bottom-10 h-44 w-44 bg-amber-400/10 rounded-full blur-3xl"></div>
          
          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs font-mono uppercase text-orange-300 mb-2">Personal Project</p>
              <h3 className="text-2xl font-bold text-white mb-2">Pushup Timer League</h3>
              <p className="text-slate-200 leading-relaxed">
                Push-up timer built for accountability. Tracks rep goals, keeps the clock running, and updates a live leaderboard for the crew.
              </p>
            </div>
            <a
              href="https://pushup-timer-league.lovable.app/"
              target="_blank"
              rel="noreferrer"
              className="relative inline-flex items-center gap-2 rounded-lg border border-orange-500/50 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-200 hover:bg-orange-500/20 transition-colors"
            >
              Open App →
            </a>
          </div>

          <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
            <div className="p-4 bg-slate-950/60 border border-orange-900/30 rounded-xl">
              <div className="text-sm font-semibold text-white mb-1">Timed Sessions</div>
              <p className="text-xs text-slate-400 leading-relaxed">Set 50/100/300 rep goals and log push-ups while the session clock keeps pace.</p>
            </div>
            <div className="p-4 bg-slate-950/60 border border-orange-900/30 rounded-xl">
              <div className="text-sm font-semibold text-white mb-1">Live Leaderboard</div>
              <p className="text-xs text-slate-400 leading-relaxed">Top runs ranked by completion time with real-time updates from Supabase channels.</p>
            </div>
            <div className="p-4 bg-slate-950/60 border border-orange-900/30 rounded-xl">
              <div className="text-sm font-semibold text-white mb-1">Session Save</div>
              <p className="text-xs text-slate-400 leading-relaxed">Sign in to store workouts and keep weekly progress tied to your profile.</p>
            </div>
          </div>

          <div className="relative mt-6 flex flex-wrap gap-2 text-xs text-orange-200 font-mono">
            <span className="px-2 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">Supabase + React</span>
            <span className="px-2 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">Real-time Postgres changes</span>
            <span className="px-2 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">Leaderboard by rep goal</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h4 className="text-white font-bold text-lg">How I run sessions</h4>
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex gap-3">
              <span className="text-orange-400">•</span>
              <span>Pick a target rep count (usually 100) and start the timer to keep rest strict.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-orange-400">•</span>
              <span>Tap in reps after each set so the app totals volume and pace without breaking focus.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-orange-400">•</span>
              <span>Save the run to push leaderboard updates to friends in real time.</span>
            </li>
          </ul>
          
          <div className="rounded-xl border border-orange-900/40 bg-orange-500/5 p-4">
            <p className="text-xs uppercase font-bold text-orange-300 mb-1">Live link</p>
            <a
              href="https://pushup-timer-league.lovable.app/"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-white font-semibold hover:text-orange-200 transition-colors"
            >
              pushup-timer-league.lovable.app
            </a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
