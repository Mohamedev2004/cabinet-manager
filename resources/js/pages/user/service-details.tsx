"use client";

import { Head, usePage, router } from "@inertiajs/react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout  from '@/layouts/app-layout';
import type { BreadcrumbItem } from "@/types";

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
  const breadcrumbs: BreadcrumbItem[] = [
      { title: 'Outils Crm', href: '#' },
      { title: 'Services', href: '/admin/services' },
      { title: service.name, href: '#' },
    ];

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const cover = service.cover_image
    ? `/storage/${service.cover_image}`
    : null;

  const gallery = [
    service.image_one
      ? { src: `/storage/${service.image_one}`, alt: "Service image 1" }
      : null,
    service.image_two
      ? { src: `/storage/${service.image_two}`, alt: "Service image 2" }
      : null,
  ].filter(Boolean) as { src: string; alt: string }[];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
    <section className="w-full">
      <Head title={`Service: ${service.name}`} />

      <div className="px-6 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">{service.name}</h1>
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => router.visit(route("services.index"))}>Retour</Button>
            <Button onClick={() => router.visit(route("services.edit", service.id))}>Modifier</Button>
          </div>
        </div>

        {/* HERO */}
        {cover && (
          <img
            loading='lazy'
            src={cover}
            alt={service.name}
            className="w-full h-auto object-cover rounded-md"
          />
        )}

        {/* CONTENT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* MAIN ARTICLE */}
          <Card className="md:col-span-2 bg-sidebar">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                {service.description ?? "No description available."}
              </p>

              {/* FAQ TOGGLES */}
              {service.faqs && service.faqs.length > 0 && (
                <div className="space-y-3 mt-4">
                  <CardTitle className="mb-8">Questions - Reponses</CardTitle>
                  {service.faqs.map((faq, index) => {
                    const isOpen = openFaq === index;
                    return (
                      <div
                        key={index}
                        className="overflow-hidden rounded-lg border"
                      >
                        <button
                          onClick={() => setOpenFaq(prev => prev === index ? null : index)}
                          className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/40"
                        >
                          <span className="font-medium">{faq.question}</span>
                          <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 text-sm text-muted-foreground">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* SIDEBAR */}
          <div className="space-y-6">
            <Card className="bg-sidebar">
              <CardHeader>
                <CardTitle className="text-base">Service details</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between">
                    <span>Price</span>
                    <span className="font-medium">
                      {service.is_price_visible ? (service.price ?? "—") : "Hidden"}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Duration</span>
                    <span className="font-medium">
                      {service.duration ? `${service.duration} min` : "—"}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Status</span>
                    <span className={`font-medium ${service.is_active ? "text-green-600" : "text-red-500"}`}>
                      {service.is_active ? "Active" : "Inactive"}
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* MINI GALLERY */}
            {gallery.length > 0 && (
              <div className="space-y-4">
                {gallery.map((img) => (
                  <Card key={img.src} className="overflow-hidden p-0">
                    <CardContent className="p-0">
                      <img
                        loading='lazy'
                        src={img.src}
                        alt={img.alt}
                        className="h-full w-full object-cover"
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
    </AppLayout>
  );
}
