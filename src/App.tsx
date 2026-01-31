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
  const [isMobilePreview, setIsMobilePreview] = useState(true);
  
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100 flex flex-col">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Sparkles className="text-white w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900">Daily Quote Generator</h1>
              <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Church Edition</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
             <button 
              onClick={handleDownload}
              className="bg-slate-900 hover:bg-slate-800 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 sm:gap-3 shadow-xl shadow-slate-200"
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Export Designss</span>
              <span className="sm:hidden">Exportss</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
        
        {/* Mobile Toggle Button */}
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] bg-slate-900 rounded-full p-1 shadow-2xl border border-slate-700 flex items-center">
           <button 
             onClick={() => setIsMobilePreview(false)}
             className={cn(
               "px-6 py-3 rounded-full text-sm font-bold transition-all",
               !isMobilePreview ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
             )}
           >
             Edit
           </button>
           <button 
             onClick={() => setIsMobilePreview(true)}
             className={cn(
               "px-6 py-3 rounded-full text-sm font-bold transition-all",
               isMobilePreview ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
             )}
           >
             Preview
           </button>
        </div>

        {/* Sidebar Controls - Hidden on mobile if in Preview Mode */}
        <div className={cn(
          "lg:col-span-4 space-y-4 sm:space-y-6",
          isMobilePreview ? "hidden lg:block" : "block"
        )}>
          
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
            {/* Tabs */}
            <div className="flex border-b border-slate-100 p-1.5 sm:p-2">
              <button 
                onClick={() => setActiveTab('content')}
                className={cn(
                  "flex-1 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2",
                  activeTab === 'content' ? "bg-indigo-50 text-indigo-700" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <Type className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Content
              </button>
              <button 
                onClick={() => setActiveTab('branding')}
                className={cn(
                  "flex-1 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2",
                  activeTab === 'branding' ? "bg-indigo-50 text-indigo-700" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <Settings2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Branding
              </button>
            </div>

            <div className="p-4 sm:p-8 space-y-4 sm:space-y-6">
              {activeTab === 'content' ? (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                        Your Text
                      </label>
                      <span className={cn(
                        "text-xs font-bold",
                        inputText.length > MAX_CHARS - 20 ? "text-orange-500" : "text-slate-400"
                      )}>
                        {inputText.length}/{MAX_CHARS}
                      </span>
                    </div>
                    <textarea
                      value={inputText}
                      onChange={handleTextChange}
                      placeholder="Type your message, scripture or quote..."
                      className="w-full h-44 p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:ring-0 focus:border-indigo-500 transition-all resize-none text-lg font-medium placeholder:text-slate-300"
                    />
                    {inputText.length > MAX_CHARS - 20 && (
                      <p className="text-xs text-orange-500 mt-2 font-medium">
                        ⚠️ Approaching character limit
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                      Author / Reference
                    </label>
                    <div className="relative">
                      <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="e.g. Psalm 23:1"
                        className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-0 focus:border-indigo-500 transition-all font-medium"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Logo Upload Section */}
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                      Church Logo
                    </label>
                    
                    {logoUrl ? (
                      <div className="relative bg-slate-50 border-2 border-slate-100 rounded-2xl p-6 flex flex-col items-center gap-4">
                        <div className="w-32 h-32 bg-white rounded-xl shadow-sm flex items-center justify-center overflow-hidden">
                          <img src={logoUrl} alt="Church Logo" className="max-w-full max-h-full object-contain" />
                        </div>
                        <button
                          onClick={handleRemoveLogo}
                          className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-sm transition-all"
                        >
                          <X className="w-4 h-4" />
                          Remove Logo
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
                          className="flex flex-col items-center justify-center gap-3 p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100 hover:border-indigo-300 transition-all"
                        >
                          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center">
                            <Upload className="w-8 h-8 text-indigo-600" />
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-slate-700 mb-1">Upload Church Logo</p>
                            <p className="text-xs text-slate-400">PNG, JPG up to 5MB</p>
                          </div>
                        </label>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                      Church Name
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input
                        type="text"
                        value={churchName}
                        onChange={(e) => setChurchName(e.target.value)}
                        placeholder="e.g. Grace Fellowship"
                        className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-0 focus:border-indigo-500 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                      Handle / Website
                    </label>
                    <div className="relative">
                      <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input
                        type="text"
                        value={churchHandle}
                        onChange={(e) => setChurchHandle(e.target.value)}
                        placeholder="e.g. @gracechurch"
                        className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-0 focus:border-indigo-500 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <p className="text-xs text-indigo-700 font-medium leading-relaxed">
                      💡 Logo and branding settings are applied automatically to every design template.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                Choose Style
              </label>
              <div className="flex items-center gap-2">
                 <label className="text-xs font-bold text-slate-500 cursor-pointer flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                   <input 
                     type="checkbox" 
                     checked={isAutoMatch} 
                     onChange={(e) => setIsAutoMatch(e.target.checked)}
                     className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                   />
                   Smart Match
                 </label>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedTemplateId(t.id);
                    setIsAutoMatch(false);
                  }}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-[20px] border-2 transition-all text-left group",
                    selectedTemplateId === t.id 
                      ? "border-indigo-600 bg-indigo-50/50" 
                      : "border-transparent bg-slate-50/50 hover:bg-slate-50 hover:border-slate-100"
                  )}
                >
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all shadow-sm",
                    selectedTemplateId === t.id ? "bg-indigo-600 text-white" : "bg-white text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                  )}>
                     <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className={cn("font-bold text-sm", selectedTemplateId === t.id ? "text-indigo-900" : "text-slate-700")}>
                      {t.name}
                    </h4>
                    <p className="text-xs text-slate-400 font-medium line-clamp-1">{t.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Area - Shows LAST on mobile, FIRST on desktop */}
        <div className={cn(
          "lg:col-span-8 order-first lg:order-last",
          !isMobilePreview ? "hidden lg:block" : "block"
        )}>
           <div className="w-full flex flex-col items-center justify-center relative overflow-hidden fixed inset-0 z-[60] h-[100dvh] rounded-none border-0 p-0 bg-slate-100 lg:bg-white lg:relative lg:h-auto lg:min-h-[800px] lg:rounded-[40px] lg:border-4 lg:border-slate-100 lg:shadow-2xl lg:z-0 lg:p-0">
              <div className="absolute top-12 sm:top-2 md:top-4 lg:top-8 left-4 sm:left-2 md:left-4 lg:left-8 flex items-center gap-0.5 sm:gap-1 md:gap-2 px-1.5 sm:px-2 md:px-3 lg:px-4 py-0.5 sm:py-1 md:py-1.5 lg:py-2 bg-slate-50 rounded-full border border-slate-100 z-10">
                 <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 md:w-1.5 md:h-1.5 lg:w-2 lg:h-2 bg-green-500 rounded-full animate-pulse" />
                 <span className="text-[6px] xs:text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-slate-400">Live Preview</span>
              </div>

              <div className="transform scale-[0.28] xs:scale-[0.34] sm:scale-[0.45] md:scale-[0.55] lg:scale-[0.42] xl:scale-[0.55] origin-center shadow-2xl rounded-lg overflow-hidden">
                 <div id="template-canvas" className="bg-white">
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

              <button
                 onClick={handleDownload}
                 className="absolute bottom-8 sm:bottom-2 md:bottom-4 lg:bottom-10 right-4 sm:right-2 md:right-4 lg:right-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 py-1 xs:py-1.5 sm:py-2 md:py-3 lg:py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-0.5 sm:gap-1 md:gap-2 text-[9px] xs:text-[10px] sm:text-xs md:text-sm lg:text-base z-10"
              >
                 <Download className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5" />
                 <span>Export</span>
              </button>
           </div>
        </div>

      </main>

      <footer className="py-8 text-center">
         <p className="text-slate-400 text-xs font-medium tracking-wide">
           © 2026 Daily Quote Generator. All rights reserved.
         </p>
      </footer>
    </div>
  )
}

export default App;
