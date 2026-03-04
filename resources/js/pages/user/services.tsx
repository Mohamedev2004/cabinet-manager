/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/order */
import { Head, router, usePage } from '@inertiajs/react';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, MoreHorizontal, Trash2, Banknote, Clock } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BreadcrumbItem } from '@/types';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Folder } from 'lucide-react';
import { toast } from 'sonner';
import { DataTablePagination } from '@/components/data-table-pagination';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SquarePen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Service {
  id: number;
  name: string;
  description?: string;
  price?: number;
  is_price_visible:boolean;
  duration?: number | null;
  is_active: boolean;
  cover_image?: string | null;
}

interface Pagination<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface ServicesProps {
  services: Pagination<Service>;
  filters: { search?: string; perPage?: number };
}

export default function Services({ services, filters }: ServicesProps) {
  const [search, setSearch] = useState(filters.search || '');
  const { props } = usePage<{ flash?: { success?: string; error?: string; warning?: string } }>();
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Outils Crm', href: '#' },
    { title: 'Services', href: '/admin/services' },
  ];
  const hasServices = (services.data?.length ?? 0) > 0;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    router.get(route('services.index'), { search: e.target.value, perPage: filters.perPage }, { preserveState: true });
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this service?')) {
      router.delete(route('services.destroy', id), {
        onError: () => toast.error('La suppression a échoué'),
        preserveScroll: true,
      });
    }
  };

  const truncate = (text?: string, max = 80) => {
    if (!text) return '';
    return text.length > max ? `${text.slice(0, max)}…` : text;
  };

  const navigateWith = (partial: Partial<{ search: string; page: number; perPage: number }>) => {
    const query = {
      search: partial.search ?? filters.search ?? '',
      page: partial.page ?? services.current_page,
      perPage: partial.perPage ?? filters.perPage ?? services.per_page,
    };
    router.get(route('services.index'), query, {
      preserveState: true,
      replace: true,
      preserveScroll: true,
    });
  };

  const lastFlashRef = useRef<{ success?: string; error?: string; warning?: string }>({ });
  useEffect(() => {
    const current = props.flash ?? {};
    const last = lastFlashRef.current;
    if (current.success && current.success !== last.success) {
      toast.success(current.success);
    }
    if (current.error && current.error !== last.error) {
      toast.error(current.error);
    }
    if (current.warning && current.warning !== last.warning) {
      toast.warning?.(current.warning as any);
    }
    lastFlashRef.current = {
      success: current.success,
      error: current.error,
      warning: current.warning,
    };
  }, [props.flash]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Services" />
        {!hasServices ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon" className="bg-foreground">
                  <Folder className="text-background" />
                </EmptyMedia>
                <EmptyTitle>Aucun service</EmptyTitle>
                <EmptyDescription>Ajoutez votre premier service pour commencer.</EmptyDescription>
              </EmptyHeader>
              <EmptyContent className="flex-row justify-center gap-2">
                <Button onClick={() => router.get(route('services.create'))}>
                  <Plus className="mr-2 h-4 w-4" /> Créer un service
                </Button>
              </EmptyContent>
            </Empty>
          </div>
        ) : (
      <div className="w-full px-6 mx-auto">
        {hasServices && <h2 className="text-2xl font-bold tracking-tight mt-4 mb-4">Services</h2>}
        <div className="flex items-center justify-between mb-6">
          <Input placeholder="Search..." value={search} onChange={handleSearch} className="w-64" />
          <Button onClick={() => router.get(route('services.create'))}>
            <Plus className="mr-2 h-4 w-4" /> Create Service
          </Button>
        </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.data.map((service) => {
              const img = service.cover_image ? `/storage/${service.cover_image}` : undefined;
              return (
                <Card key={service.id} className="overflow-hidden !gap-0">
                  <div className="px-4">
                    {img ? (
                      <img loading='lazy' src={img} alt={service.name} className="h-auto w-full object-cover rounded-lg" />
                    ) : (
                      <div className="h-40 w-full bg-muted rounded-lg" />
                    )}
                  </div>

                  <CardHeader className='mt-3'>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        {service.name}
                      </CardTitle>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.get(route('services.edit', service.id))}>
                            <SquarePen className="mr-2 h-4 w-4" /> Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(service.id)}
                            className="text-red-500 focus:text-red-500"
                            variant='destructive'
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 mt-2">
                    <p className="text-sm text-muted-foreground text-justify">
                      {truncate(service.description)}
                    </p>

                    {/* Price & Duration */}
                    <div className="flex flex-wrap gap-2">
                      {service.price && (
                        <Badge
                          variant='outline'
                          className="text-xs"
                        >
                          <Banknote className="h-3.5 w-3.5" />
                          {service.price} MAD
                        </Badge>
                      )}

                      {service.duration && (
                        <Badge
                          variant='outline'
                          className="text-xs"
                        >
                          <Clock className="h-3.5 w-3.5" />
                          {service.duration} min
                        </Badge>
                      )}
                    </div>

                    <Button
                      className="w-full mt-2"
                      size='sm'
                      onClick={() => router.get(route('services.show', service.id))}
                    >
                      Voir plus
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

        <div className="pt-4">
          <DataTablePagination
            page={services.current_page}
            pageCount={services.last_page}
            perPage={services.per_page}
            onPageChange={(page) => navigateWith({ page })}
            onPerPageChange={(perPage) => navigateWith({ perPage, page: 1 })}
          />
        </div>
      </div>
      )}
    </AppLayout>
  );
}
