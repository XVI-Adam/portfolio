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
                    <span className="text-slate-200">Push / Calisthenics</span>
                </li>
                <li className="flex justify-between text-sm">
                    <span className="text-slate-400">Tuesday</span>
                    <span className="text-slate-200">Pull / Grip</span>
                </li>
                <li className="flex justify-between text-sm">
                    <span className="text-slate-400">Wednesday</span>
                    <span className="text-slate-200">Legs / Mobility</span>
                </li>
            </ul>
        </div>
      </div>
    </PageShell>
  );
}