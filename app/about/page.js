import { Beaker, Code, Cpu, Target } from 'lucide-react';

export const metadata = {
  title: 'About | Physics Lab',
  description: 'Learn about the technology behind Physics Lab.',
};

export default function About() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 py-16">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex justify-center items-center p-4 bg-cyan-950/50 rounded-2xl mb-6">
            <Beaker className="w-12 h-12 text-cyan-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">About <span className="text-cyan-400">PhysicsLab</span></h1>
          <p className="text-slate-400 text-lg md:text-xl leading-relaxed">
            PhysicsLab is an open-source educational platform designed to make learning physics interactive, visual, and highly accessible right from your web browser.
          </p>
        </div>

        {/* Tech Stack Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <Code className="w-8 h-8 text-indigo-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Next.js & React</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              The platform is built on the modern App Router architecture in Next.js, providing lightning-fast rendering, seamless page transitions, and a highly componentized UI powered by Tailwind CSS.
            </p>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <Cpu className="w-8 h-8 text-rose-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Matter.js Engine</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              The physics simulations run on Matter.js, a 2D rigid body physics engine. We utilize advanced engine iterations, composites, and constraints to simulate accurate real-world forces.
            </p>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-slate-900 to-cyan-950/20 border border-slate-800 rounded-2xl p-8 md:p-12 text-center">
          <Target className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Reading about physics in a textbook is one thing, but interacting with it builds intuition. We built this platform so students can throw objects, change gravity, break structures, and learn through experimentation without needing expensive lab equipment.
          </p>
        </div>

      </div>
    </div>
  );
}