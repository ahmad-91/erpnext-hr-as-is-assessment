"use client";

import { useState } from "react";
import { BrandHeader } from "@/components/BrandHeader";
import { DIMENSION_LABELS } from "@/data/common";
import { maturityLabel, type AssessmentResult } from "@/lib/scoring";

interface Props {
  moduleTitle: string;
  result: AssessmentResult;
  onBack: () => void;
  onExport: () => void;
  onReset: () => void;
  onSubmit: () => Promise<void>;
  submittedId: string | null;
}

export function ResultsView({
  moduleTitle,
  result,
  onBack,
  onExport,
  onReset,
  onSubmit,
  submittedId,
}: Props) {
  const overall = maturityLabel(result.level);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const dimAgg: Record<string, number[]> = {};
  for (const p of result.processes) {
    if (!p.complete) continue;
    for (const [dim, val] of Object.entries(p.byDimension)) {
      if (!dimAgg[dim]) dimAgg[dim] = [];
      dimAgg[dim].push(val);
    }
  }
  const dimensions = Object.entries(dimAgg).map(([dim, vals]) => ({
    dim,
    avg: Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10,
  }));

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError("");
    try {
      await onSubmit();
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "فشل الإرسال");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="results">
      <BrandHeader compact />
      <header className="results-header">
        <div>
          <p className="eyebrow">نتائج تقييم الوضع الحالي</p>
          <h1>ملخص نضج دورات {moduleTitle}</h1>
          <p>
            اكتمل {result.completedCount} من {result.totalProcesses} دورات · المتوسط العام{" "}
            <strong style={{ color: overall.color }}>
              {result.overall.toFixed(1)} — {overall.ar}
            </strong>
          </p>
        </div>
        <div className="results-actions">
          <button type="button" className="btn-ghost" onClick={onBack}>
            العودة للبطاقات
          </button>
          <button type="button" className="btn-ghost" onClick={onExport}>
            تصدير JSON
          </button>
        </div>
      </header>

      <div className="overall-ring" style={{ ["--ring" as string]: overall.color }}>
        <strong>{result.overall.toFixed(1)}</strong>
        <span>من ٥</span>
        <em>{overall.ar}</em>
      </div>

      {dimensions.length > 0 && (
        <div className="dim-bars">
          <h2>حسب أبعاد المنهجية</h2>
          {dimensions.map(({ dim, avg }) => (
            <div key={dim} className="dim-row">
              <span>{DIMENSION_LABELS[dim] ?? dim}</span>
              <div className="bar">
                <i style={{ width: `${(avg / 5) * 100}%` }} />
              </div>
              <b>{avg.toFixed(1)}</b>
            </div>
          ))}
        </div>
      )}

      <div className="process-scores">
        <h2>نضج كل دورة</h2>
        <ul>
          {result.processes.map((p) => {
            const m = maturityLabel(p.level);
            return (
              <li key={p.processId}>
                <span className="code">{String(p.code).padStart(2, "0")}</span>
                <div>
                  <strong>{p.title}</strong>
                  <small>
                    {p.complete
                      ? `${p.answered}/${p.totalRequired} أسئلة`
                      : `غير مكتمل (${p.answered}/${p.totalRequired})`}
                  </small>
                </div>
                {p.complete && p.average > 0 ? (
                  <em style={{ color: m.color }}>
                    {p.average.toFixed(1)} · {m.ar}
                  </em>
                ) : (
                  <em className="muted">—</em>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="submit-box">
        <h2>إرسال للإدارة</h2>
        <p>
          الإجابات تُحفظ تلقائياً في قاعدة البيانات وتظهر في لوحة الأدمن. يمكنك تأكيد الإرسال من هنا أيضاً.
        </p>
        {submittedId ? (
          <p className="submit-ok">
            تم الإرسال بنجاح. رقم المشاركة: <code>{submittedId}</code>
          </p>
        ) : (
          <button
            type="button"
            className="btn-primary"
            disabled={submitting || result.completedCount === 0}
            onClick={handleSubmit}
          >
            {submitting ? "جاري الإرسال…" : "إرسال التقييم الآن"}
          </button>
        )}
        {submitError && <p className="form-error">{submitError}</p>}
      </div>

      <div className="insights">
        <h2>قراءة أولية لتجهيز ERPNext</h2>
        <ul>
          <li>
            الدورات ذات النضج الأقل أولوية لتوثيق As-Is وتصميم To-Be قبل الإعداد في النظام.
          </li>
          <li>
            المشاكل الحالية المتكررة (تأخير، إدخال مزدوج، امتثال) تُحوَّل إلى متطلبات تكوين
            وWorkflow في ERPNext.
          </li>
          <li>
            يُفضّل جمع إجابات من أدوار متعددة لنفس الدورة ثم مقارنة الفجوات في ورشة توحيد.
          </li>
        </ul>
        <button type="button" className="btn-danger-ghost" onClick={onReset}>
          مسح التقييم المحلي والبدء من جديد
        </button>
      </div>
    </section>
  );
}
