import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="">
      <div className="container">
        <div className="grid items-stretch gap-4 lg:grid-cols-2">

          {/* Left Content */}
          <div className="bg-white p-8 lg:p-14 rounded-xl flex flex-col justify-center gap-5 text-left lg:items-start lg:text-left shadow-sm h-full">

            <Badge>
              Cabinet de conseil
              <ArrowUpRight className="ml-2 size-4" />
            </Badge>

            <h1 className="text-4xl font-bold lg:text-6xl">
              Sagement Vôtre
            </h1>

            <p className="max-w-xl text-muted-foreground lg:text-xl text-justify">
              Nous accompagnons les organisations et les individus avec des
              solutions stratégiques, des formations et un accompagnement
              personnalisé pour développer leur potentiel et atteindre
              leurs objectifs avec sagesse et efficacité.
            </p>

            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">

              <Button asChild className="w-full sm:w-auto">
                <a href="#">
                  Découvrir nos services
                </a>
              </Button>

              <Button asChild variant="outline" className="w-full sm:w-auto">
                <a href="#">
                  Prendre rendez-vous
                  <ArrowRight className="size-4 ml-2" />
                </a>
              </Button>

            </div>
          </div>

          {/* Right Image */}
          <img
            src="/assets/hero-image.webp"
            alt="Sagement Votre consulting"
            className="w-full h-full rounded-md object-cover"
          />

        </div>
      </div>
    </section>
  );
};

export default Hero;