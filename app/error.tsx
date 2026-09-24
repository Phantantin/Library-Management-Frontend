"use client";
import {ErrorState} from "@/components/ui/states";
export default function ErrorPage({reset}:{reset:()=>void}){return <main id="main" className="max-w-xl mx-auto p-6 py-20"><ErrorState error={new Error("The library service is unavailable. Please try again.")} retry={reset}/></main>;}
