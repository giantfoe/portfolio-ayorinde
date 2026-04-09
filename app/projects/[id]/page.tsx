import { projects } from "../../data/projects";
import { notFound } from "next/navigation";
import Link from "next/link";

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
    <main className="min-h-screen bg-white text-black overflow-x-hidden selection:bg-black selection:text-white">
      {/* NAVBAR */}
      <nav className="absolute top-0 w-full flex justify-between items-center px-6 md:px-12 py-8 z-[100] mix-blend-difference">
        <Link href="/" className="text-2xl font-space font-medium tracking-tight text-white uppercase">
          Ayorinde
        </Link>
        <Link 
          href="/" 
          className="text-[10px] font-medium uppercase tracking-[0.3em] text-white hover:opacity-50 transition-opacity"
        >
          [ Return to Studio ]
        </Link>
      </nav>

      {/* EDITORIAL HERO SECTION */}
      <div className="w-full min-h-screen flex flex-col md:flex-row border-b border-black">
        {/* Left Typography Block */}
        <div className="w-full md:w-[45%] flex flex-col justify-end px-6 md:px-12 pb-12 md:pb-24 pt-32 relative bg-white">
          
          <div className="mb-auto">
            <p className="font-outfit text-[10px] font-bold uppercase tracking-[0.4em] mb-4 text-black opacity-40">
              Editorial Volume 01
            </p>
            <span className="inline-block border border-black/20 text-black text-[9px] font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              {project.category}
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-[8vw] font-serif uppercase tracking-tighter leading-[0.8] text-black mb-8 break-words">
            {project.title.split(' ').map((word, i) => (
              <span key={i} className="block">{word}</span>
            ))}
          </h1>

        </div>

        {/* Right Image Block */}
        <div className="w-full md:w-[55%] h-[60vh] md:h-screen relative md:border-l border-t md:border-t-0 border-black p-4 md:p-8 bg-[#fdfaf6]">
          <div className="w-full h-full relative overflow-hidden group">
             <img 
              src={project.img} 
              alt={project.title} 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[1500ms] ease-[0.16,1,0.3,1] scale-[1.02] group-hover:scale-100" 
            />
          </div>
        </div>
      </div>

      {/* TWO-COLUMN EDITORIAL CONTENT */}
      <section className="px-6 md:px-12 py-24 md:py-32 w-full mx-auto flex flex-col md:flex-row gap-16 md:gap-32 bg-white">
        
        {/* Left Metadata Col */}
        <div className="w-full md:w-1/4 flex flex-col gap-12 font-outfit">
          <div className="border-t border-black pt-4">
            <h3 className="text-[9px] font-bold uppercase text-black opacity-40 tracking-[0.3em] mb-3">Role</h3>
            <p className="font-serif italic text-3xl text-black">Architect &<br/>Engineer</p>
          </div>
          <div className="border-t border-black pt-4">
            <h3 className="text-[9px] font-bold uppercase text-black opacity-40 tracking-[0.3em] mb-3">Client</h3>
            <p className="font-serif italic text-3xl text-black">Open Source<br/>Collection</p>
          </div>
        </div>

        {/* Right Article Col */}
        <div className="w-full md:w-2/4">
          <h2 className="text-[10px] font-outfit uppercase tracking-[0.3em] font-bold mb-12 opacity-40">The Dossier.</h2>
          
          <div className="font-serif text-2xl md:text-4xl leading-[1.3] text-black text-justify">
            {/* Drop Cap styling */}
            <span className="float-left text-7xl md:text-9xl leading-[0.7] pr-4 pt-2 font-serif uppercase tracking-tighter">
              {project.longDesc.charAt(0)}
            </span>
            {project.longDesc.substring(1)}
          </div>

          <div className="mt-24 border-t border-black pt-8">
            <a 
              href={project.link} 
              target="_blank" 
              rel="noreferrer"
              className="group inline-flex items-center gap-6 text-black"
            >
              <span className="font-outfit text-xs font-bold uppercase tracking-[0.3em] group-hover:opacity-50 transition-opacity">Launch Repository</span>
              <span className="font-serif text-5xl italic group-hover:translate-x-6 transition-transform duration-700 ease-[0.16,1,0.3,1]">→</span>
            </a>
          </div>
        </div>

      </section>

    </main>
  );
}
