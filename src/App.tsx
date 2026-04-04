import { useState, useEffect, useRef } from 'react';
import { Download, Type, Sparkles, Building2, AtSign, Settings2, Upload, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import { TEMPLATES, matchTemplate, type TemplateId, cn } from './lib/templates';

function App() {
  const [inputText, setInputText] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<TemplateId>('motivation-blue');
  const [author, setAuthor] = useState('');
  const [churchName, setChurchName] = useState('Christ Chosen Zion City Ministry');
  const [churchHandle, setChurchHandle] = useState('@churchhandle');
  const [isAutoMatch, setIsAutoMatch] = useState(true);
  const [activeTab, setActiveTab] = useState<'content' | 'branding'>('content');
  const [logoUrl, setLogoUrl] = useState<string>('/default-logo.png');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Mobile: true = show preview, false = show editor
  const [isMobilePreview, setIsMobilePreview] = useState(false);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(0.5);

  // Handle fluid scaling for preview
  const updateScale = () => {
    if (previewContainerRef.current) {
      const containerWidth = previewContainerRef.current.clientWidth;
      const containerHeight = previewContainerRef.current.clientHeight;
      
      if (isMobilePreview) {
        // Robust "Cover" scaling for immersive view
        const scale = Math.max(containerWidth / 1080, containerHeight / 1080);
        setPreviewScale(scale);
      } else {
        // Standard "Contain" scaling for editor view
        const padding = window.innerWidth < 1024 ? 0 : 64; 
        const availableWidth = containerWidth - padding;
        const availableHeight = containerHeight - padding;
        const scale = Math.min(availableWidth / 1080, availableHeight / 1080);
        setPreviewScale(Math.max(0.1, scale));
      }
    }
  };

  useEffect(() => {

    const observer = new ResizeObserver(updateScale);
    if (previewContainerRef.current) {
      observer.observe(previewContainerRef.current);
    }
    
    updateScale();
    window.addEventListener('resize', updateScale);
    
    // Call updateScale after a short delay to ensure layout has settled (especially for transition/fullscreen toggle)
    const timeout = setTimeout(() => {
      requestAnimationFrame(updateScale);
    }, 50);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
      window.removeEventListener('resize', updateScale);
    };
  }, [isMobilePreview]); // Now correctly updates when switching tabs
  
  const MAX_CHARS = 100;

  // Load logo from localStorage on mount, fall back to default if none
  useEffect(() => {
    const savedLogo = localStorage.getItem('churchLogo');
    if (savedLogo) {
      setLogoUrl(savedLogo);
    }
  }, []);



  // Auto-match template based on input
  useEffect(() => {
    if (isAutoMatch) {
      const matched = matchTemplate(inputText);
      if (inputText.trim().length > 0) {
        setSelectedTemplateId(matched);
      }
    }
  }, [inputText, isAutoMatch]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Logo file size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLogoUrl(base64String);
        localStorage.setItem('churchLogo', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoUrl('');
    localStorage.removeItem('churchLogo');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (newText.length <= MAX_CHARS) {
      setInputText(newText);
    }
  };

  const handleDownload = async () => {
    const previewElement = document.getElementById('template-canvas');
    if (!previewElement) return;

    try {
      // Create a temporary container for full-size rendering
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'fixed';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '1080px';
      tempContainer.style.height = '1080px';
      tempContainer.style.zIndex = '-1';
      document.body.appendChild(tempContainer);

      // Clone the template content
      const clonedElement = previewElement.cloneNode(true) as HTMLElement;
      tempContainer.appendChild(clonedElement);

      // Wait for images to load in the cloned element
      const images = clonedElement.querySelectorAll('img');
      const imagePromises = Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
          setTimeout(resolve, 3000);
        });
      });
      
      await Promise.all(imagePromises);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Capture with better quality settings
      const canvas = await html2canvas(clonedElement, {
        width: 1080,
        height: 1080,
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 0,
        removeContainer: false,
        foreignObjectRendering: false, // Better color accuracy
      });
      
      // Clean up
      document.body.removeChild(tempContainer);
      
      // Download with maximum quality
      const link = document.createElement('a');
      link.download = `quote-design-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (err) {
      console.error("Download failed", err);
      alert('Export failed. Please try again.');
    }
  };

  const SelectedTemplateComponent = TEMPLATES.find(t => t.id === selectedTemplateId)?.component;

  return (
    <div className={cn(
      "min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100 flex flex-col overflow-x-hidden",
      isMobilePreview ? "h-screen-dynamic overflow-hidden" : ""
    )}>
      
      {/* Header - Hidden in mobile preview for immersion */}
      <header className={cn(
        "bg-white border-b border-slate-200 sticky top-0 z-50 transition-transform duration-300",
        isMobilePreview ? "lg:translate-y-0 -translate-y-full absolute lg:relative w-full" : "translate-y-0 relative"
      )}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 h-18 sm:h-24 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200 rotate-3">
              <Sparkles className="text-white w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-none mb-1">Daily Quote</h1>
              <p className="text-[10px] sm:text-xs text-indigo-600 font-extrabold uppercase tracking-[0.2em]">Church Edition</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
             <button 
              onClick={handleDownload}
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 sm:px-10 py-2.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 sm:gap-3 shadow-2xl shadow-slate-200 group"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-y-0.5" />
              <span className="hidden sm:inline">Export Design</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>
        </div>
      </header>

      <main className={cn(
        "flex-1 flex flex-col lg:grid lg:grid-cols-12 relative w-full h-full",
        isMobilePreview ? "" : "max-w-[1600px] mx-auto"
      )}>
        
        {/* Mobile View Toggle - Hidden in mobile preview for immersion */}
        <div className={cn(
          "lg:hidden flex border-b border-slate-100 bg-white sticky z-40 transition-transform duration-300",
          isMobilePreview ? "hidden" : "translate-y-0 relative"
        )}>
           <button 
             onClick={() => setIsMobilePreview(false)}
             className={cn(
               "flex-1 py-4 text-sm font-black uppercase tracking-widest transition-all border-b-2",
               !isMobilePreview ? "border-indigo-600 text-indigo-600 bg-indigo-50/30" : "border-transparent text-slate-400"
             )}
           >
             1. Content
           </button>
           <button 
             onClick={() => setIsMobilePreview(true)}
             className={cn(
               "flex-1 py-4 text-sm font-black uppercase tracking-widest transition-all border-b-2",
               isMobilePreview ? "border-indigo-600 text-indigo-600 bg-indigo-50/30" : "border-transparent text-slate-400"
             )}
           >
             2. Preview
           </button>
        </div>

        {/* Sidebar Controls */}
        <div className={cn(
          "lg:col-span-4 h-full flex flex-col border-r border-slate-100 bg-white",
          isMobilePreview ? "hidden lg:flex" : "flex"
        )}>
           <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8 space-y-8">
              {/* Tabs */}
              <div className="flex bg-slate-50 p-1.5 rounded-[24px] border border-slate-100 mb-8">
                <button 
                  onClick={() => setActiveTab('content')}
                  className={cn(
                    "flex-1 py-3 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3",
                    activeTab === 'content' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <Type className="w-4 h-4" />
                  Content
                </button>
                <button 
                  onClick={() => setActiveTab('branding')}
                  className={cn(
                    "flex-1 py-3 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3",
                    activeTab === 'branding' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <Settings2 className="w-4 h-4" />
                  Branding
                </button>
              </div>

              {activeTab === 'content' ? (
                <div className="space-y-8 animate-fade-in-up">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">
                        Message Text
                      </label>
                      <span className={cn(
                        "text-[10px] font-black tracking-widest uppercase px-2 py-1 rounded-md",
                        inputText.length > MAX_CHARS - 10 ? "bg-red-50 text-red-500" : "bg-slate-50 text-slate-400"
                      )}>
                        {inputText.length}/{MAX_CHARS}
                      </span>
                    </div>
                    <textarea
                      value={inputText}
                      onChange={handleTextChange}
                      placeholder="Type your message, scripture or quote..."
                      className="w-full h-48 p-6 bg-slate-50 border-2 border-slate-100 rounded-[32px] focus:ring-0 focus:border-indigo-500 transition-all resize-none text-xl font-bold placeholder:text-slate-300 leading-relaxed"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <label className="block text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">
                      Author / Reference
                    </label>
                    <div className="relative group">
                      <AtSign className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 transition-colors group-focus-within:text-indigo-400" />
                      <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="e.g. Psalm 23:1"
                        className="w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[24px] focus:ring-0 focus:border-indigo-500 transition-all font-bold text-lg"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8 animate-fade-in-up">
                  {/* Logo Upload Section */}
                  <div className="space-y-4">
                    <label className="block text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">
                      Church Logo
                    </label>
                    
                    {logoUrl ? (
                      <div className="relative group bg-slate-50 border-2 border-slate-100 rounded-[32px] p-8 flex flex-col items-center gap-6 overflow-hidden">
                        <div className="w-32 h-32 bg-white rounded-3xl shadow-2xl shadow-indigo-100 flex items-center justify-center p-4 transition-transform group-hover:scale-105">
                          <img src={logoUrl} alt="Church Logo" className="max-w-full max-h-full object-contain" />
                        </div>
                        <button
                          onClick={handleRemoveLogo}
                          className="flex items-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                        >
                          <X className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                          id="logo-upload"
                        />
                        <label
                          htmlFor="logo-upload"
                          className="flex flex-col items-center justify-center gap-4 p-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition-all group"
                        >
                          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Upload className="w-10 h-10 text-indigo-600" />
                          </div>
                          <div className="text-center">
                            <p className="font-black text-slate-700 uppercase tracking-widest text-sm mb-1">Upload Logo</p>
                            <p className="text-[10px] text-slate-400 font-extrabold tracking-tight">PNG, JPG UP TO 5MB</p>
                          </div>
                        </label>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <label className="block text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">
                      Church Name
                    </label>
                    <div className="relative group">
                      <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 transition-colors group-focus-within:text-indigo-400" />
                      <input
                        type="text"
                        value={churchName}
                        onChange={(e) => setChurchName(e.target.value)}
                        placeholder="Church Name"
                        className="w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[24px] focus:ring-0 focus:border-indigo-500 transition-all font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">
                      Handle / Website
                    </label>
                    <div className="relative group">
                      <AtSign className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 transition-colors group-focus-within:text-indigo-400" />
                      <input
                        type="text"
                        value={churchHandle}
                        onChange={(e) => setChurchHandle(e.target.value)}
                        placeholder="@handle"
                        className="w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[24px] focus:ring-0 focus:border-indigo-500 transition-all font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-8 border-t border-slate-100 space-y-6">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">
                    Choose Template
                  </label>
                  <label className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-full border border-slate-100 cursor-pointer hover:bg-indigo-50 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={isAutoMatch} 
                      onChange={(e) => setIsAutoMatch(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                    />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Auto Match</span>
                  </label>
                </div>
                
                <div className="grid grid-cols-2 gap-3 pb-8">
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setSelectedTemplateId(t.id);
                        setIsAutoMatch(false);
                        if (window.innerWidth < 1024) setIsMobilePreview(true);
                      }}
                      className={cn(
                        "flex flex-col gap-3 p-4 rounded-[28px] border-2 transition-all text-left group",
                        selectedTemplateId === t.id 
                          ? "border-indigo-600 bg-indigo-50/50" 
                          : "border-transparent bg-slate-50/50 hover:bg-slate-50 hover:border-slate-100"
                      )}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm",
                        selectedTemplateId === t.id ? "bg-indigo-600 text-white" : "bg-white text-slate-400 group-hover:text-indigo-600"
                      )}>
                         <Sparkles className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className={cn("font-black text-[11px] uppercase tracking-wider truncate", selectedTemplateId === t.id ? "text-indigo-950" : "text-slate-700")}>
                          {t.name}
                        </h4>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
           </div>
        </div>

        {/* Preview Area */}
        <div 
          ref={previewContainerRef}
          className={cn(
            "lg:col-span-8 flex flex-col items-center justify-center relative min-h-0",
            isMobilePreview 
              ? "fixed inset-0 w-full h-full z-[100] bg-black overflow-hidden" 
              : "hidden lg:flex lg:bg-slate-100"
          )}
        >
          {/* Mobile Back Button - Float at top left when immersive */}
          <button 
             onClick={() => {
               setIsMobilePreview(false);
               // Force a layout recalculation when coming back
               setTimeout(updateScale, 50);
             }}
             className={cn(
               "absolute top-6 left-6 z-[110] bg-black/40 backdrop-blur-xl text-white px-5 py-3 rounded-full border border-white/20 font-black text-xs uppercase tracking-widest transition-all lg:hidden hover:bg-white hover:text-slate-900 shadow-2xl",
               !isMobilePreview && "hidden"
             )}
          >
             ← Edit Quote
          </button>

          {/* Live Indicator - Hidden when filling screen for clean view */}
          <div className={cn(
            "absolute top-6 left-6 flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-sm z-20 transition-opacity",
            isMobilePreview ? "opacity-0" : "opacity-100"
          )}>
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.6)]" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Perfectly Scaled Preview</span>
          </div>

          <div 
             className="relative flex items-center justify-center overflow-visible shadow-[0_60px_120px_-30px_rgba(0,0,0,1)]"
             style={{ 
               width: 1080 * previewScale, 
               height: 1080 * previewScale 
             }}
          >
            <div 
              className={cn(
                "relative bg-white",
                isMobilePreview ? "rounded-none" : "rounded-lg"
              )}
              style={{ 
                width: '1080px', 
                height: '1080px',
                transform: `scale(${previewScale})`,
                transformOrigin: 'center center',
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-540px',
                marginLeft: '-540px'
              }}
            >
               <div id="template-canvas" className="bg-white pointer-events-none">
                 {SelectedTemplateComponent && (
                   <SelectedTemplateComponent data={{ 
                     text: inputText, 
                     author, 
                     churchName, 
                     churchHandle,
                     logoUrl 
                   }} />
                 )}
               </div>
            </div>
          </div>

          {/* Download Floating Button - Hidden in full immersive mode, available in header or sidebar */}
          <button
             onClick={handleDownload}
             className={cn(
               "absolute bottom-8 right-8 lg:hidden bg-indigo-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.4)] active:scale-90 transition-all z-20",
               isMobilePreview ? "opacity-0 pointer-events-none scale-0" : "opacity-100 scale-100"
             )}
          >
             <Download className="w-7 h-7" />
          </button>
        </div>

      </main>

      <footer className={cn(
        "py-8 text-center bg-white border-t border-slate-100",
        isMobilePreview ? "hidden" : "block"
      )}>
         <p className="text-slate-400 text-xs font-medium tracking-wide">
           © 2026 Daily Quote Generator. All rights reserved.
         </p>
      </footer>
    </div>
  )
}

export default App;
