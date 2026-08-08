-- Create teacher_applications table
CREATE TABLE public.teacher_applications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    qualification TEXT NOT NULL,
    experience TEXT NOT NULL,
    resume_url TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.teacher_applications ENABLE ROW LEVEL SECURITY;

-- Public insert policy
CREATE POLICY "Anyone can submit teacher application" ON public.teacher_applications FOR INSERT WITH CHECK (true);

-- Admin policies
CREATE POLICY "Authenticated users can view teacher applications" ON public.teacher_applications FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can update teacher applications" ON public.teacher_applications FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete teacher applications" ON public.teacher_applications FOR DELETE TO authenticated USING (true);

-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);

-- Storage policies
CREATE POLICY "Authenticated users can upload resumes" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'resumes');
CREATE POLICY "Authenticated users can view resumes" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'resumes');
CREATE POLICY "Authenticated users can update resumes" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'resumes');
CREATE POLICY "Authenticated users can delete resumes" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'resumes');

-- Create trigger for updated_at
CREATE TRIGGER update_teacher_applications_updated_at BEFORE UPDATE ON public.teacher_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();