/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable import/order */
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
  const [patientId, setPatientId] = useState<number | null>(null);
  const [invoiceDate, setInvoiceDate] = useState<string>("");
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Reset state when invoice changes
  useEffect(() => {
    if (!invoice) return;

    setPatientId(invoice.patient_id ?? null);
    setInvoiceDate(invoice.invoice_date ?? "");
    setItems(
      (invoice.items ?? []).map((i) => ({
        id: i.id,
        service_id: i.service_id,
        unit_price: i.unit_price,
      }))
    );
  }, [invoice]);

  // Auto calculate total
  const totalAmount = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.unit_price), 0);
  }, [items]);

  const addItem = () => {
    const firstService = services[0];
    if (!firstService) return;

    setItems((prev) => [
      ...prev,
      {
        service_id: firstService.id,
        unit_price: Number(firstService.price ?? 0),
      },
    ]);
  };

  const updateItem = (index: number, patch: Partial<InvoiceItem>) => {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, ...patch } : it))
    );
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
        items: items.map((i) => ({
          service_id: i.service_id,
          unit_price: i.unit_price,
        })),
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
          <NativeDialogDescription>
            Mettre à jour les informations de la facture.
          </NativeDialogDescription>
        </NativeDialogHeader>

        <div className="grid gap-4 py-4">

          {/* Patient */}
          <div className="grid gap-1">
            <Label>Patient</Label>
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

          {/* Invoice Date */}
          <div className="grid gap-1">
            <Label>Date d'échéance</Label>
            <Input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
            />
          </div>

          {/* Services */}
          <div className="space-y-2">
            <div className="flex items-center justify-between mt-4">
              <Label>Services</Label>
              <Button size="sm" variant="default" onClick={addItem}>
                Ajouter un service
              </Button>
            </div>

            {items.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Aucun service ajouté.
              </p>
            )}

            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-7 grid gap-1">
                    <Label>Service</Label>
                    <Select
                      value={String(item.service_id)}
                      onValueChange={(v) => {
                        const s = services.find(
                          (ss) => ss.id === Number(v)
                        );
                        updateItem(idx, {
                          service_id: Number(v),
                          unit_price: Number(s?.price ?? 0),
                        });
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner un service" />
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

                  <div className="col-span-3 grid gap-1">
                    <Label>Prix</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.unit_price}
                      onChange={(e) =>
                        updateItem(idx, {
                          unit_price: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="col-span-2 flex justify-end">
                    <Button
                      variant="destructive"
                      onClick={() => removeItem(idx)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
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