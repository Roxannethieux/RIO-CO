import Image from "next/image";
import type { Realisation } from "@/lib/cloudinary";
import RoleBadge from "./RoleBadge";

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
        <RoleBadge role="avant" side="left" />
      </div>
      <div className="relative w-1/2 border-l border-ivory/40">
        <Image
          src={after.url}
          alt={`Après — ${after.title}`}
          fill
          sizes="(min-width: 1024px) 16vw, 25vw"
          className="object-cover"
        />
        <RoleBadge role="apres" side="right" />
      </div>
    </div>
  );
}
