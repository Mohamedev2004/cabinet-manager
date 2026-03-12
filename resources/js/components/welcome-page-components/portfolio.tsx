"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const galleryImages = [
  { id: 1, url: "/assets/portfolio-1.jpg", title: "Consultation stratégique", category: "Client" },
  { id: 2, url: "/assets/portfolio-2.jpg", title: "Atelier collaboratif", category: "Client" },
  { id: 3, url: "/assets/portfolio-3.jpg", title: "Analyse de marché", category: "Client" },
  { id: 4, url: "/assets/portfolio-4.jpg", title: "Accompagnement projet", category: "Client" },
  { id: 5, url: "/assets/portfolio-5.jpg", title: "Réunion client", category: "Client" },
  { id: 6, url: "/assets/portfolio-6.jpg", title: "Stratégie digitale", category: "Client" },
  { id: 7, url: "/assets/portfolio-7.jpg", title: "Formation équipe", category: "Client" },
  { id: 8, url: "/assets/portfolio-8.jpg", title: "Suivi de projet", category: "Client" },
];

export function Portfolio() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const selectedImageData = galleryImages.find((img) => img.id === selectedImage);

  const handleNext = () => {
    if (selectedImage !== null) {
      const currentIndex = galleryImages.findIndex((img) => img.id === selectedImage);
      const nextIndex = (currentIndex + 1) % galleryImages.length;
      setSelectedImage(galleryImages[nextIndex].id);
    }
  };

  const handlePrev = () => {
    if (selectedImage !== null) {
      const currentIndex = galleryImages.findIndex((img) => img.id === selectedImage);
      const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
      setSelectedImage(galleryImages[prevIndex].id);
    }
  };

  return (
    <section className="w-full bg-white mt-4 p-8 lg:p-14 rounded-xl" aria-labelledby="gallery-heading">
      <div className="mx-auto">
        <motion.header
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-12 text-left"
        >
          <Badge className="mb-4">Portfolio</Badge>
          <h2 id="gallery-heading" className="mb-3 text-3xl font-semibold md:text-4xl lg:text-5xl">
            Notre Cabinet en Action
          </h2>
          <p className="mb-8 text-justify md:text-base lg:text-lg">
            Découvrez notre travail avec nos clients à travers ces moments clés d’accompagnement et de conseil stratégique.
          </p>
        </motion.header>

        {/* Gallery Grid */}
        <motion.div
          layout
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.08, delayChildren: 0.12 } },
          }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {galleryImages.map((image) => (
              <motion.article
                key={image.id}
                layout
                variants={cardVariants}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Card
                  className="group relative cursor-pointer overflow-hidden border border-border transition-all hover:border-primary hover:shadow-xl p-0"
                  onClick={() => setSelectedImage(image.id)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Voir ${image.title}`}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <motion.img
                      src={image.url}
                      alt={image.title}
                      className="h-full w-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
                      aria-hidden="true"
                    >
                      <ZoomIn className="mb-2 h-8 w-8 text-white/80" />
                      <h3 className="mb-1 text-center text-lg font-semibold text-white">{image.title}</h3>
                      <Badge variant="secondary" className="text-black">{image.category}</Badge>
                    </motion.div>
                  </div>
                </Card>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage !== null && selectedImageData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
              onClick={() => setSelectedImage(null)}
              role="dialog"
              aria-modal="true"
              aria-labelledby="gallery-dialog-title"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-h-[90vh] max-w-5xl"
              >
                {/* Close Button */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute -right-12 top-0 text-white/80 hover:bg-white/10"
                  onClick={() => setSelectedImage(null)}
                  aria-label="Fermer"
                >
                  <X className="h-6 w-6" />
                </Button>

                {/* Navigation Buttons */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:bg-white/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  aria-label="Image précédente"
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:bg-white/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  aria-label="Image suivante"
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>

                {/* Image */}
                <motion.img
                  key={selectedImage}
                  src={selectedImageData.url}
                  alt={selectedImageData.title}
                  className="max-h-[80vh] w-auto rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />

                {/* Image Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mt-4 text-center text-white/80"
                >
                  <h3 className="mb-2 text-xl font-semibold" id="gallery-dialog-title">
                    {selectedImageData.title}
                  </h3>
                  <Badge variant="secondary" className="text-black">{selectedImageData.category}</Badge>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}