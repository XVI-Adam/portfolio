'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';

interface SpotlightCardProps {
  title: string;
  description: string;
  href: string;
  color?: string; // Optional accent color
}

export default function SpotlightCard({ title, description, href, color = "rgba(255,255,255,0.1)" }: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <Link href={href} className="block h-full w-full">
      <div
        ref={divRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsFocused(true)}
        onMouseLeave={() => setIsFocused(false)}
        className="relative h-full w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition-colors hover:border-slate-700 group hover-target"
      >
        {/* Spotlight Effect */}
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${color}, transparent 40%)`,
          }}
        />
        
        {/* Content */}
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-slate-100 mb-2">{title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </Link>
  );
}
