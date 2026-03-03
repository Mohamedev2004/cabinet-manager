import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BreadcrumbItem } from '@/types';

type Faq = { question: string; answer: string };
type Service = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  price?: number | null;
  duration?: number | null;
  is_active: boolean;
  is_price_visible: boolean;
  cover_image?: string | null;
  image_one?: string | null;
  image_two?: string | null;
  faqs?: Faq[];
};

export default function ServiceDetails() {
  const { props } = usePage<{ service: Service }>();
  const service = props.service;

  const cover = service.cover_image ? `/storage/${service.cover_image}` : undefined;
  const img1 = service.image_one ? `/storage/${service.image_one}` : undefined;
  const img2 = service.image_two ? `/storage/${service.image_two}` : undefined;

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Outils Crm', href: '#' },
    { title: 'Services', href: '/admin/services' },
    { title: service.name, href: '#' },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Service: ${service.name}`} />

      <div className="px-6 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">{service.name}</h1>
            <Badge variant="secondary">{service.slug}</Badge>
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => router.visit(route('services.index'))}>Retour</Button>
            <Button onClick={() => router.visit(route('services.edit', service.id))}>Modifier</Button>
          </div>
        </div>

        {cover && <img src={cover} className="w-full h-64 object-cover rounded-md" alt={service.name} />}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{service.description ?? '—'}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Détails</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><span className="text-muted-foreground">Prix:</span> {service.is_price_visible ? (service.price ?? '—') : 'Masqué'}</p>
              <p><span className="text-muted-foreground">Durée:</span> {service.duration ? `${service.duration} min` : '—'}</p>
              <p><span className="text-muted-foreground">Statut:</span> {service.is_active ? 'Actif' : 'Inactif'}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {img1 && <img src={img1} className="w-full h-56 object-cover rounded-md" alt="Image 1" />}
          {img2 && <img src={img2} className="w-full h-56 object-cover rounded-md" alt="Image 2" />}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>FAQs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(service.faqs ?? []).length === 0 ? (
              <p className="text-muted-foreground">Aucune question pour ce service.</p>
            ) : (
              service.faqs?.map((f, i) => (
                <div key={i}>
                  <p className="font-medium">{f.question}</p>
                  <p className="text-muted-foreground">{f.answer}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

