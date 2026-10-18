import {
  MATURITY_LABELS,
  type AssessmentProcess,
  type MaturityLevel,
  type Question,
} from "@/data/common";
import { HR_PROCESSES } from "@/data/hr-processes";

export type Answers = Record<string, string | string[]>;

export interface ProcessScore {
  processId: string;
  title: string;
  code: number;
  average: number;
  level: MaturityLevel;
  answered: number;
  totalRequired: number;
  complete: boolean;
  byDimension: Record<string, number>;
}

export interface AssessmentResult {
  overall: number;
  level: MaturityLevel;
  processes: ProcessScore[];
  completedCount: number;
  totalProcesses: number;
}

function toLevel(avg: number): MaturityLevel {
  const rounded = Math.round(avg) as MaturityLevel;
  if (rounded < 1) return 1;
  if (rounded > 5) return 5;
  return rounded;
}

function scoreForAnswer(question: Question, value: string | string[] | undefined): number | null {
  if (value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
    return null;
  }
  if (question.type === "text") return null;
  if (question.type === "multi") {
    const selected = Array.isArray(value) ? value : [value];
    if (selected.includes("none") && selected.length === 1) return 5;
    const problemCount = selected.filter((id) => id !== "none").length;
    if (problemCount === 0) return 5;
    if (problemCount === 1) return 4;
    if (problemCount === 2) return 3;
    if (problemCount === 3) return 2;
    return 1;
  }
  const opt = question.options?.find((o) => o.id === value);
  return opt?.score ?? null;
}

export function scoreProcess(
  process: AssessmentProcess,
  answers: Answers
): ProcessScore {
  const required = process.questions.filter((q) => q.required);
  let answered = 0;
  const scores: number[] = [];
  const dimBuckets: Record<string, number[]> = {};

  for (const q of process.questions) {
    const val = answers[q.id];
    const s = scoreForAnswer(q, val);
    const hasAnswer =
      val !== undefined &&
      val !== "" &&
      !(Array.isArray(val) && val.length === 0);

    if (q.required && hasAnswer) answered += 1;
    if (s !== null) {
      scores.push(s);
      if (!dimBuckets[q.dimension]) dimBuckets[q.dimension] = [];
      dimBuckets[q.dimension].push(s);
    }
  }

  const average =
    scores.length === 0
      ? 0
      : Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;

  const byDimension: Record<string, number> = {};
  for (const [dim, arr] of Object.entries(dimBuckets)) {
    byDimension[dim] =
      Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10;
  }

  return {
    processId: process.id,
    title: process.title,
    code: process.code,
    average,
    level: toLevel(average || 1),
    answered,
    totalRequired: required.length,
    complete: answered >= required.length,
    byDimension,
  };
}

export function scoreAssessment(
  allAnswers: Record<string, Answers>,
  processes: AssessmentProcess[] = HR_PROCESSES
): AssessmentResult {
  const scoredProcesses = processes.map((p) =>
    scoreProcess(p, allAnswers[p.id] ?? {})
  );
  const completed = scoredProcesses.filter((p) => p.complete);
  const scored = completed.filter((p) => p.average > 0);
  const overall =
    scored.length === 0
      ? 0
      : Math.round(
          (scored.reduce((a, b) => a + b.average, 0) / scored.length) * 10
        ) / 10;

  return {
    overall,
    level: toLevel(overall || 1),
    processes: scoredProcesses,
    completedCount: completed.length,
    totalProcesses: processes.length,
  };
}

export function maturityLabel(level: MaturityLevel) {
  return MATURITY_LABELS[level];
}

export function isProcessComplete(
  process: AssessmentProcess,
  answers: Answers
): boolean {
  return scoreProcess(process, answers).complete;
}
