import React, { useState, useEffect, useRef, useMemo } from "react";
import { contentService } from "../services/contentService";
import { parseInlineMarkdown, stripBlockMarkdown } from "../utils/markdown";
import { ArrowLeft, BookOpen, Sparkles } from "lucide-react";

interface ManualViewProps {
  section: string;
  onSectionChange?: (section: string) => void;
  onGoBackHome: () => void;
}

interface Section {
  title: string;
  lines: string[];
}

export const ManualView: React.FC<ManualViewProps> = ({ section, onSectionChange, onGoBackHome }) => {
  const [methodology, setMethodology] = useState<{ title: string; content: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Refs para evitar bucles o loops entre clics en sidebar y detección de scroll
  const currentActiveSection = useRef<string>("");
  const isProgrammaticScroll = useRef<boolean>(false);

  useEffect(() => {
    setLoading(true);
    // Siempre carga la metodología unificada
    contentService.getManualById("metodologia-comercial").then((data) => {
      if (data) {
        setMethodology(data);
      } else {
        setMethodology(null);
      }
      setLoading(false);
    });
  }, []);

  const cleanSectionId = (title: string): string => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  };

  const parseMethodologySections = (text: string): Section[] => {
    const lines = text.split(/\r?\n|\\n/);
    const sections: Section[] = [];
    let currentSection: Section = { title: "Introducción", lines: [] };

    for (const line of lines) {
      const trimmed = line.trim();
      // Detectar headers de nivel 2 (## Sección)
      if (trimmed.startsWith("## ") && !trimmed.startsWith("### ")) {
        if (currentSection.lines.length > 0 || currentSection.title !== "Introducción") {
          sections.push(currentSection);
        }
        currentSection = { title: trimmed.replace("## ", ""), lines: [] };
      } else {
        currentSection.lines.push(line);
      }
    }

    if (currentSection.lines.length > 0 || currentSection.title !== "Introducción") {
      sections.push(currentSection);
    }

    return sections;
  };

  // Secciones memorizadas para evitar parseos redundantes
  const sections = useMemo(() => {
    return methodology ? parseMethodologySections(methodology.content) : [];
  }, [methodology]);

  // Scroll a la sección activa (solo si viene de una interacción externa como un clic en sidebar)
  useEffect(() => {
    if (!loading && section && section !== currentActiveSection.current) {
      currentActiveSection.current = section;
      const element = document.getElementById(section);
      if (element) {
        isProgrammaticScroll.current = true;
        
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        
        // Bloquear temporalmente la escucha del Scroll Spy durante el desplazamiento automático (800ms)
        const timer = setTimeout(() => {
          isProgrammaticScroll.current = false;
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [section, loading]);

  // Hook Scroll Spy para actualizar el resaltado en el menú lateral
  useEffect(() => {
    if (loading || sections.length === 0 || !onSectionChange) return;

    const scrollContainer = document.querySelector(".content-workspace");
    if (!scrollContainer) return;

    const handleScroll = () => {
      // Si el scroll está siendo provocado por clic, no hacemos nada
      if (isProgrammaticScroll.current) return;

      const sectionElements = sections.map(sec => {
        const id = cleanSectionId(sec.title);
        return document.getElementById(id);
      }).filter(Boolean) as HTMLElement[];

      let activeSectionId = section;
      const containerRect = scrollContainer.getBoundingClientRect();
      const threshold = containerRect.top + 100; // Margen superior de 100px para la detección

      // Encontrar la sección visible que cruzó el umbral superior
      for (const el of sectionElements) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= threshold) {
          activeSectionId = el.id;
        }
      }

      // Ajuste especial: si llegamos al fondo del scroll, activar automáticamente la última sección
      const isAtBottom = Math.abs(scrollContainer.scrollHeight - scrollContainer.clientHeight - scrollContainer.scrollTop) < 15;
      if (isAtBottom && sectionElements.length > 0) {
        activeSectionId = sectionElements[sectionElements.length - 1].id;
      }

      if (activeSectionId && activeSectionId !== currentActiveSection.current) {
        currentActiveSection.current = activeSectionId;
        onSectionChange(activeSectionId);
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    
    // Ejecutar inmediatamente para configurar el estado inicial
    handleScroll();

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [sections, loading, onSectionChange, section]);

  // Renderizador de contenido interno de una sección de Markdown
  const renderSectionContent = (lines: string[]) => {
    const elements: React.ReactNode[] = [];
    let listItems: string[] = [];
    let keyCounter = 0;

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <div key={`list-${keyCounter++}`} style={{ display: "flex", flexDirection: "column", gap: "8px", margin: "12px 0 16px 6px" }}>
            {listItems.map((item, idx) => (
              <div key={`li-${idx}`} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span style={{ color: "var(--primary-color)", fontWeight: 700, fontSize: "0.85rem", marginTop: "2px" }}>✓</span>
                <span style={{ color: "var(--text-color)", fontSize: "0.95rem", lineHeight: "1.5" }}>
                  {parseInlineMarkdown(stripBlockMarkdown(item))}
                </span>
              </div>
            ))}
          </div>
        );
        listItems = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line === "---") {
        flushList();
        elements.push(<hr key={`hr-${keyCounter++}`} style={{ margin: "24px 0", border: "0", borderTop: "1px solid var(--border-color)" }} />);
        continue;
      }

      if (line.startsWith("# ")) {
        flushList();
        elements.push(
          <h1 key={`h1-${keyCounter++}`} style={{ fontSize: "1.8rem", fontWeight: 800, margin: "20px 0 16px", color: "var(--text-color)", letterSpacing: "-0.02em" }}>
            {parseInlineMarkdown(stripBlockMarkdown(line))}
          </h1>
        );
        continue;
      }

      if (line.startsWith("### ")) {
        flushList();
        elements.push(
          <h4 key={`h4-${keyCounter++}`} style={{ fontSize: "1.1rem", fontWeight: 700, margin: "20px 0 8px", color: "var(--text-color)" }}>
            {parseInlineMarkdown(stripBlockMarkdown(line))}
          </h4>
        );
        continue;
      }

      if (line.startsWith("> ")) {
        flushList();
        let blockquoteText = line.replace("> ", "");
        while (i + 1 < lines.length && lines[i + 1].trim().startsWith("> ")) {
          i++;
          blockquoteText += " " + lines[i].trim().replace("> ", "");
        }
        elements.push(
          <div 
            key={`bq-${keyCounter++}`} 
            style={{ 
              borderLeft: "4px solid var(--primary-color)", 
              padding: "14px 18px", 
              margin: "18px 0", 
              background: "linear-gradient(135deg, rgba(255,107,0,0.05) 0%, rgba(255,107,0,0.01) 100%)", 
              borderRadius: "0 8px 8px 0",
              display: "flex",
              gap: "10px",
              alignItems: "flex-start"
            }}
          >
            <Sparkles size={16} style={{ color: "var(--primary-color)", marginTop: "2px", flexShrink: 0 }} />
            <p style={{ fontStyle: "italic", color: "var(--text-color)", lineHeight: "1.6", margin: 0, fontSize: "0.95rem" }}>
              {parseInlineMarkdown(stripBlockMarkdown(blockquoteText))}
            </p>
          </div>
        );
        continue;
      }

      // Ordered lists (e.g. "1. Comprender...")
      const orderedListMatch = line.match(/^(\d+)\.\s+(.*)$/);
      if (orderedListMatch) {
        flushList();
        elements.push(
          <div key={`ol-item-${keyCounter++}`} style={{ display: "flex", gap: "10px", margin: "10px 0", paddingLeft: "4px" }}>
            <span style={{ 
              fontWeight: 700, 
              color: "#fff", 
              backgroundColor: "var(--primary-color)", 
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.75rem",
              flexShrink: 0,
              marginTop: "2px"
            }}>
              {orderedListMatch[1]}
            </span>
            <span style={{ color: "var(--text-color)", lineHeight: "1.5", fontSize: "0.95rem" }}>
              {parseInlineMarkdown(orderedListMatch[2])}
            </span>
          </div>
        );
        continue;
      }

      // Checklist matches
      const checkListMatch = line.match(/^-\s+\[([ xX]?)\]\s+(.*)$/) || line.match(/^\[([ xX]?)\]\s+(.*)$/);
      if (checkListMatch) {
        flushList();
        const isChecked = checkListMatch[1].trim() !== "";
        elements.push(
          <div key={`chk-${keyCounter++}`} style={{ display: "flex", alignItems: "center", gap: "10px", margin: "8px 0" }}>
            <input type="checkbox" checked={isChecked} readOnly style={{ accentColor: "var(--primary-color)", width: "16px", height: "16px", cursor: "default" }} />
            <span style={{ color: "var(--text-color)", fontSize: "0.95rem" }}>
              {parseInlineMarkdown(checkListMatch[2])}
            </span>
          </div>
        );
        continue;
      }

      if (line.startsWith("- ") || line.startsWith("* ")) {
        listItems.push(line);
        continue;
      }

      // Custom formatting for checklist items or alert boxes
      if (line.startsWith("✅ ")) {
        flushList();
        elements.push(
          <div key={`alert-ok-${keyCounter++}`} style={{ display: "flex", gap: "10px", padding: "10px 14px", backgroundColor: "rgba(34,197,94,0.03)", borderLeft: "3px solid #22c55e", borderRadius: "4px", margin: "10px 0" }}>
            <span style={{ color: "#22c55e", fontSize: "0.9rem", fontWeight: 700 }}>
              {parseInlineMarkdown(line)}
            </span>
          </div>
        );
        continue;
      }

      if (line.startsWith("❌ ")) {
        flushList();
        elements.push(
          <div key={`alert-err-${keyCounter++}`} style={{ display: "flex", gap: "10px", padding: "10px 14px", backgroundColor: "rgba(239,68,68,0.03)", borderLeft: "3px solid #ef4444", borderRadius: "4px", margin: "10px 0" }}>
            <span style={{ color: "#ef4444", fontSize: "0.9rem", fontWeight: 700 }}>
              {parseInlineMarkdown(line)}
            </span>
          </div>
        );
        continue;
      }

      if (line === "") {
        flushList();
        continue;
      }

      // Regular paragraph
      flushList();
      elements.push(
        <p key={`p-${keyCounter++}`} style={{ marginBottom: "14px", color: "var(--text-color)", fontSize: "0.95rem", lineHeight: "1.6" }}>
          {parseInlineMarkdown(line)}
        </p>
      );
    }

    flushList();
    return elements;
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div className="spinner" style={{ margin: "20px auto" }} />
        <p style={{ color: "var(--text-muted)" }}>Cargando metodología comercial...</p>
      </div>
    );
  }

  if (!methodology) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h3>Metodología no encontrada</h3>
        <button onClick={onGoBackHome} className="btn-reset" style={{ margin: "20px auto 0" }}>
          Volver al Inicio
        </button>
      </div>
    );
  }

  return (
    <div className="manual-view-container animate-fade-in" style={{ maxWidth: "840px", margin: "0 auto", padding: "20px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <button 
          onClick={onGoBackHome} 
          className="btn-back"
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "6px", 
            background: "none", 
            border: "none", 
            color: "var(--text-muted)", 
            cursor: "pointer",
            fontSize: "0.9rem",
            padding: "4px 8px",
            borderRadius: "4px",
            transition: "all 0.2s"
          }}
        >
          <ArrowLeft size={16} />
          <span>Volver al Inicio</span>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "var(--primary-color)", fontWeight: 600 }}>
          <BookOpen size={14} />
          <span>Metodología Comercial Unificada</span>
        </div>
      </div>

      <div 
        className="manual-paper" 
        style={{ 
          background: "var(--bg-card)", 
          border: "1px solid var(--border-color)", 
          borderRadius: "8px", 
          padding: "36px 40px", 
          boxShadow: "0 4px 12px rgba(0,0,0,0.03)" 
        }}
      >
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, margin: "0 0 8px", color: "var(--text-color)", letterSpacing: "-0.03em" }}>
          {methodology.title}
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "32px" }}>
          Estándares, procesos y técnicas de venta consultiva para el equipo de asesoras Datapath.
        </p>

        <div className="manual-content" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {sections.map((sec) => {
            const id = cleanSectionId(sec.title);
            const isIntro = id === "introduccion";
            return (
              <section 
                key={id} 
                id={id} 
                style={{ 
                  scrollMarginTop: "40px", 
                  paddingTop: isIntro ? "0" : "32px",
                  marginTop: isIntro ? "0" : "12px",
                  borderTop: isIntro ? "none" : "1px solid var(--border-color)"
                }}
              >
                {!isIntro && (
                  <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--primary-color)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--primary-color)" }} />
                    {sec.title}
                  </h2>
                )}
                {renderSectionContent(sec.lines)}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
};
