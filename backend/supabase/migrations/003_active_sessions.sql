-- Migration: 003_active_sessions
-- Implements single-session enforcement: 1 account = 1 active session at a time.
-- When a user logs in from a new device/browser, the session_key changes and all
-- other active tabs/browsers detect the mismatch and sign out automatically.

CREATE TABLE IF NOT EXISTS public.active_sessions (
  user_id    UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  session_key TEXT       NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Row Level Security
ALTER TABLE public.active_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own session"
  ON public.active_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own session"
  ON public.active_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own session"
  ON public.active_sessions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own session"
  ON public.active_sessions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Enable Realtime for the table so clients can subscribe to changes
ALTER PUBLICATION supabase_realtime ADD TABLE public.active_sessions;
