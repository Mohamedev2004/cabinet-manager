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
  NativeDialogTrigger,
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
import type { InvoiceItem } from "./columns";
import { Trash2 } from 'lucide-react';

type PatientOption = { id: number; name: string };
type ServiceOption = { id: number; name: string; price?: number | null };

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  patients: PatientOption[];
  services: ServiceOption[];
  onSuccess?: () => void;
};

export default function CreateInvoiceModal({
  open,
  onOpenChange,
  patients,
  services,
  onSuccess,
}: Props) {
  const [patientId, setPatientId] = useState<number | null>(null);
  const [invoiceDate, setInvoiceDate] = useState<string>("");
  const [items, setItems] = useState<InvoiceItem[]>([]);
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
    if (!patientId) {
      toast.error("Sélectionnez un patient");
      return;
    }
    if (items.length === 0) {
      toast.error("Ajoutez au moins un service");
      return;
    }
    setSubmitting(true);
    router.post(
      route("invoices.store"),
      {
        patient_id: patientId,
        invoice_date: invoiceDate || null,
        items: items.map((i) => ({ service_id: i.service_id, unit_price: i.unit_price })),
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          toast.success("Facture créée avec succès");
          onSuccess?.();
          onOpenChange(false);
          setItems([]);
          setPatientId(null);
          setInvoiceDate("");
        },
        onFinish: () => setSubmitting(false),
      }
    );
  };

  return (
    <NativeDialog open={open} onOpenChange={onOpenChange}>
      <NativeDialogTrigger asChild>
      </NativeDialogTrigger>
      <NativeDialogContent className="sm:max-w-[650px]">
        <NativeDialogHeader>
          <NativeDialogTitle>Créer une facture</NativeDialogTitle>
          <NativeDialogDescription>Renseignez les informations de la facture.</NativeDialogDescription>
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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Éléments</Label>
              <Button size="sm" variant="default" className="mb-4" onClick={addItem}>
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
          <Button onClick={handleSubmit} disabled={submitting}>
            Créer
          </Button>
        </NativeDialogFooter>
      </NativeDialogContent>
    </NativeDialog>
  );
}

