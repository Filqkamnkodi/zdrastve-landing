import { Link } from "@tanstack/react-router";
import { HeartPulse, CalendarCheck, Menu } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-border/60">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-deep text-primary-foreground">
            <HeartPulse className="h-5 w-5" />
          </span>
          <span className="font-display text-base font-bold tracking-tight text-primary-deep leading-tight whitespace-pre-line">
            Клиника{"\n"}Д-р Чолакови
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link to="/services" className="hover:text-primary-deep transition">Услуги</Link>
          <Link to="/imunizacionen-centar" className="hover:text-primary-deep transition">Имунизационен център</Link>
          <Link to="/za-nas" className="hover:text-primary-deep transition">За нас</Link>
          <Link to="/chesto-zadavani-vaprosi" className="hover:text-primary-deep transition">ЧЗВ</Link>
          <a href="/#contact" className="hover:text-primary-deep transition">Контакти</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/zapazi-chas" className="btn-primary hidden sm:inline-flex !py-2.5 !px-5 text-sm">
            <CalendarCheck className="h-4 w-4" /> Запази час
          </Link>
          <button aria-label="Меню" className="md:hidden grid h-10 w-10 place-items-center rounded-full border border-border">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
