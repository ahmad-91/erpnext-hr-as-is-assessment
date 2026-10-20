"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

interface Props {
  moduleId: ModuleId;
}

export function AssessmentApp({ moduleId }: Props) {
  const [state, setState] = useState<AssessmentState>(() => emptyState(moduleId));
  const [phase, setPhase] = useState<Phase>("welcome");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [saveLabel, setSaveLabel] = useState("");
  const submissionIdRef = useRef<string | null>(null);
  const saveSeq = useRef(0);

  const mod = getModule(moduleId);
  const processes = mod.processes;

  useEffect(() => {
    submissionIdRef.current = null;
    setState(emptyState(moduleId));
    setPhase("welcome");
    setActiveId(null);
    setSubmittedId(null);
    setSaveLabel("");
    const saved = loadState(moduleId);
    setHasSaved(Boolean(saved));
    setHydrated(true);
  }, [moduleId]);

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

  const startFresh = () => {
    submissionIdRef.current = null;
    setSubmittedId(null);
    const next = stampState({
      ...emptyState(moduleId),
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
    const saved = loadState(moduleId);
    if (saved) {
      setState({ ...saved, moduleId });
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
    a.download = `${moduleId}-as-is-${state.department || "assessment"}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetAll = () => {
    if (!confirm("هل تريد مسح كل الإجابات المحفوظة محلياً لهذه الوحدة؟")) return;
    clearState(moduleId);
    submissionIdRef.current = null;
    setState(emptyState(moduleId));
    setHasSaved(false);
    setSubmittedId(null);
    setPhase("welcome");
    setActiveId(null);
  };

  const submitToServer = useCallback(async () => {
    if (!state.respondentName.trim() || !state.department.trim() || !state.role) {
      throw new Error("بيانات المشارك ناقصة");
    }
    const seq = ++saveSeq.current;
    setSaveLabel("جاري الحفظ…");
    const res = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: submissionIdRef.current,
        respondentName: state.respondentName,
        department: state.department,
        role: state.role,
        answers: state.answers,
        moduleId,
        moduleTitle: mod.title,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (seq !== saveSeq.current) return;
    if (!res.ok) {
      setSaveLabel("تعذر الحفظ");
      throw new Error(data.error || "فشل إرسال التقييم");
    }
    submissionIdRef.current = data.id as string;
    setSubmittedId(data.id as string);
    setSaveLabel("تم الحفظ في قاعدة البيانات");
  }, [state, moduleId, mod.title]);

  useEffect(() => {
    if (!hydrated || phase === "welcome") return;
    const timer = setTimeout(() => {
      void submitToServer().catch(() => {
        setSaveLabel("تعذر الحفظ — تحقق من الاتصال");
      });
    }, 800);
    return () => clearTimeout(timer);
  }, [state, phase, hydrated, submitToServer]);

  if (!hydrated) {
    return <div className="loading">جاري التحميل…</div>;
  }

  if (phase === "welcome") {
    return (
      <WelcomeScreen
        moduleId={moduleId}
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
            {saveLabel ? ` · ${saveLabel}` : ""}
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
