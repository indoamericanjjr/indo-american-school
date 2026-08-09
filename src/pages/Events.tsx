import Layout from "@/components/layout/Layout";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Calendar, Clock, MapPin, Users, Trophy, Music,
  BookOpen, Heart, Flag, Star, Camera, Award,
  Palette, GraduationCap, PartyPopper, Megaphone
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string | null;
  venue: string | null;
  image_url: string | null;
  created_at: string;
}



const Events = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsRes = await fetch('/api/events').then(r => r.json());
        setUpcomingEvents(eventsRes);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);



  const annualCalendar = [
    {
      month: "April",
      events: [
        { name: "New Academic Session Begins", date: "April 1", type: "academic" },
        { name: "Earth Day Activities", date: "April 22", type: "special" },
      ]
    },
    {
      month: "May",
      events: [
        { name: "Summer Camp", date: "May 1-20", type: "activity" },
        { name: "Summer Vacation Begins", date: "May 21", type: "holiday" },
      ]
    },
    {
      month: "June",
      events: [
        { name: "School Reopens", date: "June 15", type: "academic" },
        { name: "International Yoga Day", date: "June 21", type: "special" },
      ]
    },
    {
      month: "July",
      events: [
        { name: "Van Mahotsav", date: "July 1-7", type: "special" },
        { name: "Monsoon Festival", date: "July 15", type: "cultural" },
      ]
    },
    {
      month: "August",
      events: [
        { name: "Independence Day", date: "August 15", type: "national" },
        { name: "Raksha Bandhan", date: "August 19", type: "cultural" },
        { name: "Janmashtami", date: "August 26", type: "cultural" },
      ]
    },
    {
      month: "September",
      events: [
        { name: "Teachers' Day", date: "September 5", type: "special" },
        { name: "Hindi Diwas", date: "September 14", type: "academic" },
      ]
    },
    {
      month: "October",
      events: [
        { name: "Gandhi Jayanti", date: "October 2", type: "national" },
        { name: "Dussehra Break", date: "October 10-15", type: "holiday" },
        { name: "Diwali Celebration", date: "October 28", type: "cultural" },
      ]
    },
    {
      month: "November",
      events: [
        { name: "Children's Day", date: "November 14", type: "special" },
        { name: "Science Exhibition", date: "November 20-22", type: "academic" },
      ]
    },
    {
      month: "December",
      events: [
        { name: "Winter Sports Meet", date: "December 10-12", type: "sports" },
        { name: "Christmas Celebration", date: "December 24", type: "cultural" },
        { name: "Winter Break", date: "December 25-31", type: "holiday" },
      ]
    },
    {
      month: "January",
      events: [
        { name: "Annual Sports Day", date: "January 15", type: "sports" },
        { name: "Republic Day", date: "January 26", type: "national" },
      ]
    },
    {
      month: "February",
      events: [
        { name: "PTM", date: "February 15", type: "academic" },
        { name: "Annual Examinations Begin", date: "February 25", type: "academic" },
      ]
    },
    {
      month: "March",
      events: [
        { name: "Holi Celebration", date: "March 13", type: "cultural" },
        { name: "Annual Day", date: "March 25", type: "cultural" },
        { name: "Result Declaration", date: "March 31", type: "academic" },
      ]
    },
  ];

  const eventCategories = [
    { name: "Academic", icon: BookOpen, count: 12, color: "bg-blue-100 text-blue-700" },
    { name: "Sports", icon: Trophy, count: 8, color: "bg-green-100 text-green-700" },
    { name: "Cultural", icon: Music, count: 15, color: "bg-purple-100 text-purple-700" },
    { name: "National", icon: Flag, count: 5, color: "bg-orange-100 text-orange-700" },
  ];

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      academic: "bg-blue-500",
      sports: "bg-green-500",
      cultural: "bg-purple-500",
      national: "bg-orange-500",
      special: "bg-pink-500",
      holiday: "bg-red-500",
      activity: "bg-teal-500",
    };
    return colors[type] || "bg-gray-500";
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-muted flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>Events & Activity Calendar | Indo American School Jhajjar</title>
        <meta name="description" content="Explore upcoming events, annual sports meet, science exhibitions, and cultural programs at Indo American School Jhajjar for session 2026-27." />
        <meta name="keywords" content="Indo American School events, school calendar Jhajjar, annual sports day Jhajjar, science exhibition Jhajjar" />
        <link rel="canonical" href="https://indoamericanjjr.com/events" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://indoamericanjjr.com/events" />
        <meta property="og:site_name" content="Indo American School Jhajjar" />
        <meta property="og:title" content="Events & Activity Calendar | Indo American School Jhajjar" />
        <meta property="og:description" content="Annual calendar, upcoming sports meets, cultural celebrations, and academic exhibitions at Indo American School Jhajjar." />
        <meta property="og:image" content="https://indoamericanjjr.com/professional_enhanced_school_result.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://indoamericanjjr.com/events" />
        <meta property="twitter:title" content="Events & Activity Calendar | Indo American School Jhajjar" />
        <meta property="twitter:description" content="Upcoming events and annual calendar at Indo American School Jhajjar." />
        <meta property="twitter:image" content="https://indoamericanjjr.com/professional_enhanced_school_result.png" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebPage",
                "name": "Events & Activities Calendar - Indo American School Jhajjar",
                "url": "https://indoamericanjjr.com/events",
                "publisher": {
                  "@type": "School",
                  "name": "Indo American School Jhajjar",
                  "logo": "https://indoamericanjjr.com/indo-logo.png"
                }
              },
              {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://indoamericanjjr.com/" },
                  { "@type": "ListItem", "position": 2, "name": "Events", "item": "https://indoamericanjjr.com/events" }
                ]
              }
            ]
          })}
        </script>
      </Helmet>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary-dark py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptMi0yaDF2MWgtMXYtMXptLTIgMGgxdjFoLTF2LTF6bTIgMmgxdjFoLTF2LTF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="container-custom text-center text-primary-foreground relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-accent text-accent-foreground">School Calendar 2026-27</Badge>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Events & Activities</h1>
            <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-3xl mx-auto">
              A vibrant calendar of academic, cultural, and sports events throughout the year
            </p>
          </motion.div>
        </div>
      </section>

      {/* Event Categories */}
      <section className="py-8 bg-muted/50">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {eventCategories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className={`w-12 h-12 rounded-full ${cat.color} flex items-center justify-center mx-auto mb-3`}>
                      <cat.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold">{cat.name}</h3>
                    <p className="text-sm text-muted-foreground">{cat.count} Events/Year</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Upcoming Events</h2>
            <p className="section-subtitle mx-auto text-center">Mark your calendars for these exciting upcoming events</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingEvents.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-muted-foreground">No upcoming events</h3>
                <p className="text-muted-foreground">Check back later for upcoming events</p>
              </div>
            ) : (
              upcomingEvents.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <Calendar className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{event.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{new Date(event.date).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })} {event.time && `• ${event.time}`}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                          {event.venue && (
                            <p className="text-xs text-muted-foreground mt-1">📍 {event.venue}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
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
              Want to Stay Updated?
            </h2>
            <p className="text-xl text-accent-foreground/80 mb-8 max-w-2xl mx-auto">
              Follow us on social media or contact us for the latest updates on school events
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-background text-foreground hover:bg-background/90" asChild>
                <a href="/contact">Contact Us</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Events;


