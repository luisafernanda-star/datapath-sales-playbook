import React, { useState, useEffect, useRef } from "react";
import { contentService } from "../services/contentService";
import type { Program } from "../data/playbookData";
import { parseInlineMarkdown } from "../utils/markdown";
import { Check, Search, ChevronDown, ChevronUp, AlertCircle, Copy, CheckSquare, Sparkles } from "lucide-react";

interface ProgramsViewProps {
  highlightedProgramId?: string;
  onClearHighlight?: () => void;
}

export const ProgramsView: React.FC<ProgramsViewProps> = ({
  highlightedProgramId,
  onClearHighlight
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const programRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [programs, setPrograms] = useState<Program[]>([]);
  const [expandedProgramId, setExpandedProgramId] = useState<string | null>(null);
  const [copiedPitchId, setCopiedPitchId] = useState<string | null>(null);

  // Load programs
  useEffect(() => {
    contentService.getPrograms().then(setPrograms);
  }, []);

  // Scroll highlighted program and expand it automatically
  useEffect(() => {
    if (highlightedProgramId) {
      setExpandedProgramId(highlightedProgramId);
      const element = programRefs.current[highlightedProgramId];
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      setSearchQuery("");
    }
  }, [highlightedProgramId]);

  const filteredPrograms = programs.filter((prog) =>
    prog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prog.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prog.target.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (programId: string) => {
    setExpandedProgramId((prev) => (prev === programId ? null : programId));
  };

  const copyPitch = (pitch: string, programId: string) => {
    navigator.clipboard.writeText(pitch);
    setCopiedPitchId(programId);
    setTimeout(() => {
      setCopiedPitchId(null);
    }, 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      <div>
        <h2 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
          Recomendación de Programas
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: "4px" }}>
          Consulta cuándo sugerir u omitir cada programa de Datapath, cómo argumentar su valor y qué preguntas de calificación realizar.
        </p>
      </div>

      {/* Search Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: "var(--bg-primary)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-md)",
          padding: "10px 16px",
          boxShadow: "var(--shadow-sm)"
        }}
      >
        <Search size={18} color="var(--text-muted)" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (onClearHighlight) onClearHighlight();
          }}
          placeholder="Buscar programa por nombre, tecnologías o palabras clave..."
          style={{
            border: "none",
            outline: "none",
            width: "100%",
            fontSize: "0.95rem",
            background: "transparent",
            color: "var(--text-primary)"
          }}
        />
        {highlightedProgramId && (
          <button
            onClick={() => {
              if (onClearHighlight) onClearHighlight();
            }}
            className="badge-tag"
            style={{
              cursor: "pointer",
              background: "var(--color-orange-light)",
              color: "var(--color-orange)",
              borderColor: "transparent",
              fontWeight: 600
            }}
          >
            Quitar filtro de sugerido
          </button>
        )}
      </div>

      {/* Programs List */}
      <div className="programs-list" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {filteredPrograms.length > 0 ? (
          filteredPrograms.map((prog) => {
            const isHighlighted = prog.id === highlightedProgramId;
            const isExpanded = expandedProgramId === prog.id;

            return (
              <div
                key={prog.id}
                ref={(el) => { programRefs.current[prog.id] = el; }}
                className="program-card"
                style={{
                  borderColor: isHighlighted ? "var(--color-orange)" : "",
                  boxShadow: isHighlighted ? "var(--shadow-md)" : "",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  padding: "24px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-color)",
                  backgroundColor: "var(--bg-card)",
                  transition: "all 0.2s"
                }}
              >
                {/* Header Row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <h3 className="program-title" style={{ color: "var(--text-primary)", fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
                        {prog.name}
                      </h3>
                      {isHighlighted && (
                        <span
                          style={{
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            background: "var(--color-orange)",
                            color: "#fff",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            textTransform: "uppercase"
                          }}
                        >
                          Sugerido
                        </span>
                      )}
                    </div>
                    <p className="program-description" style={{ margin: "8px 0 0", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                      {parseInlineMarkdown(prog.description)}
                    </p>
                  </div>

                  {/* Sidebar Metadata (compact format) */}
                  <div style={{ display: "flex", gap: "20px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>Duración</div>
                      <div>{prog.duration}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>Modalidad</div>
                      <div>{prog.modality}</div>
                    </div>
                  </div>
                </div>

                {/* Show Expand/Collapse Button */}
                <button
                  onClick={() => toggleExpand(prog.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "none",
                    border: "none",
                    color: "var(--primary-color)",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    padding: "8px 0",
                    marginTop: "16px",
                    alignSelf: "flex-start"
                  }}
                >
                  {isExpanded ? (
                    <>
                      <span>Ocultar guía de recomendación</span>
                      <ChevronUp size={16} />
                    </>
                  ) : (
                    <>
                      <span>Ver guía de recomendación comercial</span>
                      <ChevronDown size={16} />
                    </>
                  )}
                </button>

                {/* Expanded Content View */}
                {isExpanded && (
                  <div 
                    className="animate-fade-in"
                    style={{ 
                      marginTop: "20px", 
                      paddingTop: "20px", 
                      borderTop: "1px solid var(--border-color)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px"
                    }}
                  >
                    {/* Dirigido a */}
                    <div>
                      <h4 style={{ fontSize: "0.9rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "6px" }}>
                        ¿Para quién está pensado?
                      </h4>
                      <p style={{ fontSize: "0.95rem", color: "var(--text-color)", lineHeight: "1.5" }}>
                        {parseInlineMarkdown(prog.target)}
                      </p>
                    </div>

                    {/* Recomendar / NO Recomendar */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                      <div style={{ padding: "16px", backgroundColor: "rgba(34, 197, 94, 0.04)", borderRadius: "6px", border: "1px solid rgba(34, 197, 94, 0.15)" }}>
                        <h4 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#16a34a", display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                          <Check size={16} />
                          <span>¿Cuándo recomendarlo?</span>
                        </h4>
                        <p style={{ fontSize: "0.9rem", color: "var(--text-color)", lineHeight: "1.5" }}>
                          {parseInlineMarkdown(prog.whenToRecommend || "")}
                        </p>
                      </div>

                      <div style={{ padding: "16px", backgroundColor: "rgba(239, 68, 68, 0.04)", borderRadius: "6px", border: "1px solid rgba(239, 68, 68, 0.15)" }}>
                        <h4 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#dc2626", display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                          <AlertCircle size={16} />
                          <span>¿Cuándo NO recomendarlo?</span>
                        </h4>
                        <p style={{ fontSize: "0.9rem", color: "var(--text-color)", lineHeight: "1.5" }}>
                          {parseInlineMarkdown(prog.whenNotToRecommend || "")}
                        </p>
                      </div>
                    </div>

                    {/* Validaciones y Señales */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                      <div>
                        <h4 style={{ fontSize: "0.9rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "8px" }}>
                          Preguntas para validar
                        </h4>
                        <ul style={{ paddingLeft: "20px", listStyleType: "circle" }}>
                          {prog.validationQuestions?.map((q, idx) => (
                            <li key={idx} style={{ fontSize: "0.9rem", color: "var(--text-color)", marginBottom: "6px", lineHeight: "1.4" }}>
                              {parseInlineMarkdown(q)}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div>
                          <h4 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#16a34a", marginBottom: "4px" }}>
                            Señales positivas
                          </h4>
                          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                            {parseInlineMarkdown(prog.positiveSignals?.join(" • ") || "")}
                          </div>
                        </div>
                        <div>
                          <h4 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#ca8a04", marginBottom: "4px" }}>
                            Señales de alerta
                          </h4>
                          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                            {parseInlineMarkdown(prog.alertSignals?.join(" • ") || "")}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cómo presentar el programa (Speech) */}
                    {prog.howToPresent && (
                      <div 
                        style={{ 
                          padding: "20px", 
                          backgroundColor: "var(--bg-secondary)", 
                          borderRadius: "6px", 
                          border: "1px solid var(--border-color)",
                          position: "relative"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                          <span style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)" }}>
                            Pitch sugerido para el prospecto
                          </span>
                          <button
                            onClick={() => copyPitch(prog.howToPresent!, prog.id)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                              background: "none",
                              border: "none",
                              color: copiedPitchId === prog.id ? "#16a34a" : "var(--primary-color)",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              cursor: "pointer"
                            }}
                          >
                            {copiedPitchId === prog.id ? (
                              <>
                                <CheckSquare size={14} />
                                <span>Copiado</span>
                              </>
                            ) : (
                              <>
                                <Copy size={14} />
                                <span>Copiar Pitch</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p style={{ fontStyle: "italic", fontSize: "0.95rem", color: "var(--text-color)", margin: 0, lineHeight: "1.5" }}>
                          "{parseInlineMarkdown(prog.howToPresent)}"
                        </p>
                      </div>
                    )}

                    {/* Modalidades y relacionados */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                      <div>
                        <h4 style={{ fontSize: "0.9rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "8px" }}>
                          Recomendación de Modalidades
                        </h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem" }}>
                          <div>
                            <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>En vivo:</span> {parseInlineMarkdown(prog.liveModalityRule || "")}
                          </div>
                          <div>
                            <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>Asincrónico:</span> {parseInlineMarkdown(prog.asyncModalityRule || "")}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 style={{ fontSize: "0.9rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "8px" }}>
                          Inversión y Financiamiento
                        </h4>
                        <p style={{ fontSize: "0.9rem", color: "var(--color-orange)", fontWeight: 600, margin: 0 }}>
                          {parseInlineMarkdown(prog.priceInfo || "")}
                        </p>
                        
                        <div style={{ marginTop: "12px", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                          <span style={{ fontWeight: 600, color: "var(--text-muted)" }}>Programas relacionados:</span>{" "}
                          {parseInlineMarkdown(prog.relatedPrograms?.join(", ") || "")}
                        </div>
                      </div>
                    </div>

                    {/* Errores frecuentes */}
                    <div>
                      <h4 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#dc2626", marginBottom: "6px" }}>
                        Errores frecuentes al recomendarlo
                      </h4>
                      <ul style={{ paddingLeft: "20px", listStyleType: "square", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                        {prog.commonErrors?.map((err, idx) => (
                          <li key={idx} style={{ marginBottom: "4px" }}>
                            {parseInlineMarkdown(err)}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Resumen */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", backgroundColor: "rgba(255, 107, 0, 0.03)", borderLeft: "3px solid var(--primary-color)", borderRadius: "4px" }}>
                      <Sparkles size={16} color="var(--primary-color)" />
                      <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--text-color)" }}>
                        <strong>Resumen:</strong> {parseInlineMarkdown(prog.advisorSummary || "")}
                      </span>
                    </div>

                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: "center", padding: "40px", border: "1px dashed var(--border-color)", borderRadius: "var(--radius-lg)" }}>
            <p style={{ color: "var(--text-muted)" }}>No se encontraron programas con los criterios de búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
};
