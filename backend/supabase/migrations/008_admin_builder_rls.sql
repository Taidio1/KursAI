-- Task 7: Final RLS updates for Admin Builder

-- Enable RLS (just in case they aren't already)
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slides ENABLE ROW LEVEL SECURITY;

-- Drop existing admin policies if they exist to avoid duplicates
DROP POLICY IF EXISTS "Admin full access lessons" ON public.lessons;
DROP POLICY IF EXISTS "Admin full access slides" ON public.slides;

-- Create full access policies for admins
CREATE POLICY "Admin full access lessons" 
ON public.lessons 
FOR ALL 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admin full access slides" 
ON public.slides 
FOR ALL 
USING (public.is_admin(auth.uid()));
