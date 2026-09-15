import Image from "next/image";

type LogoProps = {
  className?: string;
  variant?: "light" | "dark";
  withWordmark?: boolean;
  height?: number;
};

// Proportions du monogramme source (public/logo/mark-*.png) : 360 × 476
const MARK_RATIO = 476 / 360;

export default function Logo({ className, variant = "dark", withWordmark = true, height = 36 }: LogoProps) {
  const mark = variant === "light" ? "/logo/mark-ivory.png" : "/logo/mark-navy.png";
  const textColor = variant === "light" ? "#FAF8F4" : "#0B1C33";
  const gold = "#B8935A";
  const width = Math.round(height / MARK_RATIO);

  return (
    <div className={`inline-flex items-center gap-3 ${className ?? ""}`}>
      <Image
        src={mark}
        alt="Monogramme RIO & CO."
        width={width}
        height={height}
        className="shrink-0"
        priority
      />
      {withWordmark && (
        <span className="font-serif leading-none tracking-[0.14em]" style={{ color: textColor }}>
          <span className="block text-[1.15rem] font-semibold">
            RIO <span style={{ color: gold }}>&amp;</span> CO.
          </span>
        </span>
      )}
    </div>
  );
}
