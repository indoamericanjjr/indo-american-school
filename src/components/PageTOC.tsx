import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface TOCItem {
  id: string;
  title: string;
}

interface PageTOCProps {
  items: TOCItem[];
  className?: string;
}

const PageTOC = ({ items, className = "" }: PageTOCProps) => {
  const [activeSection, setActiveSection] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-100px 0px -50% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    // Show TOC when scrolled past hero
    const handleScroll = () => {
      const heroSection = document.querySelector("section");
      if (heroSection) {
        const heroHeight = heroSection.offsetHeight;
        setIsVisible(window.scrollY > heroHeight - 200);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [items]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Mobile TOC Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-4 right-4 z-40 lg:hidden"
      >
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="rounded-full w-12 h-12 shadow-lg bg-primary hover:bg-primary/90"
        >
          <List size={20} />
        </Button>
      </motion.div>

      {/* Desktop TOC */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className={`hidden lg:block fixed top-24 right-6 z-30 ${className}`}
      >
        <Card className="w-64 p-4 shadow-lg border border-border/50 backdrop-blur-sm bg-card/95">
          <h3 className="font-semibold text-lg mb-3 text-primary">On This Page</h3>
          <nav className="space-y-2">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  activeSection === item.id
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {item.title}
              </button>
            ))}
          </nav>
        </Card>
      </motion.div>

      {/* Mobile TOC Overlay */}
      <AnimatePresence>
        {isExpanded && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setIsExpanded(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-card border-t border-border rounded-t-2xl shadow-2xl"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg text-primary">On This Page</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(false)}
                  >
                    <ChevronDown size={20} />
                  </Button>
                </div>
                <nav className="space-y-2 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        scrollToSection(item.id);
                        setIsExpanded(false);
                      }}
                      className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        activeSection === item.id
                          ? "bg-primary text-primary-foreground font-medium"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      {item.title}
                    </button>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default PageTOC;

