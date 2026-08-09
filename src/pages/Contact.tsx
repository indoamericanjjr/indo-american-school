import Layout from "@/components/layout/Layout";
import ContactSection from "@/components/home/ContactSection";
import { Helmet } from "react-helmet-async";

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us | Indo American School Jhajjar | Address & Phone</title>
        <meta name="description" content="Contact Indo American School Jhajjar. Find address (Agrasen Chowk / Talao Road, Jhajjar), phone number (+91 98132 88030), email (american.indo2@gmail.com) and map directions." />
        <meta name="keywords" content="Contact Us Indo American School, school address Jhajjar, school phone number Jhajjar, Indo American Jhajjar location, school enquiry Jhajjar" />
        <link rel="canonical" href="https://indoamericanjjr.com/contact" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://indoamericanjjr.com/contact" />
        <meta property="og:site_name" content="Indo American School Jhajjar" />
        <meta property="og:title" content="Contact Us | Indo American School Jhajjar" />
        <meta property="og:description" content="Get in touch with Indo American School Jhajjar. Located at Agrasen Chowk / Talao Road, Jhajjar, Haryana." />
        <meta property="og:image" content="https://indoamericanjjr.com/professional_enhanced_school_result.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://indoamericanjjr.com/contact" />
        <meta property="twitter:title" content="Contact Us | Indo American School Jhajjar" />
        <meta property="twitter:description" content="Get in touch with Indo American School Jhajjar." />
        <meta property="twitter:image" content="https://indoamericanjjr.com/professional_enhanced_school_result.png" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "ContactPage",
                "name": "Contact Us - Indo American School Jhajjar",
                "url": "https://indoamericanjjr.com/contact",
                "mainEntity": {
                  "@type": "School",
                  "name": "Indo American School Jhajjar",
                  "telephone": "+91 98132 88030",
                  "email": "american.indo2@gmail.com",
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Agrasen Chowk / Talao Road",
                    "addressLocality": "Jhajjar",
                    "addressRegion": "Haryana",
                    "postalCode": "124103",
                    "addressCountry": "IN"
                  }
                }
              },
              {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://indoamericanjjr.com/" },
                  { "@type": "ListItem", "position": 2, "name": "Contact Us", "item": "https://indoamericanjjr.com/contact" }
                ]
              }
            ]
          })}
        </script>
      </Helmet>

      <Layout>
        <section className="bg-primary py-20">
          <div className="container-custom text-center text-primary-foreground">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-primary-foreground/80">We are here to help you</p>
          </div>
        </section>
        <ContactSection />
      </Layout>
    </>
  );
};

export default Contact;


