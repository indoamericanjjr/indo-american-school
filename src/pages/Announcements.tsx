import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Megaphone, Calendar, AlertTriangle, Info, BookOpen, Users, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Helmet } from "react-helmet-async";

interface Announcement {
  id: string;
  title: string;
  description: string | null;
  type: string | null;
  urgent: boolean | null;
  created_at: string;
}

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements');
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
    setLoading(false);
  };

  const getTypeIcon = (type: string | null) => {
    switch (type) {
      case 'academic': return BookOpen;
      case 'admission': return Users;
      default: return Bell;
    }
  };

  const getTypeColor = (type: string | null) => {
    switch (type) {
      case 'academic': return 'bg-blue-100 text-blue-700';
      case 'admission': return 'bg-green-100 text-green-700';
      case 'holiday': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const urgentAnnouncements = announcements.filter(a => a.urgent);
  const generalAnnouncements = announcements.filter(a => !a.urgent);

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
        <title>Latest School Announcements & Notices | Indo American School, Jhajjar</title>
        <meta name="description" content="Stay updated with the latest news, urgent notices, and important announcements from Indo American School, Jhajjar. Access official school circulars and updates here." />
        <meta name="keywords" content="school notices, school circulars, school announcements Jhajjar, Indo American School updates, urgent school news" />
        <link rel="canonical" href="https://indoamericanschool.edu.in/announcements" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://indoamericanschool.edu.in/announcements" />
        <meta property="og:title" content="Latest School Announcements & Notices | Indo American School, Jhajjar" />
        <meta property="og:description" content="Stay updated with the latest news, urgent notices, and important announcements from Indo American School, Jhajjar." />
        <meta property="og:image" content="https://indoamericanschool.edu.in/indo-logo.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://indoamericanschool.edu.in/announcements" />
        <meta property="twitter:title" content="Latest School Announcements & Notices | Indo American School, Jhajjar" />
        <meta property="twitter:description" content="Stay updated with the latest news, urgent notices, and important announcements from Indo American School, Jhajjar." />
        <meta property="twitter:image" content="https://indoamericanschool.edu.in/indo-logo.png" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "School Announcements",
            "description": "Latest updates and notices from Indo American School.",
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
              <Badge className="mb-4 bg-accent text-accent-foreground">School Updates</Badge>
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Announcements</h1>
              <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-3xl mx-auto">
                Stay informed with the latest news, updates, and important notices from Indo American School
              </p>
            </motion.div>
          </div>
        </section>

        {/* Announcements Section */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <Tabs defaultValue="all" className="space-y-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All Announcements</TabsTrigger>
                <TabsTrigger value="urgent">Urgent</TabsTrigger>
                <TabsTrigger value="general">General</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-12"
                >
                  <h2 className="section-title">All Announcements</h2>
                  <p className="section-subtitle mx-auto text-center">Complete list of all school announcements</p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {announcements.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <Megaphone className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-muted-foreground">No announcements yet</h3>
                      <p className="text-muted-foreground">Check back later for updates</p>
                    </div>
                  ) : (
                    announcements.map((announcement, i) => {
                      const IconComponent = getTypeIcon(announcement.type);
                      return (
                        <motion.div
                          key={announcement.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Card className={`h-full hover:shadow-lg transition-all ${announcement.urgent ? 'border-red-200 bg-red-50/50' : ''}`}>
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-full ${getTypeColor(announcement.type)} flex items-center justify-center`}>
                                    <IconComponent className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <CardTitle className="text-lg">{announcement.title}</CardTitle>
                                    <div className="flex items-center gap-2 mt-1">
                                      {announcement.type && (
                                        <Badge variant="outline" className="text-xs capitalize">
                                          {announcement.type}
                                        </Badge>
                                      )}
                                      {announcement.urgent && (
                                        <Badge className="bg-red-500 text-white text-xs">
                                          <AlertTriangle className="w-3 h-3 mr-1" />
                                          Urgent
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              {announcement.description && (
                                <p className="text-muted-foreground mb-4">{announcement.description}</p>
                              )}
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                {new Date(announcement.created_at).toLocaleDateString('en-IN', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </TabsContent>

              <TabsContent value="urgent">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-12"
                >
                  <h2 className="section-title text-red-600">Urgent Announcements</h2>
                  <p className="section-subtitle mx-auto text-center">Important notices requiring immediate attention</p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {urgentAnnouncements.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <Info className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-muted-foreground">No urgent announcements</h3>
                      <p className="text-muted-foreground">All clear for now</p>
                    </div>
                  ) : (
                    urgentAnnouncements.map((announcement, i) => {
                      const IconComponent = getTypeIcon(announcement.type);
                      return (
                        <motion.div
                          key={announcement.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Card className="h-full border-red-200 bg-red-50/50 hover:shadow-lg transition-all">
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <CardTitle className="text-lg text-red-900">{announcement.title}</CardTitle>
                                    <div className="flex items-center gap-2 mt-1">
                                      {announcement.type && (
                                        <Badge variant="outline" className="text-xs capitalize border-red-300 text-red-700">
                                          {announcement.type}
                                        </Badge>
                                      )}
                                      <Badge className="bg-red-500 text-white text-xs">
                                        <AlertTriangle className="w-3 h-3 mr-1" />
                                        Urgent
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              {announcement.description && (
                                <p className="text-red-800 mb-4">{announcement.description}</p>
                              )}
                              <div className="flex items-center gap-2 text-sm text-red-700">
                                <Calendar className="w-4 h-4" />
                                {new Date(announcement.created_at).toLocaleDateString('en-IN', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </TabsContent>

              <TabsContent value="general">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-12"
                >
                  <h2 className="section-title">General Announcements</h2>
                  <p className="section-subtitle mx-auto text-center">Regular updates and information</p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {generalAnnouncements.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <Megaphone className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-muted-foreground">No general announcements</h3>
                      <p className="text-muted-foreground">Check back later for updates</p>
                    </div>
                  ) : (
                    generalAnnouncements.map((announcement, i) => {
                      const IconComponent = getTypeIcon(announcement.type);
                      return (
                        <motion.div
                          key={announcement.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Card className="h-full hover:shadow-lg transition-all">
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-full ${getTypeColor(announcement.type)} flex items-center justify-center`}>
                                    <IconComponent className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <CardTitle className="text-lg">{announcement.title}</CardTitle>
                                    <div className="flex items-center gap-2 mt-1">
                                      {announcement.type && (
                                        <Badge variant="outline" className="text-xs capitalize">
                                          {announcement.type}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              {announcement.description && (
                                <p className="text-muted-foreground mb-4">{announcement.description}</p>
                              )}
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                {new Date(announcement.created_at).toLocaleDateString('en-IN', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-accent to-accent/80">
          <div className="container-custom text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-accent-foreground mb-4">
                Stay Connected
              </h2>
              <p className="text-xl text-accent-foreground/80 mb-8 max-w-2xl mx-auto">
                Never miss an important announcement. Follow us for real-time updates.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="bg-background text-foreground hover:bg-background/90" asChild>
                  <a href="/contact">Contact School</a>
                </Button>
                <Button size="lg" variant="outline" className="border-accent-foreground text-accent-foreground hover:bg-accent-foreground/10" asChild>
                  <a href="/events">View Events</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Announcements;

