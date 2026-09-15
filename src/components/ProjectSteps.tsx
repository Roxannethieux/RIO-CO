"use client";

import { motion } from "framer-motion";
import { Container, Eyebrow } from "./ui";

const steps = [
  {
    n: "01",
    title: "Consultation",
    text: "Nous échangeons sur votre projet — besoins, contraintes, budget — par téléphone ou lors d'une visite sur place.",
  },
  {
    n: "02",
    title: "Choix des matériaux",
    text: "Sélection des matériaux et équipements adaptés à votre budget et à vos goûts, avec les conseils d'un artisan.",
  },
  {
    n: "03",
    title: "Réalisation",
    text: "Le chantier est mené avec rigueur : délais tenus, chantier propre, communication à chaque étape clé.",
  },
  {
    n: "04",
    title: "Service après-vente",
    text: "Garantie décennale et disponibilité après réception des travaux — notre engagement continue au-delà du chantier.",
  },
];

export default function ProjectSteps() {
  return (
    <section className="relative overflow-hidden bg-navy py-24 sm:py-32">
      <div
        className="pointer-events-none absolute -left-32 top-0 h-[420px] w-[420px] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #B8935A, transparent 70%)" }}
        aria-hidden
      />

      <Container className="relative">
        <div className="max-w-2xl">
          <Eyebrow>Notre méthode</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl font-semibold text-ivory text-balance sm:text-4xl">
            Votre projet, étape par étape
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ivory/70 sm:text-lg">
            De la première prise de contact au service après-vente, un déroulé clair et sans
            surprise, du début à la fin du chantier.
          </p>
        </div>

        <div className="relative mt-16">
          {/* horizontal connecting line — desktop */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "left" }}
            className="absolute left-0 right-0 top-[22px] hidden h-px bg-gradient-to-r from-gold via-gold/60 to-gold/10 lg:block"
            aria-hidden
          />

          <div className="grid gap-10 lg:grid-cols-4 lg:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex gap-5 lg:flex-col lg:gap-0"
              >
                {/* vertical connecting line — mobile */}
                {i < steps.length - 1 && (
                  <span
                    className="absolute left-[21px] top-11 h-[calc(100%+1rem)] w-px bg-gold/25 lg:hidden"
                    aria-hidden
                  />
                )}

                <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold bg-navy font-serif text-lg text-gold">
                  {step.n}
                </div>

                <div className="lg:mt-6">
                  <h3 className="font-serif text-xl text-ivory">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ivory/65">{step.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
