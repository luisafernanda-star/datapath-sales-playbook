/**
 * Servicio de Contenido para el Datapath Sales Playbook
 * 
 * Este servicio centraliza la obtención de perfiles, nodos conversacionales, programas
 * y objeciones. Actualmente retorna la información estática de `playbookData.ts` para
 * mantener la aplicación funcionando sin cambios, pero está estructurado para que
 * en el futuro pueda cargar y parsear archivos Markdown desde la carpeta `/content` en la raíz.
 */

import { PROFILES, PROGRAMS, OBJECTIONS } from "../data/playbookData";
import { MANUALS_DATA } from "../data/manualsData";
import type { Profile, DecisionNode, Program, Objection } from "../data/playbookData";

// --- FUTURA IMPLEMENTACIÓN DE CARGA DE MARKDOWN ---
//
// Para cargar los archivos Markdown en una aplicación React con Vite a nivel de cliente,
// se puede utilizar la función `import.meta.glob` que permite importar recursos dinámicamente:
//
// const markdownFiles = import.meta.glob('/content/**/*.md', { query: '?raw', eager: false });
//
// Ejemplo de cómo leer un archivo específico en el futuro:
// async function readMarkdownFile(path: string): Promise<string> {
//   const loader = markdownFiles[path];
//   if (!loader) throw new Error(`Archivo no encontrado: ${path}`);
//   const module = await loader() as { default: string };
//   return module.default; // Retorna el contenido del archivo .md como string
// }
//
// Ejemplo de parser básico para convertir el formato Markdown en nodos conversacionales:
// function parseMarkdownToNode(markdownText: string, nodeId: string): DecisionNode {
//   // Aquí se procesaría el texto Markdown para extraer secciones como:
//   // # Título -> extrae el título
//   // ## Pregunta sugerida -> extrae el mensaje para el chat
//   // ## Tip de venta -> extrae el tip de venta para la asesora
//   // ## Posibles respuestas -> extrae las opciones para el menú
//   return {
//     id: nodeId,
//     message: "Texto extraído del markdown",
//     agentTip: "Tip extraído del markdown",
//     options: []
//   };
// }
// --------------------------------------------------

export const contentService = {
  /**
   * Obtiene todos los perfiles de venta disponibles.
   * En el futuro, esto listará las carpetas en `/content` (tecnologia, cambio-profesional, etc.)
   */
  async getProfiles(): Promise<Record<string, Profile>> {
    // COMENTARIO: Aquí se mapeará la carga dinámica de las carpetas de perfiles.
    return PROFILES;
  },

  /**
   * Obtiene un perfil específico por su ID.
   */
  async getProfileById(profileId: string): Promise<Profile | undefined> {
    const profiles = await this.getProfiles();
    return profiles[profileId];
  },

  /**
   * Obtiene un nodo conversacional específico de un perfil.
   * En el futuro, cargará el archivo Markdown correspondiente:
   * Ejemplo: `/content/tecnologia/crear-soluciones-ia.md`
   */
  async getProfileNode(profileId: string, nodeId: string): Promise<DecisionNode | undefined> {
    // COMENTARIO: Aquí se buscará el archivo Markdown y se llamará al parser:
    // const path = `/content/${profileId}/${nodeId}.md`;
    // const rawMarkdown = await readMarkdownFile(path);
    // return parseMarkdownToNode(rawMarkdown, nodeId);

    const profile = await this.getProfileById(profileId);
    return profile?.nodes[nodeId];
  },

  /**
   * Obtiene la lista completa de programas académicos.
   * En el futuro, esto escaneará la carpeta `/content/programas/*.md`
   */
  async getPrograms(): Promise<Program[]> {
    // COMENTARIO: Cargar todos los archivos .md en `/content/programas/` y estructurarlos como Program.
    return PROGRAMS;
  },

  /**
   * Obtiene un programa específico por su ID.
   */
  async getProgramById(programId: string): Promise<Program | undefined> {
    const programs = await this.getPrograms();
    return programs.find((p) => p.id === programId);
  },

  /**
   * Obtiene la lista de objeciones de venta y sus respuestas.
   * En el futuro, esto escaneará la carpeta `/content/objeciones/*.md`
   */
  async getObjections(): Promise<Objection[]> {
    // COMENTARIO: Cargar todos los archivos .md en `/content/objeciones/` y estructurarlos como Objection.
    return OBJECTIONS;
  },

  /**
   * Obtiene la lista de manuales comerciales disponibles.
   */
  async getManuals(): Promise<{ id: string; title: string }[]> {
    return [
      { id: "metodologia-comercial", title: "Metodología Comercial" }
    ];
  },

  /**
   * Obtiene un manual específico por su ID.
   */
  async getManualById(_manualId: string): Promise<{ title: string; content: string } | undefined> {
    // Siempre retorna la metodología unificada
    return MANUALS_DATA["metodologia-comercial"];
  }
};
