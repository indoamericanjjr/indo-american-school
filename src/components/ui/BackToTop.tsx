import { useEffect, useState, useCallback, memo } from "react";
import { ArrowUp } from "lucide-react";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return visible ? (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 w-12 h-12 bg-secondary text-secondary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-secondary/90 transition-colors z-50"
    >
      <ArrowUp />
    </button>
  ) : null;
};

export default memo(BackToTop);


