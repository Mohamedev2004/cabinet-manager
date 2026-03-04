/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { CreditCard, Eye, MoreHorizontal, SquarePen } from "lucide-react";

export interface InvoiceItem {
  id?: number;
  service_id: number;
  unit_price: number;
  service?: { id: number; name: string; price?: number | null } | null;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  invoice_date?: string | null;

  // ✅ UPDATED STATUS
  status: "pending" | "partially_paid" | "paid";

  total_amount: number;
  paid_amount: number;          // ✅ NEW
  remaining_amount: number;     // ✅ NEW

  patient_id: number;
  patient?: {
    id: number;
    first_name: string;
    last_name: string;
  } | null;

  items?: InvoiceItem[];
  created_at: string;
  updated_at: string;
}

export const createInvoiceColumns = (
  opts: {
    onView: (invoice: Invoice) => void;
    onEdit: (invoice: Invoice) => void;
    onPay: (invoice: Invoice) => void;
    onSetPending: (invoice: Invoice) => void;
    onSetPaid: (invoice: Invoice) => void;
    onSetPartiallyPaid?: (invoice: Invoice) => void;
    currentSortBy?: string;
    currentSortDir?: "asc" | "desc";
    onSortChange?: (sortBy: string, sortDir: "asc" | "desc") => void;
  }
): ColumnDef<Invoice>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Tout sélectionner"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Sélectionner la ligne"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // Invoice Number
  {
    accessorKey: "invoice_number",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="N° Facture"
        columnId="invoice_number"
        currentSortBy={opts.currentSortBy}
        currentSortDir={opts.currentSortDir}
        onSortChange={opts.onSortChange}
      />
    ),
  },

  // Patient
  {
    id: "patient",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Patient"
        columnId="patient_id"
        currentSortBy={opts.currentSortBy}
        currentSortDir={opts.currentSortDir}
        onSortChange={opts.onSortChange}
      />
    ),
    cell: ({ row }) => {
      const i = row.original;
      if (!i.patient)
        return <span className="text-muted-foreground italic">Aucun</span>;
      return `${i.patient.first_name} ${i.patient.last_name}`;
    },
  },

  // Due Date
  {
    accessorKey: "invoice_date",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Date échéance"
        columnId="invoice_date"
        currentSortBy={opts.currentSortBy}
        currentSortDir={opts.currentSortDir}
        onSortChange={opts.onSortChange}
      />
    ),
    cell: ({ row }) => {
      const raw = row.getValue("invoice_date") as string;
      if (!raw) return "-";
      const parsed = new Date(raw.replace(" ", "T"));
      if (isNaN(parsed.getTime())) return "";
      return parsed.toLocaleDateString();
    },
  },

  // Total
  {
    accessorKey: "total_amount",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Total"
        columnId="total_amount"
        currentSortBy={opts.currentSortBy}
        currentSortDir={opts.currentSortDir}
        onSortChange={opts.onSortChange}
      />
    ),
    cell: ({ row }) => {
      const n = Number(row.getValue("total_amount"));
      return <span className="font-medium">{n.toFixed(2)} Dhs</span>;
    },
  },

  // ✅ Paid Amount
  {
    accessorKey: "paid_amount",
    header: "Payé",
    cell: ({ row }) => {
      const n = Number(row.getValue("paid_amount"));
      return <span className="text-green-600">{n.toFixed(2)} Dhs</span>;
    },
  },

  // ✅ Remaining Amount
  {
    accessorKey: "remaining_amount",
    header: "Reste",
    cell: ({ row }) => {
      const n = Number(row.getValue("remaining_amount"));
      return (
        <span className={n > 0 ? "text-red-500 font-medium" : "text-muted-foreground"}>
          {n.toFixed(2)} Dhs
        </span>
      );
    },
  },

  // ✅ Status (3 States)
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Statut"
        columnId="status"
        currentSortBy={opts.currentSortBy}
        currentSortDir={opts.currentSortDir}
        onSortChange={opts.onSortChange}
      />
    ),
    cell: ({ row }) => {
      const status = row.original.status;

      let variant: "success" | "in_progress" | "pending" = "in_progress";
      let label = "";

      if (status === "paid") {
        variant = "success";
        label = "Payée";
      } else if (status === "partially_paid") {
        variant = "in_progress";
        label = "Partiellement payée";
      } else {
        variant = "pending";
        label = "En attente";
      }

      return <Badge variant={variant}>{label}</Badge>;
    },
  },

  // Actions
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const invoice = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => opts.onView(invoice)}>
              <Eye className="mr-2 h-4 w-4" />
              Voir
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => opts.onEdit(invoice)}>
              <SquarePen className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => opts.onPay(invoice)}>
              <CreditCard className="mr-2 h-4 w-4" />
              Payer
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {invoice.status !== "pending" && (
              <DropdownMenuItem onClick={() => opts.onSetPending(invoice)}>
                Marquer en attente
              </DropdownMenuItem>
            )}

            {invoice.status !== "paid" && (
              <DropdownMenuItem onClick={() => opts.onSetPaid(invoice)}>
                Marquer payée
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];