import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface SectionItem {
  id: string;
  title: string;
}

interface PageSectionNavProps {
  items: SectionItem[];
  className?: string;
}

const PageSectionNav = ({ items, className = "" }: PageSectionNavProps) => {
  const [activeSection, setActiveSection] = useState<string>("");
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

    // Show nav when scrolled past hero
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
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`sticky top-16 z-40 bg-card/95 backdrop-blur-xl border-b border-border/50 shadow-sm ${className}`}
    >
      <div className="container-custom">
        <div className="flex items-center gap-1 py-3 overflow-x-auto scrollbar-hide">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap mr-2">Jump to:</span>
          {items.map((item, index) => (
            <div key={item.id} className="flex items-center">
              {index > 0 && <ChevronRight size={12} className="text-muted-foreground/40 mx-1 flex-shrink-0" />}
              <button
                onClick={() => scrollToSection(item.id)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-all ${
                  activeSection === item.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {item.title}
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};

export default PageSectionNav;

