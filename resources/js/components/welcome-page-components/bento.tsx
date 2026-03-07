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
    label: "Project satisfaction",
    value: "98%",
    caption: "Last quarter",
  },
  {
    label: "Delivery cadence",
    value: "2.4x",
    caption: "Faster",
  },
  {
    label: "Retention rate",
    value: "92%",
    caption: "After 6 months",
  },
];

const motionProcess: ProcessStep[] = [
  {
    label: "Ideate & storyboard",
    progress: 82,
  },
  {
    label: "Motion exploration",
    progress: 64,
  },
  {
    label: "Polish & delivery",
    progress: 91,
  },
];

const inspirationGallery: GalleryImage[] = [
  {
    src: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=400&h=320&fit=crop&q=80",
    alt: "Collage of lighting references for motion design",
  },
  {
    src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=320&fit=crop&q=80",
    alt: "Creative workspace with monitors and sketchbook",
  },
  {
    src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=320&fit=crop&q=80",
    alt: "Colorful motion design storyboard pinned to a wall",
  },
  {
    src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=320&fit=crop&q=80",
    alt: "Designer adjusting camera lighting in a studio",
  },
];

const reelStats: ReelStat[] = [
  { label: "3:42 min" },
  { label: "4.2K views" },
  { label: "Dynamic timing curves" },
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
          className="flex flex-col items-start gap-4 text-center"
        >
          <Badge>
            About Us
            <Grid className="ml-2 size-4" />
          </Badge>
          <h2 className="text-3xl font-semibold tracking-tight text-left text-foreground md:text-4xl lg:text-5xl">
            Bento storytelling built for modern motion systems
          </h2>
          <p className="max-w-2xl text-base text-foreground/70 md:text-lg text-justify">
            Pair narrative, metrics, and cinematic visuals inside a responsive
            layout designed around Framer Motion micro-interactions and
            accessible navigation.
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
                  Featured case study
                </Badge>
                <h3 className="text-2xl font-semibold leading-tight text-foreground md:text-3xl">
                  Designing delightful product experiences
                </h3>
                <p className="text-sm text-foreground/70 md:text-base">
                  We choreograph micro-interactions and depth cues that elevate
                  usability across every product surface-without sacrificing
                  performance or accessibility.
                </p>
              </div>
              <div className="mt-8 flex items-center justify-between gap-4">
                <Button
                  aria-label="View the featured case study"
                >
                  View story
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
              <Badge>
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
            <motion.div
              className="absolute inset-0"
              initial={{ clipPath: "inset(0 0 100% 0)" }}
              whileInView={{ clipPath: "inset(0 0 0% 0)" }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
                alt="Designer workstation lit with cinematic lighting"
                className="h-full w-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            </motion.div>
            <div className="relative flex h-full flex-col justify-end space-y-4 p-6 md:p-8">
              <Badge>
                Behind the scenes
              </Badge>
              <h3 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                Immersive motion prototypes with cinematic lighting
              </h3>
              <p className="max-w-sm text-sm text-foreground/70 md:text-base">
                Layered light, shadow, and depth cues help teams experience the
                product as it will ship-well before the first line of production
                code.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {["Micro-interactions", "Depth cues", "Narrative flow"].map(
                  (tag) => (
                    <Badge
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
              <Badge>
                Motion sprint
              </Badge>
              <h3 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                From first sketch to polished prototype in seven days
              </h3>
              <p className="text-sm text-foreground/70 md:text-base">
                We compress discovery, exploration, and refinement into a
                focused week-long sprint so your team can feel the flow of the
                final experience sooner.
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
              <motion.div
                className="absolute inset-0"
                initial={{ clipPath: "inset(0 0 100% 0)" }}
                whileInView={{ clipPath: "inset(0 0 0% 0)" }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                <img
                  src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=600&fit=crop&q=80"
                  alt="Motion design workspace with monitors"
                  className="absolute inset-0 h-full w-full object-cover opacity-30 transition-opacity duration-500 group-hover:opacity-40"
                />
              </motion.div>
              <div className="relative flex h-full flex-col justify-between bg-gradient-to-br from-background/90 via-background/70 to-transparent p-6 md:p-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge>
                      Motion showcase
                    </Badge>
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                    Watch our latest animation breakdown
                  </h3>
                  <p className="max-w-md text-sm text-foreground/70 md:text-base">
                    A three-minute deep dive into timing curves, coordinated
                    transitions, and how we translate component choreography
                    into production-ready systems.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 text-xs text-foreground/60">
                  <div className="flex flex-wrap gap-2">
                    {reelStats.map((stat) => (
                      <Badge
                        key={stat.label}
                      >
                        {stat.label}
                      </Badge>
                    ))}
                  </div>
                  <Button size="sm" className="gap-2">
                    Watch now
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
              <Badge>
                Visual research
              </Badge>
              <h3 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
                Capturing texture, light, and pace for new explorations
              </h3>
              <p className="text-sm text-foreground/70 md:text-base">
                A snapshot of the references that steer our motion language and
                narrative rhythm, curated for both product and marketing
                surfaces.
              </p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {inspirationGallery.map((image) => (
                <motion.div
                  key={image.src}
                  className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border/30 bg-background/60"
                  initial={{ clipPath: "inset(0 0 100% 0)" }}
                  whileInView={{ clipPath: "inset(0 0 0% 0)" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </motion.div>
              ))}
            </div>
          </motion.article>
        </motion.div>
      </div>
    </section>
  );
}
