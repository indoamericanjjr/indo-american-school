import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback, memo } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Link } from "react-router-dom";

// Backend base URL from environment
const BACKEND_BASE_URL = '';

interface GalleryImage {
  id: number;
  title: string;
  category: string | null;
  image_url: string;
}

const GallerySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
        try {
          const response = await fetch(`${BACKEND_BASE_URL}/api/gallery`);
          if (response.ok) {
            const data = await response.json();
            setGalleryImages(data);
          } else {
            console.error('Failed to fetch gallery images, status:', response.status);
          }
      } catch (error) {
        console.error('Error fetching gallery images:', error);
      }
      setLoading(false);
    };
    fetchImages();
  }, []);

  const openLightbox = useCallback((index: number) => setLightbox(index), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const nextImage = useCallback(() => setLightbox((prev) => prev !== null ? (prev + 1) % galleryImages.length : null), [galleryImages.length]);
  const prevImage = useCallback(() => setLightbox((prev) => prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : null), [galleryImages.length]);

  // Touch gesture handlers for lightbox
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (lightbox !== null) {
      if (isLeftSwipe) {
        nextImage();
      } else if (isRightSwipe) {
        prevImage();
      }
    }
  };

  return (
    <>
      <section ref={ref} className="section-padding bg-muted/30">
        <div className="container-custom">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 md:mb-16"
          >
            <span className="text-secondary font-semibold text-xs sm:text-sm uppercase tracking-wider bg-secondary/10 px-3 py-1 rounded-full">Photo Gallery</span>
            <h2 className="section-title mt-4 text-3xl sm:text-4xl md:text-5xl">Capturing Moments of <span className="text-gradient block sm:inline mt-1 sm:mt-0">Excellence</span></h2>
            <p className="section-subtitle mx-auto text-sm sm:text-base px-4">
              Dive into the vibrant moments of our latest events, capturing the essence
              of our school's dynamic spirit and unforgettable achievements.
            </p>
          </motion.div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className={`relative group cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl ${index === 0 ? "col-span-2 row-span-2" : ""}`}>
                  <div className={`${index === 0 ? "aspect-square md:aspect-auto md:h-full" : "aspect-square sm:aspect-[4/3]"} bg-muted animate-pulse`} />
                </div>
              ))
            ) : (
              galleryImages.slice(0, 5).map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`relative group cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-shadow ${
                  index === 0 ? "col-span-2 row-span-2" : ""
                }`}
                onClick={() => openLightbox(index)}
              >
                <div className={`${index === 0 ? "aspect-square md:aspect-auto md:h-full" : "aspect-square sm:aspect-[4/3]"} overflow-hidden bg-slate-100 dark:bg-slate-800`}>
                  <img
                    src={`${BACKEND_BASE_URL}${image.image_url}?width=${index === 0 ? '800' : '400'}&quality=80&format=webp`}
                    srcSet={`${BACKEND_BASE_URL}${image.image_url}?width=400&quality=80&format=webp 400w, ${BACKEND_BASE_URL}${image.image_url}?width=800&quality=80&format=webp 800w, ${BACKEND_BASE_URL}${image.image_url}?width=1200&quality=80&format=webp 1200w`}
                    sizes={index === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"}
                    alt={image.title || `School gallery photo showing ${image.category || 'event'}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[10px] sm:text-xs text-secondary font-bold mb-0.5 sm:mb-1 uppercase tracking-wider">{image.category}</span>
                  <h3 className="text-white font-semibold text-sm sm:text-base leading-tight drop-shadow-md">{image.title}</h3>
                </div>
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-white/20">
                  <ZoomIn className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </motion.div>
            ))
          )}
          </div>

          {/* View More */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-10 md:mt-12"
          >
            <Link 
              to="/gallery" 
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground w-full sm:w-auto px-8 py-4 sm:py-3 rounded-full font-semibold hover:bg-primary/90 transition-all shadow-md group"
            >
              View Full Gallery
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[100] flex items-center justify-center p-0 sm:p-4"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Controls Overlay - Positioned for easier mobile reach */}
          <div className="absolute inset-x-0 top-0 p-4 flex justify-end z-10 bg-gradient-to-b from-black/60 to-transparent">
            <button 
              onClick={closeLightbox}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors border border-white/10"
              aria-label="Close"
            >
              <X size={20} className="sm:w-6 sm:h-6" />
            </button>
          </div>
          
          <button 
            onClick={prevImage}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 hidden sm:flex w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full items-center justify-center text-white transition-colors border border-white/10 z-10"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={nextImage}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 hidden sm:flex w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full items-center justify-center text-white transition-colors border border-white/10 z-10"
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>

          <motion.div
            key={lightbox}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-5xl h-full sm:h-auto max-h-screen sm:max-h-[85vh] flex flex-col justify-center relative"
          >
            <div className="relative w-full h-full sm:h-auto flex items-center justify-center">
              <img
                src={`${BACKEND_BASE_URL}${galleryImages[lightbox].image_url}?width=1200&quality=80&format=webp`}
                srcSet={`${BACKEND_BASE_URL}${galleryImages[lightbox].image_url}?width=800&quality=80&format=webp 800w, ${BACKEND_BASE_URL}${galleryImages[lightbox].image_url}?width=1200&quality=80&format=webp 1200w, ${BACKEND_BASE_URL}${galleryImages[lightbox].image_url}?width=1600&quality=80&format=webp 1600w`}
                sizes="100vw"
                alt={galleryImages[lightbox].title}
                loading="lazy"
                className="max-w-full max-h-screen sm:max-h-[75vh] object-contain sm:rounded-lg"
              />
            </div>
            
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6 text-center text-white sm:relative sm:bg-none sm:p-4">
              <h3 className="text-lg sm:text-xl font-bold drop-shadow-lg">{galleryImages[lightbox].title}</h3>
              <p className="text-xs sm:text-sm text-secondary font-semibold mt-1 uppercase tracking-wider">{galleryImages[lightbox].category}</p>
              <div className="sm:hidden flex justify-center mt-4 gap-8">
                <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="p-2 text-white/70 hover:text-white"><ChevronLeft size={28} /></button>
                <div className="text-xs text-white/50 flex items-center">{lightbox + 1} / {galleryImages.length}</div>
                <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="p-2 text-white/70 hover:text-white"><ChevronRight size={28} /></button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default memo(GallerySection);


