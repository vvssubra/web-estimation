import React from 'react';
import { Calculator } from './components/Calculator';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-cyan-100 selection:text-cyan-900">
      <Calculator />
      
      <footer className="py-12 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm font-black text-slate-900 tracking-widest uppercase">VVS DIGITAL SOLUTIONS</p>
            <p className="text-xs text-slate-400 mt-1 italic">Crafting High-Performance Digital Experiences.</p>
          </div>
          <div className="flex gap-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">
            <a href="#" className="hover:text-cyan-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-cyan-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-cyan-500 transition-colors">Help</a>
          </div>
          <p className="text-[10px] text-slate-300 font-bold">
            &copy; {new Date().getFullYear()} VVS Digital Solutions. Built with AI.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;