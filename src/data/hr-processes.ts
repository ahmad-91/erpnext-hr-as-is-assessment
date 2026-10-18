export type RoleId =
  | "hr_manager"
  | "hr_specialist"
  | "dept_manager"
  | "supervisor"
  | "employee"
  | "finance"
  | "custody";

export type MaturityLevel = 1 | 2 | 3 | 4 | 5;

export type QuestionType = "single" | "multi" | "scale" | "text";

export interface Option {
  id: string;
  label: string;
  /** Score contribution 1–5 for maturity (optional for text) */
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
  /** شرح يظهر تحت السؤال للمصطلحات (مثل SOP) */
  helpText?: string;
}

export interface HrProcess {
  id: string;
  code: number;
  title: string;
  subtitle: string;
  description: string;
  steps: string[];
  questions: Question[];
}

export const ROLES: { id: RoleId; label: string; hint: string }[] = [
  {
    id: "hr_manager",
    label: "مدير موارد بشرية",
    hint: "نظرة شاملة على السياسات والعمليات",
  },
  {
    id: "hr_specialist",
    label: "أخصائي / مشرف موارد بشرية",
    hint: "تنفيذ يومي للدورات",
  },
  {
    id: "dept_manager",
    label: "مدير إدارة",
    hint: "موافقات وطلبات وتقييمات الفريق",
  },
  {
    id: "supervisor",
    label: "مشرف قسم",
    hint: "متابعة الحضور والإجازات والأداء",
  },
  {
    id: "employee",
    label: "موظف",
    hint: "تجربة المستخدم النهائية للخدمات",
  },
  {
    id: "finance",
    label: "مالية / رواتب",
    hint: "مسير الرواتب وحماية الأجور",
  },
  {
    id: "custody",
    label: "إدارة العهد / الأصول",
    hint: "صرف العهد واستلامها ومتابعتها",
  },
];

const TOOL_OPTIONS: Option[] = [
  { id: "manual", label: "يدوي بالكامل (ورق / واتساب / بريد)", score: 1 },
  { id: "excel", label: "جداول Excel / ملفات مشتركة", score: 2 },
  { id: "partial", label: "نظام جزئي + عمل يدوي مكمل", score: 3 },
  { id: "system", label: "نظام متخصص متكامل نسبياً", score: 4 },
  { id: "integrated", label: "نظام متكامل مع باقي الإدارات", score: 5 },
];

const DOC_OPTIONS: Option[] = [
  { id: "none", label: "لا يوجد توثيق رسمي", score: 1 },
  { id: "informal", label: "معرفة شفوية / تعتمد على أشخاص", score: 2 },
  { id: "partial", label: "إجراءات جزئية غير محدّثة دائماً", score: 3 },
  { id: "documented", label: "إجراءات مكتوبة ومعتمدة", score: 4 },
  { id: "managed", label: "إجراءات محدثة مع مراجعة دورية", score: 5 },
];

const ROLE_CLARITY: Option[] = [
  { id: "unclear", label: "غير واضحة — تداخل أو تأخير متكرر", score: 1 },
  { id: "partial", label: "واضحة جزئياً حسب الأشخاص", score: 2 },
  { id: "mostly", label: "واضحة في معظم الحالات", score: 3 },
  { id: "defined", label: "محددة في مصفوفة صلاحيات", score: 4 },
  { id: "enforced", label: "محددة ومطبقة ومراقبة", score: 5 },
];

const DATA_QUALITY: Option[] = [
  { id: "poor", label: "بيانات ناقصة أو متعارضة كثيراً", score: 1 },
  { id: "manual", label: "تعتمد على إدخال يدوي متكرر", score: 2 },
  { id: "ok", label: "مقبولة مع أخطاء متفرقة", score: 3 },
  { id: "good", label: "جيدة ومتاحة عند الحاجة", score: 4 },
  { id: "trusted", label: "مصدر واحد موثوق (Single Source of Truth)", score: 5 },
];

