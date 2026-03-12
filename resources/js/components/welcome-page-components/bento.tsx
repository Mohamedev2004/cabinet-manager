"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowUpRight, Grid, PlayCircle, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Metric {
  label: string;
  value: string;
  caption: string;
}

interface ProcessStep {
  label: string;
  progress: number;
}

interface GalleryImage {
  src: string;
  alt: string;
}

interface ReelStat {
  label: string;
}

const keyMetrics: Metric[] = [
  {
    label: "Satisfaction client",
    value: "98%",
    caption: "Dernier trimestre",
  },
  {
    label: "Efficacité des accompagnements",
    value: "2.4x",
    caption: "Plus rapide",
  },
  {
    label: "Taux de fidélisation",
    value: "92%",
    caption: "Après 6 mois",
  },
];

const motionProcess: ProcessStep[] = [
  {
    label: "Analyse & compréhension",
    progress: 82,
  },
  {
    label: "Accompagnement personnalisé",
    progress: 64,
  },
  {
    label: "Suivi & résultats",
    progress: 91,
  },
];

const inspirationGallery: GalleryImage[] = [
  {
    src: "/assets/gallery-1.jpg",
    alt: "Références visuelles pour nos méthodes",
  },
  {
    src: "/assets/gallery-2.jpg",
    alt: "Espace de travail du cabinet",
  },
  {
    src: "/assets/gallery-3.jpg",
    alt: "Storyboard de nos étapes de conseil",
  },
  {
    src: "/assets/gallery-4.jpg",
    alt: "Equipe en action lors d’un accompagnement client",
  },
];

