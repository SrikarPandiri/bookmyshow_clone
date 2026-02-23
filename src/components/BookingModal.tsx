import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { X, Star, Clock, MapPin, Minus, Plus, Loader2, ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { useShowtimes } from "@/hooks/useMovieData";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import SeatSelection from "./SeatSelection";
import type { Tables } from "@/integrations/supabase/types";
import { format, parseISO } from "date-fns";

type Movie = Tables<"movies">;

interface BookingModalProps {
  movie: Movie;
  onClose: () => void;
}

const TOTAL_THEATER_SEATS = 100;

const BookingModal = ({ movie, onClose }: BookingModalProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { showtimes, loading: showtimesLoading } = useShowtimes(movie.id);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<Tables<"showtimes"> | null>(null);
  const [seats, setSeats] = useState(1);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [step, setStep] = useState<"showtime" | "seats" | "payment" | "confirmed">("showtime");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"debit" | "credit" | "upi" | null>(null);
  const dateScrollRef = useRef<HTMLDivElement>(null);

  const uniqueDates = useMemo(() => {
    return [...new Set(showtimes.map((st) => st.show_date))].sort();
  }, [showtimes]);

  useEffect(() => {
    if (uniqueDates.length > 0 && !selectedDate) {
      setSelectedDate(uniqueDates[0]);
    }
  }, [uniqueDates, selectedDate]);

  const filteredShowtimes = useMemo(
    () => (selectedDate ? showtimes.filter((st) => st.show_date === selectedDate) : []),
    [showtimes, selectedDate]
  );

  const scrollDates = (dir: "left" | "right") => {
    dateScrollRef.current?.scrollBy({ left: dir === "left" ? -150 : 150, behavior: "smooth" });
  };

  const handleSeatSelectionChange = useCallback((s: string[]) => setSelectedSeatIds(s), []);

  if (!user) {
    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
          <h2 className="text-xl font-bold text-foreground mb-2">Sign in Required</h2>
          <p className="text-muted-foreground mb-4">Please sign in to book tickets.</p>
          <div className="flex gap-3">
            <button onClick={() => navigate("/auth")} className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:opacity-90">Sign In</button>
            <button onClick={onClose} className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md font-medium">Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  const totalAmount = selectedShowtime ? seats * Number(selectedShowtime.price) : 0;

  const handleMockPayment = async () => {
    if (!selectedShowtime || !user) return;
    setPaymentLoading(true);

    const { data: booking, error } = await supabase.from("bookings").insert({
      user_id: user.id,
      showtime_id: selectedShowtime.id,
      seats,
      total_amount: totalAmount,
      status: "pending",
      selected_seats: selectedSeatIds,
    }).select().single();

    if (error) {
      toast({ title: "Booking failed", description: error.message, variant: "destructive" });
      setPaymentLoading(false);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
    await supabase.from("bookings").update({ status: "paid" }).eq("id", booking.id);
    await supabase.from("showtimes").update({ available_seats: selectedShowtime.available_seats - seats }).eq("id", selectedShowtime.id);

    setPaymentLoading(false);
    setStep("confirmed");
    toast({
      title: "🎬 Booking Confirmed!",
      description: `Your tickets for "${movie.title}" have been booked. A confirmation email has been sent to your inbox.`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">{movie.title}</h2>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-secondary text-muted-foreground"><X size={20} /></button>
        </div>

        <div className="p-4">
          {step === "showtime" && (
            <>
              <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                <Star className="text-primary fill-primary" size={14} />
                <span className="text-foreground font-medium">{movie.rating}/10</span>
                <span>•</span>
                <span>{movie.genres.join(", ")}</span>
              </div>

              <h2 className="text-lg font-bold text-foreground mb-4">Theaters Showing {movie.title}</h2>
              {showtimesLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary" /></div>
              ) : showtimes.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4">No showtimes available.</p>
              ) : (
                <>
                  {/* Horizontal Date Selector */}
                  <div className="flex items-center gap-1 mb-5">
                    <button onClick={() => scrollDates("left")} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground shrink-0"><ChevronLeft size={18} /></button>
                    <div ref={dateScrollRef} className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth">
                      {uniqueDates.map((date) => {
                        const parsed = parseISO(date);
                        const isSelected = selectedDate === date;
                        return (
                          <button
                            key={date}
                            onClick={() => { setSelectedDate(date); setSelectedShowtime(null); }}
                            className={`flex flex-col items-center px-4 py-2 rounded-lg border text-sm shrink-0 transition-colors ${
                              isSelected
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border hover:border-muted-foreground text-foreground"
                            }`}
                          >
                            <span className="text-xs font-medium uppercase">{format(parsed, "EEE")}</span>
                            <span className="text-lg font-bold leading-tight">{format(parsed, "dd")}</span>
                            <span className="text-xs text-muted-foreground">{format(parsed, "MMM")}</span>
                          </button>
                        );
                      })}
                    </div>
                    <button onClick={() => scrollDates("right")} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground shrink-0"><ChevronRight size={18} /></button>
                  </div>

                  {/* Venues & Showtimes for selected date */}
                  {filteredShowtimes.length === 0 ? (
                    <p className="text-muted-foreground text-sm py-4">No showtimes on this date.</p>
                  ) : (
                    <div className="space-y-4 mb-6">
                      {Object.entries(
                        filteredShowtimes.reduce<Record<string, typeof filteredShowtimes>>((acc, st) => {
                          (acc[st.venue] ||= []).push(st);
                          return acc;
                        }, {})
                      ).map(([venue, venueShowtimes]) => (
                        <div key={venue} className="border border-border rounded-lg overflow-hidden">
                          <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50">
                            <MapPin size={16} className="text-primary" />
                            <h3 className="font-semibold text-foreground">{venue}</h3>
                          </div>
                          <div className="p-3 flex flex-wrap gap-2">
                            {venueShowtimes.map((st) => (
                              <button
                                key={st.id}
                                onClick={() => setSelectedShowtime(st)}
                                className={`flex flex-col items-center px-4 py-2 rounded-md border text-sm transition-colors ${
                                  selectedShowtime?.id === st.id
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-border hover:border-muted-foreground text-foreground"
                                }`}
                              >
                                <span className="font-semibold flex items-center gap-1"><Clock size={12} />{st.show_time.slice(0, 5)}</span>
                                <span className="text-xs text-muted-foreground">₹{Number(st.price)} · {st.available_seats} seats</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {selectedShowtime && (
                <>
                  <h3 className="font-semibold text-foreground mb-3">Number of Seats</h3>
                  <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => setSeats(Math.max(1, seats - 1))} className="p-2 rounded-md bg-secondary text-foreground hover:bg-secondary/80"><Minus size={16} /></button>
                    <span className="text-xl font-bold text-foreground w-8 text-center">{seats}</span>
                    <button onClick={() => setSeats(Math.min(selectedShowtime.available_seats, seats + 1))} className="p-2 rounded-md bg-secondary text-foreground hover:bg-secondary/80"><Plus size={16} /></button>
                  </div>

                  <button
                    onClick={() => { setSelectedSeatIds([]); setStep("seats"); }}
                    className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-md hover:opacity-90 transition-opacity"
                  >
                    Select Seats
                  </button>
                </>
              )}
            </>
          )}

          {step === "seats" && selectedShowtime && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Select Your Seats</h3>
                <span className="text-sm text-muted-foreground">{selectedShowtime.venue} · {selectedShowtime.show_time.slice(0, 5)}</span>
              </div>

              <SeatSelection
                totalSeats={TOTAL_THEATER_SEATS}
                availableSeats={selectedShowtime.available_seats}
                maxSelectable={seats}
                onSelectionChange={handleSeatSelectionChange}
              />

              <div className="mt-6 bg-secondary rounded-md p-4 mb-4">
                <div className="flex justify-between text-sm text-muted-foreground mb-1">
                  <span>{seats} × ₹{Number(selectedShowtime.price)}</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between font-bold text-foreground text-lg border-t border-border pt-2 mt-2">
                  <span>Total</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>

              <button
                onClick={() => setStep("payment")}
                disabled={selectedSeatIds.length !== seats}
                className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {selectedSeatIds.length === seats ? "Proceed to Payment" : `Select ${seats - selectedSeatIds.length} more seat(s)`}
              </button>
              <button onClick={() => setStep("showtime")} className="w-full mt-2 text-sm text-muted-foreground hover:text-foreground text-center">← Go back</button>
            </>
          )}

          {step === "payment" && selectedShowtime && (
            <div className="py-2">
              <h3 className="text-lg font-bold text-foreground mb-4">Payment</h3>

              {/* Booking Summary */}
              <div className="bg-secondary rounded-lg p-4 mb-5 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Movie</span>
                  <span className="text-foreground font-medium">{movie.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Showtime</span>
                  <span className="text-foreground font-medium">{selectedShowtime.show_time.slice(0, 5)} · {selectedShowtime.venue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Seats</span>
                  <span className="text-foreground font-medium">{selectedSeatIds.sort().join(", ")}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 mt-2">
                  <span className="text-foreground font-bold">Total</span>
                  <span className="text-foreground font-bold text-lg">₹{totalAmount}</span>
                </div>
              </div>

              {/* Payment Method Selection */}
              <h4 className="font-semibold text-foreground mb-3">Select Payment Method</h4>
              <div className="space-y-2 mb-5">
                {([
                  { id: "debit", label: "Debit Card", icon: "💳" },
                  { id: "credit", label: "Credit Card", icon: "💳" },
                  { id: "upi", label: "UPI", icon: "📱" },
                ] as const).map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-md border text-sm font-medium transition-colors ${
                      paymentMethod === method.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-muted-foreground text-foreground"
                    }`}
                  >
                    <span className="text-lg">{method.icon}</span>
                    <span>{method.label}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={handleMockPayment}
                disabled={paymentLoading || !paymentMethod}
                className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {paymentLoading ? (<><Loader2 size={18} className="animate-spin" />Processing Payment...</>) : `Pay ₹${totalAmount}`}
              </button>
              <button onClick={() => setStep("seats")} className="w-full mt-2 text-sm text-muted-foreground hover:text-foreground text-center">← Go back</button>
            </div>
          )}

          {step === "confirmed" && (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-foreground mb-2">Booking Confirmed!</h3>
              <p className="text-muted-foreground text-sm mb-1">
                {seats} seat(s) for <span className="text-foreground font-medium">{movie.title}</span>
              </p>
              <p className="text-muted-foreground text-sm mb-1">
                Seats: <span className="text-foreground font-medium">{selectedSeatIds.sort().join(", ")}</span>
              </p>
              <p className="text-muted-foreground text-sm mb-6">
                {selectedShowtime?.show_time.slice(0, 5)} at {selectedShowtime?.venue}
              </p>
              <p className="text-xs text-muted-foreground mb-6 bg-secondary rounded-md p-3">
                📧 A mock confirmation email has been triggered (see toast notification).
              </p>
              <button onClick={onClose} className="bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-md hover:opacity-90">Done</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
