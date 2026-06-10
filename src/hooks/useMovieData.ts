import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Movie = Tables<"movies">;

export const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMovies = async () => {
    const { data, error } = await supabase
      .from("movies")
      .select("*")
      .eq("available", true)
      .order("created_at", { ascending: true });

    if (!error && data) setMovies(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMovies();

    const channel = supabase
      .channel(`movies-realtime-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "movies" }, () => {
        fetchMovies();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { movies, loading };
};

export const useShowtimes = (movieId: string | null) => {
  const [showtimes, setShowtimes] = useState<Tables<"showtimes">[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!movieId) { setShowtimes([]); return; }
    setLoading(true);

    const fetch = async () => {
      const { data, error } = await supabase
        .from("showtimes")
        .select("*")
        .eq("movie_id", movieId)
        .gt("available_seats", 0)
        .order("show_time", { ascending: true });

      if (!error && data) setShowtimes(data);
      setLoading(false);
    };

    fetch();
  }, [movieId]);

  return { showtimes, loading };
};

export const useBookings = (userId: string | null) => {
  const [bookings, setBookings] = useState<Tables<"bookings">[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);

    const fetch = async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!error && data) setBookings(data);
      setLoading(false);
    };

    fetch();

    const channel = supabase
      .channel(`bookings-realtime-${userId}-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings", filter: `user_id=eq.${userId}` }, () => {
        fetch();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  return { bookings, loading };
};
