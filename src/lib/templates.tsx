import React from 'react';
import { Quote, Heart } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface QuoteData {
  text: string;
  author?: string;
  churchName?: string;
  churchHandle?: string;
  logoUrl?: string;
}

export type TemplateId = 
  | 'motivation-blue' 
  | 'devotion-classic' 
  | 'business-pro' 
  | 'premium-gold' 
  | 'modern-pulse' 
  | 'glass-card'
  | 'gradient-burst'
  | 'neon-glow';

export interface Template {
  id: TemplateId;
  name: string;
  description: string;
  component: React.FC<{ data: QuoteData }>;
  previewScale?: number;
}

// --- Components ---

const BrandingFooter: React.FC<{ name?: string; handle?: string; dark?: boolean }> = ({ name, handle, dark }) => {
  if (!name && !handle) return null;
  return (
    <div className={cn(
      "absolute bottom-12 left-0 w-full flex flex-col items-center justify-center gap-1",
      dark ? "text-white/70" : "text-slate-500"
    )}>
      {name && <p className="text-xl font-bold tracking-[0.2em] uppercase">{name}</p>}
      {handle && <p className="text-lg font-medium opacity-80">{handle}</p>}
    </div>
  );
};

// --- Templates ---

const BlueMotivationTemplate: React.FC<{ data: QuoteData }> = ({ data }) => {
  return (
    <div className="w-[1080px] h-[1080px] bg-slate-100 flex items-center justify-center relative overflow-hidden font-sans">
      {/* Faded logo background */}
      {data.logoUrl && (
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <img src={data.logoUrl} alt="" className="w-[600px] h-[600px] object-contain" />
        </div>
      )}
      
      <div className="absolute inset-0 opacity-10">
         <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="pattern-circles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="2" className="text-slate-900" fill="currentColor" />
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
         </svg>
      </div>
      
      <div className="relative w-[800px] h-[800px] bg-blue-600 rounded-[60px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center p-16 text-center text-white">
        {/* Logo in header */}
        {data.logoUrl && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 w-32 h-32 bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
            <img src={data.logoUrl} alt="Church Logo" className="w-full h-full object-contain" />
          </div>
        )}
        
        <Quote className="absolute top-12 left-12 w-24 h-24 text-yellow-400 opacity-80 fill-current rotate-180" />
        <Quote className="absolute bottom-12 right-12 w-24 h-24 text-yellow-400 opacity-80 fill-current" />
        
        <h3 className="text-2xl tracking-[0.2em] font-medium uppercase mb-8 opacity-80" style={{ marginTop: data.logoUrl ? '140px' : '0' }}>Daily Motivation</h3>
        
        <div className="flex-1 flex items-center justify-center">
           <p className="text-5xl md:text-6xl font-bold leading-tight drop-shadow-md">
             {data.text || "Your Quote Here"}
           </p>
        </div>

        {data.author && (
           <p className="mt-8 text-xl font-medium opacity-90">— {data.author}</p>
        )}
        
        <div className="mt-12">
          <BrandingFooter name={data.churchName} handle={data.churchHandle} dark={true} />
        </div>
      </div>
    </div>
  );
};

const DevotionTemplate: React.FC<{ data: QuoteData }> = ({ data }) => {
  return (
    <div className="w-[1080px] h-[1080px] bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center relative overflow-hidden font-serif">
       {/* Faded logo background */}
       {data.logoUrl && (
         <div className="absolute inset-0 flex items-center justify-center opacity-3">
           <img src={data.logoUrl} alt="" className="w-[700px] h-[700px] object-contain" />
         </div>
       )}
       
       <div className="relative w-[850px] h-[850px] bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col items-center p-20 text-center border border-white/50 backdrop-blur-sm">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 opacity-50 rounded-t-[40px]" />

          <div className="absolute top-12 flex flex-col items-center">
            {data.logoUrl ? (
              <div className="w-32 h-32 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 p-4">
                <img src={data.logoUrl} alt="Church Logo" className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10 text-amber-600" />
              </div>
            )}
            {data.churchName && (
              <p className="text-amber-800 font-sans font-bold tracking-widest text-sm uppercase mb-8">{data.churchName}</p>
            )}
          </div>

          <div className="flex-1 flex flex-col items-center justify-center" style={{ marginTop: data.churchName ? '20px' : '0' }}>
             <h2 className="text-6xl text-slate-800 leading-snug italic">
               "{data.text || "He restores my soul."}"
             </h2>
          </div>

          <div className="mt-8 bg-red-800 text-white px-12 py-4 rounded-full shadow-lg">
             <p className="text-2xl font-sans font-bold tracking-wide">
               {data.author || "Psalm 23:3"}
             </p>
          </div>
          
          {data.churchHandle && (
            <p className="mt-6 text-slate-400 font-sans tracking-widest text-sm">{data.churchHandle}</p>
          )}

          <Quote className="absolute top-16 left-16 w-16 h-16 text-amber-200 fill-current opacity-50" />
       </div>
    </div>
  );
};

