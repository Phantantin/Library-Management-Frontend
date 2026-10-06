import type { Metadata } from "next";
import { Providers } from "@/providers/providers";
import "./globals.css";
import {T} from "@/providers/i18n-provider";
import {cookies} from "next/headers";
import {localeCookie,type Locale} from "@/lib/i18n";

export const metadata: Metadata = {
  title: { default: "Folio Library", template: "%s | Folio Library" },
  description: "Discover your next read and manage your library account, borrowing and reservations.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const stored=(await cookies()).get(localeCookie)?.value;
  const locale:Locale=stored==="vi"?"vi":"en";
  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <Providers initialLocale={locale}>
          <a href="#main" className="sr-only focus:fixed focus:z-50 focus:bg-card focus:p-4 focus:not-sr-only">
            <T>Skip to content</T>
          </a>
          {children}
        </Providers>
      </body>
    </html>
  );
}
