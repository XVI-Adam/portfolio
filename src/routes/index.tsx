import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';

export default function Portfolio() {
  const [time, setTime] = useState(new Date());
  const [tipAmount, setTipAmount] = useState(5);
  const [tipsLoading, setTipsLoading] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [userId] = useState(`user_${Math.random().toString(36).slice(2, 9)}`);
  const [aliens, setAliens] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, centerX: 0, centerY: 0 });
  const [visibleSections, setVisibleSections] = useState({});
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const canvasRef = useRef(null);
  const sectionRefs = useRef({});

  const tips = [
    'Buy me a slice of pizza 🍕',
    'Coffee fuel appreciated ☕',
    'AI model training costs are real 💸',
    'Help me build the next big thing 🚀',
    'Artist management fund 🎵',
    'Server bills add up quick 🖥️',
  ];

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const centerX = e.clientX - window.innerWidth / 2;
      const centerY = e.clientY - window.innerHeight / 2;
      setMousePos({
        x: e.clientX,
        y: e.clientY,
        centerX,
        centerY,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => ({ ...prev, [entry.target.id]: true }));
        }
      });
    }, { threshold: 0.15 });

    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileNavOpen]);

  useEffect(() => {
    const newAliens = Array.from({ length: 4 }).map((_, i) => ({
      id: i,
      x: Math.random() * 80,
      y: Math.random() * 80,
      delay: i * 0.5,
      depth: 0.08 + i * 0.03,
    }));
    setAliens(newAliens);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.fillStyle = '#05050f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 250; i++) {
      const x = Math.sin(i * 12.9898) * canvas.width * 0.5 + canvas.width * 0.5;
      const y = Math.cos(i * 78.233) * canvas.height * 0.5 + canvas.height * 0.5;
      const size = Math.random() * 1.5;
      const opacity = 0.3 + Math.random() * 0.6;
      ctx.fillStyle = `rgba(240, 242, 255, ${opacity})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  const handleTip = async () => {
    setTipsLoading(true);
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'tip',
          amount: Math.round(tipAmount * 100),
          user_id: userId
        })
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Error: ' + (data.error || 'Failed to create checkout'));
      }
    } catch (error) {
      alert('Payment error. Try again.');
    } finally {
      setTipsLoading(false);
      setShowTipModal(false);
    }
  };

  const scrollToSection = (sectionId) => {
    setMobileNavOpen(false);
    const element = sectionRefs.current[sectionId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatTime = () => {
    return time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  };

  const bgParallaxX = (mousePos.centerX || 0) * -0.15;
  const bgParallaxY = (mousePos.centerY || 0) * -0.15;

  return (
    <div className="min-h-screen bg-[#05050f] text-[#f0f0ff] font-sans overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
        
        * { box-sizing: border-box; }
        body { background: #05050f; color: #f0f0ff; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
        .display-font { font-family: 'Space Grotesk', sans-serif; }
        .mono-font { font-family: 'JetBrains Mono', monospace; }
        
        @keyframes orbitRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes shipDrift {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(15px, -20px) rotate(3deg); }
          50% { transform: translate(-10px, -35px) rotate(-2deg); }
          75% { transform: translate(-20px, -10px) rotate(4deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }

        @keyframes alienFloat {
          0% { transform: translate(0, 0) rotate(-5deg); }
          33% { transform: translate(40px, -30px) rotate(8deg); }
          66% { transform: translate(-20px, -60px) rotate(-10deg); }
          100% { transform: translate(0, 0) rotate(-5deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        @keyframes alienDrift1 {
          0% { transform: translate(0, 0) rotate(-5deg); }
          25% { transform: translate(60px, -40px) rotate(10deg); }
          50% { transform: translate(20px, -80px) rotate(-8deg); }
          75% { transform: translate(-40px, -50px) rotate(5deg); }
          100% { transform: translate(0, 0) rotate(-5deg); }
        }

        @keyframes alienDrift2 {
          0% { transform: translate(0, 0) rotate(8deg); }
          33% { transform: translate(-70px, 30px) rotate(-12deg); }
          66% { transform: translate(40px, 60px) rotate(15deg); }
          100% { transform: translate(0, 0) rotate(8deg); }
        }

        @keyframes alienDrift3 {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          20% { transform: translate(50px, 20px) rotate(20deg) scale(1.1); }
          40% { transform: translate(80px, -30px) rotate(35deg) scale(1); }
          60% { transform: translate(30px, -70px) rotate(15deg) scale(0.95); }
          80% { transform: translate(-30px, -40px) rotate(-10deg) scale(1.05); }
          100% { transform: translate(0, 0) rotate(0deg) scale(1); }
        }

        @keyframes shipFloat {
          0% { transform: translate(0, 0) rotate(-15deg); }
          20% { transform: translate(-40px, -30px) rotate(-5deg); }
          40% { transform: translate(-80px, 10px) rotate(-25deg); }
          60% { transform: translate(-50px, 40px) rotate(-10deg); }
          80% { transform: translate(-10px, 20px) rotate(-20deg); }
          100% { transform: translate(0, 0) rotate(-15deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-60px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3), inset 0 0 20px rgba(59, 130, 246, 0.1); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.5), inset 0 0 30px rgba(59, 130, 246, 0.2); }
        }

        @keyframes slideIn {
          from { transform: translateX(-100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes easterEggFloat {
          0% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-4px, -8px) scale(1.02); }
          50% { transform: translate(-8px, -14px) scale(1); }
          75% { transform: translate(-4px, -7px) scale(1.02); }
          100% { transform: translate(0, 0) scale(1); }
        }

        @keyframes spaceshipGlow {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.4)) drop-shadow(0 0 40px rgba(212, 160, 23, 0.2)); }
          50% { filter: drop-shadow(0 0 40px rgba(59, 130, 246, 0.6)) drop-shadow(0 0 60px rgba(212, 160, 23, 0.3)); }
        }

        .orbit-ring { animation: orbitRotate linear infinite; border-radius: 50%; }
        .orbit-1 { animation-duration: 6s; }
        .orbit-2 { animation-duration: 12s; animation-direction: reverse; }
        .orbit-3 { animation-duration: 20s; }
        .orbit-4 { animation-duration: 32s; animation-direction: reverse; }
        
        .spaceship { animation: shipDrift 18s ease-in-out infinite; }
        
        .space-alien { animation: alienDrift1 18s ease-in-out infinite; }
        .space-alien:nth-child(2) { animation: alienDrift2 22s ease-in-out infinite; }
        .space-alien:nth-child(3) { animation: alienDrift3 26s ease-in-out infinite; }
        .space-alien:nth-child(4) { animation: shipFloat 20s ease-in-out infinite; }

        .section-fade {
          animation: fadeIn 0.6s ease-out;
        }

        .section-visible {
          animation: slideInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards !important;
        }

        .card-glow {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .card-glow:hover {
          animation: glow 2s ease-in-out;
          transform: translateY(-8px);
        }

        .nav-slide {
          animation: slideIn 0.5s ease-out;
        }

        .btn-hover {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }

        .btn-hover:hover {
          transform: translateY(-3px);
          box-shadow: 0 0 40px rgba(59, 130, 246, 0.5) !important;
        }

        .btn-hover:active {
          transform: scale(0.95);
        }

        .modal-overlay {
          animation: fadeIn 0.3s ease-out;
        }

        .easter-egg-spaceship {
          animation: easterEggFloat 8s ease-in-out infinite;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .easter-egg-spaceship:hover {
          animation: easterEggFloat 8s ease-in-out infinite, spaceshipGlow 2s ease-in-out infinite;
          filter: drop-shadow(0 0 40px rgba(59, 130, 246, 0.8)) drop-shadow(0 0 80px rgba(212, 160, 23, 0.5));
        }

        html, body { scroll-behavior: smooth; }
      `}</style>

      <canvas ref={canvasRef} className="fixed inset-0 z-0" />

      <div className="fixed inset-0 pointer-events-none z-0 transition-transform duration-100" style={{
        background: 'radial-gradient(ellipse 55% 40% at 15% 25%, rgba(59,130,246,0.10) 0%, transparent 70%), radial-gradient(ellipse 45% 55% at 85% 75%, rgba(212,160,23,0.06) 0%, transparent 70%)',
        transform: `translate(${bgParallaxX}px, ${bgParallaxY}px)`
      }} />

      <div className="fixed inset-0 pointer-events-none z-5 overflow-hidden">
        {aliens.map(alien => {
          const offsetX = (mousePos.centerX || 0) * alien.depth;
          const offsetY = (mousePos.centerY || 0) * alien.depth;
          return (
            <div
              key={alien.id}
              className="space-alien absolute text-4xl cursor-pointer pointer-events-auto transition-transform duration-300"
              style={{
                left: `${alien.x}%`,
                top: `${alien.y}%`,
                animationDelay: `${alien.delay}s`,
                transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`
              }}
              onClick={() => alert('👽   👾   🛸 Space alien detected!')}
            >
              {alien.id === 0 && '👽'}
              {alien.id === 1 && '👾'}
              {alien.id === 2 && '🛸'}
              {alien.id === 3 && '👽'}
            </div>
          );
        })}
      </div>

      <div className="hidden sm:flex fixed top-4 left-4 w-16 sm:w-20 h-16 sm:h-20 z-50 pointer-events-none opacity-20 sm:opacity-25 hover:opacity-70 transition-opacity">
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <path d="M4 76 L4 4 L76 4" stroke="#3b82f6" strokeWidth="1.5" fill="none" />
          <path d="M4 24 L14 24" stroke="#3b82f6" strokeWidth="1" />
          <path d="M24 4 L24 14" stroke="#3b82f6" strokeWidth="1" />
          <circle cx="4" cy="4" r="3" fill="#3b82f6" opacity="0.7" />
        </svg>
      </div>
      <div className="hidden sm:flex fixed top-4 right-4 w-16 sm:w-20 h-16 sm:h-20 z-50 pointer-events-none opacity-20 sm:opacity-25 hover:opacity-70 transition-opacity" style={{ transform: 'scaleX(-1)' }}>
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <path d="M4 76 L4 4 L76 4" stroke="#3b82f6" strokeWidth="1.5" fill="none" />
          <path d="M4 24 L14 24" stroke="#3b82f6" strokeWidth="1" />
          <path d="M24 4 L24 14" stroke="#3b82f6" strokeWidth="1" />
          <circle cx="4" cy="4" r="3" fill="#3b82f6" opacity="0.7" />
        </svg>
      </div>
      <div className="hidden sm:flex fixed bottom-4 left-4 w-16 sm:w-20 h-16 sm:h-20 z-50 pointer-events-none opacity-20 sm:opacity-25 hover:opacity-70 transition-opacity" style={{ transform: 'scaleY(-1)' }}>
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <path d="M4 76 L4 4 L76 4" stroke="#3b82f6" strokeWidth="1.5" fill="none" />
          <path d="M4 24 L14 24" stroke="#3b82f6" strokeWidth="1" />
          <path d="M24 4 L24 14" stroke="#3b82f6" strokeWidth="1" />
          <circle cx="4" cy="4" r="3" fill="#3b82f6" opacity="0.7" />
        </svg>
      </div>
      <div className="hidden sm:flex fixed bottom-4 right-4 w-16 sm:w-20 h-16 sm:h-20 z-50 pointer-events-none opacity-20 sm:opacity-25 hover:opacity-70 transition-opacity" style={{ transform: 'scale(-1)' }}>
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <path d="M4 76 L4 4 L76 4" stroke="#3b82f6" strokeWidth="1.5" fill="none" />
          <path d="M4 24 L14 24" stroke="#3b82f6" strokeWidth="1" />
          <path d="M24 4 L24 14" stroke="#3b82f6" strokeWidth="1" />
          <circle cx="4" cy="4" r="3" fill="#3b82f6" opacity="0.7" />
        </svg>
      </div>

      <div className="hidden sm:block fixed top-28 left-5 z-50 pointer-events-none mono-font text-xs text-[#3b82f6] opacity-30 leading-relaxed tracking-wider hover:opacity-70 transition-opacity">
        <div>COORD 40.7128° N</div>
        <div>74.0060° W</div>
        <div>ALT 0.00 AU</div>
      </div>
      <div className="hidden sm:block fixed top-28 right-5 z-50 pointer-events-none mono-font text-xs text-[#3b82f6] opacity-30 leading-relaxed tracking-wider text-right hover:opacity-70 transition-opacity">
        <div>SYS NOMINAL</div>
        <div>SHIELDS 100%</div>
        <div>FUEL ████████ 94%</div>
      </div>
      <div className="hidden sm:block fixed bottom-28 left-5 z-50 pointer-events-none mono-font text-xs text-[#3b82f6] opacity-30 hover:opacity-70 transition-opacity">
        <div>{formatTime()}</div>
      </div>

      <nav className="nav-slide fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 sm:px-6 lg:px-8 h-14 sm:h-16 backdrop-blur-sm" style={{ background: 'linear-gradient(to bottom, rgba(4,6,14,0.92), rgba(4,6,14,0))' }}>
        <div className="flex items-center gap-2 hover:scale-105 transition-transform flex-shrink-0">
          <div className="w-8 h-8 bg-[#090d1c] border border-[#1a2240] rounded flex items-center justify-center mono-font text-xs font-bold text-[#3b82f6] tracking-wider hover:border-[#3b82f6] hover:shadow-lg hover:shadow-[rgba(59,130,246,0.4)] transition-all">XVI</div>
          <span className="hidden sm:inline display-font font-bold text-sm tracking-tight">Adam Martinez</span>
        </div>
        <div className="hidden md:flex gap-1">
          {[{ label: 'Home', id: 'hero' }, { label: 'About', id: 'about' }, { label: 'Projects', id: 'missions' }, { label: 'Contact', id: 'contact' }, { label: 'Resume', id: 'resume' }].map(item => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="display-font text-xs font-medium px-2.5 sm:px-3.5 py-2 rounded transition-all duration-300 text-[#a8b2d1] hover:text-[#f0f0ff] hover:bg-[rgba(59,130,246,0.13)]"
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 mono-font text-xs text-[#a8b2d1] hover:text-[#3b82f6] transition-colors">
            <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" style={{ boxShadow: '0 0 8px #10b981', animation: 'pulse 2s ease-in-out infinite' }} />
            <span>ONLINE · NYC</span>
          </div>
          <button
            onClick={() => setMobileNavOpen(open => !open)}
            className="md:hidden w-10 h-10 -mr-1 flex flex-col items-center justify-center gap-[5px] rounded border border-[#1a2240] bg-[#090d1c] active:border-[#3b82f6] transition-colors"
            aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileNavOpen}
            aria-controls="mobile-nav"
          >
            <span className={`block w-4 h-[1.5px] bg-[#3b82f6] transition-transform duration-300 ${mobileNavOpen ? 'translate-y-[6.5px] rotate-45' : ''}`} />
            <span className={`block w-4 h-[1.5px] bg-[#3b82f6] transition-opacity duration-200 ${mobileNavOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-4 h-[1.5px] bg-[#3b82f6] transition-transform duration-300 ${mobileNavOpen ? '-translate-y-[6.5px] -rotate-45' : ''}`} />
          </button>
        </div>
      </nav>

      <div
        className={`md:hidden fixed inset-0 z-30 transition-opacity duration-300 ${mobileNavOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'rgba(5,5,15,0.75)', backdropFilter: 'blur(4px)' }}
        onClick={() => setMobileNavOpen(false)}
        aria-hidden="true"
      />
      <div
        id="mobile-nav"
        className={`md:hidden fixed top-14 left-0 right-0 z-40 px-4 pb-4 transition-all duration-300 origin-top ${mobileNavOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none'}`}
        aria-hidden={!mobileNavOpen}
      >
        <div className="bg-[#090d1c] border border-[#1a2240] rounded-xl overflow-hidden shadow-2xl shadow-[rgba(0,0,0,0.6)]">
          {[{ label: 'Home', id: 'hero' }, { label: 'About', id: 'about' }, { label: 'Projects', id: 'missions' }, { label: 'Contact', id: 'contact' }, { label: 'Resume', id: 'resume' }].map(item => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              tabIndex={mobileNavOpen ? 0 : -1}
              className="display-font w-full text-left text-sm font-medium px-4 min-h-[48px] flex items-center border-b border-[#151c33] last:border-b-0 text-[#c3cce4] active:bg-[rgba(59,130,246,0.13)] active:text-[#f0f0ff] transition-colors"
            >
              {item.label}
            </button>
          ))}
          <a
            href="/adam-resume.pdf"
            download="AdamMartinez-Resume.pdf"
            tabIndex={mobileNavOpen ? 0 : -1}
            onClick={() => setMobileNavOpen(false)}
            className="display-font w-full text-sm font-semibold px-4 min-h-[48px] flex items-center gap-2 bg-[rgba(59,130,246,0.13)] text-[#3b82f6] border-t border-[#1a2240]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Resume
          </a>
        </div>
      </div>

      <div className="relative pt-14 sm:pt-16 z-10">
        <div id="hero" ref={el => el && (sectionRefs.current.hero = el)} className={`min-h-screen w-full flex items-center justify-center py-8 sm:py-16 section-fade ${visibleSections.hero ? 'section-visible' : ''}`}>
          <HeroSection scrollToSection={scrollToSection} />
        </div>

        <div id="about" ref={el => el && (sectionRefs.current.about = el)} className={`min-h-screen w-full flex items-center justify-center py-8 sm:py-16 section-fade ${visibleSections.about ? 'section-visible' : ''}`}>
          <AboutSection />
        </div>

        <div id="missions" ref={el => el && (sectionRefs.current.missions = el)} className={`min-h-screen w-full flex items-center justify-center py-8 sm:py-16 section-fade ${visibleSections.missions ? 'section-visible' : ''}`}>
          <MissionsSection scrollToSection={scrollToSection} />
        </div>

        <div id="contact" ref={el => el && (sectionRefs.current.contact = el)} className={`min-h-screen w-full flex items-center justify-center py-8 sm:py-16 section-fade ${visibleSections.contact ? 'section-visible' : ''}`}>
          <ContactSection />
        </div>

        <div id="resume" ref={el => el && (sectionRefs.current.resume = el)} className={`min-h-screen w-full flex items-center justify-center py-8 sm:py-16 section-fade ${visibleSections.resume ? 'section-visible' : ''}`}>
          <ResumeSection />
        </div>
      </div>

      <button
        onClick={() => setShowTipModal(true)}
        className="fixed z-40 w-12 sm:w-14 h-12 sm:h-14 bg-[#090d1c] border border-[#1a2240] rounded-full flex items-center justify-center text-xl sm:text-2xl hover:border-[#3b82f6] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all hover:scale-110 bottom-5 left-4 sm:bottom-8 sm:left-8"
        aria-label="Send tip"
      >
        💎
      </button>

      <Link
        to="/stack"
        className="easter-egg-spaceship fixed bottom-5 right-4 z-30 sm:bottom-12 sm:right-12 cursor-pointer hover:scale-110 group flex flex-col items-center gap-1 opacity-80 hover:opacity-100"
        title="Play Stack Tower — a block-stacking game"
        aria-label="Play Stack Tower, a block-stacking game"
      >
        <span className="inline-block text-3xl sm:text-7xl">🚀</span>
        <span className="mono-font text-[10px] tracking-widest text-[#3b82f6] bg-[#090d1c] border border-[#1a2240] rounded-full px-2 py-0.5 whitespace-nowrap group-hover:border-[#3b82f6] transition-colors">
          PLAY A GAME
        </span>
      </Link>

      {showTipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="bg-[#090d1c] border border-[#1a2240] rounded-2xl p-4 sm:p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="display-font text-lg sm:text-xl font-bold">Send a Tip</h3>
              <button
                onClick={() => setShowTipModal(false)}
                className="text-[#8892b0] hover:text-[#f0f0ff] text-xl"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm text-[#8892b0] mb-2">Tip Amount (USD)</label>
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center bg-[#0f1526] border border-[#1a2240] rounded px-3 py-2 min-h-[44px]">
                    <span className="text-[#8892b0] mr-1">$</span>
                    <input
                      type="number"
                      min="0.50"
                      step="0.01"
                      value={tipAmount}
                      onChange={(e) => setTipAmount(Math.max(0.50, parseFloat(e.target.value) || 0.50))}
                      placeholder="5.00"
                      className="flex-1 bg-transparent text-sm text-[#f0f0ff] focus:outline-none"
                    />
                  </div>
                </div>
                <p className="text-xs text-[#3b82f6] mt-1">Minimum $0.50</p>
              </div>
              <p className="text-xs text-[#a8b2d1] leading-relaxed">Your support helps keep the servers running!</p>
              <div className="flex gap-2 flex-col sm:flex-row">
                <button
                  onClick={() => setShowTipModal(false)}
                  className="flex-1 px-4 py-2 sm:py-2.5 border border-[#1a2240] rounded-lg text-[#8892b0] hover:border-[#3b82f6] transition-all min-h-[44px] flex items-center justify-center"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTip}
                  disabled={tipsLoading}
                  className="flex-1 px-4 py-2 sm:py-2.5 bg-[#3b82f6] text-white rounded-lg font-semibold hover:bg-[#60a5fa] disabled:opacity-50 min-h-[44px] flex items-center justify-center"
                >
                  {tipsLoading ? 'Loading...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HeroSection({ scrollToSection }) {
  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-center justify-center w-full px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="flex-1 w-full">
        <div className="display-font text-xs font-medium text-[#3b82f6] tracking-widest uppercase mb-4 sm:mb-5 flex items-center gap-2.5 hover:translate-x-1 transition-transform">
          <span className="block w-6 sm:w-8 h-[1px] bg-[#3b82f6]" />
          Mission Control · NYC
        </div>
        <h1 className="display-font text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight tracking-tighter mb-3 sm:mb-4 hover:text-[#60a5fa] transition-colors">
          Navigate<br />My <span className="text-[#3b82f6]">Universe</span><span className="text-[#8892b0] font-light">.</span>
        </h1>
        <p className="display-font text-base sm:text-lg lg:text-xl font-semibold text-[#f0f0ff] leading-snug mb-2 sm:mb-3 max-w-md">
          Founding / full-stack engineer building AI products <span className="text-[#3b82f6]">·</span> NYC.
        </p>
        <p className="text-sm sm:text-base text-[#a8b2d1] leading-relaxed mb-5 sm:mb-6 max-w-md">
          Sole developer on everything I've shipped — a Next.js order product running 6,000+ active orders, a Flutter app solo to production, and the x402 payment layer that lets an agent buy its own tool calls.
        </p>
        <div className="inline-flex items-center gap-2.5 mono-font text-xs text-[#3b82f6] bg-[rgba(59,130,246,0.09)] border border-[rgba(59,130,246,0.35)] rounded-full px-3 py-1.5 mb-5 sm:mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] flex-shrink-0" style={{ boxShadow: '0 0 8px #10b981' }} />
          <span className="tracking-wide">OPEN TO: FORWARD-DEPLOYED / SOLUTIONS / FULL-STACK · NYC</span>
        </div>
        <div className="flex gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={() => scrollToSection('missions')}
            className="display-font btn-hover px-4 sm:px-5.5 py-2 sm:py-2.75 bg-[#3b82f6] text-white rounded font-semibold text-xs sm:text-sm shadow-lg shadow-[rgba(59,130,246,0.3)] min-h-[44px] flex items-center justify-center"
          >
            View Projects
          </button>
          <a
            href="/adam-resume.pdf"
            download="AdamMartinez-Resume.pdf"
            className="display-font btn-hover px-4 sm:px-5.5 py-2 sm:py-2.75 bg-transparent border border-[#1a2240] text-[#f0f0ff] rounded font-medium text-xs sm:text-sm hover:border-[#3b82f6] hover:text-[#3b82f6] hover:bg-[rgba(59,130,246,0.13)] min-h-[44px] flex items-center justify-center"
          >
            Resume
          </a>
          <button
            onClick={() => scrollToSection('contact')}
            className="display-font btn-hover px-4 sm:px-5.5 py-2 sm:py-2.75 bg-transparent border border-[#1a2240] text-[#f0f0ff] rounded font-medium text-xs sm:text-sm hover:border-[#3b82f6] hover:text-[#3b82f6] hover:bg-[rgba(59,130,246,0.13)] min-h-[44px] flex items-center justify-center"
          >
            Get In Touch
          </button>
        </div>
      </div>

      <div className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 flex-shrink-0 flex items-center justify-center group mt-4 lg:mt-0">
        {[120, 220, 330, 420].map((size, i) => (
          <div
            key={i}
            className="orbit-ring absolute border border-[rgba(59,130,246,0.14)] group-hover:border-[rgba(59,130,246,0.3)] transition-all hidden sm:block"
            style={{ width: size * 0.6, height: size * 0.6, ...(i === 3 && { borderStyle: 'dashed', opacity: 0.4 }) }}
          />
        ))}
        <div className="absolute w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-white via-[#3b82f6] to-[rgba(59,130,246,0.2)] flex items-center justify-center font-bold text-xs mono-font text-[#05050f] tracking-wider shadow-lg hover:shadow-[0_0_50px_rgba(59,130,246,0.7)] transition-all" style={{ boxShadow: '0 0 30px rgba(59,130,246,0.6), 0 0 80px rgba(59,130,246,0.25)' }}>
          XVI
        </div>
      </div>
    </div>
  );
}

function AboutSection() {
  const shippedWith = ['TypeScript', 'Python', 'C#', 'Dart', 'SQL', 'React', 'Next.js', 'Flutter', 'Node.js', '.NET Core', 'PostgreSQL', 'Prisma', 'Firestore', 'Supabase', 'Firebase', 'Vercel'];

  const focus = [
    {
      area: 'Full-Stack Product',
      proof: 'Replaced a manual C#/.NET process with a Next.js + TypeScript order management product — data model, live status pipeline, ops dashboard — used daily across 6,000+ active orders.',
    },
    {
      area: 'Agentic / LLM Systems',
      proof: 'Schema-validated tool calling, multi-agent role boundaries, retrieval grounding, and x402 machine-to-machine payments across Claude, OpenAI, Gemini and Groq APIs. 52-case eval harness with four grading layers.',
    },
    {
      area: 'Mobile (Flutter)',
      proof: 'Shipped BodyCraft solo to web — skill progression, live battles arena, 117-workout library, real-time Firestore sync, Google/email auth.',
    },
    {
      area: 'Systems & Performance',
      proof: 'Python batch pipeline running 100k+ file operations a day with throttling, retries and CSV audit trails. Took a canvas scene from ~5fps back to 60fps idle at one draw call per frame.',
    },
  ];

  return (
    <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-9 animate-fadeIn mx-auto">
      <div className="card-glow bg-[#090d1c] border border-[#1a2240] rounded-2xl p-4 sm:p-5.5 relative group lg:self-start">
        <img src="/images/adam-photo.jpeg" alt="Adam Martinez" className="w-full aspect-[3/4] object-cover rounded mb-3 sm:mb-4 group-hover:shadow-[inset_0_0_30px_rgba(59,130,246,0.2)] transition-all" />
        <h3 className="display-font font-bold text-base sm:text-lg mb-0.5 group-hover:text-[#60a5fa] transition-colors">Adam Martinez</h3>
        <p className="mono-font text-xs text-[#3b82f6] mb-2 sm:mb-3">FOUNDING ENGINEER</p>
        <p className="text-xs sm:text-sm text-[#a8b2d1] leading-relaxed mb-3 group-hover:text-[#c3cce4] transition-colors">
          Full-stack engineer and sole developer on everything I've shipped. Founder of StackedLabs in NYC, previously internal tools at Sigo Signs. Manhattan University CIS grad, May 2025.
        </p>
        <p className="text-xs text-[#7f8aa8] leading-relaxed mb-3 sm:mb-3.5 border-l border-[#1a2240] pl-2.5">
          Outside engineering: business consultant for kado garments and manager for the artist Drxxco.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {['TypeScript', 'Python', 'React', 'AI/Agents'].map(tag => (
            <span key={tag} className="mono-font text-xs bg-[rgba(59,130,246,0.1)] border border-[#1a2240] text-[#a8b2d1] px-2 py-0.5 rounded-full hover:border-[#3b82f6] hover:bg-[rgba(59,130,246,0.15)] hover:text-[#3b82f6] transition-all">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-6 sm:space-y-8">
        <div>
          <h4 className="mono-font font-semibold text-xs uppercase tracking-widest mb-3 sm:mb-4 text-[#8892b0]">SHIPPED WITH</h4>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {shippedWith.map(tech => (
              <span key={tech} className="mono-font text-xs bg-[rgba(59,130,246,0.08)] border border-[#1a2240] text-[#c3cce4] px-2.5 py-1 rounded hover:border-[#3b82f6] hover:bg-[rgba(59,130,246,0.15)] hover:text-[#3b82f6] transition-all">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mono-font font-semibold text-xs uppercase tracking-widest mb-4 sm:mb-5 text-[#8892b0]">WHAT THAT LOOKS LIKE</h4>
          <div className="space-y-4 sm:space-y-5">
            {focus.map(item => (
              <div key={item.area} className="group border-l border-[#1a2240] pl-3 sm:pl-4 hover:border-[#3b82f6] transition-colors">
                <p className="display-font font-semibold text-sm text-[#f0f0ff] mb-1 group-hover:text-[#60a5fa] transition-colors">{item.area}</p>
                <p className="text-xs sm:text-sm text-[#a8b2d1] leading-relaxed">{item.proof}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MissionsSection({ scrollToSection }) {
  const [showMore, setShowMore] = useState(false);
  const [open, setOpen] = useState(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = e => { if (e.key === 'Escape') setOpen(null); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const shipped = [
    {
      name: 'Ask Adam',
      tag: 'AI AGENT',
      color: 'bg-[rgba(59,130,246,0.13)] text-[#3b82f6]',
      metric: '52-case eval harness, 4 grading layers',
      pitch: 'Recruiter-facing chat that answers questions about my work and rates any job description against it.',
      role: 'Solo build',
      stack: ['React', 'TypeScript', 'Groq API'],
      links: [{ label: 'Live', url: 'https://ai-agent-pitch.vercel.app/' }],
      details: [
        'Grounded in a single canonical facts file so it never drifts from what is verifiable.',
        'JD Fit Rater: paste a job description and get a fit score against my actual work.',
        '52-case eval harness with four grading layers.',
      ],
    },
    {
      name: 'BodyCraft',
      tag: 'FLUTTER · SHIPPED',
      color: 'bg-[rgba(212,160,23,0.13)] text-[#d4a017]',
      metric: '117 workouts, shipped solo to production',
      pitch: 'Freemium calisthenics PWA with a skill road, a battles arena and a 117-workout library.',
      role: 'Solo build, end to end',
      stack: ['Flutter', 'Firebase', 'Dart'],
      links: [{ label: 'Live', url: 'https://bodycraft-57154.web.app/' }],
      details: [
        'Skill road: a progression system that tracks which movements you have unlocked.',
        'Live battles arena.',
        '117-workout library.',
        'Real-time Firestore sync with Google and email sign-in.',
      ],
    },
    {
      name: 'Sigo Order Platform',
      tag: 'WORK · INTERNAL TOOLS',
      color: 'bg-[rgba(34,197,94,0.12)] text-[#86efac]',
      metric: '6,000+ active orders, used daily',
      pitch: 'Order management product that replaced a manual C#/.NET process at Sigo Signs.',
      role: 'Internal Tools Developer',
      stack: ['Next.js', 'TypeScript', 'Prisma', '.NET Core', 'Python'],
      internal: true,
      details: [
        'Data model, live status pipeline and ops dashboard, used daily across 6,000+ active orders.',
        'Python batch pipeline behind fulfillment: 100k+ file operations a day with throttling, retries, dry-run/apply modes and CSV audit trails.',
        '.NET Core REST API that became the standard data-access layer for 3 internal teams.',
      ],
    },
  ];

  const hackathons = [
    {
      name: 'Shibboleth',
      tag: 'HACKATHON · AI SAFETY',
      color: 'bg-[rgba(59,130,246,0.13)] text-[#3b82f6]',
      event: 'MongoDB Harness Engineering & Model Wrangling Hackathon · NYC · Sep 2026',
      metric: '6th place · top 5 advanced to present',
      pitch: 'Agentic harness that flags open-weight models whose safety refusals were stripped (abliterated). Every scan is stored and checked against the next, so it gets better the more models it sees.',
      role: 'Built the benign-control corpus; scanned 5 models',
      stack: ['Python', 'MongoDB Atlas', 'Vector Search', 'Next.js'],
      links: [
        { label: 'Repo', url: 'https://github.com/TheApexWu/shibboleth' },
        { label: 'Results', url: 'https://cerebralvalley.ai/e/mongodb-nyc-hackathon/hackathon/gallery?project=1' },
      ],
      details: [
        'Built the benign-control corpus the harness compares suspect models against.',
        'Scanned 5 models during the event.',
        'Each scan is stored as a MongoDB Atlas document; a change stream triggers new scans and $vectorSearch finds the nearest known abliterated model.',
      ],
    },
    {
      name: 'Libreta',
      tag: 'HACKATHON · FINANCE',
      color: 'bg-[rgba(212,160,23,0.13)] text-[#d4a017]',
      event: 'Latinos x AI Hackathon NYC · Columbia · Oct 2026 · Finance track',
      metric: 'Voice bookkeeping → lender-ready bank report',
      pitch: 'Spanish-first, voice-first bookkeeping for cash businesses.',
      role: 'Solo build',
      stack: ['Base44', 'Claude API', 'ElevenLabs'],
      links: [{ label: 'Live', url: 'https://libreta-cuentas.base44.app/' }],
      details: [
        'Owners keep their books by voice, in Spanish first.',
        'Produces a lender-ready bank report, so a cash business can show its income when applying for credit.',
        'Built solo on Base44 with the Claude API and ElevenLabs.',
      ],
    },
    {
      name: 'ShopAtlas',
      tag: 'HACKATHON · AGENTIC COMMERCE',
      color: 'bg-[rgba(16,184,209,0.13)] text-[#10b8d1]',
      event: 'Agentic Commerce Hackathon · Microsoft × Coinbase × Tavily · NYC Tech Week · Jun 2026',
      metric: 'Coinbase x402 · payment in one round trip',
      pitch: 'Shopping agent that pays per API call in USDC: no account, no API key, no human in the payment loop.',
      role: 'Built the agent checkout path',
      stack: ['x402', 'USDC', 'Coinbase', 'Tavily'],
      details: [
        "Uses Coinbase's x402, which revives HTTP 402 so an agent can pay for each call itself.",
        'Nothing purchases without explicit confirmation.',
      ],
      demo: '/media/shopatlas-demo.mp4',
      poster: '/media/shopatlas-poster.jpg',
      demoLength: '36s',
      note: 'Local dev build. Shows the search-to-checkout flow; the x402 layer bills per API call server-side.',
    },
    {
      name: 'Tu Inquilino',
      tag: 'HACKATHON · CIVIC',
      color: 'bg-[rgba(34,197,94,0.12)] text-[#86efac]',
      event: 'Build-a-thon at Sankofa Haus, powered by JPMorganChase · Bronx',
      metric: 'Housing records for 600 Bronx buildings, plus guardrails',
      pitch: "Bilingual English/Spanish tenant advocate for Bronx renters: look up a building's housing record, then get plain-language help with your rights.",
      role: 'Solo build',
      stack: ['Amazon Quick', 'NYC Open Data'],
      links: [{ label: 'App (AWS login)', url: 'https://quick.aws.com/sn/account/759498975392/apps/2614e056-9c16-4d6d-8666-805e136d6a2c/view/Tu-Inquilino-Bronx-Tenant-Navigator?state=QUFBQURtdGxlUzB4TlRZNE9UVTFNekEzMWpKTlFmOUZxNVhSVDdsMFVOTUhpak5mRnB6NkZmVXd2VlNMZFR5S1AzU3RGWWpCM1lPaUJKbGMyaElmVjhmbWJveEx6b0RhMndQSUlUSjhpTExwZEJwVndXX3BQSW13djJhcUxJdWU2X29kY3lkV3R2RmpLM0h6dndRSFgzQndXcG5JbHRYTEhNVnV3ZW1LSHFUYVJhYzFfQTJacER5dzhCZXhUZUdiWXlxZkN0cG16Z0NGX1BPSmFPNWhvOVhBblBqdHlwTDhDYWtiTWlmb3VMbkw5RE41ck9MWWZYVFducGpa' }],
      details: [
        'Building Lookup: enter a Bronx address, BBL or BIN to see its last 12 months of HPD violations, HPD complaints, 311 calls and registration, across the 600 highest-activity buildings.',
        'Chat explains renter rights in English or Spanish and drafts a repair-request letter and a 311 complaint.',
        'Says so when it lacks reliable information instead of guessing.',
        "Eviction notices, court papers, lockouts and threats get pointed to free legal help: Bronx Legal Services, the Legal Aid Society, NYC's Right to Counsel.",
      ],
      shots: [
        { src: '/media/tu-inquilino-lookup.webp', alt: 'Tu Inquilino Building Lookup tab with sample Bronx addresses and data sources' },
        { src: '/media/tu-inquilino-chat.webp', alt: 'Tu Inquilino chat tab with English and Spanish starter questions' },
      ],
      note: 'Runs inside Amazon Quick; opening it requires an AWS login.',
    },
  ];

  const groups = [
    { label: 'Shipped', items: shipped, cols: 'sm:grid-cols-2 lg:grid-cols-3' },
    { label: 'Hackathons', items: hackathons, cols: 'sm:grid-cols-2' },
  ];

  const more = [
    { name: 'Oro Latino', tag: 'CLIENT · IN PROGRESS', color: 'bg-[rgba(212,160,23,0.13)] text-[#d4a017]', desc: 'Interactive canvas storefront for a NYC jewelry retailer — Verlet-simulated draggable chains, procedurally rendered gold links, bilingual copy. Took the scene from ~5fps back to 60fps idle.', stack: ['Canvas', 'TypeScript'], url: 'https://github.com/XVI-Adam' },
    { name: 'Consistency Copilot', tag: 'AGENTS', color: 'bg-[rgba(16,184,209,0.13)] text-[#10b8d1]', desc: 'AI-powered consistency tracking built on OpenClaw.', stack: ['OpenClaw', 'Agents'], url: 'https://github.com/XVI-Adam/consistency-copilot' },
    { name: 'MU RAG Workshop', tag: 'TEACHING', color: 'bg-[rgba(34,197,94,0.12)] text-[#86efac]', desc: 'Taught practical retrieval-augmented generation techniques at Manhattan University.', stack: ['Teaching', 'RAG'], url: 'https://github.com/XVI-Adam/MU_RAG_Workshop' },
  ];

  return (
    <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 animate-fadeIn mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 mb-6 sm:mb-8">
        <h2 className="display-font text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tighter hover:text-[#3b82f6] transition-colors">Mission Log</h2>
        <span className="mono-font text-xs text-[#8892b0]">SELECTED WORK · TAP A CARD FOR DETAILS</span>
      </div>

      <div className="space-y-8 sm:space-y-10">
        {groups.map(group => (
          <section key={group.label} aria-label={group.label}>
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <h3 className="mono-font text-xs font-semibold uppercase tracking-widest text-[#c3cce4]">{group.label}</h3>
              <span className="mono-font text-[10px] text-[#8892b0]">{group.items.length}</span>
              <span className="flex-1 h-px bg-[#1a2240]" />
            </div>
            <div className={`grid grid-cols-1 ${group.cols} gap-3 sm:gap-4`}>
              {group.items.map((p, idx) => (
                <article
                  key={p.name}
                  className="card-glow bg-[#090d1c] border border-[#1a2240] rounded-xl group flex flex-col transition-all hover:border-[#3b82f6]"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(p)}
                    aria-haspopup="dialog"
                    className="text-left p-4 sm:p-5 pb-3 sm:pb-3 flex-1 rounded-t-xl"
                  >
                    <span className={`mono-font text-[10px] sm:text-xs font-medium tracking-wider uppercase px-2 py-1 rounded inline-block mb-2.5 ${p.color}`}>{p.tag}</span>
                    <h4 className="display-font font-bold text-base sm:text-lg mb-1 group-hover:text-[#3b82f6] transition-colors">{p.name}</h4>
                    {p.event && <p className="mono-font text-[10px] text-[#8892b0] leading-relaxed mb-1.5">{p.event}</p>}
                    <p className="mono-font text-xs text-[#10b981] mb-2.5">{p.metric}</p>
                    <p className="text-sm text-[#a8b2d1] leading-relaxed mb-2.5 group-hover:text-[#c3cce4] transition-colors">{p.pitch}</p>
                    {p.role && (
                      <p className="text-xs text-[#a8b2d1] leading-relaxed">
                        <span className="mono-font text-[10px] text-[#3b82f6] tracking-widest mr-1.5">ROLE</span>{p.role}
                      </p>
                    )}
                  </button>
                  <div className="px-4 sm:px-5 pb-4 flex justify-between items-end gap-2">
                    <div className="flex gap-1 flex-wrap">
                      {p.stack.map(t => (
                        <span key={t} className="mono-font text-[10px] text-[#a8b2d1] bg-[rgba(59,130,246,0.05)] border border-[#1a2240] px-1.5 py-0.5 rounded group-hover:border-[#3b82f6] transition-all">
                          {t}
                        </span>
                      ))}
                    </div>
                    {p.demo ? (
                      <button
                        type="button"
                        onClick={() => setOpen(p)}
                        className="mono-font text-[10px] text-[#3b82f6] flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 border border-[rgba(59,130,246,0.35)] bg-[rgba(59,130,246,0.09)] rounded-full px-2.5 py-1 min-h-[32px] hover:bg-[rgba(59,130,246,0.18)] transition-colors"
                      >
                        <svg className="w-2.5 h-2.5" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true"><path d="M1 0.5 L9 5 L1 9.5 Z" /></svg>
                        WATCH DEMO · {p.demoLength}
                      </button>
                    ) : p.internal ? (
                      <button
                        type="button"
                        onClick={() => scrollToSection('resume')}
                        className="mono-font text-[10px] text-[#8892b0] hover:text-[#3b82f6] transition-colors whitespace-nowrap flex-shrink-0 underline underline-offset-2 min-h-[32px]"
                      >
                        See resume
                      </button>
                    ) : (
                      <div className="flex gap-1.5 flex-shrink-0">
                        {p.links.map(link => (
                          <a
                            key={link.label}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mono-font text-[10px] uppercase tracking-wider text-[#a8b2d1] border border-[#1a2240] rounded px-2 min-h-[32px] flex items-center whitespace-nowrap hover:border-[#3b82f6] hover:text-[#3b82f6] hover:bg-[rgba(59,130,246,0.13)] transition-all"
                          >
                            {link.label.split(' ')[0]} ↗
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      {open && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center modal-overlay sm:p-8"
          style={{ background: 'rgba(3,4,12,0.88)', backdropFilter: 'blur(6px)' }}
          onClick={() => setOpen(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-detail-title"
        >
          <div
            className="w-full sm:max-w-2xl max-h-[88vh] overflow-y-auto overscroll-contain bg-[#090d1c] border border-[#1a2240] rounded-t-2xl sm:rounded-xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-[#0f1526] border-b border-[#1a2240] px-4 sm:px-6 py-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className={`mono-font text-[10px] font-medium tracking-wider uppercase px-2 py-0.5 rounded inline-block mb-1.5 ${open.color}`}>{open.tag}</span>
                <h3 id="project-detail-title" className="display-font font-bold text-lg sm:text-xl text-[#f0f0ff]">{open.name}</h3>
                {open.event && <p className="mono-font text-[11px] text-[#8892b0] leading-relaxed mt-0.5">{open.event}</p>}
              </div>
              <button
                ref={closeRef}
                onClick={() => setOpen(null)}
                className="text-[#8892b0] hover:text-[#f0f0ff] text-xl leading-none w-11 h-11 -mr-2 flex items-center justify-center flex-shrink-0"
                aria-label="Close details"
              >
                ✕
              </button>
            </div>

            {open.demo && (
              <video
                src={open.demo}
                poster={open.poster}
                controls
                autoPlay
                playsInline
                preload="metadata"
                className="w-full block bg-black"
                style={{ maxHeight: '55vh' }}
              />
            )}
            {open.shots && (
              <div className="flex flex-col gap-px bg-[#1a2240] border-b border-[#1a2240]">
                {open.shots.map(shot => (
                  <img key={shot.src} src={shot.src} alt={shot.alt} width={2000} height={995} loading="lazy" decoding="async" className="w-full h-auto block bg-[#0f1526]" />
                ))}
              </div>
            )}

            <div className="px-4 sm:px-6 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] space-y-5">
              <p className="text-[15px] sm:text-base text-[#c3cce4] leading-relaxed">{open.pitch}</p>

              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2.5 text-sm">
                {open.role && (
                  <>
                    <dt className="mono-font text-[10px] text-[#3b82f6] tracking-widest pt-1">ROLE</dt>
                    <dd className="text-[#f0f0ff] leading-relaxed">{open.role}</dd>
                  </>
                )}
                <dt className="mono-font text-[10px] text-[#3b82f6] tracking-widest pt-1">{open.event ? 'RESULT' : 'OUTCOME'}</dt>
                <dd className="text-[#10b981] leading-relaxed">{open.metric}</dd>
                <dt className="mono-font text-[10px] text-[#3b82f6] tracking-widest pt-1">STACK</dt>
                <dd className="text-[#f0f0ff] leading-relaxed">{open.stack.join(' · ')}</dd>
              </dl>

              <ul className="space-y-2.5 border-t border-[#1a2240] pt-4">
                {open.details.map(d => (
                  <li key={d} className="text-sm leading-relaxed text-[#a8b2d1] pl-3.5 relative before:content-['·'] before:absolute before:left-0 before:text-[#3b82f6]">
                    {d}
                  </li>
                ))}
              </ul>

              {open.note && <p className="mono-font text-[11px] text-[#8892b0] leading-relaxed">{open.note}</p>}

              {open.links && (
                <div className="flex flex-col sm:flex-row gap-2">
                  {open.links.map(link => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="display-font btn-hover flex-1 sm:flex-none px-5 rounded-lg border border-[#1a2240] bg-[#0f1526] text-sm font-medium text-[#f0f0ff] hover:border-[#3b82f6] hover:text-[#3b82f6] min-h-[44px] flex items-center justify-center gap-2"
                    >
                      {link.label} ↗
                    </a>
                  ))}
                </div>
              )}
              {open.internal && (
                <button
                  onClick={() => { setOpen(null); scrollToSection('resume'); }}
                  className="display-font btn-hover w-full sm:w-auto px-5 rounded-lg border border-[#1a2240] bg-[#0f1526] text-sm font-medium text-[#f0f0ff] hover:border-[#3b82f6] hover:text-[#3b82f6] min-h-[44px] flex items-center justify-center"
                >
                  Internal tool · see resume
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      <div className="mt-8 sm:mt-10">
        <button
          onClick={() => setShowMore(open => !open)}
          aria-expanded={showMore}
          className="mono-font text-xs text-[#8892b0] hover:text-[#3b82f6] transition-colors flex items-center gap-2 min-h-[44px]"
        >
          <span className={`inline-block transition-transform duration-300 ${showMore ? 'rotate-90' : ''}`}>▸</span>
          {showMore ? 'HIDE' : 'MORE'} PROJECTS ({more.length}) · ALSO ON{' '}
          <span className="underline underline-offset-2">GITHUB</span>
        </button>

        {showMore && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4 section-fade">
            {more.map(p => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#090d1c] border border-[#1a2240] rounded-xl p-3 sm:p-4 group block transition-all hover:border-[#3b82f6]"
              >
                <span className={`mono-font text-[10px] font-medium tracking-wider uppercase px-2 py-0.5 rounded inline-block mb-2 ${p.color}`}>{p.tag}</span>
                <h4 className="font-semibold text-xs sm:text-sm mb-1.5 group-hover:text-[#3b82f6] transition-colors">{p.name}</h4>
                <p className="text-xs text-[#a8b2d1] leading-relaxed mb-2.5">{p.desc}</p>
                <div className="flex gap-1 flex-wrap">
                  {p.stack.map(t => (
                    <span key={t} className="mono-font text-[10px] text-[#8892b0] bg-[rgba(59,130,246,0.05)] border border-[#1a2240] px-1.5 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ContactSection() {
  return (
    <div className="w-full flex items-center justify-center py-8 sm:py-16 animate-fadeIn px-4 sm:px-6">
      <div className="w-full max-w-2xl flex flex-col items-center justify-center text-center">
        <div className="mono-font text-xs text-[#3b82f6] tracking-widest uppercase mb-3 sm:mb-4 hover:text-[#60a5fa] transition-colors">Let's Build Together</div>
        <h2 className="display-font text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 tracking-tighter hover:text-[#3b82f6] transition-colors">Get In Touch</h2>
        <p className="text-sm sm:text-base text-[#a8b2d1] leading-relaxed mb-6 sm:mb-9 max-w-lg hover:text-[#c3cce4] transition-colors">
          Open to forward-deployed, solutions and full-stack engineering roles at AI-native startups. Based in NYC — always down for a coffee talk.
        </p>
        <div className="flex gap-2 sm:gap-3 justify-center flex-wrap">
          {[{ label: 'Email', href: 'mailto:adammartinez.martinez2@gmail.com' }, { label: 'GitHub', href: 'https://github.com/XVI-Adam' }, { label: 'LinkedIn', href: 'https://linkedin.com/in/xvi-adam' }, { label: 'Twitter', href: 'https://x.com/TheAdamAgenda' }].map(link => (
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="btn-hover flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-3 rounded-lg border border-[#1a2240] bg-[#090d1c] text-xs sm:text-sm font-medium text-[#f0f0ff] hover:border-[#3b82f6] hover:text-[#3b82f6] hover:bg-[rgba(59,130,246,0.13)] hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] min-h-[40px] sm:min-h-[44px] flex items-center justify-center">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResumeSection() {
  const experience = [
    {
      role: 'Founder & Engineer',
      org: 'StackedLabs',
      loc: 'NYC',
      dates: 'Jan 2026 – Present',
      bullets: [
        'Shipped BodyCraft, a Flutter/Firebase calisthenics app, solo to web — skill progression system, live battles arena, 117-workout library, real-time Firestore sync, Google/email auth.',
        'Building Oro Latino, an interactive canvas storefront for a NYC jewelry retailer: Verlet-simulated draggable chains, procedurally rendered gold links, bilingual product copy.',
        'Diagnosed and fixed the rendering regression that dropped that scene to ~5fps — back to 60fps idle at one draw call per frame on a 4.1MB atlas.',
      ],
    },
    {
      role: 'Software Trainer → Internal Tools Developer',
      org: 'Sigo Signs',
      loc: 'Norwood, NJ',
      dates: 'Sep 2025 – Dec 2025',
      bullets: [
        'Rebuilt the order workflow the shop runs on — replaced a manual C#/.NET process with a Next.js + TypeScript order management product, now used daily across 6,000+ active orders.',
        'Wrote the Python batch pipeline behind fulfillment: 100k+ file operations a day with throttling, retry logic, dry-run/apply modes and CSV audit trails.',
        'Designed the .NET Core REST API that became the standard data-access layer for 3 internal teams, with server-side pagination via Prisma $queryRaw and SQL window functions.',
      ],
    },
  ];

  const skillGroups = [
    { label: 'LANGUAGES', items: ['TypeScript', 'Python', 'C#', 'Dart', 'SQL'] },
    { label: 'FRAMEWORKS', items: ['React', 'Next.js', 'Flutter', 'Node.js', '.NET Core'] },
    { label: 'DATA', items: ['PostgreSQL', 'Prisma', 'SQL Server', 'Firestore', 'Supabase'] },
    { label: 'AGENTIC / LLM', items: ['Claude', 'OpenAI', 'Gemini', 'Groq', 'CrewAI', 'Tavily', 'x402'] },
  ];

  return (
    <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-6">
        <h2 className="display-font text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tighter hover:text-[#3b82f6] transition-colors">Resume</h2>
        <a
          href="/adam-resume.pdf"
          download="AdamMartinez-Resume.pdf"
          className="btn-hover flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-[#3b82f6] text-white rounded-lg font-semibold text-xs sm:text-sm shadow-lg shadow-[rgba(59,130,246,0.3)] min-h-[44px] justify-center"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download PDF
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="card-glow bg-[#090d1c] border border-[#1a2240] rounded-xl p-4 sm:p-6 group">
          <h3 className="display-font font-bold text-base sm:text-lg mb-1 sm:mb-2 group-hover:text-[#3b82f6] transition-colors">Adam Martinez</h3>
          <p className="mono-font text-xs text-[#3b82f6] mb-2 sm:mb-3">FOUNDING / FULL-STACK ENGINEER</p>
          <p className="text-xs sm:text-sm text-[#a8b2d1] mb-4 sm:mb-5 leading-relaxed group-hover:text-[#c3cce4] transition-colors">
            Full-stack engineer, sole developer on everything I've shipped. Based in NYC.
          </p>

          <h4 className="font-semibold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4 text-[#f0f0ff]">Experience</h4>
          <div className="space-y-4 sm:space-y-5">
            {experience.map(job => (
              <div key={job.org}>
                <p className="font-medium text-[#f0f0ff] text-xs sm:text-sm">{job.role} — {job.org}</p>
                <p className="mono-font text-xs text-[#3b82f6] mb-1.5">{job.dates} · {job.loc}</p>
                <ul className="space-y-1.5">
                  {job.bullets.map(b => (
                    <li key={b} className="text-xs leading-relaxed text-[#a8b2d1] pl-3 relative before:content-['·'] before:absolute before:left-0 before:text-[#3b82f6]">
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="card-glow bg-[#090d1c] border border-[#1a2240] rounded-xl p-4 sm:p-6 group">
          <h4 className="font-semibold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4 text-[#f0f0ff]">Education</h4>
          <div className="mb-5 sm:mb-6">
            <p className="font-medium text-[#f0f0ff] text-xs sm:text-sm mb-1">Manhattan University</p>
            <p className="text-xs sm:text-sm text-[#a8b2d1] group-hover:text-[#c3cce4] transition-colors">B.S. Computer Information Systems, Minor in Computer Science</p>
            <p className="mono-font text-xs text-[#3b82f6] mb-1.5">May 2025</p>
            <p className="text-xs text-[#8892b0] leading-relaxed">GDSC Lead Tech Developer · ACM · CodePath · ColorStack · Division I eSports</p>
          </div>

          <h4 className="font-semibold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4 text-[#f0f0ff]">Skills</h4>
          <div className="space-y-3 mb-5 sm:mb-6">
            {skillGroups.map(group => (
              <div key={group.label}>
                <p className="mono-font text-[10px] text-[#8892b0] tracking-widest mb-1.5">{group.label}</p>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map(skill => (
                    <span key={skill} className="mono-font text-xs bg-[rgba(59,130,246,0.1)] border border-[#1a2240] text-[#a8b2d1] px-2 py-1 rounded-full hover:border-[#3b82f6] hover:bg-[rgba(59,130,246,0.15)] hover:text-[#3b82f6] transition-all">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <h4 className="font-semibold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4 text-[#f0f0ff]">Contact</h4>
          <div className="space-y-2 text-xs sm:text-sm">
            <p className="text-[#a8b2d1] group-hover:text-[#c3cce4] transition-colors">
              <span className="mono-font text-xs text-[#3b82f6]">EMAIL</span><br />
              adammartinez.martinez2@gmail.com
            </p>
            <p className="text-[#a8b2d1] group-hover:text-[#c3cce4] transition-colors">
              <span className="mono-font text-xs text-[#3b82f6]">PHONE</span><br />
              (347) 375-1047
            </p>
            <div className="flex gap-3 pt-2">
              <a href="https://github.com/XVI-Adam" target="_blank" rel="noopener noreferrer" className="mono-font text-xs text-[#3b82f6] hover:text-[#60a5fa] transition-colors underline">GitHub</a>
              <a href="https://linkedin.com/in/xvi-adam" target="_blank" rel="noopener noreferrer" className="mono-font text-xs text-[#3b82f6] hover:text-[#60a5fa] transition-colors underline">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden sm:block bg-[#090d1c] border border-[#1a2240] rounded-xl overflow-hidden">
        <div className="bg-[#0f1526] border-b border-[#1a2240] px-3 sm:px-5 py-2 sm:py-3 flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
            <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
            <div className="w-3 h-3 rounded-full bg-[#10b981]" />
          </div>
          <span className="mono-font text-xs text-[#8892b0]">AdamMartinez-Resume.pdf</span>
        </div>
        <iframe
          src="/adam-resume.pdf"
          className="w-full border-0 block"
          style={{ height: 'clamp(300px, 70vh, 600px)' }}
          title="Adam Martinez Resume PDF Preview"
        />
      </div>
    </div>
  );
}