import Layout from "@/components/layout/Layout";
import { Helmet } from "react-helmet-async";

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service | Indo American School, Jhajjar</title>
        <meta name="description" content="Read the terms and conditions for using the Indo American School website. Understand our policies and user agreements." />
        <link rel="canonical" href="https://indoamericanschool.edu.in/terms" />
      </Helmet>
      <Layout>
        <section className="bg-primary py-20">
          <div className="container-custom text-center text-primary-foreground">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Terms of Service</h1>
            <p className="text-xl text-primary-foreground/80">Please read our terms and conditions carefully</p>
          </div>
        </section>
        <section className="section-padding">
          <div className="container-custom max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <h2>1. Acceptance of Terms</h2>
              <p>By accessing and using Indo American School's website, you accept and agree to be bound by the terms and provision of this agreement.</p>

              <h2>2. Use License</h2>
              <p>Permission is granted to temporarily download one copy of the materials on Indo American School's website for personal, non-commercial transitory viewing only.</p>

              <h2>3. Disclaimer</h2>
              <p>The materials on Indo American School's website are provided on an 'as is' basis. Indo American School makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

              <h2>4. Limitations</h2>
              <p>In no event shall Indo American School or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Indo American School's website.</p>

              <h2>5. Accuracy of Materials</h2>
              <p>The materials appearing on Indo American School's website could include technical, typographical, or photographic errors. Indo American School does not warrant that any of the materials on its website are accurate, complete, or current.</p>

              <h2>6. Links</h2>
              <p>Indo American School has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site.</p>

              <h2>7. Modifications</h2>
              <p>Indo American School may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.</p>

              <h2>8. Governing Law</h2>
              <p>These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.</p>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Terms;

