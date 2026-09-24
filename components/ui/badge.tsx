"use client";
import { cn } from "@/lib/utils";
import {useI18n} from "@/providers/i18n-provider";

export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "success" | "warning" | "danger" | "primary" }) {
  const{t}=useI18n();
  return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium", {
    "bg-muted text-muted-foreground": tone === "neutral",
    "border-success/30 bg-success/10 text-success": tone === "success",
    "border-warning/30 bg-warning/10 text-warning": tone === "warning",
    "border-destructive/30 bg-destructive/10 text-destructive": tone === "danger",
    "border-primary/30 bg-primary/10 text-primary": tone === "primary",
  })}>{typeof children==="string"?t(children):children}</span>;
}

export function statusTone(value: string): "neutral" | "success" | "warning" | "danger" | "primary" {
  if (["SUCCESS", "PAID", "RETURNED", "FULFILLED", "AVAILABLE"].includes(value)) return "success";
  if (["PENDING", "PROCESSING", "CHECKED_OUT"].includes(value)) return "primary";
  if (["OVERDUE", "PARTIALLY_PAID"].includes(value)) return "warning";
  if (["FAILED", "LOST", "DAMAGED", "EXPIRED"].includes(value)) return "danger";
  return "neutral";
}
