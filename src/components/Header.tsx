import { Search, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight">
            Book<span className="text-primary">My</span>Show
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="#" className="text-foreground hover:text-primary transition-colors">Movies</a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Events</a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Plays</a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Sports</a>
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          {searchOpen && (
            <input
              type="text"
              placeholder="Search movies..."
              className="hidden sm:block bg-secondary text-foreground text-sm rounded-md px-3 py-1.5 outline-none focus:ring-1 focus:ring-primary w-48 transition-all"
              autoFocus
            />
          )}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          >
            <Search size={20} />
          </button>
          <button className="hidden md:inline-flex bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-md hover:opacity-90 transition-opacity">
            Sign In
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-card border-t border-border px-4 py-4 space-y-3 animate-fade-in-up">
          <a href="#" className="block text-foreground font-medium">Movies</a>
          <a href="#" className="block text-muted-foreground">Events</a>
          <a href="#" className="block text-muted-foreground">Plays</a>
          <a href="#" className="block text-muted-foreground">Sports</a>
          <button className="w-full bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-md mt-2">
            Sign In
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
