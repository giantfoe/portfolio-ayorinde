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

  return (
    <main className="min-h-screen bg-[#050505] text-[#00ffcc] overflow-x-hidden font-mono selection:bg-[#00ffcc] selection:text-black relative">
      {/* CRT / Scanline Overlay */}
      <div className="pointer-events-none fixed inset-0 z-[100] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] opacity-40 mix-blend-overlay"></div>
      
      {/* Subtle Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#00ffcc] rounded-full blur-[200px] opacity-[0.07] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#00ffcc] rounded-full blur-[200px] opacity-[0.04] pointer-events-none"></div>

      {/* Top Navigation / Status HUD */}
      <nav className="relative z-50 w-full flex justify-between items-end px-6 md:px-10 py-6 border-b border-[#00ffcc]/20 bg-black/60 backdrop-blur-md">
        <div>
          <div className="text-[10px] tracking-[0.3em] opacity-60 mb-1">SYS.OP.AUTH // {id.toUpperCase()}</div>
          <Link href="/" className="text-xl md:text-2xl font-space font-bold tracking-widest uppercase text-white hover:text-[#00ffcc] transition-colors flex items-center gap-3">
            <span className="w-2 h-2 bg-[#00ffcc] animate-pulse rounded-sm"></span>
            SYS.MAINFRAME_RTN
          </Link>
        </div>
        <div className="hidden md:flex gap-8 text-[10px] tracking-[0.2em] font-bold opacity-60 uppercase text-right">
          <div className="flex items-center gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
             ENG: ONLINE
          </div>
          <div>SEC: INTACT</div>
          <div className="text-[#00ffcc]">HASH: {project.id.toUpperCase().substring(0, 8)}...</div>
        </div>
      </nav>

      {/* Main HUD Dashboard */}
      <div className="relative z-40 p-4 md:p-8 w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-100px)]">
        
        {/* Left Diagnostics Panel */}
        <div className="lg:col-span-3 flex flex-col gap-6 order-2 lg:order-1 h-full">
          {/* Data Module 1 */}
          <div className="border border-[#00ffcc]/30 bg-black/40 p-6 backdrop-blur-sm relative group hover:border-[#00ffcc]/60 transition-colors">
            {/* Corners */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00ffcc]"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#00ffcc]"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#00ffcc]"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00ffcc]"></div>
            
            <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 mb-6 flex justify-between border-b border-[#00ffcc]/20 pb-2">
              <span>Project Class</span>
              <span className="text-[#00ffcc]">[ {project.category} ]</span>
            </h3>
            
            <div className="space-y-4 text-[10px] md:text-xs tracking-widest uppercase font-space">
              <div className="flex justify-between items-center opacity-80 hover:opacity-100 transition-opacity cursor-default">
                <span>Core Status</span>
                <span className="text-[#00ffcc] animate-pulse bg-[#00ffcc]/10 px-2 py-0.5 border border-[#00ffcc]/30 rounded-sm">Deployed</span>
              </div>
              <div className="flex justify-between items-center opacity-80 hover:opacity-100 transition-opacity cursor-default">
                <span>Security</span>
                <span>Override</span>
              </div>
              <div className="flex justify-between items-center opacity-80 hover:opacity-100 transition-opacity cursor-default">
                <span>Architecture</span>
                <span>Scaled</span>
              </div>
            </div>
          </div>

          {/* Terminal / Live Feed Block */}
          <div className="border border-[#00ffcc]/20 bg-black/60 p-6 backdrop-blur-md flex-1 relative font-mono text-[10px] leading-relaxed overflow-hidden">
            <div className="opacity-50 text-[#00ffcc] mb-2 uppercase tracking-widest">{'>'} Boot sequence initiated...</div>
            <div className="opacity-50 text-[#00ffcc] mb-2 uppercase tracking-widest">{'>'} Bypassing mainframes...</div>
            <div className="opacity-50 text-[#00ffcc] mb-2 uppercase tracking-widest">{'>'} Loading asset matrices...</div>
            <div className="opacity-50 text-[#00ffcc] mb-6 uppercase tracking-widest">{'>'} System protocols verified.</div>
            
            <div className="border-l-2 border-[#00ffcc]/50 pl-4 py-2 mt-6">
              <div className="text-[9px] uppercase tracking-[0.2em] mb-2 text-white/40">Target Entity:</div>
              <div className="opacity-90 text-white uppercase text-sm font-space tracking-widest font-black break-words">
                {project.title.split('').join(' ')}
              </div>
            </div>

            {/* Fake terminal graph/wave */}
            <div className="mt-8 opacity-30 flex items-end gap-1 h-12">
               {[...Array(15)].map((_, i) => (
                 <div key={i} className="flex-1 bg-[#00ffcc]" style={{ height: `${Math.max(20, Math.random() * 100)}%`, opacity: Math.random() }}></div>
               ))}
            </div>
          </div>
        </div>

        {/* Center Imaging / Hologram Setup */}
        <div className="lg:col-span-6 flex flex-col order-1 lg:order-2 lg:h-[calc(100vh-140px)] min-h-[50vh] relative">
           {/* Crosshairs & Grid Background */}
           <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,204,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,204,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-10"></div>
           <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#00ffcc]/20 pointer-events-none z-20"></div>
           <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#00ffcc]/20 pointer-events-none z-20"></div>
           
           {/* Center Lock Reticle */}
           <div className="absolute top-1/2 left-1/2 w-24 h-24 -translate-x-1/2 -translate-y-1/2 border border-[#00ffcc]/40 rounded-full pointer-events-none z-30 flex items-center justify-center">
             <div className="w-16 h-16 border border-[#00ffcc]/20 rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
                <div className="absolute top-[-2px] left-1/2 w-1 h-2 bg-[#00ffcc]"></div>
                <div className="absolute bottom-[-2px] left-1/2 w-1 h-2 bg-[#00ffcc]"></div>
             </div>
             <div className="w-1.5 h-1.5 bg-[#00ffcc] rounded-full shadow-[0_0_10px_#00ffcc]"></div>
           </div>

           {/* Image Frame */}
           <div className="border border-[#00ffcc]/50 p-2 bg-black/40 h-full relative group shadow-[inset_0_0_50px_rgba(0,255,204,0.05)]">
              {/* Scanning HUD Line */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00ffcc] opacity-70 shadow-[0_0_15px_#00ffcc] z-40 animate-[scan_3s_ease-in-out_infinite]"></div>

              <div className="w-full h-full relative overflow-hidden bg-black mix-blend-screen isolate flex items-center justify-center">
                 <img 
                  src={project.img} 
                  alt={project.title} 
                  className="w-full h-full object-cover grayscale contrast-200 brightness-50 sepia-[.2] hue-rotate-[140deg] saturate-[3] mix-blend-lighten group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 group-hover:sepia-0 group-hover:hue-rotate-0 group-hover:saturate-100 group-hover:mix-blend-normal transition-all duration-[3000ms] ease-out z-10" 
                />
                 {/* Cyberpunk dot pattern overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,255,204,0.15)_1px,transparent_1px)] bg-[size:10px_10px] z-20 pointer-events-none mix-blend-overlay"></div>
              </div>
              
              {/* Image Coordinate Markers */}
              <div className="absolute bottom-4 left-4 text-[9px] tracking-[0.3em] font-bold text-[#00ffcc] z-40 bg-black/80 border border-[#00ffcc]/30 px-3 py-1.5 backdrop-blur-md">
                 LAT: {(Math.random() * 90).toFixed(4)} N // LNG: {(Math.random() * 180).toFixed(4)} W
              </div>
              <div className="absolute top-4 right-4 text-[9px] tracking-[0.3em] font-bold text-black z-40 bg-[#00ffcc] px-3 py-1.5 shadow-[0_0_10px_#00ffcc]">
                 [ LOCK ACQUIRED ]
              </div>
           </div>
        </div>

        {/* Right Intel Panel */}
        <div className="lg:col-span-3 flex flex-col gap-6 order-3 lg:order-3 h-full">
           
           <div className="border border-[#00ffcc]/30 bg-[#0a0a0a]/80 p-6 lg:p-8 backdrop-blur-md h-full flex flex-col relative overflow-hidden group">
              {/* Deco Grid */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle,rgba(0,255,204,0.1)_1px,transparent_1px)] bg-[size:8px_8px] -mr-8 -mt-8 rounded-full blur-[2px]"></div>

              <h2 className="text-3xl md:text-5xl lg:text-5xl font-space font-black uppercase tracking-tighter mb-8 leading-[0.85] text-white break-words drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                {project.title.split(' ').map((word, i) => (
                  <span key={i} className="block">{word}</span>
                ))}
              </h2>

              <div className="border-b-2 border-dashed border-[#00ffcc]/30 pb-2 mb-6">
                 <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#00ffcc] opacity-80 flex items-center gap-2">
                    <span className="w-1 h-3 bg-[#00ffcc]"></span>
                    Mission Intel
                 </h3>
              </div>
              
              <div className="font-mono text-xs md:text-xs leading-[1.8] opacity-80 uppercase text-justify text-white/70 overflow-auto scrollbar-hide pr-2">
                 <span className="text-[#00ffcc] mr-2 opacity-100 font-black">{'>'}</span>
                 {project.longDesc}
              </div>

              <div className="mt-auto pt-12 relative z-10">
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full flex items-center justify-between border border-[#00ffcc] bg-[#00ffcc]/10 hover:bg-[#00ffcc] hover:text-black transition-all duration-300 px-6 py-4 uppercase font-bold tracking-[0.2em] text-[10px] group/btn hover:shadow-[0_0_20px_rgba(0,255,204,0.4)]"
                >
                  <span className="flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-[#00ffcc] group-hover/btn:bg-black group-hover/btn:animate-ping rounded-full"></span>
                     Execute Directive
                  </span>
                  <span className="group-hover/btn:translate-x-2 transition-transform font-space text-lg">→</span>
                </a>
              </div>
           </div>

        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          5% { opacity: 0.8; }
          95% { opacity: 0.8; }
          100% { top: 100%; opacity: 0; }
        }
        
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
        }
      `}} />
    </main>
  );
}
