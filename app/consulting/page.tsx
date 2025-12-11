import { PageShell } from '@/components/layout/PageShell';
import Link from 'next/link';

export default function ConsultingPage() {
  return (
    <PageShell title="Tech Consulting" subtitle="Helping businesses automate and scale.">
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Service 1 */}
        <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-indigo-500/50 transition-colors">
          <h3 className="text-xl font-bold text-white mb-2">Web Development</h3>
          <p className="text-slate-400 text-sm mb-4">
            Custom websites and dashboards built with Next.js. Fast, SEO-optimized, and easy to manage.
          </p>
          <ul className="text-slate-500 text-xs list-disc pl-4 space-y-1">
            <li>Landing Pages</li>
            <li>CMS Integration</li>
            <li>Interactive Portfolios</li>
          </ul>
        </div>

        {/* Service 2 */}
        <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-indigo-500/50 transition-colors">
          <h3 className="text-xl font-bold text-white mb-2">Automation & AI</h3>
          <p className="text-slate-400 text-sm mb-4">
            Streamline your workflows with Python scripts and AI agent integrations.
          </p>
           <ul className="text-slate-500 text-xs list-disc pl-4 space-y-1">
            <li>Data Scraping</li>
            <li>Automated Reporting</li>
            <li>OpenAI API Integration</li>
          </ul>
        </div>
      </div>

      <section className="bg-gradient-to-r from-indigo-900/20 to-blue-900/20 p-8 rounded-2xl border border-indigo-500/30 text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Ready to build?</h3>
        <p className="text-slate-300 mb-6">I am currently accepting new projects for Q4 2025.</p>
        <Link 
          href="mailto:adammartinez.martinez2@gmail.com?subject=Consulting%20Inquiry"
          className="bg-white text-slate-950 px-6 py-3 rounded-full font-bold hover:bg-slate-200 transition-transform hover:scale-105 inline-block hover-target"
        >
          Contact Me
        </Link>
      </section>
    </PageShell>
  );
}