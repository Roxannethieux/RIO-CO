import Link from "next/link";
import Logo from "./Logo";
import { navLinks, siteConfig } from "@/lib/site-config";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-deep text-ivory/85">
      <div className="container-xl py-16">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Logo variant="light" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ivory/65">
              Rénovation tout corps d&apos;état et plomberie, portées par l&apos;exigence d&apos;un
              artisan qui signe chaque chantier de son nom.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Navigation
            </h4>
            <ul className="mt-5 space-y-3 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-ivory/70 hover:text-gold">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Contact</h4>
            <ul className="mt-5 space-y-3 text-sm text-ivory/70">
              <li>
                <a href={siteConfig.phoneHref} className="hover:text-gold">
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="hover:text-gold">
                  {siteConfig.email}
                </a>
              </li>
              <li className="text-ivory/60">{siteConfig.address.zone}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Légal</h4>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link href="/mentions-legales" className="text-ivory/70 hover:text-gold">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/confidentialite" className="text-ivory/70 hover:text-gold">
                  Confidentialité &amp; RGPD
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-ivory/50 sm:flex-row">
          <span>
            © {year} {siteConfig.name} — {siteConfig.founder}. Tous droits réservés.
          </span>
          <span>Site conçu par Solensia Consulting</span>
        </div>
      </div>
    </footer>
  );
}
