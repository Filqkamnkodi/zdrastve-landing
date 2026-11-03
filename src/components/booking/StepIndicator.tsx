import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = ["Лекар и час", "Вашите данни", "Готово"];

export function StepIndicator({ current }: { current: 1 | 2 | 3 }) {
  return (
    <ol className="flex items-center gap-2 sm:gap-4" aria-label="Стъпки на записването">
      {steps.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <li key={label} className="flex items-center gap-2 sm:gap-3" aria-current={active ? "step" : undefined}>
            <span
              className={cn(
                "grid h-8 w-8 shrink-0 place-items-center rounded-full border text-sm font-semibold transition-colors",
                active && "border-primary-deep bg-primary-deep text-primary-foreground",
                done && "border-primary bg-primary text-primary-foreground",
                !active && !done && "border-border bg-background text-muted-foreground",
              )}
            >
              {done ? <Check className="h-4 w-4" /> : n}
            </span>
            <span className={cn("text-sm", active ? "font-semibold text-primary-deep" : "text-muted-foreground", !active && "hidden sm:inline")}>
              {label}
            </span>
            {n < steps.length && <span aria-hidden="true" className="h-px w-6 sm:w-10 bg-border" />}
          </li>
        );
      })}
    </ol>
  );
}
