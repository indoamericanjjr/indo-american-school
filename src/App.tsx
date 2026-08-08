import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { toast } from "@/hooks/use-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loading } from "@/components/ui/loading";
import hero1 from "@/assets/hero-1.jpg";
import heroNew from "@/assets/hero-new.jpg";
import worldEducation from "@/assets/world-education.jpg";
import sports from "@/assets/sports.jpg";
import library from "@/assets/library.jpg";

import { usePullToRefresh } from "@/hooks/use-pull-to-refresh";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { CommandPalette } from "@/components/ui/command-palette";

import Index from "./pages/Index";
import About from "./pages/About";
import Academics from "./pages/Academics";
import Facilities from "./pages/Facilities";
import Events from "./pages/Events";
import Announcements from "./pages/Announcements";
import Admissions from "./pages/Admissions";
import TeacherApplications from "./pages/TeacherApplications";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import Documents from "./pages/Documents";
import Admin from "./pages/Admin";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";


const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/academics" element={<Academics />} />
      <Route path="/facilities" element={<Facilities />} />
      <Route path="/events" element={<Events />} />
      <Route path="/announcements" element={<Announcements />} />
      <Route path="/admissions" element={<Admissions />} />
      <Route path="/teacher-applications" element={<TeacherApplications />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/documents" element={<Documents />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showAchievementModal, setShowAchievementModal] = useState(false);

  // Show achievements notification on full load
  useEffect(() => {
    if (!showSplash) {
      const timer = setTimeout(() => {
        setShowAchievementModal(true);
      }, 500); // Small delay after splash screen
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  // Preload hero images during splash screen
  useEffect(() => {
    if (showSplash) {
      const heroImages = [hero1, heroNew, worldEducation, sports, library];
      heroImages.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    }
  }, [showSplash]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1800); // 1.8 seconds snappy splash
    return () => clearTimeout(timer);
  }, []);

  // Pull-to-refresh functionality
  const handleRefresh = async () => {
    // Simulate refresh by reloading the page or clearing cache
    window.location.reload();
  };

  const { isRefreshing, pullDistance } = usePullToRefresh(handleRefresh);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" enableSystem={false} defaultTheme="light">
            <TooltipProvider>
              <Toaster />
              <Sonner />
            {/* Pull-to-refresh indicator */}
            <div className={`pull-refresh-indicator ${pullDistance > 50 ? 'visible' : ''}`}>
              {isRefreshing ? '🔄 Refreshing...' : '⬇️ Pull to refresh'}
            </div>

            {showSplash ? (
              <Loading key="splash" isSplash />
            ) : (
              <div>
                <BrowserRouter>
                  <CommandPalette />
                  <AnimatedRoutes />
                </BrowserRouter>
              </div>
            )}

            <Dialog open={showAchievementModal} onOpenChange={setShowAchievementModal}>
              <DialogContent className="max-w-[98vw] w-[95vw] sm:max-w-fit sm:w-auto p-0 sm:p-1 bg-transparent border-none shadow-none overflow-visible [&>button]:bg-white [&>button]:text-black [&>button]:opacity-100 [&>button]:shadow-xl [&>button]:rounded-full [&>button]:w-8 [&>button]:h-8 [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:-top-4 [&>button]:-right-4 [&>button:hover]:bg-slate-200 [&>button:hover]:opacity-100 z-[100]">
                <DialogHeader className="sr-only">
                  <DialogTitle>School Achievements</DialogTitle>
                  <DialogDescription>Student performance and latest achievements flyer.</DialogDescription>
                </DialogHeader>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                  className="relative flex justify-center items-center rounded-xl md:rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/30 backdrop-blur-sm"
                >
                  <img
                    src="/professional_enhanced_school_result.png"
                    onError={(e) => {
                      // Fallback in case the name differs
                      const target = e.target as HTMLImageElement;
                      if (!target.src.includes('?fallback')) {
                         target.src = '/indo-notification-result.jpeg?fallback=true';
                      }
                    }}
                    alt="Latest achievements notification"
                    className="w-full sm:max-w-[600px] h-auto max-h-[90vh] object-contain bg-white/90 block rounded-xl md:rounded-2xl"
                  />
                </motion.div>
              </DialogContent>
            </Dialog>

          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
  );
};

export default App;


