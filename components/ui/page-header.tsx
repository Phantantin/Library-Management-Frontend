"use client";
import {useI18n} from "@/providers/i18n-provider";
export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description: string; action?: React.ReactNode }) {
  const{t}=useI18n();
  return <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
    <div className="max-w-2xl">{eyebrow && <p className="eyebrow mb-2">{t(eyebrow)}</p>}<h1 className="heading">{t(title)}</h1><p className="mt-3 text-muted-foreground">{t(description)}</p></div>
    {action}
  </div>;
}
