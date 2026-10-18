"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getModule, type ModuleId } from "@/data/modules";
import { scoreAssessment, type Answers } from "@/lib/scoring";
import {
  clearState,
  emptyState,
  exportPayload,
  loadState,
  saveState,
  stampState,
  type AssessmentState,
} from "@/lib/storage";
import { BrandHeader } from "@/components/BrandHeader";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { ProcessCard } from "@/components/ProcessCard";
import { ProcessPanel } from "@/components/ProcessPanel";
import { ResultsView } from "@/components/ResultsView";

type Phase = "welcome" | "cards" | "results";

export function AssessmentApp() {
  const [state, setState] = useState<AssessmentState>(emptyState("hr"));
  const [phase, setPhase] = useState<Phase>("welcome");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const mod = getModule(state.moduleId);
  const processes = mod.processes;

  useEffect(() => {
    const saved = loadState();
    if (saved) setHasSaved(true);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || phase === "welcome") return;
    saveState(state);
    setHasSaved(true);
  }, [state, phase, hydrated]);

  const result = useMemo(
    () => scoreAssessment(state.answers, processes),
    [state.answers, processes]
  );

  const updateField = useCallback(
    (field: "respondentName" | "department" | "role", value: string) => {
      setState((s) => ({ ...s, [field]: value }));
    },
    []
  );

  const onModuleChange = (moduleId: ModuleId) => {
    setState((s) => ({
      ...s,
      moduleId,
      role: "",
      answers: {},
    }));
    setSubmittedId(null);
  };

  const startFresh = () => {
    const next = stampState({
      ...emptyState(state.moduleId),
      respondentName: state.respondentName,
      department: state.department,
      role: state.role,
      answers: {},
    });
    setState(next);
    saveState(next);
    setPhase("cards");
    setActiveId(null);
    setSubmittedId(null);
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

  const activeProcess = processes.find((p) => p.id === activeId) ?? null;
  const activeIndex = activeProcess
    ? processes.findIndex((p) => p.id === activeProcess.id)
    : -1;

  const doExport = () => {
    const payload = exportPayload(state, result, mod.title);
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${state.moduleId}-as-is-${state.department || "assessment"}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetAll = () => {
    if (!confirm("هل تريد مسح كل الإجابات المحفوظة محلياً؟")) return;
    clearState();
    setState(emptyState(state.moduleId));
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
        moduleId: state.moduleId,
        moduleTitle: mod.title,
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
        moduleId={state.moduleId}
        name={state.respondentName}
        department={state.department}
        role={state.role}
        onModuleChange={onModuleChange}
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
        moduleTitle={mod.title}
        result={result}
        onBack={() => setPhase("cards")}
        onExport={doExport}
        onReset={resetAll}
        onSubmit={submitToServer}
        submittedId={submittedId}
      />
    );
  }

  const progressPct = (result.completedCount / result.totalProcesses) * 100;

  return (
    <div className="app-shell has-mobile-bar">
      <BrandHeader compact />
      <header className="topbar">
        <div>
          <p className="eyebrow">تقييم As-Is · {mod.title}</p>
          <h1>بطاقات الدورات الحالية</h1>
          <p className="meta">
            {state.respondentName} · {state.department}
          </p>
          <div className="progress-block">
            <div className="progress-track" aria-hidden>
              <i style={{ width: `${progressPct}%` }} />
            </div>
            <span className="progress-label">
              اكتمل {result.completedCount} من {result.totalProcesses}
            </span>
          </div>
        </div>
        <div className="topbar-actions desktop-only">
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
        {processes.map((p) => (
          <ProcessCard
            key={p.id}
            process={p}
            score={result.processes.find((s) => s.processId === p.id)}
            onOpen={() => setActiveId(p.id)}
          />
        ))}
      </div>

      <div className="mobile-action-bar">
        <div className="progress-track" aria-hidden>
          <i style={{ width: `${progressPct}%` }} />
        </div>
        <button
          type="button"
          className="btn-primary"
          disabled={result.completedCount === 0}
          onClick={() => setPhase("results")}
        >
          عرض النتائج ({result.completedCount}/{result.totalProcesses})
        </button>
      </div>

      {activeProcess && (
        <ProcessPanel
          process={activeProcess}
          answers={state.answers[activeProcess.id] ?? {}}
          onChange={(qid, val) => setAnswer(activeProcess.id, qid, val)}
          onClose={() => setActiveId(null)}
          hasNext={activeIndex < processes.length - 1}
          onNext={() => {
            const next = processes[activeIndex + 1];
            if (next) setActiveId(next.id);
          }}
        />
      )}
    </div>
  );
}
