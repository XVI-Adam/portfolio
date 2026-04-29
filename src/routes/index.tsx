import { useState, useEffect, useRef } from 'react';

export default function Portfolio() {
  const [time, setTime] = useState(new Date());
  const [tipAmount, setTipAmount] = useState(5);
  const [tipsLoading, setTipsLoading] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [userId] = useState(`user_${Math.random().toString(36).slice(2, 9)}`);
  const [aliens, setAliens] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, centerX: 0, centerY: 0 });
  const [visibleSections, setVisibleSections] = useState({});
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
          setVisibleSections(prev => ({...prev, [entry.target.id]: true}));
        }
      });
    }, { threshold: 0.15 });

    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

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
          0% { transform: translate(0, 0) rotate(15deg) scale(1); }
          25% { transform: translate(-30px, -40px) rotate(20deg) scale(1.1); }
          50% { transform: translate(-60px, -80px) rotate(25deg) scale(1); }
          75% { transform: translate(-40px, -50px) rotate(18deg) scale(1.08); }
          100% { transform: translate(0, 0) rotate(15deg) scale(1); }
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

      <div className="hidden sm:flex fixed top-4 left-4 w-16 sm:w-20 h-16 sm:h-20 z-50 pointer-events-none opacity-30 sm:opacity-40 hover:opacity-100 transition-opacity">
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <path d="M4 76 L4 4 L76 4" stroke="#3b82f6" strokeWidth="1.5" fill="none" />
          <path d="M4 24 L14 24" stroke="#3b82f6" strokeWidth="1" />
          <path d="M24 4 L24 14" stroke="#3b82f6" strokeWidth="1" />
          <circle cx="4" cy="4" r="3" fill="#3b82f6" opacity="0.7" />
        </svg>
      </div>
      <div className="hidden sm:flex fixed top-4 right-4 w-16 sm:w-20 h-16 sm:h-20 z-50 pointer-events-none opacity-30 sm:opacity-40 hover:opacity-100 transition-opacity" style={{transform: 'scaleX(-1)'}}>
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <path d="M4 76 L4 4 L76 4" stroke="#3b82f6" strokeWidth="1.5" fill="none" />
          <path d="M4 24 L14 24" stroke="#3b82f6" strokeWidth="1" />
          <path d="M24 4 L24 14" stroke="#3b82f6" strokeWidth="1" />
          <circle cx="4" cy="4" r="3" fill="#3b82f6" opacity="0.7" />
        </svg>
      </div>
      <div className="hidden sm:flex fixed bottom-4 left-4 w-16 sm:w-20 h-16 sm:h-20 z-50 pointer-events-none opacity-30 sm:opacity-40 hover:opacity-100 transition-opacity" style={{transform: 'scaleY(-1)'}}>
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <path d="M4 76 L4 4 L76 4" stroke="#3b82f6" strokeWidth="1.5" fill="none" />
          <path d="M4 24 L14 24" stroke="#3b82f6" strokeWidth="1" />
          <path d="M24 4 L24 14" stroke="#3b82f6" strokeWidth="1" />
          <circle cx="4" cy="4" r="3" fill="#3b82f6" opacity="0.7" />
        </svg>
      </div>
      <div className="hidden sm:flex fixed bottom-4 right-4 w-16 sm:w-20 h-16 sm:h-20 z-50 pointer-events-none opacity-30 sm:opacity-40 hover:opacity-100 transition-opacity" style={{transform: 'scale(-1)'}}>
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <path d="M4 76 L4 4 L76 4" stroke="#3b82f6" strokeWidth="1.5" fill="none" />
          <path d="M4 24 L14 24" stroke="#3b82f6" strokeWidth="1" />
          <path d="M24 4 L24 14" stroke="#3b82f6" strokeWidth="1" />
          <circle cx="4" cy="4" r="3" fill="#3b82f6" opacity="0.7" />
        </svg>
      </div>

      <div className="hidden sm:block fixed top-28 left-5 z-50 pointer-events-none mono-font text-xs text-[#3b82f6] opacity-50 leading-relaxed tracking-wider hover:opacity-100 transition-opacity">
        <div>COORD 40.7128° N</div>
        <div>74.0060° W</div>
        <div>ALT 0.00 AU</div>
      </div>
      <div className="hidden sm:block fixed top-28 right-5 z-50 pointer-events-none mono-font text-xs text-[#3b82f6] opacity-50 leading-relaxed tracking-wider text-right hover:opacity-100 transition-opacity">
        <div>SYS NOMINAL</div>
        <div>SHIELDS 100%</div>
        <div>FUEL ████████ 94%</div>
      </div>
      <div className="hidden sm:block fixed bottom-28 left-5 z-50 pointer-events-none mono-font text-xs text-[#3b82f6] opacity-50 hover:opacity-100 transition-opacity">
        <div>{formatTime()}</div>
      </div>

      <nav className="nav-slide fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 sm:px-6 lg:px-8 h-14 sm:h-16 backdrop-blur-sm" style={{background: 'linear-gradient(to bottom, rgba(4,6,14,0.92), rgba(4,6,14,0))'}}>
        <div className="flex items-center gap-2 hover:scale-105 transition-transform flex-shrink-0">
          <div className="w-7 sm:w-8 h-7 sm:h-8 bg-[#090d1c] border border-[#1a2240] rounded flex items-center justify-center mono-font text-xs font-bold text-[#3b82f6] tracking-wider hover:border-[#3b82f6] hover:shadow-lg hover:shadow-[rgba(59,130,246,0.4)] transition-all">XVI</div>
          <span className="display-font font-bold text-xs sm:text-sm tracking-tight">Adam Martinez</span>
        </div>
        <div className="hidden md:flex gap-1">
          {[{label: 'Hero', id: 'hero'}, {label: 'About', id: 'about'}, {label: 'Projects', id: 'missions'}, {label: 'Contact', id: 'contact'}, {label: 'Resume', id: 'resume'}].map(item => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="display-font text-xs font-medium px-2.5 sm:px-3.5 py-2 rounded transition-all duration-300 text-[#8892b0] hover:text-[#f0f0ff] hover:bg-[rgba(59,130,246,0.13)]"
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 mono-font text-xs text-[#8892b0] hover:text-[#3b82f6] transition-colors">
          <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" style={{boxShadow: '0 0 8px #10b981', animation: 'pulse 2s ease-in-out infinite'}} />
          <span className="hidden sm:inline">ONLINE · NYC</span>
        </div>
      </nav>

      <div className="relative pt-14 sm:pt-16 z-10">
        <div id="hero" ref={el => el && (sectionRefs.current.hero = el)} className={`min-h-screen w-full flex items-center justify-center py-8 sm:py-16 section-fade ${visibleSections.hero ? 'section-visible' : ''}`}>
          <HeroSection scrollToSection={scrollToSection} />
        </div>

        <div id="about" ref={el => el && (sectionRefs.current.about = el)} className={`min-h-screen w-full flex items-center justify-center py-8 sm:py-16 section-fade ${visibleSections.about ? 'section-visible' : ''}`}>
          <AboutSection />
        </div>

        <div id="missions" ref={el => el && (sectionRefs.current.missions = el)} className={`min-h-screen w-full flex items-center justify-center py-8 sm:py-16 section-fade ${visibleSections.missions ? 'section-visible' : ''}`}>
          <MissionsSection />
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
        className="fixed z-40 w-12 sm:w-14 h-12 sm:h-14 bg-[#090d1c] border border-[#1a2240] rounded-full flex items-center justify-center text-xl sm:text-2xl hover:border-[#3b82f6] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all hover:scale-110 bottom-20 right-4 sm:bottom-8 sm:left-8"
        aria-label="Send tip"
      >
        💎
      </button>

      <a
        href="/stack"
        className="easter-egg-spaceship fixed bottom-4 right-4 z-30 sm:bottom-12 sm:right-12 cursor-pointer text-5xl sm:text-8xl block hover:scale-125 group"
        title="🚀 Navigate to tech stack (Easter egg!)"
      >
        <span className="inline-block">🚀</span>
        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-[#090d1c] border border-[#3b82f6] rounded px-2 py-1 whitespace-nowrap mono-font text-xs text-[#3b82f6] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          Launch sequence initiated...
        </div>
      </a>

      {showTipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay p-4" style={{background: 'rgba(0,0,0,0.7)'}}>
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
              <p className="text-xs text-[#8892b0] leading-relaxed">Your support helps keep the servers running!</p>
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
        <h1 className="display-font text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight tracking-tighter mb-2 sm:mb-3 animate-pulse hover:text-[#60a5fa] transition-colors">
          Navigate<br />My <span className="text-[#3b82f6]">Universe</span><span className="text-[#8892b0] font-light">.</span>
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-[#8892b0] leading-relaxed mb-6 sm:mb-9 max-w-sm hover:text-[#b8b8d8] transition-colors">
          Full-stack developer, AI builder & artist manager. Building tools that matter — from Manhattan to the cosmos.
        </p>
        <div className="flex gap-2 sm:gap-3 flex-wrap">
          <button 
            onClick={() => scrollToSection('missions')} 
            className="display-font btn-hover px-4 sm:px-5.5 py-2 sm:py-2.75 bg-[#3b82f6] text-white rounded font-semibold text-xs sm:text-sm shadow-lg shadow-[rgba(59,130,246,0.3)] min-h-[40px] sm:min-h-[44px] flex items-center justify-center"
          >
            View Projects
          </button>
          <button 
            onClick={() => scrollToSection('about')} 
            className="display-font btn-hover px-4 sm:px-5.5 py-2 sm:py-2.75 bg-transparent border border-[#1a2240] text-[#f0f0ff] rounded font-medium text-xs sm:text-sm hover:border-[#3b82f6] hover:text-[#3b82f6] hover:bg-[rgba(59,130,246,0.13)] min-h-[40px] sm:min-h-[44px] flex items-center justify-center"
          >
            About Me
          </button>
        </div>
      </div>

      <div className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 flex-shrink-0 flex items-center justify-center group mt-4 lg:mt-0">
        {[120, 220, 330, 420].map((size, i) => (
          <div
            key={i}
            className="orbit-ring absolute border border-[rgba(59,130,246,0.14)] group-hover:border-[rgba(59,130,246,0.3)] transition-all hidden sm:block"
            style={{width: size * 0.6, height: size * 0.6, ...(i === 3 && {borderStyle: 'dashed', opacity: 0.4})}}
          />
        ))}
        <div className="absolute w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-white via-[#3b82f6] to-[rgba(59,130,246,0.2)] flex items-center justify-center font-bold text-xs mono-font text-[#05050f] tracking-wider shadow-lg hover:shadow-[0_0_50px_rgba(59,130,246,0.7)] transition-all" style={{boxShadow: '0 0 30px rgba(59,130,246,0.6), 0 0 80px rgba(59,130,246,0.25)'}}>
          XVI
        </div>
      </div>
    </div>
  );
}

function AboutSection() {
  return (
    <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-9 animate-fadeIn mx-auto">
      <div className="card-glow bg-[#090d1c] border border-[#1a2240] rounded-2xl p-4 sm:p-5.5 relative group">
        <img src="/images/pfp.jpeg" alt="Adam Martinez" className="w-full aspect-[3/4] object-cover rounded mb-3 sm:mb-4 group-hover:shadow-[inset_0_0_30px_rgba(59,130,246,0.2)] transition-all" />
        <h3 className="display-font font-bold text-base sm:text-lg mb-0.5 group-hover:text-[#60a5fa] transition-colors">Adam Martinez</h3>
        <p className="mono-font text-xs text-[#3b82f6] mb-2 sm:mb-3">FOUNDER / BUILDER</p>
        <p className="text-xs sm:text-sm text-[#8892b0] leading-relaxed mb-3 sm:mb-3.5 group-hover:text-[#b8b8d8] transition-colors">
          Recent grad building AI agents, full-stack apps, and fitness tech. Business consultant for kado garments clothing brand — managing artist Drxxco.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {['TypeScript', 'Python', 'React', 'AI/Agents'].map(tag => (
            <span key={tag} className="mono-font text-xs bg-[rgba(59,130,246,0.1)] border border-[#1a2240] text-[#8892b0] px-2 py-0.5 rounded-full hover:border-[#3b82f6] hover:bg-[rgba(59,130,246,0.15)] hover:text-[#3b82f6] transition-all">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-6 sm:space-y-8">
        <div>
          <h4 className="display-font font-semibold text-xs sm:text-sm text-[#f0f0ff] uppercase tracking-widest mono-font mb-4 sm:mb-5 text-[#8892b0]">CORE SKILLS</h4>
          <div className="space-y-3 sm:space-y-4">
            {[{name: 'Full-Stack Development', pct: 95}, {name: 'AI/LLMs', pct: 90}, {name: 'Mobile (Flutter)', pct: 85}].map(skill => (
              <div key={skill.name} className="group">
                <div className="flex justify-between text-xs sm:text-sm font-medium mb-1">
                  <span className="text-[#f0f0ff] group-hover:text-[#3b82f6] transition-colors text-xs sm:text-sm">{skill.name}</span>
                  <span className="mono-font text-[#8892b0] text-xs">{skill.pct}%</span>
                </div>
                <div className="h-1 bg-[rgba(59,130,246,0.1)] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000" style={{width: `${skill.pct}%`, background: 'linear-gradient(to right, #3b82f6, rgba(59,130,246,0.4))', boxShadow: '0 0 8px rgba(59,130,246,0.5)'}} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MissionsSection() {
  const projects = [
    {name: 'BodyCraft', tag: 'FITNESS', color: 'bg-[rgba(212,160,23,0.13)] text-[#d4a017]', desc: 'AI fitness gamification with battles', stack: ['Flutter', 'Firebase'], url: 'https://bodycraft-57154.web.app/'},
    {name: 'Jasper Photo Generator', tag: 'AI', color: 'bg-[rgba(59,130,246,0.13)] text-[#3b82f6]', desc: 'LLM-powered photo generation toolkit', stack: ['Python', 'Gemini'], url: 'https://github.com/XVI-Adam/gemini-lab'},
    {name: 'AI-Powered Virtual Shopping Assistant', tag: 'AI', color: 'bg-[rgba(59,130,246,0.13)] text-[#3b82f6]', desc: 'Virtual shopping chatbot powered by Gemini', stack: ['Python', 'LLMs'], url: 'https://github.com/XVI-Adam/gemini-jewelry-chatbot'},
    {name: 'Artist Management (Drxxco)', tag: 'MUSIC', color: 'bg-[rgba(124,58,237,0.12)] text-[#a78bfa]', desc: 'Business consultant for kado garments clothing brand', stack: ['TypeScript', 'React'], url: 'https://linktr.ee/dracodoesstuff1'},
    {name: 'Consistency Copilot', tag: 'OPENCLAW', color: 'bg-[rgba(16,184,209,0.13)] text-[#10b8d1]', desc: 'Built using OpenClaw for AI-powered consistency tracking', stack: ['OpenClaw', 'Agents'], url: '#'},
    {name: 'Internship Application Script', tag: 'AUTOMATION', color: 'bg-[rgba(168,85,247,0.12)] text-[#d8b4fe]', desc: 'Legacy script to track and manage internship applications', stack: ['Python', 'Automation'], url: '#'},
    {name: 'NYC Restaurant Inspections', tag: 'DATA', color: 'bg-[rgba(239,68,68,0.12)] text-[#fca5a5]', desc: 'Deep dive analysis of NYC restaurant health inspections dataset', stack: ['Python', 'Analysis'], url: '#'},
    {name: 'MU RAG Workshop', tag: 'EDUCATION', color: 'bg-[rgba(34,197,94,0.12)] text-[#86efac]', desc: 'Taught practical RAG (Retrieval-Augmented Generation) techniques', stack: ['Teaching', 'RAG'], url: '#'},
  ];

  return (
    <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 animate-fadeIn mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 mb-6">
        <h2 className="display-font text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tighter hover:text-[#3b82f6] transition-colors">Mission Log</h2>
        <span className="mono-font text-xs text-[#8892b0]">{projects.length} COMPLETED</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {projects.map((p, idx) => (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card-glow bg-[#090d1c] border border-[#1a2240] rounded-xl p-3 sm:p-4 group block transition-all hover:scale-105" 
            style={{animationDelay: `${idx * 0.1}s`}}
          >
            <span className={`mono-font text-xs font-medium tracking-wider uppercase px-2 py-1 rounded text-xs inline-block mb-2 ${p.color} group-hover:shadow-lg transition-all`}>{p.tag}</span>
            <h4 className="font-semibold text-xs sm:text-sm mb-1.5 group-hover:text-[#3b82f6] transition-colors line-clamp-2">{p.name}</h4>
            <p className="text-xs text-[#8892b0] leading-relaxed mb-3 group-hover:text-[#b8b8d8] transition-colors line-clamp-2">{p.desc}</p>
            <div className="flex justify-between items-end gap-2">
              <div className="flex gap-1 flex-wrap">
                {p.stack.map(t => (
                  <span key={t} className="mono-font text-[10px] text-[#8892b0] bg-[rgba(59,130,246,0.05)] border border-[#1a2240] px-1.5 py-0.5 rounded group-hover:bg-[rgba(59,130,246,0.1)] group-hover:border-[#3b82f6] transition-all">
                    {t}
                  </span>
                ))}
              </div>
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded border border-[#1a2240] flex items-center justify-center text-[#8892b0] transition-all group-hover:border-[#3b82f6] group-hover:text-[#3b82f6] group-hover:bg-[rgba(59,130,246,0.13)] group-hover:shadow-lg group-hover:shadow-[rgba(59,130,246,0.2)] flex-shrink-0">→</div>
            </div>
          </a>
        ))}
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
        <p className="text-sm sm:text-base text-[#8892b0] leading-relaxed mb-6 sm:mb-9 max-w-lg hover:text-[#b8b8d8] transition-colors">
          Open to founding engineer, AI product, and early-stage opportunities. Always down for coffee talks in NYC.
        </p>
        <div className="flex gap-2 sm:gap-3 justify-center flex-wrap">
          {[{label: 'Email', href: 'mailto:adammartinez.martinez2@gmail.com'}, {label: 'GitHub', href: 'https://github.com/XVI-Adam'}, {label: 'LinkedIn', href: 'https://linkedin.com/in/xvi-adam'}, {label: 'Twitter', href: 'https://x.com/TheAdamAgenda'}].map(link => (
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
  return (
    <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-6">
        <h2 className="display-font text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tighter hover:text-[#3b82f6] transition-colors">Resume</h2>
        <a
          href="/adam-resume.pdf"
          download="AdamMartinez-Resume.pdf"
          className="btn-hover flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-[#3b82f6] text-white rounded-lg font-semibold text-xs sm:text-sm shadow-lg shadow-[rgba(59,130,246,0.3)] min-h-[40px] sm:min-h-[44px] justify-center"
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
          <p className="mono-font text-xs text-[#3b82f6] mb-2 sm:mb-3">FULL STACK ENGINEER</p>
          <p className="text-xs sm:text-sm text-[#8892b0] mb-4 sm:mb-5 group-hover:text-[#b8b8d8] transition-colors">Software Developer, AI Builder & Artist Manager | Based in NYC</p>

          <h4 className="font-semibold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4 text-[#f0f0ff]">Experience</h4>
          <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-[#8892b0] group-hover:text-[#b8b8d8] transition-colors">
            <div>
              <p className="font-medium text-[#f0f0ff] text-xs sm:text-sm">Full Stack Engineer — BodyCraft</p>
              <p className="mono-font text-xs text-[#3b82f6] mb-1">Jan 2026 – Apr 2026</p>
              <p className="text-xs leading-relaxed">Designed and engineered a full-stack freemium Native app end-to-end with 25+ MAU. Built a 117+ content library, and multi-program system targeting first workout in under 3 minutes.</p>
            </div>
            <div>
              <p className="font-medium text-[#f0f0ff] text-xs sm:text-sm">Associate Software Developer — Sigo Signs</p>
              <p className="mono-font text-xs text-[#3b82f6] mb-1">Jun 2025 – Jan 2026</p>
              <p className="text-xs leading-relaxed">Built Python automation pipeline handling 100k+ file operations. Designed and built an order management product in Next.js + TypeScript, adopted daily across 6,000+ active orders.</p>
            </div>
          </div>
        </div>

        <div className="card-glow bg-[#090d1c] border border-[#1a2240] rounded-xl p-4 sm:p-6 group">
          <h4 className="font-semibold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4 text-[#f0f0ff]">Education</h4>
          <div className="mb-5 sm:mb-6">
            <p className="font-medium text-[#f0f0ff] text-xs sm:text-sm mb-1">Manhattan College</p>
            <p className="text-xs sm:text-sm text-[#8892b0] group-hover:text-[#b8b8d8] transition-colors">B.S. Computer Information Systems, CS Minor</p>
            <p className="mono-font text-xs text-[#3b82f6]">May 2025</p>
          </div>

          <h4 className="font-semibold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4 text-[#f0f0ff]">Skills</h4>
          <div className="flex flex-wrap gap-2 mb-5 sm:mb-6">
            {['TypeScript', 'Python', 'React', 'Next.js', 'Flutter', 'Firebase', 'Stripe', 'LangChain', 'CrewAI', 'PostgreSQL', '.NET Core', 'REST APIs'].map(skill => (
              <span key={skill} className="mono-font text-xs bg-[rgba(59,130,246,0.1)] border border-[#1a2240] text-[#8892b0] px-2 py-1 rounded-full hover:border-[#3b82f6] hover:bg-[rgba(59,130,246,0.15)] hover:text-[#3b82f6] transition-all">
                {skill}
              </span>
            ))}
          </div>

          <h4 className="font-semibold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4 text-[#f0f0ff]">Contact</h4>
          <div className="space-y-2 text-xs sm:text-sm">
            <p className="text-[#8892b0] group-hover:text-[#b8b8d8] transition-colors">
              <span className="mono-font text-xs text-[#3b82f6]">EMAIL</span><br />
              adammartinez.martinez2@gmail.com
            </p>
            <p className="text-[#8892b0] group-hover:text-[#b8b8d8] transition-colors">
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

      <div className="bg-[#090d1c] border border-[#1a2240] rounded-xl overflow-hidden">
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
          style={{height: 'clamp(300px, 70vh, 600px)'}}
          title="Adam Martinez Resume PDF Preview"
        />
      </div>
    </div>
  );
}