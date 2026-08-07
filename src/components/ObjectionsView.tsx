import React, { useState, useEffect } from "react";
import { contentService } from "../services/contentService";
import { parseInlineMarkdown } from "../utils/markdown";
import type { Objection } from "../data/playbookData";
import { ChevronDown, ChevronUp, Copy, Check, MessageSquareCode, ShieldAlert } from "lucide-react";

export const ObjectionsView: React.FC = () => {
  // Track open state for each objection (accordion style)
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({
    "no-time": true, // Open the first one by default
    "too-expensive": false,
    "no-experience": false,
    "guarantee": false
  });
  
  // Track which objection has been copied
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [objections, setObjections] = useState<Objection[]>([]);

  // Carga asincrónica de objeciones (preparado para consumir Markdown en el futuro)
  useEffect(() => {
    contentService.getObjections().then(setObjections);
  }, []);

  const toggleOpen = (id: string) => {
    setOpenStates((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopyScript = (id: string, text: string) => {
    // Strip quotes if they exist around the script for clean pasting
    const cleanText = text.replace(/^"|"$/g, "");
    
    navigator.clipboard.writeText(cleanText).then(() => {
      setCopiedId(id);
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      <div>
        <h2 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
          Manejo de Objeciones Frecuentes
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: "4px" }}>
          Respuestas listas para copiar y pegar ante las dudas más comunes de los prospectos en WhatsApp.
        </p>
      </div>

      <div className="objections-list">
        {objections.map((objection) => {
          const isOpen = openStates[objection.id];
          const isCopied = copiedId === objection.id;
          
          return (
            <div key={objection.id} className="objection-item">
              {/* Accordion Header */}
              <div onClick={() => toggleOpen(objection.id)} className="objection-header">
                <span className="objection-title">{objection.title}</span>
                {isOpen ? <ChevronUp size={18} color="var(--text-secondary)" /> : <ChevronDown size={18} color="var(--text-secondary)" />}
              </div>

              {/* Accordion Body */}
              {isOpen && (
                <div className="objection-body">
                  {/* Common Phrases */}
                  <div className="phrases-container">
                    <span className="phrases-title">El prospecto suele decir:</span>
                    <div className="phrases-list">
                      {objection.commonPhrases.map((phrase, index) => (
                        <div key={index} className="phrase-badge">
                          "{phrase}"
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rebuttal Strategy */}
                  <div className="strategy-box">
                    <div className="strategy-title" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <ShieldAlert size={14} color="var(--text-secondary)" />
                      <span>Estrategia de Rebatimiento</span>
                    </div>
                    <p className="strategy-text">{parseInlineMarkdown(objection.rebuttalStrategy)}</p>
                  </div>

                  {/* Copyable Script */}
                  <div className="script-box">
                    <div className="script-title">
                      <MessageSquareCode size={14} color="var(--color-orange)" />
                      <span>Mensaje recomendado para enviar (WhatsApp)</span>
                    </div>
                    <p className="script-text">{parseInlineMarkdown(objection.suggestedScript)}</p>
                    
                    <button
                      onClick={() => handleCopyScript(objection.id, objection.suggestedScript)}
                      className="copy-button"
                    >
                      {isCopied ? (
                        <>
                          <Check size={14} color="#10b981" />
                          <span style={{ color: "#10b981" }}>Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Copiar Mensaje</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
