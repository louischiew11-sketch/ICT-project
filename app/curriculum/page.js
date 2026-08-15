import Link from 'next/link';
import { BookOpen, Activity, Wind, Globe, Layers, Link2, Target, Zap, Box, Droplets, Play } from 'lucide-react';

export const metadata = {
  title: 'Curriculum | Physics Lab',
  description: 'Explore our 10 interactive physics lessons.',
};

export default function Curriculum() {
  const lessons = [
    { id: 1, title: 'Restitution', desc: 'Observe kinetic energy retention and bounciness across different materials.', icon: Activity },
    { id: 2, title: 'Friction', desc: 'Learn how friction resists sliding motion on angled planes.', icon: Layers },
    { id: 3, title: 'Gravity', desc: 'Experience how different planetary masses affect acceleration.', icon: Globe },
    { id: 4, title: 'Air Resistance', desc: 'See how aerodynamic drag affects falling speed regardless of mass.', icon: Wind },
    { id: 5, title: 'Momentum', desc: 'Visualize the conservation of momentum using a Newton\'s Cradle.', icon: Target },
    { id: 6, title: 'Kinetics', desc: 'Transfer massive kinetic force into a stable structural pyramid.', icon: Zap },
    { id: 7, title: 'Elasticity', desc: 'Experiment with springs, constraints, and slingshot mechanics.', icon: Link2 },
    { id: 8, title: 'Tension', desc: 'Test the structural integrity of a suspension bridge under load.', icon: Box },
    { id: 9, title: 'Soft Bodies', desc: 'Observe how deformable composite mesh networks react to collisions.', icon: Droplets },
    { id: 10, title: 'Granular Flow', desc: 'Watch thousands of rigid particles act like a fluid through a funnel.', icon: BookOpen },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 py-16">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Course <span className="text-cyan-400">Curriculum</span></h1>
          <p className="text-slate-400 max-w-2xl text-lg">
            Progress through 10 interactive modules designed to turn abstract physics concepts into tangible, explorable simulations.
          </p>
        </div>

        {/* Grid of Lessons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => {
            const Icon = lesson.icon;
            return (
              <div key={lesson.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/50 hover:bg-slate-900 transition-all group flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-slate-800 rounded-lg text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-950 transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    <span className="text-slate-500 mr-2">{lesson.id}.</span>
                    {lesson.title}
                  </h2>
                </div>
                <p className="text-slate-400 text-sm flex-grow mb-6">
                  {lesson.desc}
                </p>
                <Link href="/lab" className="flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 w-fit">
                  <Play className="w-4 h-4" /> Start Lesson
                </Link>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}