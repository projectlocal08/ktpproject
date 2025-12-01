import React, { useState, useRef } from 'react';
import KTPForm from './components/KTPForm';
import KTPPreview from './components/KTPPreview';
import { initialKTPData, KTPData, CardTransform } from './types';
import { Info, Download, Printer, Loader2, ChevronDown, ImagePlus } from 'lucide-react';
import html2canvas from 'html2canvas';

const App: React.FC = () => {
  const [data, setData] = useState<KTPData>(initialKTPData);
  const cardRef = useRef<HTMLDivElement>(null);
  const compositeRef = useRef<HTMLDivElement>(null);
  
  // Composition State
  const [holderImage, setHolderImage] = useState<string | null>(null);
  const [cardTransform, setCardTransform] = useState<CardTransform>({ 
    x: 50, 
    y: 50, 
    scale: 0.5, 
    rotate: -5 
  });

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);

  const handleDataChange = (field: keyof KTPData, value: string) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTransformChange = (key: keyof CardTransform, val: number) => {
    setCardTransform(prev => ({ ...prev, [key]: val }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async (format: 'png' | 'jpg') => {
    // Determine which element to capture: the card only, or the composite container
    const targetRef = holderImage ? compositeRef : cardRef;
    
    if (!targetRef.current || isDownloading) return;

    setIsDownloading(true);
    setDownloadMenuOpen(false);
    try {
      // Small delay to ensure render updates
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(targetRef.current, {
        scale: holderImage ? 2 : 1, // Increase scale for composite to ensure quality
        useCORS: true, 
        backgroundColor: null,
        logging: false,
        imageTimeout: 0,
      });

      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const image = canvas.toDataURL(mimeType, format === 'jpg' ? 0.9 : 1.0);
      const link = document.createElement('a');
      link.href = image;
      const safeName = (data.nama || 'Card').replace(/[^a-z0-9]/gi, '_').toUpperCase();
      link.download = `E-KTP_${safeName}_${holderImage ? 'COMPOSITE' : 'CARD'}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans print:bg-white">
      
      {/* Navbar - Hidden on print */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50 print:hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
              <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">KTP Studio</h1>
          </div>
          <div className="flex items-center gap-3">
             <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
            >
              <Printer size={16} />
              <span className="hidden sm:inline">Print</span>
            </button>
             
             <div className="relative">
                <button 
                  onClick={() => setDownloadMenuOpen(!downloadMenuOpen)}
                  disabled={isDownloading}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:bg-cyan-400 transition-colors text-sm font-medium shadow-md shadow-cyan-200"
                >
                  {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                  <span className="hidden sm:inline">{isDownloading ? 'Processing...' : 'Download'}</span>
                  <ChevronDown size={14} className="ml-1" />
                </button>
                
                {downloadMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <button 
                      onClick={() => handleDownload('png')}
                      className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-cyan-600 font-medium border-b border-slate-50"
                    >
                      Download as PNG
                    </button>
                    <button 
                      onClick={() => handleDownload('jpg')}
                      className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-cyan-600 font-medium"
                    >
                      Download as JPG
                    </button>
                  </div>
                )}
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 lg:p-8 print:p-0 print:w-auto print:max-w-none">
        
        {/* CSS for printing to hide non-preview elements */}
        <style>{`
          @media print {
            body { background: white; }
            header, footer, .form-container, .preview-bg, .info-box { display: none !important; }
            .print-container { 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              height: 100vh; 
              margin: 0; 
              padding: 0;
            }
            .preview-card {
              box-shadow: none !important;
              border: 1px solid #ccc;
              transform: scale(1) !important;
            }
          }
        `}</style>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:block">
          
          {/* Left Column: Editor Form - Hidden on print */}
          <div className="lg:col-span-5 xl:col-span-4 order-2 lg:order-1 form-container">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                 <h2 className="text-lg font-bold text-slate-800">Card Data & Setup</h2>
                 <span className="text-xs text-slate-500">Customize card</span>
              </div>
              <KTPForm 
                data={data} 
                onChange={handleDataChange} 
                holderImage={holderImage}
                onHolderImageChange={setHolderImage}
                cardTransform={cardTransform}
                onTransformChange={handleTransformChange}
              />
            </div>
          </div>

          {/* Right Column: Live Preview */}
          <div className="lg:col-span-7 xl:col-span-8 order-1 lg:order-2 print:w-full">
            <div className="sticky top-28 space-y-6 print:static print:space-y-0">
              
              <div className="bg-slate-100 p-4 md:p-8 rounded-2xl border border-slate-200 shadow-inner flex flex-col items-center justify-center min-h-[400px] lg:min-h-[600px] relative overflow-hidden preview-bg print:bg-white print:border-none print:shadow-none print:p-0 print:min-h-0">
                <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none print:hidden" />
                
                <div className="relative z-10 w-full flex flex-col items-center print-container">
                   
                   {!holderImage && (
                     <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-8 print:hidden">Live Preview Output</h2>
                   )}
                   
                   {/* Conditional Rendering: Single Card vs Composite View */}
                   {holderImage ? (
                     <div 
                       ref={compositeRef}
                       className="relative w-full max-w-2xl shadow-2xl rounded-lg overflow-hidden bg-slate-900 ring-4 ring-slate-900/10"
                     >
                        {/* The Holder Image (Background) */}
                        <img 
                          src={holderImage} 
                          alt="Holder" 
                          className="w-full h-auto block select-none" 
                        />
                        
                        {/* The KTP Card Overlay - Transformed */}
                        <div 
                          style={{
                            position: 'absolute',
                            left: `${cardTransform.x}%`,
                            top: `${cardTransform.y}%`,
                            transform: `translate(-50%, -50%) scale(${cardTransform.scale}) rotate(${cardTransform.rotate}deg)`,
                            width: '600px', // Original KTP Width
                            height: '378px', // Original KTP Height
                            transformOrigin: 'center center',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.4)' // Add realistic drop shadow
                          }}
                        >
                          <KTPPreview data={data} />
                          {/* Shine/Glare Effect Overlay for realism */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-30 pointer-events-none rounded-[10px]" />
                        </div>
                     </div>
                   ) : (
                     <div className="shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] rounded-[12px] overflow-hidden preview-card print:rounded-none">
                        <KTPPreview ref={cardRef} data={data} />
                     </div>
                   )}

                </div>

                <div className="mt-10 flex items-start gap-3 max-w-lg bg-white/60 backdrop-blur-sm p-4 rounded-xl text-slate-600 border border-white shadow-sm info-box print:hidden">
                  <Info className="flex-shrink-0 mt-0.5 text-cyan-600" size={18} />
                  <p className="text-xs leading-relaxed">
                    <strong>{holderImage ? 'Composite Mode Active' : 'Card Only Mode'}:</strong> 
                    {holderImage 
                      ? ' You can now position the ID card onto the uploaded photo. Use the sliders in the "Composition" tab to adjust position, size, and rotation.' 
                      : ' Text shadows and font smoothing are applied to mimic printed ink artifacts for realism in the exported PNG/JPG.'}
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer - Hidden on print */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-400 text-sm font-medium">&copy; {new Date().getFullYear()} KTP Studio</p>
          <p className="text-slate-300 text-xs mt-2">Designed for educational, testing, and interface simulation purposes.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;