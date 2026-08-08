import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, CheckCircle, Phone, FileText, Calendar, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const admissionSteps = [
  {
    icon: FileText,
    title: "Fill Application Form",
    description: "Complete the online admission form with student and parent details",
  },
  {
    icon: Calendar,
    title: "Schedule Assessment",
    description: "Book a slot for entrance assessment and interaction",
  },
  {
    icon: CheckCircle,
    title: "Document Verification",
    description: "Submit required documents for verification",
  },
  {
    icon: GraduationCap,
    title: "Admission Confirmation",
    description: "Complete fee payment and get admission confirmed",
  },
];

const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-gradient-to-b from-background to-muted/30">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-12 items-center">
          {/* Left - Admission Process */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <div className="text-center lg:text-left mb-8 md:mb-10">
              <span className="text-secondary font-semibold text-xs sm:text-sm uppercase tracking-wider bg-secondary/10 px-3 py-1 rounded-full">Admission Process</span>
              <h2 className="section-title mt-4 text-3xl sm:text-4xl md:text-5xl">Simple Steps to <span className="text-gradient block sm:inline mt-1 sm:mt-0">Join Our Family</span></h2>
              <p className="text-muted-foreground mt-3 text-sm sm:text-base leading-relaxed max-w-lg mx-auto lg:mx-0">
                We have streamlined our admission process to make it easy for parents 
                and students. Follow these simple steps to become a part of Indo American School.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent lg:before:ml-6 lg:before:translate-x-0">
              {admissionSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="relative flex items-center md:items-start justify-between md:justify-normal group"
                >
                  <div className="flex items-center w-full md:w-auto">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-background bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground shadow-sm transition-colors shrink-0 z-10 mr-4 sm:mr-6">
                      <step.icon size={20} />
                    </div>
                    <div className="flex-1 bg-card rounded-2xl p-4 sm:p-5 border border-slate-100 dark:border-slate-800 shadow-sm group-hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-secondary font-bold text-xs uppercase tracking-wider bg-secondary/10 px-2 py-0.5 rounded-md">Step {index + 1}</span>
                      </div>
                      <h4 className="font-bold text-foreground text-sm md:text-base leading-tight mb-1">{step.title}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-snug">{step.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - CTA Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2 mb-4 lg:mb-0"
          >
            <div className="bg-primary rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 md:p-12 text-primary-foreground relative overflow-hidden shadow-2xl">
              {/* Background Decoration */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-secondary/30 rounded-full blur-3xl mix-blend-screen" />
              <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-white/10 rounded-full blur-2xl mix-blend-overlay" />
              <div className="absolute inset-0 pattern-dots opacity-10 mix-blend-overlay" />

              <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="inline-flex items-center justify-center px-4 py-1.5 bg-secondary text-secondary-foreground rounded-full text-xs font-bold uppercase tracking-wider mb-6 sm:mb-8 shadow-glow-sm">
                  Admissions Open 2026-27
                </span>
                
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4 sm:mb-6 leading-tight">
                  Give Your Child the Best Start
                </h3>
                
                <p className="text-primary-foreground/80 mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed max-w-md">
                  Enroll your child at Indo American School and give them access to 
                  quality education, experienced teachers, and world-class facilities. 
                  Limited seats available - apply now!
                </p>

                <ul className="space-y-3 sm:space-y-4 mb-8 sm:mb-10 w-full text-left max-w-md mx-auto lg:mx-0">
                  {[
                    "Classes from Nursery to XII",
                    "CBSE Affiliated Curriculum",
                    "Air-conditioned Classrooms",
                    "Scholarship for Meritorious Students",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm sm:text-base text-primary-foreground/90 font-medium">
                      <div className="mt-0.5 rounded-full bg-secondary/20 p-0.5 shrink-0">
                        <CheckCircle className="text-secondary" size={16} />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
                  <Button asChild size="lg" className="w-full sm:w-auto sm:flex-1 bg-secondary text-secondary-foreground hover:bg-white hover:text-primary font-bold py-6 sm:py-5 sm:text-base transition-colors shadow-glow-sm">
                    <Link to="/admissions" className="flex items-center justify-center">
                      Apply Now <ArrowRight size={18} className="ml-2 -mt-0.5" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="w-full sm:w-auto sm:flex-1 border-2 border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground hover:text-primary font-bold py-6 sm:py-5 sm:text-base bg-transparent transition-colors backdrop-blur-sm">
                    <a href="tel:+919813288030" className="flex items-center justify-center">
                      <Phone size={18} className="mr-2 -mt-0.5" /> Call Us
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;