const reelStats: ReelStat[] = [
  { label: "3:42 min" },
  { label: "4.2K vues" },
  { label: "Méthodologie complète" },
];

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export function Bento() {
  return (
    <section className="relative w-full overflow-hidden bg-white rounded-xl p-8 lg:p-14 mt-4">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-foreground/[0.035] blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full bg-primary/[0.035] blur-[120px]" />
        <div className="absolute left-1/4 top-1/2 h-[400px] w-[400px] rounded-full bg-foreground/[0.02] blur-[150px]" />
      </div>

      <div className="relative">
        <motion.header
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col items-start gap-4 text-left"
        >
          <Badge >
            À propos
            <Grid className="ml-2 size-4" />
          </Badge>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Sagement Vôtre : un accompagnement expert pour avancer sereinement
          </h2>
          <p className="max-w-2xl text-base text-foreground/70 md:text-lg text-justify">
            Sagement Vôtre propose un accompagnement professionnel et personnalisé pour aider les particuliers et les organisations à structurer leurs projets et atteindre leurs objectifs avec confiance.
          </p>
        </motion.header>

        <motion.div
          className="mt-12 grid auto-rows-[minmax(200px,auto)] gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.6,
                ease: "easeOut",
                staggerChildren: 0.08,
                delayChildren: 0.12,
              },
            },
          }}
        >
          <motion.article
            variants={cardVariants}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="group relative col-span-1 flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border/40 bg-sidebar p-6 backdrop-blur transition-all hover:border-border/60 hover:shadow-lg sm:col-span-2 lg:row-span-2"
            role="article"
            aria-label="Featured case study"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-sidebar via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="space-y-4">
                <Badge 
                >
                  Étude de cas
                </Badge>
                <h3 className="text-2xl font-semibold leading-tight text-foreground md:text-3xl">
                  Optimisation de la stratégie d'entreprise pour nos clients
                </h3>
                <p className="text-sm text-foreground/70 md:text-base">
                  Nous accompagnons les entreprises et les particuliers dans l'analyse de leurs besoins, la planification stratégique et la mise en œuvre de solutions concrètes et efficaces.
                </p>
              </div>
              <div className="mt-8 flex items-center justify-between gap-4">
                <Button
                  aria-label="View the featured case study"
                >
                  Voir l'étude
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover/cta:translate-x-1" />
                </Button>
              </div>
            </div>
          </motion.article>

          <motion.article
            variants={cardVariants}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="group col-span-1 flex h-full flex-col rounded-2xl border border-border/40 bg-sidebar p-6 backdrop-blur transition-all hover:border-border/60 hover:shadow-lg sm:col-span-2"
            role="article"
            aria-label="Key performance metrics"
          >
            <div className="flex items-center justify-between">
              <Badge >
                Performance
              </Badge>
              <motion.div
                animate={{ rotate: [0, -6, 0, 6, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 10,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
              </motion.div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {keyMetrics.map((metric) => (
                <div key={metric.label} className="">
                  <p className="text-xs uppercase tracking-[0.18em] text-foreground/60">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                    {metric.value}
                  </p>
                  <p className="mt-1 inline-flex items-center gap-2 px-2 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {metric.caption}
                  </p>
                </div>
              ))}
            </div>
          </motion.article>

          <motion.article
            variants={cardVariants}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="group relative col-span-1 overflow-hidden rounded-2xl border border-border/40 bg-background/70 backdrop-blur hover:border-border/60 hover:shadow-lg sm:col-span-2 lg:row-span-3"
            role="article"
            aria-label="Behind the scenes studio imagery"
          >
            <div className="absolute inset-0">
              <img
                src="/assets/bento-1.jpg"
                alt="Designer workstation lit with cinematic lighting"
                className="h-full w-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
              <motion.div
                className="absolute inset-0 bg-black/60 dark:bg-neutral-900"
                initial={{ y: 0 }}
                whileInView={{ y: "100%" }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </div>
            <div className="relative flex h-full flex-col justify-end space-y-4 p-6 md:p-8">
              <Badge  className="bg-white text-black">
                Inspiration
              </Badge>
              <h3 className="text-xl font-semibold text-white tracking-tight md:text-2xl">
                Une approche humaine et stratégique
              </h3>
              <p className="max-w-sm text-sm text-white md:text-base">
                Notre cabinet allie expertise, écoute et réflexion stratégique pour proposer un accompagnement adapté aux besoins spécifiques de chaque client.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {["Analyse", "Stratégie", "Accompagnement"].map(
                  (tag) => (
                    <Badge className="bg-white text-black"
                      key={tag}
                    >
                      {tag}
                    </Badge>
                  )
                )}
              </div>
            </div>
          </motion.article>

          <motion.article
            variants={cardVariants}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="group col-span-1 flex h-full flex-col rounded-2xl border border-border/40 bg-sidebar p-6 backdrop-blur transition-all hover:border-border/60 hover:shadow-lg sm:col-span-2 lg:row-span-2"
            role="article"
            aria-label="Motion sprint process overview"
          >
            <div className="space-y-4">
              <Badge >
                Méthodologie
              </Badge>
              <h3 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                Un accompagnement structuré pour chaque projet
              </h3>
              <p className="text-sm text-foreground/70 md:text-base">
                Nous combinons analyse, planification et suivi pour offrir à chaque client une stratégie adaptée et un accompagnement complet tout au long du projet.
              </p>
            </div>
            <div className="mt-6 space-y-4">
              {motionProcess.map((step, index) => (
                <div key={step.label} className="space-y-2">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-foreground/60">
                    <span>{step.label}</span>
                    <span aria-label={`${step.progress}% complete`}>
                      {step.progress}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-foreground/10">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${step.progress}%` }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.8,
                        ease: "easeOut",
                        delay: index * 0.1,
                      }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.article>

          <motion.article
            variants={cardVariants}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="group col-span-1 flex h-full flex-col overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-primary/15 via-background/70 to-background/90 p-0 backdrop-blur transition-all hover:border-border/60 hover:shadow-lg sm:col-span-2"
            role="article"
            aria-label="Motion showcase video"
          >
            <div className="relative h-full">
              <img
                src="/assets/bento-2.jpg"
                alt="Motion design workspace with monitors"
                className="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity duration-500"
              />
              <motion.div
                className="absolute inset-0 bg-black/60 dark:bg-neutral-950"
                initial={{ y: 0 }}
                whileInView={{ y: "100%" }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
              <div className="relative flex h-full flex-col justify-between bg-gradient-to-br from-black/80 via-black/60 to-transparent p-6 md:p-8">                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-white text-black">
                      Témoignage
                    </Badge>
                  </div>
                  <h3 className="text-xl text-white font-semibold tracking-tight text-foreground md:text-2xl">
                    Découvrez l'accompagnement d'un de nos clients
                  </h3>
                  <p className="max-w-md text-sm text-white text-foreground/70 md:text-base">
                    Une présentation détaillée des étapes et méthodes utilisées par notre cabinet pour guider nos clients vers le succès et les aider à atteindre leurs objectifs stratégiques.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 text-xs text-foreground/60">
                  <div className="flex flex-wrap gap-2">
                    {reelStats.map((stat) => (
                      <Badge
                        className="bg-white text-black" 
                        key={stat.label}
                      >
                        {stat.label}
                      </Badge>
                    ))}
                  </div>
                  <Button size="sm" className="gap-2">
                    Voir la vidéo
                    <PlayCircle className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.article>

          <motion.article
            variants={cardVariants}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="group col-span-1 flex h-full flex-col rounded-2xl border border-border/40 bg-sidebar p-6 backdrop-blur transition-all hover:border-border/60 hover:shadow-lg sm:col-span-2"
            role="article"
            aria-label="Visual research gallery"
          >
            <div className="space-y-3">
              <Badge >
                Galerie
              </Badge>
              <h3 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
                Nos méthodes et inspirations en images
              </h3>
              <p className="text-sm text-foreground/70 md:text-base">
                A snapshot of the references that steer our motion language and
                narrative rhythm, curated for both product and marketing
                surfaces.
              </p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {inspirationGallery.map((image) => (
                <div
                  key={image.src}
                  className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border/30 bg-background/60"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <motion.div
                    className="absolute inset-0 bg-white dark:bg-neutral-950"
                    initial={{ y: 0 }}
                    whileInView={{ y: "100%" }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                </div>
              ))}
            </div>
          </motion.article>
        </motion.div>
      </div>
    </section>
  );
}
