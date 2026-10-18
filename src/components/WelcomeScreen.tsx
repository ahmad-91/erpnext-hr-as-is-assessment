"use client";

import { BrandHeader } from "@/components/BrandHeader";
import { ROLES, SOP_HELP, type RoleId } from "@/data/hr-processes";
import { BRAND } from "@/lib/brand";

interface Props {
  name: string;
  department: string;
  role: RoleId | "";
  onChange: (field: "respondentName" | "department" | "role", value: string) => void;
  onStart: () => void;
  canResume: boolean;
  onResume: () => void;
}

export function WelcomeScreen({
  name,
  department,
  role,
  onChange,
  onStart,
  canResume,
  onResume,
}: Props) {
  const ready = name.trim() && department.trim() && role;

  return (
    <section className="welcome">
      <BrandHeader />
      <div className="welcome-hero">
        <p className="eyebrow">تقييم الوضع الحالي · As-Is Assessment</p>
        <h1>ERPNext — الموارد البشرية</h1>
        <p className="lede">
          بطاقات تفاعلية لفحص الدورات الحالية في {BRAND.shortAr} قبل التحول إلى ERPNext، وفق
          منهجية نضج العمليات (الأشخاص · الإجراءات · التقنية · البيانات · الضوابط).
        </p>
      </div>

      <div className="welcome-panel">
        <h2>بيانات المشارك</h2>
        <p className="hint">يُفضّل أن يجيب كل مدير/مشرف/موظف حسب دوره الفعلي في الدورة.</p>

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
            placeholder="مثال : ادارة العهد"
          />
        </label>

        <fieldset>
          <legend>الدور</legend>
          <div className="role-grid">
            {ROLES.map((r) => (
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
            ابدأ تقييم دورات الموارد البشرية
          </button>
          {canResume && (
            <button type="button" className="btn-ghost" onClick={onResume}>
              استئناف تقييم سابق محفوظ محلياً
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
        <li>٩ دورات (تشمل العهد)</li>
        <li>حفظ في قاعدة البيانات</li>
        <li>لوحة نتائج للإدارة</li>
      </ul>
    </section>
  );
}
