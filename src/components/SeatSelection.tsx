import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";

interface SeatSelectionProps {
  totalSeats: number;
  availableSeats: number;
  maxSelectable: number;
  onSelectionChange: (seats: string[]) => void;
}

const COLS = 10;
const SCREEN_LABEL = "SCREEN";

const SeatSelection = ({ totalSeats, availableSeats, maxSelectable, onSelectionChange }: SeatSelectionProps) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const rows = Math.ceil(totalSeats / COLS);
  const filledCount = totalSeats - availableSeats;

  // Generate deterministic filled seats based on the counts
  const filledSeats = useMemo(() => {
    const filled = new Set<string>();
    // Spread filled seats across the theater deterministically
    const seatList: string[] = [];
    for (let r = 0; r < rows; r++) {
      const rowLabel = String.fromCharCode(65 + r);
      for (let c = 1; c <= COLS; c++) {
        const seatNum = r * COLS + c;
        if (seatNum <= totalSeats) {
          seatList.push(`${rowLabel}${c}`);
        }
      }
    }
    // Pick filled seats using a simple distribution pattern
    const step = totalSeats > filledCount && filledCount > 0 ? Math.floor(totalSeats / filledCount) : 1;
    let count = 0;
    for (let i = 0; i < seatList.length && count < filledCount; i += step) {
      filled.add(seatList[i]);
      count++;
    }
    // Fill remaining if step didn't cover all
    for (let i = 0; i < seatList.length && count < filledCount; i++) {
      if (!filled.has(seatList[i])) {
        filled.add(seatList[i]);
        count++;
      }
    }
    return filled;
  }, [totalSeats, availableSeats, rows, filledCount]);

  useEffect(() => {
    onSelectionChange(Array.from(selected));
  }, [selected, onSelectionChange]);

  const toggleSeat = (seatId: string) => {
    if (filledSeats.has(seatId)) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(seatId)) {
        next.delete(seatId);
      } else if (next.size < maxSelectable) {
        next.add(seatId);
      }
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground mb-2">
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded border-2 border-green-500 bg-green-500/10" /> Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-primary border-2 border-primary" /> Selected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-muted border-2 border-muted" /> Filled
        </span>
      </div>

      {/* Screen */}
      <div className="relative mx-auto w-3/4 h-6 mb-6">
        <div className="absolute inset-0 bg-gradient-to-b from-muted-foreground/30 to-transparent rounded-t-full" />
        <p className="text-center text-[10px] text-muted-foreground font-semibold tracking-widest pt-1">{SCREEN_LABEL}</p>
      </div>

      {/* Seat grid */}
      <div className="flex flex-col items-center gap-1.5 overflow-x-auto px-2">
        {Array.from({ length: rows }, (_, r) => {
          const rowLabel = String.fromCharCode(65 + r);
          return (
            <div key={rowLabel} className="flex items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground w-4 text-right font-medium">{rowLabel}</span>
              {Array.from({ length: COLS }, (_, c) => {
                const seatNum = r * COLS + (c + 1);
                if (seatNum > totalSeats) return <span key={c} className="w-7 h-7" />;
                const seatId = `${rowLabel}${c + 1}`;
                const isFilled = filledSeats.has(seatId);
                const isSelected = selected.has(seatId);

                return (
                  <button
                    key={seatId}
                    disabled={isFilled}
                    onClick={() => toggleSeat(seatId)}
                    className={cn(
                      "w-7 h-7 rounded text-[9px] font-bold flex items-center justify-center transition-all border-2",
                      isFilled && "bg-muted border-muted text-muted-foreground/40 cursor-not-allowed",
                      !isFilled && !isSelected && "border-green-500 bg-green-500/10 text-green-500 hover:bg-green-500/20 cursor-pointer",
                      isSelected && "border-primary bg-primary text-primary-foreground cursor-pointer scale-105"
                    )}
                    title={isFilled ? "Filled" : seatId}
                  >
                    {c + 1}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        {selected.size}/{maxSelectable} seats selected
        {selected.size > 0 && (
          <span className="ml-2 text-foreground font-medium">
            ({Array.from(selected).sort().join(", ")})
          </span>
        )}
      </p>
    </div>
  );
};

export default SeatSelection;
