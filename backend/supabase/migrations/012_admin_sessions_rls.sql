-- Migration: 012_admin_sessions_rls
-- Allow admins to see all active sessions for the dashboard overview.

CREATE POLICY "Admins can select all sessions"
  ON public.active_sessions
  FOR SELECT
  USING (public.is_admin(auth.uid()));
