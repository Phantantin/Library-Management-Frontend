"use client";
import Link from "next/link";
import { useResource } from "@/hooks/query";
import { portalApi } from "./api";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Loading, ErrorState } from "@/components/ui/states";
import { Badge, statusTone } from "@/components/ui/badge";
import { label } from "@/lib/utils";
import {useI18n} from "@/providers/i18n-provider";

export function MemberDashboard() {
  const{t,date,money}=useI18n();
  const loans = useResource(["dashboard-loans"], () => portalApi.loans({ page: 0, size: 10 }));
  const reservations = useResource(["dashboard-reservations"], () => portalApi.reservations({ page: 0, size: 5, activeOnly: true }));
  const fines = useResource(["dashboard-fines"], () => portalApi.fines({ status: "PENDING" }));
  if (loans.isPending || reservations.isPending || fines.isPending) return <Loading />;
  if (loans.error) return <ErrorState error={loans.error} retry={() => void loans.refetch()} />;
  const current = loans.data?.content.filter(l => ["CHECKED_OUT", "OVERDUE"].includes(l.bookLoanStatus)) ?? [];
  const overdue = current.filter(l => l.bookLoanStatus === "OVERDUE").length;
  const balance = fines.data?.reduce((sum, fine) => sum + (fine.amountOutstanding ?? fine.amount), 0) ?? 0;
  return <><PageHeader eyebrow="Welcome back" title="Your library at a glance" description="Due dates, reservations and fines gathered from your live account." action={<Link className="text-sm text-primary" href="/books">{t("Find another book")} →</Link>} />
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4"><StatCard label={t("Current loans")} value={current.length}/><StatCard label={t("Overdue")} value={overdue}/><StatCard label={t("Reservations")} value={reservations.data?.totalElements ?? 0}/><StatCard label={t("Fine balance")} value={money(balance)}/></div>
    <section className="mt-9"><div className="flex justify-between items-center mb-4"><h2 className="text-xl font-semibold">{t("Books with you")}</h2><Link className="text-sm text-primary" href="/dashboard/loans">{t("All loans")} →</Link></div><div className="space-y-3">{current.slice(0,4).map(loan=><article key={loan.id} className="panel flex flex-wrap justify-between gap-4"><div><Link className="font-semibold hover:text-primary" href={`/books/${loan.bookId}`}>{loan.bookTitle}</Link><p className="text-sm text-muted-foreground mt-1">{t("Due {date}",{date:date(loan.dueDate)})}</p></div><Badge tone={statusTone(loan.bookLoanStatus)}>{t(label(loan.bookLoanStatus))}</Badge></article>)}{!current.length&&<div className="panel text-muted-foreground">{t("No books are currently checked out.")} <Link href="/books" className="text-primary">{t("Browse the shelves.")}</Link></div>}</div></section></>;
}
