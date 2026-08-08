import { motion, AnimatePresence } from "framer-motion";
import { Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const MobileActionBar = () => {
    const [isVisible, setIsVisible] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            // Show after 300px of scrolling
            setIsVisible(window.scrollY > 300);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);



    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="lg:hidden fixed bottom-[5.5rem] left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-[400px]"
                >
                    <div className="bg-background/80 backdrop-blur-2xl border border-white/50 dark:border-slate-800/50 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-3xl p-2 flex items-center justify-between gap-2">
                        <a
                            href="tel:+919813288030"
                            className="flex-1 flex flex-col items-center justify-center py-2.5 rounded-2xl bg-slate-50 text-primary transition-all active:scale-95"
                        >
                            <Phone size={18} className="mb-1" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Call</span>
                        </a>

                        <a
                            href="https://maps.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex flex-col items-center justify-center py-2.5 rounded-2xl bg-slate-50 text-primary transition-all active:scale-95"
                        >
                            <MapPin size={18} className="mb-1" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Visit</span>
                        </a>

                        <Link
                            to="/admissions"
                            className="flex-[2] flex items-center justify-center gap-2 py-3 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-95 px-4"
                        >
                            <Send size={16} />
                            <span className="text-xs font-black uppercase tracking-widest whitespace-nowrap">Apply Now</span>
                        </Link>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MobileActionBar;


