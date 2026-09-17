"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import type { Realisation } from "@/lib/cloudinary";
import RoleBadge from "./RoleBadge";

export default function BeforeAfterSlider({
  before,
  after,
  className = "",
  priority = false,
}: {
  before: Realisation;
  after: Realisation;
  className?: string;
  priority?: boolean;
}) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative aspect-[4/3] w-full select-none overflow-hidden ${className}`}
      style={{ touchAction: "none" }}
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        updatePosition(e.clientX);
      }}
      onPointerMove={(e) => {
        if (dragging.current) updatePosition(e.clientX);
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerLeave={() => {
        dragging.current = false;
      }}
    >
      {/* Après — calque de base, pleine largeur */}
      <Image
        src={after.url}
        alt={`Après — ${after.title}`}
        fill
        sizes="(min-width: 1024px) 60vw, 100vw"
        className="pointer-events-none object-cover"
        priority={priority}
      />

      {/* Avant — calque découpé selon la position du curseur */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={before.url}
          alt={`Avant — ${before.title}`}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover"
          priority={priority}
        />
      </div>

      <RoleBadge role="avant" side="left" />
      <RoleBadge role="apres" side="right" />

      {/* Ligne + poignée de glissement */}
      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-ivory"
        style={{ left: `${position}%`, transform: "translateX(-1px)" }}
      >
        <div className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ivory bg-navy-deep text-ivory shadow-lg">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M5 3 L1 8 L5 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11 3 L15 8 L11 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}
