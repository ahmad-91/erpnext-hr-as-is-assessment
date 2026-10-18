import { NextResponse } from "next/server";
import { ensureDb, prisma } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { ROLES } from "@/data/hr-processes";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  await ensureDb();
  const { id } = await ctx.params;
  const submission = await prisma.submission.findUnique({
    where: { id },
    include: { processScores: true },
  });

  if (!submission) {
    return NextResponse.json({ error: "غير موجود" }, { status: 404 });
  }

  const roleLabel = ROLES.find((r) => r.id === submission.role)?.label ?? submission.role;

  return NextResponse.json({
    ...submission,
    roleLabel,
    answers: JSON.parse(submission.answersJson),
    result: JSON.parse(submission.resultJson),
  });
}