const BusinessTemplate: React.FC<{ data: QuoteData }> = ({ data }) => {
  return (
    <div className="w-[1080px] h-[1080px] bg-white flex flex-col relative overflow-hidden font-serif">
      {/* Faded logo background */}
      {data.logoUrl && (
        <div className="absolute inset-0 flex items-center justify-center opacity-5 z-0">
          <img src={data.logoUrl} alt="" className="w-[500px] h-[500px] object-contain" />
        </div>
      )}
      
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-50 rounded-bl-[100%] z-0" />
      
      <div className="flex-1 z-10 flex flex-col justify-center px-24 py-32">
         <Quote className="w-32 h-32 text-red-600 mb-12" />
         
         <p className="text-7xl font-bold text-slate-900 leading-[1.1] mb-16 max-w-4xl">
           {data.text || "Success is not final, failure is not fatal."}
         </p>
         
         {data.author && (
            <div className="flex items-center gap-4">
              <div className="h-1 w-20 bg-red-600" />
              <p className="text-3xl text-slate-600 italic">{data.author}</p>
            </div>
         )}
      </div>

      <div className="h-32 bg-red-600 flex items-center justify-between px-24 z-10">
         <div className="flex items-center gap-6">
           {data.logoUrl && (
             <div className="w-20 h-20 bg-white/20 rounded-lg p-2">
               <img src={data.logoUrl} alt="Church Logo" className="w-full h-full object-contain" />
             </div>
           )}
           <p className="text-white font-sans font-bold tracking-[0.3em] text-2xl uppercase">
             {data.churchName || "YOUR MISSION"}
           </p>
         </div>
         <p className="text-white/80 font-sans font-medium tracking-[0.1em] text-lg">
           {data.churchHandle || "WWW.YOURWEBSITE.COM"}
         </p>
      </div>
    </div>
  );
};

const PremiumGoldTemplate: React.FC<{ data: QuoteData }> = ({ data }) => {
  return (
    <div className="w-[1080px] h-[1080px] bg-[#0c0c0c] flex items-center justify-center relative overflow-hidden font-serif">
      {/* Faded logo background */}
      {data.logoUrl && (
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <img src={data.logoUrl} alt="" className="w-[600px] h-[600px] object-contain" />
        </div>
      )}
      
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-400/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-600/20 blur-[150px] rounded-full" />
      </div>
      
      <div className="relative z-10 w-[900px] flex flex-col items-center">
        {data.logoUrl && (
          <div className="mb-12 w-28 h-28 bg-amber-400/10 rounded-2xl p-4 border border-amber-400/20">
            <img src={data.logoUrl} alt="Church Logo" className="w-full h-full object-contain" />
          </div>
        )}
        
        {data.churchName && (
          <div className="mb-16 flex flex-col items-center gap-4">
             <div className="w-12 h-px bg-amber-400" />
             <p className="text-amber-400 font-sans font-bold tracking-[0.4em] text-sm uppercase">{data.churchName}</p>
             <div className="w-12 h-px bg-amber-400" />
          </div>
        )}

        <p className="text-[80px] font-bold text-white leading-[1.1] text-center mb-12 drop-shadow-2xl">
          {data.text || "Grace is the only way forward."}
        </p>

        {data.author && (
          <p className="text-3xl text-amber-500 font-medium italic mb-20">{data.author}</p>
        )}

        {data.churchHandle && (
          <p className="text-white/40 font-sans tracking-[0.2em] text-lg uppercase">{data.churchHandle}</p>
        )}
      </div>
      
      <div className="absolute top-20 left-20 border-l border-t border-amber-400/30 w-40 h-40" />
      <div className="absolute bottom-20 right-20 border-r border-b border-amber-400/30 w-40 h-40" />
    </div>
  );
};


