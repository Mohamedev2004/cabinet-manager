import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="">
      <div className="p-4 lg:p-14 bg-white rounded-xl">
        <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
          
          <div className="flex flex-col items-center gap-5 text-center lg:items-start lg:text-left">
            
            <Badge variant="outline">
              Your Website Builder
              <ArrowUpRight className="ml-2 size-4" />
            </Badge>

            <h1 className="text-4xl font-bold text-pretty lg:text-6xl">
              Blocks Built With Shadcn & Tailwind
            </h1>

            <p className="max-w-xl text-muted-foreground lg:text-xl">
              Finely crafted components built with React, Tailwind and Shadcn UI.
              Developers can copy and paste these blocks directly into their project.
            </p>

            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              
              <Button asChild className="w-full sm:w-auto">
                <a href="https://www.shadcnblocks.com">
                  Discover all components
                </a>
              </Button>

              <Button asChild variant="outline" className="w-full sm:w-auto">
                <a href="https://www.shadcnblocks.com">
                  View on GitHub
                  <ArrowRight className="size-4" />
                </a>
              </Button>

            </div>
          </div>

          <motion.div
            className="aspect-video w-full overflow-hidden rounded-md relative"
          >
            <img
              src="/assets/hero-image.svg"
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
