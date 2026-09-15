"use client";

import { motion } from "framer-motion";
import { GoldButton } from "./ui";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy">
      {/* texture / depth layers */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(250,248,244,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(250,248,244,0.6) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-40 top-1/2 h-[560px] w-[560px] -translate-y-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #B8935A, transparent 70%)" }}
        aria-hidden
      />

      <div className="container-xl relative flex min-h-[86vh] flex-col justify-center py-28">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold"
        >
          <span className="h-px w-8 bg-gold" />
          Tout corps d&apos;état — spécialiste plomberie
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-7 max-w-3xl font-serif text-4xl font-semibold leading-[1.08] text-ivory text-balance sm:text-6xl"
        >
          L&apos;exigence de l&apos;artisan,
          <br />
          <span className="text-gold">du gros œuvre au dernier détail.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-7 max-w-xl text-base leading-relaxed text-ivory/75 sm:text-lg"
        >
          J&apos;accompagne particuliers et professionnels dans leurs projets de rénovation — de
          la fuite d&apos;eau au chantier complet — avec un engagement simple : un seul
          interlocuteur, un travail soigné, une parole tenue.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center gap-5"
        >
          <GoldButton href="/contact">Demander un devis gratuit</GoldButton>
          <GoldButton href="/realisations" variant="outline">
            Voir les réalisations
          </GoldButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-20 grid max-w-2xl grid-cols-3 gap-6 border-t border-gold/20 pt-8"
        >
          {[
            ["Interlocuteur", "unique, du début à la fin"],
            ["Devis", "gratuit & détaillé"],
            ["Garantie", "décennale"],
          ].map(([label, value]) => (
            <div key={label}>
              <div className="font-serif text-xl text-ivory sm:text-2xl">{label}</div>
              <div className="mt-1 text-xs uppercase tracking-wide text-ivory/55 sm:text-sm">
                {value}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
