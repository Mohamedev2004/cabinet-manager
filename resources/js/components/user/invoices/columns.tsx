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
import { Eye, MoreHorizontal, SquarePen } from "lucide-react";

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
  status: "pending" | "paid";
  total_amount: number;
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
    onSetPending: (invoice: Invoice) => void;
    onSetPaid: (invoice: Invoice) => void;
    currentSortBy?: string;
    currentSortDir?: "asc" | "desc";
    onSortChange?: (sortBy: string, sortDir: "asc" | "desc") => void;
  }
): ColumnDef<Invoice>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
      if (!i.patient) return <span className="text-muted-foreground italic">Aucun</span>;
      return `${i.patient.first_name} ${i.patient.last_name}`;
    },
  },

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
      const parsed = new Date((raw ?? "").toString().replace(" ", "T"));
      if (isNaN(parsed.getTime())) return "";
      return parsed.toLocaleDateString();
    },
  },

  {
    id: "services",
    header: "Services",
    cell: ({ row }) => {
      const i = row.original;
      const items = i.items ?? [];
      if (items.length === 0) {
        return <span className="text-muted-foreground">-</span>;
      }
      return (
        <div className="flex flex-wrap gap-1 max-w-[420px]">
          {items.map((it, idx) => (
            <Badge key={`${it.service_id}-${idx}`} variant="outline">
              {it.service?.name ?? `#${it.service_id}`}
            </Badge>
          ))}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: true,
  },

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
      return `${n.toFixed(2)} Dhs`;
    },
  },

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
      const i = row.original;
      const variant: "success" | "pending" = i.status === "paid" ? "success" : "pending";
      const label = i.status === "paid" ? "Payée" : "En attente";
      return <Badge className="capitalize" variant={variant}>{label}</Badge>;
    },
  },

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
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => opts.onSetPending(invoice)}>
              Marquer en attente
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => opts.onSetPaid(invoice)}>
              Marquer payée
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
