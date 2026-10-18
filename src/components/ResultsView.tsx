"use client";

import { DIMENSION_LABELS } from "@/data/hr-processes";
import { maturityLabel, type AssessmentResult } from "@/lib/scoring";

interface Props {
  result: AssessmentResult;
  onBack: () => void;
  onExport: () => void;
  onReset: () => void;
}

export function ResultsView({ result, onBack, onExport, onReset }: Props) {
  const overall = maturityLabel(result.level);

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

  return (
    <section className="results">
      <header className="results-header">
        <div>
          <p className="eyebrow">نتائج تقييم الوضع الحالي</p>
          <h1>ملخص نضج دورات الموارد البشرية</h1>
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
          <button type="button" className="btn-primary" onClick={onExport}>
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

      <div className="insights">
        <h2>قراءة أولية لتجهيز ERPNext</h2>
        <ul>
          <li>
            الدورات ذات النضج الأقل أولوية لتوثيق As-Is وتصميم To-Be قبل الإعداد في النظام.
          </li>
          <li>
            نقاط الألم المتكررة (تأخير، إدخال مزدوج، امتثال) تُحوَّل إلى متطلبات تكوين وWorkflow.
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
