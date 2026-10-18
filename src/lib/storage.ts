import type { RoleId } from "@/data/hr-processes";
import type { Answers } from "@/lib/scoring";

const KEY = "erpnext-hr-as-is-v1";

export interface AssessmentState {
  respondentName: string;
  department: string;
  role: RoleId | "";
  startedAt: string;
  updatedAt: string;
  answers: Record<string, Answers>;
}

export function emptyState(): AssessmentState {
  return {
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
    return JSON.parse(raw) as AssessmentState;
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

export function exportPayload(state: AssessmentState, result: unknown) {
  return {
    meta: {
      assessment: "ERPNext As-Is — الموارد البشرية",
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
