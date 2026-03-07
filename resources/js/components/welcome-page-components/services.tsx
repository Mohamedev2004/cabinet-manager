"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

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

const Services = () => {
  const posts = [
    {
      id: "1",
      title: "Conseil stratégique personnalisé",
      summary:
        "Nos experts accompagnent vos décisions pour maximiser l'efficacité et la rentabilité de vos projets.",
      url: "#",
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-1.svg",
    },
    {
      id: "2",
      title: "Formation et accompagnement",
      summary:
        "Nous proposons des formations sur mesure pour vos équipes afin de développer leurs compétences et savoir-faire.",
      url: "#",
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-1.svg",
    },
    {
      id: "3",
      title: "Optimisation des process",
      summary:
        "Nous analysons vos processus internes et mettons en place des solutions pour gagner en performance et en organisation.",
      url: "#",
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-1.svg",
    },
  ];

  return (
    <section className="mt-4 p-8 lg:p-14 rounded-xl bg-white">
      <div className="flex flex-col items-left gap-16">

        {/* Heading */}
        <motion.header
          className="text-left"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <Badge className="mb-6">
            Nos Services
            <ArrowUpRight className="ml-2 size-4" />
          </Badge>

          <h2 className="mb-3 text-3xl font-semibold text-pretty md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl">
            Accompagner votre réussite avec sagesse
          </h2>

          <p className="mb-8 text-justify text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg">
            Découvrez nos solutions personnalisées pour les organisations et les individus,
            combinant conseil, formation et accompagnement sur mesure.
          </p>

          <Button className="w-full sm:w-auto" asChild>
            <a href="#">
              Voir tous les services
              <ArrowRight className="ml-2 size-4" />
            </a>
          </Button>
        </motion.header>

        {/* Cards */}
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
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
          {posts.map((post) => (
            <motion.article
              key={post.id}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden rounded-xl"
            >
              <Card className="grid grid-rows-[auto_auto_1fr_auto] overflow-hidden pt-0">
                <div className="aspect-16/9 w-full">
                  <a href={post.url} className="transition-opacity duration-200 hover:opacity-70">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover object-center"
                    />
                  </a>
                </div>

                <CardHeader>
                  <h3 className="text-lg font-semibold hover:underline md:text-xl">
                    <a href={post.url}>{post.title}</a>
                  </h3>
                </CardHeader>

                <CardContent>
                  <p className="text-muted-foreground">{post.summary}</p>
                </CardContent>

                <CardFooter>
                  <a href={post.url} className="flex items-center text-foreground hover:underline">
                    En savoir plus
                    <ArrowRight className="ml-2 size-4" />
                  </a>
                </CardFooter>

              </Card>
            </motion.article>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Services;
