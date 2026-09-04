export interface DecisionOption {
  text: string;
  nextId?: string;
  recommendation?: string;
  suggestedPrograms?: string[];
}

export interface DecisionNode {
  id: string;
  message: string; // Lo que la asesora debe preguntar/decir
  agentTip?: string; // Consejo interno para la asesora
  options: DecisionOption[];
}

export interface Profile {
  id: string;
  title: string;
  icon: string; // Nombre del icono de Lucide
  description: string;
  startNodeId: string;
  nodes: Record<string, DecisionNode>;
  diagnosticGuide: string; // Markdown de la guía de diagnóstico
}

export interface Program {
  id: string;
  name: string;
  duration: string;
  modality: string;
  target: string;
  description: string;
  keyBenefits: string[];
  priceInfo: string;
  // Nuevos campos detallados del Capítulo 07
  goal?: string;
  whenToRecommend?: string;
  whenNotToRecommend?: string;
  validationQuestions?: string[];
  positiveSignals?: string[];
  alertSignals?: string[];
  howToPresent?: string;
  liveModalityRule?: string;
  asyncModalityRule?: string;
  relatedPrograms?: string[];
  commonErrors?: string[];
  advisorSummary?: string;
}

export interface Objection {
  id: string;
  title: string;
  commonPhrases: string[];
  rebuttalStrategy: string;
  explorationQuestion: string;
  suggestedScript: string;
}

