"use client";
import {useEffect,useState} from "react";
import {QueryClient,QueryClientProvider} from "@tanstack/react-query";
import {ThemeProvider} from "next-themes";
import {Toaster} from "sonner";
import {ApiError} from "@/types/api";
import {CommandPalette} from "@/components/layout/command-palette";
import {useRouter} from "next/navigation";
import {I18nProvider} from "@/providers/i18n-provider";
import type {Locale} from "@/lib/i18n";
export function Providers({children,initialLocale}:{children:React.ReactNode;initialLocale:Locale}){const [client]=useState(()=>new QueryClient({defaultOptions:{queries:{staleTime:30000,retry:(n,e)=>!(e instanceof ApiError&&[400,401,403,404].includes(e.status))&&n<1,refetchOnWindowFocus:false},mutations:{retry:false}}}));const router=useRouter();
 useEffect(()=>{const expired=()=>{client.clear();const returnTo=window.location.pathname+window.location.search;router.replace(`/login?expired=1&returnTo=${encodeURIComponent(returnTo)}`);};window.addEventListener("session-expired",expired);return()=>window.removeEventListener("session-expired",expired);},[client,router]);
 return <ThemeProvider attribute="class" defaultTheme="system" enableSystem><I18nProvider initialLocale={initialLocale}><QueryClientProvider client={client}>{children}<CommandPalette/><Toaster richColors closeButton position="bottom-right"/></QueryClientProvider></I18nProvider></ThemeProvider>;
}
