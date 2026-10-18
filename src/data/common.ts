export type MaturityLevel = 1 | 2 | 3 | 4 | 5;

export type QuestionType = "single" | "multi" | "scale" | "text";

export interface Option {
  id: string;
  label: string;
  score?: number;
}

export interface Question {
  id: string;
  dimension: "people" | "process" | "technology" | "data" | "control" | "problems";
  text: string;
  type: QuestionType;
  options?: Option[];
  required?: boolean;
  placeholder?: string;
  helpText?: string;
}

export interface AssessmentProcess {
  id: string;
  code: number;
  title: string;
  subtitle: string;
  description: string;
  steps: string[];
  questions: Question[];
}

export interface RoleOption {
  id: string;
  label: string;
  hint: string;
}

export const SOP_HELP =
  "SOP تعني Standard Operating Procedure — أي «إجراءات العمل القياسية»: وثيقة مكتوبة تشرح خطوة بخطوة كيف تُنفَّذ العملية (من يبدأها، من يعتمدها، وما النماذج المطلوبة). إن لم يكن لديكم ملف مكتوب ومعتمد، فالإجابة غالباً «لا يوجد توثيق» أو «معرفة شفوية».";

export const TOOL_OPTIONS: Option[] = [
  { id: "manual", label: "يدوي بالكامل (ورق / واتساب / بريد)", score: 1 },
  { id: "excel", label: "جداول Excel / ملفات مشتركة", score: 2 },
  { id: "partial", label: "نظام جزئي + عمل يدوي مكمل", score: 3 },
  { id: "system", label: "نظام متخصص متكامل نسبياً", score: 4 },
  { id: "integrated", label: "نظام متكامل مع باقي الإدارات", score: 5 },
];

export const DOC_OPTIONS: Option[] = [
  { id: "none", label: "لا يوجد توثيق رسمي", score: 1 },
  { id: "informal", label: "معرفة شفوية / تعتمد على أشخاص", score: 2 },
  { id: "partial", label: "إجراءات جزئية غير محدّثة دائماً", score: 3 },
  { id: "documented", label: "إجراءات مكتوبة ومعتمدة", score: 4 },
  { id: "managed", label: "إجراءات محدثة مع مراجعة دورية", score: 5 },
];

export const ROLE_CLARITY: Option[] = [
  { id: "unclear", label: "غير واضحة — تداخل أو تأخير متكرر", score: 1 },
  { id: "partial", label: "واضحة جزئياً حسب الأشخاص", score: 2 },
  { id: "mostly", label: "واضحة في معظم الحالات", score: 3 },
  { id: "defined", label: "محددة في مصفوفة صلاحيات", score: 4 },
  { id: "enforced", label: "محددة ومطبقة ومراقبة", score: 5 },
];

export const DATA_QUALITY: Option[] = [
  { id: "poor", label: "بيانات ناقصة أو متعارضة كثيراً", score: 1 },
  { id: "manual", label: "تعتمد على إدخال يدوي متكرر", score: 2 },
  { id: "ok", label: "مقبولة مع أخطاء متفرقة", score: 3 },
  { id: "good", label: "جيدة ومتاحة عند الحاجة", score: 4 },
  { id: "trusted", label: "مصدر واحد موثوق (Single Source of Truth)", score: 5 },
];

export const CONTROL_OPTIONS: Option[] = [
  { id: "none", label: "لا مسار موافقات واضح / لا أثر تدقيق", score: 1 },
  { id: "informal", label: "موافقات شفهية أو عبر واتساب", score: 2 },
  { id: "email", label: "موافقات بريدية بدون تتبع منهجي", score: 3 },
  { id: "workflow", label: "مسار موافقات موثق في نظام", score: 4 },
  { id: "audit", label: "موافقات + سجل تدقيق كامل", score: 5 },
];

export const HR_PROBLEMS: Option[] = [
  { id: "delays", label: "تأخير في إنجاز الطلبات" },
  { id: "rework", label: "أخطاء متكررة أو إعادة عمل" },
  { id: "visibility", label: "صعوبة معرفة حالة الطلب أين وصل" },
  { id: "compliance", label: "مشاكل امتثال (قوى / حماية أجور / عقود)" },
  { id: "handoff", label: "تعثر التسليم بين الإدارات أو الأقسام" },
  { id: "reporting", label: "صعوبة استخراج تقارير دقيقة بسرعة" },
  { id: "duplicate", label: "إدخال نفس البيانات أكثر من مرة" },
  { id: "none", label: "لا توجد مشاكل جوهرية حالياً" },
];

