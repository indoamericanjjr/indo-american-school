import Layout from "@/components/layout/Layout";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";
import { GraduationCap, Target, Eye, Heart, Users, Award, BookOpen, Star, MapPin, Phone, Mail, Clock, Shield, Lightbulb, Globe, Home, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Tilt from "react-parallax-tilt";

const schoolCampus = "/uploads/school-campus.jpg";

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 800], [0, 200]);

  useEffect(() => {
    if (window.location.hash) {
      const element = document.getElementById(window.location.hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, []);

  const stats = [
    { number: "23+", label: "Years of Excellence", icon: Award },
    { number: "5000+", label: "Students Enrolled", icon: Users },
    { number: "200+", label: "Qualified Teachers", icon: GraduationCap },
    { number: "95%", label: "Board Results", icon: Star },
  ];

  const values = [
    { icon: Shield, title: "Integrity", description: "We uphold the highest standards of honesty and ethical behavior in all our actions." },
    { icon: Star, title: "Excellence", description: "We strive for excellence in academics, sports, and character development." },
    { icon: Heart, title: "Compassion", description: "We foster a caring environment where every student feels valued and supported." },
    { icon: Lightbulb, title: "Innovation", description: "We embrace modern teaching methods and technology-enhanced learning." },
    { icon: Globe, title: "Global Citizenship", description: "We prepare students to be responsible citizens of the world." },
    { icon: Users, title: "Collaboration", description: "We believe in teamwork and building strong community bonds." },
  ];

  const leadership = [
    { name: "Bijender Kadian", role: "Director", image: "/assets/about-1.jpg", qualification: "M.A., B.Ed." },
    { name: "Mrs. Mamta", role: "Principal", image: "/assets/about-2.jpg", qualification: "M.A., B.Ed." },
    { name: "Mohit Kadian", role: "Chairman", image: "/assets/about-3.jpg", qualification: "M.Sc., M.Ed." },
  ];



  return (
    <>
      <Helmet>
        <title>Who We Are | About Indo American School Jhajjar | Our Legacy & Vision</title>
        <meta name="description" content="Learn about the 24+ years legacy of Indo American School Jhajjar. Established in 2002, we follow the CBSE curriculum (Affiliation No: 530460) with a mission to nurture young minds through quality education, leadership, and holistic development." />
        <meta name="keywords" content="Indo American School Jhajjar history, Who We Are Indo American School, school director Bijender Kadian, principal message Mrs Mamta, school vision Jhajjar, educational mission Haryana, Jhajjar school legacy" />
        <link rel="canonical" href="https://indoamericanjjr.com/about" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://indoamericanjjr.com/about" />
        <meta property="og:site_name" content="Indo American School Jhajjar" />
        <meta property="og:title" content="Who We Are | About Indo American School Jhajjar" />
        <meta property="og:description" content="Discover our journey since 2002, our core values, vision, and leadership team dedicated to educational excellence at Indo American School Jhajjar." />
        <meta property="og:image" content="https://indoamericanjjr.com/professional_enhanced_school_result.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://indoamericanjjr.com/about" />
        <meta property="twitter:title" content="Who We Are | About Indo American School Jhajjar" />
        <meta property="twitter:description" content="Discover our journey since 2002, core values, and leadership team dedicated to excellence." />
        <meta property="twitter:image" content="https://indoamericanjjr.com/professional_enhanced_school_result.png" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "AboutPage",
                "name": "Who We Are - About Indo American School Jhajjar",
                "url": "https://indoamericanjjr.com/about",
                "mainEntity": {
                  "@type": "School",
                  "name": "Indo American School Jhajjar",
                  "foundingDate": "2002",
                  "founder": "Bijender Kadian",
                  "description": "Indo American School is a premier CBSE affiliated senior secondary school in Jhajjar, Haryana, dedicated to providing quality education.",
                  "logo": "https://indoamericanjjr.com/indo-logo.png",
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Agrasen Chowk / Talao Road",
                    "addressLocality": "Jhajjar",
                    "addressRegion": "Haryana",
                    "postalCode": "124103",
                    "addressCountry": "IN"
                  }
                }
              },
              {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://indoamericanjjr.com/" },
                  { "@type": "ListItem", "position": 2, "name": "About Us", "item": "https://indoamericanjjr.com/about" }
                ]
              }
            ]
          })}
        </script>
      </Helmet>

      <Layout>
        {/* Hero Section */}
        <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
                <motion.img
              src={`${schoolCampus}?width=800&quality=80&format=webp`}
              alt="Classroom learning"
              loading="lazy"
              style={{ y: yParallax, scale: 1.15 }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary/60" />
          </div>

          {/* Breadcrumb */}
          <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10">
            <div className="flex items-center gap-2 text-primary-foreground/80 text-sm">
              <Link to="/" className="flex items-center gap-1 hover:text-secondary transition-colors">
                <Home size={14} />
                <span>Home</span>
              </Link>
              <ChevronRight size={14} />
              <span className="text-primary-foreground font-medium">About Us</span>
            </div>
          </div>
          <div className="relative z-10 text-center text-primary-foreground px-4">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm font-semibold mb-4"
            >
              Established 2002
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4"
            >
              About Indo American School
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto"
            >
              Over two decades of shaping minds and building futures
            </motion.p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-muted">
          <div className="container-custom">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 -mt-4 md:-mt-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card p-4 md:p-6 rounded-2xl shadow-sm border border-border text-center"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="text-primary" size={24} />
                  </div>
                  <p className="text-2xl md:text-4xl font-bold text-primary">{stat.number}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section id="our-story" className="section-padding" ref={ref}>
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Our Story</span>
                <h2 className="text-2xl md:text-4xl font-display font-bold mt-2 mb-6">A Legacy of Excellence in Education</h2>
                <p className="text-muted-foreground mb-4 text-sm md:text-base">
                  Indo American School was founded in 2002 with a singular vision: to create an educational institution that combines the best of Indian values with global educational standards. What began as a small school with just 50 students has now grown into one of the most prestigious educational institutions in Haryana.
                </p>
                <p className="text-muted-foreground mb-4 text-sm md:text-base">
                  Over the past two decades, we have consistently focused on providing holistic education that nurtures not just academic excellence but also character, creativity, and compassion. Our alumni have gone on to excel in various fields, from medicine and engineering to arts and entrepreneurship.
                </p>
                <p className="text-muted-foreground text-sm md:text-base">
                  Today, Indo American School stands as a testament to what dedicated educators and supportive parents can achieve together. We continue to evolve with changing times while staying true to our core values of integrity, excellence, and service.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="rounded-3xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] border-[8px] border-white/90 dark:border-slate-800/90 ring-1 ring-black/5 image-zoom">
                  <img src="/uploads/DSC_5149.JPG" alt="School History" loading="lazy" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 bg-secondary text-secondary-foreground p-4 md:p-6 rounded-xl shadow-lg">
                  <p className="text-3xl md:text-4xl font-bold">23+</p>
                  <p className="text-xs md:text-sm">Years of Excellence</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Principal's Message */}
        <section id="principals-message" className="py-16 bg-muted">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="order-2 lg:order-1">
                <span className="text-secondary font-semibold text-sm uppercase tracking-wider">From the Director's Desk</span>
                <h2 className="text-2xl md:text-3xl font-display font-bold mt-2 mb-6">Director's Message</h2>
                <div className="space-y-4 text-muted-foreground text-sm md:text-base">
                  <p>
                    "Dear Parents and Students,
                  </p>
                  <p>
                    It gives me immense pleasure to welcome you to Indo American School, where we have been nurturing young minds for over two decades. Our school is not just an educational institution; it is a second home where students learn, grow, and transform into confident individuals ready to face the challenges of the modern world.
                  </p>
                  <p>
                    At IAS, we believe that every child is unique and has the potential to excel. Our dedicated faculty, state-of-the-art infrastructure, and holistic approach to education ensure that students receive the best possible learning experience. We focus not only on academic excellence but also on developing character, creativity, and compassion.
                  </p>
                </div>
                <p className="font-display font-bold mt-6 text-lg">Mr. Bijender Kadian</p>
                <p className="text-muted-foreground">Director, Indo American School</p>
              </div>
              <div className="order-1 lg:order-2">
                <div className="aspect-[4/5] sm:aspect-square md:aspect-[4/3] lg:aspect-[3/4] rounded-3xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] border-[8px] border-white/90 dark:border-slate-800/90 ring-1 ring-black/5 image-zoom">
                  <img src="/assets/cultural.jpg" alt="Principal" loading="lazy" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section id="vision-mission" className="py-16 bg-primary text-primary-foreground">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-display font-bold">Our Vision & Mission</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-primary-foreground/10 backdrop-blur-sm p-6 md:p-8 rounded-2xl"
              >
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-6">
                  <Eye className="text-secondary-foreground" size={32} />
                </div>
                <h3 className="text-xl md:text-2xl font-display font-bold mb-4">Our Vision</h3>
                <p className="text-primary-foreground/90 text-sm md:text-base">
                  To be a globally recognized center of educational excellence that produces confident, capable, and compassionate leaders who contribute positively to society. We envision a world where every student discovers their potential and uses it to make a meaningful difference.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-primary-foreground/10 backdrop-blur-sm p-6 md:p-8 rounded-2xl"
              >
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-6">
                  <Target className="text-secondary-foreground" size={32} />
                </div>
                <h3 className="text-xl md:text-2xl font-display font-bold mb-4">Our Mission</h3>
                <p className="text-primary-foreground/90 text-sm md:text-base">
                  To provide holistic education that develops intellectual, physical, emotional, and social capabilities of every student. We are committed to creating an inclusive learning environment that encourages curiosity, creativity, and critical thinking while instilling strong moral values.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section id="core-values" className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-12">
              <span className="text-secondary font-semibold text-sm uppercase tracking-wider">What We Stand For</span>
              <h2 className="text-2xl md:text-4xl font-display font-bold mt-2">Our Core Values</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {values.map((value, i) => (
                <Tilt key={value.title} tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.02} transitionSpeed={2000}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 40 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: i * 0.15, type: "spring", stiffness: 120, damping: 14 }}
                    className="group bg-card h-full p-6 md:p-8 rounded-2xl shadow-sm border border-border hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 hover:-translate-y-2 transition-all duration-300 will-change-transform"
                  >
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary transition-colors duration-300">
                      <value.icon className="text-primary group-hover:text-white transition-colors duration-300" size={28} />
                    </div>
                    <h3 className="text-lg md:text-xl font-display font-bold mb-2 group-hover:text-primary transition-colors duration-300">{value.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                  </motion.div>
                </Tilt>
              ))}
            </div>
          </div>
        </section>

      </Layout>
    </>
  );
};

export default About;


