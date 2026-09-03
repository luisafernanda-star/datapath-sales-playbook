import { useMemo, useState } from "react";
import { ArrowLeft, BookOpen, CalendarPlus, Check, Copy, MessageCircle, RotateCcw, Sparkles, Target } from "lucide-react";
import { DIAGNOSTIC_QUESTIONS, type DiagnosticAnswer } from "../data/diagnosticFlow";
import { buildWhatsAppMessage, recommendPrograms } from "../services/recommendationEngine";
import { curriculaService } from "../services/curriculaService";
import "./AdvancedSimulator.css";

interface Props {
  profileId: string;
  onViewProgram: (programId: string) => void;
}

export function AdvancedSimulator({ profileId, onViewProgram }: Props) {
  const [answers, setAnswers] = useState<DiagnosticAnswer[]>([]);
  const [copied, setCopied] = useState(false);
  const complete = answers.length === DIAGNOSTIC_QUESTIONS.length;
  const question = DIAGNOSTIC_QUESTIONS[answers.length];
  const recommendations = useMemo(() => complete ? recommendPrograms(profileId, answers) : [], [answers, complete, profileId]);
  const message = useMemo(() => buildWhatsAppMessage(recommendations, answers), [recommendations, answers]);
  const progress = Math.round((answers.length / DIAGNOSTIC_QUESTIONS.length) * 100);

  const choose = (option: typeof question.options[number]) => {
    setAnswers((current) => [...current, { questionId: question.id, optionId: option.id, label: option.label, tags: option.tags }]);
  };

  const reset = () => { setAnswers([]); setCopied(false); };
  const createFollowUp = () => {
    const primary = recommendations[0];
    if (!primary) return;
    localStorage.setItem("datapath-followup-draft", JSON.stringify({
      program: primary.program,
      notes: `Diagnóstico: ${answers.map((answer) => answer.label).join(" · ")}\n\nMensaje sugerido: ${message}`
    }));
    window.location.hash = "follow-ups";
  };

  return <section className="advanced-simulator animate-fade-in">
    <header className="advanced-header">
      <div><span className="advanced-kicker"><Sparkles size={15}/> RECOMENDADOR INTELIGENTE</span><h3>Diagnóstico guiado del prospecto</h3><p>Haz las preguntas en orden y obtén una ruta principal con alternativas basadas en Currículas.</p></div>
      <button className="btn-reset" onClick={reset}><RotateCcw size={16}/> Reiniciar</button>
    </header>

    <div className="diagnostic-progress" aria-label={`Progreso ${progress}%`}><span style={{ width: `${progress}%` }}/></div>
    <div className="diagnostic-progress-label"><span>{complete ? "Diagnóstico completo" : `Pregunta ${answers.length + 1} de ${DIAGNOSTIC_QUESTIONS.length}`}</span><strong>{progress}%</strong></div>

    {!complete && question && <div className="diagnostic-layout">
      <article className="diagnostic-question">
        <div className="question-label"><MessageCircle size={16}/> Pregunta sugerida para WhatsApp</div>
        <h3>{question.message}</h3>
        <div className="advisor-tip"><Sparkles size={17}/><p><strong>Enfoque para la asesora</strong>{question.advisorTip}</p></div>
      </article>
      <div className="diagnostic-options">
        <span>Selecciona la respuesta que mejor representa al prospecto</span>
        {question.options.map((option) => <button key={option.id} onClick={() => choose(option)}><strong>{option.label}</strong><small>{option.helper}</small></button>)}
        {answers.length > 0 && <button className="diagnostic-back" onClick={() => setAnswers((current) => current.slice(0, -1))}><ArrowLeft size={15}/> Volver a la pregunta anterior</button>}
      </div>
    </div>}

    {complete && <div className="diagnostic-results">
      <div className="results-heading"><Target size={24}/><div><h3>Ruta recomendada</h3><p>La primera opción es la principal. Las otras dos sirven para comparar profundidad o enfoque.</p></div></div>
      {recommendations.length === 0 ? <div className="diagnostic-empty">No encontramos una coincidencia suficiente. Revisa las respuestas o consulta el catálogo completo.</div> : <div className="recommendation-grid">
        {recommendations.map((item, index) => <article key={item.catalogId} className={index === 0 ? "recommendation-result primary" : "recommendation-result"}>
          <div className="recommendation-rank"><span>{index === 0 ? "Recomendación principal" : `Alternativa ${index}`}</span><small>{item.format}</small></div>
          <h4>{item.program}</h4>
          {item.reasons.length > 0 && <ul>{item.reasons.map((reason) => <li key={reason}><Check size={14}/>{reason}</li>)}</ul>}
          {item.caution && <p className="recommendation-caution">Antes de ofrecerlo: {item.caution}</p>}
          <div className="recommendation-edition">{item.edition ? <><strong>{new Date(item.edition.startDate) >= new Date() ? "Próxima edición" : "Última edición registrada"}</strong><span>{curriculaService.formatStartDate(item.edition)}</span></> : <span>Fecha por confirmar</span>}</div>
          <button className="outline-button" onClick={() => onViewProgram(item.catalogId)}><BookOpen size={15}/> Ver programa</button>
        </article>)}
      </div>}

      {message && <article className="whatsapp-draft"><div className="whatsapp-heading"><div><MessageCircle size={19}/><span>Mensaje listo para WhatsApp</span></div><button onClick={async () => { await navigator.clipboard.writeText(message); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>{copied ? <Check size={15}/> : <Copy size={15}/>} {copied ? "Copiado" : "Copiar mensaje"}</button></div><p>{message}</p></article>}
      <div className="result-actions"><button className="outline-button" onClick={reset}><RotateCcw size={16}/> Nuevo diagnóstico</button><button className="primary-button" onClick={createFollowUp}><CalendarPlus size={16}/> Crear seguimiento con esta recomendación</button></div>
    </div>}
  </section>;
}
