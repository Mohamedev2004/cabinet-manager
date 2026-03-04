/* eslint-disable import/order */
"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { Invoice, InvoiceItem } from "./columns";
import { Trash2 } from "lucide-react";

type PatientOption = { id: number; name: string };
type ServiceOption = { id: number; name: string; price?: number | null };

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  invoice: Invoice | null;
  patients: PatientOption[];
  services: ServiceOption[];
  onSuccess?: () => void;
};

export function UpdateInvoiceModal({
  open,
  onOpenChange,
  invoice,
  patients,
  services,
  onSuccess,
}: Props) {
  const [patientId, setPatientId] = useState<number | null>(invoice?.patient_id ?? null);
  const [invoiceDate, setInvoiceDate] = useState<string>(invoice?.invoice_date ?? "");
  const [status, setStatus] = useState<"pending" | "paid">(invoice?.status ?? "pending");
  const [items, setItems] = useState<InvoiceItem[]>(
    (invoice?.items ?? []).map((i) => ({
      id: i.id,
      service_id: i.service_id,
      unit_price: i.unit_price,
    }))
  );
  const [submitting, setSubmitting] = useState(false);

  const addItem = () => {
    const firstService = services[0];
    if (!firstService) return;
    setItems((prev) => [
      ...prev,
      { service_id: firstService.id, unit_price: Number(firstService.price ?? 0) },
    ]);
  };

  const updateItem = (index: number, patch: Partial<InvoiceItem>) => {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!invoice) return;
    if (!patientId) {
      toast.error("Sélectionnez un patient");
      return;
    }
    if (items.length === 0) {
      toast.error("Ajoutez au moins un service");
      return;
    }
    setSubmitting(true);
    router.put(
      route("invoices.update", invoice.id),
      {
        patient_id: patientId,
        invoice_date: invoiceDate || null,
        status,
        items: items.map((i) => ({ service_id: i.service_id, unit_price: i.unit_price })),
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          toast.success("Facture mise à jour");
          onSuccess?.();
          onOpenChange(false);
        },
        onFinish: () => setSubmitting(false),
      }
    );
  };

  return (
    <NativeDialog open={open} onOpenChange={onOpenChange}>
      <NativeDialogContent className="sm:max-w-[650px]">
        <NativeDialogHeader>
          <NativeDialogTitle>Modifier la facture</NativeDialogTitle>
          <NativeDialogDescription>Mettre à jour les informations de la facture.</NativeDialogDescription>
        </NativeDialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Patient</Label>
            <div className="col-span-3">
              <Select
                value={patientId ? String(patientId) : ""}
                onValueChange={(v) => setPatientId(Number(v))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Date</Label>
            <div className="col-span-3">
              <Input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Statut</Label>
            <div className="col-span-3">
              <Select value={status} onValueChange={(v) => setStatus(v as "pending" | "paid")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="paid">Payée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Éléments</Label>
              <Button size="sm" variant="default" onClick={addItem} className="mb-4">
                Ajouter un service
              </Button>
            </div>
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2">
                  <div className="col-span-7">
                    <Select
                      value={String(item.service_id)}
                      onValueChange={(v) => {
                        const s = services.find((ss) => ss.id === Number(v));
                        updateItem(idx, {
                          service_id: Number(v),
                          unit_price: Number(s?.price ?? 0),
                        });
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((s) => (
                          <SelectItem key={s.id} value={String(s.id)}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-3">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.unit_price}
                      onChange={(e) => updateItem(idx, { unit_price: Number(e.target.value) })}
                    />
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <Button variant="destructive" onClick={() => removeItem(idx)}>
                      <Trash2 className="w-4 h-4"/>
                    </Button>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <p className="text-sm text-muted-foreground">Aucun service ajouté.</p>
              )}
            </div>
          </div>
        </div>

        <NativeDialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={submitting || !invoice}>
            Enregistrer
          </Button>
        </NativeDialogFooter>
      </NativeDialogContent>
    </NativeDialog>
  );
}
