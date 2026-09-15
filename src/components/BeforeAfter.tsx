import Image from "next/image";
import type { Realisation } from "@/lib/cloudinary";

export default function BeforeAfter({
  before,
  after,
}: {
  before: Realisation;
  after: Realisation;
}) {
  return (
    <div className="relative flex aspect-[4/3] w-full overflow-hidden">
      <div className="relative w-1/2">
        <Image
          src={before.url}
          alt={`Avant — ${before.title}`}
          fill
          sizes="(min-width: 1024px) 16vw, 25vw"
          className="object-cover"
        />
        <span className="absolute left-2 top-2 rounded-sm bg-navy-deep/85 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-gold">
          Avant
        </span>
      </div>
      <div className="relative w-1/2 border-l border-ivory/40">
        <Image
          src={after.url}
          alt={`Après — ${after.title}`}
          fill
          sizes="(min-width: 1024px) 16vw, 25vw"
          className="object-cover"
        />
        <span className="absolute right-2 top-2 rounded-sm bg-navy-deep/85 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-gold">
          Après
        </span>
      </div>
    </div>
  );
}
