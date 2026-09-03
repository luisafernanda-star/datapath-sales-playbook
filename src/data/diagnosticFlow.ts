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
