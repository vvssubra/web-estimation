import React from 'react';
import { Calculator } from './components/Calculator';

const App: React.FC = () => {
  return (
    <div className="relative min-h-screen text-slate-100 selection:bg-cyan-300/30 selection:text-cyan-100 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-16 h-72 w-72 rounded-full bg-cyan-500/25 blur-3xl" />
        <div className="absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-indigo-500/25 blur-3xl" />
      </div>
      <Calculator />
      
      <footer className="py-12 border-t border-cyan-500/20 bg-slate-950/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm font-black text-cyan-100 tracking-widest uppercase">VVS DIGITAL SOLUTIONS</p>
            <p className="text-xs text-slate-400 mt-1 italic">Crafting High-Performance Digital Experiences.</p>
          </div>
          <div className="flex gap-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">
            <a href="#" className="hover:text-cyan-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-cyan-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-cyan-300 transition-colors">Help</a>
          </div>
          <p className="text-[10px] text-slate-500 font-bold">
            &copy; {new Date().getFullYear()} VVS Digital Solutions. Built with AI.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
