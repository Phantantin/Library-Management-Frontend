import Link from "next/link";
import {T} from "@/providers/i18n-provider";
export default function Page(){return <main id="main" className="max-w-xl mx-auto p-10"><h1 className="heading"><T>Access restricted</T></h1><p className="my-4"><T>This area is reserved for library administrators.</T></p><Link href="/dashboard" className="text-primary underline"><T>Back to your dashboard</T></Link></main>;}
