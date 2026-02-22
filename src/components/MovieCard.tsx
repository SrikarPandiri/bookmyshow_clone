import { Star } from "lucide-react";
import type { Movie } from "@/data/movies";

const MovieCard = ({ movie }: { movie: Movie }) => {
  return (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-lg card-glow transition-all duration-300">
        <img
          src={movie.poster}
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
      </div>
      <div className="mt-2 px-0.5">
        <h3 className="text-foreground font-semibold text-sm truncate">{movie.title}</h3>
        <p className="text-muted-foreground text-xs mt-0.5">{movie.genres.join(" / ")}</p>
      </div>
    </div>
  );
};

export default MovieCard;
