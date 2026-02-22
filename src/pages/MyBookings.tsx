import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useBookings } from "@/hooks/useMovieData";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const MyBookings = () => {
  const { user, loading: authLoading } = useAuth();
  const { bookings, loading } = useBookings(user?.id ?? null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [authLoading, user, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex justify-center pt-32"><Loader2 className="animate-spin text-primary" size={32} /></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-2xl font-bold text-foreground mb-6">My Bookings</h1>
        {bookings.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">No bookings yet.</p>
            <button onClick={() => navigate("/")} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-medium hover:opacity-90">
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <div key={b.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">{b.seats} seat(s)</p>
                  <p className="text-muted-foreground text-sm">₹{Number(b.total_amount)}</p>
                  <p className="text-muted-foreground text-xs mt-1">{new Date(b.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  b.status === "paid" ? "bg-green-900/30 text-green-400" :
                  b.status === "pending" ? "bg-yellow-900/30 text-yellow-400" :
                  "bg-red-900/30 text-red-400"
                }`}>
                  {b.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
