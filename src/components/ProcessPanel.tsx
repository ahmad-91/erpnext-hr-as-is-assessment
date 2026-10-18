"use client";

import { useEffect } from "react";
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
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const answeredRequired = process.questions.filter((q) => {
    if (!q.required) return true;
    const v = answers[q.id];
    if (Array.isArray(v)) return v.length > 0;
    return typeof v === "string" && v.trim().length > 0;
  }).length;
  const totalQ = process.questions.length;

  return (
    <div className="panel-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div
        className="panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="panel-handle" aria-hidden />

        <header className="panel-header">
          <div className="panel-header-text">
            <span className="code">دورة {String(process.code).padStart(2, "0")}</span>
            <h2>{process.title}</h2>
            <p className="panel-desc">{process.description}</p>
            <p className="panel-progress-label">
              تقدّم الأسئلة: {answeredRequired}/{totalQ}
            </p>
          </div>
          <button type="button" className="icon-close" onClick={onClose} aria-label="إغلاق">
            ×
          </button>
        </header>

        <div className="panel-body">
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
                    {q.required ? (
                      <span className="req">إلزامي</span>
                    ) : (
                      <span className="opt">اختياري</span>
                    )}
                  </div>
                  <h3>{q.text}</h3>
                  {q.helpText && <p className="help-callout">{q.helpText}</p>}

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
                      rows={q.id.endsWith("_as_is") ? 5 : 3}
                      onChange={(e) => onChange(q.id, e.target.value)}
                    />
                  )}
                </article>
              );
            })}
          </div>
        </div>

        <footer className="panel-footer">
          <button type="button" className="btn-ghost" onClick={onClose}>
            حفظ والعودة
          </button>
          {hasNext && onNext ? (
            <button type="button" className="btn-primary" onClick={onNext}>
              الدورة التالية
            </button>
          ) : (
            <button type="button" className="btn-primary" onClick={onClose}>
              تم — إغلاق
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
