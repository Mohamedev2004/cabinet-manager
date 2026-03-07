"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Grid, X, ZoomIn } from "lucide-react";
import type { KeyboardEvent} from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const galleryImages = [
  {
    id: 1,
    url: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-1.svg",
    title: "Abstract Architecture",
    category: "Architecture",
  },
  {
    id: 2,
    url: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-1.svg",
    title: "Modern Design",
    category: "Design",
  },
  {
    id: 3,
    url: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-1.svg",
    title: "Urban Landscape",
    category: "Nature",
  },
  {
    id: 4,
    url: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-1.svg",
    title: "Digital Art",
    category: "Art",
  },
  {
    id: 5,
    url: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-1.svg",
    title: "Creative Space",
    category: "Architecture",
  },
  {
    id: 6,
    url: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-1.svg",
    title: "Minimalist View",
    category: "Design",
  },
  {
    id: 7,
    url: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-1.svg",
    title: "Creative Space",
    category: "Architecture",
  },
  {
    id: 8,
    url: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-1.svg",
    title: "Minimalist View",
    category: "Design",
  },
];

export function Portfolio() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("All");

  const categories = [
    "All",
    ...new Set(galleryImages.map((img) => img.category)),
  ];

  const filteredImages =
    filter === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.category === filter);

  const handleNext = () => {
    if (selectedImage !== null) {
      const currentIndex = galleryImages.findIndex(
        (img) => img.id === selectedImage
      );
      const nextIndex = (currentIndex + 1) % galleryImages.length;
      setSelectedImage(galleryImages[nextIndex].id);
    }
  };

  const handlePrev = () => {
    if (selectedImage !== null) {
      const currentIndex = galleryImages.findIndex(
        (img) => img.id === selectedImage
      );
      const prevIndex =
        (currentIndex - 1 + galleryImages.length) % galleryImages.length;
      setSelectedImage(galleryImages[prevIndex].id);
    }
  };

  const selectedImageData = galleryImages.find(
    (img) => img.id === selectedImage
  );

  const handleCardKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    imageId: number
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSelectedImage(imageId);
    }
  };

  return (
    <section
      className="w-full bg-white mt-4 p-8 lg:p-14 rounded-xl"
      aria-labelledby="gallery-heading"
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-left"
          role="region"
          aria-labelledby="gallery-heading"
        >
          <Badge className="mb-4">
            Gallery
            <Grid className="ml-2 size-4" />
          </Badge>
          <h2
            id="gallery-heading"
            className="mb-3 text-3xl font-semibold text-pretty md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl"
          >
            Our Portfolio
          </h2>
          <p className="mb-8 text-justify text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg">
            Explore our collection of stunning visuals and creative work
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex flex-wrap justify-center gap-2"
          role="group"
          aria-label="Gallery categories"
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={filter === category ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(category)}
              aria-pressed={filter === category}
            >
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          layout
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          role="list"
          aria-label="Gallery items"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                role="listitem"
              >
                <Card
                  className="group relative cursor-pointer overflow-hidden border-border transition-all hover:border-ring hover:shadow-xl p-0"
                  onClick={() => setSelectedImage(image.id)}
                  onKeyDown={(event) => handleCardKeyDown(event, image.id)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for ${image.title}`}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <motion.img
                      src={image.url}
                      alt={image.title}
                      className="h-full w-full object-cover"
                      whileHover={{ scale: 1.1 }}
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
                      <ZoomIn className="mb-2 h-8 w-8 text-[var(--muted-foreground)]" />
                      <h3 className="mb-1 text-center text-lg font-semibold text-[var(--muted-foreground)]">
                        {image.title}
                      </h3>
                      <Badge variant="secondary">{image.category}</Badge>
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
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
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
              onClick={() => setSelectedImage(null)}
              role="dialog"
              aria-modal="true"
              aria-labelledby="gallery-dialog-title"
              aria-describedby="gallery-dialog-description"
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
                  className="absolute -right-12 top-0 text-[var(--muted-foreground)] hover:bg-white/10"
                  onClick={() => setSelectedImage(null)}
                  aria-label="Close gallery dialog"
                >
                  <X className="h-6 w-6" />
                </Button>

                {/* Navigation Buttons */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:bg-white/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  aria-label="View previous image"
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:bg-white/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  aria-label="View next image"
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
                  className="mt-4 text-center text-[var(--muted-foreground)]"
                  id="gallery-dialog-description"
                >
                  <h3
                    className="mb-2 text-xl font-semibold"
                    id="gallery-dialog-title"
                  >
                    {selectedImageData.title}
                  </h3>
                  <Badge variant="secondary">
                    {selectedImageData.category}
                  </Badge>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
