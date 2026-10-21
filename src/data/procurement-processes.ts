import {
  commonQuestions,
  PROCUREMENT_PROBLEMS,
  type AssessmentProcess,
  type RoleOption,
} from "@/data/common";

export const PROCUREMENT_ROLES: RoleOption[] = [
  {
    id: "purchase_manager",
    label: "مدير مشتريات",
    hint: "سياسات الشراء والاعتمادات والموردين",
  },
  {
    id: "buyer",
    label: "أخصائي / مندوب مشتريات",
    hint: "تنفيذ طلبات الشراء وأوامر الشراء يومياً",
  },
  {
    id: "requester",
    label: "طالب الشراء (إدارة مستفيدة)",
    hint: "رفع الاحتياج ومتابعة التوريد",
  },
  {
    id: "dept_manager",
    label: "مدير إدارة طالبة",
    hint: "اعتماد الاحتياج والمواصفات والكميات",
  },
  {
    id: "warehouse",
    label: "مخازن / استلام",
    hint: "استلام المواد والفحص مقابل أمر الشراء",
  },
  {
    id: "finance_ap",
    label: "مالية / حسابات موردين",
    hint: "الفواتير والمطابقة والدفع",
  },
  {
    id: "employee",
    label: "موظف",
    hint: "مشارك في الطلب أو المتابعة الميدانية",
  },
];

const pq = (
  processId: string,
  topic: string,
  extras: Parameters<typeof commonQuestions>[1] = []
) =>
  commonQuestions(
    processId,
    extras,
    PROCUREMENT_PROBLEMS,
    "مثال: أمر الشراء يتأخر عند الاعتماد، أو الاستلام لا يطابق المواصفات…",
    topic
  );

