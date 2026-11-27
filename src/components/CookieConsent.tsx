import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { needsAnswer, onConsentChange, readChoice, saveChoices, type Purpose } from "@/lib/consent";

const purposes: Purpose[] = ["analytics", "advertising"];
const settingsEvent = "open-cookie-settings";

export function CookieSettingsLink() {
  return (
    <Button variant="link" className="h-auto p-0 text-sm font-normal text-muted-foreground hover:text-primary-deep" onClick={() => window.dispatchEvent(new Event(settingsEvent))}>
      Настройки за бисквитките
    </Button>
  );
}

export function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [advertising, setAdvertising] = useState(false);
  const [gpc, setGpc] = useState(false);
  const panel = useRef<HTMLElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let active = true;
    const sync = () => {
      setAnalytics(readChoice("analytics") === "granted");
      setAdvertising(readChoice("advertising") === "granted");
      setGpc((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true);
    };
    const showSettings = () => {
      previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      sync();
      setSettings(true);
      setOpen(true);
    };
    sync();
    void needsAnswer(purposes).then((required) => {
      if (active && required) {
        previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        setOpen(true);
      }
    });
    const unsubscribe = onConsentChange(sync);
    window.addEventListener(settingsEvent, showSettings);
    return () => {
      active = false;
      unsubscribe();
      window.removeEventListener(settingsEvent, showSettings);
    };
  }, []);

  useEffect(() => {
    if (open) panel.current?.focus({ preventScroll: true });
  }, [open, settings]);

  const save = (allowAnalytics: boolean, allowAdvertising: boolean) => {
    saveChoices({ analytics: allowAnalytics ? "granted" : "denied", advertising: allowAdvertising ? "granted" : "denied" });
    setOpen(false);
    setSettings(false);
    previousFocus.current?.focus({ preventScroll: true });
  };

  if (!open) return null;
  return (
    <section ref={panel} tabIndex={-1} aria-labelledby="cookie-consent-title" className="fixed bottom-3 left-3 right-3 z-50 mx-auto max-h-[calc(100dvh-1.5rem)] max-w-2xl overflow-y-auto rounded-lg border border-border bg-background p-5 shadow-soft sm:p-6 focus:outline-none">
      <h2 id="cookie-consent-title" className="text-lg font-semibold text-primary-deep">{settings ? "Настройки за бисквитките" : "Вашата поверителност"}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Броим посещенията, без да Ви идентифицираме. Ако приемете аналитичното измерване, измерваме и кликванията. Изберете отделно дали разрешавате рекламни бисквитки.</p>
      <Link to="/politika-za-poveritelnost" className="mt-2 inline-block text-sm text-primary underline underline-offset-4">Политика за поверителност</Link>
      {settings && (
        <div className="mt-4 divide-y divide-border text-sm">
          <div className="flex items-center justify-between gap-4 py-3"><span>Необходими</span><span className="text-muted-foreground">Винаги активни</span></div>
          <div className="flex items-center justify-between gap-4 py-3"><label htmlFor="cookies-analytics">Аналитично измерване, предоставено от Lovable</label><Switch id="cookies-analytics" checked={analytics} onCheckedChange={setAnalytics} disabled={gpc} /></div>
          <div className="flex items-center justify-between gap-4 py-3"><label htmlFor="cookies-advertising">Рекламни бисквитки, предоставени от Meta</label><Switch id="cookies-advertising" checked={advertising} onCheckedChange={setAdvertising} disabled={gpc} /></div>
          {gpc && <p className="py-3 text-muted-foreground">Прилага се сигналът за поверителност на Вашия браузър. Незадължителното проследяване е отказано.</p>}
        </div>
      )}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button variant="outline" disabled={gpc} onClick={() => save(true, true)}>Приемам всички</Button>
        <Button variant="outline" onClick={() => save(false, false)}>Отказвам всички</Button>
      </div>
      {settings ? <Button className="mt-2 w-full" onClick={() => save(analytics, advertising)}>Запази избора</Button> : <Button variant="ghost" className="mt-2 w-full" onClick={() => setSettings(true)}>Настройки за бисквитките</Button>}
    </section>
  );
}