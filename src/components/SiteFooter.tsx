import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Phone, Mail, MapPin } from "lucide-react";
import logoUrl from "@/assets/logo.webp";

export function SiteFooter() {
  return (
    <footer id="contact" className="border-t border-border bg-surface">
      <div className="container-page py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-deep text-primary-foreground">
              <HeartPulse className="h-5 w-5" />
            </span>
            <span className="font-display text-base font-bold text-primary-deep whitespace-pre-line leading-tight">
              Клиника{"\n"}Д-р Чолакови
            </span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            Модерна медицинска клиника, посветена на здравето и комфорта на всеки пациент.
          </p>
          <div className="mt-5 flex gap-2">
            {[Facebook, Instagram, Linkedin].map((Icon, i) => (
              <a key={i} href="#" aria-label="Социална мрежа" className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground hover:text-primary-deep hover:border-primary transition">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-primary-deep">Навигация</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/services" className="hover:text-primary-deep">Услуги</Link></li>
            <li><a href="/#locations" className="hover:text-primary-deep">Локации</a></li>
            <li><Link to="/za-nas" className="hover:text-primary-deep">За нас</Link></li>
            <li><a href="/#testimonials" className="hover:text-primary-deep">Отзиви</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-primary-deep">Контакти</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li className="flex gap-2"><Phone className="h-4 w-4 mt-0.5 text-primary" /> +359 886 011 166</li>
            <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5 text-primary" /> contact@cholakoviclinic.bg</li>
            <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 text-primary" /> ул. "Васил Друмев" 17, Шумен</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-primary-deep">Правна информация</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/politika-za-poveritelnost" className="hover:text-primary-deep">Политика за поверителност</Link></li>
            <li><Link to="/obshti-usloviya" className="hover:text-primary-deep">Общи условия</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page py-6 flex flex-col sm:flex-row gap-2 items-center justify-between text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Клиника Д-р Чолакови. Всички права запазени.</div>
          <div>Направено с грижа за вашето здраве.</div>
        </div>
      </div>
    </footer>
  );
}
