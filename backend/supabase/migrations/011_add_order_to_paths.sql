-- Add order column to paths table
ALTER TABLE public.paths ADD COLUMN "order" INT DEFAULT 0;
