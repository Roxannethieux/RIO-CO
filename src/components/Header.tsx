"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import { navLinks, siteConfig } from "@/lib/site-config";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-navy/95 shadow-[0_1px_0_0_rgba(184,147,90,0.25)] backdrop-blur" : "bg-navy"
      }`}
    >
      <div className="container-xl flex h-20 items-center justify-between">
        <Link href="/" className="shrink-0" aria-label={`${siteConfig.name} — Accueil`}>
          <Logo variant="light" />
        </Link>

        <nav className="hidden items-center gap-8 xl:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-sm font-medium uppercase tracking-[0.12em] text-ivory/85 transition-colors hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 xl:flex">
          <a
            href={siteConfig.phoneHref}
            className="whitespace-nowrap text-sm font-semibold tracking-wide text-ivory/90 hover:text-gold"
          >
            {siteConfig.phone}
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center whitespace-nowrap rounded-sm border border-gold px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-gold transition-colors hover:bg-gold hover:text-navy-deep"
          >
            Demander un devis
          </Link>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 xl:hidden"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`h-px w-6 bg-ivory transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`}
          />
          <span className={`h-px w-6 bg-ivory transition-opacity ${open ? "opacity-0" : ""}`} />
          <span
            className={`h-px w-6 bg-ivory transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      {open && (
        <div className="border-t border-gold/20 bg-navy px-6 pb-8 pt-2 xl:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/5 py-3.5 text-base font-medium text-ivory/90"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-5 flex flex-col gap-3">
            <a href={siteConfig.phoneHref} className="text-base font-semibold text-gold">
              {siteConfig.phone}
            </a>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center rounded-sm bg-gold px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-navy-deep"
            >
              Demander un devis
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
