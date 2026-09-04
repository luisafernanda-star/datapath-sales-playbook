import curricula from "../data/generatedCurricula.json";

export type CurriculaEdition = {
  key: string;
  program: string;
  edition: string;
  startDate: string;
  format: string;
  sheetId: number;
  sessions: Array<{ session: number; date: string; format: string; module: string; content: string }>;
};

export type CurriculaProgram = { program: string; editions: CurriculaEdition[] };

const PROGRAM_ALIASES: Record<string, string[]> = {
  "AI Solution Architect": ["AI Solution Architect"],
  "AI Engineer": ["AI Engineer"],
  "Data Analyst": ["DAP", "Data Analytics con IA", "DA & Dashboards con IA"],
  "AI Data Engineer": ["DEP AI", "DEP", "Data Engineer Program"],
  "Claude Code for Developers": ["Claude Code"],
  "AI Agentic Engineer": ["AI Agentic Engineer"],
  "Data Architect": ["DARP", "Data Architect"],
  "MLOps Engineer": ["MLOPs", "Machine Learning Program"],
  "IA Generativa en Databricks": ["Databricks"]
};

const normalizeName = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");

const findProgram = (programName: string): CurriculaProgram | undefined => {
  const aliases = PROGRAM_ALIASES[programName] ?? [programName];
  return aliases.map((alias) => curricula.programs.find((program) => normalizeName(program.program) === normalizeName(alias))).find(Boolean)
    ?? aliases.map((alias) => curricula.programs.find((program) => {
      const candidate = normalizeName(program.program);
      const normalized = normalizeName(alias);
      return candidate.includes(normalized) || normalized.includes(candidate);
    })).find(Boolean);
};

export const curriculaService = {
  syncedAt: curricula.syncedAt,
  getPrograms() { return curricula.programs; },
  findProgram,
  // Ventana comercial confirmada: agosto y septiembre de 2026, inclusive.
  getCatalogLiveEdition(programName: string, referenceDate = new Date()): CurriculaEdition | undefined {
    const match = curricula.programs.find((program) => normalizeName(program.program) === normalizeName(programName)) ?? findProgram(programName);
    const editions = (match?.editions ?? []).filter((edition) => {
      const date = edition.startDate.slice(0, 10);
      return date >= "2026-08-01" && date <= "2026-09-30";
    }).sort((a, b) => a.startDate.localeCompare(b.startDate));
    return editions.find((edition) => new Date(edition.startDate) >= referenceDate) ?? editions.at(-1);
  },
  getCatalogId(programName: string) {
    const program = findProgram(programName);
    if (!program) return programName;
    const slug = normalizeName(program.program) || "programa";
    return `curricula-${slug}-${program.editions[0]?.sheetId ?? 0}`;
  },
  getCurrentEdition(programName: string, referenceDate = new Date()): CurriculaEdition | undefined {
    const match = findProgram(programName);
    if (!match) return undefined;
    const sorted = [...match.editions].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    return sorted.find((edition) => new Date(edition.startDate) >= referenceDate) ?? sorted.at(-1);
  },
  formatStartDate(edition?: CurriculaEdition) {
    if (!edition) return "Fecha por confirmar";
    return new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(edition.startDate));
  }
};
