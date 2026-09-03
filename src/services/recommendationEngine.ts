import type { DiagnosticAnswer, DiagnosticTag } from "../data/diagnosticFlow";
import { PROFILE_TAGS } from "../data/diagnosticFlow";
import { curriculaService, type CurriculaEdition } from "./curriculaService";

export interface ProgramRecommendation {
  program: string;
  catalogId: string;
  score: number;
  reasons: string[];
  caution?: string;
  edition?: CurriculaEdition;
  format: "Programa" | "Taller" | "Certificación";
}

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const classifyProgram = (name: string): DiagnosticTag[] => {
  const value = normalize(name);
  const tags = new Set<DiagnosticTag>();
  const has = (...terms: string[]) => terms.some((term) => value.includes(term));

  if (has("taller")) tags.add("short-format"); else tags.add("full-program");
  if (has("nube", "certificacion", "awsca")) tags.add("certification");
  if (has("dap", "analytics", "dashboard", "powerbi", "fabric analytics")) tags.add("analytics");
  if (has("dep", "data engineer", "airflow", "data build", "fabric de", "gcp de", "aws de", "databricks de")) tags.add("data-engineering");
  if (has("ai engineer", "claude code", "prompt", "antigravity", "gemini")) tags.add("ai-apps");
  if (has("agent")) { tags.add("agents"); tags.add("ai-apps"); }
  if (has("architect", "darp")) tags.add("architecture");
  if (has("mlop", "mlp")) { tags.add("mlops"); tags.add("advanced"); }
  if (has("n8n", "power apps", "automate", "whatsapp")) tags.add("automation");
  if (has("marketing", "admon legal", "fundamentos", "copilot", "veo")) { tags.add("business-ai"); tags.add("beginner"); }
  if (has("aws")) tags.add("aws");
  if (has("azure")) tags.add("azure");
  if (has("gcp", "google", "bigquery")) tags.add("gcp");
  if (has("databricks")) tags.add("databricks");
  if (has("fabric")) tags.add("fabric");
  if (has("ai solution", "darp", "dep", "mlop", "data engineer", "architect")) tags.add("advanced");
  if (has("dap", "analytics", "fundamentos", "prompt", "marketing")) tags.add("beginner");
  if (tags.has("aws") || tags.has("azure") || tags.has("gcp") || tags.has("databricks") || tags.has("fabric")) tags.add("cloud");
  if (tags.has("data-engineering") || tags.has("ai-apps") || tags.has("architecture") || tags.has("mlops")) tags.add("technical");
  return [...tags];
};

const LABELS: Record<string, string> = {
  analytics: "quiere analizar datos y construir dashboards",
  "data-engineering": "busca trabajar con pipelines e ingeniería de datos",
  "ai-apps": "quiere desarrollar soluciones con Inteligencia Artificial",
  agents: "le interesan los agentes inteligentes",
  architecture: "busca diseñar arquitecturas empresariales",
  automation: "quiere automatizar procesos",
  "business-ai": "quiere aplicar IA en su trabajo cotidiano",
  cloud: "busca una ruta de nube",
  aws: "prioriza AWS",
  azure: "prioriza Azure",
  gcp: "prioriza Google Cloud",
  databricks: "prioriza Databricks",
  fabric: "prioriza Microsoft Fabric",
  beginner: "necesita una entrada amigable",
  advanced: "ya cuenta con una base para especializarse",
  "short-format": "prefiere una formación corta y aplicada",
  "full-program": "busca una ruta completa"
};

const EXCLUDED = /^(hoja|prueba|english|ciisa|dsp$|dep7|nubes 4a)/i;

export function recommendPrograms(profileId: string, answers: DiagnosticAnswer[], limit = 3): ProgramRecommendation[] {
  const selectedTags = [...(PROFILE_TAGS[profileId] ?? []), ...answers.flatMap((answer) => answer.tags)];
  const tagFrequency = selectedTags.reduce<Record<string, number>>((result, tag) => ({ ...result, [tag]: (result[tag] || 0) + 1 }), {});
  const now = Date.now();

  const ranked = curriculaService.getPrograms().filter((program) => !EXCLUDED.test(program.program)).map((program) => {
    const programTags = classifyProgram(program.program);
    const matches = programTags.filter((tag) => tagFrequency[tag]);
    let score = matches.reduce((total, tag) => total + (tagFrequency[tag] || 0) * (isPrimaryTag(tag) ? 5 : 2), 0);
    if (tagFrequency.beginner && programTags.includes("advanced") && !programTags.includes("beginner")) score -= 5;
    if (tagFrequency["short-format"] && !programTags.includes("short-format")) score -= 4;
    if (tagFrequency["full-program"] && programTags.includes("short-format")) score -= 5;
    const edition = curriculaService.getCurrentEdition(program.program);
    if (edition && new Date(edition.startDate).getTime() >= now) score += 3;
    const reasons = matches.filter((tag) => LABELS[tag]).slice(0, 3).map((tag) => LABELS[tag]);
    const caution = tagFrequency.beginner && programTags.includes("advanced") && !programTags.includes("beginner")
      ? "Confirma conocimientos previos y presenta primero la nivelación requerida."
      : undefined;
    return {
      program: program.program,
      catalogId: curriculaService.getCatalogId(program.program),
      score,
      reasons,
      caution,
      edition,
      format: programTags.includes("short-format") ? "Taller" as const : programTags.includes("certification") ? "Certificación" as const : "Programa" as const
    };
  }).sort((a, b) => b.score - a.score || futureTime(a.edition) - futureTime(b.edition));

  const unique: ProgramRecommendation[] = [];
  for (const recommendation of ranked) {
    const key = normalize(recommendation.program).replace(/[^a-z0-9]/g, "");
    if (recommendation.score <= 0 || unique.some((item) => normalize(item.program).replace(/[^a-z0-9]/g, "") === key)) continue;
    unique.push(recommendation);
    if (unique.length === limit) break;
  }
  return unique;
}

export function buildWhatsAppMessage(recommendations: ProgramRecommendation[], answers: DiagnosticAnswer[]) {
  const primary = recommendations[0];
  if (!primary) return "";
  const interest = answers.find((answer) => answer.questionId === "interest")?.label.toLowerCase();
  const alternatives = recommendations.slice(1).map((item) => item.program).join(" y ");
  const start = primary.edition ? ` La próxima edición registrada inicia el ${curriculaService.formatStartDate(primary.edition)}.` : "";
  return `Por lo que me cuentas${interest ? ` y teniendo en cuenta que te interesa ${interest}` : ""}, la ruta que mejor se ajusta a tu objetivo es ${primary.program}. ${primary.reasons.length ? `Te la recomiendo porque ${primary.reasons.join(", ")}.` : "Esta ruta se alinea con el resultado que quieres conseguir."}${start}${alternatives ? ` También podemos revisar como alternativas ${alternatives}.` : ""} ¿Te gustaría que te comparta el contenido y revisemos juntos si encaja con tu disponibilidad?`;
}

const isPrimaryTag = (tag: string) => ["analytics", "data-engineering", "ai-apps", "agents", "architecture", "automation", "business-ai", "cloud", "aws", "azure", "gcp", "databricks", "fabric"].includes(tag);
const futureTime = (edition?: CurriculaEdition) => edition ? Math.max(0, new Date(edition.startDate).getTime() - Date.now()) : Number.MAX_SAFE_INTEGER;
