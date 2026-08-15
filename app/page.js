import Link from 'next/link';
import { Atom, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-cyan-500/10 rounded-full border border-cyan-500/30">
            <Atom className="w-16 h-16 text-cyan-400" />
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight">
          Interactive <span className="text-cyan-400">Physics</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Don't just read about physics—experience it. Learn the fundamentals of gravity, friction, and momentum, then test them in our real-time 2D simulation lab.
        </p>

        <div className="pt-8">
          <Link 
            href="/lab" 
            className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 px-8 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-cyan-900/50"
          >
            Enter the Lab <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </main>
  );
}