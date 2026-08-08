import Layout from "@/components/layout/Layout";
import { Helmet } from "react-helmet-async";

const Privacy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Indo American School, Jhajjar</title>
        <meta name="description" content="Read the privacy policy of Indo American School, Jhajjar. Learn how we collect, use, and protect your personal information." />
        <link rel="canonical" href="https://indoamericanschool.edu.in/privacy" />
      </Helmet>
      <Layout>
        <section className="bg-primary py-20">
          <div className="container-custom text-center text-primary-foreground">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-primary-foreground/80">Your privacy is important to us</p>
          </div>
        </section>
        <section className="section-padding">
          <div className="container-custom max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <h2>1. Information We Collect</h2>
              <p>We may collect personal information from you when you visit our website, register for admission, or contact us. This may include your name, email address, phone number, and other relevant details.</p>

              <h2>2. How We Use Your Information</h2>
              <p>The information we collect is used to:</p>
              <ul>
                <li>Process admission applications</li>
                <li>Respond to your inquiries</li>
                <li>Provide educational services</li>
                <li>Send important updates and notifications</li>
                <li>Improve our website and services</li>
              </ul>

              <h2>3. Information Sharing</h2>
              <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law.</p>

              <h2>4. Data Security</h2>
              <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>

              <h2>5. Cookies</h2>
              <p>Our website may use cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings.</p>

              <h2>6. Third-Party Links</h2>
              <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites.</p>

              <h2>7. Children's Privacy</h2>
              <p>We are committed to protecting the privacy of children. We do not knowingly collect personal information from children under 13 without parental consent.</p>

              <h2>8. Changes to This Policy</h2>
              <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>

              <h2>9. Contact Us</h2>
              <p>If you have any questions about this privacy policy, please contact us at:</p>
              <p>Email: american.indo2@gmail.com<br />
                Phone: +91 9813288030<br />
                Address: Indo American School, Agrasen Chowk, Jhajjar, Haryana - 124103</p>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Privacy;

