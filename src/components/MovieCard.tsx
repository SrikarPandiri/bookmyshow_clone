import { useState } from "react";
import { Star } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import BookingModal from "./BookingModal";

// Map for local poster images
import poster1 from "@/assets/movie-poster-1.jpg";
import poster2 from "@/assets/movie-poster-2.jpg";
import poster3 from "@/assets/movie-poster-3.jpg";
import poster4 from "@/assets/movie-poster-4.jpg";
import poster5 from "@/assets/movie-poster-5.jpg";
import poster6 from "@/assets/movie-poster-6.jpg";
import poster7 from "@/assets/movie-poster-7.jpg";
import poster8 from "@/assets/movie-poster-8.jpg";

const posterMap: Record<string, string> = {
  "Neon Horizon": poster1,
  "Eternal Tides": poster2,
  "The Hollow": poster3,
  "Wonder Quest": poster4,
  "The Last Stand": poster5,
  "Thunderstrike": poster6,
  "Shadows of Doubt": poster7,
  "Champion Rising": poster8,
};

export const getMoviePoster = (movie: Tables<"movies">) => {
  return posterMap[movie.title] || movie.poster_url || "/placeholder.svg";
};

const MovieCard = ({ movie }: { movie: Tables<"movies"> }) => {
  const [showBooking, setShowBooking] = useState(false);

  return (
    <>
      <div className="group cursor-pointer" onClick={() => setShowBooking(true)}>
        <div className="relative overflow-hidden rounded-lg card-glow transition-all duration-300">
          <img
            src={getMoviePoster(movie)}
            alt={movie.title}
            className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 to-transparent p-3 pt-8">
            <div className="flex items-center gap-1 mb-1">
              <Star className="text-primary fill-primary" size={12} />
              <span className="text-foreground text-xs font-bold">{movie.rating}/10</span>
              <span className="text-muted-foreground text-xs ml-1">{movie.votes}</span>
            </div>
          </div>
          {/* Book Now overlay */}
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-md">Book Now</span>
          </div>
        </div>
        <div className="mt-2 px-0.5">
          <h3 className="text-foreground font-semibold text-sm truncate">{movie.title}</h3>
          <p className="text-muted-foreground text-xs mt-0.5">{movie.genres.join(" / ")}</p>
        </div>
      </div>
      {showBooking && <BookingModal movie={movie} onClose={() => setShowBooking(false)} />}
    </>
  );
};

export default MovieCard;
