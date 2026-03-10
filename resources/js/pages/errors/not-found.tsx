import { Head, Link, usePage } from "@inertiajs/react";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/layouts/auth-layout";
import type { Auth } from "@/types/auth";

interface PageProps {
  auth: Auth;
  [key: string]: any;
}

export default function NotFound() {
  const { auth } = usePage<PageProps>().props;
  const isAuthenticated = !!auth?.user;

  return (
    <AuthLayout
      title="Page non trouvée"
      description="La page que vous recherchez n'existe pas ou a été déplacée."
    >
      <Head title="404 - Page non trouvée" />

      <div className="flex flex-col gap-6">
        <div className="grid gap-4 text-center">
          
          {/* 404 Code */}
          <div className="text-7xl font-bold tracking-tight text-primary">
            404
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">
              Oups… page introuvable
            </h2>
            <p className="text-sm text-muted-foreground">
              Vérifiez l’URL ou revenez à la page principale.
            </p>
          </div>

          {/* Primary Action */}
          <Button asChild className="w-full">
            <Link href={isAuthenticated ? route("dashboard") : "/"}>
              {isAuthenticated ? "Aller au tableau de bord" : "Retour à l’accueil"}
            </Link>
          </Button>

          {/* Secondary Action */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => window.history.back()}
          >
            Page précédente
          </Button>

        </div>
      </div>
    </AuthLayout>
  );
}