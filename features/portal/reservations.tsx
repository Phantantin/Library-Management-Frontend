"use client";
import { useState } from "react";
import Link from "next/link";
import { useResource } from "@/hooks/query";
import { portalApi } from "./api";
import { PageHeader } from "@/components/ui/page-header";
import { Loading, ErrorState, Empty, Pagination } from "@/components/ui/states";
import { Badge, statusTone } from "@/components/ui/badge";
import { ActionDialog } from "@/components/ui/action-dialog";
import { label } from "@/lib/utils";
import {useI18n} from "@/providers/i18n-provider";
export function ReservationsPage(){const{t,date}=useI18n();const [page,setPage]=useState(0),[status,setStatus]=useState("");const q=useResource(["my-reservations",page,status],()=>portalApi.reservations({page,size:10,status:status||undefined}));return <><PageHeader eyebrow="Your queue" title="Reservations" description="Follow your place in line and cancel reservations you no longer need."/><div className="mb-5 max-w-xs"><label htmlFor="reservation-status">{t("Status")}</label><select id="reservation-status" value={status} onChange={e=>{setStatus(e.target.value);setPage(0)}}><option value="">{t("All reservations")}</option>{["PENDING","AVAILABLE","FULFILLED","CANCELLED","EXPIRED"].map(s=><option key={s} value={s}>{t(label(s))}</option>)}</select></div>{q.isPending?<Loading/>:q.error?<ErrorState error={q.error} retry={()=>void q.refetch()}/>:q.data?.content.length?<><div className="space-y-4">{q.data.content.map(r=><article className="panel flex flex-wrap justify-between gap-5" key={r.id}><div><Link href={`/books/${r.bookId}`} className="text-lg font-semibold hover:text-primary">{r.bookTitle}</Link><p className="text-sm text-muted-foreground mt-1">{t("{author} · reserved {date}",{author:r.bookAuthor??"",date:date(r.reservedAt)})}</p><div className="flex gap-3 mt-4 items-center"><Badge tone={statusTone(r.status)}>{t(label(r.status))}</Badge>{r.queuePosition&&<span className="text-sm">{t("Queue position {position}",{position:r.queuePosition})}</span>}</div></div><ActionDialog label="Cancel" danger description="Your queue position will be released." action={()=>portalApi.cancelReservation(r.id)} disabled={!r.canBeCancelled}/></article>)}</div><Pagination page={page} total={q.data.totalPages} onChange={setPage}/></>:<Empty title="No reservations" text="When an unavailable book catches your eye, join its reservation queue."/>}</>}
