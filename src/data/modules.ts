import type { AssessmentProcess, RoleOption } from "@/data/common";
import { HR_PROCESSES, ROLES as HR_ROLES } from "@/data/hr-processes";
import {
  PROCUREMENT_PROCESSES,
  PROCUREMENT_ROLES,
} from "@/data/procurement-processes";

export type ModuleId = "hr" | "procurement";

export interface AssessmentModule {
  id: ModuleId;
  title: string;
  titleEn: string;
  active: true;
  description: string;
  processes: AssessmentProcess[];
  roles: RoleOption[];
}

export const ASSESSMENT_MODULES: AssessmentModule[] = [
  {
    id: "hr",
    title: "الموارد البشرية",
    titleEn: "Human Resources",
    active: true,
    description: "التوظيف، العقود، الحضور، الإجازات، الرواتب، العهد، التقييم، وإنهاء الخدمة",
    processes: HR_PROCESSES,
    roles: HR_ROLES,
  },
  {
    id: "procurement",
    title: "المشتريات",
    titleEn: "Procurement",
    active: true,
    description:
      "طلب الشراء، الاعتماد، عروض الأسعار، أمر الشراء، الاستلام، الفواتير، والموردين",
    processes: PROCUREMENT_PROCESSES,
    roles: PROCUREMENT_ROLES,
  },
];

export function getModule(id: ModuleId | string | undefined): AssessmentModule {
  return (
    ASSESSMENT_MODULES.find((m) => m.id === id) ?? ASSESSMENT_MODULES[0]
  );
}

export function allRoles(): RoleOption[] {
  const map = new Map<string, RoleOption>();
  for (const m of ASSESSMENT_MODULES) {
    for (const r of m.roles) map.set(r.id, r);
  }
  return [...map.values()];
}