export const PROGRAMS: Program[] = [
  {
    id: "ai-solution-architect",
    name: "AI Solution Architect",
    duration: "14 Semanas (3.5 meses)",
    modality: "Online En Vivo / Asincrónico",
    target: "Profesionales de TI, desarrolladores y arquitectos que deseen liderar implementaciones estratégicas de IA.",
    description: "Prepara a los estudiantes para diseñar, integrar y llevar a producción soluciones empresariales basadas en Inteligencia Artificial.",
    keyBenefits: [
      "Diseño de arquitecturas de IA escalables y seguras.",
      "Integración de múltiples modelos de lenguaje (LLMs) y servicios.",
      "Buenas prácticas y patrones para llevar soluciones a producción corporativa."
    ],
    priceInfo: "Facilidades de pago hasta en 6 cuotas mensuales sin intereses.",
    goal: "AI Solution Architect prepara a los estudiantes para diseñar, integrar y llevar a producción soluciones empresariales basadas en Inteligencia Artificial, con foco en escalabilidad, seguridad y buenas prácticas.",
    whenToRecommend: "Recomiéndalo cuando el prospecto quiere aprender a diseñar soluciones completas y no únicamente desarrollar código, tiene interés en arquitectura de software/IA, busca liderar transformación digital o integrar componentes corporativos.",
    whenNotToRecommend: "Evita recomendar este programa cuando el prospecto está comenzando desde cero en programación, busca aprender únicamente análisis de datos, o quiere enfocarse exclusivamente en Machine Learning tradicional.",
    validationQuestions: [
      "¿Qué tipo de proyectos te gustaría desarrollar?",
      "¿Buscas programar soluciones o diseñar arquitecturas completas?",
      "¿Has trabajado anteriormente en proyectos tecnológicos?",
      "¿Qué rol te gustaría desempeñar dentro de un equipo de IA?",
      "¿Tu interés es técnico, estratégico o ambos?"
    ],
    positiveSignals: [
      "Habla de crear soluciones empresariales.",
      "Quiere integrar múltiples tecnologías.",
      "Tiene interés en arquitectura de sistemas.",
      "Busca comprender cómo llevar soluciones a producción.",
      "Quiere liderar iniciativas de IA dentro de una organización."
    ],
    alertSignals: [
      "Busca un curso introductorio de IA.",
      "No tiene conocimientos básicos de tecnología y espera empezar completamente desde cero.",
      "Su objetivo principal es trabajar únicamente con datos.",
      "Busca aprender una herramienta específica sin interés en la arquitectura completa."
    ],
    howToPresent: "AI Solution Architect está diseñado para personas que quieren crear soluciones de Inteligencia Artificial listas para implementarse en empresas. Aprenderás cómo diseñar arquitecturas, integrar modelos, conectar diferentes servicios y construir proyectos escalables siguiendo buenas prácticas utilizadas en entornos reales.",
    liveModalityRule: "Quiere acompañamiento constante del instructor, desea resolver dudas en vivo y tiene disponibilidad para asistir al horario establecido.",
    asyncModalityRule: "Sus horarios no le permiten asistir en vivo, vive en un país con diferencia horaria o prefiere avanzar a su propio ritmo con flexibilidad.",
    relatedPrograms: ["claude-code-for-developers", "ai-agentic-engineer", "ia-generativa-en-databricks"],
    commonErrors: [
      "Presentarlo como un curso básico de Inteligencia Artificial.",
      "Explicar primero la currícula sin comprender el objetivo del prospecto.",
      "Enfocarse únicamente en las herramientas y no en la transformación profesional.",
      "Asumir que solo aplica para desarrolladores senior."
    ],
    advisorSummary: "Si el prospecto quiere aprender a diseñar soluciones empresariales completas con Inteligencia Artificial, comprender la arquitectura detrás de proyectos reales y prepararse para liderar implementaciones de IA, AI Solution Architect es la recomendación ideal."
  },
  {
    id: "ai-engineer",
    name: "AI Engineer",
    duration: "12 Semanas (3 meses)",
    modality: "Online En Vivo / Asincrónico",
    target: "Desarrolladores y profesionales de tecnología que buscan programar asistentes, agentes y automatizaciones inteligentes.",
    description: "Prepara a los estudiantes para desarrollar aplicaciones impulsadas por Inteligencia Artificial utilizando modelos de lenguaje (LLMs), agentes, herramientas modernas y buenas prácticas.",
    keyBenefits: [
      "Creación de asistentes virtuales y automatizaciones de flujos de trabajo.",
      "Integración de modelos de lenguaje en proyectos de software reales.",
      "Uso de APIs y herramientas de desarrollo asistido por IA."
    ],
    priceInfo: "Pago al contado con descuento o cuotas mensuales accesibles.",
    goal: "AI Engineer prepara a los estudiantes para desarrollar aplicaciones impulsadas por Inteligencia Artificial utilizando modelos de lenguaje (LLMs), agentes, herramientas modernas y buenas prácticas de desarrollo.",
    whenToRecommend: "Recomiéndalo cuando el prospecto quiere desarrollar aplicaciones utilizando Inteligencia Artificial, busca aprender a integrar modelos de lenguaje en soluciones reales o quiere crear asistentes virtuales y agentes.",
    whenNotToRecommend: "Evita recomendar este programa cuando el prospecto busca diseñar arquitecturas empresariales completas de IA, busca especializarse en análisis de datos o quiere enfocarse exclusivamente en Data Engineering.",
    validationQuestions: [
      "¿Qué tipo de soluciones te gustaría desarrollar?",
      "¿Has trabajado anteriormente con programación?",
      "¿Qué esperas construir utilizando Inteligencia Artificial?",
      "¿Buscas crear aplicaciones o diseñar la arquitectura completa?",
      "¿Quieres desarrollar productos propios o implementar IA en tu trabajo actual?"
    ],
    positiveSignals: [
      "Habla de crear aplicaciones.",
      "Quiere desarrollar asistentes inteligentes.",
      "Le interesa automatizar procesos con IA.",
      "Quiere integrar modelos de lenguaje en proyectos.",
      "Busca aprender haciendo proyectos prácticos."
    ],
    alertSignals: [
      "Busca aprender arquitectura empresarial de IA.",
      "Su interés principal está en análisis de datos.",
      "Busca especializarse únicamente en infraestructura de datos.",
      "No tiene claro qué quiere hacer con la IA."
    ],
    howToPresent: "AI Engineer está pensado para quienes quieren construir aplicaciones utilizando Inteligencia Artificial. Aprenderás a desarrollar asistentes inteligentes, integrar modelos de lenguaje, automatizar procesos y crear soluciones que resuelvan problemas reales mediante proyectos prácticos.",
    liveModalityRule: "Quiere acompañamiento permanente del instructor, desea resolver dudas en tiempo real y puede asistir al horario establecido.",
    asyncModalityRule: "Necesita mayor flexibilidad de horario, vive en otro país o prefiere avanzar a su propio ritmo.",
    relatedPrograms: ["ai-solution-architect", "claude-code-for-developers", "ai-agentic-engineer"],
    commonErrors: [
      "Presentarlo como un programa de arquitectura empresarial.",
      "Asumir que cualquier persona interesada en IA necesita AI Engineer.",
      "Explicar primero las tecnologías sin comprender el objetivo del prospecto.",
      "Enfocarse únicamente en las herramientas en lugar de la transformación profesional."
    ],
    advisorSummary: "Si el prospecto quiere aprender a desarrollar aplicaciones con Inteligencia Artificial, construir asistentes inteligentes, integrar modelos de lenguaje y crear soluciones prácticas utilizando IA, AI Engineer es la mejor opción."
  },
  {
    id: "data-analyst",
    name: "Data Analyst",
    duration: "12 Semanas (3 meses)",
    modality: "Online En Vivo / Asincrónico",
    target: "Estudiantes, egresados o profesionales que deseen aprender a transformar datos en reportes interactivos y decisiones estratégicas.",
    description: "Prepara a los estudiantes para transformar datos en información útil para la toma de decisiones mediante el análisis, la visualización y la interpretación de datos.",
    keyBenefits: [
      "Dominio de herramientas clave de la industria: SQL, Power BI y Python para datos.",
      "Capacidad para estructurar reportes interactivos y dashboards empresariales.",
      "Enfoque práctico de negocio y storytelling con datos."
    ],
    priceInfo: "Acceso a becas parciales y financiamiento directo.",
    goal: "Data Analyst prepara a los estudiantes para transformar datos en información útil para la toma de decisiones mediante el análisis, la visualización y la interpretación de datos.",
    whenToRecommend: "Recomiéndalo cuando el prospecto quiere trabajar analizando información para apoyar la toma de decisiones, le interesa descubrir patrones y generar insights o busca aprender herramientas de análisis y visualización.",
    whenNotToRecommend: "Evita recomendar este programa cuando el prospecto quiere construir infraestructura de datos (pipelines), busca desarrollar aplicaciones con IA, o quiere enfocarse exclusivamente en Machine Learning.",
    validationQuestions: [
      "¿Qué te llamó la atención del análisis de datos?",
      "¿Cómo imaginas aplicar estos conocimientos?",
      "¿Buscas cambiar de profesión o fortalecer tu perfil actual?",
      "¿Qué experiencia tienes trabajando con datos o reportes?",
      "¿Qué tipo de problemas te gustaría resolver mediante datos?"
    ],
    positiveSignals: [
      "Habla de tomar decisiones con datos.",
      "Le interesa crear dashboards.",
      "Quiere automatizar reportes.",
      "Busca interpretar información para apoyar el negocio.",
      "Muestra interés por la analítica y la visualización."
    ],
    alertSignals: [
      "Quiere construir pipelines de datos.",
      "Busca desarrollar aplicaciones con IA.",
      "Su interés principal es la arquitectura de datos.",
      "Habla únicamente de entrenamiento de modelos de Machine Learning."
    ],
    howToPresent: "Data Analyst está pensado para quienes quieren convertir datos en información que ayude a tomar mejores decisiones. Aprenderás a analizar, visualizar e interpretar datos para resolver problemas reales de negocio utilizando herramientas ampliamente utilizadas en la industria.",
    liveModalityRule: "Quiere acompañamiento constante, prefiere resolver dudas en las clases en vivo y realizar ejercicios guiados en tiempo real.",
    asyncModalityRule: "Necesita flexibilidad de horario, tiene restricciones de tiempo o prefiere estudiar a su propio ritmo.",
    relatedPrograms: ["ai-data-engineer", "data-architect", "ia-generativa-en-databricks"],
    commonErrors: [
      "Presentarlo únicamente como un curso de Power BI o Excel.",
      "Confundir el rol de Data Analyst con Data Engineer.",
      "Asumir que cualquier persona interesada en datos debe iniciar por este programa.",
      "Explicar primero las herramientas en lugar del valor profesional que obtendrá."
    ],
    advisorSummary: "Si el prospecto quiere aprender a analizar datos, construir dashboards, interpretar información y apoyar la toma de decisiones mediante analítica, Data Analyst es la mejor recomendación."
  },
  {
    id: "ai-data-engineer",
    name: "AI Data Engineer",
    duration: "16 Semanas (4 meses)",
    modality: "Online En Vivo / Asincrónico",
    target: "Profesionales técnicos, programadores y administradores de bases de datos que quieren automatizar pipelines y flujos de Big Data.",
    description: "Prepara a los estudiantes para diseñar, construir y administrar pipelines de datos modernos que soporten soluciones analíticas y de Inteligencia Artificial.",
    keyBenefits: [
      "Creación de pipelines ETL/ELT eficientes y automatizados.",
      "Procesamiento distribuido de grandes volúmenes de datos con Spark.",
      "Preparación de la infraestructura de datos para consumo analítico e IA."
    ],
    priceInfo: "Cuotas mensuales sin intereses y financiamiento disponible.",
    goal: "AI Data Engineer prepara a los estudiantes para diseñar, construir y administrar pipelines de datos modernos que soporten soluciones analíticas y de Inteligencia Artificial.",
    whenToRecommend: "Recomiéndalo cuando el prospecto quiere construir infraestructura de datos, le interesa trabajar con grandes volúmenes de información (Big Data), o busca automatizar procesos de integración de datos.",
    whenNotToRecommend: "Evita recomendar este programa cuando el prospecto quiere analizar datos para generar reportes y dashboards, busca desarrollar aplicaciones con IA, o desea iniciar desde cero en tecnología sin interés técnico.",
    validationQuestions: [
      "¿Qué tipo de proyectos te gustaría desarrollar?",
      "¿Te interesa más preparar los datos o analizarlos?",
      "¿Has trabajado anteriormente con bases de datos o programación?",
      "¿Qué papel te gustaría desempeñar dentro de un equipo de datos?",
      "¿Buscas construir la infraestructura que soporta la analítica y la IA?"
    ],
    positiveSignals: [
      "Habla de automatizar procesos de datos.",
      "Le interesa construir pipelines.",
      "Quiere trabajar con plataformas de datos a gran escala.",
      "Busca preparar datos para proyectos de IA.",
      "Tiene interés por procesos técnicos relacionados con datos."
    ],
    alertSignals: [
      "Quiere crear dashboards y reportes.",
      "Su principal interés es interpretar información para negocio.",
      "Busca desarrollar asistentes inteligentes o aplicaciones de IA.",
      "Espera un programa enfocado únicamente en visualización de datos."
    ],
    howToPresent: "AI Data Engineer está pensado para quienes quieren construir toda la infraestructura que permite que los datos lleguen de forma confiable a los equipos de analítica e Inteligencia Artificial. Aprenderás a diseñar pipelines, automatizar procesos y preparar datos para proyectos reales.",
    liveModalityRule: "Busca acompañamiento constante del instructor, resolver dudas durante las clases y desarrollar proyectos guiados.",
    asyncModalityRule: "Necesita flexibilidad de tiempo, vive en otro país o prefiere avanzar a su propio ritmo.",
    relatedPrograms: ["data-analyst", "data-architect", "ia-generativa-en-databricks", "mlops-engineer"],
    commonErrors: [
      "Confundir el rol de Data Engineer con el de Data Analyst.",
      "Presentarlo únicamente como un curso de bases de datos.",
      "Explicar primero las tecnologías sin contextualizar el rol profesional.",
      "Asumir que cualquier persona interesada en datos necesita este programa."
    ],
    advisorSummary: "Si el prospecto quiere construir la infraestructura que soporta proyectos de analítica e Inteligencia Artificial, automatizar pipelines y trabajar con plataformas modernas de datos, AI Data Engineer es la mejor recomendación."
  },
  {
    id: "claude-code-for-developers",
    name: "Claude Code for Developers",
    duration: "6 Semanas (1.5 meses)",
    modality: "Online En Vivo / Asincrónico",
    target: "Programadores y desarrolladores de software que buscan elevar su productividad y automatizar flujos mediante IA.",
    description: "Prepara a los estudiantes para utilizar Claude Code como asistente de desarrollo para acelerar la creación de software y automatizar tareas repetitivas.",
    keyBenefits: [
      "Dominio del asistente de consola y desarrollo asistido Claude Code.",
      "Automatización de tareas complejas y refactorización guiada por IA.",
      "Metodología moderna para programar a gran velocidad y menor fatiga."
    ],
    priceInfo: "Pago único o facilidades de financiamiento corporativo.",
    goal: "Claude Code for Developers prepara a los estudiantes para utilizar Claude Code como asistente de desarrollo, permitiéndoles acelerar la creación de software, automatizar tareas repetitivas y mejorar su productividad mediante Inteligencia Artificial.",
    whenToRecommend: "Recomiéndalo cuando el prospecto ya desarrolla software o tiene conocimientos de programación, busca acelerar su flujo de trabajo utilizando IA o quiere mejorar la calidad y velocidad de desarrollo.",
    whenNotToRecommend: "Evita recomendar este programa cuando el prospecto nunca ha programado y busca aprender desde cero, quiere especializarse en análisis de datos o busca construir arquitecturas empresariales de IA.",
    validationQuestions: [
      "¿Actualmente programas o has programado anteriormente?",
      "¿Qué tecnologías utilizas con mayor frecuencia?",
      "¿Qué tipo de proyectos desarrollas?",
      "¿Qué dificultades encuentras durante tu proceso de desarrollo?",
      "¿Qué esperas mejorar utilizando herramientas de IA?"
    ],
    positiveSignals: [
      "Ya trabaja como desarrollador.",
      "Quiere desarrollar más rápido.",
      "Busca automatizar tareas repetitivas.",
      "Le interesa mejorar su productividad.",
      "Quiere incorporar IA en su flujo de desarrollo."
    ],
    alertSignals: [
      "Nunca ha programado.",
      "Busca aprender desarrollo desde cero.",
      "Su interés principal está en análisis de datos.",
      "Quiere aprender Inteligencia Artificial sin relación con el desarrollo de software."
    ],
    howToPresent: "Claude Code for Developers está diseñado para desarrolladores que quieren aprovechar la Inteligencia Artificial para programar de forma más rápida, mantener mejor sus proyectos y automatizar tareas que normalmente consumen gran parte del tiempo de desarrollo.",
    liveModalityRule: "Quiere practicar junto al instructor, desea resolver dudas en las sesiones y prefiere ejercicios guiados.",
    asyncModalityRule: "Necesita flexibilidad de horario, vive en otro país o prefiere avanzar a su propio ritmo.",
    relatedPrograms: ["ai-engineer", "ai-solution-architect", "ai-agentic-engineer"],
    commonErrors: [
      "Presentarlo como un curso para aprender a programar.",
      "Asumir que cualquier persona interesada en IA aprovechará Claude Code.",
      "Enfoque exclusivo en la herramienta y no en la productividad que ofrece.",
      "Recomendarlo sin validar que el prospecto tenga conocimientos básicos de desarrollo."
    ],
    advisorSummary: "Si el prospecto ya tiene conocimientos de programación y quiere desarrollar software de manera más eficiente utilizando Inteligencia Artificial, automatizar tareas y mejorar su productividad como desarrollador, Claude Code for Developers es la mejor opción."
  },
  {
    id: "ai-agentic-engineer",
    name: "AI Agentic Engineer",
    duration: "10 Semanas (2.5 meses)",
    modality: "Online En Vivo / Asincrónico",
    target: "Desarrolladores avanzados y profesionales de IA que quieren diseñar agentes autónomos capaces de tomar decisiones.",
    description: "Prepara a los estudiantes para diseñar, desarrollar e implementar agentes de IA capaces de ejecutar tareas autónomas e interactuar con herramientas externas.",
    keyBenefits: [
      "Arquitectura y desarrollo de sistemas basados en agentes inteligentes.",
      "Integración de agentes con herramientas, bases de datos y APIs externas.",
      "Domino del ciclo de vida y optimización de flujos autónomos en producción."
    ],
    priceInfo: "Descuentos grupales y opciones de pago flexibles.",
    goal: "AI Agentic Engineer prepara a los estudiantes para diseñar, desarrollar e implementar agentes de Inteligencia Artificial capaces de ejecutar tareas, tomar decisiones dentro de un flujo definido e interactuar con herramientas, APIs y diferentes servicios.",
    whenToRecommend: "Recomiéndalo cuando el prospecto quiere construir agentes inteligentes, busca automatizar procesos autónomos complejos utilizando IA, o quiere mantenerse al día con las tendencias más avanzadas de IA generativa.",
    whenNotToRecommend: "Evita recomendar este programa cuando el prospecto está comenzando desde cero en tecnología, busca aprender programación básica, o quiere enfocarse principalmente en análisis de datos.",
    validationQuestions: [
      "¿Qué tipo de procesos te gustaría automatizar?",
      "¿Has trabajado anteriormente desarrollando soluciones con IA?",
      "¿Qué esperas lograr utilizando agentes inteligentes?",
      "¿Buscas construir productos o mejorar procesos existentes?",
      "¿Qué nivel de experiencia tienes en desarrollo?"
    ],
    positiveSignals: [
      "Habla de automatización inteligente.",
      "Quiere construir agentes autónomos.",
      "Busca integrar múltiples herramientas.",
      "Tiene interés por la IA generativa avanzada.",
      "Quiere desarrollar soluciones innovadoras para empresas."
    ],
    alertSignals: [
      "Busca aprender programación desde cero.",
      "Su objetivo principal es el análisis de datos.",
      "Quiere aprender únicamente una herramienta específica.",
      "Aún no tiene claridad sobre el área en la que desea especializarse."
    ],
    howToPresent: "AI Agentic Engineer está pensado para quienes quieren desarrollar soluciones capaces de ejecutar tareas de forma autónoma, interactuar con diferentes herramientas y automatizar procesos complejos utilizando Inteligencia Artificial.",
    liveModalityRule: "Quiere desarrollar proyectos de agentes acompañado de cerca por el instructor y resolver dudas en tiempo real.",
    asyncModalityRule: "Necesita flexibilidad de horario, vive en otro país o tiene restricciones de tiempo.",
    relatedPrograms: ["ai-engineer", "ai-solution-architect", "claude-code-for-developers"],
    commonErrors: [
      "Presentarlo como un curso introductorio de Inteligencia Artificial.",
      "Asumir que cualquier persona interesada en IA necesita aprender agentes.",
      "Explicar primero los conceptos técnicos sin conectar con el problema que resuelve.",
      "Recomendarlo sin validar el nivel técnico del prospecto."
    ],
    advisorSummary: "Si el prospecto quiere desarrollar agentes inteligentes, automatizar procesos complejos e integrar diferentes herramientas utilizando Inteligencia Artificial, AI Agentic Engineer es la recomendación ideal."
  },
  {
    id: "data-architect",
    name: "Data Architect",
    duration: "14 Semanas (3.5 meses)",
    modality: "Online En Vivo / Asincrónico",
    target: "Ingenieros de datos senior y líderes de TI que buscan diseñar arquitecturas escalables, seguras y definir gobierno de datos.",
    description: "Prepara a los estudiantes para diseñar arquitecturas de datos modernas, escalables y seguras que soporten las necesidades analíticas y operativas de una organización.",
    keyBenefits: [
      "Diseño estratégico de arquitecturas modernas (Data Lakehouse, Data Mesh).",
      "Definición de políticas de almacenamiento, integración y gobierno de datos.",
      "Habilidades de liderazgo técnico para decisiones tecnológicas corporativas."
    ],
    priceInfo: "Financiamiento directo sin intereses y convenios corporativos.",
    goal: "Data Architect prepara a los estudiantes para diseñar arquitecturas de datos modernas, escalables y seguras que soporten las necesidades analíticas y operativas de una organización.",
    whenToRecommend: "Recomiéndalo cuando el prospecto quiere diseñar plataformas de datos, busca asumir un rol de mayor liderazgo técnico, o está interesado en gobierno, seguridad y organización de ecosistemas de datos.",
    whenNotToRecommend: "Evita recomendar este programa cuando el prospecto quiere aprender análisis de datos (dashboards), busca construir pipelines de datos como actividad principal (ETL), o está comenzando desde cero.",
    validationQuestions: [
      "¿Qué tipo de responsabilidades buscas asumir en proyectos de datos?",
      "¿Te interesa diseñar la plataforma o desarrollar los procesos dentro de ella?",
      "¿Has trabajado anteriormente con bases de datos o soluciones de datos?",
      "¿Quieres participar en decisiones de arquitectura tecnológica?",
      "¿Buscas prevenir o resolver problemas complejos de integración en el negocio?"
    ],
    positiveSignals: [
      "Habla de arquitectura de datos.",
      "Quiere diseñar soluciones escalables.",
      "Tiene interés en gobierno de datos.",
      "Busca liderar proyectos tecnológicos.",
      "Quiere definir la estructura de plataformas de datos."
    ],
    alertSignals: [
      "Quiere crear dashboards.",
      "Busca aprender únicamente análisis de datos.",
      "Su objetivo principal es construir pipelines.",
      "Está iniciando sin experiencia y busca un primer acercamiento al área."
    ],
    howToPresent: "Data Architect está dirigido a profesionales que quieren diseñar la estructura sobre la que funcionan las plataformas de datos de una organización. Aprenderás a tomar decisiones de arquitectura que permitan construir soluciones escalables, seguras y preparadas para el crecimiento.",
    liveModalityRule: "Quiere interactuar constantemente con el instructor, resolver dudas durante las clases y analizar casos prácticos corporativos.",
    asyncModalityRule: "Necesita flexibilidad para estudiar, vive en otro país o prefiere avanzar a su propio ritmo.",
    relatedPrograms: ["ai-data-engineer", "mlops-engineer", "ia-generativa-en-databricks"],
    commonErrors: [
      "Confundir el rol de Data Architect con el de Data Engineer.",
      "Presentarlo únicamente como un curso de bases de datos.",
      "Explicar primero las tecnologías sin contextualizar el rol estratégico del arquitecto.",
      "Recomendarlo a personas que apenas están explorando el mundo de los datos."
    ],
    advisorSummary: "Si el prospecto quiere diseñar la arquitectura de plataformas de datos, definir estrategias tecnológicas y asumir un rol de liderazgo en proyectos de datos, Data Architect es la mejor recomendación."
  },
  {
    id: "mlops-engineer",
    name: "MLOps Engineer",
    duration: "12 Semanas (3 meses)",
    modality: "Online En Vivo / Asincrónico",
    target: "Científicos de datos y desarrolladores que desean especializarse en la puesta en producción y monitoreo de modelos de IA.",
    description: "Prepara a los estudiantes para implementar, desplegar, monitorear y mantener modelos de Machine Learning e IA en entornos reales de producción.",
    keyBenefits: [
      "Automatización de pipelines CI/CD orientados a Machine Learning (MLOps).",
      "Monitoreo, versionamiento y gobernanza de modelos de Inteligencia Artificial.",
      "Uso de contenedores y orquestación con Docker y Kubernetes."
    ],
    priceInfo: "Financiamiento corporativo y opciones de pago en cuotas.",
    goal: "MLOps Engineer prepara a los estudiantes para implementar, desplegar, monitorear y mantener modelos de Machine Learning e Inteligencia Artificial en entornos reales de producción.",
    whenToRecommend: "Recomiéndalo cuando el prospecto quiere aprender a llevar modelos de IA a producción, busca automatizar procesos de despliegue y monitoreo, o tiene interés en la operación de soluciones de Machine Learning.",
    whenNotToRecommend: "Evita recomendar este programa cuando el prospecto está comenzando desde cero en Inteligencia Artificial, busca aprender análisis de datos, o quiere enfocarse exclusivamente en el entrenamiento de modelos.",
    validationQuestions: [
      "¿Qué tipo de proyectos de IA te interesa desarrollar?",
      "¿Has trabajado con modelos de Machine Learning o IA?",
      "¿Te interesa construir modelos o llevarlos a producción?",
      "¿Buscas trabajar en entornos empresariales donde la IA ya está en funcionamiento?",
      "¿Qué conocimientos técnicos tienes actualmente?"
    ],
    positiveSignals: [
      "Habla de despliegue de modelos.",
      "Quiere automatizar procesos de Machine Learning.",
      "Tiene interés en ambientes de producción.",
      "Busca escalabilidad y operación de soluciones de IA.",
      "Quiere especializarse en MLOps."
    ],
    alertSignals: [
      "Quiere aprender IA desde cero.",
      "Busca únicamente análisis de datos.",
      "Su interés principal es desarrollar aplicaciones con IA.",
      "Espera un programa enfocado únicamente en crear modelos."
    ],
    howToPresent: "MLOps Engineer está pensado para quienes quieren que los modelos de Inteligencia Artificial funcionen de manera confiable en entornos reales. Aprenderás a desplegarlos, monitorearlos y administrar todo su ciclo de vida para que generen valor dentro de una organización.",
    liveModalityRule: "Quiere acompañamiento permanente del instructor, prefiere resolver dudas en las clases y desarrollar proyectos guiados.",
    asyncModalityRule: "Necesita flexibilidad de horario, vive en otro país o prefiere avanzar a su propio ritmo.",
    relatedPrograms: ["ai-data-engineer", "data-architect", "ai-solution-architect"],
    commonErrors: [
      "Confundir MLOps con Machine Learning puro.",
      "Presentarlo como un programa para aprender IA desde cero.",
      "Explicar primero las tecnologías sin contextualizar el rol del MLOps Engineer.",
      "Recomendarlo a personas cuyo objetivo principal es crear dashboards."
    ],
    advisorSummary: "Si el prospecto quiere especializarse en el despliegue, monitoreo y operación de modelos de Inteligencia Artificial en entornos de producción, MLOps Engineer es la mejor recomendación."
  },
  {
    id: "ia-generativa-en-databricks",
    name: "IA Generativa en Databricks",
    duration: "8 Semanas (2 meses)",
    modality: "Online En Vivo / Asincrónico",
    target: "Profesionales de datos e IA que desean implementar soluciones de IA Generativa en el ecosistema Databricks.",
    description: "Prepara a los estudiantes para desarrollar e implementar soluciones de Inteligencia Artificial Generativa utilizando el ecosistema de Databricks.",
    keyBenefits: [
      "Desarrollo de pipelines RAG avanzados e IA generativa en Databricks.",
      "Integración nativa con data Lakehouses y gobernanza con Unity Catalog.",
      "Optimización, Fine-Tuning y despliegue de LLMs empresariales."
    ],
    priceInfo: "Pago único o 3 cuotas mensuales sin intereses.",
    goal: "IA Generativa en Databricks prepara a los estudiantes para desarrollar e implementar soluciones de Inteligencia Artificial Generativa utilizando el ecosistema de Databricks, integrando datos, modelos de lenguaje y herramientas modernas en escenarios empresariales.",
    whenToRecommend: "Recomiéndalo cuando el prospecto quiere aprender IA Generativa utilizando Databricks, tiene interés en plataformas modernas de datos, o busca aplicar modelos de lenguaje en entornos empresariales de gran escala.",
    whenNotToRecommend: "Evita recomendar este programa cuando el prospecto está dando sus primeros pasos en tecnología, busca aprender programación desde cero, o quiere enfocarse exclusivamente en análisis de datos.",
    validationQuestions: [
      "¿Qué experiencia tienes trabajando con datos o plataformas de datos?",
      "¿Qué te interesa de la IA Generativa?",
      "¿Buscas especializarte en una tecnología utilizada por empresas?",
      "¿Quieres desarrollar soluciones de IA sobre plataformas modernas?",
      "¿Cómo esperas aplicar estos conocimientos en tu trabajo o proyectos?"
    ],
    positiveSignals: [
      "Habla de IA Generativa aplicada a empresas.",
      "Tiene interés en Databricks.",
      "Busca integrar datos e Inteligencia Artificial.",
      "Quiere fortalecer su perfil profesional en tecnologías empresariales.",
      "Le interesa desarrollar soluciones escalables."
    ],
    alertSignals: [
      "Busca aprender programación desde cero.",
      "Solo quiere crear dashboards.",
      "No tiene interés en plataformas de datos.",
      "Busca un programa introductorio de Inteligencia Artificial."
    ],
    howToPresent: "IA Generativa en Databricks está dirigido a quienes quieren aprender a desarrollar soluciones de Inteligencia Artificial Generativa sobre una de las plataformas de datos más utilizadas por las empresas. Aprenderás a integrar datos y modelos de IA para resolver casos de uso reales en entornos empresariales.",
    liveModalityRule: "Quiere acompañamiento directo de un instructor certificado, resolver dudas técnicas al instante y realizar prácticas de laboratorio guiadas.",
    asyncModalityRule: "Necesita flexibilidad de horario, vive en otro país o prefiere avanzar a su propio ritmo sin horarios rígidos.",
    relatedPrograms: ["ai-data-engineer", "data-architect", "mlops-engineer", "ai-solution-architect"],
    commonErrors: [
      "Presentarlo únicamente como un curso básico de Databricks.",
      "Asumir que cualquier persona interesada en IA necesita este programa.",
      "Explicar primero la plataforma en lugar del problema de negocio que ayuda a resolver.",
      "Recomendarlo sin validar el interés del prospecto en plataformas modernas de datos e IA."
    ],
    advisorSummary: "Si el prospecto quiere desarrollar soluciones de Inteligencia Artificial Generativa utilizando Databricks, integrar datos con modelos de IA y fortalecer su perfil en tecnologías empresariales, IA Generativa en Databricks es la mejor recomendación."
  }
];

