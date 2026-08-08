import { useState, useEffect, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Mail, MapPin, ChevronDown, Facebook, Instagram, Youtube, ShieldCheck, LayoutDashboard, Users, GraduationCap, UserPlus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "/indo-logo.webp";

interface NavLink {
  name: string;
  path: string;
  subLinks?: { name: string; path: string }[];
  external?: boolean;
}

const navLinks: NavLink[] = [
  { name: "Home", path: "/" },
  {
    name: "About Us", path: "/about", subLinks: [
      { name: "Our Story", path: "/about#our-story" },
      { name: "Director's Message", path: "/about#principals-message" },
      { name: "Vision & Mission", path: "/about#vision-mission" },
      { name: "Core Values", path: "/about#core-values" },
      { name: "Mandatory Disclosers", path: "/documents" },
      { name: "Facilities", path: "/facilities" },
    ]
  },
  {
    name: "Academics", path: "/academics", subLinks: [
      { name: "Curriculum Structure", path: "/academics#curriculum-structure" },
      { name: "Special Programs", path: "/academics#special-programs" },
      { name: "Academic Achievements", path: "/academics#academic-achievements" },
      { name: "Daily Schedule", path: "/academics#daily-schedule" },
    ]
  },
  {
    name: "Admissions", path: "/admissions", subLinks: [
      { name: "Apply for Student", path: "/admissions" },
      { name: "Apply for Teacher", path: "/teacher-applications" },
    ]
  },
  { name: "Gallery", path: "/gallery" },
  { name: "Contact", path: "/contact" },

];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, location.hash]);

  // Handle click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // We only care if the menu is open and the click is on the backdrop
      // The backdrop has a specific z-index and fixed positioning
      const target = e.target as HTMLElement;
      if (isOpen && target.classList.contains('fixed') && target.classList.contains('inset-0')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Top Bar - Scrolls away naturally with page */}
      <div className="bg-primary text-primary-foreground w-full relative z-40">
        <div className="container-custom py-1 sm:py-2">
          <div className="flex flex-row justify-center sm:justify-between items-center gap-2 sm:gap-4">
            {/* School Info - Hidden on mobile for smaller bar */}
            <div className="hidden sm:block flex-1 sm:flex-none text-left w-auto">
              <div className="flex flex-row items-center justify-start gap-2 text-sm">
                <span className="font-semibold">CBSE Affiliated School</span>
                <span className="text-primary-foreground/60 hidden sm:inline">•</span>
                <span className="text-primary-foreground/80 hidden sm:inline">Excellence Since 2002</span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex items-center justify-center sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto py-0.5 sm:py-0">
              <a href="tel:+919813288030" className="flex items-center gap-1 sm:gap-1.5 hover:text-secondary transition-colors group text-[10px] sm:text-xs md:text-sm">
                <div className="hidden sm:flex w-5 h-5 md:w-6 md:h-6 rounded-full bg-secondary/20 items-center justify-center group-hover:bg-secondary/30 transition-colors">
                  <Phone size={8} className="sm:w-2.5 sm:h-2.5 md:w-3 md:h-3" />
                </div>
                <Phone size={10} className="sm:hidden" />
                <span>+91 98132 88030</span>
              </a>
              <span className="text-primary-foreground/20 hidden sm:inline">|</span>
              <a href="mailto:american.indo2@gmail.com" className="flex items-center gap-1 sm:gap-1.5 hover:text-secondary transition-colors group text-[10px] sm:text-xs md:text-sm">
                <div className="hidden sm:flex w-5 h-5 md:w-6 md:h-6 rounded-full bg-secondary/20 items-center justify-center group-hover:bg-secondary/30 transition-colors">
                  <Mail size={8} className="sm:w-2.5 sm:h-2.5 md:w-3 md:h-3" />
                </div>
                <Mail size={10} className="sm:hidden" />
                <span>american.indo2@gmail.com</span>
              </a>
            </div>

            {/* Right Side - Location & Social */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-1.5 text-primary-foreground/80 text-sm">
                <MapPin size={14} />
                <span>Jhajjar, Haryana</span>
              </div>
              <div className="hidden sm:flex items-center gap-1">
                {[
                  { icon: Facebook, href: "https://www.facebook.com/indoamericanjjr/" },
                  { icon: Instagram, href: "https://www.instagram.com/indo_american_school_jhajjar/" },
                  { icon: Youtube, href: "https://www.youtube.com/@indoamericanschooljhajjar2038" },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-full bg-primary-foreground/10 hover:bg-secondary flex items-center justify-center transition-all duration-300 hover:scale-110 will-change-transform"
                  >
                    <social.icon size={12} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar - Stays sticky at top */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-card/95 backdrop-blur-xl shadow-md border-b border-slate-200/50 dark:border-slate-800/50"
          : "bg-card border-b border-transparent"
          }`}
      >
        {/* Main Header Nav */}
        <div className="w-full">
          <div className="container-custom">
            <div className="flex items-center justify-between py-2 sm:py-3 md:py-4">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={logo}
                    alt="Indo American School"
                    loading="lazy"
                    className="w-12 sm:w-16 md:w-20 h-auto object-contain"
                  />
                </div>
                <div className="block">
                  <h1 className="font-display text-base sm:text-lg md:text-xl font-bold text-primary leading-tight">
                    Indo American School
                  </h1>
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground flex items-center gap-1 opacity-80">
                    <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-secondary animate-pulse"></span>
                    Excellence in Education Since 2002
                  </p>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-1">
                {navLinks.map((link) => (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => link.subLinks && setActiveDropdown(link.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {link.external ? (
                      <a
                        href={link.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full border-primary/20 hover:bg-primary hover:text-primary-foreground font-bold transition-all duration-300 will-change-transform shadow-sm hover:shadow-md"
                        >
                          {link.name}
                        </Button>
                      </a>
                    ) : (
                      <Link
                        to={link.path}
                        aria-haspopup={link.subLinks ? "menu" : undefined}
                        aria-expanded={link.subLinks ? activeDropdown === link.name : undefined}
                        className={`relative px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 will-change-transform flex items-center gap-1 group ${location.pathname === link.path
                          ? "text-primary bg-primary/5"
                          : "text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-primary/5"
                          }`}
                      >
                        {link.name}
                        {link.subLinks && (
                          <ChevronDown
                            size={14}
                            className={`transition-transform duration-300 opacity-60 group-hover:opacity-100 ${activeDropdown === link.name ? "rotate-180" : ""}`}
                          />
                        )}
                        {location.pathname === link.path && (
                          <motion.div
                            layoutId="activeNav"
                            className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-t-full"
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </Link>
                    )}

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {link.subLinks && activeDropdown === link.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 15, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 25 }}
                          className="absolute top-[110%] left-0 bg-card shadow-2xl rounded-2xl overflow-hidden min-w-[240px] border border-border/60 backdrop-blur-xl z-50 p-2"
                        >
                          <div className="flex flex-col gap-1">
                            {link.subLinks.map((subLink) => (
                              <Link
                                key={subLink.name}
                                to={subLink.path}
                                className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-primary/5 transition-all group"
                              >
                                <div className="w-6 h-6 rounded-md bg-accent/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                                </div>
                                <span className="text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors">
                                  {subLink.name}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </nav>

              {/* CTA & Mobile Menu Toggle */}
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Search / Command Palette Trigger */}
                <button
                  onClick={() => {
                    document.dispatchEvent(
                      new KeyboardEvent("keydown", {
                        key: "k",
                        metaKey: true,
                      })
                    );
                  }}
                  className="p-2 sm:p-2.5 rounded-full bg-slate-100/50 hover:bg-slate-200 text-slate-600 hover:text-primary dark:bg-slate-800/50 dark:hover:bg-slate-700 transition-colors relative flex items-center justify-center group border border-transparent hover:border-border/50"
                  aria-label="Open global search"
                >
                  <Search size={18} className="sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
                  <div className="hidden md:flex ml-2 items-center gap-0.5 opacity-60">
                    <span className="text-[10px] font-sans border border-slate-300 dark:border-slate-600 rounded px-1 min-w-[18px] text-center">⌘</span>
                    <span className="text-[10px] font-sans border border-slate-300 dark:border-slate-600 rounded px-1.5 min-w-[18px] text-center">K</span>
                  </div>
                </button>

                <Button
                  asChild
                  className="hidden lg:flex bg-gradient-to-r from-primary to-blue-700 hover:from-primary hover:to-primary text-primary-foreground font-bold rounded-full px-7 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Link to="/admissions">Apply Now</Link>
                </Button>

                {/* Mobile Menu Button */}
                <button
                  className="lg:hidden p-2 sm:p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors relative"
                  onClick={() => setIsOpen(!isOpen)}
                  aria-label={isOpen ? "Close menu" : "Open menu"}
                >
                  <AnimatePresence mode="wait">
                    {isOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X size={20} className="text-primary sm:w-6 sm:h-6" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu size={20} className="text-slate-700 dark:text-slate-300 sm:w-6 sm:h-6" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Modern High-End Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Ultra Blur Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-[4px] z-[60] lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Sliding Drawer Content */}
            <motion.div
              initial={{ x: "100%", borderTopLeftRadius: "2rem", borderBottomLeftRadius: "2rem" }}
              animate={{ x: 0, borderTopLeftRadius: "0rem", borderBottomLeftRadius: "0rem" }}
              exit={{ x: "100%", borderTopLeftRadius: "2rem", borderBottomLeftRadius: "2rem" }}
              transition={{ duration: 0.4, type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-sm sm:max-w-md bg-card shadow-2xl z-[70] lg:hidden flex flex-col border-l border-border/50 h-[100dvh] overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border/50 bg-slate-50/50 dark:bg-slate-900/50">
                <Link to="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
                  <div className="p-1.5 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <img src={logo} alt="Indo American Logo" className="w-8 h-8 object-contain" />
                  </div>
                  <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 dark:to-blue-400">
                    Menu
                  </span>
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2.5 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 text-slate-500 hover:text-red-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Navigation Area */}
              <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6 space-y-2 pb-8 touch-pan-y overscroll-none">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + (index * 0.05) }}
                    className="space-y-1"
                  >
                    {link.external ? (
                      <a
                        href={link.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between w-full p-4 rounded-2xl bg-gradient-to-r from-primary to-blue-600 text-white shadow-md active:scale-[0.98] transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                            <ShieldCheck size={18} />
                          </div>
                          <span className="font-semibold">{link.name}</span>
                        </div>
                        <span className="text-[10px] bg-white text-primary px-2.5 py-1 rounded-full uppercase tracking-wider font-bold shadow-sm">Portal</span>
                      </a>
                    ) : (
                      <Link
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center justify-between w-full p-4 rounded-2xl transition-all active:scale-[0.98] border ${location.pathname === link.path
                          ? "bg-primary/5 border-primary/20 text-primary"
                          : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-primary/20 hover:bg-slate-50 dark:hover:bg-slate-800/80"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${location.pathname === link.path ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
                            {link.name === "Home" && <LayoutDashboard size={16} />}
                            {link.name === "About Us" && <Users size={16} />}
                            {link.name === "Academics" && <GraduationCap size={16} />}
                            {link.name === "Admissions" && <UserPlus size={16} />}
                            {link.name === "Gallery" && <MapPin size={16} />}
                            {link.name === "Contact" && <Phone size={16} />}
                          </div>
                          <span className="font-semibold text-[15px]">{link.name}</span>
                        </div>
                        {location.pathname === link.path && (
                          <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(29,78,216,0.6)]" />
                        )}
                      </Link>
                    )}

                    {/* Highly Designed nested links representation */}
                    {link.subLinks && (
                      <div className="pl-14 pr-2 py-2 space-y-1">
                        {link.subLinks.map((subLink, subIndex) => (
                          <motion.div
                            key={subLink.name}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + (index * 0.05) + (subIndex * 0.03) }}
                          >
                            <Link
                              to={subLink.path}
                              onClick={() => setIsOpen(false)}
                              className={`block w-full text-left py-2.5 px-3 rounded-lg text-[14px] font-medium transition-colors ${location.pathname + location.hash === subLink.path
                                ? "bg-primary/5 text-primary"
                                : "text-slate-500 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                }`}
                            >
                              <span className="flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${location.pathname + location.hash === subLink.path ? "bg-primary" : "bg-slate-300 dark:bg-slate-600"}`}></span>
                                {subLink.name}
                              </span>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Drawer Footer CTA */}
              <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-900 border-t border-border/50">
                <Button 
                  asChild 
                  className="w-full bg-gradient-to-r from-primary to-blue-700 hover:from-primary text-white font-bold py-6 rounded-2xl shadow-lg shadow-primary/20 text-lg"
                >
                  <Link onClick={() => setIsOpen(false)} to="/admissions">Apply For Admissions Now</Link>
                </Button>
                
                <div className="flex items-center justify-center gap-6 mt-6">
                  <a href="tel:+919813288030" className="flex flex-col items-center gap-1.5 text-slate-500 hover:text-primary transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center mb-1"><Phone size={18} /></div>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Call</span>
                  </a>
                  <a href="mailto:american.indo2@gmail.com" className="flex flex-col items-center gap-1.5 text-slate-500 hover:text-primary transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center mb-1"><Mail size={18} /></div>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Email</span>
                  </a>
                  <a href="https://maps.google.com" target="_blank" className="flex flex-col items-center gap-1.5 text-slate-500 hover:text-primary transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center mb-1"><MapPin size={18} /></div>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Map</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default memo(Header);
