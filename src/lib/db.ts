import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  schemaReady?: Promise<void>;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/** يضمن وجود الجداول على SQLite (مفيد لـ /tmp على Vercel) */
export async function ensureDb() {
  if (!globalForPrisma.schemaReady) {
    globalForPrisma.schemaReady = (async () => {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Submission" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "moduleId" TEXT NOT NULL DEFAULT 'hr',
          "moduleTitle" TEXT NOT NULL DEFAULT 'الموارد البشرية',
          "respondentName" TEXT NOT NULL,
          "department" TEXT NOT NULL,
          "role" TEXT NOT NULL,
          "overallScore" REAL NOT NULL DEFAULT 0,
          "overallLevel" INTEGER NOT NULL DEFAULT 1,
          "completedCount" INTEGER NOT NULL DEFAULT 0,
          "totalProcesses" INTEGER NOT NULL DEFAULT 0,
          "resultJson" TEXT NOT NULL,
          "answersJson" TEXT NOT NULL,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);
      await prisma.$executeRawUnsafe(
        `CREATE INDEX IF NOT EXISTS "Submission_moduleId_idx" ON "Submission"("moduleId")`
      );
      await prisma.$executeRawUnsafe(
        `CREATE INDEX IF NOT EXISTS "Submission_createdAt_idx" ON "Submission"("createdAt")`
      );
      await prisma.$executeRawUnsafe(
        `CREATE INDEX IF NOT EXISTS "Submission_department_idx" ON "Submission"("department")`
      );
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "ProcessScore" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "submissionId" TEXT NOT NULL,
          "processId" TEXT NOT NULL,
          "processCode" INTEGER NOT NULL,
          "processTitle" TEXT NOT NULL,
          "average" REAL NOT NULL,
          "level" INTEGER NOT NULL,
          "complete" BOOLEAN NOT NULL,
          "problemsJson" TEXT NOT NULL DEFAULT '[]',
          CONSTRAINT "ProcessScore_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission" ("id") ON DELETE CASCADE ON UPDATE CASCADE
        )
      `);
      await prisma.$executeRawUnsafe(
        `CREATE INDEX IF NOT EXISTS "ProcessScore_processId_idx" ON "ProcessScore"("processId")`
      );
      await prisma.$executeRawUnsafe(
        `CREATE INDEX IF NOT EXISTS "ProcessScore_submissionId_idx" ON "ProcessScore"("submissionId")`
      );
    })();
  }
  await globalForPrisma.schemaReady;
}