export const OBJECTIONS: Objection[] = [
  {
    id: "no-time",
    title: "⏳ No tengo tiempo / Trabajo todo el día",
    commonPhrases: [
      "No tengo tiempo para estudiar",
      "Trabajo hasta tarde y llego muy cansado",
      "Me da miedo matricularme y no poder asistir"
    ],
    rebuttalStrategy: "No asumir que el problema es únicamente el horario. Primero identifica si le preocupa asistir, cumplir actividades o sostener el ritmo. Después presenta la modalidad y el acompañamiento que realmente correspondan al programa.",
    explorationQuestion: "¿Qué sería lo más difícil para ti: conectarte a las sesiones, sacar tiempo para practicar o mantener la constancia?",
    suggestedScript: "\"Te entiendo; antes de recomendarte una modalidad quiero asegurarme de que puedas aprovecharla. ¿Qué sería lo más difícil para ti: conectarte a las sesiones, sacar tiempo para practicar o mantener la constancia? Según lo que me cuentes, revisamos si te conviene una edición en vivo o una alternativa asincrónica.\""
  },
  {
    id: "too-expensive",
    title: "💰 El precio es muy alto / No me alcanza",
    commonPhrases: [
      "Está muy caro",
      "No cuento con esa cantidad ahora",
      "Es mucha inversión en este momento"
    ],
    rebuttalStrategy: "Validar si la dificultad es el valor total, el momento de pago o que aún no percibe suficiente valor. No inventes retornos salariales ni descuentos; utiliza únicamente precios, enlaces y cupones vigentes.",
    explorationQuestion: "¿Lo que te frena es el valor total, pagarlo en este momento o que todavía no tienes claro si el programa vale la inversión?",
    suggestedScript: "\"Gracias por decírmelo con claridad. ¿Lo que te frena es el valor total, pagarlo en este momento o que todavía no tienes claro si el programa vale la inversión? Con eso puedo explicarte mejor el alcance y revisar únicamente las alternativas de pago que estén disponibles.\""
  },
  {
    id: "no-experience",
    title: "🧠 No tengo conocimientos previos / Vengo de otra área",
    commonPhrases: [
      "No sé programar",
      "¿Es necesario saber matemáticas avanzadas?",
      "Tengo miedo de perderme en las clases"
    ],
    rebuttalStrategy: "Diagnosticar su punto de partida antes de tranquilizarlo. Confirma los requisitos reales del programa y ofrece nivelación solamente cuando esté incluida oficialmente.",
    explorationQuestion: "¿Qué herramientas has utilizado hasta ahora, aunque sea de forma básica: Excel, bases de datos, programación o herramientas de IA?",
    suggestedScript: "\"No pasa nada si vienes de otra área; lo importante es recomendarte una ruta acorde con tu punto de partida. ¿Qué herramientas has utilizado hasta ahora, aunque sea de forma básica: Excel, bases de datos, programación o IA? Con eso revisamos si puedes ingresar directamente o si conviene comenzar por fundamentos.\""
  },
  {
    id: "guarantee",
    title: "🎓 ¿Me garantizan conseguir empleo?",
    commonPhrases: [
      "¿Me aseguran que conseguiré trabajo al terminar?",
      "¿Tienen bolsa laboral directa?"
    ],
    rebuttalStrategy: "Responder con transparencia: una formación no puede garantizar contratación. Explica los recursos de empleabilidad que estén vigentes y devuelve la conversación al objetivo, experiencia y compromiso del prospecto.",
    explorationQuestion: "¿Estás buscando tu primer empleo, cambiar de área o mejorar las oportunidades que ya tienes?",
    suggestedScript: "\"Sería irresponsable prometerte una contratación, porque también depende de tu experiencia, práctica y proceso de búsqueda. Lo que sí podemos hacer es ayudarte a desarrollar habilidades y proyectos relevantes. ¿Estás buscando tu primer empleo, cambiar de área o mejorar las oportunidades que ya tienes?\""
  },
  {
    id: "chose-competitor",
    title: "🤝 Elegí otra academia / Me fui con otra persona",
    commonPhrases: ["Ya compré con otra academia", "Me decidí por otro curso", "Otra persona me ofreció algo mejor"],
    rebuttalStrategy: "No desacreditar al competidor ni intentar revertir la decisión de inmediato. Agradece la sinceridad y busca entender el criterio de elección; esa información sirve para aprender y, si existe una brecha real, ofrecer ayuda sin presión.",
    explorationQuestion: "Gracias por contármelo. ¿Qué fue lo que más influyó en tu decisión: el contenido, la modalidad, el precio, la fecha o la confianza que te generó la propuesta?",
    suggestedScript: "\"Gracias por contármelo y espero que te vaya muy bien con tu elección. Para aprender y atenderte mejor en otra oportunidad, ¿qué fue lo que más influyó en tu decisión: el contenido, la modalidad, el precio, la fecha o la confianza que te generó la propuesta?\""
  },
  {
    id: "need-to-think",
    title: "🤔 Lo voy a pensar / Después te aviso",
    commonPhrases: ["Déjame pensarlo", "Yo te aviso", "Todavía no estoy seguro"],
    rebuttalStrategy: "Evitar perseguir al prospecto con un cierre forzado. Descubre qué necesita evaluar y acuerda un siguiente paso concreto.",
    explorationQuestion: "Claro, ¿qué parte necesitas evaluar con más calma para tomar la decisión?",
    suggestedScript: "\"Claro, es una decisión que vale la pena revisar bien. ¿Qué parte necesitas evaluar con más calma: el programa, el tiempo, la inversión o si realmente se ajusta a tu objetivo? Si quieres resolvemos esa duda ahora y acordamos cuándo retomarlo.\""
  },
  {
    id: "ask-someone",
    title: "👥 Debo consultarlo con alguien",
    commonPhrases: ["Tengo que hablarlo con mi pareja", "Debo pedir autorización en la empresa", "Lo consultaré con mi familia"],
    rebuttalStrategy: "Respeta que hay otra persona involucrada. Identifica qué información necesita el decisor y ofrece un resumen claro que el prospecto pueda compartir.",
    explorationQuestion: "¿Qué información necesitaría esa persona para ayudarles a tomar la decisión?",
    suggestedScript: "\"Por supuesto. ¿Qué información necesitaría esa persona para evaluar la decisión: alcance, horarios, inversión o resultados esperados? Puedo ayudarte a dejarle un resumen claro y luego retomamos la conversación.\""
  },
  {
    id: "not-right-now",
    title: "📅 Ahora no / Más adelante",
    commonPhrases: ["Quizás el próximo mes", "Este no es un buen momento", "Prefiero esperar"],
    rebuttalStrategy: "Diferenciar entre una fecha inconveniente y una prioridad insuficiente. Si el interés es real, acuerda una fecha de seguimiento; si no, evita insistir sin contexto.",
    explorationQuestion: "¿Qué tendría que cambiar para que sí fuera un buen momento para comenzar?",
    suggestedScript: "\"Entiendo. Para no insistirte sin sentido, ¿qué tendría que cambiar para que sí fuera un buen momento: tu disponibilidad, el presupuesto o la fecha de inicio? Si te parece, dejamos acordado cuándo volver a hablar.\""
  },
  {
    id: "online-doubt",
    title: "💻 No me gusta estudiar virtual / Prefiero presencial",
    commonPhrases: ["No aprendo bien virtual", "Me distraigo en línea", "Quiero clases presenciales"],
    rebuttalStrategy: "Indaga qué experiencia negativa tuvo y qué condición necesita para aprender. No presentes la virtualidad como perfecta para todos.",
    explorationQuestion: "¿Qué es lo que más te preocupa de estudiar virtual: la interacción, la disciplina o poder resolver dudas?",
    suggestedScript: "\"Es totalmente válido. ¿Qué es lo que más te preocupa de estudiar virtual: la interacción, mantener la disciplina o poder resolver dudas? Así revisamos si la metodología de este programa responde a eso o si conviene buscar otra modalidad.\""
  },
  {
    id: "content-doubt",
    title: "📚 No estoy seguro de que el contenido sea para mí",
    commonPhrases: ["No sé si ese temario me sirve", "Busco algo más avanzado", "Creo que eso ya lo sé"],
    rebuttalStrategy: "Volver al diagnóstico. Compara lo que ya sabe y lo que necesita lograr con módulos concretos; no recites toda la currícula.",
    explorationQuestion: "¿Qué sabes hacer hoy y qué te gustaría poder hacer al terminar que todavía no puedes?",
    suggestedScript: "\"Revisémoslo con algo concreto: ¿qué sabes hacer hoy y qué te gustaría poder hacer al terminar que todavía no puedes? Con esa diferencia podemos validar juntos si el contenido te aporta o si necesitas otra ruta.\""
  },
  {
    id: "certificate-validity",
    title: "🏅 ¿El certificado es válido?",
    commonPhrases: ["¿Quién certifica?", "¿Tiene validez internacional?", "¿Es un título oficial?"],
    rebuttalStrategy: "Explicar exactamente qué certificado se entrega y quién lo emite, sin llamarlo título profesional ni atribuirle homologaciones no confirmadas.",
    explorationQuestion: "¿Necesitas el certificado para una empresa, una convocatoria, tu hoja de vida o como preparación para una certificación externa?",
    suggestedScript: "\"Claro, y es importante aclararlo bien. ¿Necesitas el certificado para una empresa, una convocatoria, tu hoja de vida o como preparación para una certificación externa? Te confirmo exactamente qué documento entrega este programa y quién lo emite.\""
  },
  {
    id: "trust-doubt",
    title: "🔎 No conozco Datapath / No estoy seguro de confiar",
    commonPhrases: ["Nunca había escuchado de ustedes", "¿Cómo sé que es real?", "Quiero referencias"],
    rebuttalStrategy: "No responder a la defensiva. Pregunta qué evidencia le daría tranquilidad y comparte solo información verificable por canales oficiales.",
    explorationQuestion: "¿Qué te ayudaría a sentir mayor confianza: conocer la metodología, los docentes, experiencias de estudiantes o los canales oficiales?",
    suggestedScript: "\"Es normal que quieras verificar antes de invertir. ¿Qué te ayudaría a sentir mayor confianza: conocer la metodología, los docentes, experiencias de estudiantes o nuestros canales oficiales? Te comparto la información verificable que necesites.\""
  },
  {
    id: "free-content",
    title: "▶️ Eso lo puedo aprender gratis en internet",
    commonPhrases: ["En YouTube está gratis", "Hay cursos más baratos", "Puedo estudiarlo por mi cuenta"],
    rebuttalStrategy: "Reconocer que existe contenido gratuito. La comparación debe centrarse en ruta, práctica, acompañamiento y constancia, únicamente cuando el programa realmente los ofrezca.",
    explorationQuestion: "¿Qué sientes que te ha faltado al aprender por tu cuenta: una ruta, práctica, acompañamiento o constancia?",
    suggestedScript: "\"Sí, hoy existe muchísimo contenido gratuito y puede ser útil. La pregunta es qué necesitas para avanzar: ¿una ruta organizada, práctica, acompañamiento o mantener la constancia? Con eso podemos validar si un programa estructurado te aportaría algo diferente.\""
  }
];

