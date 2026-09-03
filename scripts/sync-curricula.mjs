import ExcelJS from "exceljs";
import { mkdir, writeFile } from "node:fs/promises";

const spreadsheetId = "1gh-Fat339GkeooWfyDCxrePNxPzg88lEbmSMGUgsBuk";
const sourceUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=xlsx`;
const outputPath = new URL("../src/data/generatedCurricula.json", import.meta.url);

const normalize = (value) => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
const displayValue = (cell) => {
  const value = cell.value;
  if (value && typeof value === "object" && "result" in value) return value.result;
  if (value && typeof value === "object" && "text" in value) return value.text;
  return value;
};
const parseDate = (value) => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === "number") return new Date(Date.UTC(1899, 11, 30) + value * 86400000);
  if (typeof value === "string") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return null;
};
const isSessionOne = (value) => {
  if (typeof value === "number") return value === 1;
  const text = normalize(value).replace(/[✅📌]/gu, "").trim();
  return text === "1" || /^sesion\s*1(?:\D|$)/.test(text);
};
const canonicalName = (name) => name
  .replace(/^(copia de|new|nuevo|junio no\.\s*\d+)\s*/i, "")
  .replace(/\s+(?:ed\.?|edicion)\s*\d+.*$/i, "")
  .replace(/\s+\d+(?:ra|da|ta|va)?\s+ed.*$/i, "")
  .replace(/\s*\d+\.?$/i, "")
  .replace(/(databricks|dep|dap|mlops|darp)(?:\s|-)\d+$/i, "$1")
  .replace(/\s+/g, " ")
  .trim();

const response = await fetch(sourceUrl);
if (!response.ok) throw new Error(`No se pudo leer Google Sheets (${response.status}).`);
const workbook = new ExcelJS.Workbook();
await workbook.xlsx.load(await response.arrayBuffer());

const editions = [];
for (const sheet of workbook.worksheets) {
  const maxHeaderRow = Math.min(sheet.rowCount, 30);
  for (let rowNumber = 1; rowNumber <= maxHeaderRow; rowNumber += 1) {
    const row = sheet.getRow(rowNumber);
    const values = Array.from({ length: row.cellCount }, (_, index) => displayValue(row.getCell(index + 1)));
    for (let dateIndex = 0; dateIndex < values.length; dateIndex += 1) {
      if (!normalize(values[dateIndex]).startsWith("fecha")) continue;
      const sessionIndex = [dateIndex - 1, dateIndex - 2].find((index) => index >= 0 && normalize(values[index]).includes("sesion"));
      if (sessionIndex === undefined) continue;
      const formatIndex = values.findIndex((value, index) => index > dateIndex && index <= dateIndex + 4 && normalize(value).includes("formato"));
      const moduleIndex = values.findIndex((value, index) => index > dateIndex && normalize(value) === "modulo");
      const courseIndex = values.findIndex((value, index) => index > dateIndex && ["curso", "sesion", "contenido"].includes(normalize(value)));
      let sessionRow;
      for (let candidate = rowNumber + 1; candidate <= Math.min(sheet.rowCount, rowNumber + 120); candidate += 1) {
        const candidateRow = sheet.getRow(candidate);
        if (isSessionOne(displayValue(candidateRow.getCell(sessionIndex + 1)))) { sessionRow = candidateRow; break; }
      }
      if (!sessionRow) continue;
      const startDate = parseDate(displayValue(sessionRow.getCell(dateIndex + 1)));
      if (!startDate) continue;
      const format = formatIndex >= 0 ? String(displayValue(sessionRow.getCell(formatIndex + 1)) ?? "") : "";
      const sessions = [];
      for (let candidate = rowNumber + 1; candidate <= Math.min(sheet.rowCount, rowNumber + 120); candidate += 1) {
        const candidateRow = sheet.getRow(candidate);
        const sessionValue = displayValue(candidateRow.getCell(sessionIndex + 1));
        const sessionDate = parseDate(displayValue(candidateRow.getCell(dateIndex + 1)));
        if (!sessionDate || sessionValue === null || sessionValue === "") continue;
        const sessionNumber = Number(String(sessionValue).replace(/[^0-9.]/g, ""));
        if (!Number.isFinite(sessionNumber)) continue;
        sessions.push({
          session: sessionNumber,
          date: sessionDate.toISOString(),
          format: formatIndex >= 0 ? String(displayValue(candidateRow.getCell(formatIndex + 1)) ?? "") : "",
          module: moduleIndex >= 0 ? String(displayValue(candidateRow.getCell(moduleIndex + 1)) ?? "") : "",
          content: courseIndex >= 0 ? String(displayValue(candidateRow.getCell(courseIndex + 1)) ?? "") : ""
        });
      }
      const key = `${sheet.name}-${dateIndex}-${startDate.toISOString()}`;
      if (editions.some((edition) => edition.key === key)) continue;
      editions.push({ key, program: canonicalName(sheet.name), edition: sheet.name, startDate: startDate.toISOString(), format, sheetId: sheet.id, sessions });
    }
  }
}

const today = new Date();
const groups = Object.groupBy(editions, (edition) => edition.program);
const programs = Object.entries(groups).map(([program, programEditions]) => {
  const sorted = [...programEditions].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  const selected = sorted.find((edition) => new Date(edition.startDate) >= today) ?? sorted.at(-1);
  return { program, editions: sorted.map((edition) => edition.key === selected.key ? edition : { ...edition, sessions: [] }) };
}).sort((a, b) => a.program.localeCompare(b.program));

await mkdir(new URL("../src/data/", import.meta.url), { recursive: true });
await writeFile(outputPath, `${JSON.stringify({ sourceUrl, syncedAt: new Date().toISOString(), rule: "Fecha de la Sesión 1", programs }, null, 2)}\n`);
console.log(`Currículas sincronizadas: ${editions.length} ediciones en ${programs.length} grupos.`);
