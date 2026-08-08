-- Create announcements table
CREATE TABLE public.announcements (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'general',
    urgent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TEXT,
    venue TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gallery table
CREATE TABLE public.gallery (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admission_enquiries table
CREATE TABLE public.admission_enquiries (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_name TEXT NOT NULL,
    parent_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    class_applied TEXT NOT NULL,
    additional_info TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contact_messages table
CREATE TABLE public.contact_messages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_users table for authentication
CREATE TABLE public.admin_users (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admission_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Public read policies for announcements, events, gallery
CREATE POLICY "Anyone can view announcements" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Anyone can view events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Anyone can view gallery" ON public.gallery FOR SELECT USING (true);

-- Public insert for enquiries and messages
CREATE POLICY "Anyone can submit admission enquiry" ON public.admission_enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can submit contact message" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Admin policies - authenticated users can manage all content
CREATE POLICY "Authenticated users can manage announcements" ON public.announcements FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage events" ON public.events FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage gallery" ON public.gallery FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can view enquiries" ON public.admission_enquiries FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can update enquiries" ON public.admission_enquiries FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete enquiries" ON public.admission_enquiries FOR DELETE TO authenticated USING (true);
CREATE POLICY "Authenticated users can view messages" ON public.contact_messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can update messages" ON public.contact_messages FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete messages" ON public.contact_messages FOR DELETE TO authenticated USING (true);
CREATE POLICY "Authenticated users can view admin_users" ON public.admin_users FOR SELECT TO authenticated USING (true);

-- Create storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);

-- Storage policies
CREATE POLICY "Anyone can view gallery images" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Authenticated users can upload gallery images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'gallery');
CREATE POLICY "Authenticated users can update gallery images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'gallery');
CREATE POLICY "Authenticated users can delete gallery images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'gallery');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();