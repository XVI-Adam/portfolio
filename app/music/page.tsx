import { PageShell } from '@/components/layout/PageShell';

export default function MusicPage() {
  return (
    <PageShell title="Music / Mistxxked" subtitle="Artist Management & NYC Resources.">
      
      {/* Artist Section */}
      <section className="mb-12">
        <div className="bg-gradient-to-br from-fuchsia-900/20 to-purple-900/20 border border-fuchsia-500/20 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 bg-slate-800 rounded-full flex items-center justify-center text-xs text-slate-500">
                
            </div>
            <div>
                <h2 className="text-2xl font-bold text-white">Drxxco14</h2>
                <p className="text-fuchsia-300 text-sm mb-4">Managed Artist</p>
                <p className="text-slate-300 text-sm leading-relaxed max-w-lg">
                    Focusing on digital presence optimization and local venue bookings. 
                    Currently planning the Summer 2026 EP rollout.
                </p>
            </div>
        </div>
      </section>

      {/* Vision Section */}
      <section>
          <h3 className="text-xl font-bold text-white mb-4">Mistxxked Magazine Vision</h3>
          <p className="text-slate-400 mb-6">
              Building a centralized hub for NYC underground artists to find affordable studios, 
              trustworthy videographers, and marketing playbooks.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded text-center">
                  <span className="block text-2xl mb-1">🎙️</span>
                  <span className="text-sm text-slate-300">Studio Finder</span>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded text-center">
                  <span className="block text-2xl mb-1">🤖</span>
                  <span className="text-sm text-slate-300">AI Manager</span>
              </div>
          </div>
      </section>
    </PageShell>
  );
}