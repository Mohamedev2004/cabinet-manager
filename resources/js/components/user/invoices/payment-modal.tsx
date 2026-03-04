"use client";

import { useEffect, useMemo, useState } from "react";
import { router } from "@inertiajs/react";
import {
  NativeDialog,
  NativeDialogContent,
  NativeDialogDescription,
  NativeDialogHeader,
  NativeDialogTitle,
  NativeDialogFooter,
} from "@/components/native-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { Invoice } from "./columns";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  invoice: Invoice | null;
  onSuccess?: () => void;
};

export function PaymentModal({
  open,
  onOpenChange,
  invoice,
  onSuccess,
}: Props) {
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  // Reset state when invoice changes
  useEffect(() => {
    if (!invoice) return;
    setPaidAmount(Number(invoice.paid_amount ?? 0));
  }, [invoice]);

  const totalAmount = Number(invoice?.total_amount ?? 0);

  // Remaining
  const remainingAmount = useMemo(() => {
    const r = totalAmount - paidAmount;
    return r < 0 ? 0 : r;
  }, [totalAmount, paidAmount]);

  // Auto status logic
  const computedStatus = useMemo(() => {
    if (paidAmount <= 0) return "pending";
    if (paidAmount < totalAmount) return "partially_paid";
    return "paid";
  }, [paidAmount, totalAmount]);

  const handleSubmit = () => {
    if (!invoice) return;

    if (paidAmount > totalAmount) {
      toast.error("Le montant payé ne peut pas dépasser le total (" + totalAmount.toFixed(2) + " Dhs)");
      return;
    }

    setSubmitting(true);

    router.put(
      route("invoices.updateStatus", invoice.id),
      {
        paid_amount: paidAmount,
        status: computedStatus,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          toast.success("Paiement enregistré");
          onSuccess?.();
          onOpenChange(false);
        },
        onFinish: () => setSubmitting(false),
      }
    );
  };

  if (!invoice) return null;

  return (
    <NativeDialog open={open} onOpenChange={onOpenChange}>
      <NativeDialogContent className="sm:max-w-[425px]">
        <NativeDialogHeader>
          <NativeDialogTitle>Enregistrer un paiement</NativeDialogTitle>
          <NativeDialogDescription>
            Saisissez le montant payé pour la facture <strong>{invoice.invoice_number}</strong>.
          </NativeDialogDescription>
        </NativeDialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="paid_amount">Montant payé</Label>
              <span className="text-sm font-medium">Total: {totalAmount.toFixed(2)} Dhs</span>
            </div>
            <Input
              id="paid_amount"
              type="number"
              step="0.01"
              min="0"
              max={totalAmount}
              value={paidAmount}
              onChange={(e) => setPaidAmount(Number(e.target.value))}
              className="text-lg"
              autoFocus
            />
          </div>

          <div className="bg-muted/50 p-3 rounded-md space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Reste à payer:</span>
              <span className={`font-bold ${remainingAmount > 0 ? "text-red-600" : "text-green-600"}`}>
                {remainingAmount.toFixed(2)} Dhs
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Statut:</span>
              {(() => {
                let variant: "success" | "in_progress" | "pending" = "pending";
                let label = "";

                if (computedStatus === "paid") {
                  variant = "success";
                  label = "Payée";
                } else if (computedStatus === "partially_paid") {
                  variant = "in_progress";
                  label = "Partiellement payée";
                } else {
                  variant = "pending";
                  label = "En attente";
                }

                return <Badge variant={variant}>{label}</Badge>;
              })()}
            </div>
          </div>
        </div>

        <NativeDialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Enregistrement..." : "Enregistrer le paiement"}
          </Button>
        </NativeDialogFooter>
      </NativeDialogContent>
    </NativeDialog>
  );
}
