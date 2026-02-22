import poster1 from "@/assets/movie-poster-1.jpg";
import poster2 from "@/assets/movie-poster-2.jpg";
import poster3 from "@/assets/movie-poster-3.jpg";
import poster4 from "@/assets/movie-poster-4.jpg";
import poster5 from "@/assets/movie-poster-5.jpg";
import poster6 from "@/assets/movie-poster-6.jpg";
import poster7 from "@/assets/movie-poster-7.jpg";
import poster8 from "@/assets/movie-poster-8.jpg";

export interface Movie {
  id: number;
  title: string;
  poster: string;
  genres: string[];
  rating: number;
  votes: string;
  language: string;
  releaseDate: string;
  featured?: boolean;
  description?: string;
}

export const movies: Movie[] = [
  {
    id: 1,
    title: "Neon Horizon",
    poster: poster1,
    genres: ["Sci-Fi", "Action"],
    rating: 8.5,
    votes: "125K",
    language: "English",
    releaseDate: "Feb 14, 2026",
    featured: true,
    description: "In a sprawling cyberpunk metropolis, a rogue hacker uncovers a conspiracy that could reshape humanity's future forever.",
  },
  {
    id: 2,
    title: "Eternal Tides",
    poster: poster2,
    genres: ["Romance", "Drama"],
    rating: 7.8,
    votes: "89K",
    language: "English",
    releaseDate: "Feb 7, 2026",
  },
  {
    id: 3,
    title: "The Hollow",
    poster: poster3,
    genres: ["Horror", "Thriller"],
    rating: 7.2,
    votes: "67K",
    language: "English",
    releaseDate: "Jan 31, 2026",
  },
  {
    id: 4,
    title: "Wonder Quest",
    poster: poster4,
    genres: ["Animation", "Comedy"],
    rating: 8.1,
    votes: "142K",
    language: "English",
    releaseDate: "Feb 21, 2026",
  },
  {
    id: 5,
    title: "The Last Stand",
    poster: poster5,
    genres: ["War", "Drama"],
    rating: 8.7,
    votes: "198K",
    language: "English",
    releaseDate: "Jan 24, 2026",
    featured: true,
    description: "An epic tale of courage and sacrifice as soldiers fight their way through impossible odds in the greatest battle ever told.",
  },
  {
    id: 6,
    title: "Thunderstrike",
    poster: poster6,
    genres: ["Action", "Superhero"],
    rating: 8.3,
    votes: "210K",
    language: "English",
    releaseDate: "Feb 28, 2026",
    featured: true,
    description: "When darkness threatens the world, one hero must harness the power of lightning to save everything he loves.",
  },
  {
    id: 7,
    title: "Shadows of Doubt",
    poster: poster7,
    genres: ["Mystery", "Crime"],
    rating: 7.9,
    votes: "95K",
    language: "English",
    releaseDate: "Feb 10, 2026",
  },
  {
    id: 8,
    title: "Champion Rising",
    poster: poster8,
    genres: ["Sports", "Drama"],
    rating: 7.6,
    votes: "74K",
    language: "English",
    releaseDate: "Feb 17, 2026",
  },
];
