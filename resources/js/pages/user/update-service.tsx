/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BreadcrumbItem } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Trash2 } from 'lucide-react';

type Faq = { id?: number; question: string; answer: string };
type Service = {
  id: number;
  name: string;
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

export default function UpdateService() {
  const { props } = usePage<{ service: Service }>();
  const service = props.service;

  const { data, setData, processing, errors } = useForm({
    name: service.name ?? '',
    description: service.description ?? '',
    price: service.price ?? '',
    duration: service.duration ?? '',
    is_active: !!service.is_active,
    is_price_visible: !!service.is_price_visible,
    cover_image: null as File | null,
    image_one: null as File | null,
    image_two: null as File | null,
    faqs: (service.faqs ?? []).map(f => ({ question: f.question, answer: f.answer })),
  });

  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [imageOnePreview, setImageOnePreview] = useState<string | null>(null);
  const [imageTwoPreview, setImageTwoPreview] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // On crée une copie des données pour ne pas polluer l'état local
    const formData: any = {
        ...data,
        _method: 'put',
        is_active: data.is_active ? 'yes' : 'no',
        is_price_visible: data.is_price_visible ? 'yes' : 'no',
    };

    // IMPORTANT : Supprimer les clés d'images si ce ne sont pas des fichiers
    // Si la valeur est null, Laravel ne doit pas la recevoir pour ne pas écraser l'existant
    if (!(data.cover_image instanceof File)) delete formData.cover_image;
    if (!(data.image_one instanceof File)) delete formData.image_one;
    if (!(data.image_two instanceof File)) delete formData.image_two;

    router.post(route('services.update', service.id), formData, {
        forceFormData: true,
    });
};

  const addFaq = () => setData('faqs', [...data.faqs, { question: '', answer: '' }]);
  const removeFaq = (index: number) => setData('faqs', data.faqs.filter((_, i) => i !== index));

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Outils Crm', href: '#' },
    { title: 'Services', href: '/admin/services' },
    { title: `Modifier ${service.name}`, href: '#' },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Modifier ${service.name}`} />
      <form onSubmit={onSubmit} className="px-6 py-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom</Label>
              <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
              {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="price">Prix</Label>
              <Input id="price" type="number" value={data.price as any} onChange={(e) => setData('price', e.target.value)} />
              {errors.price && <p className="text-destructive text-sm mt-1">{errors.price}</p>}
            </div>
            <div>
              <Label htmlFor="duration">Durée (minutes)</Label>
              <Input id="duration" type="number" value={data.duration as any} onChange={(e) => setData('duration', e.target.value)} />
              {errors.duration && <p className="text-destructive text-sm mt-1">{errors.duration}</p>}
            </div>
            <div>
              <Label htmlFor="is_active">Actif</Label>
              <Select
                value={data.is_active ? 'yes' : 'no'}
                onValueChange={(v) => setData('is_active', v === 'yes')}
              >
                <SelectTrigger id="is_active" className="mt-1">
                  <SelectValue placeholder="Choisir" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Oui</SelectItem>
                  <SelectItem value="no">Non</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="is_price_visible">Afficher le prix</Label>
              <Select
                value={data.is_price_visible ? 'yes' : 'no'}
                onValueChange={(v) => setData('is_price_visible', v === 'yes')}
              >
                <SelectTrigger id="is_price_visible" className="mt-1">
                  <SelectValue placeholder="Choisir" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Oui</SelectItem>
                  <SelectItem value="no">Non</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={data.description as any} onChange={(e) => setData('description', e.target.value)} />
              {errors.description && <p className="text-destructive text-sm mt-1">{errors.description}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Couverture</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e: any) => {
                  const f = e.target.files?.[0] ?? null;
                  setData('cover_image', f);
                  setCoverPreview(f ? URL.createObjectURL(f) : null);
                }}
              />
              {errors.cover_image && <p className="text-destructive text-sm mt-1">{errors.cover_image}</p>}
              {coverPreview ? (
                <img src={coverPreview} alt="Prévisualisation" className="mt-2 h-24 rounded-md object-cover" />
              ) : service.cover_image ? (
                <img src={`/storage/${service.cover_image}`} alt="Couverture actuelle" className="mt-2 h-24 rounded-md object-cover" />
              ) : null}
            </div>
            <div>
              <Label>Image 1</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e: any) => {
                  const f = e.target.files?.[0] ?? null;
                  setData('image_one', f);
                  setImageOnePreview(f ? URL.createObjectURL(f) : null);
                }}
              />
              {errors.image_one && <p className="text-destructive text-sm mt-1">{errors.image_one}</p>}
              {imageOnePreview ? (
                <img src={imageOnePreview} alt="Prévisualisation" className="mt-2 h-24 rounded-md object-cover" />
              ) : service.image_one ? (
                <img src={`/storage/${service.image_one}`} alt="Image 1 actuelle" className="mt-2 h-24 rounded-md object-cover" />
              ) : null}
            </div>
            <div>
              <Label>Image 2</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e: any) => {
                  const f = e.target.files?.[0] ?? null;
                  setData('image_two', f);
                  setImageTwoPreview(f ? URL.createObjectURL(f) : null);
                }}
              />
              {errors.image_two && <p className="text-destructive text-sm mt-1">{errors.image_two}</p>}
              {imageTwoPreview ? (
                <img src={imageTwoPreview} alt="Prévisualisation" className="mt-2 h-24 rounded-md object-cover" />
              ) : service.image_two ? (
                <img src={`/storage/${service.image_two}`} alt="Image 2 actuelle" className="mt-2 h-24 rounded-md object-cover" />
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>FAQs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row md:items-end md:gap-2 space-y-2 md:space-y-0"
              >
                {/* Question */}
                <div className="flex-1">
                  <Label>Question</Label>
                  <Input
                    value={faq.question}
                    onChange={(e) => {
                      const next = [...data.faqs];
                      next[idx].question = e.target.value;
                      setData("faqs", next);
                    }}
                  />
                </div>

                {/* Answer */}
                <div className="flex-1">
                  <Label>Réponse</Label>
                  <Input
                    value={faq.answer}
                    onChange={(e) => {
                      const next = [...data.faqs];
                      next[idx].answer = e.target.value;
                      setData("faqs", next);
                    }}
                  />
                </div>

                {/* Remove Button */}
                <Button
                  type="button"
                  variant="destructive"
                  className="mt-2 md:mt-0 h-10 w-10 flex items-center justify-center"
                  onClick={() => removeFaq(idx)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" onClick={addFaq}>Ajouter une FAQ</Button>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={processing}>Mettre à jour</Button>
        </div>
      </form>
    </AppLayout>
  );
}
