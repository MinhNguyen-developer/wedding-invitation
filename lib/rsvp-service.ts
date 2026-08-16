import { createSupabaseServerClient, type RsvpInsert } from "./supabase-server";

export async function saveRsvpResponse(input: RsvpInsert) {
  const supabase = createSupabaseServerClient();
  const rsvpsTableName = process.env.NEXT_PUBLIC_SUPABASE_RSVP_TABLE_NAME;
  if (!rsvpsTableName) {
    throw new Error(
      "RSVP table name is not defined. Please set NEXT_PUBLIC_SUPABASE_RSVP_TABLE_NAME in your environment variables.",
    );
  }
  const { error } = await supabase.from(rsvpsTableName).insert(input);

  if (error) {
    console.log("Failed to save RSVP response:", error.message);
    throw new Error("RSVP response could not be saved.");
  }
}
