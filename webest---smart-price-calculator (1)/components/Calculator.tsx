import React, { useState, useMemo, useEffect } from 'react';
import { QUESTIONS, APP_NAME, SERVICE_PAGE_PRICE } from '../constants';
import { CalculatorState, Option, Question, PricingBreakdown, LeadFormData } from '../types';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Lock, 
  ShoppingCart, 
  Sparkles, 
  Send, 
  Plus, 
  Info,
  Loader2,
  Mail,
  MessageCircle,
  Briefcase,
  FileText,
  BrainCircuit,
  Lightbulb
} from 'lucide-react';
import { generateProposal } from '../services/geminiService';
import { submitLead } from '../services/submissionService';

const STEPS = ["Purpose", "Pages", "Design Tier", "Features", "Estimate"];

const TIER_FEATURES: Record<string, string[]> = {
  basic: [
    "Clean & standardized layout",
    "Essential visuals & fundamental motion",
    "Adaptive mobile responsiveness",
    "Fundamental brand styling"
  ],
  pro: [
    "Bespoke branded design",
    "Engaging animations & visuals",
    "Conversion-optimized UI/UX",
    "Priority support & maintenance"
  ],
  premium: [
    "Fully custom advanced layouts",
    "Premium motion graphics",
    "Data-driven optimization",
    "White-glove dedicated support"
  ]
};

const OptionToggle: React.FC<{
  option: Option;
  isSelected: boolean;
  onClick: () => void;
  showPriceReveal?: boolean;
}> = ({ option, isSelected, onClick, showPriceReveal }) => (
  <div
    onClick={onClick}
    className={`
      flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
      ${isSelected 
        ? 'border-cyan-500 bg-cyan-50/50' 
        : 'border-slate-100 bg-white hover:border-slate-300'}
    `}
  >
    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
      ${isSelected ? 'bg-cyan-500 border-cyan-500 text-white' : 'border-slate-300 bg-white'}
    `}>
      {isSelected && <Check size={14} strokeWidth={3} />}
    </div>
    <div className="flex-1 flex items-center gap-3">
      <div className={`${isSelected ? 'text-cyan-600' : 'text-slate-400'}`}>
        {option.icon}
      </div>
      <div>
        <p className={`font-semibold text-sm ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>{option.label}</p>
        {option.description && <p className="text-[10px] text-slate-400 uppercase tracking-tight">{option.description}</p>}
        {showPriceReveal && (
          <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
            <Lock size={8} /> Price revealed after submission
          </p>
        )}
      </div>
    </div>
  </div>
);

