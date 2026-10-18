"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { HR_PROCESSES, type RoleId } from "@/data/hr-processes";
import {
  scoreAssessment,
  type Answers,
} from "@/lib/scoring";
import {
  clearState,
  emptyState,
  exportPayload,
  loadState,
  saveState,
  stampState,
  type AssessmentState,
} from "@/lib/storage";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { ProcessCard } from "@/components/ProcessCard";
import { ProcessPanel } from "@/components/ProcessPanel";
import { ResultsView } from "@/components/ResultsView";

type Phase = "welcome" | "cards" | "results";

export function AssessmentApp() {
  const [state, setState] = useState<AssessmentState>(emptyState);
  const [phase, setPhase] = useState<Phase>("welcome");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  useEffect(() => {
    const saved = loadState();
    if (saved) {
      setHasSaved(true);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || phase === "welcome") return;
    saveState(state);
    setHasSaved(true);
  }, [state, phase, hydrated]);

  const result = useMemo(() => scoreAssessment(state.answers), [state.answers]);

  const updateField = useCallback(
    (field: "respondentName" | "department" | "role", value: string) => {
      setState((s) => ({
        ...s,
        [field]: field === "role" ? (value as RoleId) : value,
      }));
    },
    []
  );

  const startFresh = () => {
    const next = stampState({
      ...emptyState(),
      respondentName: state.respondentName,
      department: state.department,
      role: state.role,
      answers: {},
    });
    setState(next);
    saveState(next);
    setPhase("cards");
    setActiveId(null);
  };

  const resume = () => {
    const saved = loadState();
    if (saved) {
      setState(saved);
      setPhase("cards");
    }
  };

  const setAnswer = (processId: string, questionId: string, value: string | string[]) => {
    setState((s) => ({
      ...s,
      answers: {
        ...s.answers,
        [processId]: {
          ...(s.answers[processId] ?? {}),
          [questionId]: value,
        } satisfies Answers,
      },
    }));
  };

  const activeProcess = HR_PROCESSES.find((p) => p.id === activeId) ?? null;
  const activeIndex = activeProcess
    ? HR_PROCESSES.findIndex((p) => p.id === activeProcess.id)
    : -1;

  const doExport = () => {
    const payload = exportPayload(state, result);
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hr-as-is-${state.department || "assessment"}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetAll = () => {
    if (!confirm("هل تريد مسح كل الإجابات المحفوظة محلياً؟")) return;
    clearState();
    setState(emptyState());
    setHasSaved(false);
    setSubmittedId(null);
    setPhase("welcome");
    setActiveId(null);
  };

  const submitToServer = async () => {
    const res = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        respondentName: state.respondentName,
        department: state.department,
        role: state.role,
        answers: state.answers,
        moduleId: "hr",
        moduleTitle: "الموارد البشرية",
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || "فشل إرسال التقييم");
    }
    setSubmittedId(data.id as string);
  };

  if (!hydrated) {
    return <div className="loading">جاري التحميل…</div>;
  }

  if (phase === "welcome") {
    return (
      <WelcomeScreen
        name={state.respondentName}
        department={state.department}
        role={state.role}
        onChange={updateField}
        onStart={startFresh}
        canResume={hasSaved}
        onResume={resume}
      />
    );
  }

  if (phase === "results") {
    return (
      <ResultsView
        result={result}
        onBack={() => setPhase("cards")}
        onExport={doExport}
        onReset={resetAll}
        onSubmit={submitToServer}
        submittedId={submittedId}
      />
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">تقييم As-Is · موارد بشرية</p>
          <h1>بطاقات الدورات الحالية</h1>
          <p className="meta">
            {state.respondentName} · {state.department} · اكتمل{" "}
            {result.completedCount}/{result.totalProcesses}
          </p>
        </div>
        <div className="topbar-actions">
          <div className="progress-track" aria-hidden>
            <i style={{ width: `${(result.completedCount / result.totalProcesses) * 100}%` }} />
          </div>
          <button
            type="button"
            className="btn-primary"
            disabled={result.completedCount === 0}
            onClick={() => setPhase("results")}
          >
            عرض النتائج
          </button>
          <button type="button" className="btn-ghost" onClick={doExport}>
            تصدير
          </button>
        </div>
      </header>

      <div className="card-grid">
        {HR_PROCESSES.map((p) => (
          <ProcessCard
            key={p.id}
            process={p}
            score={result.processes.find((s) => s.processId === p.id)}
            onOpen={() => setActiveId(p.id)}
          />
        ))}
      </div>

      {activeProcess && (
        <ProcessPanel
          process={activeProcess}
          answers={state.answers[activeProcess.id] ?? {}}
          onChange={(qid, val) => setAnswer(activeProcess.id, qid, val)}
          onClose={() => setActiveId(null)}
          hasNext={activeIndex < HR_PROCESSES.length - 1}
          onNext={() => {
            const next = HR_PROCESSES[activeIndex + 1];
            if (next) setActiveId(next.id);
          }}
        />
      )}
    </div>
  );
}