const ModernPulseTemplate: React.FC<{ data: QuoteData }> = ({ data }) => {
  return (
    <div className="w-[1080px] h-[1080px] bg-gradient-to-br from-[#6366f1] to-[#a855f7] flex items-center justify-center relative overflow-hidden font-sans">
      {/* Faded logo background */}
      {data.logoUrl && (
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <img src={data.logoUrl} alt="" className="w-[500px] h-[500px] object-contain" />
        </div>
      )}
      
      <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-20%] left-[-20%] w-[60%] h-[60%] bg-indigo-400/20 rounded-full blur-3xl" />

      <div className="relative z-10 w-[850px] bg-white rounded-[50px] shadow-2xl p-24 flex flex-col items-start min-h-[600px]">
        <div className="flex items-center gap-6 mb-12">
          {data.logoUrl && (
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-3 flex items-center justify-center">
              <img src={data.logoUrl} alt="Church Logo" className="w-full h-full object-contain" />
            </div>
          )}
          {data.churchName && (
            <p className="text-2xl font-black text-indigo-600 tracking-wide">{data.churchName}</p>
          )}
        </div>

        <p className="text-6xl font-black text-slate-900 leading-tight mb-12">
          {data.text || "KINDNESS IS A GIFT EVERYONE CAN AFFORD."}
        </p>

        <div className="mt-auto flex items-center justify-between w-full border-t border-slate-100 pt-12">
           <div>
             <p className="text-xl font-bold text-indigo-600">{data.author || "ANONYMOUS"}</p>
             <p className="text-slate-400 text-sm">{data.churchHandle || "@yourchurch"}</p>
           </div>
           {/* Sparkles component is not defined, assuming it's a placeholder or needs to be imported */}
           {/* <Sparkles className="w-12 h-12 text-indigo-100 fill-indigo-50" /> */}
        </div>
      </div>
    </div>
  );
};

const GlassCardTemplate: React.FC<{ data: QuoteData }> = ({ data }) => {
  const gradientColors = "from-[#00b4db] to-[#0083b0]";
  return (
    <div className={cn("w-[1080px] h-[1080px] bg-gradient-to-r flex items-center justify-center relative overflow-hidden font-sans", gradientColors)}>
      {/* Faded logo background */}
      {data.logoUrl && (
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <img src={data.logoUrl} alt="" className="w-[600px] h-[600px] object-contain" />
        </div>
      )}
      
      {/* Dynamic background bubbles */}
      <div className="absolute top-[10%] left-[15%] w-64 h-64 bg-white/20 rounded-full blur-xl" />
      <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-blue-400/30 rounded-full blur-2xl" />
      
      <div className="relative z-10 w-[900px] h-[700px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] shadow-2xl p-20 flex flex-col items-center justify-between text-center">
        <div className="flex flex-col items-center pt-6">
           {data.logoUrl ? (
             <div className="w-24 h-24 bg-white/20 rounded-lg p-3 mb-6">
               <img src={data.logoUrl} alt="Church Logo" className="w-full h-full object-contain" />
             </div>
           ) : (
             <div className="w-24 h-24 bg-white/20 rounded-lg flex items-center justify-center mb-6">
               <RefreshCw className="text-white w-6 h-6" />
             </div>
           )}
           {data.churchName && (
             <p className="text-white font-bold tracking-[0.3em] text-base uppercase mb-8">{data.churchName}</p>
           )}
        </div>

        <div className="flex-1 flex items-center justify-center px-8">
          <p className="text-5xl font-bold text-white leading-tight drop-shadow-lg">
            "{data.text || "Your vision is our mission."}"
          </p>
        </div>

        <div className="pb-6">
          {data.author && (
            <p className="text-2xl text-white/80 font-medium mb-6">— {data.author}</p>
          )}
           <p className="text-white/60 font-medium tracking-widest">{data.churchHandle || "@CHURCHLIFE"}</p>
        </div>
      </div>
    </div>
  );
};

// --- New Templates ---

const GradientBurstTemplate: React.FC<{ data: QuoteData }> = ({ data }) => {
  return (
    <div className="w-[1080px] h-[1080px] bg-gradient-to-br from-[#ff6b6b] via-[#ee5a6f] via-[#c44569] to-[#4834df] flex items-center justify-center relative overflow-hidden font-sans">
      {/* Faded logo background */}
      {data.logoUrl && (
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <img src={data.logoUrl} alt="" className="w-[600px] h-[600px] object-contain" />
        </div>
      )}
      
      {/* Animated gradient orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-300/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-400/30 rounded-full blur-3xl" />
      <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-purple-400/20 rounded-full blur-2xl" />
      
      <div className="relative z-10 w-full max-w-[1000px] text-center px-16">
        {/* Logo header */}
        {data.logoUrl && (
          <div className="w-40 h-40 bg-white/20 backdrop-blur-md rounded-3xl p-5 mx-auto mb-12 border border-white/30">
            <img src={data.logoUrl} alt="Church Logo" className="w-full h-full object-contain" />
          </div>
        )}
        
        {data.churchName && (
          <div className="mb-16">
            <p className="text-white/90 font-black tracking-[0.3em] text-xl uppercase">{data.churchName}</p>
          </div>
        )}

        <h1 className="text-[85px] font-black text-white leading-[0.95] mb-16 drop-shadow-2xl w-full">
          {data.text || "FAITH MOVES MOUNTAINS"}
        </h1>

        {data.author && (
          <div className="inline-block bg-white/20 backdrop-blur-md px-10 py-5 rounded-full border border-white/30">
            <p className="text-2xl text-white font-bold">{data.author}</p>
          </div>
        )}

        {data.churchHandle && (
          <p className="mt-12 text-white/70 font-bold tracking-[0.2em] text-lg">{data.churchHandle}</p>
        )}
      </div>
    </div>
  );
};


