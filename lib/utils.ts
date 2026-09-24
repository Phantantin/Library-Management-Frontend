import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
export function money(amount: number | null | undefined, currency = "VND", locale = "en") {
  if (amount == null) return "\u2014";
  const digits =
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).resolvedOptions().maximumFractionDigits ?? 2;
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(
    amount / 10 ** digits,
  );
}
export const date = (value: string | null | undefined, locale = "en") =>
  value
    ? new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
        new Date(value.replace(" ", "T")),
      )
    : "\u2014";
export const label = (s: string) =>
  s
    .replace(/^ROLE_/, "")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/^./, (c) => c.toUpperCase());
export function safeCheckout(url: string) {
  const u = new URL(url);
  if (
    u.protocol !== "https:" ||
    !["rzp.io", "rzp.me", "razorpay.com", "checkout.razorpay.com"].includes(
      u.hostname,
    )
  )
    throw new Error("Unrecognized checkout destination");
  return u.href;
}