const CONTROL_OPTIONS: Option[] = [
  { id: "none", label: "لا مسار موافقات واضح / لا أثر تدقيق", score: 1 },
  { id: "informal", label: "موافقات شفهية أو عبر واتساب", score: 2 },
  { id: "email", label: "موافقات بريدية بدون تتبع منهجي", score: 3 },
  { id: "workflow", label: "مسار موافقات موثق في نظام", score: 4 },
  { id: "audit", label: "موافقات + سجل تدقيق كامل", score: 5 },
];

const CURRENT_PROBLEMS: Option[] = [
  { id: "delays", label: "تأخير في إنجاز الطلبات" },
  { id: "rework", label: "أخطاء متكررة أو إعادة عمل" },
  { id: "visibility", label: "صعوبة معرفة حالة الطلب أين وصل" },
  { id: "compliance", label: "مشاكل امتثال (قوى / حماية أجور / عقود)" },
  { id: "handoff", label: "تعثر التسليم بين الإدارات أو الأقسام" },
  { id: "reporting", label: "صعوبة استخراج تقارير دقيقة بسرعة" },
  { id: "duplicate", label: "إدخال نفس البيانات أكثر من مرة" },
  { id: "none", label: "لا توجد مشاكل جوهرية حالياً" },
];

export const SOP_HELP =
  "SOP تعني Standard Operating Procedure — أي «إجراءات العمل القياسية»: وثيقة مكتوبة تشرح خطوة بخطوة كيف تُنفَّذ العملية (من يبدأها، من يعتمدها، وما النماذج المطلوبة). إن لم يكن لديكم ملف مكتوب ومعتمد، فالإجابة غالباً «لا يوجد توثيق» أو «معرفة شفوية».";

function commonQuestions(processId: string, extras: Question[] = []): Question[] {
  return [
    {
      id: `${processId}_as_is`,
      dimension: "process",
      text: "صف الدورة الحالية كما تحدث فعلياً عندكم (اختياري)",
      type: "text",
      helpText:
        "اكتب خطوات الدورة من البداية حتى النهاية كما تراها. إذا لا تعرف المسار كاملاً، اكتب دورك أنت في هذه الدورة وأين تقع مشاركتك (مثلاً: أبدأ الطلب فقط، أو أوافق، أو أنفّذ في النهاية).",
      placeholder:
        "مثال: الموظف يقدّم طلباً عبر واتساب → المدير يوافق شفهياً → الموارد البشرية تكمل…\nأو: دوري الموافقة فقط بعد ما يوصلني الطلب من الموظف.",
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
      options: CURRENT_PROBLEMS,
    },
    ...extras,
    {
      id: `${processId}_notes`,
      dimension: "problems",
      text: "صف مشكلة حالية أو مثالاً واقعياً تود توثيقه للإدارة",
      type: "text",
      placeholder: "مثال: الطلب يتأخر عند المدير أسبوعين، أو الرصيد غير محدّث…",
    },
  ];
}

