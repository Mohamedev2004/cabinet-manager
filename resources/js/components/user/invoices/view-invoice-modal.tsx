 
"use client";

import {
  NativeDialog,
  NativeDialogContent,
  NativeDialogHeader,
  NativeDialogTitle,
  NativeDialogDescription,
} from "@/components/native-dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import type { Invoice } from "./columns";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  invoice: Invoice | null;
};

export function ViewInvoiceModal({ open, onOpenChange, invoice }: Props) {
  const statusVariant: "success" | "pending" = invoice?.status === "paid" ? "success" : "pending";
  const statusLabel = invoice?.status === "paid" ? "Payée" : "En attente";
  const total = Number(invoice?.total_amount ?? 0);

  return (
    <NativeDialog open={open} onOpenChange={onOpenChange}>
      <NativeDialogContent className="sm:max-w-[640px]">
        <NativeDialogHeader>
          <NativeDialogTitle>Détails de la facture</NativeDialogTitle>
          <NativeDialogDescription>Consultez les informations de la facture.</NativeDialogDescription>
        </NativeDialogHeader>

        {invoice && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">N° Facture</Label>
                <div className="font-medium">{invoice.invoice_number}</div>
              </div>
              <div className="text-right">
                <Badge variant={statusVariant}>{statusLabel}</Badge>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Date</Label>
                <div className="font-medium">
                  {invoice.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString() : "-"}
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Patient</Label>
                <div className="font-medium">
                  {invoice.patient ? `${invoice.patient.first_name} ${invoice.patient.last_name}` : "-"}
                </div>
              </div>
            </div>

            <div className="border rounded-md">
              <div className="px-3 py-2 border-b text-sm font-medium">Éléments</div>
              <div className="divide-y">
                {(invoice.items ?? []).map((it, idx) => (
                  <div key={idx} className="px-3 py-2 flex items-center justify-between text-sm">
                    <div>{it.service?.name ?? `Service #${it.service_id}`}</div>
                    <div className="font-medium">{Number(it.unit_price).toFixed(2)} Dhs</div>
                  </div>
                ))}
                {(!invoice.items || invoice.items.length === 0) && (
                  <div className="px-3 py-2 text-sm text-muted-foreground">Aucun élément.</div>
                )}
              </div>
              <div className="px-3 py-2 flex items-center justify-between font-medium">
                <div>Total</div>
                <div>{total.toFixed(2)} Dhs</div>
              </div>
            </div>
          </div>
        )}
      </NativeDialogContent>
    </NativeDialog>
  );
}

