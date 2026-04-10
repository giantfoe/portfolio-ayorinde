import { projects } from "../../data/projects";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export async function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }));
}

export default async function ProjectPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  // Use a generated fake ID based on the project ID string
  const hash = Array.from(id).reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return (
    <main className="min-h-screen bg-[#050505] text-[#ffffff] font-sans selection:bg-white selection:text-black overflow-x-hidden relative">
      
      {/* Background Global Grid */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:40px_40px] pointer-events-none"></div>

      <div className="relative z-10 max-w-[1200px] mx-auto border-l border-r border-[#333] shadow-[0_0_150px_rgba(0,0,0,1)] bg-black min-h-screen flex flex-col">
        
        {/* Top Navbar */}
        <nav className="flex items-center justify-between border-b border-white/20 px-4 py-4 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] bg-black z-20">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="hover:text-white/50 transition-colors">PROJECTS 作品</Link>
            <div className="text-white/50 cursor-crosshair hover:text-white transition-colors">LOOKBOOK 軌跡</div>
            <div className="text-white/50 cursor-crosshair hover:text-white transition-colors">BRAND 理念</div>
            <div className="text-white/50 cursor-crosshair hover:text-white transition-colors flex items-center gap-1">CART 大車 <span className="text-[9px] font-normal">[0]</span></div>
          </div>
          <div className="cursor-crosshair hover:text-white/50 text-xl font-light leading-none">+</div>
        </nav>

        {/* Giant Image Box with Background X */}
        <div className="w-full relative min-h-[45vh] md:min-h-[65vh] border-b border-white/20 bg-[#0a0a0a] flex items-center justify-center p-8 md:p-16 overflow-hidden z-10 group">
           {/* Corner Squares */}
           <div className="absolute top-[-3px] left-[-3px] w-1.5 h-1.5 bg-white z-20"></div>
           <div className="absolute top-[-3px] right-[-3px] w-1.5 h-1.5 bg-white z-20"></div>
           <div className="absolute bottom-[-3px] left-[-3px] w-1.5 h-1.5 bg-white z-20"></div>
           <div className="absolute bottom-[-3px] right-[-3px] w-1.5 h-1.5 bg-white z-20"></div>

           {/* Giant X background */}
           <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 z-0" preserveAspectRatio="none">
             <line x1="0" y1="0" x2="100%" y2="100%" stroke="#ffffff" strokeWidth="1" />
             <line x1="100%" y1="0" x2="0" y2="100%" stroke="#ffffff" strokeWidth="1" />
           </svg>

           {/* Central Image */}
           <div className="relative z-10 w-full h-full max-w-[80%] aspect-video bg-[#050505] border border-white/10 flex items-center justify-center shadow-2xl transition-transform duration-1000 group-hover:scale-[1.02]">
             <Image 
                src={project.img} 
                alt={project.title} 
                fill 
                className="object-cover filter grayscale contrast-[1.1] hover:grayscale-0 transition-all duration-[2000ms] p-2" 
             />
           </div>

           {/* Left/Right Arrows */}
           <Link href="/" className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-16 bg-white flex items-center justify-center cursor-crosshair hover:bg-[#e0e0e0] transition-colors z-30 shadow-lg">
             <span className="text-black text-4xl pixel-font leading-none -mt-1">←</span>
           </Link>
           <Link href="/" className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-16 bg-white flex items-center justify-center cursor-crosshair hover:bg-[#e0e0e0] transition-colors z-30 shadow-lg">
             <span className="text-black text-4xl pixel-font leading-none -mt-1">→</span>
           </Link>
        </div>

        {/* Thumbnail Strip */}
        <div className="w-full flex justify-center gap-4 py-6 border-b border-white/20 bg-black z-10 relative px-4 overflow-x-auto">
           {[1, 2, 3, 4, 5].map(idx => (
             <div key={idx} className="w-16 h-16 border border-white/20 bg-[#0a0a0a] p-1 
      hover:border-white transition-colors relative cursor-crosshair flex-shrink-0 group/thumb">
               <div className="absolute inset-1 border border-white/10 border-dashed group-hover/thumb:border-white/30 z-20"></div>
               <Image 
                 src={project.img} 
                 alt="thumbnail" 
                 fill 
                 className="object-cover grayscale opacity-40 group-hover/thumb:opacity-100 p-1 transition-opacity z-10" 
               />
             </div>
           ))}
        </div>

        {/* Title / Codename Block */}
        <div className="w-full p-6 md:p-8 border-b border-white/20 bg-black z-10 relative">
           <div className="flex items-center gap-2 overflow-hidden mb-2">
             <span className="text-[10px] font-bold tracking-[0.2em] uppercase shrink-0">CODENAME 代號</span>
             <span className="text-xs text-white/50 tracking-widest whitespace-nowrap opacity-60 font-mono">////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////</span>
           </div>

           <h1 className="pixel-font text-5xl md:text-7xl lg:text-[90px] tracking-widest text-white uppercase break-all leading-[0.85] mt-4 mb-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
             {project.id.replace(/-/g, '_')}_{hash}
           </h1>

           {/* Micro Data Columns */}
           <div className="grid grid-cols-4 md:grid-cols-6 border-t border-b border-white/20 text-[8px] md:text-[10px] tracking-[0.2em] divide-x divide-white/20 text-center uppercase py-2 opacity-80 tech-font">
              <div>IP . {project.lang || 'TS'}</div>
              <div className="hidden md:block">AKIS</div>
              <div>{project.category}</div>
              <div>CHAPTER 1</div>
              <div>PIECE 33</div>
              <div className="hidden md:block">BLACK</div>
           </div>
        </div>

        {/* Price / Sub-Metric Block */}
        <div className="w-full p-6 md:p-8 border-b border-white/20 bg-black z-10 relative">
           <div className="flex items-center gap-2 overflow-hidden mb-4">
             <span className="text-[10px] font-bold tracking-[0.2em] uppercase shrink-0">PRICE 価格</span>
             <span className="text-xs text-white/50 tracking-widest whitespace-nowrap opacity-60 font-mono">////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////</span>
           </div>

           <h2 className="pixel-font text-5xl md:text-7xl lg:text-[80px] tracking-wide text-white uppercase leading-none mb-6">
             {hash * 10}.00 SYS
           </h2>

           <div className="grid grid-cols-4 md:grid-cols-7 border-t border-b border-white/20 text-[8px] md:text-[10px] tracking-[0.2em] divide-x divide-white/20 text-center uppercase py-2 opacity-80 tech-font mb-6">
              <div>10</div>
              <div>THOUSAND</div>
              <div className="hidden md:block">6</div>
              <div>HUNDRED</div>
              <div className="hidden md:block">00</div>
              <div className="hidden md:block">Republic</div>
              <div>System</div>
           </div>
        </div>

        {/* Specs Box Row */}
        <div className="w-full grid grid-cols-4 md:grid-cols-7 border-b border-white/20 bg-black z-10 relative divide-x divide-white/20">
           <div className="p-4 md:p-6 bg-white text-black flex flex-col justify-between col-span-2 md:col-span-1 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]">
             <div className="text-[9px] font-bold tracking-widest mb-4 uppercase">SIZE 大小</div>
             <div className="pixel-font text-5xl md:text-6xl text-center leading-none">S</div>
           </div>

           <div className="p-4 md:p-6 text-white flex flex-col justify-between hover:bg-white/10 transition-colors cursor-crosshair">
             <div className="text-[9px] font-bold tracking-widest mb-4 opacity-50 uppercase">SIZE 大小</div>
             <div className="pixel-font text-5xl md:text-6xl text-center leading-none">M</div>
           </div>

           <div className="p-4 md:p-6 text-white flex flex-col justify-between hover:bg-white/10 transition-colors cursor-crosshair">
             <div className="text-[9px] font-bold tracking-widest mb-4 opacity-50 uppercase">SIZE 大小</div>
             <div className="pixel-font text-5xl md:text-6xl text-center leading-none">L</div>
           </div>

           <div className="p-4 md:p-6 text-white flex flex-col justify-between hover:bg-white/10 transition-colors cursor-crosshair col-span-2 md:col-span-1 border-t md:border-t-0 border-white/20 md:border-0">
             <div className="text-[9px] font-bold tracking-widest mb-4 opacity-50 uppercase">QUANTITY 数量</div>
             <div className="pixel-font text-5xl md:text-6xl text-center leading-none">01</div>
           </div>

           <div className="flex-col divide-y divide-white/20 text-white border-t md:border-t-0 border-white/20 md:border-0 hidden md:flex">
              <div className="flex-1 flex items-center justify-center text-4xl font-light hover:bg-white/20 transition-colors cursor-crosshair hover:text-black hover:font-bold">+</div>
              <div className="flex-1 flex items-center justify-center text-4xl font-light hover:bg-white/20 transition-colors cursor-crosshair hover:text-black hover:font-bold">-</div>
           </div>
           
           <div className="p-4 md:p-6 text-white flex flex-col justify-between hover:bg-white/10 transition-colors cursor-crosshair col-span-2 md:col-span-2 border-t md:border-t-0 border-white/20 md:border-l border-white/20">
             <div className="text-[9px] font-bold tracking-widest mb-4 opacity-50 uppercase">COLOR 顏色</div>
             <div className="pixel-font text-5xl md:text-6xl text-center leading-none">BK</div>
           </div>
        </div>

        {/* Data & Description Block */}
        <div className="w-full p-6 md:p-8 border-b border-white/20 bg-black z-10 relative">
          <div className="flex items-center gap-2 overflow-hidden mb-4">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase shrink-0">DATA 認証</span>
            <span className="text-xs text-white/50 tracking-widest whitespace-nowrap opacity-60 font-mono">////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////</span>
          </div>
          
          <h2 className="tech-font text-xl md:text-2xl font-bold uppercase tracking-widest mb-4 text-white">
             {project.title}
          </h2>
          <div className="tech-font text-sm md:text-base leading-relaxed text-white/80 max-w-4xl opacity-90">
            {project.longDesc}
          </div>
        </div>

        {/* Buttons Action Group */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 p-6 md:p-8 border-b border-white/20 bg-black z-10 relative">
           
           {/* Primary Button */}
           <a href={project.link} target="_blank" className="bg-black p-6 md:p-8 relative group hover:bg-[#1a1a1a] transition-all cursor-crosshair block overflow-hidden shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]">
              {/* Box Corner Brackets */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white opacity-80 group-hover:scale-110 transition-transform origin-top-left"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white opacity-80 group-hover:scale-110 transition-transform origin-top-right"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white opacity-80 group-hover:scale-110 transition-transform origin-bottom-left"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white opacity-80 group-hover:scale-110 transition-transform origin-bottom-right"></div>
              
              <div className="flex justify-between items-end h-full mt-2 relative z-10">
                <div className="pr-4">
                  <div className="text-2xl md:text-3xl font-medium tracking-wider mb-2 font-sans leading-none">Add to cart</div>
                  <div className="text-lg font-bold tracking-[0.2em] font-sans">起動する</div>
                </div>
                <div className="text-4xl font-light mb-1 opacity-50 group-hover:translate-x-3 group-hover:opacity-100 transition-all">→</div>
              </div>
           </a>

           {/* Secondary Button */}
           <Link href="/" className="bg-black p-6 md:p-8 relative group hover:bg-[#1a1a1a] transition-all cursor-crosshair block overflow-hidden shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]">
              {/* Box Corner Brackets */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white opacity-80 group-hover:scale-110 transition-transform origin-top-left"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white opacity-80 group-hover:scale-110 transition-transform origin-top-right"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white opacity-80 group-hover:scale-110 transition-transform origin-bottom-left"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white opacity-80 group-hover:scale-110 transition-transform origin-bottom-right"></div>
              
              <div className="flex justify-between items-end h-full mt-2 relative z-10">
                <div className="pr-4">
                  <div className="text-2xl md:text-3xl font-medium tracking-wider mb-2 font-sans leading-none">Pay later</div>
                  <div className="text-lg font-bold tracking-[0.2em] font-sans">戻る</div>
                </div>
                <div className="text-4xl font-light mb-1 opacity-50 group-hover:translate-x-3 group-hover:opacity-100 transition-all">→</div>
              </div>
           </Link>
        </div>

        {/* Specifications Dropdown Row */}
        <div className="w-full bg-black p-6 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/20 z-10 relative hover:bg-white/5 cursor-crosshair transition-colors">
           <div className="flex items-center gap-6">
             <div className="w-12 h-12 border border-white/80 flex items-center justify-center text-4xl bg-[#111] overflow-hidden group-hover:bg-white group-hover:text-black transition-colors">
               <span className="pixel-font mt-2">▧</span>
             </div>
             <div>
               <div className="text-xl md:text-2xl tracking-wide mb-1 font-sans">Specifications</div>
               <div className="text-sm tracking-[0.2em] font-bold">仕様</div>
             </div>
           </div>
           <div className="w-12 border-t-2 border-white mt-6 md:mt-0"></div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=VT323&display=swap');
        
        .pixel-font { font-family: 'VT323', monospace; font-weight: 400; font-style: normal; }
        .tech-font { font-family: 'Share Tech Mono', monospace; font-weight: 400; font-style: normal; }
        
        body::-webkit-scrollbar { width: 6px; }
        body::-webkit-scrollbar-track { background: #000; border-left: 1px solid rgba(255,255,255,0.2); }
        body::-webkit-scrollbar-thumb { background: #fff; }
        body { scrollbar-width: thin; scrollbar-color: #fff #000; cursor: crosshair; }
        
        a, button, .cursor-crosshair {
          cursor: crosshair !important;
        }
      `}} />
    </main>
  );
}
