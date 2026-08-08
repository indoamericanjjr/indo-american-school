import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import logo from "@/assets/new-logo.jpg";

interface LoadingProps {
  className?: string;
  isSplash?: boolean;
}

export function Loading({ className, isSplash = false }: LoadingProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (isSplash) {
      const timer = setTimeout(() => {
        setShow(false);
      }, 3000); // 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isSplash]);

  if (isSplash && !show) return null;

  return (
    <motion.div
      className={cn("min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center relative overflow-hidden", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-primary/15 rounded-full blur-lg"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Logo container */}
        <motion.div
          className="relative flex items-center justify-center w-32 h-32"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        >
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 border-4 border-primary/20 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          ></motion.div>

          {/* Middle ring */}
          <motion.div
            className="absolute inset-2 border-3 border-secondary/40 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          ></motion.div>

          {/* Logo in center */}
          <motion.img
            src={logo}
            alt="Indo American School Logo"
            className="w-20 h-20 object-contain z-10 relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
          />
        </motion.div>

        {/* Loading text */}
        <motion.div
          className="text-center space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-primary">Indo American School</h2>
          <p className="text-muted-foreground">Excellence in Education Since 2002</p>

          {/* Progress dots */}
          <motion.div
            className="flex justify-center space-x-1 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-primary rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        {isSplash && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <p className="text-sm text-muted-foreground">Preparing your experience...</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