export const PROCUREMENT_PROCESSES: AssessmentProcess[] = [
  {
    id: "pr_request",
    code: 1,
    title: "طلب الشراء",
    subtitle: "من الاحتياج حتى رفع طلب شراء رسمي",
    description:
      "تقييم كيف تُرفع حالياً طلبات الشراء من الإدارات: المواصفات، الكميات، المبرر، والمرفقات.",
    steps: ["تحديد الاحتياج", "تعبئة الطلب", "إرفاق المواصفات", "إرسال للمشتريات"],
    questions: pq("pr_request", "طلب الشراء", [
      {
        id: "pr_request_channel",
        dimension: "technology",
        text: "ما القناة الأساسية لرفع طلب الشراء؟",
        type: "single",
        required: true,
        options: [
          { id: "whatsapp", label: "واتساب / اتصال شفهي", score: 1 },
          { id: "email", label: "بريد إلكتروني", score: 2 },
          { id: "paper", label: "نموذج ورقي", score: 2 },
          { id: "excel", label: "نموذج Excel / نموذج مشترك", score: 3 },
          { id: "system", label: "طلب شراء في نظام (PR)", score: 5 },
        ],
      },
    ]),
  },
  {
    id: "pr_approval",
    code: 2,
    title: "اعتماد طلبات الشراء",
    subtitle: "الصلاحيات، الميزانية، ومسار الموافقات",
    description:
      "فحص كيف تُعتمد طلبات الشراء حسب القيمة والصلاحيات وارتباطها بالميزانية قبل التنفيذ.",
    steps: ["مراجعة الطلب", "التحقق من الميزانية", "اعتماد المدير", "تحويل للتنفيذ"],
    questions: pq("pr_approval", "اعتماد طلبات الشراء", [
      {
        id: "pr_approval_budget",
        dimension: "control",
        text: "هل يُربط الاعتماد بالميزانية أو مراكز التكلفة قبل الموافقة؟",
        type: "single",
        required: true,
        options: [
          { id: "no", label: "لا يوجد ربط بالميزانية", score: 1 },
          { id: "manual", label: "تحقق يدوي غير منتظم", score: 2 },
          { id: "checklist", label: "تحقق يدوي وفق قائمة معتمدة", score: 3 },
          { id: "partial", label: "ربط جزئي في ملف أو نظام", score: 4 },
          { id: "enforced", label: "لا اعتماد بدون توفر ميزانية في النظام", score: 5 },
        ],
      },
    ]),
  },
  {
    id: "rfq",
    code: 3,
    title: "عروض الأسعار والمقارنة",
    subtitle: "طلب عروض، المقارنة، واختيار المورد",
    description:
      "تقييم دورة طلب عروض الأسعار (RFQ) ومقارنة العروض وتوثيق سبب اختيار المورد.",
    steps: ["طلب عروض", "استلام العروض", "المقارنة الفنية/المالية", "اختيار المورد"],
    questions: pq("rfq", "عروض الأسعار والمقارنة", [
      {
        id: "rfq_compare",
        dimension: "process",
        text: "كيف تُوثَّق مقارنة العروض واختيار المورد؟",
        type: "single",
        required: true,
        options: [
          { id: "verbal", label: "شفهي بدون توثيق", score: 1 },
          { id: "chat", label: "مراسلات واتساب/بريد فقط", score: 2 },
          { id: "excel", label: "جدول مقارنة Excel", score: 3 },
          { id: "form", label: "نموذج مقارنة معتمد", score: 4 },
          { id: "system", label: "مقارنة مسجّلة في النظام مع أثر تدقيق", score: 5 },
        ],
      },
    ]),
  },
  {
    id: "purchase_order",
    code: 4,
    title: "أمر الشراء",
    subtitle: "إصدار أمر الشراء للمورد ومتابعته",
    description:
      "فحص إصدار أوامر الشراء (PO): الشروط، الأسعار، الكميات، الاعتماد، وإرسالها للمورد.",
    steps: ["إنشاء أمر الشراء", "الاعتماد", "الإرسال للمورد", "تأكيد الاستلام من المورد"],
    questions: pq("purchase_order", "أمر الشراء", [
      {
        id: "po_format",
        dimension: "technology",
        text: "ما شكل أمر الشراء الرسمي لدى الشركة؟",
        type: "single",
        required: true,
        options: [
          { id: "verbal", label: "طلب شفهي / واتساب للمورد", score: 1 },
          { id: "email", label: "إيميل غير موحّد", score: 2 },
          { id: "word", label: "نموذج Word/PDF يُعدّ يدوياً", score: 3 },
          { id: "numbered", label: "أمر شراء مرقّم من ملف مركزي", score: 4 },
          { id: "system", label: "أمر شراء من النظام مرتبط بالطلب والعرض", score: 5 },
        ],
      },
    ]),
  },
  {
    id: "goods_receipt",
    code: 5,
    title: "الاستلام والفحص",
    subtitle: "استلام المواد مقابل أمر الشراء",
    description:
      "تقييم استلام المواد/الخدمات في الموقع أو المخزن، والفحص مقابل المواصفات والكميات في أمر الشراء.",
    steps: ["إشعار وصول", "الاستلام", "الفحص", "تأكيد الكميات"],
    questions: pq("goods_receipt", "الاستلام والفحص", [
      {
        id: "grn_match",
        dimension: "control",
        text: "هل يُطابق الاستلام أمر الشراء قبل الإقفال؟",
        type: "single",
        required: true,
        options: [
          { id: "no", label: "لا مطابقة منتظمة", score: 1 },
          { id: "spot", label: "مطابقة عشوائية حسب الحالة", score: 2 },
          { id: "paper", label: "محضر استلام ورقي يُطابق يدوياً", score: 3 },
          { id: "partial", label: "تسجيل استلام في ملف/نظام جزئي", score: 4 },
          { id: "system", label: "سند استلام (GRN) مربوط بأمر الشراء في النظام", score: 5 },
        ],
      },
    ]),
  },
  {
    id: "supplier_invoice",
    code: 6,
    title: "فاتورة المورد والمطابقة",
    subtitle: "المطابقة الثلاثية والترحيل للمالية",
    description:
      "فحص دورة فاتورة المورد: المطابقة مع أمر الشراء والاستلام، ثم الاعتماد والترحيل للدفع.",
    steps: ["استلام الفاتورة", "المطابقة", "الاعتماد", "الترحيل للدفع"],
    questions: pq("supplier_invoice", "فاتورة المورد والمطابقة", [
      {
        id: "invoice_3way",
        dimension: "control",
        text: "ما مستوى المطابقة بين أمر الشراء والاستلام والفاتورة؟",
        type: "single",
        required: true,
        options: [
          { id: "none", label: "لا مطابقة منهجية", score: 1 },
          { id: "invoice_only", label: "مراجعة الفاتورة فقط", score: 2 },
          { id: "manual_2", label: "مطابقة يدوية لأمرين (PO + فاتورة)", score: 3 },
          { id: "manual_3", label: "مطابقة ثلاثية يدوية منتظمة", score: 4 },
          { id: "system", label: "مطابقة ثلاثية في النظام قبل السماح بالدفع", score: 5 },
        ],
      },
    ]),
  },
  {
    id: "suppliers",
    code: 7,
    title: "إدارة الموردين",
    subtitle: "تسجيل الموردين، التقييم، والقوائم المعتمدة",
    description:
      "تقييم سجل الموردين: البيانات، الاعتماد، التقييم بعد التوريد، والقائمة السوداء إن وُجدت.",
    steps: ["تسجيل المورد", "الاعتماد", "التقييم", "تحديث السجل"],
    questions: pq("suppliers", "إدارة الموردين", [
      {
        id: "supplier_master",
        dimension: "data",
        text: "أين يوجد سجل الموردين الرئيسي؟",
        type: "single",
        required: true,
        options: [
          { id: "memory", label: "معرفة أشخاص / بدون سجل", score: 1 },
          { id: "scattered", label: "ملفات واتساب وإيميلات متناثرة", score: 2 },
          { id: "excel", label: "ملف Excel للموردين", score: 3 },
          { id: "folder", label: "مجلدات رقمية لكل مورد", score: 4 },
          { id: "system", label: "سجل موردين موحد في النظام", score: 5 },
        ],
      },
    ]),
  },
  {
    id: "delivery_followup",
    code: 8,
    title: "متابعة التوريد والتأخير",
    subtitle: "تتبع مواعيد التسليم والتنبيهات",
    description:
      "فحص كيف تُتابع أوامر الشراء المفتوحة، التأخير عن الموعد، والتنسيق مع الموقع/المخزن.",
    steps: ["جدولة التسليم", "المتابعة", "التنبيه عند التأخير", "الإغلاق"],
    questions: pq("delivery_followup", "متابعة التوريد والتأخير", [
      {
        id: "delivery_tracking",
        dimension: "process",
        text: "كيف تُتابع مواعيد تسليم أوامر الشراء؟",
        type: "single",
        required: true,
        options: [
          { id: "none", label: "لا متابعة منهجية", score: 1 },
          { id: "memory", label: "متابعة شخصية حسب التذكر", score: 2 },
          { id: "excel", label: "متابعة عبر Excel", score: 3 },
          { id: "alerts", label: "تذكيرات تقويم / بريد", score: 4 },
          { id: "system", label: "لوحة أوامر مفتوحة وتنبيهات من النظام", score: 5 },
        ],
      },
    ]),
  },
];
