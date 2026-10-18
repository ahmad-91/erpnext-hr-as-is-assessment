import type { ModuleId } from "@/data/modules";
import type { Answers } from "@/lib/scoring";

const KEY = "erpnext-as-is-v2";

export interface AssessmentState {
  moduleId: ModuleId;
  respondentName: string;
  department: string;
  role: string;
  startedAt: string;
  updatedAt: string;
  answers: Record<string, Answers>;
}

export function emptyState(moduleId: ModuleId = "hr"): AssessmentState {
  return {
    moduleId,
    respondentName: "",
    department: "",
    role: "",
    startedAt: "",
    updatedAt: "",
    answers: {},
  };
}

export function stampState(state: AssessmentState): AssessmentState {
  const now = new Date().toISOString();
  return {
    ...state,
    startedAt: state.startedAt || now,
    updatedAt: now,
  };
}

export function loadState(): AssessmentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AssessmentState;
    if (!parsed.moduleId) parsed.moduleId = "hr";
    return parsed;
  } catch {
    return null;
  }
}

export function saveState(state: AssessmentState) {
  if (typeof window === "undefined") return;
  const next = stampState(state);
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function clearState() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

export function exportPayload(
  state: AssessmentState,
  result: unknown,
  moduleTitle: string
) {
  return {
    meta: {
      assessment: `ERPNext As-Is — ${moduleTitle}`,
      moduleId: state.moduleId,
      methodology: "Process Maturity (People / Process / Technology / Data / Control)",
      exportedAt: new Date().toISOString(),
    },
    respondent: {
      name: state.respondentName,
      department: state.department,
      role: state.role,
      startedAt: state.startedAt,
      updatedAt: state.updatedAt,
    },
    answers: state.answers,
    result,
  };
}
