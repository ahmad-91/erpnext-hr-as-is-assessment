"use client";

import { useState } from "react";
import Link from "next/link";
import { BrandHeader } from "@/components/BrandHeader";
import { ASSESSMENT_MODULES } from "@/data/modules";
import { BRAND } from "@/lib/brand";

export function ModulePortal() {
  const [copied, setCopied] = useState<string | null>(null);

  async function copyLink(path: string) {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}${path}`
        : path;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(path);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(null);
    }
  }

  return (
    <section className="welcome">
      <BrandHeader />
      <div className="welcome-hero">
        <p className="eyebrow">تقييم الوضع الحالي · As-Is</p>
        <h1>روابط وحدات التقييم</h1>
        <p className="lede">
          أرسل لكل إدارة رابط وحدتها فقط. كل رابط يفتح استبيان مستقل دون خلط مع الوحدات
          الأخرى — مناسب لـ {BRAND.shortAr} قبل ERPNext.
        </p>
      </div>

      <div className="module-link-list">
        {ASSESSMENT_MODULES.map((m) => (
          <article key={m.id} className="module-link-card">
            <div>
              <strong>{m.title}</strong>
              <p>{m.description}</p>
              <code className="module-path">{m.path}</code>
              <small>{m.processes.length} دورات تقييم</small>
            </div>
            <div className="module-link-actions">
              <Link className="btn-primary" href={m.path}>
                فتح التقييم
              </Link>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => copyLink(m.path)}
              >
                {copied === m.path ? "تم النسخ ✓" : "نسخ الرابط"}
              </button>
            </div>
          </article>
        ))}
      </div>

      <p className="portal-admin-hint">
        للإدارة:{" "}
        <Link href="/admin">لوحة النتائج</Link> لتجميع إجابات كل وحدة.
      </p>
    </section>
  );
}
