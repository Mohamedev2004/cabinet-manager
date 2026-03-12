import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="">
      <div className="p-4 lg:p-14 bg-white rounded-xl">
        <div className="grid items-start gap-6 lg:grid-cols-2 lg:gap-12">
          
          <div className="flex flex-col items-start gap-5 text-left lg:items-start lg:text-left">
            
            <Badge>
              Un accompagnement éclairé
              <ArrowUpRight className="ml-2 size-4" />
            </Badge>

            <h1 className="text-4xl font-bold text-pretty lg:text-5xl">
              Des conseils experts pour vos décisions personnelles et professionnelles.
            </h1>

            <p className="max-w-xl text-muted-foreground lg:text-xl">
              Sagement Vôtre vous accompagne avec des solutions adaptées et un suivi personnalisé 
              pour vous aider à prendre les meilleures décisions. Notre approche combine expertise, 
              écoute et outils modernes pour vous guider vers des résultats concrets.
            </p>

            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              
              <Button asChild className="w-full sm:w-auto">
                <a href="https://www.shadcnblocks.com">
                  Prendre un rendez-vous
                </a>
              </Button>

              <Button asChild variant="outline" className="w-full sm:w-auto">
                <a href="https://www.shadcnblocks.com">
                  Découvrir nos services
                  <ArrowRight className="size-4" />
                </a>
              </Button>

            </div>
          </div>

          <motion.div
            className="h-auto w-full overflow-hidden rounded-md relative"
          >
            <img
              src="/assets/hero-img.jpg"
              alt="Hero section demo image"
              className="h-full w-full object-cover"
            />
            <motion.div
              className="absolute inset-0 bg-white dark:bg-neutral-950"
              initial={{ y: 0 }}
              whileInView={{ y: "100%" }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
