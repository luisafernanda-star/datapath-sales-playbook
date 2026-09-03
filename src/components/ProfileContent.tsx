import React, { useState, useEffect } from "react";
import { contentService } from "../services/contentService";
import { curriculaService } from "../services/curriculaService";
import type { Profile, DecisionNode, Program } from "../data/playbookData";
import { parseInlineMarkdown, stripBlockMarkdown } from "../utils/markdown";
import { AdvancedSimulator } from "./AdvancedSimulator";
import {
  ArrowLeft,
  RotateCcw,
  Sparkles,
  MessageSquare,
  Award,
  ChevronRight,
  BookOpen,
  Play,
  Copy,
  Check,
  Search,
  CheckSquare,
  Target,
  BadgeAlert,
  HelpCircle
} from "lucide-react";

interface ProfileContentProps {
  profile: Profile;
  onGoBackHome: () => void;
  onViewProgram: (programId: string) => void;
}

export const ProfileContent: React.FC<ProfileContentProps> = ({
  profile,
  onGoBackHome,
  onViewProgram
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"guide" | "simulator" | "advanced">("guide");
  const [currentNodeId, setCurrentNodeId] = useState<string>(profile.startNodeId);
  const [history, setHistory] = useState<string[]>([profile.startNodeId]);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Load programs
  useEffect(() => {
    contentService.getPrograms().then(setPrograms);
  }, []);

  const currentNode: DecisionNode | undefined = profile.nodes[currentNodeId];

  const handleSelectOption = (index: number) => {
    if (!currentNode) return;
    const option = currentNode.options[index];
    setSelectedOptionIndex(index);

    if (option.nextId) {
      const nextNodeId = option.nextId;
      setCurrentNodeId(nextNodeId);
      setHistory((prev) => [...prev, nextNodeId]);
      setSelectedOptionIndex(null);
    }
  };

  const handleGoBackNode = () => {
    if (history.length <= 1) {
      onGoBackHome();
      return;
    }
    const newHistory = [...history];
    newHistory.pop();
    const prevNodeId = newHistory[newHistory.length - 1];
    setHistory(newHistory);
    setCurrentNodeId(prevNodeId);
    setSelectedOptionIndex(null);
  };

  const handleResetFlow = () => {
    setCurrentNodeId(profile.startNodeId);
    setHistory([profile.startNodeId]);
    setSelectedOptionIndex(null);
  };

  const copyToClipboard = (text: string, label: string) => {
    const cleanText = text.replace(/^["'>\s]+|["'>\s]+$/g, "");
    navigator.clipboard.writeText(cleanText);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Sections parser for the markdown guide
  const parseSections = (text: string) => {
    const lines = text.split(/\r?\n|\\n/);
    const sections: { title: string; content: string[] }[] = [];
    let currentSection: { title: string; content: string[] } = { title: "General", content: [] };
    
    for (let line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("# ")) {
        continue;
      }
      if (trimmed.startsWith("## ")) {
        if (currentSection.content.length > 0 || currentSection.title !== "General") {
          sections.push(currentSection);
        }
        currentSection = { title: trimmed.replace("## ", ""), content: [] };
      } else {
        if (trimmed !== "" || currentSection.content.length > 0) {
          currentSection.content.push(line);
        }
      }
    }
    if (currentSection.content.length > 0 || currentSection.title !== "General") {
      sections.push(currentSection);
    }
    return sections;
  };

  // Premium parser-renderer for markdown blocks in the guide tab
  const renderGuideContent = (guideText: string) => {
    const sections = parseSections(guideText);
    let keyCounter = 0;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {sections.map((sec) => {
          const title = sec.title.trim();
          const rawContent = sec.content.join("\n");
          
          // 1. Descripción
          if (title.toLowerCase() === "descripción") {
            return (
              <div key={keyCounter++} style={{ paddingBottom: "16px", borderBottom: "1px solid var(--border-color)" }}>
                <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: "1.6", margin: 0 }}>
                  {parseInlineMarkdown(rawContent)}
                </p>
              </div>
            );
          }

          // 2. Pregunta sugerida
          if (title.toLowerCase() === "pregunta sugerida") {
            const question = rawContent.replace(/^["'>\s]+|["'>\s]+$/g, "");
            return (
              <div 
                key={keyCounter++} 
                style={{ 
                  background: "linear-gradient(135deg, rgba(37, 211, 102, 0.04) 0%, rgba(37, 211, 102, 0.01) 100%)", 
                  border: "1px solid rgba(37, 211, 102, 0.2)", 
                  borderRadius: "8px", 
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", CustomStyle: "center" } as any}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#25D366", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    <MessageSquare size={16} />
                    <span>Pregunta Inicial Sugerida (WhatsApp)</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(question, "pregunta")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "rgba(37, 211, 102, 0.1)",
                      border: "none",
                      color: "#25D366",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      padding: "6px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    {copiedText === "pregunta" ? (
                      <>
                        <Check size={12} />
                        <span>Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copiar Mensaje</span>
                      </>
                    )}
                  </button>
                </div>
                <p style={{ fontSize: "1.1rem", fontWeight: 500, color: "var(--text-primary)", margin: 0, lineHeight: "1.5", fontStyle: "italic" }}>
                  "{parseInlineMarkdown(question)}"
                </p>
              </div>
            );
          }

          // 3. Objetivo de la pregunta
          if (title.toLowerCase() === "objetivo de la pregunta" || title.toLowerCase() === "objetivo de esta ficha") {
            return (
              <div 
                key={keyCounter++}
                style={{ 
                  background: "var(--bg-secondary)", 
                  borderRadius: "6px", 
                  padding: "16px",
                  borderLeft: "3px solid var(--text-muted)",
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start"
                }}
              >
                <Target size={18} style={{ color: "var(--text-muted)", marginTop: "2px" }} />
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "4px" }}>
                    Objetivo
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "var(--text-color)", lineHeight: "1.5" }}>
                    {parseInlineMarkdown(rawContent)}
                  </div>
                </div>
              </div>
            );
          }

          // 4. Tip de venta
          if (title.toLowerCase() === "tip de venta") {
            return (
              <div 
                key={keyCounter++}
                style={{ 
                  background: "linear-gradient(135deg, rgba(255, 107, 0, 0.05) 0%, rgba(255, 107, 0, 0.01) 100%)", 
                  borderRadius: "8px", 
                  padding: "18px",
                  border: "1px solid rgba(255, 107, 0, 0.15)",
                  display: "flex",
                  gap: "14px",
                  alignItems: "flex-start"
                }}
              >
                <div style={{ background: "rgba(255, 107, 0, 0.1)", borderRadius: "6px", padding: "6px", color: "var(--primary-color)" }}>
                  <Sparkles size={18} />
                </div>
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--primary-color)", textTransform: "uppercase", marginBottom: "4px" }}>
                    Tip de Venta Comercial
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "var(--text-color)", lineHeight: "1.5" }}>
                    {parseInlineMarkdown(rawContent)}
                  </div>
                </div>
              </div>
            );
          }

          // 5. Qué debe descubrir la asesora
          if (title.toLowerCase() === "qué debe descubrir la asesora" || title.toLowerCase() === "qué buscamos descubrir?") {
            const listItems = sec.content.map(li => li.trim()).filter(Boolean);
            return (
              <div key={keyCounter++} style={{ padding: "20px", border: "1px solid var(--border-color)", borderRadius: "8px", backgroundColor: "var(--bg-card)" }}>
                <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Search size={16} />
                  <span>Información Clave a Descubrir</span>
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {listItems.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                      <div style={{ color: "var(--primary-color)", fontSize: "0.9rem", fontWeight: 700, marginTop: "2px" }}>•</div>
                      <span style={{ fontSize: "0.95rem", color: "var(--text-color)", lineHeight: "1.4" }}>
                        {parseInlineMarkdown(stripBlockMarkdown(item))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // 6. Posibles respuestas
          if (title.toLowerCase() === "posibles respuestas" || title.toLowerCase() === "posibles respuestas y lo que pueden indicar") {
            const bulletLines = sec.content.filter(line => line.trim() !== "");
            return (
              <div key={keyCounter++} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", margin: 0 }}>
                  Posibles Respuestas y Rutas
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
                  {bulletLines.map((line, idx) => {
                    const cleanLine = stripBlockMarkdown(line);
                    const parts = cleanLine.split(":");
                    const heading = parts[0];
                    const desc = parts.slice(1).join(":");
                    
                    return (
                      <div 
                        key={idx} 
                        style={{ 
                          padding: "16px", 
                          backgroundColor: "var(--bg-card)", 
                          border: "1px solid var(--border-color)", 
                          borderRadius: "8px",
                          display: "flex",
                          gap: "12px",
                          alignItems: "flex-start"
                        }}
                      >
                        <div style={{ background: "var(--bg-secondary)", borderRadius: "4px", padding: "4px 8px", color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 700 }}>
                          Opción
                        </div>
                        <div style={{ flex: 1 }}>
                          <span style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.95rem" }}>
                            {parseInlineMarkdown(heading)}
                          </span>
                          {desc && (
                            <p style={{ margin: "4px 0 0 0", fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                              {parseInlineMarkdown(desc)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }

          // 7. Momentos de Brochure y Precios (Warning / Restriction Cards)
          if (title.toLowerCase() === "momento para enviar el brochure" || title.toLowerCase() === "momento para enviar el brochure?") {
            return (
              <div 
                key={keyCounter++}
                style={{ 
                  background: "rgba(239, 68, 68, 0.03)", 
                  border: "1px dashed rgba(239, 68, 68, 0.3)", 
                  borderRadius: "8px", 
                  padding: "16px",
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start"
                }}
              >
                <BadgeAlert size={18} style={{ color: "#ef4444", marginTop: "2px", flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#ef4444", textTransform: "uppercase", marginBottom: "4px" }}>
                    Regla de Brochure (WhatsApp)
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "var(--text-color)", lineHeight: "1.4" }}>
                    {parseInlineMarkdown(rawContent)}
                  </div>
                </div>
              </div>
            );
          }

          if (title.toLowerCase() === "momento para hablar del precio" || title.toLowerCase() === "momento para hablar de la inversión") {
            return (
              <div 
                key={keyCounter++}
                style={{ 
                  background: "rgba(245, 158, 11, 0.03)", 
                  border: "1px dashed rgba(245, 158, 11, 0.3)", 
                  borderRadius: "8px", 
                  padding: "16px",
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start"
                }}
              >
                <BadgeAlert size={18} style={{ color: "#f59e0b", marginTop: "2px", flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#f59e0b", textTransform: "uppercase", marginBottom: "4px" }}>
                    Regla de Inversión y Precios
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "var(--text-color)", lineHeight: "1.4" }}>
                    {parseInlineMarkdown(rawContent)}
                  </div>
                </div>
              </div>
            );
          }

          // 8. Beneficios que debe vender
          if (title.toLowerCase() === "beneficios que debe vender") {
            const list = sec.content.map(li => stripBlockMarkdown(li).trim()).filter(Boolean);
            return (
              <div key={keyCounter++} style={{ padding: "20px", border: "1px solid var(--border-color)", borderRadius: "8px", backgroundColor: "var(--bg-card)" }}>
                <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--primary-color)", textTransform: "uppercase", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Award size={16} />
                  <span>Beneficios a Argumentar</span>
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
                  {list.map((item, idx) => {
                    const parts = item.split(":");
                    const header = parts[0];
                    const text = parts.slice(1).join(":");
                    return (
                      <div key={idx} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                        <span style={{ color: "var(--primary-color)", fontSize: "0.9rem", fontWeight: 700, marginTop: "2px" }}>✓</span>
                        <span style={{ fontSize: "0.95rem", color: "var(--text-color)", lineHeight: "1.4" }}>
                          <strong>{parseInlineMarkdown(header)}</strong>{text ? ":" + parseInlineMarkdown(text) : ""}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }

          // 9. Notas para la asesora
          if (title.toLowerCase() === "notas para la asesora") {
            const checklistLines = sec.content.filter(line => line.trim().match(/^-\s+\[([ xX]?)\]\s+(.*)$/) || line.trim().match(/^\[([ xX]?)\]\s+(.*)$/));
            
            if (checklistLines.length > 0) {
              return (
                <div key={keyCounter++} style={{ padding: "20px", border: "1px solid var(--border-color)", borderRadius: "8px", backgroundColor: "var(--bg-card)" }}>
                  <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <CheckSquare size={16} />
                    <span>Checklist de Calificación</span>
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {checklistLines.map((line, idx) => {
                      const match = line.trim().match(/^-\s+\[([ xX]?)\]\s+(.*)$/) || line.trim().match(/^\[([ xX]?)\]\s+(.*)$/);
                      if (!match) return null;
                      const isChecked = match[1].trim() !== "";
                      return (
                        <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <input 
                            type="checkbox" 
                            checked={isChecked} 
                            readOnly 
                            style={{ 
                              accentColor: "var(--primary-color)", 
                              width: "16px", 
                              height: "16px",
                              cursor: "default" 
                            }} 
                          />
                          <span style={{ color: "var(--text-color)", fontSize: "0.95rem" }}>
                            {parseInlineMarkdown(match[2])}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }

            return (
              <div key={keyCounter++} style={{ padding: "16px", backgroundColor: "var(--bg-secondary)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "6px" }}>
                  Notas para la Asesora
                </div>
                <div style={{ fontSize: "0.9rem", color: "var(--text-color)", lineHeight: "1.5" }}>
                  {parseInlineMarkdown(rawContent)}
                </div>
              </div>
            );
          }

          // 10. Checklist generados explícitamente en el markdown
          const checklistItems = sec.content.filter(line => line.trim().match(/^-\s+\[([ xX]?)\]\s+(.*)$/) || line.trim().match(/^\[([ xX]?)\]\s+(.*)$/));
          if (checklistItems.length > 0) {
            return (
              <div key={keyCounter++} style={{ padding: "20px", border: "1px solid var(--border-color)", borderRadius: "8px", backgroundColor: "var(--bg-card)" }}>
                <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <CheckSquare size={16} />
                  <span>Checklist de Calificación</span>
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {checklistItems.map((line, idx) => {
                    const match = line.trim().match(/^-\s+\[([ xX]?)\]\s+(.*)$/) || line.trim().match(/^\[([ xX]?)\]\s+(.*)$/);
                    if (!match) return null;
                    const isChecked = match[1].trim() !== "";
                    return (
                      <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <input 
                          type="checkbox" 
                          checked={isChecked} 
                          readOnly 
                          style={{ 
                            accentColor: "var(--primary-color)", 
                            width: "16px", 
                            height: "16px",
                            cursor: "default" 
                          }} 
                        />
                        <span style={{ color: "var(--text-color)", fontSize: "0.95rem" }}>
                          {parseInlineMarkdown(match[2])}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }

          // Fallback rendering
          if (title.toLowerCase() !== "programa principal" && title.toLowerCase() !== "programas alternativos") {
            return (
              <div key={keyCounter++} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <h4 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
                  {parseInlineMarkdown(sec.title)}
                </h4>
                <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: "1.5", margin: 0 }}>
                  {parseInlineMarkdown(rawContent)}
                </p>
              </div>
            );
          }

          return null;
        })}
      </div>
    );
  };

  if (!currentNode) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <HelpCircle size={48} color="var(--text-muted)" />
        <h3 style={{ marginTop: "16px" }}>Nodo de conversación no encontrado</h3>
        <button onClick={onGoBackHome} className="btn-reset" style={{ margin: "20px auto 0" }}>
          Volver al Inicio
        </button>
      </div>
    );
  }

  const currentOption = selectedOptionIndex !== null ? currentNode.options[selectedOptionIndex] : null;
  const isLeafNode = currentNode.options.every(o => !o.nextId);
  const showRecommendation = currentOption?.recommendation || (isLeafNode && currentNode.options[0]?.recommendation);
  const activeOption = currentOption || (isLeafNode ? currentNode.options[0] : null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Breadcrumbs */}
      <div className="breadcrumb-nav">
        <span className="breadcrumb-link" onClick={onGoBackHome}>Inicio</span>
        <ChevronRight size={14} />
        <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{profile.title}</span>
      </div>

      {/* Header controls */}
      <div className="flex-between" style={{ alignItems: "flex-start" }}>
        <div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
            {profile.title}
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: "4px" }}>
            {profile.description}
          </p>
        </div>
        
        {activeSubTab === "simulator" && (
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={handleGoBackNode} className="btn-reset">
              <ArrowLeft size={16} />
              <span>Atrás</span>
            </button>
            <button onClick={handleResetFlow} className="btn-reset" title="Reiniciar árbol">
              <RotateCcw size={16} />
              <span>Reiniciar</span>
            </button>
          </div>
        )}
      </div>

      {/* Sub Tabs Toggle (Guía vs Simulador) */}
      <div 
        style={{ 
          display: "flex", 
          borderBottom: "1px solid var(--border-color)", 
          gap: "24px",
          marginBottom: "-8px"
        }}
      >
        <button
          onClick={() => setActiveSubTab("guide")}
          style={{
            padding: "10px 4px",
            background: "none",
            border: "none",
            borderBottom: activeSubTab === "guide" ? "2px solid var(--primary-color)" : "2px solid transparent",
            color: activeSubTab === "guide" ? "var(--primary-color)" : "var(--text-muted)",
            fontWeight: activeSubTab === "guide" ? 600 : 500,
            cursor: "pointer",
            fontSize: "0.95rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.2s"
          }}
        >
          <BookOpen size={16} />
          <span>📖 Guía Comercial</span>
        </button>
        
        <button
          onClick={() => setActiveSubTab("simulator")}
          style={{
            padding: "10px 4px",
            background: "none",
            border: "none",
            borderBottom: activeSubTab === "simulator" ? "2px solid var(--primary-color)" : "2px solid transparent",
            color: activeSubTab === "simulator" ? "var(--primary-color)" : "var(--text-muted)",
            fontWeight: activeSubTab === "simulator" ? 600 : 500,
            cursor: "pointer",
            fontSize: "0.95rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.2s"
          }}
        >
          <Play size={16} />
          <span>💬 Simulador Conversacional</span>
        </button>

        <button
          onClick={() => setActiveSubTab("advanced")}
          style={{
            padding: "10px 4px",
            background: "none",
            border: "none",
            borderBottom: activeSubTab === "advanced" ? "2px solid var(--primary-color)" : "2px solid transparent",
            color: activeSubTab === "advanced" ? "var(--primary-color)" : "var(--text-muted)",
            fontWeight: activeSubTab === "advanced" ? 600 : 500,
            cursor: "pointer",
            fontSize: "0.95rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.2s"
          }}
        >
          <Sparkles size={16} />
          <span>✨ Diagnóstico inteligente</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeSubTab === "guide" ? (
        <div 
          className="manual-paper animate-fade-in"
          style={{ 
            background: "var(--bg-card)", 
            border: "1px solid var(--border-color)", 
            borderRadius: "8px", 
            padding: "30px 36px", 
            boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
            marginTop: "8px"
          }}
        >
          {renderGuideContent(profile.diagnosticGuide)}
        </div>
      ) : activeSubTab === "advanced" ? (
        <AdvancedSimulator profileId={profile.id} onViewProgram={onViewProgram} />
      ) : (
        /* Main Conversation Box (Simulator) */
        <div className="chat-flow-container animate-fade-in">
          
          {/* Agent Dialogue & Tip Section */}
          <div className="agent-bubble-container">
            <div className="bubble-header">
              <span className="bubble-tag">
                <MessageSquare size={14} />
                <span>Pregunta sugerida para WhatsApp</span>
              </span>
              <span className="badge-tag">Paso {history.length}</span>
            </div>

            <p className="bubble-message">{parseInlineMarkdown(currentNode.message)}</p>

            {currentNode.agentTip && (
              <div className="agent-tip-box">
                <Sparkles className="tip-icon" size={18} />
                <div className="tip-content">
                  <span className="tip-label">Tip de Venta / Enfoque</span>
                  <span className="tip-text">{parseInlineMarkdown(currentNode.agentTip)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Prospect Options Selection */}
          {!isLeafNode && (
            <div className="options-container">
              <span className="options-title">Respuestas posibles del Prospecto:</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {currentNode.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className="option-button"
                    style={{
                      borderColor: selectedOptionIndex === idx ? "var(--color-orange)" : "",
                      backgroundColor: selectedOptionIndex === idx ? "var(--bg-secondary)" : ""
                    }}
                  >
                    <span>{parseInlineMarkdown(option.text)}</span>
                    <ChevronRight className="option-arrow" size={18} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Leaf Node Auto-display or selected option display */}
          {showRecommendation && activeOption && (
            <div className="recommendation-box">
              <div className="rec-title-row">
                <Award size={20} color="var(--color-orange)" />
                <span>Estrategia y Argumento Comercial Recomendado</span>
              </div>

              <div className="rec-card">
                <div className="rec-speech-label">Argumentación:</div>
                <div className="rec-speech-bubble">
                  {parseInlineMarkdown(activeOption.recommendation || "")}
                </div>
              </div>

              {/* Suggested Academic Programs */}
              {activeOption.suggestedPrograms && activeOption.suggestedPrograms.length > 0 && (
                <div className="suggested-programs-section">
                  <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                    Programas sugeridos para ofrecer:
                  </div>
                  <div className="suggested-programs-grid">
                    {activeOption.suggestedPrograms.map((progId) => {
                      const prog = programs.find((p) => p.id === progId);
                      if (!prog) return null;
                      const currentEdition = curriculaService.getCurrentEdition(prog.name);
                      return (
                        <div key={prog.id} className="compact-program-card">
                          <div className="flex-between">
                            <span className="compact-program-title">{parseInlineMarkdown(prog.name)}</span>
                            <button
                              onClick={() => onViewProgram(prog.id)}
                              className="btn-reset"
                              style={{ padding: "4px 8px", fontSize: "0.75rem" }}
                            >
                              <BookOpen size={12} />
                              <span>Ver Ficha Técnica</span>
                            </button>
                          </div>
                          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "6px" }}>
                            {parseInlineMarkdown(prog.description)}
                          </p>
                          <div className="compact-program-meta" style={{ marginTop: "8px" }}>
                            <span>⏱ {prog.duration}</span>
                            <span>🏢 {prog.modality}</span>
                          </div>
                          {currentEdition && <div className="current-edition-inline">Inicio: {curriculaService.formatStartDate(currentEdition)}</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
