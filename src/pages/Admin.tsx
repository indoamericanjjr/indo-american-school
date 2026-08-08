import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Calendar, Image, MessageSquare, Users, LogOut, Plus, Trash2, Edit, Download, Eye, FileText, Mail, EyeOff, Shield, BarChart3, Settings, Home, User, Menu, X, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

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

interface PastEvent extends Event {
  photos: string[];
}

interface AdmissionEnquiry {
  id: string;
  student_name: string;
  parent_name: string;
  email: string;
  phone: string;
  class_applied: string;
  additional_info: string | null;
  status: string | null;
  created_at: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  read: boolean | null;
  created_at: string;
}

interface GalleryImage {
  id: string;
  title: string;
  category: string | null;
  year: string | null;
  image_url: string;
}

interface Document {
  id: string;
  category: string;
  title: string;
  description: string | null;
  type: string | null;
  size: string | null;
  lastUpdated: string | null;
  required: boolean | null;
  file_url: string | null;
}

interface TeacherApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  post: string;
  subject: string;
  qualification?: string;
  experience?: string;
  resume_url: string | null;
  status: string | null;
  created_at: string;
}

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  // Data states
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<PastEvent[]>([]);
  const [enquiries, setEnquiries] = useState<AdmissionEnquiry[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [teacherApplications, setTeacherApplications] = useState<TeacherApplication[]>([]);
  const [siteImages, setSiteImages] = useState<{id: number; slot_key: string; label: string; category: string; image_url: string; updated_at: string}[]>([]);
  const [heroSlides, setHeroSlides] = useState<{id: number; title: string; subtitle: string; description: string; accent: string; image_url: string; sort_order: number}[]>([]);
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const [newHeroSlide, setNewHeroSlide] = useState({ title: '', subtitle: '', description: '', accent: '', sort_order: '0', image: null as File | null });
  const [editingHeroSlide, setEditingHeroSlide] = useState<{id: number; title: string; subtitle: string; description: string; accent: string; image_url: string; sort_order: number} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dataState, setDataState] = useState({
    announcements: { loading: true, error: null as string | null },
    events: { loading: true, error: null as string | null },
    pastEvents: { loading: true, error: null as string | null },
    enquiries: { loading: true, error: null as string | null },
    messages: { loading: true, error: null as string | null },
    gallery: { loading: true, error: null as string | null },
    documents: { loading: true, error: null as string | null },
    teacherApplications: { loading: true, error: null as string | null },
    siteImages: { loading: true, error: null as string | null },
  });

  // Form states
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", description: "", type: "general", urgent: false });
  const [newEvent, setNewEvent] = useState({ title: "", description: "", date: "", time: "", venue: "", image: null as File | null });
  const [newPastEvent, setNewPastEvent] = useState({ title: "", description: "", date: "", time: "", venue: "", photos: null as FileList | null });
  const [newGalleryImage, setNewGalleryImage] = useState({ title: "", category: "general", year: new Date().getFullYear().toString(), images: null as FileList | null });
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [newDocument, setNewDocument] = useState({ category: "", title: "", description: "", type: "", size: "", lastUpdated: "", required: false, file_url: "" });

  // PDF Viewer state
  const [pdfViewer, setPdfViewer] = useState<{ url: string; title: string } | null>(null);
  const [dialogOpen, setDialogOpen] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; url: string; successMessage: string } | null>(null);
  const [activeSection, setActiveSection] = useState<string>("dashboard");

  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    if (token) {
      setIsLoggedIn(true);
      fetchAllData();
    }
    setLoading(false);
  }, []);

  const safeFormat = (dateStr?: string | null, fmt: string = "MMM dd, yyyy") => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "Invalid date";
      return format(d, fmt);
    } catch (e) {
      return "Invalid date";
    }
  };

  const fetchAllData = async () => {
    setDataState(prev => ({ ...prev, announcements: { loading: true, error: null }, events: { loading: true, error: null }, pastEvents: { loading: true, error: null }, enquiries: { loading: true, error: null }, messages: { loading: true, error: null }, gallery: { loading: true, error: null }, documents: { loading: true, error: null }, teacherApplications: { loading: true, error: null }, siteImages: { loading: true, error: null } }));
    try {
      const fetchData = async (url: string, key: keyof typeof dataState) => {
        try {
          const token = sessionStorage.getItem("adminToken");
          const res = await fetch(url, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          });
          if (!res.ok) throw new Error(`Failed to fetch ${key}`);
          const data = await res.json();
          setDataState(prev => ({ ...prev, [key]: { loading: false, error: null } }));
          return data;
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Unknown error';
          setDataState(prev => ({ ...prev, [key]: { loading: false, error: message } }));
          toast({ title: `Error fetching ${key}`, description: message, variant: "destructive" });
          return [];
        }
      };

      const [announcementsRes, eventsRes, pastEventsRes, enquiriesRes, messagesRes, galleryRes, documentsRes, teacherApplicationsRes] = await Promise.all([
        fetchData('/api/announcements', 'announcements'),
        fetchData('/api/events', 'events'),
        fetchData('/api/past-events', 'pastEvents'),
        fetchData('/api/admission-enquiries', 'enquiries'),
        fetchData('/api/contact-messages', 'messages'),
        fetchData('/api/gallery', 'gallery'),
        fetchData('/api/documents', 'documents'),
        fetchData('/api/teacher-applications', 'teacherApplications'),
      ]);

      setAnnouncements(announcementsRes);
      setEvents(eventsRes);
      setPastEvents(pastEventsRes);
      setEnquiries(enquiriesRes);
      setMessages(messagesRes);
      setGallery(galleryRes);
      setDocuments(documentsRes);
      setTeacherApplications(teacherApplicationsRes);

      // Fetch site images separately (seed if empty)
      try {
        const token = sessionStorage.getItem("adminToken");
        const siteImgRes = await fetch('/api/site-images');
        let siteImgData = await siteImgRes.json();
        if (Array.isArray(siteImgData) && siteImgData.length === 0 && token) {
          const seedRes = await fetch('/api/site-images/seed', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
          });
          siteImgData = await seedRes.json();
        }
        setSiteImages(Array.isArray(siteImgData) ? siteImgData : []);
        setDataState(prev => ({ ...prev, siteImages: { loading: false, error: null } }));
      } catch {
        setDataState(prev => ({ ...prev, siteImages: { loading: false, error: 'Failed to fetch site images' } }));
      }

      // Fetch hero slides
      try {
        const heroRes = await fetch('/api/hero-slides');
        const heroData = await heroRes.json();
        setHeroSlides(Array.isArray(heroData) ? heroData : []);
      } catch {
        console.warn('Failed to fetch hero slides');
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({ title: "Error", description: "An unexpected error occurred while fetching data.", variant: "destructive" });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok && data.token) {
        sessionStorage.setItem("adminToken", data.token);
        setIsLoggedIn(true);
        fetchAllData();
        toast({ title: "Login Successful", description: "Welcome to Admin Panel" });
      } else {
        toast({ title: "Login Failed", description: data.error || "Invalid credentials", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Login Failed", description: "Network error", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    setIsLoggedIn(false);
    toast({ title: "Logged Out" });
  };

  // Generic CRUD functions
  const addItem = async (url: string, body: Record<string, unknown> | FormData, successMessage: string, isFormData = false) => {
    try {
      let requestBody: string | FormData;
      if (isFormData) {
        requestBody = body as FormData;
      } else {
        requestBody = JSON.stringify(body);
      }
      const token = sessionStorage.getItem("adminToken");
      const options: RequestInit = {
        method: 'POST',
        body: requestBody,
        headers: {},
      };
      if (!isFormData) {
        (options.headers as Record<string, string>)['Content-Type'] = 'application/json';
      }
      if (token) {
        (options.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch(url, options);
      if (response.ok) {
        toast({ title: successMessage });
        setDialogOpen(null);
        fetchAllData();
      } else {
        const errorData = await response.json();
        toast({ title: "Error", description: errorData.message || `Failed to add item.`, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Network error", variant: "destructive" });
    }
  };

  const updateItem = async (url: string, body: Record<string, unknown> | FormData, successMessage: string, isFormData = false) => {
    try {
      let requestBody: string | FormData;
      if (isFormData) {
        requestBody = body as FormData;
      } else {
        requestBody = JSON.stringify(body);
      }
      const token = sessionStorage.getItem("adminToken");
      const options: RequestInit = {
        method: 'PUT',
        body: requestBody,
        headers: {},
      };
      if (!isFormData) {
        (options.headers as Record<string, string>)['Content-Type'] = 'application/json';
      }
      if (token) {
        (options.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch(url, options);
      if (response.ok) {
        toast({ title: successMessage });
        setEditingAnnouncement(null);
        setEditingEvent(null);
        setEditingDocument(null);
        fetchAllData();
      } else {
        const errorData = await response.json();
        toast({ title: "Error", description: errorData.message || `Failed to update item.`, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Network error", variant: "destructive" });
    }
  };

  const deleteItem = async (url: string, successMessage: string) => {
    setDeleteDialog({ open: true, url, successMessage });
  };

  const confirmDelete = async () => {
    if (!deleteDialog) return;
    try {
      const token = sessionStorage.getItem("adminToken");
      const response = await fetch(deleteDialog.url, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (response.ok) {
        toast({ title: deleteDialog.successMessage });
        fetchAllData();
      } else {
        const errorData = await response.json();
        toast({ title: "Error", description: errorData.message || "Failed to delete item.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Network error", variant: "destructive" });
    } finally {
      setDeleteDialog(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex flex-col items-center justify-center p-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptMi0yaDF2MWgtMXYtMXptLTIgMGgxdjFoLTF2LTF6bTIgMmgxdjFoLTF2LTF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

        <Card className="w-full max-w-md shadow-2xl border-0 bg-card/95 backdrop-blur-sm relative z-10">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Admin Portal
            </CardTitle>
            <p className="text-muted-foreground text-sm mt-2">
              Indo American School Management System
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium flex items-center gap-2">
                  <User size={16} />
                  Username
                </Label>
                <Input
                  id="username"
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                  <Shield size={16} />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <Button type="submit" className="w-full h-11 text-base font-medium shadow-lg">
                <Shield className="w-4 h-4 mr-2" />
                Access Admin Panel
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border/50">
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  System Online
                </div>
                <div>v2.1.0</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center space-y-3">
          <p className="text-xs text-muted-foreground font-medium">
            © 2026 Indo American School. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Designed & Developed by Pratikk Yadav aka Punit and Team • +91 8307224756 • 2024 Passout
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border shadow-lg transform transition-transform duration-200 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg">Admin Panel</h2>
              <p className="text-xs text-muted-foreground">Indo American School</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <div className="space-y-1">
              <button
                onClick={() => { setActiveSection("dashboard"); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeSection === "dashboard" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                  }`}
              >
                <BarChart3 size={18} />
                Dashboard
              </button>

              <button
                onClick={() => { setActiveSection("announcements"); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeSection === "announcements" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                  }`}
              >
                <Bell size={18} />
                Announcements
              </button>

              <button
                onClick={() => { setActiveSection("events"); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeSection === "events" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                  }`}
              >
                <Calendar size={18} />
                Events
              </button>

              <button
                onClick={() => { setActiveSection("pastEvents"); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeSection === "pastEvents" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                  }`}
              >
                <Calendar size={18} />
                Past Events
              </button>

              <button
                onClick={() => { setActiveSection("enquiries"); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeSection === "enquiries" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                  }`}
              >
                <Users size={18} />
                Admission Enquiries
              </button>

              <button
                onClick={() => { setActiveSection("teacherApplications"); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeSection === "teacherApplications" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                  }`}
              >
                <FileText size={18} />
                Teacher Applications
              </button>

              <button
                onClick={() => { setActiveSection("messages"); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeSection === "messages" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                  }`}
              >
                <Mail size={18} />
                Contact Messages
              </button>

              <button
                onClick={() => { setActiveSection("gallery"); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeSection === "gallery" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                  }`}
              >
                <Image size={18} />
                Gallery
              </button>

              <button
                onClick={() => { setActiveSection("documents"); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeSection === "documents" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                  }`}
              >
                <FileText size={18} />
                Documents
              </button>

              <button
                onClick={() => { setActiveSection("siteImages"); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeSection === "siteImages" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                  }`}
              >
                <Settings size={18} />
                Site Images
              </button>
            </div>
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <User size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Administrator</p>
                <p className="text-xs text-muted-foreground">Logged in</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full justify-start"
              size="sm"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        {/* Header */}
        <header className="bg-card border-b border-border px-4 lg:px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
              <div>
                <h1 className="text-xl lg:text-2xl font-display font-bold text-foreground">
                  {activeSection === "dashboard" ? "Dashboard" :
                    activeSection === "announcements" ? "Announcements Management" :
                      activeSection === "events" ? "Events Management" :
                        activeSection === "pastEvents" ? "Past Events Management" :
                          activeSection === "enquiries" ? "Admission Enquiries" :
                            activeSection === "teacherApplications" ? "Teacher Applications" :
                              activeSection === "messages" ? "Contact Messages" :
                        activeSection === "gallery" ? "Gallery Management" :
                                  activeSection === "documents" ? "Documents Management" :
                                    activeSection === "siteImages" ? "Site Images Management" : "Dashboard"}
                </h1>
                <p className="text-muted-foreground text-xs lg:text-sm">Welcome back, Administrator</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{new Date().toLocaleDateString()}</p>
                <p className="text-xs text-muted-foreground">{new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 lg:p-6">
          {activeSection === "dashboard" && (
            <>
              {/* Stats Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Announcements</p>
                        <p className="text-2xl font-bold">{announcements.length}</p>
                      </div>
                      <Bell className="w-6 h-6 lg:w-8 lg:h-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Events</p>
                        <p className="text-2xl font-bold">{events.length}</p>
                      </div>
                      <Calendar className="w-6 h-6 lg:w-8 lg:h-8 text-secondary" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Enquiries</p>
                        <p className="text-2xl font-bold">{enquiries.length}</p>
                      </div>
                      <Users className="w-6 h-6 lg:w-8 lg:h-8 text-accent" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Messages</p>
                        <p className="text-2xl font-bold">{messages.length}</p>
                      </div>
                      <Mail className="w-6 h-6 lg:w-8 lg:h-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {activeSection === "announcements" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bell size={20} />
                  Announcements
                </CardTitle>
                <Button onClick={() => setDialogOpen("announcement")} size="sm">
                  <Plus size={16} className="mr-2" />
                  Add New
                </Button>
              </CardHeader>
              <CardContent>
                {dataState.announcements.loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : dataState.announcements.error ? (
                  <div className="text-center py-8 text-destructive">
                    <p>{dataState.announcements.error}</p>
                  </div>
                ) : announcements.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No announcements yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Urgent</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {announcements.map((announcement) => (
                          <TableRow key={announcement.id}>
                            <TableCell className="font-medium min-w-[150px]">{announcement.title}</TableCell>
                            <TableCell className="max-w-xs truncate min-w-[200px]" title={announcement.description}>
                              {(announcement.description ?? '').length > 100 ? `${(announcement.description ?? '').substring(0, 100)}...` : (announcement.description ?? 'No description')}
                            </TableCell>
                            <TableCell className="min-w-[100px]">
                              <Badge variant={announcement.urgent ? "destructive" : "secondary"}>
                                {announcement.type || 'General'}
                              </Badge>
                            </TableCell>
                            <TableCell className="min-w-[80px]">
                              {announcement.urgent ? <Badge variant="destructive">Yes</Badge> : <Badge variant="secondary">No</Badge>}
                            </TableCell>
                            <TableCell className="min-w-[120px]">{safeFormat(announcement.created_at, "MMM dd, yyyy")}</TableCell>
                            <TableCell className="min-w-[120px]">
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => { setEditingAnnouncement(announcement); setDialogOpen("announcement"); }}>
                                  <Edit size={14} />
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => deleteItem(`/api/announcements/${announcement.id}`, "Announcement deleted")}>
                                  <Trash2 size={14} />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeSection === "events" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar size={20} />
                  Events
                </CardTitle>
                <Button onClick={() => setDialogOpen("event")} size="sm">
                  <Plus size={16} className="mr-2" />
                  Add New
                </Button>
              </CardHeader>
              <CardContent>
                {dataState.events.loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : dataState.events.error ? (
                  <div className="text-center py-8 text-destructive">
                    <p>{dataState.events.error}</p>
                  </div>
                ) : events.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No events yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Venue</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {events.map((event) => (
                          <TableRow key={event.id}>
                            <TableCell className="font-medium min-w-[150px]">{event.title}</TableCell>
                            <TableCell className="max-w-xs truncate min-w-[200px]" title={event.description}>
                              {(event.description ?? '').length > 100 ? `${(event.description ?? '').substring(0, 100)}...` : (event.description ?? 'No description')}
                            </TableCell>
                            <TableCell className="min-w-[120px]">{safeFormat(event.date, "MMM dd, yyyy")}</TableCell>
                            <TableCell className="min-w-[100px]">{event.time}</TableCell>
                            <TableCell className="min-w-[120px]">{event.venue}</TableCell>
                            <TableCell className="min-w-[120px]">
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => { setEditingEvent(event); setDialogOpen("event"); }}>
                                  <Edit size={14} />
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => deleteItem(`/api/events/${event.id}`, "Event deleted")}>
                                  <Trash2 size={14} />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeSection === "pastEvents" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar size={20} />
                  Past Events
                </CardTitle>
                <Button onClick={() => setDialogOpen("pastEvent")} size="sm">
                  <Plus size={16} className="mr-2" />
                  Add New
                </Button>
              </CardHeader>
              <CardContent>
                {dataState.pastEvents.loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : dataState.pastEvents.error ? (
                  <div className="text-center py-8 text-destructive">
                    <p>{dataState.pastEvents.error}</p>
                  </div>
                ) : pastEvents.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No past events yet</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Venue</TableHead>
                        <TableHead>Photos</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pastEvents.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell className="font-medium">{event.title}</TableCell>
                          <TableCell className="max-w-xs truncate" title={event.description}>
                            {(event.description ?? '').length > 100 ? `${(event.description ?? '').substring(0, 100)}...` : (event.description ?? 'No description')}
                          </TableCell>
                          <TableCell>{safeFormat(event.date, "MMM dd, yyyy")}</TableCell>
                          <TableCell>{event.time}</TableCell>
                          <TableCell>{event.venue}</TableCell>
                          <TableCell>{event.photos?.length || 0} photos</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => { setEditingEvent(event); setDialogOpen("pastEvent"); }}>
                                <Edit size={14} />
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => deleteItem(`/api/past-events/${event.id}`, "Past event deleted")}>
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          )}

          {activeSection === "enquiries" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users size={20} />
                  Admission Enquiries
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dataState.enquiries.loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : dataState.enquiries.error ? (
                  <div className="text-center py-8 text-destructive">
                    <p>{dataState.enquiries.error}</p>
                  </div>
                ) : enquiries.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No enquiries found.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student Name</TableHead>
                          <TableHead>Parent Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Class Applied</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {enquiries.map((enquiry) => (
                          <TableRow key={enquiry.id}>
                            <TableCell className="font-medium min-w-[140px]">{enquiry.student_name}</TableCell>
                            <TableCell className="min-w-[140px]">{enquiry.parent_name}</TableCell>
                            <TableCell className="min-w-[200px]">
                              <a href={`mailto:${enquiry.email}`} className="text-blue-600 hover:underline">{enquiry.email}</a>
                            </TableCell>
                            <TableCell className="min-w-[120px]">{enquiry.phone}</TableCell>
                            <TableCell className="min-w-[120px]">{enquiry.class_applied}</TableCell>
                            <TableCell className="min-w-[100px]">
                              <Select
                                defaultValue={enquiry.status || "pending"}
                                onValueChange={(value) => updateItem(`/api/admission-enquiries/${enquiry.id}`, { status: value }, "Status updated")}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="reviewed">Reviewed</SelectItem>
                                  <SelectItem value="approved">Approved</SelectItem>
                                  <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>{safeFormat(enquiry.created_at, "MMM dd, yyyy HH:mm")}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => alert(`Additional Info: ${enquiry.additional_info || 'None'}`)}>
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => deleteItem(`/api/admission-enquiries/${enquiry.id}`, "Enquiry deleted")}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeSection === "teacherApplications" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText size={20} />
                  Teacher Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dataState.teacherApplications.loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : dataState.teacherApplications.error ? (
                  <div className="text-center py-8 text-destructive">
                    <p>{dataState.teacherApplications.error}</p>
                  </div>
                ) : teacherApplications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No teacher applications found.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Post</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teacherApplications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell className="font-medium">{application.name}</TableCell>
                          <TableCell>
                            <a href={`mailto:${application.email}`} className="text-blue-600 hover:underline">{application.email}</a>
                          </TableCell>
                          <TableCell>{application.phone}</TableCell>
                          <TableCell>{application.post}</TableCell>
                          <TableCell>{application.subject}</TableCell>
                          <TableCell>
                            <Select
                              defaultValue={application.status || "pending"}
                              onValueChange={(value) => updateItem(`/api/teacher-applications/${application.id}`, { status: value }, "Status updated")}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="reviewed">Reviewed</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>{safeFormat(application.created_at, "MMM dd, yyyy HH:mm")}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => alert(`Post: ${application.post}\nSubject: ${application.subject}`)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                              {application.resume_url && (
                                <Button variant="outline" size="sm" onClick={() => {
                                  const rUrl = application.resume_url;
                                  const target = rUrl.startsWith('http') ? rUrl : `/uploads/${rUrl.split('/').pop()}`;
                                  setPdfViewer({ url: target, title: `${(application as any).full_name || application.name || 'Applicant'}'s Resume` });
                                }}>
                                  <Eye className="w-4 h-4" />
                                </Button>
                              )}
                              <Button variant="destructive" size="sm" onClick={() => deleteItem(`/api/teacher-applications/${application.id}`, "Application deleted")}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          )}

          {activeSection === "messages" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail size={20} />
                  Contact Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dataState.messages.loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : dataState.messages.error ? (
                  <div className="text-center py-8 text-destructive">
                    <p>{dataState.messages.error}</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Mail size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No messages found.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Received</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {messages.map((message) => (
                        <TableRow key={message.id}>
                          <TableCell className="font-medium">{message.name}</TableCell>
                          <TableCell>
                            <a href={`mailto:${message.email}`} className="text-blue-600 hover:underline">{message.email}</a>
                          </TableCell>
                          <TableCell>{message.phone || '-'}</TableCell>
                          <TableCell>{message.subject || 'No Subject'}</TableCell>
                          <TableCell className="max-w-xs truncate" title={message.message}>
                            {message.message.length > 100 ? `${message.message.substring(0, 100)}...` : message.message}
                          </TableCell>
                          <TableCell>{safeFormat(message.created_at, "MMM dd, yyyy HH:mm")}</TableCell>
                          <TableCell>
                            <Badge variant={message.read ? "secondary" : "default"}>
                              {message.read ? "Read" : "Unread"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {!message.read && (
                                <Button variant="outline" size="sm" onClick={() => updateItem(`/api/contact-messages/${message.id}`, { read: true }, "Marked as read")}>
                                  <Eye className="w-4 h-4" />
                                </Button>
                              )}
                              <Button variant="destructive" size="sm" onClick={() => deleteItem(`/api/contact-messages/${message.id}`, "Message deleted")}>
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          )}

          {activeSection === "gallery" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Image size={20} />
                  Gallery Management
                </CardTitle>
                <Button onClick={() => setDialogOpen("gallery")} size="sm">
                  <Plus size={16} className="mr-2" />
                  Add Images
                </Button>
              </CardHeader>
              <CardContent>
                {dataState.gallery.loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : dataState.gallery.error ? (
                  <div className="text-center py-8 text-destructive">
                    <p>{dataState.gallery.error}</p>
                  </div>
                ) : gallery.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Image size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No images in gallery</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {gallery.map((image) => (
                      <div key={image.id} className="relative group">
                        <img src={`${image.image_url}?width=300&height=300&quality=80&format=webp`} alt={image.title} className="w-full h-48 object-cover rounded-md" loading="lazy" />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-md flex items-center justify-center">
                          <Button variant="destructive" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deleteItem(`/api/gallery/${image.id}`, "Image deleted")}>
                            <Trash2 size={16} />
                          </Button>
                        </div>
                        {image.title && (
                          <p className="text-sm text-center mt-2 truncate" title={image.title}>{image.title}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeSection === "documents" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText size={20} />
                  Documents Management
                </CardTitle>
                <Button onClick={() => setDialogOpen("document")} size="sm">
                  <Plus size={16} className="mr-2" />
                  Add New
                </Button>
              </CardHeader>
              <CardContent>
                {dataState.documents.loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : dataState.documents.error ? (
                  <div className="text-center py-8 text-destructive">
                    <p>{dataState.documents.error}</p>
                  </div>
                ) : documents.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No documents yet</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Required</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium">{doc.title}</TableCell>
                          <TableCell>{doc.category}</TableCell>
                          <TableCell className="max-w-xs truncate" title={doc.description}>
                            {(doc.description ?? '').length > 100 ? `${(doc.description ?? '').substring(0, 100)}...` : (doc.description ?? 'No description')}
                          </TableCell>
                          <TableCell>{doc.type}</TableCell>
                          <TableCell>{doc.size}</TableCell>
                          <TableCell>
                            {doc.required ? <Badge variant="destructive">Required</Badge> : <Badge variant="secondary">Optional</Badge>}
                          </TableCell>
                          <TableCell>{doc.lastUpdated}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => { setEditingDocument(doc); setDialogOpen("document"); }}>
                                <Edit size={14} />
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => deleteItem(`/api/documents/${doc.id}`, "Document deleted")}>
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          )}

          {activeSection === "siteImages" && (
            <div className="space-y-6">
              {/* ===== HERO SLIDES MANAGEMENT ===== */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Image size={20} />
                      Hero Slides
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add, edit, or delete homepage hero slider images. Upload from your device.
                    </p>
                  </div>
                  <Button size="sm" onClick={() => { setEditingHeroSlide(null); setNewHeroSlide({ title: '', subtitle: '', description: '', accent: '', sort_order: '0', image: null }); setDialogOpen('heroSlide'); }}>
                    <Plus size={16} className="mr-2" />
                    Add Slide
                  </Button>
                </CardHeader>
                <CardContent>
                  {heroSlides.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Image size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No hero slides yet. Add your first slide above.</p>
                      <p className="text-xs mt-1">The homepage will show default slides until you add custom ones.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {heroSlides.map((slide) => (
                        <div key={slide.id} className="border border-border rounded-xl overflow-hidden bg-card hover:shadow-md transition-shadow">
                          <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                            <img src={slide.image_url} alt={slide.title} className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                              <p className="text-white text-sm font-bold truncate">{slide.title}</p>
                              {slide.subtitle && <p className="text-white/70 text-xs truncate">{slide.subtitle}</p>}
                            </div>
                          </div>
                          <div className="p-3">
                            {slide.accent && <Badge variant="secondary" className="text-[10px] mb-2">{slide.accent}</Badge>}
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{slide.description}</p>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => {
                                setEditingHeroSlide(slide);
                                setNewHeroSlide({ title: slide.title, subtitle: slide.subtitle || '', description: slide.description || '', accent: slide.accent || '', sort_order: String(slide.sort_order || 0), image: null });
                                setDialogOpen('heroSlide');
                              }}>
                                <Edit size={12} className="mr-1" /> Edit
                              </Button>
                              <Button size="sm" variant="destructive" className="text-xs" onClick={() => {
                                if (confirm('Delete this hero slide?')) {
                                  deleteItem(`/api/hero-slides/${slide.id}`, 'Hero slide deleted');
                                }
                              }}>
                                <Trash2 size={12} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* ===== ABOUT / SITE IMAGES MANAGEMENT ===== */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Settings size={20} />
                      Section Images
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Manage about section and other site images. Upload, replace, or delete.
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => {
                    const label = prompt('Image label (e.g. "About Image 4")');
                    if (!label) return;
                    const category = prompt('Category (e.g. "About Section")', 'About Section');
                    if (!category) return;
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = async (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (!file) return;
                      try {
                        const formData = new FormData();
                        formData.append('image', file);
                        formData.append('label', label);
                        formData.append('category', category);
                        const token = sessionStorage.getItem('adminToken');
                        const res = await fetch('/api/site-images', {
                          method: 'POST',
                          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                          body: formData,
                        });
                        if (res.ok) {
                          toast({ title: 'Image added successfully!' });
                          fetchAllData();
                        } else {
                          const err = await res.json();
                          toast({ title: 'Failed to add', description: err.error, variant: 'destructive' });
                        }
                      } catch {
                        toast({ title: 'Failed to add', description: 'Network error', variant: 'destructive' });
                      }
                    };
                    input.click();
                  }}>
                    <Plus size={16} className="mr-2" />
                    Add Image
                  </Button>
                </CardHeader>
                <CardContent>
                  {dataState.siteImages.loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  ) : (() => {
                    const categories = [...new Set(siteImages.map(img => img.category))];
                    return categories.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Image size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No section images yet. Click "Add Image" to start.</p>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {categories.map(category => (
                          <div key={category}>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-primary"></span>
                              {category}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {siteImages.filter(img => img.category === category).map(img => (
                                <div key={img.slot_key} className="border border-border rounded-xl overflow-hidden bg-card hover:shadow-md transition-shadow">
                                  <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                                    {img.image_url ? (
                                      <img src={img.image_url} alt={img.label} className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                                        <Image size={32} className="opacity-30 mb-2" />
                                        <span className="text-xs">No image uploaded</span>
                                      </div>
                                    )}
                                    {uploadingSlot === img.slot_key && (
                                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <div className="animate-spin w-8 h-8 border-3 border-white border-t-transparent rounded-full"></div>
                                      </div>
                                    )}
                                  </div>
                                  <div className="p-3">
                                    <p className="text-sm font-medium mb-2 truncate">{img.label}</p>
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex-1 text-xs"
                                        disabled={uploadingSlot === img.slot_key}
                                        onClick={() => {
                                          setUploadingSlot(img.slot_key);
                                          const input = document.createElement('input');
                                          input.type = 'file';
                                          input.accept = 'image/*';
                                          input.onchange = async (e) => {
                                            const file = (e.target as HTMLInputElement).files?.[0];
                                            if (!file) { setUploadingSlot(null); return; }
                                            try {
                                              const formData = new FormData();
                                              formData.append('image', file);
                                              const token = sessionStorage.getItem('adminToken');
                                              const res = await fetch(`/api/site-images/${img.slot_key}`, {
                                                method: 'PUT',
                                                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                                                body: formData,
                                              });
                                              if (res.ok) {
                                                toast({ title: 'Image updated!' });
                                                fetchAllData();
                                              } else {
                                                const err = await res.json();
                                                toast({ title: 'Upload failed', description: err.error, variant: 'destructive' });
                                              }
                                            } catch { toast({ title: 'Upload failed', variant: 'destructive' }); }
                                            finally { setUploadingSlot(null); }
                                          };
                                          input.click();
                                        }}
                                      >
                                        <Upload size={12} className="mr-1" />
                                        {img.image_url ? 'Replace' : 'Upload'}
                                      </Button>
                                      <Button size="sm" variant="destructive" className="text-xs" onClick={() => {
                                        if (confirm(`Delete "${img.label}"?`)) {
                                          deleteItem(`/api/site-images/${img.slot_key}`, 'Image deleted');
                                        }
                                      }}>
                                        <Trash2 size={12} />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            </div>
          )}
        </main>

        {/* Hero Slide Add/Edit Dialog */}
        <Dialog open={dialogOpen === "heroSlide"} onOpenChange={() => { setDialogOpen(null); setEditingHeroSlide(null); }}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingHeroSlide ? 'Edit Hero Slide' : 'Add Hero Slide'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Title *</Label>
                <Input value={newHeroSlide.title} onChange={(e) => setNewHeroSlide(prev => ({ ...prev, title: e.target.value }))} placeholder="Welcome to Indo American School" />
              </div>
              <div>
                <Label>Subtitle</Label>
                <Input value={newHeroSlide.subtitle} onChange={(e) => setNewHeroSlide(prev => ({ ...prev, subtitle: e.target.value }))} placeholder="Excellence in Education" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={newHeroSlide.description} onChange={(e) => setNewHeroSlide(prev => ({ ...prev, description: e.target.value }))} placeholder="Short description..." rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Accent Text</Label>
                  <Input value={newHeroSlide.accent} onChange={(e) => setNewHeroSlide(prev => ({ ...prev, accent: e.target.value }))} placeholder="23+ Years of Trust" />
                </div>
                <div>
                  <Label>Sort Order</Label>
                  <Input type="number" value={newHeroSlide.sort_order} onChange={(e) => setNewHeroSlide(prev => ({ ...prev, sort_order: e.target.value }))} />
                </div>
              </div>
              <div>
                <Label>Image {editingHeroSlide ? '(leave empty to keep current)' : '*'}</Label>
                <Input type="file" accept="image/*" onChange={(e) => setNewHeroSlide(prev => ({ ...prev, image: e.target.files?.[0] || null }))} />
                {editingHeroSlide && editingHeroSlide.image_url && (
                  <div className="mt-2 rounded-lg overflow-hidden border h-24">
                    <img src={editingHeroSlide.image_url} alt="Current" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <Button
                className="w-full"
                disabled={!newHeroSlide.title || (!editingHeroSlide && !newHeroSlide.image)}
                onClick={async () => {
                  try {
                    const formData = new FormData();
                    formData.append('title', newHeroSlide.title);
                    formData.append('subtitle', newHeroSlide.subtitle);
                    formData.append('description', newHeroSlide.description);
                    formData.append('accent', newHeroSlide.accent);
                    formData.append('sort_order', newHeroSlide.sort_order);
                    if (newHeroSlide.image) formData.append('image', newHeroSlide.image);
                    if (editingHeroSlide) formData.append('image_url', editingHeroSlide.image_url);
                    const token = sessionStorage.getItem('adminToken');
                    const url = editingHeroSlide ? `/api/hero-slides/${editingHeroSlide.id}` : '/api/hero-slides';
                    const method = editingHeroSlide ? 'PUT' : 'POST';
                    const res = await fetch(url, {
                      method,
                      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                      body: formData,
                    });
                    if (res.ok) {
                      toast({ title: editingHeroSlide ? 'Slide updated!' : 'Slide added!' });
                      setDialogOpen(null);
                      setEditingHeroSlide(null);
                      fetchAllData();
                    } else {
                      const err = await res.json();
                      toast({ title: 'Failed', description: err.error, variant: 'destructive' });
                    }
                  } catch {
                    toast({ title: 'Failed', description: 'Network error', variant: 'destructive' });
                  }
                }}
              >
                {editingHeroSlide ? 'Save Changes' : 'Add Slide'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modals/Dialogs */}
        <Dialog open={dialogOpen === "announcement"} onOpenChange={() => { setDialogOpen(null); setEditingAnnouncement(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingAnnouncement ? "Edit Announcement" : "Add Announcement"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Title" value={editingAnnouncement?.title || newAnnouncement.title} onChange={(e) => editingAnnouncement ? setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value }) : setNewAnnouncement({ ...newAnnouncement, title: e.target.value })} />
              <Textarea placeholder="Description" value={editingAnnouncement?.description || newAnnouncement.description} onChange={(e) => editingAnnouncement ? setEditingAnnouncement({ ...editingAnnouncement, description: e.target.value }) : setNewAnnouncement({ ...newAnnouncement, description: e.target.value })} />
              <select value={editingAnnouncement?.type || newAnnouncement.type} onChange={(e) => editingAnnouncement ? setEditingAnnouncement({ ...editingAnnouncement, type: e.target.value }) : setNewAnnouncement({ ...newAnnouncement, type: e.target.value })}>
                <option value="general">General</option>
                <option value="academic">Academic</option>
                <option value="admission">Admission</option>
                <option value="holiday">Holiday</option>
              </select>
              <div className="flex items-center space-x-2">
                <Switch id="urgent" checked={editingAnnouncement?.urgent || newAnnouncement.urgent} onCheckedChange={(checked) => editingAnnouncement ? setEditingAnnouncement({ ...editingAnnouncement, urgent: checked }) : setNewAnnouncement({ ...newAnnouncement, urgent: checked })} />
                <Label htmlFor="urgent">Urgent</Label>
              </div>
              <Button onClick={() => {
                const body = {
                  title: editingAnnouncement?.title || newAnnouncement.title,
                  description: editingAnnouncement?.description || newAnnouncement.description,
                  type: editingAnnouncement?.type || newAnnouncement.type,
                  urgent: editingAnnouncement?.urgent || newAnnouncement.urgent,
                };
                if (editingAnnouncement) {
                  updateItem(`/api/announcements/${editingAnnouncement.id}`, body, "Announcement updated");
                } else {
                  addItem('/api/announcements', body, "Announcement added");
                }
              }}>{editingAnnouncement ? "Update" : "Add"}</Button>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={dialogOpen === "event"} onOpenChange={() => { setDialogOpen(null); setEditingEvent(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingEvent ? "Edit Event" : "Add Event"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Title" value={editingEvent?.title || newEvent.title} onChange={(e) => editingEvent ? setEditingEvent({ ...editingEvent, title: e.target.value }) : setNewEvent({ ...newEvent, title: e.target.value })} />
              <Textarea placeholder="Description" value={editingEvent?.description || newEvent.description} onChange={(e) => editingEvent ? setEditingEvent({ ...editingEvent, description: e.target.value }) : setNewEvent({ ...newEvent, description: e.target.value })} />
              <Input type="date" value={editingEvent?.date || newEvent.date} onChange={(e) => editingEvent ? setEditingEvent({ ...editingEvent, date: e.target.value }) : setNewEvent({ ...newEvent, date: e.target.value })} />
              <Input placeholder="Time" value={editingEvent?.time || newEvent.time} onChange={(e) => editingEvent ? setEditingEvent({ ...editingEvent, time: e.target.value }) : setNewEvent({ ...newEvent, time: e.target.value })} />
              <Input placeholder="Venue" value={editingEvent?.venue || newEvent.venue} onChange={(e) => editingEvent ? setEditingEvent({ ...editingEvent, venue: e.target.value }) : setNewEvent({ ...newEvent, venue: e.target.value })} />
              <Label htmlFor="image">Image</Label>
              <Input id="image" type="file" onChange={(e) => {
                const file = e.target.files?.[0] || null;
                if (editingEvent) {
                  setNewEvent({ ...newEvent, image: file });
                  setEditingEvent({ ...editingEvent, image_url: file ? URL.createObjectURL(file) : null });
                } else {
                  setNewEvent({ ...newEvent, image: file });
                }
              }} />
              <Button onClick={() => {
                const formData = new FormData();
                formData.append('title', editingEvent?.title || newEvent.title);
                formData.append('description', editingEvent?.description || newEvent.description);
                formData.append('date', editingEvent?.date || newEvent.date);
                formData.append('time', editingEvent?.time || newEvent.time);
                formData.append('venue', editingEvent?.venue || newEvent.venue);

                if (editingEvent) {
                  if (newEvent.image) {
                    formData.append('image', newEvent.image);
                  }
                  updateItem(`/api/events/${editingEvent.id}`, formData, "Event updated", true);
                } else {
                  if (newEvent.image) {
                    formData.append('image', newEvent.image);
                  }
                  addItem('/api/events', formData, "Event added", true);
                }
              }}>{editingEvent ? "Update" : "Add"}</Button>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={dialogOpen === "pastEvent"} onOpenChange={() => { setDialogOpen(null); setEditingEvent(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingEvent ? "Edit Past Event" : "Add Past Event"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Title" value={editingEvent?.title || newPastEvent.title} onChange={(e) => editingEvent ? setEditingEvent({ ...editingEvent, title: e.target.value }) : setNewPastEvent({ ...newPastEvent, title: e.target.value })} />
              <Textarea placeholder="Description" value={editingEvent?.description || newPastEvent.description} onChange={(e) => editingEvent ? setEditingEvent({ ...editingEvent, description: e.target.value }) : setNewPastEvent({ ...newPastEvent, description: e.target.value })} />
              <Input type="date" value={editingEvent?.date || newPastEvent.date} onChange={(e) => editingEvent ? setEditingEvent({ ...editingEvent, date: e.target.value }) : setNewPastEvent({ ...newPastEvent, date: e.target.value })} />
              <Input placeholder="Time" value={editingEvent?.time || newPastEvent.time} onChange={(e) => editingEvent ? setEditingEvent({ ...editingEvent, time: e.target.value }) : setNewPastEvent({ ...newPastEvent, time: e.target.value })} />
              <Input placeholder="Venue" value={editingEvent?.venue || newPastEvent.venue} onChange={(e) => editingEvent ? setEditingEvent({ ...editingEvent, venue: e.target.value }) : setNewPastEvent({ ...newPastEvent, venue: e.target.value })} />
              <Label htmlFor="photos">Photos</Label>
              <Input id="photos" type="file" multiple onChange={(e) => setNewPastEvent({ ...newPastEvent, photos: e.target.files })} />
              <Button onClick={() => {
                const formData = new FormData();
                formData.append('title', editingEvent?.title || newPastEvent.title);
                formData.append('description', editingEvent?.description || newPastEvent.description);
                formData.append('date', editingEvent?.date || newPastEvent.date);
                formData.append('time', editingEvent?.time || newPastEvent.time);
                formData.append('venue', editingEvent?.venue || newPastEvent.venue);
                if (newPastEvent.photos) {
                  Array.from(newPastEvent.photos).forEach(file => formData.append('photos', file));
                }
                if (editingEvent) {
                  updateItem(`/api/past-events/${editingEvent.id}`, formData, "Past event updated", true);
                } else {
                  addItem('/api/past-events', formData, "Past event added", true);
                }
              }}>{editingEvent ? "Update" : "Add"}</Button>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={dialogOpen === "gallery"} onOpenChange={() => setDialogOpen(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Gallery Images</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Title (optional, will use filename if empty)" value={newGalleryImage.title} onChange={(e) => setNewGalleryImage({ ...newGalleryImage, title: e.target.value })} />
              <Select value={newGalleryImage.category} onValueChange={(value) => setNewGalleryImage({ ...newGalleryImage, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Year" value={newGalleryImage.year} onChange={(e) => setNewGalleryImage({ ...newGalleryImage, year: e.target.value })} />
              <Label htmlFor="images">Images</Label>
              <Input id="images" type="file" multiple onChange={(e) => setNewGalleryImage({ ...newGalleryImage, images: e.target.files })} />
              <Button onClick={() => {
                const formData = new FormData();
                formData.append('title', newGalleryImage.title);
                formData.append('category', newGalleryImage.category);
                formData.append('year', newGalleryImage.year);
                if (newGalleryImage.images) {
                  Array.from(newGalleryImage.images).forEach(file => formData.append('images', file));
                }
                addItem('/api/gallery', formData, "Images added", true);
              }}>Add Images</Button>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={dialogOpen === "document"} onOpenChange={() => { setDialogOpen(null); setEditingDocument(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingDocument ? "Edit Document" : "Add Document"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Category" value={editingDocument?.category || newDocument.category} onChange={(e) => editingDocument ? setEditingDocument({ ...editingDocument, category: e.target.value }) : setNewDocument({ ...newDocument, category: e.target.value })} />
              <Input placeholder="Title" value={editingDocument?.title || newDocument.title} onChange={(e) => editingDocument ? setEditingDocument({ ...editingDocument, title: e.target.value }) : setNewDocument({ ...newDocument, title: e.target.value })} />
              <Textarea placeholder="Description" value={editingDocument?.description || newDocument.description} onChange={(e) => editingDocument ? setEditingDocument({ ...editingDocument, description: e.target.value }) : setNewDocument({ ...newDocument, description: e.target.value })} />
              <Input placeholder="Type" value={editingDocument?.type || newDocument.type} onChange={(e) => editingDocument ? setEditingDocument({ ...editingDocument, type: e.target.value }) : setNewDocument({ ...newDocument, type: e.target.value })} />
              <Input placeholder="Size" value={editingDocument?.size || newDocument.size} onChange={(e) => editingDocument ? setEditingDocument({ ...editingDocument, size: e.target.value }) : setNewDocument({ ...newDocument, size: e.target.value })} />
              <Input placeholder="Last Updated" value={editingDocument?.lastUpdated || newDocument.lastUpdated} onChange={(e) => editingDocument ? setEditingDocument({ ...editingDocument, lastUpdated: e.target.value }) : setNewDocument({ ...newDocument, lastUpdated: e.target.value })} />
              <div className="flex items-center space-x-2">
                <Switch id="required" checked={editingDocument?.required || newDocument.required} onCheckedChange={(checked) => editingDocument ? setEditingDocument({ ...editingDocument, required: checked }) : setNewDocument({ ...newDocument, required: checked })} />
                <Label htmlFor="required">Required</Label>
              </div>
              <Label htmlFor="file_url">File URL (for external links like Google Drive)</Label>
              <Input id="file_url" placeholder="https://drive.google.com/..." value={editingDocument?.file_url || newDocument.file_url} onChange={(e) => editingDocument ? setEditingDocument({ ...editingDocument, file_url: e.target.value }) : setNewDocument({ ...newDocument, file_url: e.target.value })} />
              <Button onClick={() => {
                const body = {
                  category: editingDocument?.category || newDocument.category,
                  title: editingDocument?.title || newDocument.title,
                  description: editingDocument?.description || newDocument.description,
                  type: editingDocument?.type || newDocument.type,
                  size: editingDocument?.size || newDocument.size,
                  lastUpdated: editingDocument?.lastUpdated || newDocument.lastUpdated,
                  required: editingDocument?.required || newDocument.required,
                  file_url: editingDocument?.file_url || newDocument.file_url,
                };
                if (editingDocument) {
                  updateItem(`/api/documents/${editingDocument.id}`, body, "Document updated");
                } else {
                  addItem('/api/documents', body, "Document added");
                }
              }}>{editingDocument ? "Update" : "Add"}</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Enquiries Dialog */}
        <Dialog open={dialogOpen === "enquiries"} onOpenChange={() => setDialogOpen(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Admission Enquiries</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {dataState.enquiries.loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : dataState.enquiries.error ? (
                <div className="text-center py-8 text-destructive">
                  <p>{dataState.enquiries.error}</p>
                </div>
              ) : enquiries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No enquiries found.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Parent Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Class Applied</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enquiries.map((enquiry) => (
                      <TableRow key={enquiry.id}>
                        <TableCell className="font-medium">{enquiry.student_name}</TableCell>
                        <TableCell>{enquiry.parent_name}</TableCell>
                        <TableCell>
                          <a href={`mailto:${enquiry.email}`} className="text-blue-600 hover:underline">{enquiry.email}</a>
                        </TableCell>
                        <TableCell>{enquiry.phone}</TableCell>
                        <TableCell>{enquiry.class_applied}</TableCell>
                        <TableCell>
                          <Select
                            defaultValue={enquiry.status || "pending"}
                            onValueChange={(value) => updateItem(`/api/admission-enquiries/${enquiry.id}`, { status: value }, "Status updated")}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="reviewed">Reviewed</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>{safeFormat(enquiry.created_at, "MMM dd, yyyy HH:mm")}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => alert(`Additional Info: ${enquiry.additional_info || 'None'}`)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => deleteItem(`/api/admission-enquiries/${enquiry.id}`, "Enquiry deleted")}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Teacher Applications Dialog */}
        <Dialog open={dialogOpen === "teacherApplications"} onOpenChange={() => setDialogOpen(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Teacher Applications</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {dataState.teacherApplications.loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : dataState.teacherApplications.error ? (
                <div className="text-center py-8 text-destructive">
                  <p>{dataState.teacherApplications.error}</p>
                </div>
              ) : teacherApplications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No teacher applications found.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Post</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teacherApplications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell className="font-medium">{application.name}</TableCell>
                        <TableCell>
                          <a href={`mailto:${application.email}`} className="text-blue-600 hover:underline">{application.email}</a>
                        </TableCell>
                        <TableCell>{application.phone}</TableCell>
                        <TableCell>{application.post}</TableCell>
                        <TableCell>{application.subject}</TableCell>
                        <TableCell>
                          <Select
                            defaultValue={application.status || "pending"}
                            onValueChange={(value) => updateItem(`/api/teacher-applications/${application.id}`, { status: value }, "Status updated")}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="reviewed">Reviewed</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>{format(new Date(application.created_at), "MMM dd, yyyy HH:mm")}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => alert(`Post: ${application.post}\nSubject: ${application.subject}`)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            {application.resume_url && (
                              <Button variant="outline" size="sm" onClick={() => {
                                const rUrl = application.resume_url;
                                const target = rUrl.startsWith('http') ? rUrl : `${import.meta.env.VITE_API_BASE_URL || ''}/uploads/${rUrl.split('/').pop()}`;
                                setPdfViewer({ url: target, title: `${(application as any).full_name || application.name || 'Applicant'}'s Resume` });
                              }}>
                                <Eye className="w-4 h-4" />
                              </Button>
                            )}
                            <Button variant="destructive" size="sm" onClick={() => deleteItem(`/api/teacher-applications/${application.id}`, "Application deleted")}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Messages Dialog */}
        <Dialog open={dialogOpen === "messages"} onOpenChange={() => setDialogOpen(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Contact Messages</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {dataState.messages.loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : dataState.messages.error ? (
                <div className="text-center py-8 text-destructive">
                  <p>{dataState.messages.error}</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Mail size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No messages found.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Received</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messages.map((message) => (
                      <TableRow key={message.id}>
                        <TableCell className="font-medium">{message.name}</TableCell>
                        <TableCell>
                          <a href={`mailto:${message.email}`} className="text-blue-600 hover:underline">{message.email}</a>
                        </TableCell>
                        <TableCell>{message.phone || '-'}</TableCell>
                        <TableCell>{message.subject || 'No Subject'}</TableCell>
                        <TableCell className="max-w-xs truncate" title={message.message}>
                          {message.message.length > 100 ? `${message.message.substring(0, 100)}...` : message.message}
                        </TableCell>
                        <TableCell>{format(new Date(message.created_at), "MMM dd, yyyy HH:mm")}</TableCell>
                        <TableCell>
                          <Badge variant={message.read ? "secondary" : "default"}>
                            {message.read ? "Read" : "Unread"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {!message.read && (
                              <Button variant="outline" size="sm" onClick={() => updateItem(`/api/contact-messages/${message.id}`, { read: true }, "Marked as read")}>
                                <Eye className="w-4 h-4" />
                              </Button>
                            )}
                            <Button variant="destructive" size="sm" onClick={() => deleteItem(`/api/contact-messages/${message.id}`, "Message deleted")}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialog?.open || false} onOpenChange={(open) => !open && setDeleteDialog(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-destructive" />
                Confirm Deletion
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Are you sure you want to delete this item? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialog(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDelete}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* PDF Viewer Dialog */}
        <Dialog open={!!pdfViewer} onOpenChange={() => setPdfViewer(null)}>
          <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="flex items-center justify-between">
                <span>{pdfViewer?.title}</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(pdfViewer?.url, '_blank')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </DialogTitle>
            </DialogHeader>

            {/* PDF Content */}
            <div className="flex-1 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
              {pdfViewer && (
                <iframe
                  src={pdfViewer.url.startsWith('http') && !pdfViewer.url.includes('docs.google.com')
                    ? `https://docs.google.com/viewer?url=${encodeURIComponent(pdfViewer.url)}&embedded=true`
                    : pdfViewer.url}
                  className="w-full h-full border-0 rounded-lg"
                  title={pdfViewer.title}
                  allowFullScreen
                />
              )}
            </div>

            {/* Footer with helpful text */}
            <div className="flex-shrink-0 mt-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="w-4 h-4" />
                <span>Use browser controls to zoom, navigate pages, and search within the PDF</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Footer */}
      <footer className="mt-8 py-6 border-t border-border bg-card/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 Indo American School. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Designed & Developed by Pratikk Yadav and Team • +91 8307224756 • 2024 Passout
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Admin;


