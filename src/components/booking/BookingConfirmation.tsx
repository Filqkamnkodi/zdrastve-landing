import { forwardRef } from "react";
import { CalendarPlus, CheckCircle2, Download, IdCard, MapPin } from "lucide-react";
import { doctorById, locationOf, type DoctorId } from "@/data/booking";
import { buildIcs, googleCalendarLink, type CalEvent } from "@/lib/booking/ics";
import { formatLongDate, formatTime } from "@/lib/booking/sofia-time";

type Props = { booking: { doctorId: DoctorId; start: number; end: number }; onNew: () => void };

export const BookingConfirmation = forwardRef<HTMLHeadingElement, Props>(function BookingConfirmation({ booking, onNew }, ref) {
  const doctor = doctorById(booking.doctorId)!;
  const loc = locationOf(doctor);
  const ev: CalEvent = {
    title: `Преглед при ${doctor.name}`,
    details: `Клиника Д-р Чолакови\n${loc.address}\nТел.: ${loc.phones.join(", ")}\nНосете документ за самоличност.`,
    location: loc.address,
    start: booking.start,
    end: booking.end,
  };

  function downloadIcs() {
    const blob = new Blob([buildIcs(ev)], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chas-klinika-cholakovi.ics";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div role="status" className="text-center sm:text-left">
      <span className="mx-auto sm:mx-0 grid h-14 w-14 place-items-center rounded-full bg-primary-soft/30 text-primary-deep">
        <CheckCircle2 className="h-7 w-7" />
      </span>
      <h2 ref={ref} tabIndex={-1} className="mt-4 text-2xl font-bold text-primary-deep focus:outline-none">
        Часът ви е запазен
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">Очакваме ви в клиниката.</p>

      <div className="mt-6 flex gap-4 rounded-2xl border border-border/60 bg-surface p-5 text-left">
        <img src={doctor.photo} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover object-top" />
        <div className="text-sm">
          <p className="font-semibold text-primary-deep">{doctor.name}</p>
          <p className="mt-1 capitalize text-foreground">
            {formatLongDate(booking.start)}, {formatTime(booking.start)} ч.
          </p>
          <a href={loc.mapLink} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-start gap-1 text-muted-foreground hover:text-primary-deep">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {loc.address}
          </a>
        </div>
      </div>

      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        <a href={googleCalendarLink(ev)} target="_blank" rel="noopener noreferrer" className="btn-primary justify-center !py-2.5 !px-5 text-sm">
          <CalendarPlus className="h-4 w-4" /> Добави в Google Календар
        </a>
        <button type="button" onClick={downloadIcs} className="btn-ghost justify-center !py-2.5 !px-5 text-sm">
          <Download className="h-4 w-4" /> Изтегли .ics
        </button>
      </div>

      <p className="mt-5 flex gap-2 rounded-xl border border-primary/20 bg-primary-soft/10 p-4 text-left text-sm text-muted-foreground">
        <IdCard className="mt-0.5 h-4 w-4 shrink-0 text-primary-deep" />
        <span>Моля, носете документ за самоличност и наличните медицински документи. Ако не можете да дойдете, обадете се на { (loc.id === "shumen" ? loc.phones : loc.phones.slice(0, 1)).map((phone, index) => <span key={phone}>{index > 0 && ", "}<a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-primary-deep">{phone}</a></span>)}.</span>
      </p>

      <button type="button" onClick={onNew} className="mt-5 text-sm font-medium text-primary hover:text-primary-deep underline-offset-4 hover:underline">
        Запази друг час
      </button>
    </div>
  );
});
