import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Loader from '@/components/shared/Loader';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Adam Martinez | Full-Stack Developer',
  description: 'Full-stack developer, AI enthusiast, and systems thinker based in NYC.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 text-slate-200 antialiased`}>
        <Loader />
        <main className="min-h-screen flex flex-col items-center">
            {children}
        </main>
      </body>
    </html>
  );
}
