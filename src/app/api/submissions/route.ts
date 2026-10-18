import { NextResponse } from "next/server";
import { allRoles, getModule } from "@/data/modules";
import { ensureDb, prisma } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { scoreAssessment, type Answers } from "@/lib/scoring";

export async function POST(req: Request) {
  try {
    await ensureDb();
    const body = await req.json();
    const {
      respondentName,
      department,
      role,
      answers,
      moduleId = "hr",
      moduleTitle,
    } = body as {
      respondentName?: string;
      department?: string;
      role?: string;
      answers?: Record<string, Answers>;
      moduleId?: string;
      moduleTitle?: string;
    };

    if (!respondentName?.trim() || !department?.trim() || !role || !answers) {
      return NextResponse.json(
        { error: "بيانات المشارك أو الإجابات ناقصة" },
        { status: 400 }
      );
    }

    const mod = getModule(moduleId);
    if (!mod.roles.some((r) => r.id === role) && !allRoles().some((r) => r.id === role)) {
      return NextResponse.json({ error: "دور غير صالح" }, { status: 400 });
    }

    const result = scoreAssessment(answers, mod.processes);
    if (result.completedCount === 0) {
      return NextResponse.json(
        { error: "أكمل دورة واحدة على الأقل قبل الإرسال" },
        { status: 400 }
      );
    }

    const processScoresData = result.processes.map((p) => {
      const processAnswers = answers[p.processId] ?? {};
      const problemsKey = `${p.processId}_problems`;
      const problems = processAnswers[problemsKey] ?? [];
      return {
        processId: p.processId,
        processCode: p.code,
        processTitle: p.title,
        average: p.average,
        level: p.level,
        complete: p.complete,
        problemsJson: JSON.stringify(problems),
      };
    });

    const submission = await prisma.submission.create({
      data: {
        moduleId: mod.id,
        moduleTitle: moduleTitle?.trim() || mod.title,
        respondentName: respondentName.trim(),
        department: department.trim(),
        role,
        overallScore: result.overall,
        overallLevel: result.level,
        completedCount: result.completedCount,
        totalProcesses: result.totalProcesses,
        resultJson: JSON.stringify(result),
        answersJson: JSON.stringify(answers),
        processScores: { create: processScoresData },
      },
      include: { processScores: true },
    });

    return NextResponse.json({
      id: submission.id,
      message: "تم حفظ التقييم في قاعدة البيانات",
      overallScore: submission.overallScore,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "فشل حفظ التقييم" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  await ensureDb();
  const { searchParams } = new URL(req.url);
  const moduleId = searchParams.get("moduleId") || undefined;
  const mod = moduleId ? getModule(moduleId) : null;

  const submissions = await prisma.submission.findMany({
    where: moduleId ? { moduleId } : undefined,
    orderBy: { createdAt: "desc" },
    include: { processScores: true },
  });

  return NextResponse.json({
    submissions,
    processesCatalog: (mod?.processes ?? []).map((p) => ({
      id: p.id,
      code: p.code,
      title: p.title,
    })),
  });
}
