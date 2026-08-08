import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import HeroSlider from "@/components/home/HeroSlider";
import AboutSection from "@/components/home/AboutSection";
import AnnouncementsEvents from "@/components/home/AnnouncementsEvents";
import FacilitiesSection from "@/components/home/FacilitiesSection";
import GallerySection from "@/components/home/GallerySection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import ContactSection from "@/components/home/ContactSection";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Indo American School, Jhajjar | Best CBSE School in Haryana</title>
        <meta name="description" content="Indo American School, Jhajjar - Premier CBSE affiliated school in Haryana offering quality education from Nursery to Class XII. State-of-the-art facilities, experienced faculty, and holistic development. Admissions Open 2026-27." />
        <meta name="keywords" content="Indo American School, Jhajjar school, CBSE school Haryana, best school Jhajjar, school admission, education Haryana" />
        <link rel="canonical" href="https://indoamericanschool.edu.in" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://indoamericanschool.edu.in" />
        <meta property="og:title" content="Indo American School, Jhajjar | Best CBSE School in Haryana" />
        <meta property="og:description" content="Premier CBSE affiliated school in Haryana offering quality education from Nursery to Class XII. State-of-the-art facilities, experienced faculty, and holistic development." />
        <meta property="og:image" content="https://indoamericanschool.edu.in/indo-logo.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://indoamericanschool.edu.in" />
        <meta property="twitter:title" content="Indo American School, Jhajjar | Best CBSE School in Haryana" />
        <meta property="twitter:description" content="Premier CBSE affiliated school in Haryana offering quality education from Nursery to Class XII. State-of-the-art facilities, experienced faculty, and holistic development." />
        <meta property="twitter:image" content="https://indoamericanschool.edu.in/indo-logo.png" />

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
            "description": "Premier CBSE affiliated school in Haryana offering quality education from Nursery to Class XII with state-of-the-art facilities and experienced faculty.",
            "url": "https://indoamericanschool.edu.in",
            "logo": "https://indoamericanschool.edu.in/indo-logo.png",
            "foundingDate": "2002",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Agrasen Chowk",
              "addressLocality": "Jhajjar",
              "addressRegion": "Haryana",
              "postalCode": "124103",
              "addressCountry": "IN"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91-9813288030",
              "contactType": "customer service",
              "email": "american.indo2@gmail.com"
            },
            "sameAs": [
              "https://www.facebook.com/indoamericanjjr/",
              "https://www.instagram.com/indo_american_school_jhajjar/",
              "https://www.youtube.com/@indoamericanschooljhajjar2038"
            ]
          })}
        </script>
      </Helmet>

      <Layout>
        <HeroSlider />
        <AboutSection />
        <AnnouncementsEvents />
        <FacilitiesSection />
        <GallerySection />
        <TestimonialsSection />
        <CTASection />
        <ContactSection />
      </Layout>
    </>
  );
};

export default Index;


