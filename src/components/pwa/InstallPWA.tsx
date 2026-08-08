import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { X, Download, Smartphone, Sparkles, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

const InstallPWA = () => {
    // App install prompt disabled per request
    return null;

    const location = useLocation();
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstructions, setShowInstructions] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    // Only show on home page
    const isHomePage = location.pathname === '/';

    useEffect(() => {
        if (!isHomePage) return;

        // Use the global prompt if captured early in main.tsx
        if ((window as any).deferredPrompt) {
            setDeferredPrompt((window as any).deferredPrompt);
        }

        if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
            setIsInstalled(true);
            return;
        }

        const timer = setTimeout(() => {
            setShowPopup(true);
        }, 2000);

        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            (window as any).deferredPrompt = e;
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', () => {
            setIsInstalled(true);
            setShowPopup(false);
            setDeferredPrompt(null);
            (window as any).deferredPrompt = null;
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            clearTimeout(timer);
        };
    }, [isHomePage]);

    const handleInstallClick = async () => {
        // Try to use any captured prompt (local or global)
        const promptEvent = deferredPrompt || (window as any).deferredPrompt;

        if (promptEvent) {
            try {
                promptEvent.prompt();
                const { outcome } = await promptEvent.userChoice;
                if (outcome === 'accepted') {
                    setShowPopup(false);
                    setDeferredPrompt(null);
                    (window as any).deferredPrompt = null;
                }
            } catch (err) {
                // Fall back to showing manual instructions
                setShowInstructions(true);
            }
            return;
        }

        // No programmatic prompt available (e.g. iOS/Safari) — show manual install instructions
        setShowInstructions(true);
    };

    const handleCopyInstructions = async () => {
        const text = "Open your browser menu and choose 'Add to Home Screen' to install the app.";
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            // ignore clipboard errors (not all browsers allow clipboard writes)
        }
    };

    const handleDismiss = () => {
        setShowPopup(false);
    };

    if (isInstalled || !showPopup || !isHomePage) return null;

    return (
        <AnimatePresence>
            {showPopup && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 50 }}
                        transition={{ type: "spring", duration: 0.7, bounce: 0.4 }}
                        className="bg-card w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-border/50"
                    >
                        <div className="relative h-64 bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
                            <motion.div
                                initial={{ rotate: -10, scale: 0.9, opacity: 0 }}
                                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="absolute inset-0 flex items-center justify-center p-6"
                            >
                                <img
                                    src="/indo-logo.png"
                                    alt="App Icon"
                                    className="w-full h-full object-contain drop-shadow-2xl"
                                />
                            </motion.div>

                            <button
                                onClick={handleDismiss}
                                className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors text-foreground"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <h2 className="text-2xl font-display font-bold mb-3 tracking-tight">
                                    Install <span className="text-primary italic">IAS Connect</span> App
                                </h2>
                                <p className="text-muted-foreground mb-8 text-balance">
                                    Add our app to your home screen for faster access and a premium experience.
                                </p>
                            </motion.div>

                            <div className="flex flex-col gap-3">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button
                                        onClick={handleInstallClick}
                                        className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/25 flex items-center justify-center gap-2 group"
                                    >
                                        <Download className="group-hover:bounce transition-all" size={20} />
                                        {deferredPrompt || (window as any).deferredPrompt ? 'Download & Install App' : 'Install App'}
                                    </Button>
                                </motion.div>

                                {showInstructions && (
                                    <div className="text-sm text-muted-foreground bg-muted p-4 rounded-xl border border-border mt-3">
                                        <p className="mb-2">This browser does not support automatic installation. To install:</p>
                                        <ol className="list-decimal list-inside text-left text-xs">
                                            <li>Open the browser menu (⋯ or share button)</li>
                                            <li>Select "Add to Home Screen"</li>
                                        </ol>
                                        <div className="mt-3 flex gap-2">
                                            <Button onClick={handleCopyInstructions} className="flex-1">Copy Instructions</Button>
                                            <Button variant="ghost" onClick={() => setShowInstructions(false)}>Close</Button>
                                        </div>
                                    </div>
                                )}

                                <Button
                                    variant="ghost"
                                    onClick={handleDismiss}
                                    className="w-full h-12 rounded-xl text-muted-foreground hover:text-foreground font-medium mt-2"
                                >
                                    Maybe Later
                                </Button>
                            </div>

                            <div className="mt-8 pt-8 border-t border-border/50 grid grid-cols-3 gap-4">
                                <div className="flex flex-col items-center gap-1">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                        <Smartphone size={18} />
                                    </div>
                                    <span className="text-[10px] font-medium text-muted-foreground uppercase text-center">Fast Access</span>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <Bell size={18} />
                                    </div>
                                    <span className="text-[10px] font-medium text-muted-foreground uppercase text-center">Smart Alerts</span>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                        <Sparkles size={18} />
                                    </div>
                                    <span className="text-[10px] font-medium text-muted-foreground uppercase text-center">Premium Feel</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default InstallPWA;


