-- backend/supabase/migrations/006_add_notion_id.sql
ALTER TABLE public.lessons ADD COLUMN notion_id text UNIQUE;
