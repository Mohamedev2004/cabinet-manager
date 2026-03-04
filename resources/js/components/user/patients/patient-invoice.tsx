/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useMemo, useState } from "react";
import { router } from "@inertiajs/react";
import { InvoicesDataTable } from "@/components/user/invoices/data-table";
import { createInvoiceColumns, type Invoice } from "@/components/user/invoices/columns";
import CreateInvoiceModal from "@/components/user/invoices/create-invoice-modal";
import { UpdateInvoiceModal } from "@/components/user/invoices/update-invoice-modal";
import { PaymentModal } from "@/components/user/invoices/payment-modal";
import { toast } from "sonner";

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

type ServiceOption = { id: number; name: string; price?: number | null };

type Props = {
  patientId: number;
  invoices: Pagination<Invoice>;
  filters: Filters;
  services: ServiceOption[];
  patientName: string;
};

export default function PatientInvoiceSection({ patientId, invoices, filters, services, patientName }: Props) {
  const data = invoices.data ?? [];
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selected, setSelected] = useState<Invoice | null>(null);

  const navigateWith = useCallback((params: Record<string, any>) => {
    router.get(route("patients.show", patientId), params, { preserveState: true, preserveScroll: true, replace: true });
  }, [patientId]);

  const onFilterChange = useCallback(
    (key: keyof Filters, value: any) => {
      navigateWith({
        inv_search: key === "search" ? value : filters.search,
        inv_status: key === "status" ? value : filters.status,
        inv_sortBy: filters.sortBy,
        inv_sortDir: filters.sortDir,
        inv_perPage: key === "perPage" ? value : filters.perPage,
        // keep reports filters as-is from current location (they are implicit in query string)
      });
    },
    [filters, navigateWith]
  );

  const onPageChange = useCallback(
    (page: number) => navigateWith({ inv_search: filters.search, inv_status: filters.status, inv_sortBy: filters.sortBy, inv_sortDir: filters.sortDir, inv_perPage: filters.perPage, page }),
    [filters, navigateWith]
  );

  const onPerPageChange = useCallback(
    (perPage: number) => navigateWith({ inv_search: filters.search, inv_status: filters.status, inv_sortBy: filters.sortBy, inv_sortDir: filters.sortDir, inv_perPage: perPage, page: 1 }),
    [filters, navigateWith]
  );

  const handleSetPending = useCallback((i: Invoice) => {
    router.put(route("invoices.updateStatus", i.id), { status: "pending" }, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Facture marquée en attente");
        router.reload({ only: ["patientInvoices"] });
      },
      onError: () => toast.error("Échec de la mise à jour du statut"),
    });
  }, []);

  const handleSetPaid = useCallback((i: Invoice) => {
    router.put(route("invoices.updateStatus", i.id), { status: "paid" }, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Facture marquée payée");
        router.reload({ only: ["patientInvoices"] });
      },
      onError: () => toast.error("Échec de la mise à jour du statut"),
    });
  }, []);

  const onBulkPending = useCallback((ids: number[]) => {
    router.post(route("invoices.setSelectedPending"), { invoice_ids: ids }, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Factures marquées en attente");
        setRowSelection({});
        router.reload({ only: ["patientInvoices"] });
      },
    });
  }, []);

  const onBulkPaid = useCallback((ids: number[]) => {
    router.post(route("invoices.setSelectedPaid"), { invoice_ids: ids }, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Factures marquées payées");
        setRowSelection({});
        router.reload({ only: ["patientInvoices"] });
      },
    });
  }, []);

  const columns = useMemo(
    () =>
      createInvoiceColumns({
        onView: () => {},
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
        currentSortBy: filters.sortBy,
        currentSortDir: filters.sortDir as any,
        onSortChange: (sortBy, sortDir) =>
          navigateWith({
            inv_search: filters.search,
            inv_status: filters.status,
            inv_sortBy: sortBy,
            inv_sortDir: sortDir,
            inv_perPage: filters.perPage,
            page: 1,
          }),
      }),
    [filters, navigateWith, handleSetPaid, handleSetPending]
  );

  const singlePatient = [{ id: patientId, name: patientName }];

  return (
    <div className="mt-10">
      <h3 className="text-xl font-semibold mb-4">Factures</h3>

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

      <CreateInvoiceModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        patients={singlePatient}
        services={services}
        defaultPatientId={patientId}
        onSuccess={() => router.reload({ only: ["patientInvoices"] })}
      />

      <UpdateInvoiceModal
        key={selected?.id ?? "new"}
        open={isEditOpen}
        onOpenChange={(v) => {
          setIsEditOpen(v);
          if (!v) setSelected(null);
        }}
        invoice={selected}
        patients={singlePatient}
        services={services}
        onSuccess={() => router.reload({ only: ["patientInvoices"] })}
      />

      <PaymentModal
        key={selected?.id ? `pay-${selected.id}` : "pay-new"}
        open={isPaymentOpen}
        onOpenChange={(v) => {
          setIsPaymentOpen(v);
          if (!v) setSelected(null);
        }}
        invoice={selected}
        onSuccess={() => router.reload({ only: ["patientInvoices"] })}
      />
    </div>
  );
}

