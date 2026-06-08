import React, { useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Loader2 } from 'lucide-react';

interface LocalPdfViewerProps {
  url: string;
  title: string;
  pagesCount: number;
  onClose: () => void;
}

export function LocalPdfViewer({ url, title, pagesCount, onClose }: LocalPdfViewerProps) {
  const [pdf, setPdf] = useState<any>(null);
  const [numPages, setNumPages] = useState<number>(pagesCount || 1);
  const [loading, setLoading] = useState<boolean>(true);
  const [zoom, setZoom] = useState<number>(1.0); // scale multiplier
  const [aspectRatio, setAspectRatio] = useState<number>(1.414); // A4 page standard aspect ratio (h/w)
  const [containerWidth, setContainerWidth] = useState<number>(340);
  const [renderError, setRenderError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Load PDF when URL/instance changes
  useEffect(() => {
    if (!url) return;

    setLoading(true);
    setRenderError(null);
    setZoom(1.0);

    const pdfjsLib = (window as any).pdfjsLib;
    if (!pdfjsLib) {
      console.warn("PDF.js global library not found inside window, attempting to wait...");
      const interval = setInterval(() => {
        if ((window as any).pdfjsLib) {
          clearInterval(interval);
          initializePdf();
        }
      }, 150);
      return () => clearInterval(interval);
    }

    initializePdf();

    function initializePdf() {
      const lib = (window as any).pdfjsLib;
      lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

      const loadingTask = lib.getDocument({
        url,
        withCredentials: true // allows auth cookies if needed
      });

      loadingTask.promise.then(
        async (loadedPdf: any) => {
          setPdf(loadedPdf);
          setNumPages(loadedPdf.numPages);
          
          try {
            // Get aspect ratio from first page dynamically
            const firstPage = await loadedPdf.getPage(1);
            const view = firstPage.getViewport({ scale: 1.0 });
            if (view.width && view.height) {
              setAspectRatio(view.height / view.width);
            }
          } catch (err) {
            console.error("Error reading PDF page aspect ratio:", err);
          }
          
          setLoading(false);
        },
        (error: any) => {
          console.error("LocalPdfViewer: Error decoding PDF document:", error);
          setRenderError("Não foi possível carregar o arquivo PDF. Clique abaixo para ler ou baixar.");
          setLoading(false);
        }
      );
    }
  }, [url]);

  // Track the container's available width using a ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Reserve lateral spacing for standard margins on sm/lg viewports
      const padding = window.innerWidth < 640 ? 16 : 48;
      const width = Math.max(260, rect.width - padding);
      setContainerWidth(width);
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', updateWidth);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(2.5, prev + 0.15));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(0.7, prev - 0.15));
  };

  const handleResetZoom = () => {
    setZoom(1.0);
  };

  const pagesArray = Array.from({ length: numPages }, (_, i) => i + 1);

  return (
    <div id="pdf_rendering_viewport" className="flex-1 flex flex-col bg-[#0b141a] relative overflow-hidden min-h-0 w-full">
      
      {/* Zoom and Document Actions Ribbons */}
      <div className="bg-[#111b21] py-2 px-4 flex items-center justify-between border-b border-white/5 text-whatsapp-text-secondary select-none text-xs shrink-0 z-10 shadow-md">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={handleZoomOut}
            disabled={zoom <= 0.7}
            className="p-1 cursor-pointer disabled:opacity-40 hover:text-white transition-colors"
            title="Diminuir Zoom"
          >
            <ZoomOut className="w-4.5 h-4.5" />
          </button>
          <span className="font-mono text-[13px] min-w-[36px] text-center text-white font-medium">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            disabled={zoom >= 2.5}
            className="p-1 cursor-pointer disabled:opacity-40 hover:text-white transition-colors"
            title="Aumentar Zoom"
          >
            <ZoomIn className="w-4.5 h-4.5" />
          </button>
          {zoom !== 1.0 && (
            <button
              onClick={handleResetZoom}
              className="px-2 py-0.5 ml-1.5 rounded bg-[#202c33] text-[9.5px] text-whatsapp-green font-bold hover:text-white hover:bg-[#2a3942] cursor-pointer"
            >
              Recalibrar
            </button>
          )}
        </div>

        <div className="text-[11px] font-semibold text-whatsapp-text-secondary bg-[#202c33] px-2.5 py-1 rounded-md">
          Rolar para baixo • <span className="text-white font-bold">{numPages}</span> págs
        </div>
      </div>

      {/* Main Document Canvas Scrollable Window */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-x-auto overflow-y-auto px-2 sm:px-4 py-2 relative custom-scrollbar bg-[#0b141a] scroll-smooth"
      >
        {loading && (
          <div className="absolute inset-0 bg-[#0b141a] flex flex-col items-center justify-center gap-2.5 z-20">
            <Loader2 className="w-9 h-9 text-[#00a884] animate-spin" />
            <p className="text-xs text-whatsapp-text-secondary">Decodificando livro digital...</p>
          </div>
        )}

        {renderError && (
          <div className="absolute inset-0 bg-[#0b141a] flex flex-col items-center justify-center p-6 text-center z-20 gap-3">
            <span className="text-red-400 text-sm font-semibold">{renderError}</span>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="bg-[#00a884] text-white font-bold text-xs px-5 py-2.5 rounded-lg hover:bg-[#00bfa5] transition shadow-md"
            >
              Baixar e Abrir Manualmente ↙
            </a>
          </div>
        )}

        {/* Scrollable multi-page document container */}
        <div id="pdf-scrollable-pages" className="flex flex-col gap-4 py-2">
          {!loading && !renderError && pdf && pagesArray.map((pageNum) => (
            <PdfPage
              key={pageNum}
              pdf={pdf}
              pageNum={pageNum}
              zoom={zoom}
              containerWidth={containerWidth}
              aspectRatio={aspectRatio}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface PdfPageProps {
  pdf: any;
  pageNum: number;
  zoom: number;
  containerWidth: number;
  aspectRatio: number;
}

const PdfPage: React.FC<PdfPageProps> = ({ pdf, pageNum, zoom, containerWidth, aspectRatio }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [rendering, setRendering] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const renderTaskRef = useRef<any>(null);

  // IntersectionObserver to render/unrender pages dynamically (extremely efficient memory usage on smartphones)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      {
        root: null, // viewport/container
        rootMargin: '500px 0px 500px 0px', // start rendering pages 500px before viewport
        threshold: 0.05,
      }
    );

    if (pageRef.current) {
      observer.observe(pageRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // PDF Page Renderer
  useEffect(() => {
    if (!isVisible || !pdf) {
      // Cancel pending rendering when pages walk out of view/scope
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }
      return;
    }

    let isMounted = true;

    async function renderCanvas() {
      if (!canvasRef.current) return;

      try {
        setRendering(true);

        const page = await pdf.getPage(pageNum);
        if (!isMounted || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        const unscaledViewport = page.getViewport({ scale: 1.0 });
        const fitScale = containerWidth / unscaledViewport.width;
        const viewport = page.getViewport({ scale: fitScale * zoom });

        // Use standard devicePixelRatio capped at 2x for visual sharpness and memory safety
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        canvas.width = viewport.width * dpr;
        canvas.height = viewport.height * dpr;

        canvas.style.width = '100%';
        canvas.style.maxWidth = `${viewport.width}px`;
        canvas.style.height = 'auto';

        context.resetTransform();
        context.scale(dpr, dpr);

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;

        await renderTask.promise;
        if (isMounted) {
          setRendering(false);
        }
      } catch (err: any) {
        if (err.name !== 'RenderingCancelledException') {
          console.error(`Page ${pageNum} render task exception:`, err);
        }
        if (isMounted) {
          setRendering(false);
        }
      }
    }

    renderCanvas();

    return () => {
      isMounted = false;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }
    };
  }, [isVisible, pdf, pageNum, zoom, containerWidth]);

  const heightValue = containerWidth * aspectRatio;

  return (
    <div 
      ref={pageRef}
      style={{ 
        width: '100%', 
        maxWidth: `${containerWidth * zoom}px`, 
        minHeight: isVisible ? 'auto' : `${heightValue * zoom}px` 
      }}
      className="relative bg-[#111b21]/45 rounded-lg shadow-xl mx-auto flex items-center justify-center border border-white/5 overflow-hidden transition-all duration-300"
    >
      {!isVisible ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-[11px] text-[#8696a0]/60 gap-1 select-none">
          <Loader2 className="w-4 h-4 animate-spin text-[#8696a0]/30" />
          <span>Sincronizando página {pageNum}...</span>
        </div>
      ) : (
        <canvas 
          ref={canvasRef} 
          className="bg-white rounded-lg shadow-md transition-opacity duration-200 block"
          style={{ opacity: rendering ? 0.8 : 1 }}
        />
      )}

      {rendering && isVisible && (
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur rounded px-2 py-0.5 text-[9px] text-[#00a884] flex items-center gap-1 shadow select-none">
          <Loader2 className="w-2.5 h-2.5 animate-spin" />
          <span>Processando...</span>
        </div>
      )}
      
      {/* Tiny subtle page number watermark inside PDF pages list for user comfort */}
      <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/40 text-[9px] font-mono text-white/50 select-none">
        pág. {pageNum}
      </span>
    </div>
  );
}
