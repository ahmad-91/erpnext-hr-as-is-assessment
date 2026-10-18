"use client";

import { DIMENSION_LABELS, type HrProcess } from "@/data/hr-processes";
import type { Answers } from "@/lib/scoring";

interface Props {
  process: HrProcess;
  answers: Answers;
  onChange: (questionId: string, value: string | string[]) => void;
  onClose: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export function ProcessPanel({
  process,
  answers,
  onChange,
  onClose,
  onNext,
  hasNext,
}: Props) {
  return (
    <div className="panel-overlay" role="dialog" aria-modal="true">
      <div className="panel">
        <header className="panel-header">
          <div>
            <span className="code">دورة {String(process.code).padStart(2, "0")}</span>
            <h2>{process.title}</h2>
            <p>{process.description}</p>
          </div>
          <button type="button" className="icon-close" onClick={onClose} aria-label="إغلاق">
            ×
          </button>
        </header>

        <ol className="flow-steps">
          {process.steps.map((s, i) => (
            <li key={s}>
              <span>{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>

        <div className="questions">
          {process.questions.map((q, idx) => {
            const value = answers[q.id];
            return (
              <article key={q.id} className="question">
                <div className="q-meta">
                  <span className="q-num">{idx + 1}</span>
                  <span className="q-dim">{DIMENSION_LABELS[q.dimension]}</span>
                  {q.required && <span className="req">إلزامي</span>}
                </div>
                <h3>{q.text}</h3>

                {q.type === "single" && q.options && (
                  <div className="options">
                    {q.options.map((opt) => (
                      <label key={opt.id} className={value === opt.id ? "selected" : ""}>
                        <input
                          type="radio"
                          name={q.id}
                          checked={value === opt.id}
                          onChange={() => onChange(q.id, opt.id)}
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                )}

                {q.type === "multi" && q.options && (
                  <div className="options multi">
                    {q.options.map((opt) => {
                      const selected = Array.isArray(value) ? value : [];
                      const checked = selected.includes(opt.id);
                      return (
                        <label key={opt.id} className={checked ? "selected" : ""}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              let next = [...selected];
                              if (opt.id === "none") {
                                next = checked ? [] : ["none"];
                              } else {
                                next = next.filter((id) => id !== "none");
                                if (checked) next = next.filter((id) => id !== opt.id);
                                else next.push(opt.id);
                              }
                              onChange(q.id, next);
                            }}
                          />
                          <span>{opt.label}</span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {q.type === "text" && (
                  <textarea
                    value={typeof value === "string" ? value : ""}
                    placeholder={q.placeholder}
                    rows={3}
                    onChange={(e) => onChange(q.id, e.target.value)}
                  />
                )}
              </article>
            );
          })}
        </div>

        <footer className="panel-footer">
          <button type="button" className="btn-ghost" onClick={onClose}>
            حفظ والعودة للبطاقات
          </button>
          {hasNext && onNext && (
            <button type="button" className="btn-primary" onClick={onNext}>
              الدورة التالية
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
