import Link from 'next/link';

interface PageShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  backText?: string;
}

export function PageShell({ title, subtitle, children, backText = "Back to Hub" }: PageShellProps) {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12 min-h-screen">
      <Link 
        href="/" 
        className="text-sm text-slate-500 hover:text-white transition-colors mb-8 inline-block hover-target"
      >
        ← {backText}
      </Link>
      
      <header className="mb-12 border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
        <p className="text-slate-400 text-lg">{subtitle}</p>
      </header>
      
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {children}
      </div>
    </div>
  );
}