export const HR_PROCESSES: HrProcess[] = [
  {
    id: "recruitment",
    code: 1,
    title: "التوظيف والتعيين",
    subtitle: "من طلب التوظيف حتى مباشرة الموظف",
    description:
      "تقييم الدورة الحالية لطلب التوظيف، المقابلات، العرض الوظيفي، عقد العمل، ومباشرة الموظف.",
    steps: [
      "طلب توظيف",
      "مقابلات",
      "عرض وظيفي",
      "عقد عمل",
      "مباشرة الموظف",
    ],
    questions: commonQuestions("recruitment", [
      {
        id: "recruitment_qiwa",
        dimension: "control",
        text: "كيف يتم ربط التعيين بمنصات الامتثال (مثل قوى / أبشر أعمال)؟",
        type: "single",
        required: true,
        options: [
          { id: "manual_late", label: "يدوياً وبعد التعيين بفترة", score: 1 },
          { id: "manual", label: "يدوياً ضمن خطوات التعيين", score: 2 },
          { id: "checklist", label: "قائمة تحقق يدوية منتظمة", score: 3 },
          { id: "partial_sys", label: "جزئياً عبر نظام / تكامل محدود", score: 4 },
          { id: "integrated", label: "متكامل ومتابع آلياً", score: 5 },
        ],
      },
    ]),
  },
  {
    id: "contracts",
    code: 2,
    title: "إدارة عقود الموظفين",
    subtitle: "إصدار، توثيق قوى، تجديد، ومتابعة الانتهاء",
    description:
      "فحص كيفية إصدار العقود، توثيقها وتجديدها عبر قوى، ومتابعة تواريخ الانتهاء.",
    steps: ["إصدار العقد", "توثيق قوى", "تجديد", "متابعة الانتهاء"],
    questions: commonQuestions("contracts", [
      {
        id: "contracts_expiry",
        dimension: "process",
        text: "كيف تُتابع تواريخ انتهاء العقود والتنبيهات؟",
        type: "single",
        required: true,
        options: [
          { id: "none", label: "لا توجد متابعة منهجية", score: 1 },
          { id: "excel", label: "متابعة عبر Excel يدوياً", score: 2 },
          { id: "calendar", label: "تذكيرات تقويم / بريد", score: 3 },
          { id: "system_alert", label: "تنبيهات من نظام HR", score: 4 },
          { id: "auto_workflow", label: "تنبيه + مسار تجديد آلي", score: 5 },
        ],
      },
    ]),
  },
  {
    id: "attendance",
    code: 3,
    title: "الحضور والانصراف",
    subtitle: "الدوام، التأخير، الغياب، والعمل الإضافي",
    description:
      "تقييم تسجيل الدوام واحتساب التأخير والغياب والعمل الإضافي وربطه بالرواتب.",
    steps: ["تسجيل الدوام", "التأخير", "الغياب", "العمل الإضافي"],
    questions: commonQuestions("attendance", [
      {
        id: "attendance_source",
        dimension: "technology",
        text: "ما مصدر بيانات الحضور الأساسي؟",
        type: "single",
        required: true,
        options: [
          { id: "paper", label: "كشف ورقي / توقيع", score: 1 },
          { id: "excel", label: "إدخال يدوي في Excel", score: 2 },
          { id: "device", label: "بصمة / جهاز دون ربط كامل", score: 3 },
          { id: "linked", label: "جهاز مربوط بنظام الحضور", score: 4 },
          { id: "payroll", label: "مربوط مباشرة بمسير الرواتب", score: 5 },
        ],
      },
    ]),
  },
  {
    id: "leave",
    code: 4,
    title: "الإجازات والمغادرات",
    subtitle: "الطلب، موافقة المدير، اعتماد HR، وتحديث الرصيد",
    description:
      "فحص مسار طلب الإجازة من الموظف حتى تحديث الرصيد بعد اعتماد الموارد البشرية.",
    steps: [
      "طلب الإجازة",
      "موافقة المدير",
      "اعتماد الموارد البشرية",
      "تحديث الرصيد",
    ],
    questions: commonQuestions("leave", [
      {
        id: "leave_balance",
        dimension: "data",
        text: "كيف يطّلع الموظف/المدير على رصيد الإجازات؟",
        type: "single",
        required: true,
        options: [
          { id: "ask_hr", label: "سؤال الموارد البشرية فقط", score: 1 },
          { id: "excel", label: "كشف Excel يُحدَّث يدوياً", score: 2 },
          { id: "periodic", label: "تقرير دوري يُرسل للموظفين", score: 3 },
          { id: "self_service", label: "خدمة ذاتية في نظام", score: 4 },
          { id: "realtime", label: "رصيد لحظي مرتبط بالحضور والرواتب", score: 5 },
        ],
      },
    ]),
  },
  {
    id: "payroll",
    code: 5,
    title: "مسير الرواتب",
    subtitle: "الاحتساب، البدلات، الخصومات، السلف، والصرف",
    description:
      "تقييم احتساب الراتب والبدلات والخصومات والسلف، ثم الصرف وملفات حماية الأجور.",
    steps: [
      "احتساب الراتب",
      "البدلات والخصومات",
      "السلف",
      "الصرف",
      "حماية الأجور",
    ],
    questions: commonQuestions("payroll", [
      {
        id: "payroll_wps",
        dimension: "control",
        text: "كيف تُدار ملفات حماية الأجور (WPS)؟",
        type: "single",
        required: true,
        options: [
          { id: "manual_risk", label: "يدوياً مع مخاطر تأخير/أخطاء", score: 1 },
          { id: "excel_bank", label: "تجهيز Excel ثم رفع بنكي", score: 2 },
          { id: "checklist", label: "قائمة تحقق شهرية منتظمة", score: 3 },
          { id: "system_file", label: "توليد الملف من نظام الرواتب", score: 4 },
          { id: "integrated", label: "توليد ومتابعة حالة الامتثال آلياً", score: 5 },
        ],
      },
    ]),
  },
  {
    id: "custody",
    code: 6,
    title: "إدارة العهد",
    subtitle: "صرف العهد، متابعتها، واستلامها عند النقل أو إنهاء الخدمة",
    description:
      "العهد غالباً مسؤولية إدارة مستقلة (إدارة العهد / الأصول / تقنية المعلومات)، لكنها تتقاطع إلزامياً مع الموارد البشرية عند مباشرة الموظف وإخلاء الطرف. هذه البطاقة تقيّم الدورة الحالية للعهد وربطها بـ HR.",
    steps: [
      "طلب / صرف عهدة",
      "تسجيل العهد على الموظف",
      "المتابعة والجرد",
      "الاستلام عند النقل أو إنهاء الخدمة",
    ],
    questions: commonQuestions("custody", [
      {
        id: "custody_owner",
        dimension: "people",
        text: "من الجهة المالكة فعلياً لدورة العهد اليوم؟",
        type: "single",
        required: true,
        options: [
          { id: "hr_only", label: "الموارد البشرية بالكامل", score: 2 },
          { id: "custody_dept", label: "إدارة العهد / الأصول بشكل مستقل", score: 4 },
          { id: "it", label: "تقنية المعلومات (أجهزة وأنظمة)", score: 3 },
          { id: "finance", label: "المالية / المحاسبة", score: 3 },
          { id: "mixed", label: "موزعة بين أكثر من جهة بدون مسار موحّد", score: 1 },
          { id: "integrated", label: "إدارة عهد واضحة مع ربط منظم مع HR", score: 5 },
        ],
      },
      {
        id: "custody_hr_link",
        dimension: "control",
        text: "كيف ترتبط العهد بمباشرة الموظف وإخلاء الطرف؟",
        type: "single",
        required: true,
        options: [
          { id: "none", label: "لا يوجد ربط واضح مع HR", score: 1 },
          { id: "manual", label: "تذكير يدوي / واتساب عند الحاجة", score: 2 },
          { id: "checklist", label: "بند ضمن نموذج إخلاء الطرف الورقي", score: 3 },
          { id: "partial_sys", label: "متابعة في نظام أو ملف لكن غير مربوطة لحظياً", score: 4 },
          { id: "blocking", label: "لا يُغلق إخلاء الطرف قبل استلام العهد في النظام", score: 5 },
        ],
      },
    ]),
  },
  {
    id: "employee_mgmt",
    code: 8,
    title: "إدارة الموظفين",
    subtitle: "البيانات، الترقيات، النقل، المسمى والراتب",
    description:
      "فحص تحديث بيانات الموظفين وعمليات الترقية والنقل وتغيير المسمى والراتب.",
    steps: ["تحديث البيانات", "الترقيات", "النقل", "تغيير المسمى والراتب"],
    questions: commonQuestions("employee_mgmt", [
      {
        id: "employee_master",
        dimension: "data",
        text: "أين يوجد السجل الرئيسي لبيانات الموظف؟",
        type: "single",
        required: true,
        options: [
          { id: "scattered", label: "ملفات متناثرة (ورق + إيميل)", score: 1 },
          { id: "excel", label: "ملف Excel مركزي", score: 2 },
          { id: "hr_folder", label: "مجلدات رقمية حسب الموظف", score: 3 },
          { id: "hris", label: "نظام موارد بشرية", score: 4 },
          { id: "erp_master", label: "سجل رئيسي موحد مرتبط بالرواتب والعقود", score: 5 },
        ],
      },
    ]),
  },
  {
    id: "appraisal",
    code: 9,
    title: "التقييم والتدريب",
    subtitle: "الأداء، الاحتياجات التدريبية، ومتابعة التطوير",
    description:
      "تقييم دورة تقييم الأداء وتحديد الاحتياجات التدريبية ومتابعة خطط التطوير.",
    steps: ["تقييم الأداء", "تحديد الاحتياجات التدريبية", "متابعة التطوير"],
    questions: commonQuestions("appraisal", [
      {
        id: "appraisal_link",
        dimension: "process",
        text: "هل يرتبط التقييم بالترقية / التدريب / المكافآت بشكل منهجي؟",
        type: "single",
        required: true,
        options: [
          { id: "no", label: "لا يوجد ربط واضح", score: 1 },
          { id: "informal", label: "ربط غير رسمي حسب المدير", score: 2 },
          { id: "partial", label: "يربط أحياناً بقرارات محددة", score: 3 },
          { id: "policy", label: "مربوط بسياسة مكتوبة", score: 4 },
          { id: "system", label: "مربوط تشغيلياً في النظام", score: 5 },
        ],
      },
    ]),
  },
  {
    id: "offboarding",
    code: 10,
    title: "إنهاء الخدمة",
    subtitle: "الاستقالة، إخلاء الطرف، التسوية، ومكافأة نهاية الخدمة",
    description:
      "فحص مسار إنهاء الخدمة من الطلب حتى إخلاء الطرف والتسوية النهائية ومكافأة نهاية الخدمة — بما في ذلك استلام العهد من الإدارات المعنية.",
    steps: [
      "الاستقالة / انتهاء العقد / الفصل",
      "إخلاء الطرف (ومنها العهد)",
      "التسوية النهائية",
      "مكافأة نهاية الخدمة",
    ],
    questions: commonQuestions("offboarding", [
      {
        id: "offboarding_checklist",
        dimension: "control",
        text: "هل توجد قائمة إخلاء طرف متعددة الإدارات ومتابعة حالتها؟",
        type: "single",
        required: true,
        options: [
          { id: "ad_hoc", label: "إجراءات عشوائية حسب الحالة", score: 1 },
          { id: "paper", label: "نموذج ورقي يُوقَّع يدوياً", score: 2 },
          { id: "excel", label: "قائمة تحقق في Excel", score: 3 },
          { id: "workflow", label: "مسار موافقات رقمي عبر الإدارات", score: 4 },
          { id: "auto_settle", label: "مسار رقمي مربوط بالتسوية النهائية", score: 5 },
        ],
      },
    ]),
  },
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

/** وحدات التقييم — جاهزة للتوسعة لاحقاً (مالية، مشتريات، عهد كوحدة مستقلة…) */
export const MODULES = [
  {
    id: "hr",
    title: "الموارد البشرية",
    titleEn: "Human Resources",
    active: true,
  },
  {
    id: "custody",
    title: "إدارة العهد",
    titleEn: "Custody / Assets",
    active: false,
    note: "تُقيَّم حالياً كدورة متقاطعة داخل حزمة HR؛ يمكن فصلها لاحقاً كوحدة مستقلة.",
  },
] as const;
