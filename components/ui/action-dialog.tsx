"use client";

import { useState } from "react";
import { useAction } from "@/hooks/query";
import { Button } from "./button";
import { Modal } from "./dialog";
import {useI18n} from "@/providers/i18n-provider";

interface ActionValues {
  number: number;
  text: string;
}

interface ActionDialogProps {
  label: string;
  description: string;
  action: (values: ActionValues) => Promise<unknown>;
  danger?: boolean;
  numberField?: { label: string; initial: number; min?: number; max?: number };
  textField?: string;
  disabled?: boolean;
}

export function ActionDialog({
  label,
  description,
  action,
  danger = false,
  numberField,
  textField,
  disabled = false,
}: ActionDialogProps) {
  const{t}=useI18n();
  const [open, setOpen] = useState(false);
  const [number, setNumber] = useState(numberField?.initial ?? 1);
  const [text, setText] = useState("");
  const mutation = useAction(action, "Request completed");

  return (
    <>
      <Button variant={danger ? "destructive" : "outline"} disabled={disabled} onClick={() => setOpen(true)}>
        {t(label)}
      </Button>
      <Modal
        open={open}
        onOpenChange={(value) => {
          if (!mutation.isPending) setOpen(value);
        }}
        title={t(label)}
        description={t(description)}
      >
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            mutation.mutate({ number, text }, { onSuccess: () => setOpen(false) });
          }}
        >
          {numberField ? (
            <label>
              {t(numberField.label)}
              <input
                type="number"
                required
                min={numberField.min ?? 1}
                max={numberField.max ?? 365}
                value={number}
                onChange={(event) => setNumber(Number(event.target.value))}
              />
            </label>
          ) : null}
          {textField ? (
            <label>
              {t(textField)}
              <textarea required maxLength={500} value={text} onChange={(event) => setText(event.target.value)} />
            </label>
          ) : null}
          {mutation.error ? <p className="text-sm text-destructive" role="alert">{t(mutation.error.message)}</p> : null}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={mutation.isPending}>{t("Cancel")}</Button>
            <Button variant={danger ? "destructive" : "default"} disabled={mutation.isPending}>
              {t(mutation.isPending ? "Processing..." : "Confirm")}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
