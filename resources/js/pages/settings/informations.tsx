/* eslint-disable @typescript-eslint/no-explicit-any */
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Heading from '@/components/heading';
import ImageCropper from '@/components/image-cropper';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import type { BreadcrumbItem } from '@/types';
import { Upload } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Information settings',
    href: '#',
  },
];

export default function Informations({ settings }: { settings: any }) {
  const [logoPreview, setLogoPreview] = useState<string | null>(
    settings?.logo ? `/storage/${settings.logo}` : null
  );
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Inertia form
  const form = useForm({
    name: settings?.name || '',
    address: settings?.address || '',
    phone: settings?.phone || '',
    email: settings?.email || '',
    website: settings?.website || '',
    ice: settings?.ice || '',
    logo: null as File | null,
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setIsCropperOpen(true);
    }
  };

  const handleCropComplete = (croppedFile: File) => {
    setLogoPreview(URL.createObjectURL(croppedFile));
    form.setData('logo', croppedFile);
    setIsCropperOpen(false);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    form.post('/settings/informations/update', {
      forceFormData: true,
      preserveScroll: true,
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Information settings" />
      <h1 className="sr-only">Information Settings</h1>

      <SettingsLayout>
        <div className="space-y-6">
          <Heading
            variant="small"
            title="Update your information"
            description="Manage your company's basic information, logo, and contact details"
          />

          <form onSubmit={submit} className="space-y-6">
            {/* Grid wrapper for 2-column layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Company Name */}
              <div>
                <Label htmlFor="name">Company Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={form.data.name}
                  onChange={(e) => form.setData('name', e.target.value)}
                  className="mt-1 block w-full"
                />
                <InputError message={form.errors.name} />
              </div>


              {/* Logo */}
              <div className='flex items-center justify-center'>
                <div className="group w-20 relative mt-2 border-2 border-dashed border-gray-300 hover:border-black rounded-xl p-1 transition-colors text-center cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <Input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    onChange={handleLogoChange}
                    accept="image/*"
                    />

                    {logoPreview ? (
                    <div className="relative h-auto w-full rounded-lg overflow-hidden">
                        <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-full h-full object-cover"
                        />
                    </div>
                    ) : (
                    <div className="h-20 flex flex-col items-center justify-center text-gray-400">
                        {/* Replace with your Upload icon component if you have one */}
                        <span className="text-2xl mb-2"><Upload /></span>
                        <span className="text-xs">Upload Logo</span>
                    </div>
                    )}
                </div>
                <InputError message={form.errors.logo} />
              </div>

              {/* Address */}
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={form.data.address}
                  onChange={(e) => form.setData('address', e.target.value)}
                  className="mt-1 block w-full"
                />
                <InputError message={form.errors.address} />
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={form.data.phone}
                  onChange={(e) => form.setData('phone', e.target.value)}
                  className="mt-1 block w-full"
                />
                <InputError message={form.errors.phone} />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.data.email}
                  onChange={(e) => form.setData('email', e.target.value)}
                  className="mt-1 block w-full"
                />
                <InputError message={form.errors.email} />
              </div>

              {/* Website */}
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  value={form.data.website}
                  onChange={(e) => form.setData('website', e.target.value)}
                  className="mt-1 block w-full"
                />
                <InputError message={form.errors.website} />
              </div>

              {/* ICE full width */}
              <div className="md:col-span-2">
                <Label htmlFor="ice">ICE</Label>
                <Input
                  id="ice"
                  name="ice"
                  value={form.data.ice}
                  onChange={(e) => form.setData('ice', e.target.value)}
                  className="mt-1 block w-full"
                />
                <InputError message={form.errors.ice} />
              </div>
            </div>

            {/* Submit button */}
            <div className="flex items-center gap-4 mt-4">
              <Button disabled={form.processing}>Save changes</Button>
              <Transition
                show={form.recentlySuccessful}
                enter="transition ease-in-out"
                enterFrom="opacity-0"
                leave="transition ease-in-out"
                leaveTo="opacity-0"
              >
                <p className="text-sm text-neutral-600">Saved</p>
              </Transition>
            </div>

            {/* Image Cropper */}
            {selectedFile && (
              <ImageCropper
                isOpen={isCropperOpen}
                onClose={() => setIsCropperOpen(false)}
                onCropComplete={handleCropComplete}
                imageFile={selectedFile}
                aspectRatio={1}
              />
            )}
          </form>
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}