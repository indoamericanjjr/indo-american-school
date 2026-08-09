import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube, ArrowUp, Heart } from "lucide-react";
import logo from "@/assets/indo-logo.jpg";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gradient-to-b from-school-navy via-school-navy to-foreground text-primary-foreground relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
      <div className="absolute top-20 -right-32 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-32 w-80 h-80 bg-secondary/3 rounded-full blur-3xl" />

      {/* Main Footer Content */}
      <div className="container-custom pt-16 md:pt-20 lg:pt-24 pb-0 relative">
        {/* Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-14 mb-12 md:mb-16">
          {/* About Section */}
          <div className="flex flex-col space-y-5">
            <div className="flex items-start gap-4 md:gap-3">
              <img
                src={logo}
                alt="Indo American School Logo"
                loading="lazy"
                className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 object-contain"
              />
              <div className="flex-1 pt-1">
                <h3 className="font-display text-lg md:text-xl font-bold leading-tight whitespace-nowrap">Indo American School</h3>
                <p className="text-xs md:text-sm text-primary-foreground/60 mt-1">Excellence Since 2002</p>
              </div>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed pr-2">
              A premier educational institution dedicated to nurturing young minds through quality education and holistic development.
            </p>
            <div className="flex gap-3 pt-2">
              {[
                { Icon: Facebook, href: "https://www.facebook.com/indoamericanjjr/" },
                { Icon: Instagram, href: "https://www.instagram.com/indo_american_school_jhajjar/" },
                { Icon: Youtube, href: "https://www.youtube.com/@indoamericanschooljhajjar2038" },
              ].map(({ Icon, href }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 md:w-11 md:h-11 bg-primary-foreground/10 hover:bg-secondary rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col space-y-5">
            <div>
              <h4 className="font-display text-base md:text-lg font-bold mb-0.5">Quick Links</h4>
              <div className="w-8 h-1 bg-gradient-to-r from-secondary to-secondary/50 rounded-full mt-3" />
            </div>
            <ul className="space-y-2.5 md:space-y-3">
              {["About Us", "Academics", "Admissions", "Facilities", "Gallery", "Events", "Contact"].map((link) => (
                <li key={link}>
                  <Link
                    to={`/${link.toLowerCase().replace(" ", "-")}`}
                    className="text-primary-foreground/70 hover:text-secondary transition-all duration-300 text-sm md:text-sm font-medium flex items-center gap-2.5 group py-1.5 md:py-0"
                  >
                    <span className="w-1.5 h-1.5 bg-secondary/60 rounded-full group-hover:bg-secondary group-hover:scale-125 transition-all" />
                    <span className="group-hover:translate-x-1 transition-transform">{link}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="flex flex-col space-y-5">
            <div>
              <h4 className="font-display text-base md:text-lg font-bold mb-0.5">Resources</h4>
              <div className="w-8 h-1 bg-gradient-to-r from-secondary to-secondary/50 rounded-full mt-3" />
            </div>
            <ul className="space-y-2.5 md:space-y-3">
              {[
                { name: "Online Fee Collection", path: "/admissions" },
                { name: "Current Openings", path: "/teacher-applications" },
                { name: "Fee Structure PDF", path: "/documents" },
                { name: "CBSE Mandatory Disclosures", path: "/documents" },
                { name: "Academic Programs", path: "/academics" },
                { name: "Campus Facilities", path: "/facilities" },
                { name: "Contact School", path: "/contact" }
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-primary-foreground/70 hover:text-secondary transition-all duration-300 text-sm md:text-sm font-medium flex items-center gap-2.5 group py-1.5 md:py-0"
                  >
                    <span className="w-1.5 h-1.5 bg-secondary/60 rounded-full group-hover:bg-secondary group-hover:scale-125 transition-all" />
                    <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col space-y-5">
            <div>
              <h4 className="font-display text-base md:text-lg font-bold mb-0.5">Contact Us</h4>
              <div className="w-8 h-1 bg-gradient-to-r from-secondary to-secondary/50 rounded-full mt-3" />
            </div>
            <ul className="space-y-4">
              <li className="flex gap-3 py-1.5 md:py-0">
                <MapPin size={20} className="text-secondary shrink-0 flex-shrink-0 mt-0.5" />
                <span className="text-primary-foreground/70 text-sm leading-relaxed">
                  Indo American School, Agrasen Chowk, Jhajjar, Haryana - 124103
                </span>
              </li>
              <li className="py-1.5 md:py-0">
                <a href="tel:+919813288030" className="flex gap-3 hover:text-secondary transition-all duration-300 group">
                  <Phone size={20} className="text-secondary shrink-0 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-primary-foreground/70 text-sm group-hover:text-secondary">+91 98132 88030</span>
                </a>
              </li>
              <li className="py-1.5 md:py-0">
                <a href="mailto:american.indo2@gmail.com" className="flex gap-3 hover:text-secondary transition-all duration-300 group">
                  <Mail size={20} className="text-secondary shrink-0 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-primary-foreground/70 text-sm group-hover:text-secondary break-all">american.indo2@gmail.com</span>
                </a>
              </li>
            </ul>

            {/* School Timings Box */}
            <div className="mt-3 p-3 md:p-4 bg-primary-foreground/5 hover:bg-primary-foreground/8 rounded-lg border border-primary-foreground/15 hover:border-secondary/30 transition-all duration-300">
              <h5 className="font-semibold text-xs md:text-sm mb-2 text-primary-foreground">School Timings</h5>
              <div className="space-y-1">
                <p className="text-xs text-primary-foreground/70">Monday - Saturday</p>
                <p className="text-xs font-medium text-secondary">8:00 AM - 2:30 PM</p>
              </div>
              <div className="space-y-1 mt-2 pt-2 border-t border-primary-foreground/10">
                <p className="text-xs text-primary-foreground/70">Office Hours</p>
                <p className="text-xs font-medium text-secondary">9:00 AM - 4:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent -mt-4 md:-mt-6 lg:-mt-8" />

      {/* Bottom Section */}
      <div className="container-custom py-2 md:py-3 lg:py-4">
        {/* Links and Copyright Container */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 md:gap-3">
          {/* Left: Copyright - Center Aligned Text */}
          <div className="flex-1 text-center">
            <p className="text-xs md:text-sm text-primary-foreground/70 font-medium tracking-normal">
              © 2026 Indo American School. All rights reserved.
            </p>
            <p className="text-xs text-primary-foreground/50 font-medium mt-2">
              Designed and Developed by Pratikk Yadav (Punit) | +91 8307224756 | 2024 Pass Out
            </p>
          </div>

          {/* Right: Policy Links */}
          <div className="flex justify-center lg:justify-end gap-4 md:gap-6 text-xs md:text-sm flex-wrap">
            <Link to="/privacy" className="text-primary-foreground/70 hover:text-secondary transition-all duration-300 font-medium hover:underline">Privacy Policy</Link>
            <span className="text-primary-foreground/30">|</span>
            <Link to="/terms" className="text-primary-foreground/70 hover:text-secondary transition-all duration-300 font-medium hover:underline">Terms & Conditions</Link>
            <span className="text-primary-foreground/30">|</span>
            <Link to="/admin" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/70 hover:text-secondary transition-all duration-300 font-medium hover:underline">Admin Portal</Link>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;

