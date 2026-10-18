"use client";

import type { AssessmentProcess } from "@/data/common";
import { maturityLabel, type ProcessScore } from "@/lib/scoring";

interface Props {
  process: AssessmentProcess;
  score?: ProcessScore;
  onOpen: () => void;
}

export function ProcessCard({ process, score, onOpen }: Props) {
  const complete = score?.complete;
  const level = score && score.average > 0 ? maturityLabel(score.level) : null;

  return (
    <button type="button" className={`process-card ${complete ? "done" : ""}`} onClick={onOpen}>
      <div className="process-card-top">
        <span className="code">{String(process.code).padStart(2, "0")}</span>
        {complete ? (
          <span className="badge done">مكتمل</span>
        ) : score && score.answered > 0 ? (
          <span className="badge progress">
            {score.answered}/{score.totalRequired}
          </span>
        ) : (
          <span className="badge">لم يبدأ</span>
        )}
      </div>
      <h3>{process.title}</h3>
      <p>{process.subtitle}</p>
      <div className="steps">
        {process.steps.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>
      {level && score && score.average > 0 && (
        <div className="maturity-chip" style={{ borderColor: level.color, color: level.color }}>
          نضج {score.average.toFixed(1)} · {level.ar}
        </div>
      )}
      <span className="card-cta">{complete ? "مراجعة الإجابات ←" : "اضغط للإجابة ←"}</span>
    </button>
  );
}
