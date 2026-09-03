export type DiagnosticTag = string;

export interface DiagnosticOption {
  id: string;
  label: string;
  helper: string;
  tags: DiagnosticTag[];
}

export interface DiagnosticQuestion {
  id: string;
  message: string;
  advisorTip: string;
  options: DiagnosticOption[];
  responseType?: "options" | "text" | "number";
  placeholder?: string;
}

export interface DiagnosticAnswer {
  questionId: string;
  optionId: string;
  label: string;
  tags: DiagnosticTag[];
}

export const PROFILE_TAGS: Record<string, DiagnosticTag[]> = {
  "tech-pro": ["technical", "advanced"],
  "career-switcher": ["career", "beginner"],
  student: ["portfolio", "beginner"],
  corporate: ["corporate", "advanced"]
};

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: "outcome",
    message: "Para comenzar, ¿qué cambio concreto quiere conseguir el prospecto con esta formación?",
    advisorTip: "Busca el resultado real, no solamente la herramienta que menciona. Esto permite argumentar valor después.",
    options: [
      { id: "career", label: "Cambiar de carrera o conseguir un nuevo empleo", helper: "Necesita una ruta completa y acompañamiento.", tags: ["career", "full-program", "portfolio"] },
      { id: "growth", label: "Crecer o especializarse en su rol actual", helper: "Busca una habilidad técnica de mayor nivel.", tags: ["specialization", "advanced", "full-program"] },
      { id: "productivity", label: "Automatizar tareas y mejorar su productividad", helper: "Quiere resultados aplicables en poco tiempo.", tags: ["automation", "business-ai", "short-format"] },
      { id: "certification", label: "Prepararse para una certificación o tecnología específica", helper: "Tiene un proveedor o credencial en mente.", tags: ["cloud", "certification", "specialization"] },
      { id: "business", label: "Resolver una necesidad de su empresa o equipo", helper: "La conversación debe enfocarse en impacto y casos de uso.", tags: ["corporate", "business-ai", "advanced"] }
    ]
  },
  {
    id: "interest",
    message: "¿Qué tipo de actividades le gustaría aprender a realizar?",
    advisorTip: "Si menciona varias, pídele escoger la que más le entusiasma. La tarea deseada diferencia mejor los programas que el cargo actual.",
    options: [
      { id: "analytics", label: "Analizar información, crear dashboards y tomar decisiones", helper: "Analítica, Power BI y visualización.", tags: ["analytics"] },
      { id: "data-engineering", label: "Construir pipelines, transformar datos y trabajar a gran escala", helper: "Ingeniería de datos, Spark, Airflow y plataformas modernas.", tags: ["data-engineering", "technical"] },
      { id: "ai-apps", label: "Desarrollar aplicaciones, asistentes o soluciones con IA", helper: "Programación, LLMs y productos inteligentes.", tags: ["ai-apps", "technical"] },
      { id: "agents", label: "Crear agentes inteligentes y automatizaciones avanzadas", helper: "Agentes, N8N, LangChain, LangGraph y WhatsApp.", tags: ["agents", "automation"] },
      { id: "architecture", label: "Diseñar arquitecturas de datos o IA para empresas", helper: "Visión estratégica, gobierno y soluciones escalables.", tags: ["architecture", "advanced"] },
      { id: "cloud", label: "Especializarse en nube y certificaciones", helper: "AWS, Azure, Google Cloud, Fabric o Databricks.", tags: ["cloud", "certification"] },
      { id: "business-ai", label: "Aplicar IA en marketing, administración o trabajo cotidiano", helper: "Uso práctico de IA sin una ruta tan técnica.", tags: ["business-ai", "beginner"] }
    ]
  },
  {
    id: "experience",
    message: "¿Cuál es su punto de partida técnico?",
    advisorTip: "No descartes a una persona por empezar desde cero; usa esta respuesta para elegir la profundidad y explicar la nivelación.",
    options: [
      { id: "beginner", label: "Empieza desde cero o solo usa herramientas de oficina", helper: "Conviene una entrada amigable y progresiva.", tags: ["beginner"] },
      { id: "basic", label: "Tiene bases de Excel, Power BI, SQL o herramientas de IA", helper: "Puede avanzar hacia una ruta aplicada.", tags: ["intermediate"] },
      { id: "developer", label: "Ya programa o trabaja en tecnología", helper: "Puede asumir programas técnicos y proyectos complejos.", tags: ["technical", "advanced"] },
      { id: "leader", label: "Lidera equipos, proyectos o decisiones tecnológicas", helper: "Necesita arquitectura, estrategia o capacitación corporativa.", tags: ["architecture", "corporate", "advanced"] }
    ]
  },
  {
    id: "ecosystem",
    message: "¿Hay alguna plataforma o ecosistema que necesite priorizar?",
    advisorTip: "Solo prioriza una nube cuando el prospecto ya la usa, su empresa la exige o busca esa certificación.",
    options: [
      { id: "neutral", label: "No tiene preferencia; quiere la mejor ruta para su objetivo", helper: "La recomendación se basará en su necesidad principal.", tags: ["platform-neutral"] },
      { id: "aws", label: "AWS", helper: "Amazon Web Services.", tags: ["aws", "cloud"] },
      { id: "azure", label: "Microsoft Azure", helper: "Azure, Fabric y herramientas Microsoft.", tags: ["azure", "cloud"] },
      { id: "gcp", label: "Google Cloud", helper: "GCP, BigQuery y ecosistema Google.", tags: ["gcp", "cloud"] },
      { id: "databricks", label: "Databricks", helper: "Datos, ingeniería e IA en Databricks.", tags: ["databricks", "cloud"] },
      { id: "fabric", label: "Microsoft Fabric y Power BI", helper: "Analítica e ingeniería en Fabric.", tags: ["fabric", "analytics"] }
    ]
  },
  {
    id: "depth",
    message: "¿Qué profundidad y ritmo de formación está buscando?",
    advisorTip: "Una opción corta no siempre reemplaza un programa. Confirma si quiere explorar, resolver algo puntual o transformar su perfil.",
    options: [
      { id: "full", label: "Un programa completo para desarrollar un nuevo perfil", helper: "Ruta estructurada, proyectos y mayor profundidad.", tags: ["full-program"] },
      { id: "specialized", label: "Una especialización concreta sobre una base que ya tiene", helper: "Formación avanzada y enfocada.", tags: ["specialization", "advanced"] },
      { id: "short", label: "Un taller corto para aplicar algo inmediatamente", helper: "Alcance puntual y resultado rápido.", tags: ["short-format"] },
      { id: "unsure", label: "Todavía no lo tiene claro y necesita orientación", helper: "Presenta una ruta principal y una alternativa de entrada.", tags: ["guided"] }
    ]
  }
];

