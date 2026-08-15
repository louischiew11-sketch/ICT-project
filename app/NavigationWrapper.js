'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { Beaker, Code, Globe, Menu, X } from 'lucide-react';

export default function NavigationWrapper({ children }) {
  const pathname = usePathname();
  const isLab = pathname === '/lab';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isLab) {
    return <main className="flex-grow relative h-[100dvh] w-full overflow-hidden">{children}</main>;
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20 group-hover:border-cyan-400 transition-colors">
              <Beaker className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="font-bold text-lg tracking-tight">Physics<span className="text-cyan-400">Lab</span></span>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
            <Link href="/lab" className="hover:text-cyan-400 transition-colors">Interactive Lab</Link>
            <Link href="/curriculum" className="hover:text-cyan-400 transition-colors">Curriculum</Link>
            <Link href="/about" className="hover:text-cyan-400 transition-colors">About</Link>
            <Link href="/lab" className="px-4 py-2 bg-slate-100 text-slate-900 font-semibold rounded-lg text-sm hover:bg-cyan-400 transition-colors">
              Launch Sandbox
            </Link>
          </nav>

          {/* Mobile Hamburger Toggle */}
          <button 
            className="md:hidden p-2 text-slate-300 hover:text-white transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-slate-800 bg-slate-900/95 backdrop-blur-xl px-4 py-4 flex flex-col gap-4 text-sm font-medium">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-cyan-400">Home</Link>
            <Link href="/curriculum" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-cyan-400">Curriculum</Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-cyan-400">About</Link>
            <Link href="/lab" onClick={() => setMobileMenuOpen(false)} className="mt-2 w-full text-center px-4 py-3 bg-slate-100 text-slate-900 font-semibold rounded-lg text-sm hover:bg-cyan-400">
              Launch Interactive Lab
            </Link>
          </nav>
        )}
      </header>

      <main className="flex-grow relative">
        {children}
      </main>

      <footer className="border-t border-slate-800 bg-slate-900 relative z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} PhysicsLab EdTech. All rights reserved.
          </p>
          <div className="flex gap-4 text-slate-500">
            <a href="#" className="hover:text-cyan-400 transition-colors" title="Source Code"><Code className="w-5 h-5" /></a>
            <a href="#" className="hover:text-cyan-400 transition-colors" title="Website"><Globe className="w-5 h-5" /></a>
          </div>
        </div>
      </footer>
    </>
  );
}