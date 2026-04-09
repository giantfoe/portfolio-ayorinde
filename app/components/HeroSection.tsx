'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

const DecryptText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState(text); // Initialize with actual text to match SSR cleanly

  useEffect(() => {
    // Start by instantly scrambling it once hydration is complete
    setDisplayText(text.split("").map(c => c === " " ? " " : letters[Math.floor(Math.random() * letters.length)]).join(""));
    
    let iteration = 0;
    let interval: NodeJS.Timeout;
    
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setDisplayText((_) => 
          text.split("").map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            if (letter === " ") return " ";
            return letters[Math.floor(Math.random() * letters.length)];
          }).join("")
        );

        if (iteration >= text.length) {
          clearInterval(interval);
        }

        iteration += 1 / 2;
      }, 40);
    }, delay * 1000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, delay]);

  return <>{displayText}</>;
};

export default function HeroSection() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 1000], [0, 300]);

  return (
    <section id="home" className="relative min-h-screen w-full bg-[#fdfaf6] flex flex-col font-outfit overflow-hidden">
      {/* BACKGROUND GRID */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      {/* NAVBAR */}
      <nav className="absolute top-0 w-full flex justify-between items-center px-6 md:px-16 py-8 z-[100]">
        <div className="text-2xl font-space font-bold tracking-tight text-[#1a1a1a] uppercase">Ayorinde</div>
        
        {/* DESKTOP NAV */}
        <div className="hidden xl:flex gap-12 font-outfit text-[11px] font-bold uppercase tracking-[0.2em] text-[#1a1a1a]">
          {[
            { label: 'Home', id: 'home' },
            { label: 'Works', id: 'works' },
            { label: 'Practice', id: 'expertise' },
            { label: 'Studio', id: 'studio' },
            { label: 'Repos', id: 'repos' },
            { label: 'Journal', id: 'articles' }
          ].map((item) => (
            <a 
              key={item.label} 
              href={`#${item.id}`} 
              className="hover:text-[#ff3d00] transition-colors relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#ff3d00] transition-all group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="xl:hidden flex flex-col gap-1.5 z-[110]"
          aria-label="Toggle Menu"
        >
          <span className={`w-6 h-0.5 bg-black transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-black transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-black transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>

        {/* MOBILE MENU OVERLAY */}
        <div className={`fixed inset-0 bg-white z-[100] transition-transform duration-500 xl:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
           <div className="flex flex-col items-center justify-center h-full gap-8 uppercase font-outfit text-2xl font-bold tracking-widest text-black">
              {[
                { label: 'Home', id: 'home' },
                { label: 'Works', id: 'works' },
                { label: 'Practice', id: 'expertise' },
                { label: 'Studio', id: 'studio' },
                { label: 'Repos', id: 'repos' },
                { label: 'Journal', id: 'articles' }
              ].map((item) => (
                <a key={item.label} href={`#${item.id}`} onClick={() => setIsMenuOpen(false)}>{item.label}</a>
              ))}
              <a href="https://wa.me/23279763339" target="_blank" rel="noopener noreferrer" className="mt-8 bg-black text-white px-8 py-4 rounded-full text-xs" onClick={() => setIsMenuOpen(false)}>Start Project</a>
           </div>
        </div>

        <div className="hidden md:block">
          <a href="https://wa.me/23279763339" target="_blank" rel="noopener noreferrer" className="bg-[#1a1a1a] text-[#fdfaf6] px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#ff3d00] transition-all">
            Create Art
          </a>
        </div>
      </nav>

      {/* HERO CONTENT */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 md:px-16 pt-32 pb-0 z-10 w-full max-w-[1440px] mx-auto">
        
        {/* MAIN TITLE - RESPONSIVE SIZES */}
        <div className="w-full relative flex flex-col items-center text-center mb-12 md:mb-0">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-[10vw] font-space font-black uppercase leading-[0.85] tracking-tight text-[#1a1a1a] z-20"
          >
            <DecryptText text="Design The" delay={0.2} /><br/>
            <span className="text-[#ff3d00]"><DecryptText text="Future" delay={0.6} /></span>
          </motion.h1>
        </div>

        {/* Central Artwork */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-30 w-full max-w-[750px] md:max-w-[1120px] lg:max-w-[1310px] aspect-square flex items-center justify-center -mt-[160px] md:-mt-[360px] lg:-mt-[490px] pointer-events-none"
        >
          <motion.div className="relative w-full h-full" style={{ y: yParallax }}>
            <Image 
              src="/images/HERO SECTION ME.svg" 
              alt="Hero Section Avatar" 
              fill 
              className="object-contain drop-shadow-2xl"
              priority
              unoptimized
            />
          </motion.div>

        </motion.div>



      </div>

      {/* Decorative lines/elements */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/[0.03] -translate-y-1/2 z-0 hidden md:block" />
      <div className="absolute top-0 left-1/2 w-[1px] h-full bg-black/[0.03] -translate-x-1/2 z-0 hidden md:block" />

    </section>
  );
}
