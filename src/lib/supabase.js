import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// When keys are absent, the whole app runs in local demo mode:
// no auth gate, no persistence, seed data only.
export const isConfigured = Boolean(url && key);

export const supabase = isConfigured ? createClient(url, key) : null;
