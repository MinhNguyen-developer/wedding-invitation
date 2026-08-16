import { createSupabaseServerClient, type RsvpInsert } from "./supabase-server";

export async function saveRsvpResponse(input: RsvpInsert) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("rsvps").insert(input);

  if (error) {
    console.log("Failed to save RSVP response:", error.message);
    throw new Error("RSVP response could not be saved.");
  }
}
