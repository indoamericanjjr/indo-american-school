import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search, BookOpen, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-2xl mx-auto">
          {/* Large 404 Number */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8"
          >
            <h1 className="text-8xl md:text-9xl font-display font-bold text-primary/20">404</h1>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-6"
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
              Page Not Found
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              The page you're looking for doesn't exist or may have been moved.
              Let's get you back on track to discover what Indo American School has to offer.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          >
            <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold">
              <Link to="/" className="flex items-center gap-2">
                <Home size={20} />
                Return to Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="font-semibold">
              <Link to="/about" className="flex items-center gap-2">
                <BookOpen size={20} />
                About Us
              </Link>
            </Button>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50"
          >
            <p className="text-muted-foreground mb-4 font-medium">Explore Our School</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              <Link
                to="/academics"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors group"
              >
                <BookOpen size={18} className="text-primary group-hover:text-primary/80" />
                <span className="text-sm">Academics</span>
              </Link>
              <Link
                to="/facilities"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors group"
              >
                <Home size={18} className="text-primary group-hover:text-primary/80" />
                <span className="text-sm">Facilities</span>
              </Link>
              <Link
                to="/admissions"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors group"
              >
                <Search size={18} className="text-primary group-hover:text-primary/80" />
                <span className="text-sm">Admissions</span>
              </Link>
              <Link
                to="/contact"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors group"
              >
                <Phone size={18} className="text-primary group-hover:text-primary/80" />
                <span className="text-sm">Contact Us</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;


