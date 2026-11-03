import { useMemo, useRef, type KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { doctors, type DoctorId } from "@/data/booking";
import { addDays, weekdayOf } from "@/lib/booking/sofia-time";
import { cn } from "@/lib/utils";

const MONTHS = ["Януари", "Февруари", "Март", "Април", "Май", "Юни", "Юли", "Август", "Септември", "Октомври", "Ноември", "Декември"];
const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];
const DAYS_LONG = ["неделя", "понеделник", "вторник", "сряда", "четвъртък", "петък", "събота"];

type Props = {
  month: string; // "YYYY-MM"
  onMonthChange: (m: string) => void;
  minMonth: string;
  maxMonth: string;
  selected: string | null;
  onSelect: (date: string) => void;
  /** дата → лекари със свободни часове */
  availability: Record<string, DoctorId[]>;
  focusDate: string | null;
  onFocusDate: (d: string) => void;
};

const shiftMonth = (m: string, n: number) => {
  const [y, mo] = m.split("-").map(Number);
  const d = new Date(Date.UTC(y, mo - 1 + n, 1));
  return d.toISOString().slice(0, 7);
};

export function BookingCalendar({ month, onMonthChange, minMonth, maxMonth, selected, onSelect, availability, focusDate, onFocusDate }: Props) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [y, m] = month.split("-").map(Number);

  const cells = useMemo(() => {
    const first = `${month}-01`;
    const lead = (weekdayOf(first) + 6) % 7;
    const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
    const out: (string | null)[] = Array(lead).fill(null);
    for (let i = 0; i < daysInMonth; i++) out.push(addDays(first, i));
    while (out.length % 7) out.push(null);
    return out;
  }, [month, y, m]);

  const enabledDates = cells.filter((d): d is string => !!d && (availability[d]?.length ?? 0) > 0);
  const tabbable = focusDate && cells.includes(focusDate) ? focusDate : selected && cells.includes(selected) ? selected : enabledDates[0] ?? cells.find(Boolean) ?? null;

  function move(from: string, delta: number) {
    const next = addDays(from, delta);
    if (next.slice(0, 7) !== month) {
      const target = next.slice(0, 7);
      if (target < minMonth || target > maxMonth) return;
      onMonthChange(target);
    }
    onFocusDate(next);
    requestAnimationFrame(() => gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${next}"]`)?.focus());
  }

  function onKey(e: KeyboardEvent<HTMLButtonElement>, date: string) {
    const map: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (e.key in map) {
      e.preventDefault();
      move(date, map[e.key]);
    } else if (e.key === "Home") {
      e.preventDefault();
      move(date, -((weekdayOf(date) + 6) % 7));
    } else if (e.key === "End") {
      e.preventDefault();
      move(date, 6 - ((weekdayOf(date) + 6) % 7));
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onMonthChange(shiftMonth(month, -1))}
          disabled={month <= minMonth}
          aria-label="Предишен месец"
          className="grid h-9 w-9 place-items-center rounded-full border border-border text-primary-deep hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h3 className="text-base font-semibold text-primary-deep" aria-live="polite">
          {MONTHS[m - 1]} {y}
        </h3>
        <button
          type="button"
          onClick={() => onMonthChange(shiftMonth(month, 1))}
          disabled={month >= maxMonth}
          aria-label="Следващ месец"
          className="grid h-9 w-9 place-items-center rounded-full border border-border text-primary-deep hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div ref={gridRef} role="grid" aria-label={`${MONTHS[m - 1]} ${y}`} className="mt-4">
        <div role="row" className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
          {DAYS.map((d) => (
            <div role="columnheader" key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>
        {Array.from({ length: cells.length / 7 }, (_, r) => (
          <div role="row" key={r} className="mt-1 grid grid-cols-7 gap-1">
            {cells.slice(r * 7, r * 7 + 7).map((date, i) => {
              if (!date) return <div role="gridcell" key={i} />;
              const avail = availability[date] ?? [];
              const enabled = avail.length > 0;
              const isSel = selected === date;
              const day = Number(date.slice(8));
              return (
                <div role="gridcell" key={date} aria-selected={isSel}>
                  <button
                    type="button"
                    data-date={date}
                    tabIndex={date === tabbable ? 0 : -1}
                    aria-disabled={!enabled}
                    aria-label={`${day} ${MONTHS[m - 1].toLowerCase()}, ${DAYS_LONG[weekdayOf(date)]}${enabled ? ", има свободни часове" : ", няма свободни часове"}`}
                    onKeyDown={(e) => onKey(e, date)}
                    onFocus={() => onFocusDate(date)}
                    onClick={() => enabled && onSelect(date)}
                    className={cn(
                      "relative flex aspect-square w-full flex-col items-center justify-center rounded-xl text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      enabled ? "font-semibold text-primary-deep bg-primary-soft/20 hover:bg-primary-soft/40" : "text-muted-foreground/50 cursor-not-allowed",
                      isSel && "bg-primary-deep text-primary-foreground hover:bg-primary-deep",
                    )}
                  >
                    {day}
                    {enabled && (
                      <span className="absolute bottom-1.5 flex gap-0.5" aria-hidden="true">
                        {doctors
                          .filter((d) => avail.includes(d.id))
                          .map((d) => (
                            <span key={d.id} className="h-1.5 w-1.5 rounded-full ring-1 ring-background" style={{ background: d.dot }} />
                          ))}
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {doctors.map((d) => (
          <span key={d.id} className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: d.dot }} aria-hidden="true" />
            {d.shortName}
          </span>
        ))}
      </div>
    </div>
  );
}
