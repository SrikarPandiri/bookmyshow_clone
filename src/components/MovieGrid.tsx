import { useState } from "react";
import { movies } from "@/data/movies";
import MovieCard from "./MovieCard";

const allGenres = Array.from(new Set(movies.flatMap((m) => m.genres)));

const MovieGrid = () => {
  const [activeGenre, setActiveGenre] = useState<string | null>(null);

  const filtered = activeGenre
    ? movies.filter((m) => m.genres.includes(activeGenre))
    : movies;

  return (
    <section className="container mx-auto px-4 py-10">
      <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
        Recommended Movies
      </h2>

      {/* Genre Filters */}
      <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide pb-2">
        <button
          onClick={() => setActiveGenre(null)}
          className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeGenre === null
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          All
        </button>
        {allGenres.map((genre) => (
          <button
            key={genre}
            onClick={() => setActiveGenre(genre)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeGenre === genre
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
        {filtered.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
};

export default MovieGrid;