export const PROFILES: Record<string, Profile> = {
  "tech-pro": {
    id: "tech-pro",
    title: "Ya trabajo en tecnología",
    icon: "Code",
    description: "Profesionales de TI (desarrolladores, analistas de datos, soporte) que buscan especializarse, subir de rango o actualizar sus conocimientos técnicos.",
    diagnosticGuide: `# Ya trabajo en tecnología\n\n## Descripción\nProfesionales que ya se desempeñan en el sector de TI (desarrolladores de software, analistas de datos/BI, ingenieros de soporte, administradores de redes o sistemas). Buscan escalar laboralmente, actualizar sus conocimientos técnicos o dar un salto hacia la especialización avanzada para mejorar sus ingresos y condiciones de trabajo.\n\n## Pregunta sugerida\n"¡Excelente! Siempre es bueno conversar con un colega de TI. Para darte la mejor recomendación: ¿Cuál es tu rol actual en tecnología y qué herramientas o lenguajes utilizas en tu día a día?"\n\n## Objetivo de la pregunta\nCalificar el punto de partida técnico del prospecto. Al hablar "de programador a programador", se rompe la barrera comercial y se establece una relación de confianza técnica. Permite segmentar el perfil inmediatamente en una de las tres sub-ramas: Desarrollo, Análisis o Infraestructura/Soporte.\n\n## Tip de venta\nNo asumas que por trabajar en tecnología ya lo sabe todo. Escucha activamente si el cliente está frustrado por la falta de crecimiento en su puesto actual, si siente que sus tareas se han vuelto rutinarias o si teme quedarse obsoleto frente al avance de la inteligencia artificial y las nuevas arquitecturas de datos.\n\n## Qué debe descubrir la asesora\n1. **La sub-especialidad**: ¿Es programador de software, analista de negocio/BI, o administrador de sistemas/redes?\n2. **El dolor del estancamiento**: ¿Por qué quiere capacitarse ahora? (¿Lears haciendo lo mismo?, ¿no le aumentan el sueldo?, ¿quiere pasar del backend tradicional a la analítica de datos/cloud?).\n3. **Familiaridad técnica**: ¿Qué lenguajes maneja? (SQL, Python, JavaScript, Java, etc.) para medir su nivel y viabilidad de especialización.\n\n## Posibles respuestas\n* **"Soy desarrollador web / programador backend / frontend"**: Suelen estar cansados del mantenimiento de software básico (CRUDs) o quieren migrar hacia roles de Inteligencia Artificial (Machine Learning) o Ingeniería de Datos (Big Data) buscando mejores ingresos.\n* **"Soy analista de datos / BI / reportes"**: Muchas veces se sienten limitados procesando datos de forma manual o lenta en Excel/Power BI, y necesitan dar el salto técnico a lenguajes como Python y bases de datos masivas.\n* **"Trabajo en soporte técnico / redes / redes de datos / SysAdmin"**: Típicamente están bajo mucha presión de horarios (soporte 24/7) y buscan evolucionar hacia DevOps y arquitectura Cloud para tener mayor estabilidad y mejores ingresos.\n\n## Programa principal\nN/A (La asignación y recomendación del programa académico se detalla en el Capítulo 07: Programas y Soluciones).\n\n## Programas alternativos\nN/A (La asignación y recomendación de alternativas académicas se detalla en el Capítulo 07: Programas y Soluciones).\n\n## Beneficios que debe vender\n* **Evolución de Carrera (Revalorización)**: Salir de puestos operativos de alta presión (soporte de escritorio, desarrollo repetitivo junior) hacia especializaciones estratégicas de alta demanda (Datos, Cloud, IA).\n* **Superación del Estancamiento**: Cómo la especialización técnica avanzada desbloquea mejores salarios y oportunidades remotas/internacionales.\n* **Actualización en Tendencias**: La importancia de dominar arquitecturas modernas para mantenerse relevante frente a la automatización de tareas TI tradicionales.\n\n## Momento para enviar el brochure\n*No enviar en esta etapa*. El brochure técnico o plan de estudios de un programa específico solo debe compartirse en la siguiente etapa de la venta, una vez que el diagnóstico del perfil de TI se haya completado y la asesora haya sustentado la recomendación.\n\n## Momento para hablar del precio\n*No hablar de precios en esta etapa*. Hablar de inversión durante la fase de diagnóstico desvía el foco de las necesidades del estudiante y destruye la experiencia de venta consultiva. La conversación sobre precios se reserva exclusivamente para la fase de cierre de valor.\n\n## Notas para la asesora\nA los profesionales de tecnología les genera mucha confianza que utilices terminología adecuada (SQL, Python, DevOps, Cloud) de forma natural, pero sin pretender saber más de su propio trabajo que ellos. Muestra interés genuino por su especialidad actual y usa sus propios términos técnicos para validar que entiendes sus dolores.`,
    startNodeId: "current-role",
    nodes: {
      "current-role": {
        id: "current-role",
        message: "¡Excelente! Siempre es bueno conversar con un colega de TI. Para darte la mejor recomendación: ¿Cuál es tu rol actual en tecnología y qué herramientas o lenguajes utilizas en tu día a día?",
        agentTip: "Califica el punto de partida técnico. Muestra interés genuino por su especialidad y usa sus propios términos técnicos para validar que entiendes sus dolores.",
        options: [
          {
            text: "Desarrollador / Programador Software",
            nextId: "developer-goal"
          },
          {
            text: "Analista de Datos / BI",
            nextId: "analyst-goal"
          },
          {
            text: "Soporte TI / Infraestructura / Redes",
            nextId: "sysadmin-goal"
          }
        ]
      },
      "developer-goal": {
        id: "developer-goal",
        message: "¿Cuál es tu principal meta a mediano plazo como desarrollador? ¿Qué tecnologías te interesa dominar para salir de tareas repetitivas?",
        agentTip: "Si muestra interés en diseñar soluciones o programar asistentes inteligentes, guíalo hacia AI Engineer o AI Solution Architect. Si prefiere Big Data, orienta a AI Data Engineer.",
        options: [
          {
            text: "Acelerar mi desarrollo, programar más rápido e incorporar herramientas de IA en mi flujo",
            recommendation: "Recomienda Claude Code for Developers. Es ideal para desarrolladores que ya programan y quieren multiplicar su velocidad mediante asistentes e inteligencia artificial.",
            suggestedPrograms: ["claude-code-for-developers"]
          },
          {
            text: "Especializarme en el desarrollo de asistentes y agentes inteligentes autónomos",
            recommendation: "Destaca AI Engineer o AI Agentic Engineer. Le permitirán programar agentes autónomos complejos, automatizar flujos y dominar LLMs.",
            suggestedPrograms: ["ai-engineer", "ai-agentic-engineer"]
          },
          {
            text: "Diseñar la arquitectura completa de IA o pipelines de datos masivos",
            recommendation: "Orienta a AI Solution Architect (para sistemas inteligentes) o AI Data Engineer (para flujos de Big Data distribuidos).",
            suggestedPrograms: ["ai-solution-architect", "ai-data-engineer"]
          }
        ]
      },
      "analyst-goal": {
        id: "analyst-goal",
        message: "Como analista, ya conoces el valor de la información. ¿Cuál sientes que es el siguiente paso que necesitas dar para consolidar tu perfil técnico?",
        agentTip: "Muchos analistas se sienten estancados haciendo reportes manuales en Excel y Power BI y quieren automatizar o procesar millones de registros.",
        options: [
          {
            text: "Automatizar flujos, pipelines y pasar de visualización básica a procesamiento masivo de datos",
            recommendation: "El paso de Analista a Data Engineer es uno de los saltos salariales más grandes. Enfatiza AI Data Engineer para dominar Spark, Python y bases de datos robustas.",
            suggestedPrograms: ["ai-data-engineer"]
          },
          {
            text: "Aprender a integrar IA generativa para modelos de lenguaje y soluciones avanzadas",
            recommendation: "Recomienda IA Generativa en Databricks. Le permitirá procesar y modelar IA sobre volúmenes de datos masivos a escala empresarial.",
            suggestedPrograms: ["ia-generativa-en-databricks"]
          }
        ]
      },
      "sysadmin-goal": {
        id: "sysadmin-goal",
        message: "En soporte e infraestructura se vive bajo mucha presión. ¿Te interesa moverte hacia el despliegue automático de modelos (nube/operaciones) o prefieres reorientarte al análisis estratégico?",
        agentTip: "Los perfiles de soporte se adaptan rápido a MLOps y Cloud debido a sus conocimientos de servidores y sistemas operativos.",
        options: [
          {
            text: "Llevar modelos de Inteligencia Artificial a producción y automatizar despliegues (MLOps)",
            recommendation: "MLOps Engineer es la evolución natural ideal. Reduce tareas manuales aplicando DevOps a los pipelines de Inteligencia Artificial.",
            suggestedPrograms: ["mlops-engineer"]
          },
          {
            text: "Dar un giro completo hacia el análisis o arquitectura de datos a gran escala",
            recommendation: "Sugerir Data Architect o Data Analyst, dependiendo de si busca el diseño estratégico de plataformas o la visualización de valor de negocio.",
            suggestedPrograms: ["data-architect", "data-analyst"]
          }
        ]
      }
    }
  },
  "career-switcher": {
    id: "career-switcher",
    title: "Quiero crecer o cambiar mi perfil profesional",
    icon: "TrendingUp",
    description: "Profesionales de otras carreras (administración, finanzas, marketing, salud) que quieren dar un salto al sector tecnológico buscando mejores salarios y flexibilidad.",
    diagnosticGuide: `# Quiero crecer o cambiar mi perfil profesional\n\n## Descripción\nPersonas que desean cambiar de profesión, buscan mejores oportunidades laborales o aumentar sus ingresos al sentir que su crecimiento profesional se ha estancado. A menudo no provienen del sector tecnológico, sino de disciplinas como administración, ingeniería tradicional, mercadeo, salud, educación o finanzas, y desean adentrarse en inteligencia artificial, datos, automatización o cloud.\n\n## Pregunta sugerida\n"¡Excelente! Gracias por compartirlo. Veo que estás buscando crecer profesionalmente o incluso dar un cambio importante en tu carrera, y me gustaría entender un poco mejor tu situación para recomendarte la formación que realmente se adapte a tus objetivos. ¿Podrías contarme a qué te dedicas actualmente y qué te motivó a buscar este cambio profesional?"\n\n## Objetivo de la pregunta\nIdentificar el perfil del prospecto, comprender su contexto actual y descubrir qué lo motiva a buscar un cambio profesional para poder realizar una recomendación personalizada en la siguiente etapa del proceso.\n\n## Tip de venta\nEn esta etapa evita hablar de programas. Concéntrate en comprender la motivación del prospecto y generar confianza. Las personas que buscan cambiar de carrera suelen sentir inseguridad sobre si su experiencia previa será suficiente o si realmente podrán aprender programación o tecnologías complejas. Escucha primero. La recomendación llegará después.\n\n## Qué debe descubrir la asesora\n- ¿A qué se dedica actualmente y qué lo motiva a buscar un cambio?\n- ¿Qué espera conseguir con esta formación?\n- ¿Tiene experiencia previa (aunque sea mínima) en tecnología?\n- ¿Cuánto tiempo puede dedicar al aprendizaje?\n- ¿Busca un cambio total de carrera o fortalecer su perfil actual incorporando nuevas habilidades?\n\n## Posibles respuestas\n* **"Quiero cambiar completamente de profesión"**: Indica que se siente limitado en su trabajo actual o busca oportunidades en un sector con mayor crecimiento. (Profundiza preguntando: ¿Qué es lo que más te motiva de ese cambio?, ¿has tenido algún acercamiento previo a la tecnología?).\n* **"Quiero fortalecer mi perfil actual"**: No necesariamente desea cambiar de carrera, sino incorporar nuevas habilidades para crecer dentro de su profesión actual. (Profundiza preguntando: ¿Cómo imaginas aplicar estos conocimientos en tu trabajo actual?, ¿qué retos enfrentas hoy que te gustaría resolver?).\n* **"Busco mejores oportunidades laborales o aumentar mis ingresos"**: Su motivación principal es económica o de estabilidad laboral. (Profundiza preguntando: ¿Qué tipo de oportunidades te gustaría alcanzar?, ¿hay algún rol específico que tengas en mente?).\n\n## Programa principal\nN/A (La recomendación se realizará en el Capítulo 07 una vez finalice el diagnóstico).\n\n## Programas alternativos\nN/A (La recomendación se realizará en el Capítulo 07 una vez finalice el diagnóstico).\n\n## Beneficios que debe vender\n* **Combinación de Experiencia (Súper Poder)**: Su conocimiento de negocio previo (finanzas, marketing, etc.) sumado a habilidades de datos/IA los hace perfiles sumamente valorados y únicos.\n* **Acompañamiento y Nivelación**: Mitigar el miedo al fracaso explicando que los bootcamps inician desde cero e incluyen propedéuticos de nivelación.\n* **Crecimiento y Flexibilidad**: Mayores salarios, flexibilidad de trabajo remoto y mercado laboral dinámico en tecnología.\n\n## Momento para enviar el brochure\n*No enviar en esta etapa*. Primero debemos comprender el perfil y las necesidades del prospecto. Compartir planes de estudio de manera prematura abruma al prospecto que viene de otra área.\n\n## Momento para hablar del precio\n*No hablar de precios en esta etapa*. La conversación debe mantenerse enfocada en el diagnóstico y la generación de valor. Hablar de inversión antes de resolver el temor al cambio de carrera ahuyenta al cliente.\n\n## Notas para la asesora\nAsegúrate de completar el siguiente checklist antes de avanzar a la fase de recomendación:\n- [ ] Conozco su profesión actual.\n- [ ] Comprendo la razón por la que busca un cambio.\n- [ ] Identifiqué sus objetivos profesionales.\n- [ ] Sé si tiene alguna experiencia técnica previa.\n- [ ] Conozco sus expectativas frente a la formación.`,
    startNodeId: "background-type",
    nodes: {
      "background-type": {
        id: "background-type",
        message: "¡Qué gran decisión! El sector tecnológico recibe con los brazos abiertos a profesionales de todas las áreas porque traen conocimiento de negocio único. ¿De qué área provienes principalmente?",
        agentTip: "Valora siempre su profesión actual. Explica que la combinación de su profesión + herramientas de datos/IA es un súper poder.",
        options: [
          {
            text: "Negocios, Administración, Finanzas o Marketing",
            nextId: "business-path"
          },
          {
            text: "Ingenierías tradicionales (Industrial, Civil, Química, etc.)",
            nextId: "engineering-path"
          },
          {
            text: "Otras áreas (Salud, Educación, Ciencias Sociales, Ventas)",
            nextId: "other-path"
          }
        ]
      },
      "business-path": {
        id: "business-path",
        message: "En negocios y finanzas, las decisiones ya no se toman por 'intuición', sino con datos. ¿Te gustaría liderar la toma de decisiones visualizando datos estratégicos, o te llama más la atención la automatización y arquitectura técnica?",
        agentTip: "Los profesionales de negocios brillan como Data Analysts porque entienden la métrica del negocio. Es el camino con menor fricción.",
        options: [
          {
            text: "Crear reportes visuales, dashboards y liderar decisiones de negocio con analítica",
            recommendation: "Presenta el programa de Data Analyst. Aprenderá SQL y Power BI para traducir números en historias y decisiones sin requerir bases complejas de código al inicio.",
            suggestedPrograms: ["data-analyst"]
          },
          {
            text: "Construir e integrar pipelines de datos e infraestructura más técnica",
            recommendation: "Si prefiere la lógica técnica del backend, guíalo hacia AI Data Engineer. Deberá comprometerse a estudiar fuertemente la nivelación.",
            suggestedPrograms: ["ai-data-engineer"]
          }
        ]
      },
      "engineering-path": {
        id: "engineering-path",
        message: "Como ingeniero, ya tienes una fuerte estructura mental y pensamiento lógico. ¿Qué enfoque te llama más la atención para potenciar tu carrera?",
        agentTip: "Los ingenieros tienen facilidad para la programación. Pueden apuntar tanto a analítica como a ingeniería de datos o modelado predictivo.",
        options: [
          {
            text: "Especializarme en la infraestructura, flujos y pipelines de datos masivos",
            recommendation: "AI Data Engineer es perfecto para ingenieros. La base lógica de ingeniería acelera su aprendizaje de Spark y Airflow.",
            suggestedPrograms: ["ai-data-engineer"]
          },
          {
            text: "Analizar datos estratégicamente para optimizar procesos y tomar decisiones",
            recommendation: "Data Analyst le permitirá liderar proyectos de mejora continua y control de calidad usando dashboards interactivos e insights prácticos.",
            suggestedPrograms: ["data-analyst"]
          }
        ]
      },
      "other-path": {
        id: "other-path",
        message: "Sin importar tu rubro actual, los datos están en todas partes. ¿Te gustaría empezar con una ruta amigable que no requiera conocimientos previos de programación, o prefieres ir a fondo con la parte de la nube?",
        agentTip: "Para perfiles sin background cuantitativo o técnico, se recomienda empezar con Data Analyst por su curva de aprendizaje suave.",
        options: [
          {
            text: "Iniciar con una curva de aprendizaje suave (sin programar al inicio)",
            recommendation: "Recomienda firmemente Data Analyst. Es el punto de entrada más amigable, enseñando herramientas sumamente intuitivas y demandadas.",
            suggestedPrograms: ["data-analyst"]
          },
          {
            text: "Aprender sobre arquitectura en la nube e IA empresarial",
            recommendation: "Presenta AI Solution Architect, aclarando que requiere alta dedicación en la nivelación pero es ideal para tener visión técnica estratégica.",
            suggestedPrograms: ["ai-solution-architect"]
          }
        ]
      }
    }
  },
  "student": {
    id: "student",
    title: "Soy estudiante",
    icon: "GraduationCap",
    description: "Estudiantes universitarios o técnicos de últimos ciclos que quieren asegurar su inserción laboral en tecnología o potenciar sus proyectos de tesis/investigación.",
    diagnosticGuide: `# Soy estudiante\n\n## Descripción\nEstudiantes universitarios, técnicos o tecnológicos de últimos ciclos que desean complementar su formación teórica con habilidades prácticas del mercado laboral real, asegurar su inserción laboral o destacar en sus primeras prácticas preprofesionales.\n\n## Pregunta sugerida\n"¡Excelente! Gracias por compartirlo. Veo que actualmente te encuentras estudiando y me gustaría conocer un poco más sobre tu proceso para recomendarte la formación que realmente aporte valor a tus objetivos. ¿Podrías contarme qué estás estudiando actualmente y qué te gustaría lograr mientras continúas tu formación?"\n\n## Objetivo de la pregunta\nIdentificar el perfil del estudiante, comprender sus objetivos profesionales y conocer su punto de partida técnico o académico antes de proponer cualquier solución académica.\n\n## Tip de venta\nMuchos estudiantes llegan con entusiasmo, pero también con mucha incertidumbre y confusión sobre los roles en TI. No des por hecho que conocen las diferencias entre Ciencia de Datos, Ingeniería de Datos o DevOps. Ayúdalos a descubrir cuál camino tiene más sentido según sus intereses y habilidades. El objetivo no es vender rápido, sino orientar correctamente su desarrollo.\n\n## Qué debe descubrir la asesora\n- ¿Qué estudia actualmente y en qué semestre o etapa de formación se encuentra?\n- ¿Qué conocimientos previos (lenguajes, bases de datos) posee?\n- ¿Qué área de la tecnología le interesa desarrollar?\n- ¿Qué espera conseguir con esta formación adicional?\n- ¿Busca complementar sus estudios teóricos o prepararse directamente para conseguir empleo?\n\n## Posibles respuestas\n* **"Quiero conseguir mi primer empleo / prácticas"**: Generalmente busca fortalecer su currículum y diferenciarse de otros egresados. (Profundiza preguntando: ¿En qué área o rol te gustaría trabajar?, ¿has realizado proyectos relacionados con esa área?).\n* **"Quiero complementar lo que aprendo en la universidad"**: Busca adquirir habilidades prácticas que normalmente no desarrolla durante su formación académica formal. (Profundiza preguntando: ¿Qué temas sientes que te gustaría aprender con mayor profundidad?, ¿hay alguna tecnología que te interese especialmente?).\n* **"Tengo curiosidad por la Inteligencia Artificial"**: Ha visto el crecimiento acelerado del sector y quiere prepararse para futuras oportunidades del mercado. (Profundiza preguntando: ¿Qué fue lo que despertó tu interés por la IA?, ¿has utilizado alguna herramienta de IA anteriormente?).\n* **"Aún no tengo claro qué camino seguir"**: Su principal necesidad en este momento es orientación. En este caso la conversación debe enfocarse en descubrir qué tipo de tareas prefiere antes de pensar en una recomendación.\n\n## Programa principal\nN/A (La recomendación se realizará en el Capítulo 07 una vez finalice el diagnóstico).\n\n## Programas alternativos\nN/A (La recomendación se realizará en el Capítulo 07 una vez finalice el diagnóstico).\n\n## Beneficios que debe vender\n* **Portafolio de Proyectos (Experiencia Demostrable)**: La mejor manera de suplir la "falta de experiencia laboral" en su CV es demostrando proyectos prácticos resueltos en Datapath.\n* **Competitividad en el mercado**: Salir al mercado laboral sabiendo usar herramientas en vivo y bases de datos que la universidad no enseña a nivel práctico.\n* **Bolsa de Empleo y Red de Mentores**: Acceso directo al portal de reclutamiento de Datapath y mentoría técnica con profesionales en activo.\n\n## Momento para enviar el brochure\n*No enviar en esta etapa*. Primero debemos comprender el perfil del estudiante y sus objetivos académicos para sugerir el brochure correcto.\n\n## Momento para hablar del precio\n*No hablar de precios en esta etapa*. La conversación debe mantenerse enfocada en conocer al prospecto y generar confianza. Presentar el precio a un estudiante sin haber mostrado cómo le ayudará a conseguir empleo genera rechazo inmediato por motivos presupuestarios.\n\n## Notas para la asesora\nAsegúrate de completar el siguiente checklist antes de avanzar a la fase de recomendación de programas:\n- [ ] Conozco qué estudia actualmente.\n- [ ] Sé en qué etapa de formación/ciclo se encuentra.\n- [ ] Identifiqué qué conocimientos previos posee.\n- [ ] Comprendo cuál es su principal objetivo.\n- [ ] Identifiqué qué área tecnológica despierta mayor interés en el prospecto.`,
    startNodeId: "study-area",
    nodes: {
      "study-area": {
        id: "study-area",
        message: "¡Qué excelente iniciativa! Empezar antes de egresar te pondrá años luz por delante de tus compañeros. ¿Qué carrera estás estudiando actualmente?",
        agentTip: "A los estudiantes les preocupa mucho la inserción laboral y no tener experiencia en su CV. Destaca la bolsa de empleo y el portafolio de proyectos.",
        options: [
          {
            text: "Sistemas, Informática, Software o afines",
            nextId: "cs-student"
          },
          {
            text: "Administración, Economía, Industrial o Negocios",
            nextId: "business-student"
          },
          {
            text: "Otras carreras / Humanidades / Salud",
            nextId: "other-student"
          }
        ]
      },
      "cs-student": {
        id: "cs-student",
        message: "En la universidad enseñan mucha teoría, pero el mercado laboral pide herramientas modernas. ¿Qué área de especialización práctica te gustaría añadir a tu perfil académico?",
        agentTip: "Los estudiantes de sistemas ya tienen bases lógicas pero les falta experiencia práctica con Big Data o agentes autónomos reales. Resalta los laboratorios de Datapath.",
        options: [
          {
            text: "Ingeniería de Datos a gran escala (Spark, Pipelines ETL)",
            recommendation: "Oriéntalo al programa de AI Data Engineer. Dominar Big Data, Spark y Airflow lo hará destacar inmediatamente en procesos de reclutamiento corporativo.",
            suggestedPrograms: ["ai-data-engineer"]
          },
          {
            text: "Desarrollo de asistentes y aplicaciones con Inteligencia Artificial",
            recommendation: "AI Engineer es excelente para aprender a integrar LLMs, construir asistentes y automatizaciones prácticas listas para el portafolio.",
            suggestedPrograms: ["ai-engineer"]
          },
          {
            text: "Puesta en producción de modelos y automatización DevOps (MLOps)",
            recommendation: "MLOps Engineer es un perfil muy escaso y cotizado. Aprender CI/CD para modelos e infraestructura le dará un perfil premium.",
            suggestedPrograms: ["mlops-engineer"]
          }
        ]
      },
      "business-student": {
        id: "business-student",
        message: "¿Te gustaría graduarte sabiendo hacer análisis de datos moderno para destacar en tus primeras prácticas profesionales?",
        agentTip: "Las empresas valoran a los practicantes que saben Power BI y SQL porque automatizan tareas de reportabilidad que les toman días al resto del equipo.",
        options: [
          {
            text: "Sí, quiero dominar dashboards, Power BI y reportes automatizados",
            recommendation: "El programa de Data Analyst es perfecto. Dominar SQL y dashboards interactivos le garantizará ingresar a excelentes áreas de negocio.",
            suggestedPrograms: ["data-analyst"]
          }
        ]
      },
      "other-student": {
        id: "other-student",
        message: "¿Tu meta es complementar tu carrera con una habilidad de alta demanda de analítica para no tener problemas al egresar?",
        agentTip: "Enfatiza que saber de datos es hoy una competencia transversal obligatoria en cualquier sector del mercado profesional.",
        options: [
          {
            text: "Quiero aprender a analizar datos y visualización aplicada a mi campo de estudio",
            recommendation: "Recomienda Data Analyst. Le dará la capacidad de realizar tesis o proyectos académicos basados en datos reales, marcando la diferencia.",
            suggestedPrograms: ["data-analyst"]
          }
        ]
      }
    }
  },
  "corporate": {
    id: "corporate",
    title: "Capacitación empresarial",
    icon: "Building",
    description: "Representantes de empresas, gerentes de TI o recursos humanos que buscan capacitar a sus equipos comerciales, de analistas o de infraestructura.",
    diagnosticGuide: `# Capacitación empresarial\n\n## Descripción\nRepresentantes de empresas, gerentes de TI, líderes de equipo o directores de Recursos Humanos que buscan capacitar a sus colaboradores para aumentar la productividad, optimizar procesos, adoptar nuevas tecnologías o resolver problemas de rendimiento técnico dentro de la organización.\n\n## Pregunta sugerida\n"¡Excelente! Gracias por compartirlo. Para poder orientarte correctamente, me gustaría entender un poco mejor las necesidades de tu empresa. ¿Podrías contarme qué objetivo buscan alcanzar con esta capacitación y qué tipo de equipo participaría en ella?"\n\n## Objetivo de la pregunta\nIdentificar las necesidades formativas de la organización, los retos del equipo y los resultados esperados para poder proponer una recomendación y estructura de capacitación B2B a medida.\n\n## Tip de venta\nEn las conversaciones B2B evita asumir que la empresa busca únicamente un curso estándar. Primero comprende qué problema de negocio desea resolver y cuál sería el impacto esperado en su rentabilidad o eficiencia. Ten en cuenta que quien inicia la conversación a veces no es el tomador de decisión final, por lo que también debes descubrir cómo funciona su proceso de decisión interno (compras, TI, RRHH).\n\n## Qué debe descubrir la asesora\n- ¿Qué tipo de empresa es y en qué sector opera?\n- ¿Cuál es el objetivo principal de la capacitación (productividad, adopción tecnológica)?\n- ¿Qué áreas, equipos y cantidad aproximada de colaboradores participarán?\n- ¿Qué conocimientos previos (lenguajes, herramientas) posee el equipo técnico actualmente?\n- ¿Qué resultados de negocio específicos espera obtener la organización tras el entrenamiento?\n\n## Posibles respuestas\n* **"Buscamos aumentar la productividad o eficiencia"**: La empresa quiere optimizar procesos existentes, reducir tiempos manuales o automatizar tareas repetitivas de reportes. (Profundiza preguntando: ¿Qué procesos desean mejorar actualmente?, ¿qué cuellos de botella enfrentan hoy?).\n* **"Queremos preparar al equipo para nuevas tecnologías"**: La organización busca mantenerse competitiva e incorporar herramientas modernas en el día a día. (Profundiza preguntando: ¿Qué tecnologías o herramientas desean incorporar?, ¿el equipo ya tiene experiencia previa?).\n* **"Necesitamos desarrollar nuevas capacidades en el equipo"**: La empresa está iniciando un nuevo proyecto, migrando su arquitectura o expandiendo sus servicios técnicos. (Profundiza preguntando: ¿Qué habilidades consideran prioritarias para este proyecto?, ¿existe un plazo o fecha límite para alcanzar ese objetivo?).\n* **"Aún estamos explorando opciones"**: Todavía no tienen completamente definido el plan de capacitación. En este caso la conversación debe enfocarse en comprender el contexto del negocio antes de sugerir cualquier solución formativa.\n\n## Programa principal\nN/A (La recomendación se realizará en el Capítulo 07 una vez finalice el diagnóstico).\n\n## Programas alternativos\nN/A (La recomendación se realizará en el Capítulo 07 una vez finalice el diagnóstico).\n\n## Beneficios que debe vender\n* **Retorno de Inversión (ROI)**: Ahorro sustancial de horas-hombre automatizando procesos y optimizando infraestructuras técnicas.\n* **Casos Prácticos Aplicados**: Flexibilidad para adaptar los talleres de aprendizaje utilizando datos simulados de su propia industria.\n* **Reportes de Desempeño**: Informes detallados sobre la asistencia, entrega de proyectos y calificaciones de sus colaboradores para Recursos Humanos o Gerencia.\n\n## Momento para enviar el brochure\n*No enviar en esta etapa*. Primero debemos comprender las necesidades de la organización y de su equipo para seleccionar la propuesta comercial adecuada.\n\n## Momento para hablar del precio\n*No hablar de precios en esta etapa*. La conversación debe mantenerse enfocada en el diagnóstico y en entender el contexto corporativo. Los precios B2B dependen de factores de escala (cantidad de estudiantes) y nivel de personalización, por lo que requiere una cotización estructurada posterior.\n\n## Notas para la asesora\nCompleta el siguiente checklist antes de pasar a la fase de recomendación de soluciones empresariales:\n- [ ] Identifiqué el tipo de empresa y su rubro.\n- [ ] Comprendo el objetivo de la capacitación.\n- [ ] Mapeé el área o equipo que recibirá el entrenamiento.\n- [ ] Sé la cantidad aproximada de participantes.\n- [ ] Identifiqué el nivel de conocimientos del equipo.\n- [ ] Comprendo los resultados concretos que espera obtener la organización.`,
    startNodeId: "corporate-need",
    nodes: {
      "corporate-need": {
        id: "corporate-need",
        message: "Bienvenido. Datapath ofrece planes corporativos personalizados con metodologías adaptadas a los objetivos de negocio de su organización. ¿Cuál es la principal necesidad del equipo que desea capacitar?",
        agentTip: "Esta es una venta B2B. El tomador de decisiones valora: ROI, personalización, reportes de asistencia/desempeño de los colaboradores, y casos prácticos con data propia.",
        options: [
          {
            text: "Nivelar o capacitar a nuestro equipo en toma de decisiones y reportabilidad analítica (BI)",
            nextId: "corp-bi"
          },
          {
            text: "Capacitar a nuestro equipo técnico en arquitecturas de datos avanzadas, nube o IA Generativa",
            nextId: "corp-ti"
          }
        ]
      },
      "corp-bi": {
        id: "corp-bi",
        message: "¿Qué nivel de conocimiento tiene el equipo actualmente? ¿Utilizan principalmente Excel?",
        agentTip: "Si usan Excel, resalta que migrar a SQL y Power BI ahorrará cientos de horas hombre semanales en la generación de reportes recurrentes.",
        options: [
          {
            text: "Nivel inicial/intermedio (usan mucho Excel y quieren migrar a Power BI/SQL)",
            recommendation: "Ofrecer el Bootcamp corporativo de Data Analyst. Datapath puede adaptar los casos de estudio usando datos simulados de su propia industria para que el aprendizaje sea inmediato.",
            suggestedPrograms: ["data-analyst"]
          }
        ]
      },
      "corp-ti": {
        id: "corp-ti",
        message: "¿En qué nube o arquitectura técnica está enfocada la empresa actualmente para desplegar sus soluciones?",
        agentTip: "Destaca la flexibilidad de Datapath para armar workshops a la medida de la infraestructura y el uso de Databricks o arquitecturas modernas.",
        options: [
          {
            text: "IA Generativa aplicada sobre nuestra plataforma de datos (Databricks)",
            recommendation: "Ofrecer la formación de IA Generativa en Databricks corporativa, ideal para que sus ingenieros y científicos implementen LLMs de forma segura.",
            suggestedPrograms: ["ia-generativa-en-databricks"]
          },
          {
            text: "Estructurar y diseñar la arquitectura completa de datos corporativa",
            recommendation: "Ofrecer Data Architect. Ideal para que definan gobierno, almacenamiento y políticas de gobernanza escalables.",
            suggestedPrograms: ["data-architect"]
          }
        ]
      }
    }
  }
};