export const Calculator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [state, setState] = useState<CalculatorState>({
    purpose: [],
    pages: ['home', 'about', 'services', 'contact'], // Pre-selected
    features: [], 
    design: '', 
    services_count: 0
  });
  
  const [leadData, setLeadData] = useState<LeadFormData>({ 
    name: '', 
    email: '', 
    whatsapp: '+60 ', // Pre-filled with country code
    notes: '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // AI Analysis State
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const priceBreakdown = useMemo<PricingBreakdown>(() => {
    let subtotal = 0;
    let multiplier = 1;
    const items: { label: string; amount: number }[] = [];

    QUESTIONS.forEach((q) => {
      const val = state[q.id];
      if (!val) return;
      if (q.type === 'single') {
        const opt = q.options?.find((o) => o.id === val);
        if (opt) {
          subtotal += opt.priceEffect;
          if (opt.multiplier) multiplier *= opt.multiplier;
          items.push({ label: opt.label, amount: opt.priceEffect });
        }
      } else if (q.type === 'multiple' && Array.isArray(val)) {
        val.forEach((id) => {
          const opt = q.options?.find((o) => o.id === id);
          if (opt) {
            subtotal += opt.priceEffect;
            items.push({ label: opt.label, amount: opt.priceEffect });
          }
        });
      }
    });

    const svcCount = Number(state.services_count) || 0;
    if (svcCount > 0) {
      const svcCost = svcCount * SERVICE_PAGE_PRICE;
      subtotal += svcCost;
      items.push({ label: `${svcCount} Service Pages`, amount: svcCost });
    }
    
    return { subtotal, total: Math.round(subtotal * multiplier), items };
  }, [state]);

  // Trigger AI Analysis when reaching the final step
  useEffect(() => {
    if (currentStep === 4 && !aiAnalysis && !isGeneratingAI) {
      const triggerAI = async () => {
        setIsGeneratingAI(true);
        try {
          const analysis = await generateProposal(state, priceBreakdown.total);
          setAiAnalysis(analysis);
        } catch (e) {
          setAiAnalysis("Strategy analysis complete. Your current selection is highly optimized for growth.");
        } finally {
          setIsGeneratingAI(false);
        }
      };
      triggerAI();
    }
  }, [currentStep, aiAnalysis, isGeneratingAI, state, priceBreakdown.total]);

  // Auto-fill logic based on goal (Step 1 -> Step 2)
  useEffect(() => {
    if (currentStep === 1) {
      const currentPurpose = (state.purpose as string[]) || [];
      if (currentPurpose.includes('ecommerce')) {
        setState(prev => ({ 
          ...prev, 
          pages: Array.from(new Set([...((prev.pages as string[]) || []), 'ecommerce'])) 
        }));
      }
    }
  }, [currentStep, state.purpose]);

  const handleToggle = (qId: string, val: string) => {
    setState((prev) => {
      const current = (prev[qId] as string[]) || [];
      return {
        ...prev,
        [qId]: current.includes(val) ? current.filter(i => i !== val) : [...current, val]
      };
    });
  };

  const handleSingleSelect = (qId: string, val: string) => {
    setState(prev => ({ ...prev, [qId]: val }));
  };

  const handleLeadFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const finalAnalysis = aiAnalysis || await generateProposal(state, priceBreakdown.total);
      const success = await submitLead(leadData, state, priceBreakdown.total, finalAnalysis);
      if (success) {
        setIsSuccess(true);
      } else {
        alert("Submission failed. Please check your internet connection.");
      }
    } catch (error) {
      alert("Error processing quote. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Prevent user from deleting the +60 prefix entirely
    if (val.startsWith('+60')) {
      setLeadData(p => ({ ...p, whatsapp: val }));
    } else if (val.length < 3) {
      setLeadData(p => ({ ...p, whatsapp: '+60 ' }));
    } else {
      setLeadData(p => ({ ...p, whatsapp: '+60 ' + val.replace(/^\+60\s*/, '') }));
    }
  };

  const currentQ = QUESTIONS[currentStep] || null;

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 animate-fadeIn">
        <div className="bg-white rounded-[2.5rem] p-12 shadow-2xl text-center border-t-8 border-cyan-500">
          <div className="w-24 h-24 bg-cyan-50 text-cyan-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <Check size={48} strokeWidth={3} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-4">Request Sent!</h2>
          <p className="text-slate-500 text-lg mb-10 leading-relaxed">
            Success! We are crafting your custom quote for <span className="font-bold">{leadData.name}</span>.
            Check your inbox and phone shortly.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl flex flex-col items-center gap-2">
              <Mail className="text-cyan-500" />
              <span className="text-xs font-bold uppercase text-slate-400">Email Drafted</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl flex flex-col items-center gap-2">
              <MessageCircle className="text-cyan-500" />
              <span className="text-xs font-bold uppercase text-slate-400">WhatsApp Alert</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isIdSelected = (qId: string, id: string) => {
    const val = state[qId];
    return Array.isArray(val) ? val.includes(id) : val === id;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Top Header */}
      <div className="text-center mb-10">
        <div className="inline-block px-4 py-1.5 bg-cyan-400/20 border border-cyan-300/30 text-cyan-100 rounded-full text-xs font-black tracking-widest mb-4 uppercase backdrop-blur">
          {APP_NAME}
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-100 tracking-tight drop-shadow-[0_0_22px_rgba(56,189,248,0.35)]">
          Malaysia Web Design Price Calculator
        </h1>
        <p className="text-slate-300 mt-4 max-w-2xl mx-auto text-sm leading-relaxed">
          Get instant, accurate website cost estimates based on current market rates for service businesses, eCommerce, and more.
        </p>
      </div>

      {/* Progress Tabs */}
      <div className="bg-slate-900/50 rounded-2xl shadow-sm mb-10 overflow-hidden border border-cyan-500/20 backdrop-blur-xl">
        <div className="grid grid-cols-5 text-center text-[10px] md:text-xs font-bold uppercase tracking-widest border-b border-slate-50">
          {STEPS.map((s, idx) => (
            <div key={s} className={`py-6 px-2 transition-all ${currentStep === idx ? 'step-active text-cyan-600' : 'text-slate-300'}`}>
              {s}
            </div>
          ))}
        </div>
        <div className="py-2 text-center text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
          Step {currentStep + 1} of 5
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content Card */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-8 md:p-12 min-h-[600px] flex flex-col relative">
          
          {currentStep < 4 ? (
            <>
              <div className="mb-10">
                <h2 className="text-4xl font-black text-slate-900 mb-2 leading-tight">
                  {currentQ?.title}
                </h2>
                <p className="text-slate-400 text-lg">{currentQ?.subtitle}</p>
              </div>

              <div className="flex-1">
                {currentStep === 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQ?.options?.map(opt => (
                      <OptionToggle 
                        key={opt.id} 
                        option={opt} 
                        isSelected={isIdSelected('purpose', opt.id)}
                        onClick={() => handleToggle('purpose', opt.id)}
                      />
                    ))}
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-8">
                    <div>
                      <h4 className="flex items-center gap-2 text-cyan-600 font-bold text-sm mb-4">
                        <Check size={16} /> Essential Pages (Recommended)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                         {currentQ?.options?.slice(0, 4).map(opt => (
                           <OptionToggle 
                            key={opt.id} 
                            option={opt} 
                            isSelected={isIdSelected('pages', opt.id)}
                            onClick={() => handleToggle('pages', opt.id)}
                          />
                         ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="flex items-center gap-2 text-indigo-500 font-bold text-sm mb-4">
                        <Plus size={16} /> Optional Pages
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                         {currentQ?.options?.slice(4).map(opt => (
                           <OptionToggle 
                            key={opt.id} 
                            option={opt} 
                            isSelected={isIdSelected('pages', opt.id)}
                            onClick={() => handleToggle('pages', opt.id)}
                          />
                         ))}
                      </div>
                    </div>
                    <div className="p-6 bg-cyan-50 border border-cyan-100 rounded-2xl">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center text-white">
                            <Briefcase size={16} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">How many services do you want to promote?</p>
                            <p className="text-xs text-slate-400">Each service gets its own dedicated page with details and CTA</p>
                          </div>
                        </div>
                        <input 
                          type="number" 
                          min="0"
                          value={state.services_count as number}
                          onChange={(e) => setState(prev => ({...prev, services_count: e.target.value}))}
                          className="w-32 px-4 py-2 rounded-lg border-2 border-slate-900 bg-slate-900 text-white outline-none focus:border-cyan-500 font-bold shadow-lg placeholder-slate-400"
                        />
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {currentQ?.options?.map(opt => (
                      <div 
                        key={opt.id}
                        onClick={() => handleSingleSelect('design', opt.id)}
                        className={`
                          relative p-8 rounded-3xl border-2 transition-all cursor-pointer flex flex-col items-center text-center
                          ${state.design === opt.id ? 'border-cyan-500 bg-cyan-50/20 shadow-lg' : 'border-slate-100 hover:border-slate-300'}
                        `}
                      >
                        {opt.id === 'pro' && (
                          <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-cyan-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest">Recommended</span>
                        )}
                        <h3 className="text-3xl font-black text-slate-800 mb-2">{opt.label}</h3>
                        <p className="text-xs text-slate-400 mb-6 leading-relaxed">{opt.description}</p>
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4">
                          <Lock size={20} />
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-4">Price revealed after submission</p>
                        <ul className="text-left space-y-3 w-full">
                          {(TIER_FEATURES[opt.id] || []).map((feat, i) => (
                            <li key={i} className="text-[11px] text-slate-600 flex items-center gap-2">
                              <Check size={12} className="text-cyan-500" /> {feat}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQ?.options?.map(opt => (
                      <OptionToggle 
                        key={opt.id} 
                        option={opt} 
                        showPriceReveal
                        isSelected={isIdSelected('features', opt.id)}
                        onClick={() => handleToggle('features', opt.id)}
                      />
                    ))}
                    <div className="md:col-span-2 p-4 bg-cyan-50 border border-cyan-100 rounded-2xl flex items-center gap-3 text-xs text-cyan-700 font-bold">
                        <Info size={16} />
                        Tip: We've pre-selected features based on your goals. Feel free to adjust!
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-12 flex items-center gap-4 pt-8 border-t border-slate-50">
                {currentStep > 0 && (
                  <button 
                    onClick={() => setCurrentStep(c => c - 1)}
                    className="px-10 py-4 rounded-2xl font-black text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2"
                  >
                    <ChevronLeft size={20} /> Back
                  </button>
                )}
                <button 
                  onClick={() => setCurrentStep(c => c + 1)}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-cyan-500/30 transition-all flex items-center justify-center gap-2"
                >
                  Next Step <ChevronRight size={20} />
                </button>
              </div>
            </>
          ) : (
            // Final View / Lead Form + AI Insight
            <div className="animate-fadeIn">
              <div className="text-center mb-10">
                <h2 className="text-5xl font-black text-slate-900 mb-4">All Set!</h2>
                <p className="text-slate-500 text-lg">Your configuration is ready. See our AI strategy for you below.</p>
              </div>

              {/* AI Strategic Analysis Section */}
              <div className="mb-10 p-1 rounded-[2rem] bg-gradient-to-br from-cyan-500 to-indigo-600 shadow-2xl">
                <div className="bg-white rounded-[1.9rem] p-8 md:p-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                    <BrainCircuit size={120} />
                  </div>
                  
                  <div className="flex items-center gap-3 mb-6 relative">
                    <div className="w-10 h-10 bg-cyan-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-cyan-200">
                      <Sparkles size={20} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">AI Strategic Analysis</h3>
                    {isGeneratingAI && <Loader2 className="animate-spin text-cyan-500 ml-2" size={18} />}
                  </div>

                  <div className="relative min-h-[150px]">
                    {isGeneratingAI ? (
                      <div className="space-y-4 animate-pulse">
                        <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                        <div className="h-20 bg-slate-50 rounded w-full"></div>
                      </div>
                    ) : (
                      <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed prose-headings:text-slate-900 prose-headings:font-black prose-strong:text-cyan-600">
                        {aiAnalysis ? (
                          <div dangerouslySetInnerHTML={{ __html: aiAnalysis.replace(/\n/g, '<br/>') }} />
                        ) : (
                          <p>Analyzing your project strategy...</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Lightbulb className="text-amber-400" size={14} /> 
                    Powered by Gemini 3.0 Pro Intelligence
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
                <h4 className="text-center font-black text-slate-900 mb-6 uppercase tracking-widest text-sm italic underline decoration-cyan-500 decoration-4">Unlock Your Full Proposal</h4>
                <form onSubmit={handleLeadFormSubmit} className="max-w-xl mx-auto space-y-4 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Your Name</label>
                      <input 
                        type="text" required placeholder="Full Name"
                        className="w-full px-6 py-4 rounded-2xl border-2 border-white outline-none focus:border-cyan-500 font-medium bg-white shadow-sm transition-all"
                        value={leadData.name} onChange={e => setLeadData(p => ({...p, name: e.target.value}))}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">WhatsApp Number</label>
                      <input 
                        type="tel" required placeholder="+60 1x-xxxxxxx"
                        className="w-full px-6 py-4 rounded-2xl border-2 border-white outline-none focus:border-cyan-500 font-medium bg-white shadow-sm transition-all"
                        value={leadData.whatsapp} 
                        onChange={handleWhatsappChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Email Address</label>
                    <input 
                      type="email" required placeholder="hello@company.com"
                      className="w-full px-6 py-4 rounded-2xl border-2 border-white outline-none focus:border-cyan-500 font-medium bg-white shadow-sm transition-all"
                      value={leadData.email} onChange={e => setLeadData(p => ({...p, email: e.target.value}))}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Project Notes (Optional)</label>
                    <textarea 
                      placeholder="Tell us about any specific features or integrations you need..."
                      rows={3}
                      className="w-full px-6 py-4 rounded-2xl border-2 border-white outline-none focus:border-cyan-500 font-medium bg-white shadow-sm resize-none transition-all"
                      value={leadData.notes} onChange={e => setLeadData(p => ({...p, notes: e.target.value}))}
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-slate-900 hover:bg-black text-white py-5 rounded-2xl font-black text-xl shadow-2xl mt-6 transition-all flex items-center justify-center gap-2 group"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <>Send Me The Quote <Send size={20} className="group-hover:translate-x-1 transition-transform" /></>}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Wishlist Sidebar */}
        <div className="lg:col-span-4 lg:sticky lg:top-8">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 relative overflow-hidden">
            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
               <ShoppingCart className="text-cyan-500" /> Website Wishlist
            </h3>

            <div className="space-y-6 mb-10">
              {/* Pages Section */}
              <div>
                <div className="flex justify-between items-baseline mb-3">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Pages ({((state.pages as string[]) || []).length + (Number(state.services_count) || 0)})</p>
                </div>
                <div className="space-y-2">
                  {((state.pages as string[]) || []).map(p => (
                    <div key={p} className="bg-slate-50 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 capitalize">
                      {p}
                    </div>
                  ))}
                  {Number(state.services_count) > 0 && (
                    <div className="bg-slate-50 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 italic">
                      + {state.services_count} Service Pages
                    </div>
                  )}
                </div>
              </div>

              {/* Design Tier Sidebar */}
              {state.design && (
                <div>
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">Design Tier</p>
                   <div className="bg-cyan-50 px-4 py-2.5 rounded-xl text-xs font-bold text-cyan-600 capitalize">
                      {state.design} Level
                    </div>
                </div>
              )}

              {/* Features List for Sidebar */}
              {((state.features as string[]) || []).length > 0 && (
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">Add-ons</p>
                  <div className="flex flex-wrap gap-2">
                    {((state.features as string[]) || []).map(f => (
                      <span key={f} className="bg-slate-100 text-[10px] px-3 py-1.5 rounded-full font-bold text-slate-500 uppercase">{f}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-8 border-t border-slate-100 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 font-bold">Subtotal</span>
                <span className="text-slate-900 font-bold flex items-center gap-1">
                   <Lock size={12} className="text-slate-300" /> RM xx
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-900 font-black text-xl">Total</span>
                <span className="text-cyan-600 font-black text-2xl flex items-center gap-1">
                   <Lock size={16} className="text-rose-300" /> RM xx
                </span>
              </div>
              <p className="text-[9px] text-slate-400 text-center uppercase font-bold tracking-tight">
                Submit your details to unlock your personalized quote
              </p>
              
              {currentStep < 4 && (
                <button 
                  onClick={() => setCurrentStep(4)}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest mt-4 transition-all shadow-lg shadow-cyan-500/30"
                >
                  Reveal My Final Figure!
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
