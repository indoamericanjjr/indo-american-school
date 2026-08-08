import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, memo } from "react";
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Microscope,
  Monitor,
  BookOpen,
  Dumbbell,
  Palette,
  Bus,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const library = "/uploads/library.jpg";



const facilities = [
  {
    icon: Microscope,
    title: "Science Labs",
    description: "Well-equipped Physics, Chemistry, and Biology laboratories with modern equipment.",
    image: "/uploads/240_F_409195861_3JFdY7kvxO5GFV2zsrvlXEv5p6dYHBpB.jpg",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Monitor,
    title: "Computer Lab",
    description: "State-of-the-art computer lab with high-speed internet and latest software.",
    image: "/uploads/240_F_274385444_M9wwLkwPTAYj8qtmEB5MLLcuA88OQLec.jpg",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: BookOpen,
    title: "Library",
    description: "Extensive collection of books, periodicals, and digital resources.",
    image: library,
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Dumbbell,
    title: "Sports Complex",
    description: "Outdoor and indoor sports facilities including cricket, basketball, and athletics.",
    image: "/uploads/DSC_1060.JPG",
    gradient: "from-red-500 to-pink-500",
  },
  {
    icon: Palette,
    title: "Art Studio",
    description: "Creative space for painting, drawing, crafts, and artistic activities.",
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Bus,
    title: "Transport",
    description: "Safe and reliable bus service covering all major routes.",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400",
    gradient: "from-indigo-500 to-blue-500",
  },
];

const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const FacilitiesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-slate-900/10 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-15" />

      <div className="container-custom relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-10 md:mb-16"
        >
          <div className="section-label mx-auto w-fit">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            Our Facilities
          </div>
          <h2 className="section-title text-3xl sm:text-4xl md:text-5xl">
            World-Class <span className="text-gradient block sm:inline mt-1 sm:mt-0">Infrastructure</span>
          </h2>
          <p className="section-subtitle mx-auto text-sm sm:text-base px-4">
            Our campus is equipped with modern facilities to provide the best learning environment
            and support the overall development of our students.
          </p>
        </motion.div>

        {/* Facilities Container - Horizontal scroll on mobile, Grid on desktop */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex overflow-x-auto snap-x snap-mandatory pb-8 pt-4 -mx-4 px-4 sm:mx-0 sm:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 hide-scrollbar md:overflow-visible md:pb-0 md:pt-0"
        >
          {facilities.map((facility) => (
            <motion.div
              key={facility.title}
              variants={itemVariants}
              className="group min-w-[280px] w-[85vw] sm:min-w-[320px] sm:w-[320px] md:w-auto snap-center shrink-0"
            >
              <Link to="/facilities" className="block h-full">
                <div className="rounded-[2rem] overflow-hidden shadow-[0_18px_60px_rgba(15,23,42,0.08)] transition-all duration-500 border border-slate-200/80 bg-white/95 hover:-translate-y-2 hover:shadow-[0_30px_90px_rgba(15,23,42,0.12)] h-full flex flex-col">
                  {/* Image Container */}
                  <div className="relative h-48 md:h-56 overflow-hidden">
                    <img
                      src={facility.image}
                      alt={facility.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />

                    {/* Icon Badge */}
                    <div
                      className={`absolute bottom-4 left-4 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${facility.gradient} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300 ring-2 ring-white/20`}
                    >
                      <facility.icon className="text-white w-5 h-5 md:w-6 md:h-6" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 md:p-6 flex-1 flex flex-col bg-white">
                    <h3 className="font-display font-bold text-lg md:text-xl text-slate-950 mb-2 group-hover:text-sky-600 transition-colors">
                      {facility.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed flex-1">
                      {facility.description}
                    </p>
                    <div className="mt-4 md:mt-6 flex items-center gap-2 text-slate-900 text-sm font-semibold transition-all">
                      <span className="px-3 py-1.5 rounded-2xl bg-sky-50 text-sky-700 backdrop-blur-sm border border-sky-100">
                        Explore Facility
                      </span>
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center transition-colors group-hover:bg-sky-600 group-hover:text-white">
                        <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* CSS for hiding scrollbar specifically for this section */}
        <style dangerouslySetInnerHTML={{__html: `
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}} />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-6 md:mt-12"
        >
          <Button asChild size="lg" variant="outline" className="rounded-full group shadow-md hover:shadow-lg w-full sm:w-auto py-6 md:py-5 border-slate-200 dark:border-slate-800">
            <Link to="/facilities" className="flex items-center gap-2 text-base md:text-sm">
              Discover All Facilities
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(FacilitiesSection);

