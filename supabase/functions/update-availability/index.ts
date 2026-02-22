import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const today = new Date().toISOString().split("T")[0];

    // Mark movies as unavailable if all their showtimes are in the past
    const { data: movies } = await supabase
      .from("movies")
      .select("id, title")
      .eq("available", true);

    if (!movies || movies.length === 0) {
      return new Response(JSON.stringify({ message: "No movies to update" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let updatedCount = 0;

    for (const movie of movies) {
      // Check if any future showtimes exist with available seats
      const { data: futureShowtimes } = await supabase
        .from("showtimes")
        .select("id")
        .eq("movie_id", movie.id)
        .gte("show_date", today)
        .gt("available_seats", 0)
        .limit(1);

      if (!futureShowtimes || futureShowtimes.length === 0) {
        await supabase
          .from("movies")
          .update({ available: false })
          .eq("id", movie.id);
        updatedCount++;
      }
    }

    return new Response(
      JSON.stringify({
        message: `Availability check complete. ${updatedCount} movie(s) marked unavailable.`,
        checked: movies.length,
        updated: updatedCount,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
