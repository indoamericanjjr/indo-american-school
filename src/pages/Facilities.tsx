import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import {
  Building2, FlaskConical, BookOpen, Monitor, Dumbbell, Bus,
  Shield, Wifi, TreePine, Music, Palette,
  Microscope, Laptop, Library, Waves, Trophy, Heart,
  Camera, Video, Headphones, Gamepad2, GraduationCap, Users, Home, ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Helmet } from "react-helmet-async";

const library = "/uploads/library.jpg";

const Facilities = () => {
  const mainFacilities = [
    {
      icon: FlaskConical,
      title: "Science Laboratories",
      description: "State-of-the-art physics, chemistry, and biology labs equipped with modern apparatus and safety equipment for hands-on scientific learning.",
      image: "/uploads/240_F_409195861_3JFdY7kvxO5GFV2zsrvlXEv5p6dYHBpB.jpg",
      features: [
        "Separate labs for Physics, Chemistry & Biology",
        "Modern scientific equipment and apparatus",
        "Safety equipment including fire extinguishers, first aid",
        "Capacity for 40 students per lab session",
        "Dedicated lab assistants",
        "Regular practical sessions as per CBSE curriculum"
      ]
    },
    {
      icon: Monitor,
      title: "Computer Labs",
      description: "Two fully air-conditioned computer labs with latest hardware and software, providing digital literacy from primary classes onwards.",
      image: "/uploads/240_F_274385444_M9wwLkwPTAYj8qtmEB5MLLcuA88OQLec.jpg",
      features: [
        "60+ latest computers with high-speed internet",
        "Licensed educational software",
        "Coding and programming facilities",
        "Separate labs for junior and senior students",
        "Smart boards for demonstrations",
        "Regular maintenance and upgrades"
      ]
    },
    {
      icon: Library,
      title: "Library & Reading Room",
      description: "A treasure trove of knowledge with over 15,000 books, journals, and digital resources in a peaceful, inspiring environment.",
      image: library,
      features: [
        "15,000+ books across all subjects",
        "Reference section with encyclopedias",
        "Digital library with e-books access",
        "Separate reading rooms for different age groups",
        "Magazine and newspaper section",
        "Automated book tracking system"
      ]
    },
    {
      icon: Dumbbell,
      title: "Sports Complex",
      description: "Comprehensive sports facilities including playgrounds, indoor games, and professional coaching for various sports.",
      image: "/uploads/DSC_1060.JPG",
      features: [
        "Cricket ground with practice nets",
        "Basketball and volleyball courts",
        "Football and hockey field",
        "400m athletics track",
        "Indoor badminton courts",
        "Table tennis and chess rooms"
      ]
    },
    {
      icon: Palette,
      title: "Art & Craft Studio",
      description: "Creative spaces equipped with all art supplies for students to explore their artistic potential.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      features: [
        "Spacious art studio with natural lighting",
        "All types of art supplies provided",
        "Pottery and sculpture section",
        "Art exhibitions and displays",
        "Craft workshop facilities",
        "Expert art teachers"
      ]
    }
  ];

  const classroomFeatures = [
    { icon: Monitor, title: "Smart Boards", description: "Interactive digital boards in every classroom" },
    { icon: Wifi, title: "Wi-Fi Enabled", description: "High-speed internet connectivity throughout" },
    { icon: Headphones, title: "Audio-Visual", description: "Projectors and sound systems for multimedia learning" },
    { icon: TreePine, title: "Well Ventilated", description: "Large windows with natural light and air" },
    { icon: Users, title: "Optimal Size", description: "30-35 students per class for individual attention" },
    { icon: Shield, title: "Safe Environment", description: "CCTV monitored and secure spaces" },
  ];

  const supportFacilities = [
    {
      category: "Transport",
      icon: Bus,
      items: [
        "Fleet of 15+ school buses covering Jhajjar and surrounding areas",
        "GPS-enabled tracking for parent peace of mind",
        "Trained drivers and female attendants on each bus",
        "Regular maintenance and safety checks",
        "AC and non-AC options available",
        "Door-to-door pickup and drop facility"
      ]
    },
    {
      category: "Medical Room",
      icon: Heart,
      items: [
        "Full-time trained nurse on campus",
        "First-aid facilities and emergency medicines",
        "Regular health check-ups for all students",
        "Tie-up with nearby hospital for emergencies",
        "Vaccination and health awareness programs",
        "Student health records maintained"
      ]
    },
    {
      category: "Security",
      icon: Shield,
      items: [
        "24/7 security personnel at all entry points",
        "CCTV surveillance across campus",
        "Visitor management system with ID verification",
        "Fire safety equipment and drills",
        "Boundary walls and secured gates",
        "Emergency evacuation protocols"
      ]
    }
  ];

  const specialRooms = [
    { icon: Microscope, name: "Biology Lab", desc: "Specimen collection and microscopy" },
    { icon: FlaskConical, name: "Chemistry Lab", desc: "Chemical experiments and analysis" },
    { icon: Laptop, name: "Robotics Lab", desc: "STEM and robotics projects" },
    { icon: Video, name: "AV Room", desc: "Seminars and presentations" },
    { icon: Gamepad2, name: "Activity Room", desc: "Indoor games and recreation" },
    { icon: GraduationCap, name: "Seminar Hall", desc: "300 seat auditorium" },
    { icon: Camera, name: "Photography", desc: "Photography club studio" },
    { icon: Trophy, name: "Trophy Room", desc: "Achievements display" },
  ];

  const infrastructureStats = [
    { value: "5", label: "Acres Campus", icon: Building2 },
    { value: "60+", label: "Classrooms", icon: GraduationCap },
    { value: "6", label: "Laboratories", icon: FlaskConical },
    { value: "15+", label: "School Buses", icon: Bus },
    { value: "15,000+", label: "Library Books", icon: BookOpen },
    { value: "100%", label: "CCTV Coverage", icon: Camera },
  ];

  return (
    <>
      <Helmet>
        <title>Campus Facilities | Indo American School, Jhajjar | Smart Class rooms & Labs</title>
        <meta name="description" content="Explore the world-class facilities at Indo American School, Jhajjar. Our campus includes smart classrooms, advanced science & computer labs, a huge library, and comprehensive sports complex." />
        <meta name="keywords" content="Indo American School facilities, school laboratories, smart classrooms, school library, sports facilities, school transport Jhajjar" />
        <link rel="canonical" href="https://indoamericanschool.edu.in/facilities" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://indoamericanschool.edu.in/facilities" />
        <meta property="og:title" content="Campus Facilities | Indo American School, Jhajjar | Smart Classrooms & Labs" />
        <meta property="og:description" content="Take a tour of our academic facilities, smart classrooms, and support services designed for student excellence." />
        <meta property="og:image" content="https://indoamericanschool.edu.in/indo-logo.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://indoamericanschool.edu.in/facilities" />
        <meta property="twitter:title" content="Campus Facilities | Indo American School, Jhajjar | Smart Classrooms & Labs" />
        <meta property="twitter:description" content="Take a tour of our academic facilities, smart classrooms, and support services designed for student excellence." />
        <meta property="twitter:image" content="https://indoamericanschool.edu.in/indo-logo.png" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "School Facilities",
            "description": "Information about the academic, sports, and support facilities at Indo American School.",
            "publisher": {
              "@type": "EducationalOrganization",
              "name": "Indo American School",
              "logo": "https://indoamericanschool.edu.in/indo-logo.png"
            }
          })}
        </script>
      </Helmet>

      <Layout>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary-dark py-24 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptMi0yaDF2MWgtMXYtMXptLTIgMGgxdjFoLTF2LTF6bTIgMmgxdjFoLTF2LTF6Ii8+PC9nPjwvZz48L3N2Zz48L3N2Zz4=')] opacity-30"></div>

          {/* Breadcrumb */}
          <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10">
            <div className="flex items-center gap-2 text-primary-foreground/80 text-sm">
              <Link to="/" className="flex items-center gap-1 hover:text-secondary transition-colors">
                <Home size={14} />
                <span>Home</span>
              </Link>
              <ChevronRight size={14} />
              <span className="text-primary-foreground font-medium">Facilities</span>
            </div>
          </div>

          <div className="container-custom text-center text-primary-foreground relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-accent text-accent-foreground">World-Class Infrastructure</Badge>
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Our Facilities</h1>
              <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-3xl mx-auto">
                Modern infrastructure designed to provide the best learning environment for every student
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="py-8 bg-accent">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {infrastructureStats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center py-4"
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-2 text-accent-foreground/80" />
                  <p className="text-3xl font-bold text-accent-foreground">{stat.value}</p>
                  <p className="text-sm text-accent-foreground/70">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Facilities */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="section-title">Academic Facilities</h2>
              <p className="section-subtitle mx-auto text-center">State-of-the-art facilities for comprehensive education</p>
            </motion.div>

            <div className="space-y-16">
              {mainFacilities.map((facility, i) => (
                <motion.div
                  key={facility.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`grid lg:grid-cols-2 gap-8 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                >
                  <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className="relative rounded-2xl overflow-hidden shadow-xl">
                      <img
                        src={`${facility.image}?width=800&quality=80&format=webp`}
                        alt={facility.title}
                        loading="lazy"
                        className="w-full h-80 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="absolute bottom-4 left-4">
                        <Badge className="bg-primary text-primary-foreground">{facility.title}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                        <facility.icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-display font-bold">{facility.title}</h3>
                    </div>
                    <p className="text-muted-foreground mb-6">{facility.description}</p>
                    <ul className="space-y-3">
                      {facility.features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Smart Classrooms */}
        <section className="section-padding bg-muted/50">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="section-title">Smart Classrooms</h2>
              <p className="section-subtitle mx-auto text-center">Technology-enabled learning spaces for modern education</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classroomFeatures.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full text-center hover:shadow-lg transition-shadow">
                    <CardContent className="pt-8">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <feature.icon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Special Rooms */}
        <section className="section-padding bg-primary text-primary-foreground">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Specialized Rooms</h2>
              <p className="text-xl text-primary-foreground/80">Purpose-built spaces for specialized learning</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {specialRooms.map((room, i) => (
                <motion.div
                  key={room.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-background/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-background/20 transition-colors"
                >
                  <room.icon className="w-10 h-10 mx-auto mb-3 text-accent" />
                  <h3 className="font-semibold mb-1">{room.name}</h3>
                  <p className="text-sm text-primary-foreground/70">{room.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Support Facilities */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="section-title">Support Services</h2>
              <p className="section-subtitle mx-auto text-center">Ensuring safety, health, and convenience for all students</p>
            </motion.div>

            <Tabs defaultValue="Transport" className="w-full">
              <TabsList className="flex flex-wrap justify-center gap-2 mb-8 bg-transparent h-auto">
                {supportFacilities.map((facility) => (
                  <TabsTrigger
                    key={facility.category}
                    value={facility.category}
                    className="px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full flex items-center gap-2"
                  >
                    <facility.icon className="w-4 h-4" />
                    {facility.category}
                  </TabsTrigger>
                ))}
              </TabsList>
              {supportFacilities.map((facility) => (
                <TabsContent key={facility.category} value={facility.category}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="max-w-3xl mx-auto">
                      <CardHeader className="text-center">
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                          <facility.icon className="w-10 h-10 text-primary" />
                        </div>
                        <CardTitle className="text-2xl">{facility.category} Facility</CardTitle>
                        <CardDescription>Comprehensive {facility.category.toLowerCase()} services for all students</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="grid md:grid-cols-2 gap-4">
                          {facility.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                                <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <span className="text-muted-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Virtual Tour CTA */}
        <section className="py-16 bg-gradient-to-r from-accent to-accent/80">
          <div className="container-custom text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-accent-foreground mb-4">
                Want to See Our Facilities in Person?
              </h2>
              <p className="text-xl text-accent-foreground/80 mb-8 max-w-2xl mx-auto">
                Schedule a campus tour and experience our world-class infrastructure firsthand
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-background text-foreground px-8 py-4 rounded-full font-semibold hover:bg-background/90 transition-colors"
                >
                  Schedule Campus Tour
                </a>
                <a
                  href="/gallery"
                  className="inline-flex items-center gap-2 bg-transparent border-2 border-accent-foreground text-accent-foreground px-8 py-4 rounded-full font-semibold hover:bg-accent-foreground/10 transition-colors"
                >
                  View Photo Gallery
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Facilities;


