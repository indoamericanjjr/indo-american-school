import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        school: {
          blue: "hsl(var(--school-blue))",
          "blue-light": "hsl(var(--school-blue-light))",
          "blue-dark": "hsl(var(--school-blue-dark))",
          gold: "hsl(var(--school-gold))",
          "gold-light": "hsl(var(--school-gold-light))",
          "gold-dark": "hsl(var(--school-gold-dark))",
          cream: "hsl(var(--school-cream))",
          navy: "hsl(var(--school-navy))",
          success: "hsl(var(--school-success))",
          purple: "hsl(var(--school-purple))",
        },
      },
      fontFamily: {
        display: ["Outfit", "system-ui", "sans-serif"],
        sans: ["Outfit", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        slideDown: {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        slideUp: {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          from: { opacity: "0", transform: "translateY(-30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        zoomIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(-5%)", animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)" },
          "50%": { transform: "translateY(0)", animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.8" },
          "100%": { transform: "scale(1.5)", opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2.5s linear infinite",
        "slide-down": "slideDown 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "fade-in-up": "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in-down": "fadeInDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "zoom-in": "zoomIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        bounce: "bounce 1s infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        "pulse-ring": "pulse-ring 1.5s ease-out infinite",
        float: "float 3s ease-in-out infinite",
        "gradient-x": "gradient-x 3s ease infinite",
      },
      boxShadow: {
        glow: "0 0 40px hsl(var(--school-gold) / 0.4)",
        "glow-lg": "0 0 60px hsl(var(--school-gold) / 0.5)",
        "glow-blue": "0 0 40px hsl(var(--school-blue-light) / 0.3)",
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        card: "0 0 0 1px rgba(0, 0, 0, 0.03), 0 2px 4px rgba(0, 0, 0, 0.05), 0 12px 24px rgba(0, 0, 0, 0.05)",
        "card-hover": "0 0 0 1px rgba(0, 0, 0, 0.03), 0 4px 8px rgba(0, 0, 0, 0.08), 0 24px 48px rgba(0, 0, 0, 0.12)",
        "inner-glow": "inset 0 0 20px hsl(var(--secondary) / 0.1)",
        premium: "0 20px 40px -15px hsl(var(--primary) / 0.15), 0 0 0 1px hsl(var(--border) / 0.5)",
      },
      backgroundImage: {
        "hero-pattern": "url('/hero-pattern.svg')",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(var(--tw-gradient-stops))",
        "shimmer-gradient": "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      },
      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function ({ addComponents, addUtilities }: any) {
      addComponents({
        ".container-custom": {
          "@apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8": {},
        },
        ".section-padding": {
          "@apply py-16 md:py-24 lg:py-28": {},
        },
        ".section-label": {
          "@apply inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/10 text-secondary-foreground text-xs font-bold uppercase tracking-widest rounded-full mb-4 border border-secondary/20": {},
        },
        ".section-title": {
          "@apply font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-foreground leading-[1.2] mb-4": {},
        },
        ".section-subtitle": {
          "@apply text-muted-foreground text-lg md:text-xl leading-relaxed max-w-3xl mb-12": {},
        },
        ".text-gradient": {
          "background": "linear-gradient(135deg, hsl(var(--school-gold)), hsl(var(--school-gold-light)), hsl(var(--school-gold)))",
          "-webkit-background-clip": "text",
          "-webkit-text-fill-color": "transparent",
          "background-clip": "text",
        },
        ".card-hover": {
          "@apply transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10": {},
        },
        ".image-zoom": {
          "@apply overflow-hidden rounded-3xl": {},
        },
        ".image-zoom img": {
          "@apply transition-transform duration-700 w-full h-full object-cover": {},
        },
        ".image-zoom:hover img": {
          "@apply scale-110": {},
        },
        ".glass-dark": {
          "@apply bg-primary/80 backdrop-blur-3xl border border-primary-foreground/10": {},
        },
      });
      addUtilities({
        ".marquee": {
          "animation": "marquee 40s linear infinite",
        },
        ".marquee:hover": {
          "animation-play-state": "paused",
        },
        ".text-shadow-xl": {
          "text-shadow": "0 8px 24px rgba(0, 0, 0, 0.5)",
        },
        ".pattern-dots": {
          "background-image": "radial-gradient(circle, hsl(var(--primary) / 0.1) 1px, transparent 1px)",
          "background-size": "24px 24px",
        },
        ".pull-refresh-indicator": {
          "@apply fixed left-0 right-0 z-[60] flex items-center justify-center p-4 bg-primary text-primary-foreground font-medium transition-all duration-300 pointer-events-none opacity-0 -translate-y-full": {},
        },
        ".pull-refresh-indicator.visible": {
          "@apply opacity-100 translate-y-0": {},
        },
      });
    },
  ],
} satisfies Config;
