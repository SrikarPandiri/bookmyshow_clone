import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useMovies } from "@/hooks/useMovieData";
import { getMoviePoster } from "./MovieCard";
import BookingModal from "./BookingModal";
import type { Tables } from "@/integrations/supabase/types";

const HeroBanner = () => {
  const { movies } = useMovies();
  const featured = movies.filter((m) => m.featured);
  const [current, setCurrent] = useState(0);
  const [bookingMovie, setBookingMovie] = useState<Tables<"movies"> | null>(null);

  useEffect(() => {
    if (featured.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % featured.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featured.length]);

  if (featured.length === 0) return null;

  const movie = featured[current % featured.length];
  const prev = () => setCurrent((c) => (c - 1 + featured.length) % featured.length);
  const next = () => setCurrent((c) => (c + 1) % featured.length);

  return (
    <>
      <section className="relative w-full h-[60vh] sm:h-[70vh] overflow-hidden mt-16">
        <div className="absolute inset-0 transition-all duration-700">
          <img src={getMoviePoster(movie)} alt={movie.title} className="w-full h-full object-cover" />
          <div className="hero-gradient absolute inset-0" />
        </div>

        <div className="relative z-10 container mx-auto px-4 h-full flex items-end pb-12 sm:pb-16">
          <div className="max-w-xl animate-fade-in-up" key={movie.id}>
            <div className="flex items-center gap-2 mb-3">
              <Star className="text-primary fill-primary" size={18} />
              <span className="text-foreground font-bold">{movie.rating}/10</span>
              <span className="text-muted-foreground text-sm">{movie.votes} Votes</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black mb-3 text-foreground leading-tight">{movie.title}</h1>
            <p className="text-muted-foreground text-sm sm:text-base mb-4 line-clamp-2">{movie.description}</p>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setBookingMovie(movie)}
                className="bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-md hover:opacity-90 transition-opacity"
              >
                Book Tickets
              </button>
              <div className="flex gap-2">
                {movie.genres.map((g) => (
                  <span key={g} className="bg-genre-badge text-genre-badge-foreground text-xs px-3 py-1 rounded-full">{g}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/50 hover:bg-background/80 text-foreground transition-colors">
          <ChevronLeft size={24} />
        </button>
        <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/50 hover:bg-background/80 text-foreground transition-colors">
          <ChevronRight size={24} />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-primary w-6" : "bg-muted-foreground/50"}`}
            />
          ))}
        </div>
      </section>
      {bookingMovie && <BookingModal movie={bookingMovie} onClose={() => setBookingMovie(null)} />}
    </>
  );
};

export default HeroBanner;
