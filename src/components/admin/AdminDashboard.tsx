"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandHeader } from "@/components/BrandHeader";
import { MATURITY_LABELS } from "@/data/common";
import { ASSESSMENT_MODULES, allRoles, getModule } from "@/data/modules";

interface ProcessScoreRow {
  id: string;
  processId: string;
  processCode: number;
  processTitle: string;
  average: number;
  level: number;
  complete: boolean;
  problemsJson: string;
}

interface SubmissionRow {
  id: string;
  moduleId: string;
  moduleTitle: string;
  respondentName: string;
  department: string;
  role: string;
  overallScore: number;
  overallLevel: number;
  completedCount: number;
  totalProcesses: number;
  createdAt: string;
  processScores: ProcessScoreRow[];
}

interface DetailPayload extends SubmissionRow {
  roleLabel: string;
  answers: Record<string, Record<string, string | string[]>>;
  result: unknown;
}

export function AdminDashboard() {
  const router = useRouter();
  const [rows, setRows] = useState<SubmissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const moduleProcesses =
    moduleFilter === "all"
      ? ASSESSMENT_MODULES.flatMap((m) => m.processes)
      : getModule(moduleFilter).processes;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<DetailPayload | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/submissions?moduleId=${moduleFilter}`);
      if (res.status === 401) {
        router.push("/admin");
        return;
      }
      if (!res.ok) throw new Error("load failed");
      const data = await res.json();
      setRows(data.submissions ?? []);
    } catch {
      setError("تعذر تحميل النتائج");
    } finally {
      setLoading(false);
    }
  }, [moduleFilter, router]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }
    let cancelled = false;
    (async () => {
      const res = await fetch(`/api/submissions/${selectedId}`);
      if (!res.ok) return;
      const data = await res.json();
      if (!cancelled) setDetail(data);
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const stats = useMemo(() => {
    const count = rows.length;
    const avgOverall =
      count === 0
        ? 0
        : Math.round(
            (rows.reduce((a, r) => a + r.overallScore, 0) / count) * 10
          ) / 10;

    const byProcess = moduleProcesses.map((p) => {
      const scores = rows
        .flatMap((r) => r.processScores)
        .filter((s) => s.processId === p.id && s.complete && s.average > 0);
      const avg =
        scores.length === 0
          ? 0
          : Math.round(
              (scores.reduce((a, s) => a + s.average, 0) / scores.length) * 10
            ) / 10;

      const problemCounts: Record<string, number> = {};
      for (const s of scores) {
        try {
          const probs = JSON.parse(s.problemsJson) as string[];
          for (const id of probs) {
            if (id === "none") continue;
            problemCounts[id] = (problemCounts[id] ?? 0) + 1;
          }
        } catch {
          /* ignore */
        }
      }

      return { process: p, avg, responses: scores.length, problemCounts };
    });

    return { count, avgOverall, byProcess };
  }, [rows, moduleProcesses]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  const problemLabels: Record<string, string> = {
    delays: "تأخير",
    rework: "أخطاء/إعادة عمل",
    visibility: "ضعف تتبع الحالة",
    compliance: "امتثال",
    budget: "ميزانية",
    supplier: "موردين",
    pricing: "أسعار",
    handoff: "تسليم بين الإدارات",
    reporting: "تقارير",
    duplicate: "إدخال مزدوج",
    duplicate_wo: "أوامر مزدوجة / بلا أمر",
    unbilled: "منفّذ غير مفوتر",
    rejects: "رفض مستخلص/فاتورة",
    materials: "فروقات عهدة",
    emergency: "طوارئ خارج السجل",
    uds_mismatch: "فروقات UDS",
    stockout: "نفاد مواد",
    issue_delay: "تأخر صرف",
    no_wo: "صرف بلا أمر عمل",
    variance: "فروقات جرد",
    location: "موقع تخزين مجهول",
    idle: "مواد راكدة",
    damage: "تالف أو فاقد",
    return_lag: "تأخر إرجاع فائض الشركة",
    custody_mix: "خلط الشركة مع الأمانات",
    custody_gap: "فرق أمانات الكهرباء",
    custody_return: "أمانات لم تُرجع",
  };

  return (
    <div className="admin-shell">
      <BrandHeader compact />
      <header className="topbar">
        <div>
          <p className="eyebrow">لوحة الأدمن · ERPNext As-Is</p>
          <h1>نتائج التقييمات</h1>
          <p className="meta">
            {stats.count} مشاركة · متوسط النضج العام{" "}
            <strong>{stats.avgOverall.toFixed(1)}</strong> / ٥
          </p>
        </div>
        <div className="topbar-actions">
          <select
            className="admin-select"
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
          >
            <option value="all">كل الوحدات</option>
            {ASSESSMENT_MODULES.map((m) => (
              <option key={m.id} value={m.id}>
                وحدة {m.title}
              </option>
            ))}
          </select>
          <button type="button" className="btn-ghost" onClick={load}>
            تحديث
          </button>
          <button type="button" className="btn-ghost" onClick={logout}>
            خروج
          </button>
        </div>
      </header>

      {loading && <p className="loading-inline">جاري التحميل…</p>}
      {error && <p className="form-error">{error}</p>}

      {!loading && (
        <>
          <div className="admin-kpis">
            <div className="kpi">
              <span>عدد المشاركين</span>
              <strong>{stats.count}</strong>
            </div>
            <div className="kpi">
              <span>متوسط النضج</span>
              <strong>{stats.avgOverall.toFixed(1)}</strong>
            </div>
            <div className="kpi">
              <span>الدورات المغطاة</span>
              <strong>{moduleProcesses.length}</strong>
            </div>
          </div>

          <section className="dim-bars">
            <h2>متوسط النضج حسب الدورة</h2>
            {stats.byProcess.map(({ process, avg, responses }) => (
              <div key={process.id} className="dim-row admin-process-row">
                <span>
                  {String(process.code).padStart(2, "0")} · {process.title}
                  <small> ({responses} رد)</small>
                </span>
                <div className="bar">
                  <i style={{ width: `${(avg / 5) * 100}%` }} />
                </div>
                <b>{avg > 0 ? avg.toFixed(1) : "—"}</b>
              </div>
            ))}
          </section>

          <section className="dim-bars">
            <h2>أكثر المشاكل الحالية تكراراً</h2>
            <div className="problems-heatmap">
              {stats.byProcess.map(({ process, problemCounts }) => {
                const top = Object.entries(problemCounts)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 3);
                return (
                  <div key={process.id} className="problem-card">
                    <strong>{process.title}</strong>
                    {top.length === 0 ? (
                      <em className="muted">لا بيانات بعد</em>
                    ) : (
                      <ul>
                        {top.map(([id, n]) => (
                          <li key={id}>
                            {problemLabels[id] ?? id} <b>×{n}</b>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="process-scores">
            <h2>سجل المشاركات</h2>
            {rows.length === 0 ? (
              <p className="meta">لا توجد مشاركات محفوظة بعد لهذه الوحدة.</p>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>التاريخ</th>
                      <th>الوحدة</th>
                      <th>الاسم</th>
                      <th>الإدارة</th>
                      <th>الدور</th>
                      <th>النضج</th>
                      <th>المكتمل</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => {
                      const role =
                        allRoles().find((x) => x.id === r.role)?.label ?? r.role;
                      const level =
                        MATURITY_LABELS[
                          r.overallLevel as 1 | 2 | 3 | 4 | 5
                        ] ?? MATURITY_LABELS[1];
                      return (
                        <tr key={r.id}>
                          <td>
                            {new Date(r.createdAt).toLocaleString("ar-SA")}
                          </td>
                          <td>{r.moduleTitle}</td>
                          <td>{r.respondentName}</td>
                          <td>{r.department}</td>
                          <td>{role}</td>
                          <td style={{ color: level.color, fontWeight: 700 }}>
                            {r.overallScore.toFixed(1)}
                          </td>
                          <td>
                            {r.completedCount}/{r.totalProcesses}
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn-ghost"
                              onClick={() => setSelectedId(r.id)}
                            >
                              تفاصيل
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}

      {detail && (
        <div className="panel-overlay" role="dialog" aria-modal="true">
          <div className="panel">
            <header className="panel-header">
              <div>
                <span className="code">{detail.moduleTitle}</span>
                <h2>{detail.respondentName}</h2>
                <p>
                  {detail.department} · {detail.roleLabel} · نضج{" "}
                  {detail.overallScore.toFixed(1)}
                </p>
              </div>
              <button
                type="button"
                className="icon-close"
                onClick={() => setSelectedId(null)}
                aria-label="إغلاق"
              >
                ×
              </button>
            </header>

            <div className="panel-body">
            <ul className="detail-scores">
              {detail.processScores
                .slice()
                .sort((a, b) => a.processCode - b.processCode)
                .map((p) => {
                  const m =
                    MATURITY_LABELS[p.level as 1 | 2 | 3 | 4 | 5] ??
                    MATURITY_LABELS[1];
                  let problems: string[] = [];
                  try {
                    problems = JSON.parse(p.problemsJson);
                  } catch {
                    problems = [];
                  }
                  const processAnswers = detail.answers?.[p.processId] ?? {};
                  const asIs = processAnswers[`${p.processId}_as_is`];
                  const asIsText = typeof asIs === "string" ? asIs.trim() : "";
                  const notes = processAnswers[`${p.processId}_notes`];
                  const notesText = typeof notes === "string" ? notes.trim() : "";
                  return (
                    <li key={p.id}>
                      <div>
                        <strong>
                          {String(p.processCode).padStart(2, "0")} ·{" "}
                          {p.processTitle}
                        </strong>
                        <small>
                          {p.complete ? "مكتمل" : "غير مكتمل"}
                          {problems.length > 0 &&
                            problems[0] !== "none" &&
                            ` · مشاكل: ${problems
                              .map((id) => problemLabels[id] ?? id)
                              .join("، ")}`}
                        </small>
                        {asIsText && (
                          <p className="detail-narrative">
                            <b>وصف الدورة / الدور:</b> {asIsText}
                          </p>
                        )}
                        {notesText && (
                          <p className="detail-narrative">
                            <b>ملاحظة:</b> {notesText}
                          </p>
                        )}
                      </div>
                      <em style={{ color: m.color }}>
                        {p.complete ? p.average.toFixed(1) : "—"}
                      </em>
                    </li>
                  );
                })}
            </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
