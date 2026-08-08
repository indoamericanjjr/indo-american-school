import Layout from "@/components/layout/Layout";
import { Helmet } from "react-helmet-async";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect } from "react";
import {
  BookOpen, GraduationCap, Award, Users, Clock, Calendar,
  Beaker, Calculator, Globe, Palette, Music, Code,
  Trophy, Medal, Star, Target, CheckCircle, ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const Academics = () => {
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 800], [0, 200]);

  const curriculumLevels = [
    {
      level: "Pre-Primary",
      grades: "Nursery - KG",
      age: "3-5 years",
      description: "Foundation years focusing on play-based learning, motor skills development, and early literacy.",
      subjects: ["English Rhymes", "Number Games", "Art & Craft", "Physical Play", "Story Time", "Music & Dance"],
      highlights: ["Montessori Methods", "Smart Classrooms", "Individual Attention", "Activity-Based Learning"]
    },
    {
      level: "Primary",
      grades: "I - V",
      age: "6-10 years",
      description: "Building strong fundamentals in core subjects with emphasis on conceptual understanding.",
      subjects: ["English", "Hindi", "Mathematics", "EVS", "Computer Science", "General Knowledge", "Art", "Physical Education"],
      highlights: ["CBSE Curriculum", "Project-Based Learning", "Regular Assessments", "Personality Development"]
    },
    {
      level: "Middle School",
      grades: "VI - VIII",
      age: "11-13 years",
      description: "Expanding knowledge horizons with specialized subject teaching and skill development.",
      subjects: ["English", "Hindi", "Sanskrit", "Mathematics", "Science", "Social Science", "Computer", "Art/Music"],
      highlights: ["Subject Specialists", "Lab Practicals", "Sports Training", "Value Education"]
    },
    {
      level: "Secondary",
      grades: "IX - X",
      age: "14-15 years",
      description: "Board examination preparation with comprehensive coverage and exam strategies.",
      subjects: ["English", "Hindi", "Mathematics", "Science", "Social Science", "IT/Computer"],
      highlights: ["Board Exam Focus", "Career Counseling", "Competitive Exam Prep", "Remedial Classes"]
    },
    {
      level: "Senior Secondary",
      grades: "XI - XII",
      age: "16-17 years",
      description: "Specialized streams with focus on higher education and career preparation.",
      subjects: ["Science Stream: Physics, Chemistry, Biology/Maths", "Commerce Stream: Accounts, Business Studies, Economics", "Humanities: History, Political Science, Geography"],
      highlights: ["Stream Selection", "JEE/NEET Coaching", "Practical Labs", "University Guidance"]
    }
  ];

  const specialPrograms = [
    {
      icon: Beaker,
      title: "Science Excellence Program",
      description: "Advanced science curriculum with hands-on experiments, research projects, and participation in science olympiads and exhibitions.",
      features: ["Weekly Lab Sessions", "Science Club", "Olympiad Training", "Science Fair Participation"]
    },
    {
      icon: Calculator,
      title: "Mathematics Enrichment",
      description: "Strengthening mathematical thinking through problem-solving workshops, mental math training, and competitive mathematics.",
      features: ["Vedic Mathematics", "Math Olympiad Prep", "Problem Solving Club", "Mental Math Training"]
    },
    {
      icon: Globe,
      title: "Language & Communication",
      description: "Comprehensive language program including English proficiency, Hindi literature, and introduction to foreign languages.",
      features: ["English Speaking Club", "Debate & Elocution", "Creative Writing", "Foreign Language Basics"]
    },
    {
      icon: Code,
      title: "Digital Literacy & Coding",
      description: "Future-ready computer education with coding, robotics, and digital skills development from early grades.",
      features: ["Scratch Programming", "Python Basics", "Web Development", "Robotics Club"]
    },
    {
      icon: Palette,
      title: "Arts & Creative Expression",
      description: "Nurturing creativity through visual arts, performing arts, and craft activities integrated with academics.",
      features: ["Drawing & Painting", "Clay Modeling", "Craft Work", "Art Exhibitions"]
    }
  ];

  const achievements = [
    { year: "2024", title: "CBSE Board Toppers", description: "15 students scored above 95% in Class XII", icon: Trophy },
    { year: "2024", title: "Science Olympiad", description: "Gold medals in State Level Science Olympiad", icon: Medal },
    { year: "2023", title: "Sports Excellence", description: "District Champions in Cricket & Basketball", icon: Award },
    { year: "2023", title: "Cultural Awards", description: "Best School Trophy at Inter-School Cultural Fest", icon: Star },
    { year: "2023", title: "100% Pass Rate", description: "All students cleared Class X Board Exams", icon: CheckCircle },
    { year: "2022", title: "Best CBSE School", description: "Awarded Best CBSE School in Jhajjar District", icon: Trophy },
  ];

  const facultyDepartments = [
    { name: "Science Department", teachers: 12, head: "Dr. Ramesh Kumar", subjects: "Physics, Chemistry, Biology" },
    { name: "Mathematics Department", teachers: 8, head: "Mrs. Sunita Sharma", subjects: "Mathematics, Statistics" },
    { name: "Languages Department", teachers: 10, head: "Mr. Anil Verma", subjects: "English, Hindi, Sanskrit" },
    { name: "Social Sciences", teachers: 6, head: "Dr. Meena Gupta", subjects: "History, Geography, Civics, Economics" },
    { name: "Computer Science", teachers: 4, head: "Mr. Vikash Singh", subjects: "Computer Science, IT" },
    { name: "Arts & Music", teachers: 5, head: "Mrs. Kavita Rani", subjects: "Art, Music, Dance" },
    { name: "Physical Education", teachers: 4, head: "Mr. Suresh Yadav", subjects: "Sports, Yoga, Fitness" },
  ];

  const dailySchedule = [
    { time: "7:30 AM - 7:45 AM", activity: "Prayer", description: "Morning prayers and meditation" },
    { time: "7:45 AM - 12:00 PM", activity: "Lecture 1-4", description: "Core academic subjects" },
    { time: "12:00 PM - 1:00 PM", activity: "Lunch Break", description: "Lunch and recreation" },
    { time: "1:00 PM - 3:30 PM", activity: "Lecture 5-8", description: "Academic sessions continue" },
    { time: "3:30 PM - 3:45 PM", activity: "Holiday", description: "Short break and preparation for dispersal" },
    { time: "3:45 PM - 4:00 PM", activity: "Dispersal", description: "School buses depart" },
  ];

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



  return (
    <Layout>
      <Helmet>
        <title>Academic Programs CBSE Curriculum | Indo American School, Jhajjar</title>
        <meta name="description" content="Explore Indo American School's comprehensive CBSE curriculum from Nursery to Class XII. Special academic programs, experienced faculty, and modern teaching methodologies for holistic education." />
        <meta name="keywords" content="CBSE curriculum, school academics, educational programs, CBSE school Jhajjar, academic excellence, teaching methodology" />
        <link rel="canonical" href="https://indoamericanschool.edu.in/academics" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://indoamericanschool.edu.in/academics" />
        <meta property="og:title" content="Academic Programs CBSE Curriculum | Indo American School, Jhajjar" />
        <meta property="og:description" content="Comprehensive CBSE curriculum from Nursery to Class XII with special programs and modern teaching methodologies." />
        <meta property="og:image" content="https://indoamericanschool.edu.in/uploads/indo-logo.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://indoamericanschool.edu.in/academics" />
        <meta property="twitter:title" content="Academic Programs CBSE Curriculum | Indo American School, Jhajjar" />
        <meta property="twitter:description" content="Comprehensive CBSE curriculum from Nursery to Class XII with special programs and modern teaching methodologies." />
        <meta property="twitter:image" content="https://indoamericanschool.edu.in/uploads/indo-logo.png" />

        {/* Additional SEO */}
        <meta name="author" content="Indo American School" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="IN-HR" />
        <meta name="geo.placename" content="Jhajjar" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "Indo American School",
            "description": "CBSE affiliated school offering comprehensive academic programs",
            "url": "https://indoamericanschool.edu.in/academics",
            "logo": "https://indoamericanschool.edu.in/uploads/indo-logo.png",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Agrasen Chowk",
              "addressLocality": "Jhajjar",
              "addressRegion": "Haryana",
              "postalCode": "124103",
              "addressCountry": "IN"
            },
            "educationalCredentialAwarded": "CBSE Class X and XII Certificates",
            "hasEducationalUse": "Primary Education, Secondary Education, Senior Secondary Education",
            "teaches": [
              "Mathematics", "Science", "English", "Hindi", "Social Science",
              "Computer Science", "Physical Education", "Arts", "Music"
            ]
          })}
        </script>
      </Helmet>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary-dark py-24 overflow-hidden border-b-[8px] border-secondary/20 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] z-10">
        <motion.div 
          className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptMi0yaDF2MWgtMXYtMXptLTIgMGgxdjFoLTF2LTF6bTIgMmgxdjFoLTF2LTF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"
          style={{ y: yParallax }}
        />
        <div className="container-custom text-center text-primary-foreground relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-accent text-accent-foreground">CBSE Affiliated</Badge>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Academic Excellence</h1>
            <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-3xl mx-auto">
              Nurturing minds, building futures through comprehensive education from Pre-Primary to Senior Secondary
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-10 flex flex-wrap justify-center gap-6"
          >
            {[
              { icon: BookOpen, label: "CBSE Curriculum", value: "Classes I-XII" },
              { icon: Users, label: "Expert Faculty", value: "50+ Teachers" },
              { icon: Trophy, label: "Board Results", value: "100% Pass Rate" },
            ].map((stat, i) => (
              <div key={i} className="bg-background/10 backdrop-blur-sm rounded-xl px-6 py-4 text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-accent" />
                <p className="text-sm text-primary-foreground/70">{stat.label}</p>
                <p className="font-bold text-lg">{stat.value}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Curriculum Levels */}
      <section id="curriculum-structure" className="section-padding bg-background">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Our Curriculum Structure</h2>
            <p className="section-subtitle mx-auto text-center">Comprehensive education pathway from early years to higher secondary</p>
          </motion.div>

          <Tabs defaultValue="Pre-Primary" className="w-full">
            <TabsList className="flex flex-wrap justify-center gap-2 mb-8 bg-transparent h-auto">
              {curriculumLevels.map((level) => (
                <TabsTrigger 
                  key={level.level} 
                  value={level.level}
                  className="px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full"
                >
                  {level.level}
                </TabsTrigger>
              ))}
            </TabsList>
            {curriculumLevels.map((level) => (
              <TabsContent key={level.level} value={level.level}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid lg:grid-cols-3 gap-8"
                >
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <GraduationCap className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl">{level.level} ({level.grades})</CardTitle>
                          <p className="text-muted-foreground">Age Group: {level.age}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-6">{level.description}</p>
                      <h4 className="font-semibold mb-3">Subjects Offered:</h4>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {level.subjects.map((subject, i) => (
                          <Badge key={i} variant="secondary">{subject}</Badge>
                        ))}
                      </div>
                      <h4 className="font-semibold mb-3">Key Highlights:</h4>
                      <ul className="grid sm:grid-cols-2 gap-2">
                        {level.highlights.map((highlight, i) => (
                          <li key={i} className="flex items-center gap-2 text-muted-foreground">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-accent/10 to-accent/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-accent" />
                        Learning Outcomes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-primary font-bold text-sm">1</span>
                          </div>
                          <p className="text-sm text-muted-foreground">Strong foundation in core subjects</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-primary font-bold text-sm">2</span>
                          </div>
                          <p className="text-sm text-muted-foreground">Development of critical thinking skills</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-primary font-bold text-sm">3</span>
                          </div>
                          <p className="text-sm text-muted-foreground">Holistic personality development</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-primary font-bold text-sm">4</span>
                          </div>
                          <p className="text-sm text-muted-foreground">Preparation for next academic level</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Special Programs */}
      <section id="special-programs" className="section-padding bg-muted/50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Special Academic Programs</h2>
            <p className="section-subtitle mx-auto text-center">Beyond regular curriculum - enrichment programs for holistic development</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialPrograms.map((program, i) => (
              <motion.div
                key={program.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow group">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <program.icon className="w-7 h-7 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{program.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{program.description}</p>
                    <ul className="space-y-2">
                      {program.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm">
                          <ArrowRight className="w-4 h-4 text-accent" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section id="academic-achievements" className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Our Academic Achievements</h2>
            <p className="text-xl text-primary-foreground/80">Celebrating excellence and success of our students</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-background/10 backdrop-blur-sm rounded-2xl p-6 border border-primary-foreground/10"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shrink-0">
                    <achievement.icon className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <Badge variant="secondary" className="mb-2">{achievement.year}</Badge>
                    <h3 className="font-bold text-lg mb-1">{achievement.title}</h3>
                    <p className="text-primary-foreground/70 text-sm">{achievement.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty - Commented out for now */}
      {/*
      <section className="section-padding bg-background">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Our Expert Faculty</h2>
            <p className="section-subtitle mx-auto text-center">Dedicated educators committed to student success</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {facultyDepartments.map((dept, i) => (
              <motion.div
                key={dept.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{dept.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{dept.teachers} Teachers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-muted-foreground" />
                      <span>Head: {dept.head}</span>
                    </div>
                    <p className="text-muted-foreground pt-2 border-t">{dept.subjects}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* Daily Schedule */}
      <section id="daily-schedule" className="section-padding bg-muted/50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Daily School Schedule</h2>
            <p className="section-subtitle mx-auto text-center">A balanced day of learning and activities</p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/20"></div>
              {dailySchedule.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative flex items-start gap-6 pb-8 last:pb-0"
                >
                  <div className="relative z-10 w-16 h-16 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg">
                    <Clock className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="bg-card rounded-xl p-5 shadow-sm border border-border flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge>{item.time}</Badge>
                      <h3 className="font-semibold">{item.activity}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-accent to-accent/80">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-accent-foreground mb-4">
              Ready to Join Our Academic Journey?
            </h2>
            <p className="text-xl text-accent-foreground/80 mb-8 max-w-2xl mx-auto">
              Give your child the gift of quality education at Indo American School
            </p>
            <a 
              href="/admissions" 
              className="inline-flex items-center gap-2 bg-background text-foreground px-8 py-4 rounded-full font-semibold hover:bg-background/90 transition-colors"
            >
              Apply for Admission
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>


    </Layout>
  );
};

export default Academics;


