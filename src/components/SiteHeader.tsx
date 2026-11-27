import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarCheck, ChevronDown, Menu, X } from "lucide-react";
import logoUrl from "@/assets/logo.webp";

const servicesMenu = [
  { to: "/services", label: "Услуги", mobileLabel: "Всички услуги" },
  { to: "/ceni", label: "Цени", mobileLabel: "Цени" },
] as const;

const navItems = [
  { to: "/imunizacionen-centar", label: "Имунизационен център" },
  { to: "/za-nas", label: "За нас" },
  { to: "/chesto-zadavani-vaprosi", label: "ЧЗВ" },
  { to: "/kontakti", label: "Контакти" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const servicesButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  useEffect(() => {
    if (!servicesOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setServicesOpen(false);
        servicesButtonRef.current?.focus();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!servicesRef.current?.contains(target)) setServicesOpen(false);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [servicesOpen]);

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const openServices = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };
  const scheduleCloseServices = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setServicesOpen(false), 140);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-border/60">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <img
            src={logoUrl}
            alt="Клиника Д-р Чолакови"
            width={72}
            height={72}
            className="-my-1 -mr-1.5 h-[72px] w-[72px] object-contain"
          />
          <span className="font-display text-base font-bold tracking-tight text-primary-deep leading-[1.05] whitespace-pre-line">
            Клиника{"\n"}Д-р Чолакови
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <div
            ref={servicesRef}
            className="relative"
            onMouseEnter={openServices}
            onMouseLeave={scheduleCloseServices}
          >
            <button
              ref={servicesButtonRef}
              type="button"
              aria-expanded={servicesOpen}
              aria-haspopup="true"
              aria-controls="services-menu"
              onClick={() => setServicesOpen((v) => !v)}
              className="inline-flex items-center gap-1 hover:text-primary-deep transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md"
            >
              Услуги
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div
              id="services-menu"
              hidden={!servicesOpen}
              className={`absolute left-0 top-full pt-2 transition-all duration-200 ease-out ${
                servicesOpen
                  ? "opacity-100 translate-y-0"
                  : "pointer-events-none opacity-0 -translate-y-1"
              }`}
            >
              <div className="min-w-[190px] rounded-xl border border-border bg-white p-1.5 shadow-soft">
                {servicesMenu.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setServicesOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-primary-deep transition-colors hover:bg-primary-soft/25 hover:text-primary-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setServicesOpen(false)}
              className="hover:text-primary-deep transition"
            >
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
          <button
            type="button"
            aria-expanded={mobileServicesOpen}
            aria-controls="mobile-services"
            onClick={() => setMobileServicesOpen((v) => !v)}
            className="flex items-center justify-between rounded-xl px-3 py-3.5 text-base font-medium text-primary-deep transition-colors hover:bg-primary-soft/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Услуги
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ${mobileServicesOpen ? "rotate-180" : ""}`}
            />
          </button>
          <div
            id="mobile-services"
            className={`grid overflow-hidden transition-all duration-300 ease-out ${
              mobileServicesOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="min-h-0 overflow-hidden pl-3">
              {servicesMenu.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  tabIndex={mobileServicesOpen ? undefined : -1}
                  onClick={() => {
                    setOpen(false);
                    setMobileServicesOpen(false);
                  }}
                  className="block rounded-xl px-3 py-3 text-base text-primary-deep transition-colors hover:bg-primary-soft/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {item.mobileLabel}
                </Link>
              ))}
            </div>
          </div>
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
