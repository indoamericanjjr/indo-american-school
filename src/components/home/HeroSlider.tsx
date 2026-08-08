import { useState, useEffect, useCallback, memo, useMemo } from "react";
import useIsMobile from "@/hooks/use-is-mobile";
import { useSiteImages } from "@/hooks/use-site-images";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause, Sparkles, ArrowRight, Phone, Instagram, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import hero1 from "@/assets/hero-1.jpg";
import heroNew from "@/assets/hero-new.jpg";
import worldEducation from "@/assets/world-education.jpg";
import sports from "@/assets/sports.jpg";
import library from "@/assets/library.jpg";

const slideData = [
  {
    id: 1,
    fallbackImage: heroNew,
    slotKey: 'hero_slide_1',
    title: "Welcome to Indo American School",
    subtitle: "Excellence in Education",
    description: "Empowering young minds with knowledge, values, and skills for a brighter tomorrow. Join our family of achievers and leaders.",
    accent: "23+ Years of Trust",
    altDescription: "Students gathering in front of the modern Indo American School building",
  },
  {
    id: 2,
    fallbackImage: worldEducation,
    slotKey: 'hero_slide_2',
    title: "World-Class Education",
    subtitle: "Learn from the Best",
    description: "Our dedicated faculty brings years of experience and passion to every classroom, ensuring personalized attention for each student.",
    accent: "200+ Expert Teachers",
    altDescription: "Dedicated teachers instructing students in a well-lit classroom environment",
  },
  {
    id: 3,
    fallbackImage: sports,
    slotKey: 'hero_slide_3',
    title: "Sports & Athletics",
    subtitle: "Building Champions",
    description: "State-of-the-art sports facilities and professional coaching to nurture athletic talents and promote healthy competition.",
    accent: "50+ Sports Awards",
    altDescription: "Students participating in track and field athletics in the school sports ground",
  },
  {
    id: 4,
    fallbackImage: library,
    slotKey: 'hero_slide_4',
    title: "Modern Infrastructure",
    subtitle: "Innovation & Discovery",
    description: "Well-equipped laboratories for Physics, Chemistry, Biology, and Computer Science to foster scientific temperament.",
    accent: "Smart Classrooms",
    altDescription: "Fully equipped modern science laboratories for student experiments",
  },
  {
    id: 5,
    fallbackImage: hero1,
    slotKey: 'hero_slide_5',
    title: "Cultural Excellence",
    subtitle: "Celebrating Diversity",
    description: "Rich cultural programs and activities that celebrate our heritage while embracing global perspectives.",
    accent: "100+ Events/Year",
    altDescription: "Students performing cultural dances in colorful traditional attire",
  },
  {
    id: 6,
    fallbackImage: library,
    slotKey: 'hero_slide_6',
    title: "Library & Resources",
    subtitle: "Knowledge Hub",
    description: "Extensive library with thousands of books, digital resources, and quiet study spaces for academic excellence.",
    accent: "10,000+ Books",
    altDescription: "Extensive school library filled with books and students studying quietly",
  },
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [apiSlides, setApiSlides] = useState<{id: number; title: string; subtitle: string; description: string; accent: string; image_url: string}[] | null>(null);
  const isMobile = useIsMobile();
  const { getImage } = useSiteImages();

  // Fetch hero slides from API
  useEffect(() => {
    fetch('/api/hero-slides')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setApiSlides(data);
        }
      })
      .catch(() => {});
  }, []);

  // Use API slides if available, otherwise fall back to static slideData
  const slides = useMemo(() => {
    if (apiSlides && apiSlides.length > 0) {
      return apiSlides.map(slide => ({
        id: slide.id,
        image: slide.image_url,
        title: slide.title,
        subtitle: slide.subtitle || '',
        description: slide.description || '',
        accent: slide.accent || '',
        altDescription: slide.title,
      }));
    }
    return slideData.map(slide => ({
      ...slide,
      image: getImage(slide.slotKey, slide.fallbackImage),
    }));
  }, [apiSlides, getImage]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (diff > 50) {
      prevSlide();
    } else if (diff < -50) {
      nextSlide();
    }
    setTouchStartX(null);
  };

  // Parallax setup
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 1000], [0, 250]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const getMobileBackgroundPosition = () => {
    switch(currentSlide) {
      case 0: return 'center 20%'; // heroNew
      case 1: return '75% 25%'; // worldEducation
      case 2: return 'center 30%'; // sports
      case 3: return 'center 40%'; // library
      case 4: return 'center 20%'; // hero1
      case 5: return 'center 40%'; // library
      default: return 'center 20%';
    }
  };

  return (
    <section
      className={`relative overflow-hidden ${isMobile ? 'h-[65svh] min-h-[360px] max-h-[520px]' : 'h-[100svh] min-h-[600px] max-h-[900px]'}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1, filter: "blur(2px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.98, filter: "blur(1px)" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="absolute inset-0"
          style={{ willChange: 'transform, opacity, filter' }}
        >
          <motion.div
            role="img"
            aria-label={slides[currentSlide].altDescription}
            className="absolute inset-0 bg-cover md:bg-center"
            style={{
              backgroundImage: `url(${slides[currentSlide].image})`,
              backgroundPosition: isMobile ? getMobileBackgroundPosition() : 'center',
              y: yParallax,
              scale: 1.1 // Slightly scale up to prevent edges showing during parallax
            }}
          />
          {!isMobile && (
            <>
              {/* Wider banner blue wash with smooth merge toward the right */}
              <div className="absolute inset-y-0 left-0 w-4/5 bg-gradient-to-r from-school-blue/70 via-school-blue/45 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-40 md:h-48 bg-gradient-to-t from-school-blue/70 via-school-blue/25 to-transparent" />
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Animated Pattern Overlay */}
      <div className="absolute inset-0 opacity-10 pattern-dots" />

      {/* Floating Decorative Elements (hide on small screens) */}
      {!isMobile && (
        <>
          <motion.div
            className="absolute top-20 right-20 w-72 h-72 bg-secondary/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 8, repeat: Infinity }}
            style={{ willChange: 'transform, opacity' }}
          />
          <motion.div
            className="absolute bottom-40 left-10 w-48 h-48 bg-school-blue-light/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 6, repeat: Infinity, delay: 2 }}
            style={{ willChange: 'transform, opacity' }}
          />
        </>
      )}

      {/* Main Content */}
      <div className={`relative h-full container-custom flex ${isMobile ? 'items-end justify-center pb-24' : 'items-center'} md:items-center`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`max-w-3xl w-full ${isMobile ? 'text-center flex flex-col items-center px-4 max-w-md mx-auto' : 'text-left'}`}
          >
            {/* Accent Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className={`inline-flex items-center gap-1.5 md:gap-2 bg-secondary/90 backdrop-blur-sm rounded-full text-secondary-foreground font-bold shadow-glow ${isMobile ? 'px-4 py-1.5 text-[11px] mb-4 border border-white/20' : 'px-5 py-2.5 text-sm mb-8'}`}
            >
              <Sparkles size={isMobile ? 12 : 16} className="animate-pulse" />
              <span className="uppercase tracking-wide">{slides[currentSlide].accent}</span>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, x: isMobile ? 0 : -30, y: isMobile ? 10 : 0 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className={`text-secondary font-semibold uppercase tracking-widest ${isMobile ? 'text-[11px] mb-2 drop-shadow-md' : 'text-lg md:text-xl mb-4'}`}
            >
              {slides[currentSlide].subtitle}
            </motion.p>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              className={`font-display font-bold text-white leading-[1.15] md:leading-[1.1] text-shadow-xl ${isMobile ? 'text-3xl sm:text-4xl mb-3' : 'text-3xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 md:mb-6'}`}
            >
              {slides[currentSlide].title}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className={`text-white/95 leading-relaxed text-shadow-md ${isMobile ? 'text-[13px] mb-6 font-medium max-w-[95%]' : 'text-base md:text-xl mb-8 md:mb-10 text-primary-foreground/90 max-w-2xl'}`}
            >
              {slides[currentSlide].description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className={`flex flex-row gap-3 w-full ${isMobile ? 'justify-center mt-2' : 'items-center sm:items-start gap-4'}`}
            >
              <Button
                asChild
                size={isMobile ? "default" : "lg"}
                className={`bg-gradient-to-r from-secondary to-yellow-500 hover:from-secondary hover:to-secondary text-secondary-foreground font-bold rounded-full shadow-glow hover:shadow-glow-lg transition-all duration-300 group ${isMobile ? 'w-full max-w-[220px] px-4 h-12 text-sm' : 'w-[85%] sm:w-auto text-sm md:text-lg px-6 md:px-8 py-5 md:py-6'}`}
              >
                <Link to="/admissions" className="flex items-center justify-center gap-1">
                  Apply Now
                  <ArrowRight size={isMobile ? 14 : 18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                size={isMobile ? "default" : "lg"}
                variant="outline"
                className={`border border-white/40 text-white hover:bg-white hover:text-primary font-bold rounded-full bg-white/10 backdrop-blur-sm transition-all duration-300 ${isMobile ? 'w-full max-w-[220px] px-4 h-12 text-sm' : 'w-fit sm:w-auto text-sm md:text-lg px-8 md:px-8 py-5 md:py-6'}`}
              >
                <Link to="/about" className="flex items-center justify-center">Discover</Link>
              </Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Quick Stats - Desktop Only */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="hidden xl:block absolute right-8 top-1/2 -translate-y-1/2"
          >
          <div className="flex flex-col gap-4">
            {[
              { id: 'phone', icon: Phone, href: "tel:+919813288030", delay: 1.2 },
              { id: 'instagram', icon: Instagram, href: "https://www.instagram.com/indo_american_school_jhajjar/", delay: 1.3 },
              { id: 'mail', icon: Mail, href: "mailto:info@indoamerican.edu.in", delay: 1.4 },
            ].map((stat) => (
              <motion.a
                key={stat.id}
                href={stat.href}
                {...(stat.icon === Instagram ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: stat.delay }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full w-16 h-16 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <stat.icon size={24} className="text-white" />
              </motion.a>
            ))}
          </div>
        </motion.div>
        )}

      {/* Navigation Arrows (Desktop) */}
      {!isMobile && (
        <>
          <button
            onClick={prevSlide}
            className="hidden md:flex absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 bg-white/10 hover:bg-white/30 rounded-full items-center justify-center text-white backdrop-blur-md transition-all duration-300 border border-white/20 group"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={nextSlide}
            className="hidden md:flex absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 bg-white/10 hover:bg-white/30 rounded-full items-center justify-center text-white backdrop-blur-md transition-all duration-300 border border-white/20 group"
            aria-label="Next slide"
          >
            <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </>
      )}

      {/* Bottom Controls */}
      <div className={`absolute left-1/2 -translate-x-1/2 flex items-center ${isMobile ? 'bottom-6 gap-4 bg-school-blue/30 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10' : 'bottom-8 gap-6'}`}>
        {/* Play/Pause */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`${isMobile ? 'w-6 h-6 shrink-0 text-white flex items-center justify-center border-r border-white/20 pr-3' : 'w-11 h-11 bg-white/10 hover:bg-white/30 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-all duration-300 border border-white/20'}`}
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isPlaying ? <Pause size={isMobile ? 12 : 16} /> : <Play size={isMobile ? 12 : 16} className={isMobile ? "ml-0.5" : ""} />}
        </button>

        {/* Slide Indicators */}
        <div className="flex gap-1.5 md:gap-2 items-center">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlide(index)}
              className="group relative flex items-center justify-center py-2 shrink-0"
              aria-label={`Go to slide ${index + 1}`}
            >
              <div className={`rounded-full transition-all duration-500 ${currentSlide === index
                ? (isMobile ? "w-6 h-1.5 bg-secondary" : "w-10 h-1.5 bg-secondary shadow-glow")
                : (isMobile ? "w-1.5 h-1.5 bg-white/40" : "w-3 h-1.5 bg-white/40 group-hover:bg-white/60")
                }`} />
            </button>
          ))}
        </div>

        {/* Slide Counter (Desktop Only) */}
        {!isMobile && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1.5 text-white/80 text-xs font-medium">
            <span className="text-secondary font-bold">{String(currentSlide + 1)}</span>
            <span className="mx-1">/</span>
            <span>{slides.length}</span>
          </div>
        )}
      </div>

      {/* Scroll Indicator (Desktop Only) */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center pt-1.5"
          >
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </motion.div>
        </motion.div>
      )}
    </div>

    {/* Subtle bottom fade; dark -> transparent so white page shows through */}
    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none" />
  </section>
  );
};

export default memo(HeroSlider);


