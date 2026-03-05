/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Head, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { dashboard } from "@/routes";

import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar, CheckCircle, DollarSign } from "lucide-react";

import type { BreadcrumbItem } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Application",
    href: "#",
  },
  {
    title: "Analytiques",
    href: dashboard().url,
  },
];

export default function Dashboard() {
  const { stats } = usePage().props as any;

  const cards = [
    {
      title: "Total Patients",
      value: stats?.patients?.value,
      change: stats?.patients?.change,
      icon: Users,
    },
    {
      title: "Rendez-vous",
      value: stats?.appointments?.value,
      change: stats?.appointments?.change,
      icon: Calendar,
    },
    {
      title: "Tâches Actives",
      value: stats?.tasks?.value,
      change: stats?.tasks?.change,
      icon: CheckCircle,
    },
    {
      title: "Revenue",
      value: stats?.revenue?.value ? `${stats.revenue.value} Dhs` : "0 Dhs",
      change: stats?.revenue?.change,
      icon: DollarSign,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Analytiques" />

      <div className="flex flex-col gap-6 p-4">
        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, index) => {
            const Icon = card.icon;

            const isPositive = card.change >= 0;

            return (
              <Card
                key={index}
                className="relative overflow-hidden border border-sidebar-border/70 bg-gradient-to-t from-sidebar to-white dark:to-black"
              >
                <CardContent className="flex flex-col gap-3">
                  {/* Header */}
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-sm font-medium">{card.title}</span>
                    <Icon className="h-5 w-5 opacity-70" />
                  </div>

                  {/* Comparison */}
                  {card.change !== undefined && (
                    <div className="text-xs">
                      <span
                        className={`font-medium ${
                          isPositive ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {isPositive ? "+" : ""}
                        {card.change}%
                      </span>{" "}
                      <span className="text-muted-foreground">
                        du mois précédent
                      </span>
                    </div>
                  )}

                  {/* Value */}
                  {card.value !== undefined && card.value !== null ? (
                    <div className="text-3xl font-bold tracking-tight mt-3">
                      {card.value}
                    </div>
                  ) : (
                    <div className="h-8 w-24 animate-pulse rounded bg-muted" />
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}