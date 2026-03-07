"use client";

import { Link } from "@inertiajs/react";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight, ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SyncedLyricCaptions } from "@/components/video"

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function Content() {
  return (
    <section className="mt-4">
      <div className="mx-auto bg-white p-8 lg:p-14 rounded-xl">
        
        <Badge className="mb-6">
          Content
          <ArrowUpRight className="ml-2 size-4" />
        </Badge>

        {/* Replaced Image with Caption Player */}
        <motion.div
          className="mb-8 overflow-hidden"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          whileInView={{ clipPath: "inset(0 0 0% 0)" }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <SyncedLyricCaptions
            title="Platform Overview"
            videoSrc="https://www.w3schools.com/html/mov_bbb.mp4"
            poster="https://images.unsplash.com/photo-1530099486328-e021101a494a?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3"
            script={[
              {
                time: 1,
                text: "Welcome to our intelligent platform.",
                speaker: "System",
              },
              {
                time: 5,
                text: "We help businesses build scalable digital products.",
                speaker: "System",
              },
              {
                time: 9,
                text: "From design to development and deployment.",
                speaker: "System",
              },
              {
                time: 13,
                text: "Everything is crafted with modern technologies.",
                speaker: "System",
              },
              {
                time: 17,
                text: "Fast, reliable and beautifully designed.",
                speaker: "System",
              },
            ]}
          />
        </motion.div>

        <motion.div
          className="grid gap-6 md:grid-cols-2 md:gap-12"
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
          <motion.h2
            variants={cardVariants}
            className="mb-3 text-3xl font-semibold text-pretty md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl"
          >
            The Lyra ecosystem brings together our models.
          </motion.h2>

          <motion.div
            variants={cardVariants}
            className="mb-8 text-justify text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg"
          >
            <p>
              Lyra is evolving to be more than just the models. It supports an
              entire ecosystem — from products to the APIs and platforms helping
              developers and businesses innovate.
            </p>

            <motion.div variants={cardVariants} className="mt-6">
              <Button asChild size="sm" className="gap-1 pr-1.5">
                <Link href="#">
                  <span>Learn More</span>
                  <ChevronRight className="size-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
