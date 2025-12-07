import { PageShell } from '@/components/layout/PageShell';

export default function FinancePage() {
  return (
    <PageShell title="Finance Lab" subtitle="Experiments in personal finance engineering.">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Project Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
            <div className="text-emerald-500 text-xs font-mono mb-2">ACTIVE EXPERIMENT</div>
            <h3 className="text-white font-bold mb-2">Student Loan Payoff Sim</h3>
            <p className="text-slate-400 text-sm mb-4">
                A Python-based calculator comparing Avalanche vs. Snowball methods against my specific interest rates.
            </p>
            <div className="bg-slate-950 p-2 rounded text-xs font-mono text-emerald-400 overflow-x-auto">
                $35/hr allocation logic...
            </div>
        </div>

        {/* Placeholder Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg opacity-60">
            <div className="text-slate-500 text-xs font-mono mb-2">COMING SOON</div>
            <h3 className="text-white font-bold mb-2">Crypto Sentiment Bot</h3>
            <p className="text-slate-400 text-sm">
                Scraping social sentiment to analyze memecoin trends.
            </p>
        </div>

      </div>
    </PageShell>
  );
}