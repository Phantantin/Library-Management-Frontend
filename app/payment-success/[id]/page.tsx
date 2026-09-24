import { Suspense } from "react";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { PaymentReturn } from "@/features/payments/payment-return";
import { T } from "@/providers/i18n-provider";
export const metadata={title:"Verify payment",robots:{index:false}};
export default async function Page({params}:{params:Promise<{id:string}>}){await requireUser();const{id}=await params;if(!/^\d+$/.test(id))notFound();return <main id="main" className="max-w-2xl mx-auto p-5 py-16"><Suspense fallback={<p><T>Loading payment details…</T></p>}><PaymentReturn expectedId={Number(id)}/></Suspense></main>}
