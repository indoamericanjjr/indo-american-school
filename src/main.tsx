import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Minimal type for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// allow storing prompt on window
declare global {
    interface Window { deferredPrompt?: BeforeInstallPromptEvent | null }
}

// Capture PWA install prompt globally to ensure it's available for the InstallPWA component
let deferredPrompt: BeforeInstallPromptEvent | null = null;
window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    window.deferredPrompt = deferredPrompt;
});

// unregister any service workers when running in development to avoid caching
// TSX modules or obsolete assets which can lead to 500s during HMR.
if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.unregister()));
}

createRoot(document.getElementById("root")!).render(<App />);


