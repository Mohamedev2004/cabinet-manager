/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useMemo, useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import type { BreadcrumbItem } from "@/types";
import { toast } from "sonner";
import { InvoicesDataTable } from "@/components/user/invoices/data-table";
import {
  createInvoiceColumns,
  type Invoice,
} from "@/components/user/invoices/columns";
import CreateInvoiceModal from "@/components/user/invoices/create-invoice-modal";
import { UpdateInvoiceModal } from "@/components/user/invoices/update-invoice-modal";
import { ViewInvoiceModal } from "@/components/user/invoices/view-invoice-modal";
import { PaymentModal } from "@/components/user/invoices/payment-modal";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Outils Crm", href: "#" },
  { title: "Factures", href: "#" },
];

type Pagination<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

type Filters = {
  search?: string;
  status?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  perPage?: number;
};

type PatientOption = {
  id: number;
  first_name: string;
  last_name: string;
};

type ServiceOption = {
  id: number;
  name: string;
  price?: number | null;
};

interface Props {
  invoices: Pagination<Invoice>;
  patients: PatientOption[];
  services: ServiceOption[];
  filters: Filters;
}

export default function InvoicesIndex({
  invoices,
  patients,
  services,
  filters,
}: Props) {
  const data = invoices.data ?? [];

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selected, setSelected] = useState<Invoice | null>(null);

  /* ---------------- NAVIGATION ---------------- */

  const navigateWith = useCallback(
    (params: Record<string, any>) => {
      router.get(route("invoices.index"), params, {
        preserveState: true,
        replace: true,
      });
    },
    []
  );

  const onFilterChange = useCallback(
    (key: keyof Filters, value: any) => {
      navigateWith({ ...filters, [key]: value, page: 1 });
    },
    [filters, navigateWith]
  );

  const onPageChange = useCallback(
    (page: number) => {
      navigateWith({ ...filters, page });
    },
    [filters, navigateWith]
  );

  const onPerPageChange = useCallback(
    (perPage: number) => {
      navigateWith({ ...filters, perPage, page: 1 });
    },
    [filters, navigateWith]
  );

  /* ---------------- STATUS ACTIONS ---------------- */

  const handleSetPending = useCallback((invoice: Invoice) => {
    router.put(
      route("invoices.updateStatus", invoice.id),
      { status: "pending" },
      {
        preserveScroll: true,
        onSuccess: () => {
          toast.success("Facture marquée en attente");
          router.reload({ only: ["invoices"] });
        },
        onError: () =>
          toast.error("Échec de la mise à jour du statut"),
      }
    );
  }, []);

  const handleSetPaid = useCallback((invoice: Invoice) => {
    router.put(
      route("invoices.updateStatus", invoice.id),
      { status: "paid" },
      {
        preserveScroll: true,
        onSuccess: () => {
          toast.success("Facture marquée payée");
          router.reload({ only: ["invoices"] });
        },
        onError: () =>
          toast.error("Échec de la mise à jour du statut"),
      }
    );
  }, []);

  const handleSetPartiallyPaid = useCallback((invoice: Invoice) => {
    const amount = prompt("Entrer le montant payé :");

    if (!amount) return;

    const paidAmount = Number(amount);

    if (isNaN(paidAmount) || paidAmount <= 0) {
      toast.error("Montant invalide");
      return;
    }

    router.put(
      route("invoices.updateStatus", invoice.id),
      {
        status: "partially_paid",
        paid_amount: paidAmount,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          toast.success("Paiement partiel enregistré");
          router.reload({ only: ["invoices"] });
        },
        onError: (errors: any) => {
          toast.error(
            errors?.paid_amount ??
              "Erreur lors du paiement partiel"
          );
        },
      }
    );
  }, []);

  /* ---------------- BULK ACTIONS ---------------- */

  const onBulkPending = useCallback((ids: number[]) => {
    router.post(
      route("invoices.setSelectedPending"),
      { invoice_ids: ids },
      {
        preserveScroll: true,
        onSuccess: () => {
          toast.success("Factures marquées en attente");
          setRowSelection({});
          router.reload({ only: ["invoices"] });
        },
      }
    );
  }, []);

  const onBulkPaid = useCallback((ids: number[]) => {
    router.post(
      route("invoices.setSelectedPaid"),
      { invoice_ids: ids },
      {
        preserveScroll: true,
        onSuccess: () => {
          toast.success("Factures marquées payées");
          setRowSelection({});
          router.reload({ only: ["invoices"] });
        },
      }
    );
  }, []);

  /* ---------------- COLUMNS ---------------- */

  const columns = useMemo(
    () =>
      createInvoiceColumns({
        onView: (invoice) => {
          setSelected(invoice);
          setIsViewOpen(true);
        },
        onEdit: (invoice) => {
          setSelected(invoice);
          setIsEditOpen(true);
        },
        onPay: (invoice) => {
          setSelected(invoice);
          setIsPaymentOpen(true);
        },
        onSetPending: handleSetPending,
        onSetPaid: handleSetPaid,
        onSetPartiallyPaid: handleSetPartiallyPaid,
        currentSortBy: filters.sortBy,
        currentSortDir: filters.sortDir as any,
        onSortChange: (sortBy, sortDir) =>
          navigateWith({ ...filters, sortBy, sortDir }),
      }),
    [
      filters,
      navigateWith,
      handleSetPending,
      handleSetPaid,
      handleSetPartiallyPaid,
    ]
  );

  const formattedPatients = patients.map((p) => ({
    id: p.id,
    name: `${p.first_name} ${p.last_name}`,
  }));

  /* ---------------- UI ---------------- */

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Factures" />

      <div className="w-full px-6 mx-auto">
        {data.length > 0 && (
          <h2 className="text-2xl font-bold tracking-tight mt-4">
            Factures
          </h2>
        )}

        <InvoicesDataTable
          columns={columns}
          data={data}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          filters={filters}
          pagination={{
            page: invoices.current_page,
            pageCount: invoices.last_page,
            perPage: invoices.per_page,
          }}
          onFilterChange={onFilterChange}
          onPerPageChange={onPerPageChange}
          onPageChange={onPageChange}
          onAddClick={() => setIsCreateOpen(true)}
          onBulkPending={onBulkPending}
          onBulkPaid={onBulkPaid}
        />

        <ViewInvoiceModal
          open={isViewOpen}
          onOpenChange={(v) => {
            setIsViewOpen(v);
            if (!v) setSelected(null);
          }}
          invoice={selected}
        />

        <CreateInvoiceModal
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          patients={formattedPatients}
          services={services}
          onSuccess={() => router.reload({ only: ["invoices"] })}
        />

        <UpdateInvoiceModal
          key={selected?.id ?? "new"}
          open={isEditOpen}
          onOpenChange={(v) => {
            setIsEditOpen(v);
            if (!v) setSelected(null);
          }}
          invoice={selected}
          patients={formattedPatients}
          services={services}
          onSuccess={() => router.reload({ only: ["invoices"] })}
        />

        <PaymentModal
          key={selected?.id ? `pay-${selected.id}` : "pay-new"}
          open={isPaymentOpen}
          onOpenChange={(v) => {
            setIsPaymentOpen(v);
            if (!v) setSelected(null);
          }}
          invoice={selected}
          onSuccess={() => router.reload({ only: ["invoices"] })}
        />
      </div>
    </AppLayout>
  );
}