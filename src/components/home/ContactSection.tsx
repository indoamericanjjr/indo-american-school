import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useCallback, useMemo, memo } from "react";
import { Send, MapPin, Phone, Mail, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";


const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    student_name: "",
    class_interested: "",
    subject: "",
    message: ""
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: ""
  });

  const validateForm = () => {
    let isValid = true;
    const errors = { ...formErrors };

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
      isValid = false;
    } else {
      errors.name = "";
    }

    if (!formData.phone.trim() || formData.phone.length < 10) {
      errors.phone = "Valid phone number (10+ digits) required";
      isValid = false;
    } else {
      errors.phone = "";
    }

    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Valid email is required";
      isValid = false;
    } else {
      errors.email = "";
    }

    if (!formData.subject) {
      errors.subject = "Please select a subject";
      isValid = false;
    } else {
      errors.subject = "";
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters";
      isValid = false;
    } else {
      errors.message = "";
    }

    setFormErrors(errors);
    return isValid;
  };

  const contactItems = useMemo(() => [
    {
      icon: MapPin,
      title: "Visit Us",
      content: "Indo American School, Agrasen Chowk, Jhajjar, Haryana - 124103",
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+91 9813288030",
    },
    {
      icon: Mail,
      title: "Email Us",
      content: "american.indo2@gmail.com",
    },
    {
      icon: Clock,
      title: "Office Hours",
      content: "Monday - Saturday: 9:00 AM - 4:00 PM",
    },
  ], []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    // Keep using formData state instead of FormData object for consistency and easy resets
    const data = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      student_name: formData.student_name,
      class_interested: formData.class_interested,
      subject: formData.subject,
      message: formData.message,
    };

    try {
      const res = await fetch('/api/contact-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast({
          title: "Message Sent!",
          description: "Thank you for contacting us. We will get back to you soon.",
        });
        setFormData({
            name: "",
            phone: "",
            email: "",
            student_name: "",
            class_interested: "",
            subject: "",
            message: ""
        });
        setFormErrors({
            name: "",
            phone: "",
            email: "",
            subject: "",
            message: ""
        });
      } else {
        const errorData = await res.json();
        const errorMessage = errorData.errors?.[0]?.msg || errorData.message || errorData.error || "Failed to send message";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <span className="text-secondary font-semibold text-xs sm:text-sm uppercase tracking-wider bg-secondary/10 px-3 py-1 rounded-full">Get in Touch</span>
            <h2 className="section-title mt-4 text-3xl sm:text-4xl md:text-5xl">We Would Love to <span className="text-gradient block sm:inline mt-1 sm:mt-0">Hear From You</span></h2>
            <p className="text-muted-foreground mb-8 text-sm sm:text-base leading-relaxed max-w-lg mx-auto lg:mx-0">
              Have questions about admissions, academics, or anything else? 
              Reach out to us and our team will get back to you promptly.
            </p>

            <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-10 text-left">
              {contactItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex gap-3 sm:gap-4 items-start sm:items-center bg-card sm:bg-transparent p-4 sm:p-0 rounded-2xl sm:rounded-none border border-slate-100 dark:border-slate-800 sm:border-transparent shadow-sm sm:shadow-none"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                    <item.icon className="text-primary w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm sm:text-base">{item.title}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-snug">{item.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden h-56 sm:h-64 bg-muted shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d877.3!2d76.6657895!3d28.6069319!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d705d0aaa6f51%3A0x6dab0682621cd15e!2sIndo%20American%20School!5e0!3m2!1sen!2sin!4v1723000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="School Location"
              />
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mt-6 lg:mt-0"
          >
            <div className="bg-card rounded-2xl md:rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-xl border border-border/50">
              <h3 className="text-xl md:text-2xl font-display font-bold text-foreground mb-2">Send Us a Message</h3>
              <p className="text-sm text-muted-foreground mb-6 md:mb-8">Fill the form below and we will respond shortly.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-medium text-foreground mb-2 flex justify-between">
                        <span>Parent/Guardian Name *</span>
                        {formErrors.name && <span className="text-destructive text-xs">{formErrors.name}</span>}
                    </label>
                    <Input id="contact-name" name="name" autoComplete="name" placeholder="Enter your name" value={formData.name} className={formErrors.name ? "border-destructive focus-visible:ring-destructive" : ""} onChange={(e) => {
                      const value = e.target.value;
                      if (/^[a-zA-Z\s]*$/.test(value)) {
                        setFormData({ ...formData, name: value });
                        if (formErrors.name) setFormErrors({ ...formErrors, name: "" });
                      }
                    }} />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="block text-sm font-medium text-foreground mb-2 flex justify-between">
                        <span>Phone Number *</span>
                        {formErrors.phone && <span className="text-destructive text-xs">{formErrors.phone}</span>}
                    </label>
                    <Input id="contact-phone" name="phone" type="tel" autoComplete="tel" placeholder="+91 XXXXX XXXXX" value={formData.phone} className={formErrors.phone ? "border-destructive focus-visible:ring-destructive" : ""} onChange={(e) => {
                      const value = e.target.value;
                      if (/^[0-9\s+]*$/.test(value)) {
                         setFormData({ ...formData, phone: value });
                         if (formErrors.phone) setFormErrors({ ...formErrors, phone: "" });
                      }
                    }} />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-foreground mb-2 flex justify-between">
                      <span>Email Address *</span>
                      {formErrors.email && <span className="text-destructive text-xs">{formErrors.email}</span>}
                  </label>
                  <Input id="contact-email" name="email" type="email" autoComplete="email" placeholder="Enter your email" value={formData.email} className={formErrors.email ? "border-destructive focus-visible:ring-destructive" : ""} onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (formErrors.email) setFormErrors({ ...formErrors, email: "" });
                  }} />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="student-name" className="block text-sm font-medium text-foreground mb-2">Student Name</label>
                    <Input id="student-name" name="student_name" autoComplete="name" placeholder="Enter student name" value={formData.student_name} onChange={(e) => {
                      const value = e.target.value;
                      if (/^[a-zA-Z\s]*$/.test(value)) {
                         setFormData({ ...formData, student_name: value });
                      }
                    }} />
                  </div>
                  <div>
                    <label htmlFor="class-interested" className="block text-sm font-medium text-foreground mb-2">Class Interested In</label>
                    <select id="class-interested" name="class_interested" value={formData.class_interested} onChange={(e) => setFormData({ ...formData, class_interested: e.target.value })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                      <option value="">Select Class</option>
                      <option value="nursery">Nursery</option>
                      <option value="lkg">LKG</option>
                      <option value="ukg">UKG</option>
                      <option value="1">Class I</option>
                      <option value="2">Class II</option>
                      <option value="3">Class III</option>
                      <option value="4">Class IV</option>
                      <option value="5">Class V</option>
                      <option value="6">Class VI</option>
                      <option value="7">Class VII</option>
                      <option value="8">Class VIII</option>
                      <option value="9">Class IX</option>
                      <option value="10">Class X</option>
                      <option value="11">Class XI</option>
                      <option value="12">Class XII</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2 flex justify-between">
                    <span>Subject *</span>
                    {formErrors.subject && <span className="text-destructive text-xs">{formErrors.subject}</span>}
                  </label>
                  <select id="subject" name="subject" value={formData.subject} onChange={(e) => {
                      setFormData({ ...formData, subject: e.target.value });
                      if (formErrors.subject) setFormErrors({ ...formErrors, subject: "" });
                  }} className={`w-full rounded-lg border bg-background px-3 py-2 text-sm ${formErrors.subject ? "border-destructive focus-visible:ring-destructive" : "border-input"}`}>
                    <option value="">Select Subject</option>
                    <option value="admission">Admission Enquiry</option>
                    <option value="book-visit">Book Visit</option>
                    <option value="fee">Fee Structure</option>
                    <option value="transport">Transport Facility</option>
                    <option value="academics">Academics</option>
                    <option value="complaint">Complaint</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2 flex justify-between">
                    <span>Message *</span>
                    {formErrors.message && <span className="text-destructive text-xs">{formErrors.message}</span>}
                  </label>
                  <Textarea id="message" name="message" placeholder="Type your message here..." rows={4} value={formData.message} className={formErrors.message ? "border-destructive focus-visible:ring-destructive" : ""} onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (formErrors.message) setFormErrors({ ...formErrors, message: "" });
                  }} />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⏳</span> Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send size={18} /> Send Message
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default memo(ContactSection);


