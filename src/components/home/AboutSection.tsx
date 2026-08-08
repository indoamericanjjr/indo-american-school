import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, memo } from "react";
import { GraduationCap, Users, Trophy, BookOpen, Clock, Star, Award, Target, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSiteImages } from "@/hooks/use-site-images";

/* eslint-disable @typescript-eslint/no-explicit-any */
import about1 from "@/assets/about-1.jpg";
import about2 from "@/assets/about-2.jpg";
import about3 from "@/assets/about-3.jpg";

const stats = [
  { icon: GraduationCap, value: "5000+", label: "Happy Students", color: "from-primary to-school-blue-light" },
  { icon: Users, value: "200+", label: "Expert Teachers", color: "from-secondary to-school-gold-dark" },
  { icon: Trophy, value: "150+", label: "Awards Won", color: "from-school-purple to-primary" },
  { icon: BookOpen, value: "23+", label: "Years Legacy", color: "from-school-success to-primary" },
];

const features = [
  {
    icon: Clock,
    title: "Experienced Faculty",
    description: "Decades of teaching excellence with personalized guidance for every student.",
  },
  {
    icon: Star,
    title: "Modern Infrastructure",
    description: "State-of-the-art classrooms, labs, and sports facilities for optimal learning.",
  },
  {
    icon: Award,
    title: "Proven Excellence",
    description: "Consistent top results in board exams and competitive examinations.",
  },
  {
    icon: Target,
    title: "Holistic Development",
    description: "Focus on academics, sports, arts, and character building.",
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
  hidden: { opacity: 0, scale: 0.9, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 14 }
  }
};

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { getImage } = useSiteImages();

  const aboutImg1 = getImage('about_image_1', about1);
  const aboutImg2 = getImage('about_image_2', about2);
  const aboutImg3 = getImage('about_image_3', about3);

  return (
    <section ref={ref} className="section-padding bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-secondary/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-radial from-primary/5 to-transparent rounded-full blur-3xl" />

      <div className="container-custom relative">
        {/* Stats Bar - Overlapping Hero */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 -mt-8 md:-mt-16 mb-16 md:mb-20 relative z-10"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="group"
            >
              <div className="bg-card rounded-2xl shadow-card hover:shadow-card-hover p-4 sm:p-6 md:p-8 text-center card-hover border border-border/50 relative overflow-hidden h-full flex flex-col justify-center">
                {/* Gradient accent line */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`} />

                <div className={`w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br ${stat.color} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="text-primary-foreground w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground mb-0.5 sm:mb-1 group-hover:text-primary transition-colors">
                  {stat.value}
                </h3>
                <p className="text-muted-foreground text-[10px] sm:text-xs md:text-sm font-medium uppercase tracking-wider">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="order-2 lg:order-1"
          >
            <div className="section-label justify-center lg:justify-start">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              About Our School
            </div>

            <h2 className="section-title text-balance text-center lg:text-left text-3xl sm:text-4xl md:text-5xl">
              Nurturing Minds, Building Futures{" "}
              <span className="text-gradient block sm:inline mt-1 sm:mt-0">Since 2002</span>
            </h2>

            <p className="text-muted-foreground mb-5 md:mb-6 text-base sm:text-lg leading-relaxed text-center lg:text-left">
              Indo American School, Jhajjar was established with a vision to provide world-class education
              that combines the best of Indian values with international standards. Located in the heart of
              Jhajjar, Haryana, our institution has grown to become one of the most respected educational
              establishments in the region.
            </p>

            <p className="text-muted-foreground mb-8 md:mb-10 text-base sm:text-lg leading-relaxed text-center lg:text-left">
              We believe that every child is unique and has the potential to achieve greatness. Our
              comprehensive curriculum, experienced faculty, and modern facilities work together to
              create an environment where students can discover their passions and develop their talents.
            </p>

            {/* Features Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-8"
            >
              {features.map((feature) => (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  className="group flex gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 hover:border-primary/20 hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
                    <feature.icon size={22} className="text-primary group-hover:text-primary-foreground" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className="font-bold text-sm sm:text-base text-foreground mb-0.5 group-hover:text-primary transition-colors">{feature.title}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-snug">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <div className="flex justify-center lg:justify-start">
              <Button asChild size="lg" className="rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 group w-full sm:w-auto py-6 text-base sm:py-5 sm:text-sm">
                <Link to="/about" className="flex items-center justify-center gap-2">
                  Learn More About Us
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Right - Premium Image Grid */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative order-1 lg:order-2 mb-10 lg:mb-0 px-4 sm:px-8 lg:px-0"
          >
            <div className="grid grid-cols-12 gap-3 sm:gap-4">
              {/* Main large image */}
              <div className="col-span-7 row-span-2">
                <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] border-[8px] border-white/90 dark:border-slate-800/90 ring-1 ring-black/5 image-zoom">
                  <img
                    src={aboutImg1}
                    alt="Classroom learning"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Top right image */}
              <div className="col-span-5">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-[0_20px_40px_-10px_rgba(0,0,0,0.25)] border-[6px] border-white/90 dark:border-slate-800/90 ring-1 ring-black/5 image-zoom translate-y-4 sm:translate-y-8">
                  <img
                    src={aboutImg2}
                    alt="Students studying"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Bottom right image */}
              <div className="col-span-5">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-[0_20px_40px_-10px_rgba(0,0,0,0.25)] border-[6px] border-white/90 dark:border-slate-800/90 ring-1 ring-black/5 image-zoom translate-y-4 sm:translate-y-8 mt-3 sm:mt-4">
                  <img
                    src={aboutImg3}
                    alt="School activities"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={isInView ? { scale: 1, rotate: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8, type: "spring" }}
              className="absolute -bottom-4 sm:-bottom-6 -left-2 sm:-left-6 bg-secondary text-secondary-foreground p-4 sm:p-6 rounded-2xl shadow-glow z-10 border-2 border-white/20"
            >
              <p className="text-3xl sm:text-4xl font-display font-bold">23+</p>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider">Years of Excellence</p>
            </motion.div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-2 sm:-right-4 w-16 sm:w-24 h-16 sm:h-24 border-2 border-secondary/30 rounded-2xl -z-10" />
            <div className="absolute -bottom-4 right-10 sm:right-20 w-12 sm:w-16 h-12 sm:h-16 bg-primary/10 rounded-full -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default memo(AboutSection);

