import type { AssessmentProcess, RoleOption } from "@/data/common";
import { HR_PROCESSES, ROLES as HR_ROLES } from "@/data/hr-processes";
import {
  PROCUREMENT_PROCESSES,
  PROCUREMENT_ROLES,
} from "@/data/procurement-processes";
import {
  WORK_ORDER_PROCESSES,
  WORK_ORDER_ROLES,
} from "@/data/work-order-processes";
import {
  WAREHOUSE_PROCESSES,
  WAREHOUSE_ROLES,
} from "@/data/warehouse-processes";

export type ModuleId = "hr" | "procurement" | "work-orders" | "warehouse";

export interface AssessmentModule {
  id: ModuleId;
  title: string;
  titleEn: string;
  active: true;
  description: string;
  /** المسار العام للمشاركة — مثال: /hr */
  path: string;
  processes: AssessmentProcess[];
  roles: RoleOption[];
}

export const ASSESSMENT_MODULES: AssessmentModule[] = [
  {
    id: "hr",
    title: "الموارد البشرية",
    titleEn: "Human Resources",
    active: true,
    path: "/hr",
    description: "التوظيف، العقود، الحضور، الإجازات، الرواتب، العهد، التقييم، وإنهاء الخدمة",
    processes: HR_PROCESSES,
    roles: HR_ROLES,
  },
  {
    id: "procurement",
    title: "المشتريات",
    titleEn: "Procurement",
    active: true,
    path: "/procurement",
    description:
      "طلب الشراء، الاعتماد، عروض الأسعار، أمر الشراء، الاستلام، الفواتير، والموردين",
    processes: PROCUREMENT_PROCESSES,
    roles: PROCUREMENT_ROLES,
  },
  {
    id: "work-orders",
    title: "أوامر العمل",
    titleEn: "Work Orders",
    active: true,
    path: "/work-orders",
    description:
      "دورة أمر العمل للعقد الموحد: UDS، التصاريح، التنفيذ، الإقفال، المستخلص، الفاتورة، التحصيل، العهدة والطوارئ",
    processes: WORK_ORDER_PROCESSES,
    roles: WORK_ORDER_ROLES,
  },
  {
    id: "warehouse",
    title: "المستودعات",
    titleEn: "Warehouses",
    active: true,
    path: "/warehouse",
    description:
      "مخازن الشركة ومخازن أمانات الكهرباء: الاستلام، الفصل، الصرف على أمر العمل، الإرجاع، والجرد",
    processes: WAREHOUSE_PROCESSES,
    roles: WAREHOUSE_ROLES,
  },
];

export function isModuleId(id: string): id is ModuleId {
  return ASSESSMENT_MODULES.some((m) => m.id === id);
}

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
