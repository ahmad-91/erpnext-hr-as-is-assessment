"use client";

import Image from "next/image";

interface Props {
  compact?: boolean;
}

export function BrandHeader({ compact = false }: Props) {
  return (
    <header className={`brand-header ${compact ? "compact" : ""}`}>
      <a href="https://qswr.sa/aboutus" className="brand-lockup" target="_blank" rel="noreferrer">
        <Image
          src="/brand/qswr-logo.png"
          alt="قساور للمقاولات والكهرباء — QASAWER"
          width={compact ? 160 : 220}
          height={compact ? 48 : 66}
          className="brand-logo"
          priority
        />
      </a>
      {!compact && (
        <p className="brand-tagline">شركة قساور للمقاولات والكهرباء</p>
      )}
    </header>
  );
}
