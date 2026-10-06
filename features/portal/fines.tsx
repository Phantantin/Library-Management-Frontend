"use client";

import { useState } from "react";
import { useResource, useAction } from "@/hooks/query";
import { portalApi } from "./api";
import { PageHeader } from "@/components/ui/page-header";
import { Loading, ErrorState, Empty } from "@/components/ui/states";
import { Badge, statusTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { label, safeVnpayCheckout } from "@/lib/utils";
import { useI18n } from "@/providers/i18n-provider";

export function FinesPage() {
  const { t, money } = useI18n();
  const [status, setStatus] = useState("");
  const fines = useResource(["my-fines", status], () => portalApi.fines({ status: status || undefined }));
  const pay = useAction(async (input: { id: number; method: "ALL" | "QR" }) => {
    const result = await portalApi.payFine(input.id, input.method);
    window.location.assign(safeVnpayCheckout(result.checkoutUrl));
    return result;
  }, "");

  return <>
    <PageHeader eyebrow="Account balance" title="Fines" description="Review charges from the library. Payment is confirmed only after secure verification by the payment provider." />
    <div className="mb-5 max-w-xs"><label htmlFor="fine-status">{t("Status")}</label><select id="fine-status" value={status} onChange={event => setStatus(event.target.value)}><option value="">{t("All fines")}</option>{["PENDING", "PARTIALLY_PAID", "PAID", "WAIVED"].map(value => <option key={value} value={value}>{t(label(value))}</option>)}</select></div>
    {fines.isPending ? <Loading /> : fines.error ? <ErrorState error={fines.error} retry={() => void fines.refetch()} /> : fines.data?.length ?
      <div className="overflow-x-auto panel p-0"><table><thead><tr><th>{t("Book")}</th><th>{t("Type")}</th><th>{t("Status")}</th><th>{t("Amount")}</th><th><span className="sr-only">{t("Actions")}</span></th></tr></thead>
        <tbody>{fines.data.map(fine => {
          const payable = ["PENDING", "PARTIALLY_PAID"].includes(fine.status);
          return <tr key={fine.id}>
            <td><strong>{fine.bookTitle}</strong><br /><span className="text-xs text-muted-foreground">{fine.reason}</span></td>
            <td>{t(label(fine.type))}</td><td><Badge tone={statusTone(fine.status)}>{t(label(fine.status))}</Badge></td><td>{money(fine.amountOutstanding ?? fine.amount)}</td>
            <td className="text-right"><div className="flex flex-wrap justify-end gap-2">
              <Button disabled={!payable || pay.isPending} onClick={() => pay.mutate({ id: fine.id, method: "ALL" })}>{t("Pay with VNPAY")}</Button>
              <Button variant="outline" disabled={!payable || pay.isPending} onClick={() => pay.mutate({ id: fine.id, method: "QR" })}>{t("Pay with VNPAY QR")}</Button>
            </div></td>
          </tr>;
        })}</tbody></table></div> : <Empty title="No fines" text="You have no charges in this view." />}
    {pay.error && <p className="text-destructive mt-4" role="alert">{t(pay.error.message)}</p>}
  </>;
}
