"use client";

import { ROLES, type RoleId } from "@/data/hr-processes";

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
      <div className="welcome-hero">
        <p className="eyebrow">تقييم الوضع الحالي · As-Is Assessment</p>
        <h1>ERPNext — الموارد البشرية</h1>
        <p className="lede">
          بطاقات تفاعلية لفحص الدورات الحالية قبل التحول إلى ERPNext، وفق منهجية نضج
          العمليات العالمية (الأشخاص · الإجراءات · التقنية · البيانات · الضوابط).
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
            placeholder="مثال: أحمد العتيبي"
            autoComplete="name"
          />
        </label>

        <label>
          الإدارة / القسم
          <input
            value={department}
            onChange={(e) => onChange("department", e.target.value)}
            placeholder="مثال: الموارد البشرية / العمليات"
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

      <ul className="method-pills">
        <li>مستوى النضج ١–٥</li>
        <li>٨ دورات HR</li>
        <li>حفظ محلي في المتصفح</li>
        <li>تصدير النتائج JSON</li>
      </ul>
    </section>
  );
}
