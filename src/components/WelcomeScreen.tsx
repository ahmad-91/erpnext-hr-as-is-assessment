"use client";

import { BrandHeader } from "@/components/BrandHeader";
import { SOP_HELP } from "@/data/common";
import { getModule, type ModuleId } from "@/data/modules";
import { BRAND } from "@/lib/brand";

interface Props {
  moduleId: ModuleId;
  name: string;
  department: string;
  role: string;
  onChange: (field: "respondentName" | "department" | "role", value: string) => void;
  onStart: () => void;
  canResume: boolean;
  onResume: () => void;
}

export function WelcomeScreen({
  moduleId,
  name,
  department,
  role,
  onChange,
  onStart,
  canResume,
  onResume,
}: Props) {
  const mod = getModule(moduleId);
  const ready = name.trim() && department.trim() && role;

  return (
    <section className="welcome">
      <BrandHeader />
      <div className="welcome-hero">
        <p className="eyebrow">تقييم الوضع الحالي · As-Is</p>
        <h1>ERPNext — {mod.title}</h1>
        <p className="lede">
          هذا الرابط مخصص لوحدة <strong>{mod.title}</strong> في {BRAND.shortAr}. أجب حسب
          دورك الفعلي في الدورات التالية.
        </p>
      </div>

      <div className="welcome-panel">
        <h2>بيانات المشارك</h2>
        <p className="hint">{mod.description}</p>

        <label>
          الاسم
          <input
            value={name}
            onChange={(e) => onChange("respondentName", e.target.value)}
            autoComplete="name"
          />
        </label>

        <label>
          الإدارة / القسم
          <input
            value={department}
            onChange={(e) => onChange("department", e.target.value)}
            placeholder="مثال: اسم إدارتك أو قسمك"
          />
        </label>

        <fieldset>
          <legend>الدور</legend>
          <div className="role-grid">
            {mod.roles.map((r) => (
              <button
                key={r.id}
                type="button"
                className={`role-card ${role === r.id ? "active" : ""}`}
                onClick={() => onChange("role", r.id)}
              >
                <strong>{r.label}</strong>
                <span>{r.hint}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <div className="welcome-actions">
          <button type="button" className="btn-primary" disabled={!ready} onClick={onStart}>
            ابدأ تقييم {mod.title}
          </button>
          {canResume && (
            <button type="button" className="btn-ghost" onClick={onResume}>
              استئناف تقييم سابق لهذه الوحدة
            </button>
          )}
        </div>
      </div>

      <aside className="glossary-card">
        <h2>ماذا يعني SOP؟</h2>
        <p>{SOP_HELP}</p>
      </aside>

      <ul className="method-pills">
        <li>مستوى النضج ١–٥</li>
        <li>{mod.processes.length} دورات</li>
        <li>حفظ في قاعدة البيانات</li>
      </ul>
    </section>
  );
}
