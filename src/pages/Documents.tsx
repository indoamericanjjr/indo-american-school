import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, Download, ExternalLink, Shield, Award, BookOpen, Users, Building, Flame, Heart, DollarSign, Calendar, GraduationCap, ClipboardList } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet-async";

import { toast } from "sonner";

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDownload = (docTitle: string) => {
    toast.message("Download Started", {
      description: `Downloading ${docTitle}...`,
      icon: <FileText className="h-4 w-4" />
    });
  };

  useEffect(() => {
    fetch('/api/documents')
      .then(res => res.json())
      .then(data => {
        setDocuments(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const categoryInfo = {
    "Mandatory Disclosure": { icon: Shield, color: "bg-blue-100 text-blue-700" },
    "Safety & Infrastructure": { icon: Building, color: "bg-green-100 text-green-700" },
    "Academic & Administrative": { icon: BookOpen, color: "bg-purple-100 text-purple-700" },
    "Governance & Committees": { icon: Users, color: "bg-orange-100 text-orange-700" }
  };

  const groupedDocuments = documents.reduce((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = [];
    acc[doc.category].push(doc);
    return acc;
  }, {});

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Helmet>
        <title>CBSE Mandatory Disclosures & Documents | Indo American School, Jhajjar</title>
        <meta name="description" content="Access official CBSE mandatory disclosures, school safety certificates, academic policies, and administrative documents for Indo American School, Jhajjar. Transparency as per RTE Act." />
        <meta name="keywords" content="CBSE mandatory disclosure, school documents Jhajjar, school safety certificate, RTE compliance school, school governance documents" />
        <link rel="canonical" href="https://indoamericanschool.edu.in/documents" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://indoamericanschool.edu.in/documents" />
        <meta property="og:title" content="CBSE Mandatory Disclosures & Documents | Indo American School, Jhajjar" />
        <meta property="og:description" content="Official school documents and disclosures as per CBSE guidelines. Accessible for parents and regulators." />
        <meta property="og:image" content="https://indoamericanschool.edu.in/indo-logo.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://indoamericanschool.edu.in/documents" />
        <meta property="twitter:title" content="CBSE Mandatory Disclosures & Documents | Indo American School, Jhajjar" />
        <meta property="twitter:description" content="Official school documents and disclosures as per CBSE guidelines. Accessible for parents and regulators." />
        <meta property="twitter:image" content="https://indoamericanschool.edu.in/indo-logo.png" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Mandatory Disclosures",
            "description": "Public documentation and mandatory disclosures of Indo American School, Jhajjar.",
            "publisher": {
              "@type": "EducationalOrganization",
              "name": "Indo American School",
              "logo": "https://indoamericanschool.edu.in/indo-logo.png"
            }
          })}
        </script>
      </Helmet>

      <Layout>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary-dark py-24 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptMi0yaDF2MWgtMXYtMXptLTIgMGgxdjFoLTF2LTF6bTIgMmgxdjFoLTF2LTF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
          <div className="container-custom text-center text-primary-foreground relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-accent text-accent-foreground">CBSE Compliance</Badge>
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">School Documents</h1>
              <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-3xl mx-auto">
                Access all mandatory documents and disclosures as per CBSE guidelines and RTE Act
              </p>
            </motion.div>
          </div>
        </section>

        {/* Documents Section */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="section-title">Mandatory Disclosures</h2>
              <p className="section-subtitle mx-auto text-center">
                All documents are available for download as per CBSE and Government regulations
              </p>
            </motion.div>

            <div className="space-y-12">
              {Object.keys(groupedDocuments).map((category, categoryIndex) => {
                const items = groupedDocuments[category];
                const info = categoryInfo[category] || { icon: FileText, color: "bg-gray-100 text-gray-700" };
                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: categoryIndex * 0.1 }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-12 h-12 rounded-xl ${info.color} flex items-center justify-center`}>
                        <info.icon size={24} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-display font-bold">{category}</h3>
                        <p className="text-muted-foreground">Required disclosures under CBSE guidelines</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {items.map((doc, docIndex) => (
                        <motion.div
                          key={doc.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: (categoryIndex * 0.1) + (docIndex * 0.05) }}
                        >
                          <Card className="h-full hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <FileText size={20} className="text-primary" />
                                  </div>
                                  <div>
                                    <CardTitle className="text-lg">{doc.title}</CardTitle>
                                    <CardDescription className="text-sm">{doc.description}</CardDescription>
                                  </div>
                                </div>
                                {doc.required && (
                                  <Badge variant="secondary" className="text-xs">Required</Badge>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <FileText size={14} />
                                    {doc.type}
                                  </span>
                                  <span>{doc.size}</span>
                                  <span>Updated: {doc.lastUpdated}</span>
                                </div>
                              </div>
                              {doc.file_url ? (
                                <a
                                  href={doc.file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => handleDownload(doc.title)}
                                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                                >
                                  <Download size={16} className="mr-2" />
                                  Download Document
                                </a>
                              ) : (
                                <Button
                                  className="w-full"
                                  size="sm"
                                  onClick={() => handleDownload(doc.title)}
                                >
                                  <Download size={16} className="mr-2" />
                                  Download Document
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Important Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 bg-muted/50 rounded-2xl p-8 border border-border/50"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold mb-2">Important Notice</h3>
                  <p className="text-muted-foreground mb-4">
                    All documents displayed here are as per the mandatory disclosure requirements under the Right to Education (RTE) Act, 2009 and CBSE guidelines. These documents are regularly updated and verified.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <a href="https://cbse.gov.in/" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <ExternalLink size={16} className="mr-2" />
                        CBSE Official Website
                      </Button>
                    </a>
                    <a href="https://www.education.gov.in/rte" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <ExternalLink size={16} className="mr-2" />
                        RTE Guidelines
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-accent to-accent/80">
          <div className="container-custom text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-accent-foreground mb-4">
                Need More Information?
              </h2>
              <p className="text-xl text-accent-foreground/80 mb-8 max-w-2xl mx-auto">
                For any queries regarding school documents or admissions, feel free to contact us
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/contact">
                  <Button size="lg" className="bg-background text-foreground hover:bg-background/90">
                    Contact School Office
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Documents;


