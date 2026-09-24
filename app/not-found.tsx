import Link from "next/link";
import {T} from "@/providers/i18n-provider";
export default function NotFound(){return <main id="main" className="max-w-xl mx-auto p-10"><h1 className="heading"><T>Page not found</T></h1><p className="my-4 text-muted-foreground"><T>This page may have moved or no longer exists.</T></p><Link className="text-primary underline" href="/books"><T>Explore the catalog</T></Link></main>;}
