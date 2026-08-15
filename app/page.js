import Link from 'next/link';
import { Activity, Beaker, Globe, Hammer, ArrowRight, Zap, Wind } from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30">
      
      {/*background ambient*/}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 flex flex-col items-center">
        
        {/*hero Section*/}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-cyan-400 text-sm font-medium mb-4">
            <Beaker className="w-4 h-4" /> Interactive EdTech Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            The Interactive <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Physics Lab</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-400 leading-relaxed">
            Physics isn't just math on a chalkboard. It's the ruleset of the universe. 
            Before you enter the sandbox, understand the four core forces you are about to manipulate.
          </p>
        </div>

        {/*concept cards grid*/}
        <div className="grid md:grid-cols-2 gap-6 w-full mb-16">
          
          {/*card 1: Restitution*/}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-8 rounded-3xl shadow-xl hover:border-cyan-500/50 transition-colors group">
            <div className="w-12 h-12 bg-cyan-950 rounded-2xl flex items-center justify-center mb-6 border border-cyan-800 group-hover:scale-110 transition-transform">
              <Activity className="text-cyan-400 w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Restitution (Bounciness)</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Restitution measures how much kinetic energy is retained after a collision. 
              <br /><br />
              A value of <strong>1.0</strong> means a perfect bounce where no energy is lost. A value of <strong>0.0</strong> means the object absorbs the impact and stops dead (like dropping a bowling ball in mud).
            </p>
          </div>

          {/*card 2: Friction*/}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-8 rounded-3xl shadow-xl hover:border-amber-500/50 transition-colors group">
            <div className="w-12 h-12 bg-amber-950 rounded-2xl flex items-center justify-center mb-6 border border-amber-800 group-hover:scale-110 transition-transform">
              <Wind className="text-amber-400 w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Surface Friction</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Friction is the resistance that one surface or object encounters when moving over another.
              <br /><br />
              Ice has near-zero friction, meaning objects will slide forever. Rubber has high friction (0.9), meaning it grips the surface and requires continuous force to keep moving.
            </p>
          </div>

          {/*card 3: Gravity */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-8 rounded-3xl shadow-xl hover:border-purple-500/50 transition-colors group">
            <div className="w-12 h-12 bg-purple-950 rounded-2xl flex items-center justify-center mb-6 border border-purple-800 group-hover:scale-110 transition-transform">
              <Globe className="text-purple-400 w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Gravitational Pull</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Gravity is the force by which a planet draws objects toward its center. 
              <br /><br />
              Earth accelerates objects at 9.8 m/s². On the Moon, gravity is only 16% as strong, making objects fall slowly. Jupiter is massive, pulling objects down 2.4 times faster than Earth!
            </p>
          </div>

          {/*card 4: Density & Mass */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-8 rounded-3xl shadow-xl hover:border-indigo-500/50 transition-colors group">
            <div className="w-12 h-12 bg-indigo-950 rounded-2xl flex items-center justify-center mb-6 border border-indigo-800 group-hover:scale-110 transition-transform">
              <Hammer className="text-indigo-400 w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Density & Mass</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              In the Object Forge, mass isn't just a random number. It's calculated dynamically!
              <br /><br />
              <strong>Mass = Volume × Density.</strong> A massive wooden triangle might weigh the same as a tiny metal square. Heavier objects will easily push lighter objects out of their way.
            </p>
          </div>

        </div>

        {/* Enter Lab CTA */}
        <div className="flex flex-col items-center">
          <Link 
            href="/lab"
            className="group relative flex items-center gap-3 px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-bold text-lg shadow-[0_0_40px_rgba(8,145,178,0.4)] hover:shadow-[0_0_60px_rgba(8,145,178,0.6)] transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
            <Zap className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Enter the Physics Lab</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="mt-4 text-slate-500 text-sm">Requires a mouse or touchscreen to drag objects.</p>
        </div>

      </div>
    </main>
  );
}