/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import ImageCropper from '@/components/image-cropper';

type Faq = { question: string; answer: string };

export default function CreateService() {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Outils Crm', href: '#' },
    { title: 'Services', href: '/admin/services' },
    { title: 'Créer', href: '#' },
  ];
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    description: '',
    price: '',
    duration: '',
    is_active: true as boolean,
    is_price_visible: true as boolean,
    cover_image: null as File | null,
    image_one: null as File | null,
    image_two: null as File | null,
    faqs: [] as Faq[],
  });

  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [imageOnePreview, setImageOnePreview] = useState<string | null>(null);
  const [imageTwoPreview, setImageTwoPreview] = useState<string | null>(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [cropTarget, setCropTarget] = useState<'cover_image' | 'image_one' | 'image_two' | null>(null);
  const [cropAspect, setCropAspect] = useState<number>(1);
  const COVER_ASPECT = 1280 / 280;
  const OTHER_ASPECT = 1;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('services.store'), {
      forceFormData: true,
      onSuccess: () => router.visit(route('services.index')),
    });
  };

  const addFaq = () => setData('faqs', [...data.faqs, { question: '', answer: '' }]);
  const removeFaq = (index: number) => setData('faqs', data.faqs.filter((_, i) => i !== index));

  const openCropper = (file: File, target: 'cover_image' | 'image_one' | 'image_two') => {
    setCropFile(file);
    setCropTarget(target);
    setCropAspect(target === 'cover_image' ? COVER_ASPECT : OTHER_ASPECT);
    setCropperOpen(true);
  };

  const handleCropComplete = (file: File) => {
    if (!cropTarget) return;
    if (cropTarget === 'cover_image') {
      setData('cover_image', file);
      setCoverPreview(URL.createObjectURL(file));
    } else if (cropTarget === 'image_one') {
      setData('image_one', file);
      setImageOnePreview(URL.createObjectURL(file));
    } else if (cropTarget === 'image_two') {
      setData('image_two', file);
      setImageTwoPreview(URL.createObjectURL(file));
    }
    setCropperOpen(false);
    setCropFile(null);
    setCropTarget(null);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Créer un service" />
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
              <Input id="price" type="number" value={data.price} onChange={(e) => setData('price', e.target.value)} />
              {errors.price && <p className="text-destructive text-sm mt-1">{errors.price}</p>}
            </div>
            <div>
              <Label htmlFor="duration">Durée (minutes)</Label>
              <Input id="duration" type="number" value={data.duration} onChange={(e) => setData('duration', e.target.value)} />
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
              <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
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
                  if (f) {
                    openCropper(f, 'cover_image');
                  }
                }}
              />
              {errors.cover_image && <p className="text-destructive text-sm mt-1">{errors.cover_image}</p>}
              {coverPreview && <img src={coverPreview} alt="Prévisualisation" className="mt-2 h-24 rounded-md object-cover" />}
            </div>
            <div>
              <Label>Image 1</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e: any) => {
                  const f = e.target.files?.[0] ?? null;
                  if (f) {
                    openCropper(f, 'image_one');
                  }
                }}
              />
              {errors.image_one && <p className="text-destructive text-sm mt-1">{errors.image_one}</p>}
              {imageOnePreview && <img src={imageOnePreview} alt="Prévisualisation" className="mt-2 h-24 rounded-md object-cover" />}
            </div>
            <div>
              <Label>Image 2</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e: any) => {
                  const f = e.target.files?.[0] ?? null;
                  if (f) {
                    openCropper(f, 'image_two');
                  }
                }}
              />
              {errors.image_two && <p className="text-destructive text-sm mt-1">{errors.image_two}</p>}
              {imageTwoPreview && <img src={imageTwoPreview} alt="Prévisualisation" className="mt-2 h-24 rounded-md object-cover" />}
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

            {/* Add FAQ Button */}
            <Button type="button" onClick={addFaq}>
              Ajouter une FAQ
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={processing}>Créer</Button>
        </div>
        {cropFile && (
          <ImageCropper
            isOpen={cropperOpen}
            onClose={() => setCropperOpen(false)}
            onCropComplete={handleCropComplete}
            imageFile={cropFile}
            aspectRatio={cropAspect}
          />
        )}
      </form>
    </AppLayout>
  );
}
