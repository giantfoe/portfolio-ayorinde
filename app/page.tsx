'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import HeroSection from './components/HeroSection';
import { projects } from './data/projects';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();

  const maskRef = useRef<HTMLDivElement>(null);
  const [hasMoved, setHasMoved] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activePanel, setActivePanel] = useState<'light' | 'dark' | 'none'>('none');
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [readingArticle, setReadingArticle] = useState<any>(null);
  const [articles, setArticles] = useState<any[]>([
    {
      title: "23 things I learned before turning 23",
      link: "https://medium.com/@ayorinde270/23-things-i-learned-before-turning-23-cf94588476e9",
      date: "Sep 17, 2025"
    },
    {
      title: "SOLANA VS THE WORLD",
      link: "https://medium.com/@ayorinde270/solana-vs-the-world-de98d038b17b",
      date: "Apr 11, 2025"
    },
    {
      title: "Creativity is dead?",
      link: "https://medium.com/@ayorinde270/creativity-is-dead-a54c8b17c743",
      date: "Mar 14, 2025"
    },
    {
      title: "FREETOWN GOES ELECTRIC",
      link: "https://medium.com/@ayorinde270/freetown-goes-electric-eaa76bc89fc9",
      date: "Sep 25, 2024"
    },
    {
      title: "A City so good It’s inhabitants want to leave.",
      link: "https://medium.com/@ayorinde270/a-city-so-good-its-inhabitants-want-to-leave-fbc2e607de8a",
      date: "Sep 24, 2024"
    },
    {
      title: "SCOOT-SCOOT(as easy as it sounds)",
      link: "https://medium.com/@ayorinde270/scoot-scoot-not-your-average-scooter-a8cc9ade495e",
      date: "Jul 12, 2024"
    }
  ]);
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!hasMoved) setHasMoved(true);
      if (maskRef.current) {
         maskRef.current.style.clipPath = `circle(250px at ${e.clientX}px ${e.clientY}px)`;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Check mobile dimension safely
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', checkMobile);
    };
  }, [hasMoved]);

  useEffect(() => {
    fetch("https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@ayorinde270")
      .then(res => res.json())
      .then(data => {
        if (data?.items?.length > 0) {
          const formatted = data.items.slice(0, 6).map((item: any) => {
            const date = new Date(item.pubDate);
            const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
            return {
              title: item.title,
              link: item.link,
              date: date.toLocaleDateString('en-US', options),
              content: item.content
            }
          });
          setArticles(formatted);
        }
      })
      .catch(err => console.error("Could not fetch medium articles", err));
  }, []);

  return (
    <main id="main-content" className="min-h-screen bg-[var(--bg-base)] text-[var(--foreground)] overflow-x-hidden relative">
      <HeroSection />

      {/* WORKS SECTION */}
      <section id="works" className="bg-white text-black pt-0 pb-32 px-6 overflow-hidden border-t border-black/5">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-24 gap-8">
            <h2 className="text-6xl sm:text-7xl md:text-8xl lg:text-[10vw] font-space font-bold uppercase leading-[0.8]">The<br/>Works</h2>
            <div className="max-w-md">
              <p className="font-inter text-lg text-gray-600 mb-8 lowercase italic">/ A curation of digital architectures and brand systems built for the modern edge.</p>
              <button className="bg-black text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#ff3d00] transition-all">View Archive</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -8 }}
                onClick={() => router.push(`/projects/${project.id}`)}
                className="group relative h-[420px] rounded-2xl md:rounded-[2rem] overflow-hidden cursor-pointer shadow-lg"
              >
                {/* Background Image & Gradient Overlays */}
                <div className="absolute inset-0 bg-[#1a1a1a]">
                  <Image src={project.img} alt={project.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-1000 ease-[0.16,1,0.3,1]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                </div>

                {/* Content Container */}
                <div className="relative h-full flex flex-col justify-between p-6 md:p-8 z-10 border border-white/10 rounded-2xl md:rounded-[2rem] transition-colors group-hover:border-white/20">
                  
                  {/* Top Bar: Pill & Arrow */}
                  <div className="flex justify-between items-start">
                    <span className="inline-block bg-black/40 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full group-hover:border-[#ff3d00] transition-colors duration-500">
                      {project.category}
                    </span>
                    <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center transform -rotate-45 group-hover:rotate-0 transition-all duration-500 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                      <span className="text-lg">→</span>
                    </div>
                  </div>

                  {/* Bottom Elements: Title & Description */}
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <h3 className="text-white font-space font-black uppercase text-3xl md:text-4xl leading-none mb-4 tracking-tight drop-shadow-md">
                      {project.title}
                    </h3>
                    <p className="font-inter text-white/70 text-sm leading-relaxed max-w-[90%] opacity-80 group-hover:opacity-100 group-hover:text-white transition-all duration-500">
                      {project.desc}
                    </p>
                  </div>

                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERTISE / SERVICES SECTION */}
      <section id="expertise" className="bg-white text-black py-32 px-6 border-t border-black">
        <div className="w-full max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-8">
             <h2 className="text-6xl sm:text-7xl md:text-8xl lg:text-[10vw] font-serif uppercase leading-[0.8] tracking-tighter">Areas of<br/>Practice</h2>
             <p className="font-outfit text-[10px] font-bold uppercase tracking-[0.4em] text-black/60 max-w-sm">/ Core disciplines and technical domains of expertise.</p>
          </div>
          
          <div className="flex flex-col border-t border-black">
            {[
              { domain: "Creative Engineering", desc: "Bridging the gap between high-end editorial aesthetics and deep technical execution." },
              { domain: "Cinematography", desc: "Directing and capturing powerful visual narratives with cinematic precision." },
              { domain: "Photography", desc: "Framing moments through an editorial lens with striking contrast and deliberate composition." },
              { domain: "Digital Infrastructure", desc: "Architecting scalable, resilient web systems and full-stack environments." },
              { domain: "Product Development", desc: "Engineering high-performance, robust transactional marketplaces and applications." }
            ].map((item, i) => (
              <div key={i} className="group relative border-b border-black py-12 md:py-16 flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer overflow-hidden px-4 hover:bg-[#fdfaf6] transition-colors duration-500">
                 <div className="z-10 relative flex flex-col md:flex-row items-baseline md:gap-12 w-full">
                    <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-black/40 mb-2 md:mb-0 w-12">0{i+1}</span>
                    <h3 className="text-4xl md:text-5xl lg:text-7xl font-serif uppercase tracking-tighter group-hover:italic transition-all duration-500">{item.domain}</h3>
                    <p className="md:ml-auto text-base md:text-lg font-serif italic text-black/60 mt-4 md:mt-0 max-w-sm text-left md:text-right leading-snug">{item.desc}</p>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE STUDIO SECTION (SPLIT WORLD) */}
      <section id="studio" className="bg-white text-black py-0 border-t border-black/5 min-h-[800px] flex flex-col lg:flex-row overflow-hidden relative group/studio">
        
        {/* Light Side - YouTube */}
        <motion.div 
          initial={false}
          animate={{ 
            width: isMobile ? '100%' : (activePanel === 'light' ? '85%' : activePanel === 'none' ? '50%' : '15%'),
            height: isMobile ? (activePanel === 'light' ? '80vh' : activePanel === 'none' ? '50vh' : '10vh') : 'auto'
          }}
          onMouseEnter={() => setActivePanel('light')}
          onMouseLeave={() => { setActivePanel('none'); setPlayingVideo(null); }}
          className="relative lg:h-screen bg-[#f5f2ed] transition-all duration-700 ease-[0.16,1,0.3,1] border-b lg:border-b-0 lg:border-r border-black/5 overflow-hidden flex flex-col"
        >
          {/* Vertical Label for Collapsed State (Desktop Only) */}
          <div className={`hidden lg:flex absolute top-0 left-0 bottom-0 w-full items-center justify-center pointer-events-none transition-opacity duration-500 ${activePanel === 'light' ? 'opacity-0' : 'opacity-100'}`}>
             <span className="font-space font-black uppercase text-xl md:text-2xl tracking-[0.5em] rotate-180 [writing-mode:vertical-lr] text-black/20">The Videos</span>
          </div>

          <div className={`w-full h-full p-8 md:p-12 flex flex-col justify-between transition-opacity duration-500 ${activePanel === 'light' || activePanel === 'none' ? 'opacity-100' : 'opacity-0'} overflow-y-auto`}>
             <div>
                <h2 className="text-4xl md:text-6xl lg:text-[8vw] font-space font-bold uppercase leading-none mb-6">Movements<br/>In Motion</h2>
                <p className="font-inter text-sm md:text-lg text-gray-500 max-w-sm lowercase italic">/ A deep dive into the technological experiments and digital philosophy of Ayorinde.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 overflow-hidden z-10 relative">
                {[
                  { id: "GUrQsgmBz30", title: "Cinematic Visual 01", fallbackImg: "/images/ig_post_1.jpg", alt: "Cinematic visual exploration combining motion design and technical concepts" },
                  { id: "QpN804ooQeI", title: "Visual Essay 02", fallbackImg: "/images/ig_post_2.jpg", alt: "A visual essay exploring editorial aesthetics" },
                  { id: "AzToLJ7FIOg", title: "Motion Archive 03", fallbackImg: "/images/ig_post_3.jpg", alt: "Archived motion design experiments" },
                  { id: "P-RATvT-2OM", title: "Editorial Cut 04", fallbackImg: "/images/ig_post_4.jpg", alt: "Editorial video cut highlighting design workflows" }
                ].map((vid, i) => (
                  <div key={i} className="group/vid relative aspect-video bg-gray-200 overflow-hidden block">
                    {playingVideo === vid.id ? (
                       <iframe 
                         width="100%" 
                         height="100%" 
                         src={`https://www.youtube.com/embed/${vid.id}?autoplay=1`} 
                         title={vid.title} 
                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                         allowFullScreen
                         className="absolute inset-0 z-20"
                       ></iframe>
                    ) : (
                       <button onClick={() => setPlayingVideo(vid.id)} className="w-full h-full cursor-pointer relative z-10 block" aria-label={`Play video: ${vid.title}`}>
                         <Image 
                           src={`https://img.youtube.com/vi/${vid.id}/hqdefault.jpg`} 
                           alt={vid.alt} 
                           fill
                           sizes="(max-width: 768px) 100vw, 50vw"
                           className="object-cover transition-transform duration-700 group-hover/vid:scale-105" 
                           // Fallback logic not easily supported by fill+Image without custom loader
                         />
                         <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/vid:opacity-100 transition-opacity" aria-hidden="true">
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white flex items-center justify-center text-white backdrop-blur-sm">▶</div>
                         </div>
                         <div className="absolute bottom-3 left-3 right-3 text-white text-left">
                            <div className="text-[7px] md:text-[8px] font-bold uppercase tracking-widest bg-black/50 inline-block px-2 py-1 mb-1">Play Inline</div>
                            <h3 className="text-[10px] md:text-sm font-space font-bold uppercase">{vid.title}</h3>
                         </div>
                       </button>
                    )}
                  </div>
                ))}
             </div>
          </div>
        </motion.div>

        {/* Dark Side - Instagram */}
        <motion.div 
          initial={false}
          animate={{ 
            width: isMobile ? '100%' : (activePanel === 'dark' ? '85%' : activePanel === 'none' ? '50%' : '15%'),
            height: isMobile ? (activePanel === 'dark' ? '80vh' : activePanel === 'none' ? '50vh' : '10vh') : 'auto'
          }}
          onMouseEnter={() => setActivePanel('dark')}
          onMouseLeave={() => setActivePanel('none')}
          className="relative lg:h-screen bg-[#0a0a0a] text-white transition-all duration-700 ease-[0.16,1,0.3,1] overflow-hidden flex flex-col"
        >
          {/* Vertical Label for Collapsed State (Desktop Only) */}
          <div className={`hidden lg:flex absolute top-0 left-0 bottom-0 w-full items-center justify-center pointer-events-none transition-opacity duration-500 ${activePanel === 'dark' ? 'opacity-0' : 'opacity-100'}`}>
             <span className="font-space font-black uppercase text-xl md:text-2xl tracking-[0.5em] rotate-180 [writing-mode:vertical-lr] text-white/10">The Gallery</span>
          </div>

          <div className={`w-full h-full p-8 md:p-12 flex flex-col transition-opacity duration-500 ${activePanel === 'dark' || activePanel === 'none' ? 'opacity-100' : 'opacity-0'} overflow-y-auto`}>
             <div>
                <h2 className="text-4xl md:text-6xl lg:text-[8vw] font-space font-bold uppercase leading-none mb-6 text-[var(--accent)]">Fragments<br/>Of Reality</h2>
                <p className="font-inter text-sm md:text-lg text-gray-400 max-w-sm lowercase italic">/ Capturing the textures, lights, and shadows that inspire our daily creative workflow.</p>
             </div>

             <div className="mt-8 flex-1 w-full min-h-[600px] md:min-h-[800px] grid grid-cols-2 grid-rows-2 gap-4">
                 {[1, 2, 3, 4].map(idx => (
                    <div key={idx} className="bg-[#111] animate-pulse rounded-sm relative overflow-hidden group">
                       <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="font-space font-bold uppercase tracking-widest text-[10px] text-white/50">Fragment {idx}</span>
                       </div>
                    </div>
                 ))}
             </div>
          </div>
        </motion.div>

      </section>

      {/* REPOS SECTION */}
      <section id="repos" className="bg-[#fcfbf9] text-black py-32 px-6 border-t border-black/5">
         <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-24 gap-8">
               <h2 className="text-6xl sm:text-7xl md:text-8xl lg:text-[10vw] font-space font-bold uppercase leading-[0.8] tracking-tighter">The<br/>Repos</h2>
               <div className="max-w-md">
                  <p className="font-inter text-sm md:text-lg text-gray-600 mb-8 lowercase italic">/ Core infrastructure, open-source architectures, and digital public goods built for the scalable web.</p>
                  <a href="https://github.com/giantfoe" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-4 bg-black text-white px-8 py-4 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-[var(--accent)] transition-all">
                    <span>Follow GitHub</span>
                    <span className="text-lg" aria-hidden="true">↗</span>
                  </a>
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/5 border border-black/5">
               {[
                 { 
                   name: "ptflio", 
                   desc: "A modern developer portfolio and engineering showcase site.",
                   lang: "TypeScript",
                   stars: "1",
                   forks: "0",
                   tag: "Portfolio",
                   url: "https://github.com/giantfoe/ptflio"
                 },
                 { 
                   name: "Marketplace-Infra-for-SL", 
                   desc: "Art marketplace application built with Next.js, Convex, and Clerk.",
                   lang: "TypeScript",
                   stars: "0",
                   forks: "0",
                   tag: "Web App",
                   url: "https://github.com/giantfoe/Marketplace-Infra-for-SL"
                 },
                 { 
                   name: "farm-connect", 
                   desc: "A digital agricultural networking platform and supply chain solution.",
                   lang: "TypeScript",
                   stars: "0",
                   forks: "0",
                   tag: "App",
                   url: "https://github.com/giantfoe/farm-connect"
                 },
                 { 
                   name: "freewrite", 
                   desc: "A free writing app for mac designed to eliminate distraction.",
                   lang: "App",
                   stars: "0",
                   forks: "0",
                   tag: "Desktop",
                   url: "https://github.com/giantfoe/freewrite"
                 },
                 { 
                   name: "NKVault", 
                   desc: "🔐 NKVault — Zero-knowledge password manager with Solana wallet auth, AES-256-GCM encryption, and browser extension.",
                   lang: "Svelte",
                   stars: "0",
                   forks: "1",
                   tag: "Security",
                   url: "https://github.com/giantfoe/NKVault"
                 },
                 { 
                   name: "claude-code", 
                   desc: "Claude Code Snapshot for Research. All original source code is the property of Anthropic.",
                   lang: "TypeScript",
                   stars: "0",
                   forks: "0",
                   tag: "Research",
                   url: "https://github.com/giantfoe/claude-code"
                 }
               ].map((repo, i) => (
                 <motion.div 
                   key={i}
                   whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                   className="bg-white p-8 md:p-12 flex flex-col justify-between group cursor-pointer border-r border-b border-black/5 last:border-r-0 last:border-b-0"
                 >
                    <div>
                       <div className="flex justify-between items-start mb-8">
                          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--accent)] font-space">{repo.tag}</div>
                          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                       </div>
                       <h3 className="text-2xl md:text-3xl lg:text-4xl font-space font-black uppercase mb-4 group-hover:text-[var(--accent)] transition-colors">{repo.name}</h3>
                       <p className="font-inter text-xs md:text-sm text-gray-600 leading-relaxed mb-8">
                         {repo.desc}
                       </p>
                    </div>
                    
                    <div className="flex flex-col gap-6">
                       <div className="flex justify-between items-center text-[10px] uppercase font-bold font-space tracking-widest text-[#1a1a1a]">
                          <div className="flex gap-4">
                             <div className="flex items-center gap-2">
                                <span className="text-gray-500">Stars</span>
                                <span>{repo.stars}</span>
                             </div>
                             <div className="flex items-center gap-2">
                                <span className="text-gray-500">Forks</span>
                                <span>{repo.forks}</span>
                             </div>
                          </div>
                          <div className="text-[var(--accent)]">{repo.lang}</div>
                       </div>
                       <div className="h-[1px] w-full bg-black/5"></div>
                       <a href={repo.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[10px] md:text-xs font-bold uppercase tracking-widest group-hover:gap-5 transition-all">
                          <span>Explore Repository</span>
                          <span aria-hidden="true">→</span>
                       </a>
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* ARTICLES SECTION */}
      <section id="articles" className="bg-[#f2efe9] text-black py-32 px-6 overflow-hidden border-t border-black/5">
         <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-24 gap-8">
               <h2 className="text-6xl sm:text-7xl md:text-8xl lg:text-[10vw] font-space font-bold uppercase leading-[0.8] tracking-tighter">The<br/>Journal</h2>
               <div className="max-w-md">
                  <p className="font-inter text-lg text-gray-600 mb-8 lowercase italic">/ Documenting thoughts, technical deep-dives, and philosophical musings.</p>
                  <a href="https://medium.com/@ayorinde270" target="_blank" rel="noopener noreferrer" className="inline-block bg-black text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[var(--accent)] transition-all">Read on Medium</a>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-12">
               {articles.map((item, i) => (
                  <motion.a 
                     key={i} 
                     onClick={(e) => {
                       if (item.content) {
                         e.preventDefault();
                         setReadingArticle(item);
                         document.body.style.overflow = 'hidden';
                       }
                     }}
                     href={item.link}
                     target="_blank"
                     rel="noopener noreferrer"
                     className={`block relative bg-white border border-black/10 p-8 lg:p-10 group cursor-pointer transition-all duration-700 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-2xl rounded-sm ${i === 1 || i === 4 ? 'lg:translate-y-12' : ''}`}
                  >
                     {/* Hover Overlay */}
                     <div className="absolute inset-0 bg-[#1a1a1a] translate-y-full group-hover:translate-y-0 transition-transform duration-[800ms] ease-[0.16,1,0.3,1] z-0"></div>

                     {/* Giant BG number */}
                     <div className="absolute -right-8 -bottom-12 text-[150px] leading-none font-space font-black text-black/[0.02] group-hover:text-white/5 transition-colors duration-[800ms] ease-[0.16,1,0.3,1] pointer-events-none select-none z-0">
                        0{i+1}
                     </div>

                     <div className="relative z-10 flex flex-col h-full justify-between min-h-[300px]">
                        <div>
                           <div className="flex justify-between items-start mb-16 lg:mb-24">
                              <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-space text-gray-400 group-hover:text-white/60 transition-colors duration-[800ms] ease-[0.16,1,0.3,1]">{item.date}</span>
                              <div className="w-12 h-12 rounded-full border border-black/10 group-hover:border-white/20 flex items-center justify-center transform group-hover:-rotate-45 group-hover:bg-[var(--accent)] group-hover:border-[var(--accent)] transition-all duration-[800ms] ease-[0.16,1,0.3,1]">
                                 <span className="text-xl text-black group-hover:text-white transition-colors duration-[800ms] ease-[0.16,1,0.3,1]">→</span>
                              </div>
                           </div>
                           <h3 className="text-3xl lg:text-4xl font-serif font-medium tracking-tighter leading-[1.1] group-hover:text-white transition-colors duration-[800ms] ease-[0.16,1,0.3,1] group-hover:italic max-w-[90%]">{item.title}</h3>
                        </div>
                        <div className="mt-12 pt-6 border-t border-black/10 group-hover:border-white/20 transition-colors duration-[800ms] ease-[0.16,1,0.3,1] flex justify-between items-end">
                           <span className="text-[10px] uppercase tracking-widest font-bold text-black/50 group-hover:text-[var(--accent)] transition-colors duration-[800ms] ease-[0.16,1,0.3,1]">Read Full Text</span>
                           <span className="text-xs font-space font-bold uppercase tracking-widest text-black/20 group-hover:text-white/20 transition-colors duration-[800ms] ease-[0.16,1,0.3,1]">Artcl</span>
                        </div>
                     </div>
                  </motion.a>
               ))}
            </div>
         </div>
      </section>

      {/* CREATE WITH US FOOTER SECTION */}
      <section className="bg-black text-white py-32 px-6 border-t border-white/10">
         <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-32 gap-12">
               <h2 className="text-[12vw] md:text-[14vw] font-space font-bold uppercase leading-[0.8] tracking-tighter">
                  Create<br/>With<br/>Us
               </h2>
               <div className="max-w-md w-full">
                  <p className="font-inter text-lg text-gray-400 mb-12 lowercase italic">/ Let's build something for the digital vanguard.</p>
                  <div className="flex flex-col gap-4">
                    <a href="https://wa.me/23279763339" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 border-b border-white/30 px-0 py-4 w-full text-xl font-space uppercase text-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors group">
                       <span>Start a project via WhatsApp</span>
                       <span className="text-[var(--accent)] text-4xl group-hover:translate-x-2 transition-transform" aria-hidden="true">→</span>
                    </a>
                    <a href="mailto:ayorinde270@gmail.com" className="flex items-center gap-4 border-b border-white/30 px-0 py-4 w-full text-xl font-space uppercase text-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors group">
                       <span>Email For Inquiries</span>
                       <span className="text-[var(--accent)] text-4xl group-hover:translate-x-2 transition-transform" aria-hidden="true">→</span>
                    </a>
                  </div>
               </div>
            </div>
            
            <footer className="grid grid-cols-2 md:grid-cols-4 gap-12 pt-24 border-t border-white/10 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">
               <div className="flex flex-col gap-4">
                  <div className="text-white mb-2">Ayorinde © {new Date().getFullYear()}</div>
                  <div>All rights reserved.</div>
               </div>
               <div className="flex flex-col gap-4">
                  <div className="text-white mb-2">Social</div>
                  <a href="https://www.instagram.com/ayorinde270" target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a>
                  <a href="https://twitter.com/ayorinde270" target="_blank" rel="noopener noreferrer" className="hover:text-white">Twitter</a>
                  <a href="https://www.linkedin.com/in/ayorinde270" target="_blank" rel="noopener noreferrer" className="hover:text-white">LinkedIn</a>
               </div>
               <div className="flex flex-col gap-4">
                  <div className="text-white mb-2">Contact</div>
                  <a href="mailto:ayorinde270@gmail.com" className="hover:text-white normal-case">ayorinde270@gmail.com</a>
                  <a href="https://wa.me/23279763339" target="_blank" rel="noopener noreferrer" className="hover:text-white">+232 79 763 339</a>
               </div>
               <div className="flex flex-col gap-4 text-right">
                  <div className="text-white mb-2">Location</div>
                  <div>Freetown, Sierra Leone</div>
                  <div>West Africa</div>
               </div>
            </footer>
         </div>
      </section>

      {/* READING MODAL */}
      {readingArticle && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 z-[200] bg-[#fdfaf6] text-black overflow-y-auto w-full h-full"
        >
          <div className="max-w-3xl mx-auto px-6 py-24 md:py-32 relative min-h-screen flex flex-col">
            <button 
              onClick={() => {
                setReadingArticle(null);
                document.body.style.overflow = 'auto';
              }}
              className="sticky top-6 left-0 bg-[#ff3d00] text-white w-12 h-12 rounded-full flex items-center justify-center mb-12 hover:scale-110 transition-transform z-50 self-end shadow-lg"
            >
              ✕
            </button>
            <div className="mb-16 border-b border-black/10 pb-16">
               <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 font-space mb-6">{readingArticle.date}</div>
               <h1 className="text-4xl md:text-6xl font-serif tracking-tighter leading-[1.1] text-[#1a1a1a] p-0 m-0">{readingArticle.title}</h1>
            </div>
            
            <div className="article-content font-inter text-lg leading-[1.8] text-gray-800" dangerouslySetInnerHTML={{ __html: readingArticle.content }}></div>
          </div>
        </motion.div>
      )}

    </main>
  );
}
