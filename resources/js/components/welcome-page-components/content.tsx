"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { SyncedLyricCaptions } from "@/components/video";

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

        {/* Two-column layout */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Left column: Video */}
          <motion.div
            className="lg:col-span-7 w-full"
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
            }}
          >
            <SyncedLyricCaptions
              title="Sage‑femme en action"
              videoSrc="https://player.vimeo.com/progressive_redirect/playback/717731063/rendition/240p/file.mp4"
              poster="/assets/video-cover.jpg"
            />
          </motion.div>

          {/* Right column: Text content */}
          <motion.div
            className="lg:col-span-5 flex flex-col justify-between w-full h-full"
            variants={{
              hidden: { opacity: 0, x: 50 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
            }}
          >
            <div className="flex flex-col gap-6 h-full justify-between">
              <div>
                <motion.h2
                  variants={cardVariants}
                  className="mb-2 text-3xl font-semibold text-pretty md:text-4xl lg:text-5xl"
                >
                  The Lyra ecosystem brings together our models.
                </motion.h2>

                <motion.p
                  variants={cardVariants}
                  className="text-justify text-muted-foreground md:text-base lg:text-lg"
                >
                  Lyra is evolving to be more than just the models. It supports an
                  entire ecosystem — from products to the APIs and platforms helping
                  developers and businesses innovate.
                </motion.p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}