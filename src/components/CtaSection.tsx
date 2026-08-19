import { Link } from "@tanstack/react-router";
import { CalendarCheck, Phone } from "lucide-react";

type CtaSectionProps = {
  title?: string;
  text?: string;
};

export function CtaSection({
  title = "Нуждаете се от повече информация?",
  text = "Свържете се с нас или запазете час за преглед.",
}: CtaSectionProps) {
  return (
    <section className="py-12 lg:py-16">
      <div className="container-page">
        <div className="card-soft rounded-[1.25rem] p-8 lg:p-12 text-center animate-fade-up">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary-deep">{title}</h2>
          <p className="mt-4 mx-auto max-w-2xl text-muted-foreground leading-relaxed">{text}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/zapazi-chas" className="btn-primary">
              <CalendarCheck className="h-5 w-5" /> Запазете час
            </Link>
            <Link to="/kontakti" className="btn-ghost">
              <Phone className="h-4 w-4" /> Свържете се с нас
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
