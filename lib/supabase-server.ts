import { createClient } from "@supabase/supabase-js";

export type RsvpInsert = {
  guest_name: string;
  attendance_status: "attending" | "not_attending";
  attendee_count: number;
  message: string | null;
};

export function createSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) {
    throw new Error(
      "Supabase server environment variables are not configured.",
    );
  }

  return createClient(supabaseUrl, publishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