export const PROCUREMENT_PROBLEMS: Option[] = [
  { id: "delays", label: "تأخير في إنجاز طلبات الشراء" },
  { id: "rework", label: "أخطاء متكررة أو إعادة عمل (كميات/مواصفات)" },
  { id: "visibility", label: "صعوبة معرفة حالة الطلب / أمر الشراء" },
  { id: "budget", label: "مشاكل ميزانية أو اعتماد مالي غير واضح" },
  { id: "supplier", label: "تأخير أو تعثر من الموردين" },
  { id: "pricing", label: "صعوبة مقارنة الأسعار أو فروقات غير مبررة" },
  { id: "handoff", label: "تعثر التسليم بين المشتريات والمخازن/المالية" },
  { id: "reporting", label: "صعوبة استخراج تقارير المشتريات والموردين" },
  { id: "duplicate", label: "إدخال نفس البيانات أكثر من مرة" },
  { id: "none", label: "لا توجد مشاكل جوهرية حالياً" },
];

export const MATURITY_LABELS: Record<
  MaturityLevel,
  { ar: string; en: string; color: string }
> = {
  1: { ar: "أولي / عشوائي", en: "Initial", color: "#b45309" },
  2: { ar: "متكرر جزئياً", en: "Repeatable", color: "#c2410c" },
  3: { ar: "مُعرَّف", en: "Defined", color: "#0f766e" },
  4: { ar: "مُدار", en: "Managed", color: "#0369a1" },
  5: { ar: "مُحسَّن", en: "Optimizing", color: "#15803d" },
};

export const DIMENSION_LABELS: Record<string, string> = {
  people: "الأشخاص والصلاحيات",
  process: "الإجراءات",
  technology: "التقنية والأدوات",
  data: "البيانات",
  control: "الضوابط والامتثال",
  problems: "مشاكل حالية",
};

export function commonQuestions(
  processId: string,
  extras: Question[] = [],
  problemsOptions: Option[] = HR_PROBLEMS,
  notesPlaceholder =
    "مثال: الطلب يتأخر عند المدير أسبوعين، أو الرصيد غير محدّث…"
): Question[] {
  return [
    {
      id: `${processId}_as_is`,
      dimension: "process",
      text: "صف الدورة الحالية كما تحدث فعلياً عندكم (اختياري)",
      type: "text",
      helpText:
        "اكتب خطوات الدورة من البداية حتى النهاية كما تراها. إذا لا تعرف المسار كاملاً، اكتب دورك أنت في هذه الدورة وأين تقع مشاركتك (مثلاً: أبدأ الطلب فقط، أو أوافق، أو أنفّذ في النهاية).",
      placeholder:
        "مثال: الإدارة تطلب عبر واتساب → المشتريات تتواصل مع المورد → يتم الاستلام…\nأو: دوري اعتماد الطلب فقط بعد وصوله إليّ.",
    },
    {
      id: `${processId}_tool`,
      dimension: "technology",
      text: "كيف تُنفَّذ هذه الدورة حالياً؟",
      type: "single",
      required: true,
      options: TOOL_OPTIONS,
    },
    {
      id: `${processId}_doc`,
      dimension: "process",
      text: "ما مستوى توثيق إجراءات العمل القياسية (SOP) لهذه الدورة؟",
      type: "single",
      required: true,
      options: DOC_OPTIONS,
      helpText: SOP_HELP,
    },
    {
      id: `${processId}_roles`,
      dimension: "people",
      text: "ما مدى وضوح الأدوار والمسؤوليات والصلاحيات؟",
      type: "single",
      required: true,
      options: ROLE_CLARITY,
    },
    {
      id: `${processId}_data`,
      dimension: "data",
      text: "ما تقييمك لجودة واكتمال البيانات المرتبطة بهذه الدورة؟",
      type: "single",
      required: true,
      options: DATA_QUALITY,
    },
    {
      id: `${processId}_control`,
      dimension: "control",
      text: "كيف تتم الموافقات والضوابط ومسار التدقيق؟",
      type: "single",
      required: true,
      options: CONTROL_OPTIONS,
    },
    {
      id: `${processId}_cycle`,
      dimension: "process",
      text: "كم يستغرق إنجاز طلب نموذجي من البداية حتى الإغلاق؟",
      type: "single",
      required: true,
      options: [
        { id: "d1", label: "أقل من يوم", score: 5 },
        { id: "d2_3", label: "٢–٣ أيام", score: 4 },
        { id: "w1", label: "حوالي أسبوع", score: 3 },
        { id: "w2", label: "أسبوعان أو أكثر", score: 2 },
        { id: "unclear", label: "غير محدد / يختلف كثيراً", score: 1 },
      ],
    },
    {
      id: `${processId}_problems`,
      dimension: "problems",
      text: "ما أبرز المشاكل الحالية في هذه الدورة؟ (يمكن اختيار أكثر من خيار)",
      type: "multi",
      required: true,
      options: problemsOptions,
    },
    ...extras,
    {
      id: `${processId}_notes`,
      dimension: "problems",
      text: "صف مشكلة حالية أو مثالاً واقعياً تود توثيقه للإدارة",
      type: "text",
      placeholder: notesPlaceholder,
    },
  ];
}
