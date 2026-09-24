"use client";

import { AlertCircle, BookOpen } from "lucide-react";
import { Button } from "./button";
import {useI18n} from "@/providers/i18n-provider";

export function Loading() {
  const{t}=useI18n();
  return (
    <div role="status" aria-label={t("Loading")} className="grid gap-4 py-6">
      {[1, 2, 3].map((item) => <div key={item} className="h-24 animate-pulse rounded-md bg-muted" />)}
      <span className="sr-only">{t("Loading library data")}</span>
    </div>
  );
}

export function ErrorState({ error, retry }: { error: Error; retry: () => void }) {
  const{t}=useI18n();
  return (
    <div role="alert" className="panel py-10 text-center">
      <AlertCircle className="mx-auto mb-3 text-destructive" />
      <h2 className="font-semibold">{t("We could not load this information")}</h2>
      <p className="my-3 text-muted-foreground">{t(error.message)}</p>
      <Button variant="outline" onClick={retry}>{t("Try again")}</Button>
    </div>
  );
}

export function Empty({
  title = "Nothing here yet",
  text = "Your library activity will appear here.",
  children,
}: { title?: string; text?: string; children?: React.ReactNode }) {
  const{t}=useI18n();
  return (
    <div className="panel py-12 text-center">
      <BookOpen className="mx-auto mb-4 text-muted-foreground" size={32} />
      <h2 className="text-lg font-semibold">{t(title)}</h2>
      <p className="mb-4 mt-2 text-muted-foreground">{t(text)}</p>
      {children}
    </div>
  );
}

export function Pagination({ page, total, onChange }: { page: number; total: number; onChange: (page: number) => void }) {
  const{t}=useI18n();
  return (
    <nav aria-label={t("Pagination")} className="mt-6 flex items-center justify-between gap-4">
      <Button variant="outline" disabled={page === 0} onClick={() => onChange(page - 1)}>{t("Previous")}</Button>
      <span className="text-sm text-muted-foreground">{t("Page {page} of {total}",{page:page+1,total:Math.max(1,total)})}</span>
      <Button variant="outline" disabled={page + 1 >= total} onClick={() => onChange(page + 1)}>{t("Next")}</Button>
    </nav>
  );
}
