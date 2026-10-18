import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AssessmentApp } from "@/components/AssessmentApp";
import {
  ASSESSMENT_MODULES,
  getModule,
  isModuleId,
  type ModuleId,
} from "@/data/modules";
import { BRAND } from "@/lib/brand";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ moduleId: string }>;
}

export function generateStaticParams() {
  return ASSESSMENT_MODULES.map((m) => ({ moduleId: m.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { moduleId } = await params;
  if (!isModuleId(moduleId)) return { title: "غير موجود" };
  const mod = getModule(moduleId);
  return {
    title: `تقييم ${mod.title} | ${BRAND.shortAr}`,
    description: `استبيان As-Is لوحدة ${mod.title} — ${BRAND.nameAr}`,
  };
}

export default async function ModuleAssessmentPage({ params }: PageProps) {
  const { moduleId } = await params;
  if (!isModuleId(moduleId)) notFound();

  return (
    <Suspense fallback={<div className="loading">جاري التحميل…</div>}>
      <AssessmentApp moduleId={moduleId as ModuleId} />
    </Suspense>
  );
}
