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
        <title>Indo American School Jhajjar | Best CBSE School in Jhajjar, Haryana</title>
        <meta name="description" content="Indo American School Jhajjar (CBSE Affiliation No: 530460) is the top CBSE school in Jhajjar, Haryana. Quality education from Nursery to 12th grade, smart classes, science & robotics labs, sports complex & transport network. Admissions Open 2026-27." />
        <meta name="keywords" content="Indo American School Jhajjar, best school in Jhajjar, best CBSE school in Jhajjar, top school in Jhajjar Haryana, Indo American Senior Secondary School Jhajjar, Jhajjar school admission, CBSE school Jhajjar" />
        <link rel="canonical" href="https://indoamericanjjr.com/" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://indoamericanjjr.com/" />
        <meta property="og:site_name" content="Indo American School Jhajjar" />
        <meta property="og:title" content="Indo American School Jhajjar | Best CBSE School in Jhajjar, Haryana" />
        <meta property="og:description" content="Premier CBSE affiliated senior secondary school in Jhajjar, Haryana. Quality education from Nursery to Class XII, state-of-the-art facilities, and 95%+ board results." />
        <meta property="og:image" content="https://indoamericanjjr.com/professional_enhanced_school_result.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://indoamericanjjr.com/" />
        <meta property="twitter:title" content="Indo American School Jhajjar | Best CBSE School in Jhajjar, Haryana" />
        <meta property="twitter:description" content="Premier CBSE affiliated senior secondary school in Jhajjar, Haryana offering quality education from Nursery to Class XII." />
        <meta property="twitter:image" content="https://indoamericanjjr.com/professional_enhanced_school_result.png" />

        {/* Additional SEO */}
        <meta name="author" content="Indo American School Jhajjar" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="IN-HR" />
        <meta name="geo.placename" content="Jhajjar, Haryana" />
        <meta name="geo.position" content="28.6063;76.6565" />
        <meta name="ICBM" content="28.6063, 76.6565" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "School",
            "name": "Indo American School Jhajjar",
            "alternateName": "Indo American Senior Secondary School Jhajjar",
            "description": "Premier CBSE affiliated school in Jhajjar, Haryana offering quality education from Nursery to Class XII with state-of-the-art facilities and experienced faculty.",
            "url": "https://indoamericanjjr.com",
            "logo": "https://indoamericanjjr.com/indo-logo.png",
            "image": "https://indoamericanjjr.com/professional_enhanced_school_result.png",
            "foundingDate": "2002",
            "identifier": "CBSE-530460",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Agrasen Chowk / Talao Road",
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


