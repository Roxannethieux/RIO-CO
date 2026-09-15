type LogoProps = {
  className?: string;
  variant?: "light" | "dark";
  withWordmark?: boolean;
};

/**
 * Monogramme RIO & CO. — double "R" en miroir formant un emblème symétrique,
 * réinterprétation vectorielle originale inspirée de l'identité de marque
 * (à remplacer par le fichier logo définitif du client si besoin d'un rendu
 * pixel-exact).
 */
export default function Logo({ className, variant = "dark", withWordmark = true }: LogoProps) {
  const line = variant === "light" ? "#FAF8F4" : "#0B1C33";
  const gold = "#B8935A";

  return (
    <div className={`inline-flex items-center gap-3 ${className ?? ""}`}>
      <svg
        viewBox="0 0 120 140"
        className="h-9 w-auto shrink-0"
        role="img"
        aria-label="Monogramme RIO & CO."
      >
        {/* stems */}
        <path d="M54 22 V118" stroke={line} strokeWidth="2.5" fill="none" />
        <path d="M66 22 V118" stroke={line} strokeWidth="2.5" fill="none" />
        {/* top crossing arms */}
        <path d="M54 30 L18 8" stroke={line} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M66 30 L102 8" stroke={line} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M54 46 L26 30" stroke={line} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M66 46 L94 30" stroke={line} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* bottom crossing legs */}
        <path d="M54 96 L18 132" stroke={line} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M66 96 L102 132" stroke={line} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* interlocked bowls */}
        <path
          d="M54 44 h4 a20 18 0 0 1 0 36 h-4"
          stroke={line}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M66 44 h-4 a20 18 0 0 0 0 36 h4"
          stroke={line}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* gold accent dot at center */}
        <circle cx="60" cy="62" r="2.4" fill={gold} />
      </svg>
      {withWordmark && (
        <span className="font-serif leading-none tracking-[0.14em]" style={{ color: line }}>
          <span className="block text-[1.15rem] font-semibold">
            RIO <span style={{ color: gold }}>&amp;</span> CO.
          </span>
        </span>
      )}
    </div>
  );
}
