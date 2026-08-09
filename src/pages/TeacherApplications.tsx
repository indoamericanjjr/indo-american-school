import Layout from "@/components/layout/Layout";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, FileText, Users, Award, BookOpen, Upload, ArrowRight, GraduationCap, Home, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TeacherApplications = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    post: "",
    subject: "",
  });

  const [resume, setResume] = useState<File | null>(null);

  const postSubjects: Record<string, string[]> = {
    PGT: ["Physics", "Chemistry", "Mathematics", "Biology", "English", "Computer Science", "Accountancy"],
    TGT: ["Math", "Science", "Social Science", "English", "Hindi", "Sanskrit", "Physical Education"],
    PRT: ["General English", "General Maths", "EVS", "Hindi", "Art", "Music"],
    Librarian: ["Library Management"],
    Counselor: ["Career Counseling", "Student Counseling"]
  };

  const availableSubjects = formData.post ? postSubjects[formData.post] || [] : [];


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('post', formData.post);
      formDataToSend.append('subject', formData.subject);
      if (resume) {
        formDataToSend.append('resume', resume);
      }

      const res = await fetch('/api/teacher-applications', {
        method: 'POST',
        body: formDataToSend,
      });

      if (res.ok) {
        toast({ title: "Application Submitted!", description: "We will review your application and contact you soon." });
        setFormData({ name: "", email: "", phone: "", post: "", subject: "" });
        setResume(null);
      } else {
        const errorData = await res.json();
        const errorMessage = errorData.errors?.[0]?.msg || errorData.message || errorData.error || "Failed to submit application";
        toast({ title: "Error", description: errorMessage, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Network error", variant: "destructive" });
    }
    setIsSubmitting(false);
  };

  const whyTeachHere = [
    { icon: Award, title: "Excellent Reputation", desc: "23+ years of academic excellence" },
    { icon: Users, title: "Supportive Environment", desc: "Collaborative teaching community" },
    { icon: BookOpen, title: "Professional Development", desc: "Continuous learning opportunities" },
    { icon: CheckCircle, title: "Competitive Compensation", desc: "Attractive salary packages" },
  ];

  return (
    <>
      <Helmet>
        <title>Current Openings & Teacher Recruitment | Indo American School Jhajjar</title>
        <meta name="description" content="Explore Current Openings for PGT, TGT, PRT teachers, librarian & staff at Indo American School Jhajjar. Apply online with your resume for school teacher job vacancies in Jhajjar, Haryana." />
        <meta name="keywords" content="Current Openings Indo American School, teacher vacancies Jhajjar, school teacher jobs Jhajjar, PGT TGT PRT job Jhajjar, teaching jobs Jhajjar Haryana, school recruitment Jhajjar" />
        <link rel="canonical" href="https://indoamericanjjr.com/teacher-applications" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://indoamericanjjr.com/teacher-applications" />
        <meta property="og:site_name" content="Indo American School Jhajjar" />
        <meta property="og:title" content="Current Openings & Teacher Recruitment | Indo American School Jhajjar" />
        <meta property="og:description" content="Apply online for teaching positions (PGT, TGT, PRT) at Indo American School Jhajjar. Join our team of dedicated educators." />
        <meta property="og:image" content="https://indoamericanjjr.com/professional_enhanced_school_result.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://indoamericanjjr.com/teacher-applications" />
        <meta property="twitter:title" content="Current Openings & Teacher Recruitment | Indo American School Jhajjar" />
        <meta property="twitter:description" content="Apply online for teaching positions at Indo American School Jhajjar." />
        <meta property="twitter:image" content="https://indoamericanjjr.com/professional_enhanced_school_result.png" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebPage",
                "name": "Current Openings - Teacher Recruitment Indo American School Jhajjar",
                "url": "https://indoamericanjjr.com/teacher-applications",
                "description": "Current teacher job openings and online application portal for Indo American School Jhajjar.",
                "publisher": {
                  "@type": "School",
                  "name": "Indo American School Jhajjar",
                  "logo": "https://indoamericanjjr.com/indo-logo.png"
                }
              },
              {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://indoamericanjjr.com/" },
                  { "@type": "ListItem", "position": 2, "name": "Current Openings", "item": "https://indoamericanjjr.com/teacher-applications" }
                ]
              }
            ]
          })}
        </script>
      </Helmet>
      <Layout>
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] flex flex-col justify-center overflow-hidden bg-gradient-to-br from-accent via-accent/90 to-accent-dark">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptMi0yaDF2MWgtMXYtMXptLTIgMGgxdjFoLTF2LTF6bTIgMmgxdjFoLTF2LTF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>

        {/* Breadcrumb */}
        <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10">
          <div className="flex items-center gap-2 text-primary-foreground/80 text-sm">
            <Link to="/" className="flex items-center gap-1 hover:text-secondary transition-colors">
              <Home size={14} />
              <span>Home</span>
            </Link>
            <ChevronRight size={14} />
            <span className="text-primary-foreground font-medium">Teacher Applications</span>
          </div>
        </div>

        <div className="container-custom relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-semibold mb-6">
              <Users size={16} />
              Join Our Faculty
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-accent-foreground">
              Inspire the Next Generation
            </h1>
            <p className="text-lg md:text-xl text-accent-foreground/80 max-w-3xl mx-auto mb-8">
              Join our team of dedicated educators and make a lasting impact on young minds at Indo American School
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-4 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full">
                <Award className="text-primary" size={20} />
                <span className="text-accent-foreground font-semibold">23+ Years Legacy</span>
              </div>
              <div className="flex items-center gap-4 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full">
                <GraduationCap className="text-primary" size={20} />
                <span className="text-accent-foreground font-semibold">200+ Faculty Members</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Teach Here */}
      <section className="py-12 bg-muted">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {whyTeachHere.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card p-4 md:p-6 rounded-2xl shadow-sm border border-border text-center"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <item.icon className="text-primary" size={24} />
                </div>
                <h3 className="font-bold text-sm md:text-base">{item.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps to Become Our Faculty */}
      <section className="py-12">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Joining Process</span>
            <h2 className="text-2xl md:text-4xl font-display font-bold mt-2">Steps to Become Our Faculty</h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-sm md:text-base">
              Follow these steps to join our esteemed teaching faculty and contribute to our legacy of excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 overflow-x-hidden">
            {[
              { step: "01", title: "Submit Application", desc: "Complete the application form with your details, qualifications, and resume." },
              { step: "02", title: "Initial Review", desc: "Our HR team reviews your application and qualifications." },
              { step: "03", title: "Phone Interview", desc: "Initial screening call to discuss your background and interest." },
              { step: "04", title: "Demo Class", desc: "Present a sample lesson to demonstrate your teaching skills." },
              { step: "05", title: "Final Decision", desc: "Receive offer letter and join our faculty team." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center relative"
              >
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  {item.step}
                </div>
                <div className="absolute top-8 left-1/2 w-full h-0.5 bg-border -z-10 hidden lg:block" style={{ transform: 'translateX(50%)', maxWidth: 'calc(100vw - 2rem)' }}></div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
                {i < 4 && (
                  <div className="hidden lg:block absolute top-8 right-0 w-8 h-0.5 bg-primary -z-10" style={{ transform: 'translateX(100%)', right: '0' }}></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="section-padding">
          <div className="container-custom max-w-6xl mx-auto overflow-x-hidden">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Start Your Journey</span>
            <h2 className="text-2xl md:text-4xl font-display font-bold mt-2">Join Our Teaching Faculty</h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-sm md:text-base">
              Share your passion for education and help shape the future of our students.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border"
            >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-1 block">Full Name *</label>
                <Input
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[a-zA-Z\s]*$/.test(value)) {
                      setFormData({ ...formData, name: value });
                    }
                  }}
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Email Address *</label>
                  <Input
                    type="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Phone Number *</label>
                  <Input
                    type="tel"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[0-9\s+]*$/.test(value)) {
                        setFormData({ ...formData, phone: value });
                      }
                    }}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Post Applying For *</label>
                <select
                  className="w-full rounded-lg border border-input bg-background px-3 py-2"
                  value={formData.post}
                  onChange={(e) => {
                    setFormData({ ...formData, post: e.target.value, subject: "" });
                  }}
                  required
                >
                  <option value="">Select Post</option>
                  <option value="PGT">PGT</option>
                  <option value="TGT">TGT</option>
                  <option value="PRT">PRT</option>
                  <option value="Librarian">Librarian</option>
                  <option value="Counselor">Counselor</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Subject Applying For *</label>
                <select
                  className="w-full rounded-lg border border-input bg-background px-3 py-2"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  disabled={!formData.post}
                >
                  <option value="">{formData.post ? "Select Subject" : "Select post first"}</option>
                  {availableSubjects.map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Resume/CV (PDF only) *</label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setResume(e.target.files?.[0] || null)}
                    className="hidden"
                    id="resume-upload"
                    required
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <Upload className="mx-auto mb-2 text-muted-foreground" size={24} />
                    <p className="text-sm text-muted-foreground">
                      {resume ? resume.name : "Click to upload your resume"}
                    </p>
                  </label>
                </div>
                {resume && (
                  <p className="text-xs text-muted-foreground mt-2">
                    File selected: {resume.name}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Application"}
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </form>
          </motion.div>

          {/* Info Cards */}
          <div className="space-y-6">
            <div className="bg-accent/50 rounded-xl p-6 border border-accent">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FileText className="text-primary" size={20} />
                What We Need
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Teaching qualifications</li>
                <li>• Subject expertise</li>
                <li>• Passion for education</li>
                <li>• Communication skills</li>
              </ul>
            </div>

            <div className="bg-primary text-primary-foreground rounded-xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="text-primary-foreground" size={20} />
                Application Tips
              </h3>
              <ul className="space-y-2 text-sm text-primary-foreground/90">
                <li>• Be specific about experience</li>
                <li>• Highlight achievements</li>
                <li>• Include relevant certifications</li>
                <li>• Attach detailed resume</li>
              </ul>
            </div>
          </div>
          </div>
        </div>
      </section>
    </Layout>
    </>
  );
};

export default TeacherApplications;