const PROFILE_QUESTIONS: Record<string, DiagnosticQuestion[]> = {
  "tech-pro": [
    {
      id: "tech-role",
      message: "Ya que actualmente trabaja en tecnología, ¿en qué área se desempeña principalmente?",
      advisorTip: "Reconoce primero su experiencia actual. Así puedes presentar el programa como evolución profesional y no como una formación desde cero.",
      options: [
        { id: "analytics", label: "Analítica, inteligencia de negocios o Power BI", helper: "Trabaja con reportes, indicadores o visualización.", tags: ["analytics", "intermediate"] },
        { id: "data-engineering", label: "Ingeniería de datos, bases de datos o plataformas", helper: "Construye pipelines, integra información o administra datos.", tags: ["data-engineering", "technical", "advanced"] },
        { id: "development", label: "Desarrollo de software o aplicaciones", helper: "Programa y puede avanzar hacia soluciones de IA.", tags: ["ai-apps", "technical", "advanced"] },
        { id: "cloud", label: "Nube, infraestructura o arquitectura", helper: "Trabaja con plataformas y diseño de soluciones.", tags: ["cloud", "architecture", "advanced"] },
        { id: "leadership", label: "Liderazgo técnico, producto o gestión de equipos", helper: "Necesita criterio estratégico y aplicación empresarial.", tags: ["architecture", "corporate", "advanced"] }
      ]
    },
    {
      id: "tech-next-step",
      message: "¿Cuál sería el siguiente salto profesional que quiere lograr desde su experiencia actual?",
      advisorTip: "Busca la brecha entre lo que ya sabe y el rol o proyecto que quiere asumir. Esa brecha es el argumento de valor.",
      options: [
        { id: "specialize", label: "Especializarse más en su área actual", helper: "Busca profundidad técnica y proyectos más complejos.", tags: ["specialization", "advanced", "full-program"] },
        { id: "ai", label: "Incorporar IA y agentes a su perfil", helper: "Quiere complementar su experiencia con soluciones inteligentes.", tags: ["ai-apps", "agents", "technical"] },
        { id: "architect", label: "Pasar a arquitectura o liderazgo técnico", helper: "Busca diseñar soluciones y tomar decisiones de alto nivel.", tags: ["architecture", "advanced"] },
        { id: "certify", label: "Dominar o certificarse en una plataforma", helper: "Tiene una tecnología o nube específica como prioridad.", tags: ["cloud", "certification", "specialization"] }
      ]
    }
  ],
  "career-switcher": [
    {
      id: "transferable-base",
      message: "Pensando en el cambio de perfil, ¿qué conocimientos o experiencia puede aprovechar como punto de partida?",
      advisorTip: "Haz visible lo que la persona ya trae. Esto reduce el miedo al cambio y ayuda a elegir una ruta realista.",
      options: [
        { id: "none", label: "Empieza desde cero en tecnología", helper: "Necesita fundamentos, acompañamiento y una ruta progresiva.", tags: ["beginner", "full-program", "career"] },
        { id: "office", label: "Maneja Excel, reportes o información del negocio", helper: "Tiene una base útil para comenzar por analítica.", tags: ["analytics", "beginner", "career"] },
        { id: "business", label: "Viene de administración, marketing u otra área de negocio", helper: "Puede comenzar aplicando IA y automatización en su campo.", tags: ["business-ai", "automation", "beginner"] },
        { id: "technical", label: "Ya estudió programación, datos o tecnología", helper: "Puede asumir una ruta técnica con mayor profundidad.", tags: ["technical", "intermediate", "career"] }
      ]
    },
    {
      id: "career-goal",
      message: "¿Qué resultado haría que este cambio profesional valiera la pena para esa persona?",
      advisorTip: "Conecta la recomendación con una meta concreta: empleo, promoción, portafolio o aplicación inmediata.",
      options: [
        { id: "first-job", label: "Conseguir su primera oportunidad en tecnología", helper: "Necesita una ruta completa y construir evidencia práctica.", tags: ["career", "portfolio", "full-program"] },
        { id: "promotion", label: "Acceder a un cargo mejor remunerado o especializado", helper: "Busca habilidades diferenciadoras y profundidad.", tags: ["specialization", "advanced", "full-program"] },
        { id: "current-role", label: "Aplicar tecnología en el trabajo que ya tiene", helper: "Prioriza productividad y resultados inmediatos.", tags: ["business-ai", "automation", "short-format"] },
        { id: "explore", label: "Explorar antes de decidir un cambio completo", helper: "Conviene comenzar con una experiencia corta y aplicada.", tags: ["guided", "beginner", "short-format"] }
      ]
    }
  ],
  student: [
    {
      id: "student-area",
      message: "¿Qué está estudiando actualmente y desde qué área quiere acercarse a tecnología?",
      advisorTip: "Relaciona el programa con su carrera actual para que lo perciba como una ventaja profesional y no como un camino separado.",
      options: [
        { id: "systems", label: "Sistemas, software o informática", helper: "Puede avanzar hacia desarrollo, datos e IA.", tags: ["technical", "ai-apps", "intermediate"] },
        { id: "engineering", label: "Ingeniería, matemáticas o ciencias", helper: "Tiene bases analíticas para datos y modelos.", tags: ["analytics", "data-engineering", "intermediate"] },
        { id: "business", label: "Administración, economía, marketing o negocios", helper: "Puede aplicar analítica e IA a decisiones empresariales.", tags: ["analytics", "business-ai", "beginner"] },
        { id: "other", label: "Otra carrera o todavía está explorando", helper: "Necesita una entrada amigable y orientación.", tags: ["beginner", "guided"] }
      ]
    },
    {
      id: "student-goal",
      message: "¿Qué quiere obtener antes de terminar sus estudios?",
      advisorTip: "En estudiantes funciona mejor vender una ventaja demostrable: proyecto, portafolio, práctica o primera experiencia laboral.",
      options: [
        { id: "portfolio", label: "Construir proyectos para su portafolio", helper: "Quiere demostrar lo que sabe hacer.", tags: ["portfolio", "full-program"] },
        { id: "job", label: "Prepararse para prácticas o su primer empleo", helper: "Necesita una ruta aplicable al mercado laboral.", tags: ["career", "portfolio", "full-program"] },
        { id: "complement", label: "Complementar su carrera con una habilidad tecnológica", helper: "Busca diferenciarse sin cambiar necesariamente de profesión.", tags: ["business-ai", "analytics", "specialization"] },
        { id: "short", label: "Aprender una herramienta puntual rápidamente", helper: "Prefiere una experiencia corta y concreta.", tags: ["short-format", "beginner"] }
      ]
    }
  ],
  corporate: [
    {
      id: "corporate-industry",
      message: "Para entender mejor su contexto, ¿a qué se dedica la empresa y cuál es su actividad principal?",
      advisorTip: "Anota el sector y su producto o servicio principal; así podrás aterrizar la propuesta a su realidad.",
      responseType: "text",
      placeholder: "Ej. Empresa de logística y distribución nacional",
      options: []
    },
    {
      id: "corporate-areas",
      message: "¿Qué áreas o equipos de la empresa participarían en la capacitación?",
      advisorTip: "Si participarán varias áreas, identifica el objetivo común que deben compartir.",
      options: [
        { id: "operations", label: "Administración, operaciones o servicio al cliente", helper: "Suele requerir productividad y automatización.", tags: ["business-ai", "automation", "corporate"] },
        { id: "analytics", label: "Analítica, inteligencia de negocios o finanzas", helper: "Prioriza indicadores, datos y visualización.", tags: ["analytics", "corporate"] },
        { id: "technology", label: "Tecnología, desarrollo o ingeniería", helper: "Puede asumir formación técnica de mayor profundidad.", tags: ["technical", "advanced", "corporate"] },
        { id: "leadership", label: "Líderes o tomadores de decisión", helper: "Conviene orientar a estrategia y arquitectura.", tags: ["architecture", "advanced", "corporate"] },
        { id: "mixed", label: "Participarán varias áreas", helper: "Será necesario definir un alcance común.", tags: ["guided", "corporate"] }
      ]
    },
    {
      id: "corporate-level",
      message: "Respecto al tema que desean estudiar, ¿qué nivel de conocimiento tiene actualmente el equipo?",
      advisorTip: "Valida el nivel con un ejemplo de lo que ya pueden hacer para no ofrecer una formación demasiado básica o avanzada.",
      options: [
        { id: "beginner", label: "Inicial: prácticamente empiezan desde cero", helper: "Necesitan fundamentos y una ruta progresiva.", tags: ["beginner", "corporate"] },
        { id: "basic", label: "Básico: conocen conceptos o algunas herramientas", helper: "Pueden avanzar hacia una formación aplicada.", tags: ["intermediate", "corporate"] },
        { id: "advanced", label: "Intermedio o avanzado: ya desarrollan proyectos", helper: "Requieren especialización y mayor profundidad.", tags: ["technical", "advanced", "specialization"] },
        { id: "mixed", label: "El grupo tiene niveles diferentes", helper: "Será importante contemplar una nivelación.", tags: ["guided", "corporate"] }
      ]
    },
    {
      id: "corporate-tools",
      message: "¿Qué herramientas, plataformas o tecnologías utilizan actualmente en la empresa?",
      advisorTip: "Pregunta por lo que realmente usan en sus procesos; el ecosistema existente puede definir la ruta.",
      options: [
        { id: "microsoft", label: "Excel, Power BI, Azure o Fabric", helper: "La empresa trabaja principalmente con Microsoft.", tags: ["azure", "fabric", "analytics", "cloud"] },
        { id: "aws", label: "AWS", helper: "Trabajan sobre Amazon Web Services.", tags: ["aws", "cloud"] },
        { id: "google", label: "Google Cloud, BigQuery o ecosistema Google", helper: "Conviene priorizar GCP.", tags: ["gcp", "cloud"] },
        { id: "databricks", label: "Databricks", helper: "Puede requerir datos, ingeniería o IA.", tags: ["databricks", "cloud", "data-engineering"] },
        { id: "ai", label: "ChatGPT, Copilot u otras herramientas de IA", helper: "Ya existe adopción inicial de IA generativa.", tags: ["business-ai", "ai-apps"] },
        { id: "other", label: "Otras o todavía no está definido", helper: "La recomendación se basará en el objetivo.", tags: ["platform-neutral", "guided"] }
      ]
    },
    {
      id: "corporate-processes",
      message: "Pensando en el trabajo diario, ¿qué procesos les gustaría optimizar o automatizar primero?",
      advisorTip: "Pide un caso concreto; ese proceso será el principal argumento de impacto de la propuesta.",
      options: [
        { id: "reports", label: "Reportes, análisis o toma de decisiones", helper: "Necesitan analítica, visualización o gestión de datos.", tags: ["analytics", "data-engineering"] },
        { id: "repetitive", label: "Tareas administrativas o repetitivas", helper: "Buscan automatización y productividad inmediata.", tags: ["automation", "business-ai", "short-format"] },
        { id: "customer", label: "Atención al cliente, ventas o marketing", helper: "Pueden aprovechar IA, agentes y automatizaciones.", tags: ["agents", "automation", "business-ai"] },
        { id: "development", label: "Desarrollo de soluciones tecnológicas", helper: "Necesitan capacidades técnicas en IA o datos.", tags: ["ai-apps", "technical", "advanced"] },
        { id: "strategy", label: "Arquitectura, gobierno o adopción tecnológica", helper: "El foco está en diseño y decisiones empresariales.", tags: ["architecture", "advanced"] }
      ]
    },
    {
      id: "corporate-format",
      message: "Para organizar la experiencia, ¿prefieren que la capacitación sea virtual o presencial?",
      advisorTip: "Si es presencial, confirma también la ciudad y las condiciones logísticas.",
      options: [
        { id: "virtual", label: "Virtual", helper: "El equipo se conectaría de manera remota.", tags: ["corporate"] },
        { id: "onsite", label: "Presencial", helper: "Será necesario confirmar ciudad y logística.", tags: ["corporate"] },
        { id: "hybrid", label: "Híbrida o cualquiera de las dos", helper: "La modalidad puede definirse con la propuesta.", tags: ["corporate", "guided"] }
      ]
    },
    {
      id: "corporate-participants",
      message: "¿Cuántas personas participarían aproximadamente en la capacitación?",
      advisorTip: "Este dato es indispensable para dimensionar el alcance y preparar la propuesta.",
      responseType: "number",
      placeholder: "Ej. 25",
      options: []
    },
    {
      id: "corporate-timing",
      message: "¿En qué plazo esperan realizar la capacitación y qué disponibilidad tendría el equipo?",
      advisorTip: "Aclara mes esperado, días, horarios y cantidad de horas disponibles.",
      responseType: "text",
      placeholder: "Ej. En octubre, martes y jueves de 4:00 a 6:00 p. m.",
      options: []
    },
    {
      id: "corporate-goal",
      message: "Para cerrar, ¿cuál sería el resultado más importante que esperan obtener con esta capacitación?",
      advisorTip: "Resume lo conversado y valida el resultado esperado antes de presentar la recomendación.",
      options: [
        { id: "productivity", label: "Mejoras inmediatas en productividad", helper: "Buscan un resultado práctico a corto plazo.", tags: ["automation", "business-ai", "short-format"] },
        { id: "capability", label: "Desarrollar una capacidad técnica sólida", helper: "Necesitan una ruta completa y estructurada.", tags: ["technical", "full-program", "advanced"] },
        { id: "project", label: "Prepararse para ejecutar un proyecto específico", helper: "La formación debe conectarse con un caso real.", tags: ["specialization", "full-program"] },
        { id: "strategy", label: "Definir una ruta de adopción o transformación", helper: "Requieren visión estratégica y arquitectura.", tags: ["architecture", "advanced", "corporate"] }
      ]
    }
  ]
};

export const getDiagnosticQuestions = (profileId: string): DiagnosticQuestion[] => {
  const profileQuestions = PROFILE_QUESTIONS[profileId];
  if (!profileQuestions) return DIAGNOSTIC_QUESTIONS;
  if (profileId === "corporate") return profileQuestions;
  const commonQuestions = DIAGNOSTIC_QUESTIONS.filter((question) => ["interest", "ecosystem", "depth"].includes(question.id));
  return [...profileQuestions, ...commonQuestions];
};
