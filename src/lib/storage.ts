import type { ModuleId } from "@/data/modules";
import type { Answers } from "@/lib/scoring";

function storageKey(moduleId: ModuleId) {
  return `erpnext-as-is-v2-${moduleId}`;
}

export interface AssessmentState {
  moduleId: ModuleId;
  respondentName: string;
  department: string;
  role: string;
  startedAt: string;
  updatedAt: string;
  answers: Record<string, Answers>;
}

export function emptyState(moduleId: ModuleId): AssessmentState {
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

export function loadState(moduleId: ModuleId): AssessmentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(storageKey(moduleId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AssessmentState;
    parsed.moduleId = moduleId;
    return parsed;
  } catch {
    return null;
  }
}

export function saveState(state: AssessmentState) {
  if (typeof window === "undefined") return;
  const next = stampState(state);
  localStorage.setItem(storageKey(state.moduleId), JSON.stringify(next));
}

export function clearState(moduleId: ModuleId) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(storageKey(moduleId));
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
