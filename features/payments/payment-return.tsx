"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api";
import type { PaymentDTO } from "@/types/domain";
import { Loading } from "@/components/ui/states";
import { Badge, statusTone } from "@/components/ui/badge";
import { label } from "@/lib/utils";
import { useI18n } from "@/providers/i18n-provider";

const terminalStatuses = new Set(["SUCCESS", "FAILED", "CANCELLED", "REFUNDED"]);
const POLL_LIMIT_MS = 90_000;

export function PaymentReturn({ expectedId }: { expectedId: number }) {
  const { t, money } = useI18n();
  const [startedAt] = useState(() => Date.now());
  const payment = useQuery({
    queryKey: ["payment-return", expectedId],
    queryFn: () => get<PaymentDTO>(`/api/payments/${expectedId}`),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status && terminalStatuses.has(status)) return false;
      return Date.now() - startedAt < POLL_LIMIT_MS ? 2_000 : false;
    },
    retry: 1,
  });

  if (payment.isPending) {
    return <><h1 className="heading">{t("Verifying payment")}</h1><p className="text-muted-foreground mt-3">{t("We are waiting for VNPAY to confirm this payment securely.")}</p><Loading /></>;
  }

  if (payment.error) {
    return <div className="panel"><h1 className="heading">{t("Payment verification pending")}</h1><p role="alert" className="text-destructive mt-3">{t(payment.error.message)}</p><p className="text-sm text-muted-foreground mt-3">{t("Checkout reference: {id}. Your account changes only after VNPAY confirms the payment.",{id:expectedId})}</p><Link href="/dashboard/payments" className="text-primary block mt-5">{t("Check payment history")} →</Link></div>;
  }

  const result = payment.data;
  const terminal = result && terminalStatuses.has(result.status);
  if (!terminal) {
    return <div className="panel"><Badge tone="warning">{t("Payment confirmation pending")}</Badge><h1 className="heading mt-4">{t("Payment verification pending")}</h1><p className="text-muted-foreground mt-3">{t("VNPAY has not confirmed the result yet. Check payment history again in a moment.")}</p><Link href="/dashboard/payments" className="text-primary block mt-5">{t("Check payment history")} →</Link></div>;
  }

  const successful = result.status === "SUCCESS";
  return <div className="panel"><Badge tone={statusTone(result.status)}>{t(label(result.status))}</Badge><h1 className="heading mt-4">{t(successful ? "Payment verified" : "Payment not completed")}</h1><p className="text-muted-foreground mt-3">{money(result.amount,result.currency??"VND")} · {t(label(result.paymentType))}</p>{!successful&&result.failureReason&&<p className="mt-3 text-sm text-muted-foreground">{t(result.failureReason)}</p>}<div className="flex flex-wrap gap-5 mt-6"><Link href="/dashboard" className="text-primary">{t("Dashboard")} →</Link><Link href="/dashboard/payments" className="text-primary">{t("Payment history")} →</Link></div></div>;
}