const NeonGlowTemplate: React.FC<{ data: QuoteData }> = ({ data }) => {
  return (
    <div className="w-[1080px] h-[1080px] bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden font-sans">
      {/* Faded logo background */}
      {data.logoUrl && (
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <img src={data.logoUrl} alt="" className="w-[700px] h-[700px] object-contain" />
        </div>
      )}
      
      {/* Neon glow effects */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00ffff" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      <div className="relative z-10 w-full max-w-[1000px] text-center px-16">
        {/* Logo with neon glow */}
        {data.logoUrl && (
          <div className="w-40 h-40 mx-auto mb-12 rounded-2xl p-5 bg-gradient-to-br from-cyan-500/20 to-pink-500/20 border border-cyan-400/30" style={{ boxShadow: '0 0 40px rgba(6, 182, 212, 0.3)' }}>
            <img src={data.logoUrl} alt="Church Logo" className="w-full h-full object-contain" />
          </div>
        )}
        
        {data.churchName && (
          <div className="mb-16">
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 font-black tracking-[0.3em] text-xl uppercase" style={{ textShadow: '0 0 20px rgba(6, 182, 212, 0.5)' }}>
              {data.churchName}
            </p>
          </div>
        )}

        <h1 className="text-[80px] font-black leading-[0.9] mb-16 w-full" style={{ 
          background: 'linear-gradient(135deg, #06b6d4 0%, #ec4899 50%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 80px rgba(6, 182, 212, 0.5), 0 0 40px rgba(236, 72, 153, 0.3)'
        }}>
          {data.text || "SHINE YOUR LIGHT"}
        </h1>

        {data.author && (
          <div className="inline-block px-8 py-4 rounded-full border border-cyan-400/30 bg-cyan-500/10" style={{ boxShadow: '0 0 30px rgba(6, 182, 212, 0.2)' }}>
            <p className="text-2xl text-cyan-300 font-bold">{data.author}</p>
          </div>
        )}

        {data.churchHandle && (
          <p className="mt-12 text-pink-300/60 font-bold tracking-[0.2em] text-lg">{data.churchHandle}</p>
        )}
      </div>
    </div>
  );
};

// --- Registry ---

export const TEMPLATES: Template[] = [
  {
    id: 'motivation-blue',
    name: 'Blue Motivation',
    description: 'Bold and modern, perfect for generic quotes.',
    component: BlueMotivationTemplate,
  },
  {
    id: 'devotion-classic',
    name: 'Daily Devotion',
    description: 'Elegant and peaceful, ideal for scripture.',
    component: DevotionTemplate,
  },
  {
    id: 'business-pro',
    name: 'Business Pro',
    description: 'Clean and professional, great for leadership quotes.',
    component: BusinessTemplate,
  },
  {
    id: 'premium-gold',
    name: 'Premium Gold',
    description: 'Luxurious dark design with gold accents.',
    component: PremiumGoldTemplate,
  },
  {
    id: 'modern-pulse',
    name: 'Modern Pulse',
    description: 'Vibrant and energetic with bold typography.',
    component: ModernPulseTemplate,
  },
  {
    id: 'glass-card',
    name: 'Dynamic Glass',
    description: 'Modern glassmorphism effect.',
    component: GlassCardTemplate,
  },
  {
    id: 'gradient-burst',
    name: 'Gradient Burst',
    description: 'Vibrant multi-color gradients with bold energy.',
    component: GradientBurstTemplate,
  },
  {
    id: 'neon-glow',
    name: 'Neon Glow',
    description: 'Dark background with glowing neon-style text.',
    component: NeonGlowTemplate,
  },
];

// --- Matching Logic ---

export const matchTemplate = (text: string): TemplateId => {
  const lower = text.toLowerCase();
  
  const devotionKeywords = ['god', 'lord', 'jesus', 'pray', 'bible', 'verse', 'psalm', 'church', 'faith', 'holy', 'bless', 'amen', 'soul', 'spirit', 'christ'];
  const businessKeywords = ['success', 'money', 'business', 'work', 'goal', 'lead', 'team', 'growth', 'market', 'strategy', 'profit', 'hustle', 'career', 'leader'];
  
  if (devotionKeywords.some(k => lower.includes(k))) return 'devotion-classic';
  if (businessKeywords.some(k => lower.includes(k))) return 'business-pro';
  
  return 'motivation-blue';
};

import {  RefreshCw } from 'lucide-react';
