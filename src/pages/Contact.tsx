import Layout from "@/components/layout/Layout";
import ContactSection from "@/components/home/ContactSection";
import { Helmet } from "react-helmet-async";

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us | Indo American School, Jhajjar | Get in Touch</title>
        <meta name="description" content="Get in touch with Indo American School, Jhajjar. Find our school address, phone numbers, email, and location on the map. Reach out to us for any queries or campus visits." />
        <meta name="keywords" content="contact Indo American School, school address Jhajjar, school phone number, school location map, admission enquiry contact" />
        <link rel="canonical" href="https://indoamericanschool.edu.in/contact" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://indoamericanschool.edu.in/contact" />
        <meta property="og:title" content="Contact Us | Indo American School, Jhajjar | Get in Touch" />
        <meta property="og:description" content="Reach out to us for any queries or campus visits. We are located Agrasen Chowk, Jhajjar." />
        <meta property="og:image" content="https://indoamericanschool.edu.in/indo-logo.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://indoamericanschool.edu.in/contact" />
        <meta property="twitter:title" content="Contact Us | Indo American School, Jhajjar | Get in Touch" />
        <meta property="twitter:description" content="Reach out to us for any queries or campus visits. We are located Agrasen Chowk, Jhajjar." />
        <meta property="twitter:image" content="https://indoamericanschool.edu.in/indo-logo.png" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "mainEntity": {
              "@type": "EducationalOrganization",
              "name": "Indo American School",
              "telephone": "+91 98132 88030",
              "email": "american.indo2@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Agrasen Chowk",
                "addressLocality": "Jhajjar",
                "addressRegion": "Haryana",
                "postalCode": "124103",
                "addressCountry": "IN"
              }
            }
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


