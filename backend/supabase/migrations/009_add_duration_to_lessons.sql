-- Add duration column to lessons table
ALTER TABLE public.lessons ADD COLUMN duration TEXT DEFAULT '10 min';
