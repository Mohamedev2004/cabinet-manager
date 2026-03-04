/* eslint-disable import/order */
/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table-view-options";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ColumnDef } from "@tanstack/react-table";
import type { Invoice } from "./columns";

type Filters = {
  search?: string;
  status?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  perPage?: number;
};

type Pagination = {
  page: number;
  pageCount: number;
  perPage: number;
};

type Props<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowSelection: Record<string, boolean>;
  setRowSelection: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  filters: Filters;
  pagination: Pagination;
  onFilterChange: (key: keyof Filters, value: any) => void;
  onPerPageChange: (perPage: number) => void;
  onPageChange: (page: number) => void;
  onAddClick?: () => void;
  onBulkPending?: (ids: number[]) => void;
  onBulkPaid?: (ids: number[]) => void;
};

export function InvoicesDataTable<TData extends Invoice, TValue>({
  columns,
  data = [],
  rowSelection,
  setRowSelection,
  filters,
  pagination,
  onFilterChange,
  onPerPageChange,
  onPageChange,
  onAddClick,
  onBulkPending,
  onBulkPaid,
}: Props<TData, TValue>) {
  const [searchInput, setSearchInput] = useState(filters.search ?? "");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row: any) => `${row.id}`,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
  });

  const selectedIds = useMemo(
    () => Object.keys(rowSelection).map((k) => Number(k)),
    [rowSelection]
  );

  const selectedCount = selectedIds.length;

  // 🔎 Debounced Search
  useEffect(() => {
    if (searchInput === (filters.search ?? "")) return;

    const handler = setTimeout(() => {
      onFilterChange("search", searchInput || undefined);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchInput, filters.search, onFilterChange]);

  // ✅ Updated Status Options (includes partially_paid)
  const STATUS_OPTIONS = [
    { value: "pending", label: "En attente" },
    { value: "partially_paid", label: "Partiellement payée" },
    { value: "paid", label: "Payée" },
  ];

  const isFiltering = Boolean(
    filters.search || (filters.status && filters.status !== "all")
  );

  // ✅ Improved Empty State
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon" className="bg-foreground">
              <FileText className="text-background" />
            </EmptyMedia>

            <EmptyTitle>
              {isFiltering
                ? "Aucun résultat"
                : "Aucune facture trouvée"}
            </EmptyTitle>

            <EmptyDescription>
              {isFiltering
                ? "Aucune facture ne correspond aux filtres appliqués."
                : "Vous n'avez aucune facture pour le moment."}
            </EmptyDescription>
          </EmptyHeader>

          {onAddClick && (
            <EmptyContent className="flex-row justify-center gap-2">
              <Button onClick={onAddClick}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une facture
              </Button>
            </EmptyContent>
          )}
        </Empty>
      </div>
    );
  }

  return (
    <div className="rounded-lg mt-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          {/* Search */}
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">
              Rechercher
            </span>
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Rechercher par N° facture..."
              className="w-[240px]"
            />
          </div>

          {/* Status Filter */}
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">
              Statut
            </span>
            <Select
              value={filters.status || "all"}
              onValueChange={(v) =>
                onFilterChange(
                  "status",
                  v === "all" ? undefined : v
                )
              }
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {selectedCount > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Actions groupées ({selectedCount})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onBulkPending && (
                  <DropdownMenuItem
                    onClick={() => {
                      onBulkPending(selectedIds);
                      setRowSelection({});
                    }}
                  >
                    Marquer en attente
                  </DropdownMenuItem>
                )}
                {onBulkPaid && (
                  <DropdownMenuItem
                    onClick={() => {
                      onBulkPaid(selectedIds);
                      setRowSelection({});
                    }}
                  >
                    Marquer payée
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {onAddClick && (
            <Button onClick={onAddClick}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle facture
            </Button>
          )}

          <DataTableViewOptions table={table} />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end mt-3">
        <DataTablePagination
          page={pagination.page}
          pageCount={pagination.pageCount}
          perPage={pagination.perPage}
          onPageChange={onPageChange}
          onPerPageChange={onPerPageChange}
        />
      </div>
    </div>
  );
}