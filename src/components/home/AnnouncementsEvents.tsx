import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback, memo } from "react";
import { Bell, Calendar, ChevronRight, Megaphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Announcement {
  id: string;
  title: string;
  description: string | null;
  type: string | null;
  urgent: boolean | null;
  created_at: string;
}

interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string | null;
  venue: string | null;
  image_url: string | null;
}

const AnnouncementMarquee = memo(({ announcements, events }: { announcements: Announcement[], events: Event[] }) => {
  const [isPaused, setIsPaused] = useState(false);

  const allItems = [
    ...announcements.map(a => ({ type: 'announcement', id: a.id, title: a.title, description: a.description })),
    ...events.map(e => ({ type: 'event', id: e.id, title: e.title, description: e.description }))
  ];

  const pause = useCallback(() => setIsPaused(true), []);
  const resume = useCallback(() => setIsPaused(false), []);

  return (
    <div className="bg-primary py-3 overflow-hidden">
      <div className="container-custom flex items-center gap-4">
        <div className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-1.5 rounded-full shrink-0">
          <Megaphone size={16} />
          <span className="text-sm font-semibold">Latest</span>
        </div>
        <div
          className="flex-1 overflow-hidden"
          onMouseEnter={pause}
          onMouseLeave={resume}
        >
          <div className={`flex gap-12 ${isPaused ? "" : "marquee"}`}>
            {allItems.concat(allItems).map((item, index) => (
              <span key={`${item.type}-${item.id}-${index}`} className="text-primary-foreground whitespace-nowrap text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
                <span className="font-medium">{item.title}</span> - {item.description ? item.description.substring(0, 80) + '...' : ''}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

const AnnouncementsEvents = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [announcementsRes, eventsRes] = await Promise.all([
          fetch('/api/announcements').then(r => r.json()),
          fetch('/api/events').then(r => r.json()),
        ]);
        setAnnouncements(announcementsRes);
        setEvents(eventsRes);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <AnnouncementMarquee announcements={announcements} events={events} />
      
      <section ref={ref} className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Announcements */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex flex-col"
            >
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-xl flex items-center justify-center shadow-sm">
                  <Bell className="text-primary-foreground w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-foreground leading-none">Announcements</h2>
                  <p className="text-muted-foreground text-xs sm:text-sm mt-1">Latest news and updates</p>
                </div>
              </div>

              <div className="space-y-3 md:space-y-4 flex-1">
                {announcements.slice(0, 4).map((announcement, index) => (
                  <Link key={announcement.id} to="/announcements" className="block">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="bg-card rounded-xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all border border-border group cursor-pointer"
                    >
                    <div className="flex items-start justify-between gap-3 md:gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5 md:mb-2 flex-wrap">
                          {announcement.urgent && (
                            <span className="px-2 py-0.5 bg-destructive/10 text-destructive text-[10px] sm:text-xs font-bold rounded uppercase tracking-wider">
                              URGENT
                            </span>
                          )}
                          <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">{new Date(announcement.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        </div>
                        <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors mb-1.5 leading-snug">
                          {announcement.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">{announcement.description}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors mt-1">
                        <ChevronRight className="text-slate-400 group-hover:text-primary transition-colors" size={16} />
                      </div>
                    </div>
                    </motion.div>
                  </Link>
                ))}
              </div>

              <Button asChild variant="outline" className="mt-6 w-full py-6 md:py-5 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <Link to="/announcements">View All Announcements</Link>
              </Button>
            </motion.div>

            {/* Events - Redesigned for mobile */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mt-4 lg:mt-0 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-secondary rounded-xl flex items-center justify-center shadow-sm">
                  <Calendar className="text-secondary-foreground w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-foreground leading-none">Upcoming Events</h2>
                  <p className="text-muted-foreground text-xs sm:text-sm mt-1">Mark your calendars</p>
                </div>
              </div>

              <div className="space-y-3 md:space-y-4 flex-1">
                {events.map((event, index) => (
                  <Link key={event.id} to="/events" className="block">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-border group cursor-pointer flex flex-col sm:flex-row"
                    >
                      {/* Event Image - full width on very small screens, side by side on sm+ */}
                      <div className="w-full sm:w-32 h-32 sm:h-auto shrink-0 relative overflow-hidden">
                        <img
                          src={event.image_url ? `${event.image_url}` : "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&quality=80&format=webp"}
                          alt={event.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {/* Overlay Date Badge on mobile image */}
                        <div className="absolute top-2 left-2 sm:hidden bg-background/90 backdrop-blur text-foreground px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1.5 shadow-sm border border-border/50">
                           <Calendar size={10} className="text-secondary"/>
                           <span>{event.date}</span>
                        </div>
                      </div>
                      
                      <div className="flex-1 p-4 flex flex-col justify-center">
                        <div className="hidden sm:flex items-center gap-2 text-[10px] md:text-xs text-muted-foreground mb-1.5 font-medium">
                          <Calendar size={12} className="text-secondary" />
                          <span className="bg-secondary/10 text-secondary px-2 py-0.5 rounded-full font-semibold">{event.date}</span>
                          <span>•</span>
                          <span>{event.time}</span>
                        </div>
                        {/* Mobile time display since date is on image */}
                        <div className="flex sm:hidden items-center gap-1.5 text-[10px] text-muted-foreground mb-1.5 font-medium">
                          <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">{event.time}</span>
                          <span className="px-2 py-0.5 rounded-md text-primary bg-primary/5 line-clamp-1">{event.venue}</span>
                        </div>

                        <h3 className="font-bold text-sm sm:text-base text-foreground group-hover:text-secondary transition-colors mb-1 leading-snug">
                          {event.title}
                        </h3>
                        <p className="hidden sm:block text-[11px] md:text-xs text-muted-foreground mb-2 font-medium bg-slate-50 dark:bg-slate-900/50 w-fit px-2 py-0.5 rounded border border-slate-100 dark:border-slate-800">📍 {event.venue}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2 md:line-clamp-1 leading-relaxed">{event.description}</p>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>

              <Button asChild variant="outline" className="mt-6 w-full py-6 md:py-5 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <Link to="/events">View All Events</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default memo(AnnouncementsEvents);


