import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import MovieGrid from "@/components/MovieGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroBanner />
      <MovieGrid />
      <footer className="border-t border-border py-8 mt-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          © 2026 BookMyShow Clone. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
