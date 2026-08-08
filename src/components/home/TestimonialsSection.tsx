import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Mrs. Priya Sharma",
    role: "Parent of Class VIII Student",
    content: "As a parent, I'm incredibly impressed with how Indo American School has transformed my child's confidence and academic performance. The teachers are dedicated and the school's holistic approach has helped my child excel in both studies and extracurricular activities.",
    rating: 5,
  },
  {
    id: 2,
    name: "Rahul Mehta",
    role: "Class XII Student",
    content: "The comprehensive curriculum and dedicated faculty have prepared me well for competitive exams. The school's focus on holistic development has helped me grow academically and personally.",
    rating: 5,
  },
  {
    id: 3,
    name: "Mr. Rajesh Kumar",
    role: "Parent of Class X Student",
    content: "The school's emphasis on character building and ethical values alongside academic excellence has made a tremendous difference in my child's development. Indo American School doesn't just teach subjects, it shapes responsible citizens.",
    rating: 5,
  },
  {
    id: 4,
    name: "Sneha Gupta",
    role: "Class X Student",
    content: "The extracurricular activities and leadership programs have helped me develop skills beyond academics. Indo American School truly nurtures well-rounded individuals.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-gradient-to-br from-primary via-school-blue-dark to-school-navy relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20 pattern-dots" />
      <motion.div 
        className="absolute top-20 left-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl hidden md:block"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-20 right-20 w-48 h-48 sm:w-72 sm:h-72 bg-primary-foreground/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 8, repeat: Infinity, delay: 2 }}
      />

      <div className="container-custom relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 bg-secondary/20 text-secondary rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4 border border-secondary/30">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-secondary animate-pulse" />
            Testimonials
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-display font-bold text-primary-foreground mb-3 md:mb-4 px-2">
            What Parents & Students <span className="text-secondary block sm:inline mt-1 sm:mt-0">Say</span>
          </h2>
          <p className="text-base sm:text-lg text-primary-foreground/70 max-w-2xl mx-auto px-4">
            Hear from our community about their experiences at Indo American School
          </p>
        </motion.div>

        {/* Testimonials Container - Horizontal scroll on mobile, Grid on desktop */}
        <div className="flex overflow-x-auto snap-x snap-mandatory pb-8 pt-4 -mx-4 px-4 sm:mx-0 sm:px-0 md:grid md:grid-cols-2 gap-4 md:gap-6 hide-scrollbar md:overflow-visible md:pb-0 md:pt-0">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group min-w-[280px] w-[85vw] sm:min-w-[350px] sm:w-[350px] md:w-auto snap-center shrink-0"
            >
              <div className="glass-dark rounded-2xl md:rounded-3xl p-6 md:p-8 h-full flex flex-col hover:bg-primary-foreground/15 transition-all duration-300 border border-white/5 md:border-transparent">
                <div className="mb-4 text-center">
                  <h4 className="font-semibold text-primary-foreground text-base sm:text-lg">{testimonial.name}</h4>
                  <p className="text-xs sm:text-sm text-primary-foreground/60 mt-0.5">{testimonial.role}</p>
                  <div className="flex gap-0.5 mt-2 justify-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={14} className="fill-secondary text-secondary" />
                    ))}
                  </div>
                </div>
                <div className="relative flex-1 flex items-center">
                  <Quote className="absolute -top-3 -left-2 text-secondary/20" size={32} />
                  <p className="text-primary-foreground/85 pl-6 sm:pl-8 leading-relaxed italic text-sm sm:text-base">
                    "{testimonial.content}"
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CSS for hiding scrollbar */}
        <style dangerouslySetInnerHTML={{__html: `
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}} />
      </div>
    </section>
  );
};

export default TestimonialsSection;

