import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`container-xl ${className}`}>{children}</div>;
}

export function Eyebrow({ children, tone = "gold" }: { children: ReactNode; tone?: "gold" | "navy" }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] ${
        tone === "gold" ? "text-gold-dark" : "text-navy-mist"
      }`}
    >
      <span className="h-px w-8" style={{ background: "currentColor", opacity: 0.6 }} />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
}) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && <Eyebrow tone={tone === "dark" ? "gold" : "gold"}>{eyebrow}</Eyebrow>}
      <h2
        className={`mt-4 font-serif text-3xl font-semibold text-balance sm:text-4xl ${
          tone === "dark" ? "text-navy" : "text-ivory"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-base leading-relaxed sm:text-lg ${
            tone === "dark" ? "text-navy-mist" : "text-ivory/80"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

export function GoldButton({
  href,
  children,
  variant = "solid",
  className = "",
  ...props
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline" | "ghost";
  className?: string;
} & React.ComponentPropsWithoutRef<"a">) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-sm px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] transition-colors duration-300";
  const styles = {
    solid: "bg-gold text-navy-deep hover:bg-gold-light",
    outline: "border border-gold text-gold hover:bg-gold hover:text-navy-deep",
    ghost: "text-navy hover:text-gold-dark",
  } as const;

  return (
    <a href={href} className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </a>
  );
}
