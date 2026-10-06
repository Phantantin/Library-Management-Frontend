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

export function LoansPage() {
  const{t,date}=useI18n();
  const [page, setPage] = useState(0), [status, setStatus] = useState("");
  const query = useResource(["my-loans", page, status], () => portalApi.loans({ page, size: 10, status: status || undefined }));
  return <><PageHeader eyebrow="Your reading" title="My loans" description="Track due dates, returns and renewals. Borrowing follows the library's standard loan rules." />
    <div className="mb-5 max-w-xs"><label htmlFor="loan-status">{t("Status")}</label><select id="loan-status" value={status} onChange={e => { setStatus(e.target.value); setPage(0); }}><option value="">{t("All loans")}</option>{["CHECKED_OUT", "OVERDUE", "RETURNED", "LOST", "DAMAGED"].map(s => <option key={s} value={s}>{t(label(s))}</option>)}</select></div>
    {query.isPending ? <Loading /> : query.error ? <ErrorState error={query.error} retry={() => void query.refetch()} /> : query.data?.content.length ? <><div className="space-y-4">{query.data.content.map(loan => <article className="panel flex flex-wrap justify-between gap-5" key={loan.id}><div><Link href={`/books/${loan.bookId}`} className="font-semibold text-lg hover:text-primary">{loan.bookTitle}</Link><p className="text-sm text-muted-foreground mt-1">{loan.bookAuthor} · ISBN {loan.bookIsbn}</p><div className="mt-4 flex flex-wrap gap-4 text-sm"><span>{t("Borrowed {date}",{date:date(loan.checkoutDate)})}</span><span>{t("Due {date}",{date:date(loan.dueDate)})}</span><Badge tone={statusTone(loan.bookLoanStatus)}>{t(label(loan.bookLoanStatus))}</Badge></div></div><div className="flex flex-wrap items-center gap-2"><ActionDialog label="Renew" description="Extend this loan within the library's renewal period." numberField={{ label: "Extension days", initial: 7, max: 14 }} action={v => portalApi.renew(loan.id, v.number)} disabled={loan.bookLoanStatus !== "CHECKED_OUT"} /><ActionDialog label="Return" description="Confirm that you are returning this book to the library." action={() => portalApi.checkin(loan.id)} disabled={!['CHECKED_OUT', 'OVERDUE'].includes(loan.bookLoanStatus)} /></div></article>)}</div><Pagination page={page} total={query.data.totalPages} onChange={setPage} /></> : <Empty title="No loans found" text="Books you borrow will appear here."><Link className="text-primary" href="/books">{t("Explore books")} →</Link></Empty>}</>;
}
