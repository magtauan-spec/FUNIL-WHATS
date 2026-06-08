import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Loader2, ArrowLeft } from 'lucide-react';

interface LocalPdfViewerProps {
  url: string;
  title: string;
  pagesCount: number;
  onClose: () => void;
}

export function LocalPdfViewer({ url, title, pagesCount, onClose }: LocalPdfViewerProps) {
  const [pdf, setPdf] = useState<any>(null);
  const [numPages, setNumPages] = useState<number>(pagesCount || 1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [zoom, setZoom] = useState<number>(1.0); // scale multiplier
  const [rendering, setRendering] = useState<boolean>(false);
  const [renderError, setRenderError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<any>(null);
  const touchStartX = useRef<number>(0);

  // Load PDF when URL/instance changes
  useEffect(() => {
    if (!url) return;

    setLoading(true);
    setRenderError(null);
    setCurrentPage(1);
    setZoom(1.0);

    const pdfjsLib = (window as any).pdfjsLib;
    if (!pdfjsLib) {
      console.warn("PDF.js global library not found inside window, attempting to wait...");
      // Simple poll to retrieve if not matching yet
      const interval = setInterval(() => {
        if ((window as any).pdfjsLib) {
          clearInterval(interval);
          initializePdf();
        }
      }, 200);
      return () => clearInterval(interval);
    }

    initializePdf();

    function initializePdf() {
      const lib = (window as any).pdfjsLib;
      lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

      const loadingTask = lib.getDocument({
        url,
        withCredentials: true // allows auth cookies for local pathing
      });

      loadingTask.promise.then(
        (loadedPdf: any) => {
          setPdf(loadedPdf);
          setNumPages(loadedPdf.numPages);
          setLoading(false);
        },
        (error: any) => {
          console.error("LocalPdfViewer: Error decoding PDF document:", error);
          setRenderError("Não foi possível carregar o arquivo PDF. Abra em tela cheia.");
          setLoading(false);
        }
      );
    }

    return () => {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [url]);

  // Precise Canvas Render Function
  const renderPage = async (pageNum: number, currentZoom: number) => {
    if (!pdf || !canvasRef.current || !containerRef.current) return;

    try {
      setRendering(true);

      // Cancel any ongoing rendering task
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }

      const page = await pdf.getPage(pageNum);
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;

      // Match parent responsive bounding box minus horizontal safety bounds
      const parentWidth = containerRef.current.getBoundingClientRect().width || 375;
      const horizontalPadding = window.innerWidth < 640 ? 12 : 32;
      const containerWidth = Math.max(280, parentWidth - horizontalPadding);

      const unscaledViewport = page.getViewport({ scale: 1.0 });
      
      // Calculate fit scale: how much scale is needed to fit the exact width of our parent container
      const fitScale = containerWidth / unscaledViewport.width;
      
      // Apply our absolute zoom multiplier of the responsive fit width
      const viewport = page.getViewport({ scale: fitScale * currentZoom });

      // Support mobile High DPI displays gracefully (Retina Screen sharp rendering)
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = viewport.width * dpr;
      canvas.height = viewport.height * dpr;

      // Constrain sizing using standard style CSS so it fits without viewport breaking
      canvas.style.width = '100%';
      canvas.style.maxWidth = `${viewport.width}px`;
      canvas.style.height = 'auto';

      context.resetTransform();
      context.scale(dpr, dpr);

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };

      const renderTask = page.render(renderContext);
      renderTaskRef.current = renderTask;

      await renderTask.promise;
      setRendering(false);
    } catch (err: any) {
      if (err.name !== 'RenderingCancelledException') {
        console.error("PDF Render Exception caught:", err);
        setRendering(false);
      }
    }
  };

  // Render trigger on structural state events
  useEffect(() => {
    if (pdf) {
      renderPage(currentPage, zoom);
    }
  }, [pdf, currentPage, zoom]);

  // Responsive redraw on container resizing
  useEffect(() => {
    const handleResize = () => {
      if (pdf) {
        renderPage(currentPage, zoom);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [pdf, currentPage, zoom]);

  const handleNextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(2.5, prev + 0.15));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(0.7, prev - 0.15));
  };

  const handleResetZoom = () => {
    setZoom(1.0);
  };

  // Handle Touch Gestures for Page Swiping (extremely pleasant on smartphones)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX.current;
    
    // Minimum boundary drag swipe triggers
    if (Math.abs(diff) > 55) {
      if (diff < 0) {
        handleNextPage();
      } else {
        handlePrevPage();
      }
    }
  };

  return (
    <div id="pdf_rendering_viewport" className="flex-1 flex flex-col justify-between bg-[#0b141a] relative overflow-hidden min-h-0 w-full">
      
      {/* Zoom and Document Actions Ribbons */}
      <div className="bg-[#111b21] py-1.5 px-3 flex items-center justify-between border-b border-white/5 text-whatsapp-text-secondary select-none text-xs shrink-0">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={handleZoomOut}
            disabled={zoom <= 0.7}
            className="p-1 cursor-pointer disabled:opacity-40 hover:text-white transition-colors"
            title="Diminuir Zoom"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="font-mono text-[11px] min-w-[34px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            disabled={zoom >= 2.5}
            className="p-1 cursor-pointer disabled:opacity-40 hover:text-white transition-colors"
            title="Aumentar Zoom"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          {zoom !== 1.0 && (
            <button
              onClick={handleResetZoom}
              className="px-1.5 py-0.5 ml-1 rounded bg-[#202c33] text-[9px] hover:text-white hover:bg-[#2a3942] cursor-pointer"
            >
              Ajustar
            </button>
          )}
        </div>

        <div className="text-[11px] font-medium text-whatsapp-text-secondary">
          Arraste de lado para virar a página
        </div>
      </div>

      {/* Main Document Canvas Window */}
      <div 
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="flex-1 overflow-x-auto overflow-y-auto p-2 sm:p-4 flex items-start justify-center relative custom-scrollbar bg-[#0b141a]"
      >
        {loading && (
          <div className="absolute inset-0 bg-[#0b141a] flex flex-col items-center justify-center gap-2 z-20">
            <Loader2 className="w-8 h-8 text-[#00a884] animate-spin" />
            <p className="text-xs text-whatsapp-text-secondary">Decodificando PDF livro...</p>
          </div>
        )}

        {renderError && (
          <div className="absolute inset-0 bg-[#0b141a] flex flex-col items-center justify-center p-6 text-center z-20 gap-3">
            <span className="text-red-400 text-sm font-semibold">{renderError}</span>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="bg-[#00a884] text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-[#00bfa5] transition"
            >
              Baixar PDF Localmente ↙
            </a>
          </div>
        )}

        <div className="relative shadow-lg max-w-full">
          <canvas 
            ref={canvasRef} 
            className="bg-white rounded shadow-md transition-opacity duration-150"
            style={{ opacity: rendering && !canvasRef.current ? 0.3 : 1 }}
          />
          {rendering && (
            <div className="absolute top-2 right-2 bg-black/60 rounded px-1.5 py-0.5 text-[10px] text-white flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin text-[#00a884]" />
              Relaçando...
            </div>
          )}
        </div>
      </div>

      {/* Navigation and Bottom Paginations Footer */}
      <div className="bg-[#111b21] border-t border-white/5 py-3 px-4 shrink-0 flex items-center justify-between select-none">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1 || loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#202c33] disabled:opacity-30 hover:bg-[#2a3942] disabled:hover:bg-[#202c33] text-sm text-white font-bold transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>

        <span className="text-xs sm:text-sm text-whatsapp-text-secondary font-semibold">
          Página <span className="text-white font-bold">{currentPage}</span> de <span className="text-white">{numPages}</span>
        </span>

        <button
          onClick={handleNextPage}
          disabled={currentPage === numPages || loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00a884] disabled:opacity-30 hover:bg-[#00bfa5] disabled:hover:bg-[#00a884] text-sm text-white font-bold transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          <span>Avançar</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
