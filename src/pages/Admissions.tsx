import Layout from "@/components/layout/Layout";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, FileText, Calendar, GraduationCap, Download, Phone, Mail, Clock, Users, Award, BookOpen, ArrowRight, Home, ChevronRight } from "lucide-react";
import { toast } from "sonner";

// Images will be uploaded through admin panel

const Admissions = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [formData, setFormData] = useState({
    student_name: "",
    parent_name: "",
    email: "",
    phone: "",
    class_applied: "",
    additional_info: "",
  });
  
  const [formErrors, setFormErrors] = useState({
    student_name: "",
    parent_name: "",
    email: "",
    phone: "",
    class_applied: "",
  });

  const validateForm = () => {
    let isValid = true;
    const errors = { ...formErrors };

    if (!formData.student_name.trim() || formData.student_name.trim().length < 2) {
      errors.student_name = "Student name must be at least 2 characters";
      isValid = false;
    } else {
      errors.student_name = "";
    }

    if (!formData.parent_name.trim() || formData.parent_name.trim().length < 2) {
      errors.parent_name = "Parent name must be at least 2 characters";
      isValid = false;
    } else {
      errors.parent_name = "";
    }

    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Valid email is required";
      isValid = false;
    } else {
      errors.email = "";
    }

    if (!formData.phone.trim() || formData.phone.length < 10) {
      errors.phone = "Valid phone number (10+ digits) is required";
      isValid = false;
    } else {
      errors.phone = "";
    }

    if (!formData.class_applied) {
      errors.class_applied = "Please select a class";
      isValid = false;
    } else {
      errors.class_applied = "";
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    const toastId = toast.loading("Submitting your enquiry...");

    try {
      const res = await fetch('/api/admission-enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success("Application Submitted Successfully!", {
          id: toastId,
          description: "Our admissions team will contact you shortly."
        });
        setFormData({ student_name: "", parent_name: "", email: "", phone: "", class_applied: "", additional_info: "" });
      } else {
        const errorData = await res.json();
        const errorMessage = errorData.errors?.[0]?.msg || errorData.message || errorData.error || "Failed to submit application";
        toast.error("Submission Failed", {
          id: toastId,
          description: errorMessage
        });
      }
    } catch (error) {
      toast.error("Network Error", {
        id: toastId,
        description: "Please check your connection and try again."
      });
    }
    setIsSubmitting(false);
  };

  const admissionSteps = [
    { icon: FileText, title: "Fill Application Form", desc: "Complete the online application form with accurate details", step: 1 },
    { icon: Calendar, title: "Entrance Assessment", desc: "Appear for age-appropriate assessment test", step: 2 },
    { icon: Users, title: "Parent Interview", desc: "Interactive session with school management", step: 3 },
    { icon: CheckCircle, title: "Document Verification", desc: "Submit all required documents for verification", step: 4 },
    { icon: GraduationCap, title: "Admission Confirmation", desc: "Pay fees and complete enrollment process", step: 5 },
  ];

  const feeStructure = [
    { class: "Nursery - UKG", admission: "₹25,000", tuition: "₹3,500/month", annual: "₹15,000" },
    { class: "Class I - V", admission: "₹30,000", tuition: "₹4,000/month", annual: "₹18,000" },
    { class: "Class VI - VIII", admission: "₹35,000", tuition: "₹4,500/month", annual: "₹20,000" },
    { class: "Class IX - X", admission: "₹40,000", tuition: "₹5,000/month", annual: "₹22,000" },
    { class: "Class XI - XII", admission: "₹45,000", tuition: "₹5,500/month", annual: "₹25,000" },
  ];

  const requiredDocs = [
    "Birth Certificate (Original & 2 Copies)",
    "Previous School Transfer Certificate",
    "Report Card / Marksheet of Previous Class",
    "Passport Size Photographs (6 copies)",
    "Aadhar Card of Student & Parents",
    "Caste Certificate (if applicable)",
    "Medical Fitness Certificate",
    "Parent ID Proof (Voter ID / Passport)",
  ];

  const whyChoose = [
    { icon: Award, title: "23+ Years Legacy", desc: "Trusted by thousands of families" },
    { icon: Users, title: "Expert Faculty", desc: "200+ qualified teachers" },
    { icon: BookOpen, title: "CBSE Curriculum", desc: "Comprehensive education" },
    { icon: GraduationCap, title: "95% Results", desc: "Consistent academic excellence" },
  ];

  return (
    <>
      <Helmet>
        <title>School Admissions 2026-27 | Indo American School, Jhajjar | Apply Online</title>
        <meta name="description" content="Apply for admissions 2026-27 at Indo American School, Jhajjar. Experience our simple 5-step admission process, view required documents, and submit your enquiry online for Nursery to Class XII." />
        <meta name="keywords" content="school admission Jhajjar, apply online school, school admission process, required documents for admission, school fee structure Jhajjar" />
        <link rel="canonical" href="https://indoamericanschool.edu.in/admissions" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://indoamericanschool.edu.in/admissions" />
        <meta property="og:title" content="School Admissions 2026-27 | Indo American School, Jhajjar" />
        <meta property="og:description" content="Join the Indo American School family. Complete our simple admission process for Nursery to Class XII. Apply online today!" />
        <meta property="og:image" content="https://indoamericanschool.edu.in/indo-logo.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://indoamericanschool.edu.in/admissions" />
        <meta property="twitter:title" content="School Admissions 2026-27 | Indo American School, Jhajjar" />
        <meta property="twitter:description" content="Join the Indo American School family. Complete our simple admission process for Nursery to Class XII. Apply online today!" />
        <meta property="twitter:image" content="https://indoamericanschool.edu.in/indo-logo.png" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Admissions",
            "description": "Information about the admission process and requirements at Indo American School.",
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
        <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img src="/uploads/DSC_1183.JPG" alt="Admissions" loading="lazy" className="w-full h-full object-cover" />
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
              <span className="text-primary-foreground font-medium">Admissions</span>
            </div>
          </div>
          <div className="relative z-10 text-center text-primary-foreground px-4">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm font-semibold mb-4"
            >
              Admissions Open 2026-27
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4"
            >
              Join Indo American School
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto"
            >
              Begin your journey towards excellence in education
            </motion.p>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-12 bg-muted">
          <div className="container-custom">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {whyChoose.map((item, i) => (
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

        {/* Admission Process */}
        <section className="section-padding" ref={ref}>
          <div className="container-custom">
            <div className="text-center mb-12">
              <span className="text-secondary font-semibold text-sm uppercase tracking-wider">How To Apply</span>
              <h2 className="text-2xl md:text-4xl font-display font-bold mt-2">Admission Process</h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-sm md:text-base">
                Our admission process is designed to be simple and transparent. Follow these steps to enroll your child.
              </p>
            </div>

            <div className="relative">
              <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-primary/20 transform -translate-y-1/2" />
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {admissionSteps.map((step, i) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: i * 0.1 }}
                    className="relative bg-card p-6 rounded-2xl shadow-sm border border-border text-center"
                  >
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg relative z-10">
                      {step.step}
                    </div>
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <step.icon className="text-primary" size={28} />
                    </div>
                    <h3 className="font-bold text-sm md:text-base mb-2">{step.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">{step.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Form & Documents */}
        <section className="py-16 bg-muted">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Application Form */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border"
              >
                <h3 className="text-xl md:text-2xl font-display font-bold mb-6">Admission Enquiry Form</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block flex justify-between">
                        <span>Student Name *</span>
                        {formErrors.student_name && <span className="text-destructive text-xs">{formErrors.student_name}</span>}
                      </label>
                      <Input
                        placeholder="Enter student name"
                        value={formData.student_name}
                        className={formErrors.student_name ? "border-destructive focus-visible:ring-destructive" : ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[a-zA-Z\s]*$/.test(value)) {
                            setFormData({ ...formData, student_name: value });
                            if (formErrors.student_name) setFormErrors({ ...formErrors, student_name: "" });
                          }
                        }}
                        
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block flex justify-between">
                        <span>Parent/Guardian Name *</span>
                        {formErrors.parent_name && <span className="text-destructive text-xs">{formErrors.parent_name}</span>}
                      </label>
                      <Input
                        placeholder="Enter parent name"
                        value={formData.parent_name}
                        className={formErrors.parent_name ? "border-destructive focus-visible:ring-destructive" : ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[a-zA-Z\s]*$/.test(value)) {
                            setFormData({ ...formData, parent_name: value });
                            if (formErrors.parent_name) setFormErrors({ ...formErrors, parent_name: "" });
                          }
                        }}
                        
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block flex justify-between">
                        <span>Email Address *</span>
                        {formErrors.email && <span className="text-destructive text-xs">{formErrors.email}</span>}
                      </label>
                      <Input
                        type="email"
                        placeholder="Enter email"
                        value={formData.email}
                        className={formErrors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (formErrors.email) setFormErrors({ ...formErrors, email: "" });
                        }}
                        
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block flex justify-between">
                        <span>Phone Number *</span>
                        {formErrors.phone && <span className="text-destructive text-xs">{formErrors.phone}</span>}
                      </label>
                      <Input
                        type="tel"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        className={formErrors.phone ? "border-destructive focus-visible:ring-destructive" : ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[0-9\s+]*$/.test(value)) {
                            setFormData({ ...formData, phone: value });
                            if (formErrors.phone) setFormErrors({ ...formErrors, phone: "" });
                          }
                        }}
                        
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block flex justify-between">
                      <span>Class Applying For *</span>
                      {formErrors.class_applied && <span className="text-destructive text-xs">{formErrors.class_applied}</span>}
                    </label>
                    <select
                      className={`w-full rounded-lg border bg-background px-3 py-2 ${formErrors.class_applied ? "border-destructive focus-visible:ring-destructive" : "border-input"}`}
                      value={formData.class_applied}
                      onChange={(e) => {
                        setFormData({ ...formData, class_applied: e.target.value });
                        if (formErrors.class_applied) setFormErrors({ ...formErrors, class_applied: "" });
                      }}
                      
                    >
                      <option value="">Select Class</option>
                      {["Nursery", "LKG", "UKG", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI (Science)", "XI (Commerce)", "XI (Arts)", "XII (Science)", "XII (Commerce)", "XII (Arts)"].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Additional Information</label>
                    <Textarea
                      placeholder="Any specific requirements or questions..."
                      rows={4}
                      value={formData.additional_info}
                      onChange={(e) => setFormData({ ...formData, additional_info: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </form>
              </motion.div>

              {/* Required Documents */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border mb-6">
                  <h3 className="text-xl md:text-2xl font-display font-bold mb-6">Required Documents</h3>
                  <ul className="space-y-3">
                    {requiredDocs.map((doc, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="text-secondary shrink-0 mt-0.5" size={18} />
                        <span className="text-sm md:text-base">{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-primary text-primary-foreground rounded-2xl p-6 md:p-8">
                  <h3 className="text-xl font-display font-bold mb-4">Need Help?</h3>
                  <p className="text-primary-foreground/90 text-sm mb-4">
                    Our admission team is here to assist you with any queries.
                  </p>
                  <div className="space-y-3">
                    <a href="tel:+919813288030" className="flex items-center gap-3 text-sm hover:text-secondary transition-colors">
                      <Phone size={18} /> +91 98132 88030
                    </a>
                    <a href="mailto:american.indo2@gmail.com" className="flex items-center gap-3 text-sm hover:text-secondary transition-colors">
                      <Mail size={18} /> american.indo2@gmail.com
                    </a>
                    <div className="flex items-center gap-3 text-sm">
                      <Clock size={18} /> Mon - Sat: 8:00 AM - 4:00 PM
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Fee Structure - Commented out for now */}
        {/*
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Transparent Pricing</span>
            <h2 className="text-2xl md:text-4xl font-display font-bold mt-2">Fee Structure 2026-27</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-card rounded-2xl overflow-hidden shadow-sm border border-border">
              <thead className="bg-primary text-primary-foreground">
                <tr>
                  <th className="text-left p-4 font-semibold text-sm md:text-base">Class</th>
                  <th className="text-left p-4 font-semibold text-sm md:text-base">Admission Fee</th>
                  <th className="text-left p-4 font-semibold text-sm md:text-base">Tuition Fee</th>
                  <th className="text-left p-4 font-semibold text-sm md:text-base">Annual Charges</th>
                </tr>
              </thead>
              <tbody>
                {feeStructure.map((fee, i) => (
                  <tr key={fee.class} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                    <td className="p-4 font-medium text-sm md:text-base">{fee.class}</td>
                    <td className="p-4 text-sm md:text-base">{fee.admission}</td>
                    <td className="p-4 text-sm md:text-base">{fee.tuition}</td>
                    <td className="p-4 text-sm md:text-base">{fee.annual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-muted-foreground text-sm mt-4 text-center">
            * Fee structure is subject to revision. Transport and other optional fees are additional.
          </p>
        </div>
      </section>
      */}

        {/* CTA */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container-custom text-center">
            <h2 className="text-2xl md:text-4xl font-display font-bold mb-4">Ready to Join Our Family?</h2>
            <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto text-sm md:text-base">
              Take the first step towards a bright future for your child. Our admission team is ready to assist you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link to="/facilities">
                  <Users size={18} className="mr-2" /> View Our Facilities
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link to="/contact">
                  <Phone size={18} className="mr-2" /> Schedule a Visit
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Admissions;


