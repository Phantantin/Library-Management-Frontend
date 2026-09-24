"use client";
import { useState } from "react";
import { useResource } from "@/hooks/query";
import { portalApi } from "./api";
import { PageHeader } from "@/components/ui/page-header";
import { Loading, ErrorState, Empty, Pagination } from "@/components/ui/states";
import { Badge, statusTone } from "@/components/ui/badge";
import { label } from "@/lib/utils";
import {useI18n} from "@/providers/i18n-provider";
export function PaymentsPage(){const{t,date,money}=useI18n();const[page,setPage]=useState(0);const q=useResource(["my-payments",page],()=>portalApi.payments({page,size:15}));return <><PageHeader eyebrow="Receipts" title="Payment history" description="Every payment shown here reflects the status securely verified by the library and payment provider."/>{q.isPending?<Loading/>:q.error?<ErrorState error={q.error} retry={()=>void q.refetch()}/>:q.data?.content.length?<><div className="overflow-x-auto panel p-0"><table><thead><tr><th>{t("Date")}</th><th>{t("Purpose")}</th><th>{t("Gateway")}</th><th>{t("Status")}</th><th>{t("Amount")}</th></tr></thead><tbody>{q.data.content.map(p=><tr key={p.id}><td>{date(p.initiatedAt??p.createdAt)}</td><td>{t(label(p.paymentType))}<br/><span className="text-xs text-muted-foreground">{p.transactionId}</span></td><td>{t(label(p.gateway))}</td><td><Badge tone={statusTone(p.status)}>{t(label(p.status))}</Badge></td><td>{money(p.amount,p.currency??"VND")}</td></tr>)}</tbody></table></div><Pagination page={page} total={q.data.totalPages} onChange={setPage}/></>:<Empty title="No payments" text="Membership and fine payments will appear after they are created."/>}</>}
