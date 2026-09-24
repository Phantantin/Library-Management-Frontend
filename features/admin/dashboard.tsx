"use client";

import {
  Bar,
  BarChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ErrorState, Loading } from "@/components/ui/states";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { useResource } from "@/hooks/query";
import { label } from "@/lib/utils";
import { adminApi } from "./api";
import {useI18n} from "@/providers/i18n-provider";

const tooltipStyle = { background: "var(--card)", borderColor: "var(--border)" };

export function AdminDashboard() {
  const{t,money}=useI18n();
  const query = useResource(["admin-stats"], adminApi.stats);
  if (query.isPending) return <Loading />;
  if (query.error) return <ErrorState error={query.error} retry={() => void query.refetch()} />;
  const stats = query.data;

  return (
    <>
      <PageHeader
        eyebrow="Library operations"
        title="Administration overview"
        description="Live totals and 30-day trends calculated from library records. No synthetic metrics are shown."
      />
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label={t("Active titles")} value={stats.totalActiveBooks} />
        <StatCard label={t("Available titles")} value={stats.totalAvailableBooks} />
        <StatCard label={t("Members")} value={stats.users} />
        <StatCard label={t("All loans")} value={stats.loans} />
        <StatCard label={t("Overdue loans")} value={stats.overdue} />
        <StatCard label={t("Reservations")} value={stats.reservations} />
        <StatCard label={t("Payments")} value={stats.payments} />
        <StatCard label={t("Active memberships")} value={stats.activeSubscriptions} />
      </div>

      {stats.revenueTotals.length ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.revenueTotals.map((total) => (
            <StatCard key={total.currency} label={t("Verified revenue ({currency})",{currency:total.currency})} value={money(total.amount, total.currency)} />
          ))}
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <ChartPanel title="Circulation and new members" description="Daily activity during the last 30 days.">
          <LineChart data={stats.operationsTrend}>
            <XAxis dataKey="date" tick={{ fontSize: 10 }} minTickGap={24} />
            <YAxis allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
            <Line type="monotone" dataKey="loans" name={t("Loans")} stroke="var(--primary)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="returns" name={t("Returns")} stroke="var(--success)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="newUsers" name={t("New users")} stroke="var(--warning)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartPanel>

        <ChartPanel title="Verified revenue" description="Successful provider-verified payments, kept separate by currency.">
          <BarChart data={stats.revenueTrend}>
            <XAxis dataKey="date" tick={{ fontSize: 10 }} minTickGap={24} />
            <YAxis allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} formatter={(value, _name, item) => money(Number(value), item.payload.currency)} />
            <Bar dataKey="amount" name={t("Revenue")} fill="var(--primary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartPanel>

        <ChartPanel title="Loans by status" description="Current loan records grouped by status.">
          <BarChart data={stats.loanStatuses}>
            <XAxis dataKey="name" tickFormatter={(value)=>t(label(value))} tick={{ fontSize: 10 }} />
            <YAxis allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} labelFormatter={(value) => t(label(String(value ?? "")))} />
            <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartPanel>

        <ChartPanel title="Popular books" description="Most frequently borrowed titles across recorded loans.">
          <BarChart data={stats.popularBooks} layout="vertical" margin={{ left: 24 }}>
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="count" name={t("Loans")} fill="var(--primary)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ChartPanel>

        <ChartPanel title="Popular genres" description="Borrowing volume grouped by catalog genre.">
          <BarChart data={stats.popularGenres} layout="vertical" margin={{ left: 24 }}>
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="count" name={t("Loans")} fill="var(--warning)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ChartPanel>
      </div>
    </>
  );
}

function ChartPanel({ title, description, children }: { title: string; description: string; children: React.ReactElement }) {
  const{t}=useI18n();
  return (
    <section className="panel">
      <h2 className="text-xl font-semibold">{t(title)}</h2>
      <p className="mb-6 mt-1 text-sm text-muted-foreground">{t(description)}</p>
      <div className="h-72" aria-label={t("{title} chart",{title:t(title)})}>
        <ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer>
      </div>
    </section>
  );
}
