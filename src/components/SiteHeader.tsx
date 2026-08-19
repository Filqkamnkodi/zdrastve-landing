import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarCheck, Menu, X } from "lucide-react";
import logoUrl from "@/assets/logo.webp";

const navItems = [
  { to: "/services", label: "Услуги" },
  { to: "/imunizacionen-centar", label: "Имунизационен център" },
  { to: "/za-nas", label: "За нас" },
  { to: "/chesto-zadavani-vaprosi", label: "ЧЗВ" },
  { to: "/kontakti", label: "Контакти" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        !panelRef.current?.contains(target) &&
        !buttonRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-border/60">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <img
            src={logoUrl}
            alt="Клиника Д-р Чолакови"
            width={60}
            height={60}
            className="h-[60px] w-[60px] object-contain"
          />
          <span className="font-display text-base font-bold tracking-tight text-primary-deep leading-tight whitespace-pre-line">
            Клиника{"\n"}Д-р Чолакови
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} className="hover:text-primary-deep transition">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/zapazi-chas" className="btn-primary hidden md:inline-flex !py-2.5 !px-5 text-sm">
            <CalendarCheck className="h-4 w-4" /> Запази час
          </Link>
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Затвори меню" : "Отвори меню"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="md:hidden grid h-11 w-11 place-items-center rounded-full border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-nav"
        ref={panelRef}
        hidden={!open}
        className={`md:hidden absolute left-0 right-0 top-full z-50 origin-top overflow-hidden border-b border-border bg-white shadow-soft transition-all duration-300 ease-out ${
          open ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 -translate-y-2"
        }`}
      >
        <nav className="container-page flex flex-col py-3">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-3.5 text-base font-medium text-primary-deep transition-colors hover:bg-primary-soft/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/zapazi-chas"
            onClick={() => setOpen(false)}
            className="btn-primary mt-3 mb-2 justify-center"
          >
            <CalendarCheck className="h-4 w-4" /> Запази час
          </Link>
        </nav>
      </div>
    </header>
  );
}
