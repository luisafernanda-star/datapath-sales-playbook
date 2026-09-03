import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpen, CalendarPlus, Check, Copy, FileText, MessageCircle, RotateCcw, Send, Sparkles, Target } from "lucide-react";
import type { TeamMember } from "../data/commercialTypes";
import { getDiagnosticQuestions, type DiagnosticAnswer, type DiagnosticOption } from "../data/diagnosticFlow";
import { buildWhatsAppMessage, recommendPrograms } from "../services/recommendationEngine";
import { curriculaService } from "../services/curriculaService";
import { commercialService } from "../services/commercialService";
import "./AdvancedSimulator.css";

interface Props {
  profileId: string;
  onViewProgram: (programId: string) => void;
}

export function AdvancedSimulator({ profileId, onViewProgram }: Props) {
  const [answers, setAnswers] = useState<DiagnosticAnswer[]>([]);
  const [copied, setCopied] = useState(false);
  const [writtenAnswer, setWrittenAnswer] = useState("");
  const [showCustomAnswer, setShowCustomAnswer] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [recipientId, setRecipientId] = useState("");
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState("");
  const questions = useMemo(() => getDiagnosticQuestions(profileId), [profileId]);
  const isCorporate = profileId === "corporate";
  const complete = answers.length === questions.length;
  const question = questions[answers.length];
  const recommendations = useMemo(() => complete && !isCorporate ? recommendPrograms(profileId, answers) : [], [answers, complete, isCorporate, profileId]);
  const message = useMemo(() => buildWhatsAppMessage(recommendations, answers), [recommendations, answers]);
  const quotationRequest = useMemo(() => {
    if (!isCorporate || !complete) return "";
    const details = questions.map((item, index) => `${index + 1}. ${item.message}\n${answers[index]?.label ?? "Sin respuesta"}`).join("\n\n");
    return `SOLICITUD DE COTIZACIÓN – CAPACITACIÓN EMPRESARIAL\n\n${details}\n\nSolicitud registrada el ${new Intl.DateTimeFormat("es-CO", { dateStyle: "long" }).format(new Date())}.`;
  }, [answers, complete, isCorporate, questions]);
  const progress = Math.round((answers.length / questions.length) * 100);

  useEffect(() => {
    if (!isCorporate) return;
    const session = commercialService.getSession();
    if (!session) return;
    commercialService.getTeamMembers(session).then(setTeamMembers).catch(() => setSendStatus("No fue posible cargar Mi red."));
  }, [isCorporate]);

  const choose = (option: DiagnosticOption) => {
    setAnswers((current) => [...current, { questionId: question.id, optionId: option.id, label: option.label, tags: option.tags }]);
    setWrittenAnswer("");
    setShowCustomAnswer(false);
  };

  const submitWrittenAnswer = () => {
    const value = writtenAnswer.trim();
    if (!question || !value) return;
    setAnswers((current) => [...current, { questionId: question.id, optionId: "written", label: value, tags: ["corporate"] }]);
    setWrittenAnswer("");
    setShowCustomAnswer(false);
  };

  const reset = () => { setAnswers([]); setCopied(false); setWrittenAnswer(""); setShowCustomAnswer(false); };
  const createFollowUp = () => {
    const primary = recommendations[0];
    if (!primary) return;
    localStorage.setItem("datapath-followup-draft", JSON.stringify({
      program: primary.program,
      notes: `Diagnóstico: ${answers.map((answer) => answer.label).join(" · ")}\n\nMensaje sugerido: ${message}`
    }));
    window.location.hash = "follow-ups";
  };

  const sendQuotation = async () => {
    const session = commercialService.getSession();
    if (!session) { setSendStatus("Inicia sesión para enviar la solicitud."); return; }
    if (!recipientId) { setSendStatus("Selecciona una persona de Mi red."); return; }
    setSending(true); setSendStatus("");
    try {
      await commercialService.sendNotificationToMember(session, recipientId, { title: "Solicitud de cotización – Capacitación empresarial", message: quotationRequest });
      setSendStatus("Solicitud enviada correctamente. La persona la recibirá en sus notificaciones.");
      window.dispatchEvent(new Event("datapath-session-change"));
    } catch (error) { setSendStatus(error instanceof Error ? error.message : "No fue posible enviar la solicitud."); }
    finally { setSending(false); }
  };

  return <section className="advanced-simulator animate-fade-in">
    <header className="advanced-header">
      <div><span className="advanced-kicker"><Sparkles size={15}/> {isCorporate ? "DIAGNÓSTICO EMPRESARIAL" : "RECOMENDADOR INTELIGENTE"}</span><h3>Diagnóstico guiado del prospecto</h3><p>{isCorporate ? "Reúne la información necesaria para preparar una solicitud de cotización completa." : "Haz las preguntas en orden y obtén una ruta principal con alternativas basadas en Currículas."}</p></div>
      <button className="btn-reset" onClick={reset}><RotateCcw size={16}/> Reiniciar</button>
    </header>

    <div className="diagnostic-progress" aria-label={`Progreso ${progress}%`}><span style={{ width: `${progress}%` }}/></div>
    <div className="diagnostic-progress-label"><span>{complete ? "Diagnóstico completo" : `Pregunta ${answers.length + 1} de ${questions.length}`}</span><strong>{progress}%</strong></div>

    {!complete && question && <div className="diagnostic-layout">
      <article className="diagnostic-question">
        <div className="question-label"><MessageCircle size={16}/> Pregunta sugerida para WhatsApp</div>
        <h3>{question.message}</h3>
        <div className="advisor-tip"><Sparkles size={17}/><p><strong>Enfoque para la asesora</strong>{question.advisorTip}</p></div>
      </article>
      <div className="diagnostic-options">
        <span>Selecciona la respuesta que mejor representa al prospecto</span>
        {question.responseType === "text" || question.responseType === "number" ? <form className="diagnostic-written" onSubmit={(event) => { event.preventDefault(); submitWrittenAnswer(); }}>
          <input type={question.responseType === "number" ? "number" : "text"} min={question.responseType === "number" ? 1 : undefined} value={writtenAnswer} onChange={(event) => setWrittenAnswer(event.target.value)} placeholder={question.placeholder} autoFocus required />
          <button className="primary-button">Continuar</button>
        </form> : <>{question.options.map((option) => <button key={option.id} onClick={() => choose(option)}><strong>{option.label}</strong><small>{option.helper}</small></button>)}
          {isCorporate && !showCustomAnswer && <button className="custom-answer-button" onClick={() => setShowCustomAnswer(true)}><strong>Otra respuesta</strong><small>Escribir exactamente lo que respondió el cliente.</small></button>}
          {isCorporate && showCustomAnswer && <form className="diagnostic-written custom-answer-form" onSubmit={(event) => { event.preventDefault(); submitWrittenAnswer(); }}><input value={writtenAnswer} onChange={(event) => setWrittenAnswer(event.target.value)} placeholder="¿Cuál? Escribe aquí la respuesta del cliente" autoFocus required/><button className="primary-button">Continuar</button></form>}
        </>}
        {answers.length > 0 && <button className="diagnostic-back" onClick={() => { setAnswers((current) => current.slice(0, -1)); setWrittenAnswer(""); setShowCustomAnswer(false); }}><ArrowLeft size={15}/> Volver a la pregunta anterior</button>}
      </div>
    </div>}

    {complete && isCorporate && <div className="diagnostic-results quotation-results">
      <div className="results-heading"><FileText size={24}/><div><h3>Solicitud de cotización</h3><p>Revisa el compilado y envíalo a coordinación comercial para construir la propuesta.</p></div></div>
      <article className="quotation-summary">{questions.map((item, index) => <div key={item.id}><strong>{index + 1}. {item.message}</strong><p>{answers[index]?.label}</p></div>)}</article>
      <div className="quotation-recipient"><label>Enviar solicitud a una persona de Mi red<select value={recipientId} onChange={(event) => { setRecipientId(event.target.value); setSendStatus(""); }}><option value="">Selecciona un perfil…</option>{teamMembers.map((member) => <option key={member.userId} value={member.userId}>{member.displayName || member.email} · {member.email}</option>)}</select></label><button className="primary-button" disabled={sending || !recipientId} onClick={() => void sendQuotation()}><Send size={16}/> {sending ? "Enviando…" : "Enviar solicitud"}</button></div>
      {sendStatus && <p className={sendStatus.startsWith("Solicitud enviada") ? "quotation-status success" : "quotation-status"} role="status">{sendStatus}</p>}
      <div className="result-actions"><button className="outline-button" onClick={reset}><RotateCcw size={16}/> Nueva solicitud</button><button className="outline-button" onClick={async () => { await navigator.clipboard.writeText(quotationRequest); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>{copied ? <Check size={16}/> : <Copy size={16}/>} {copied ? "Solicitud copiada" : "Copiar solicitud"}</button></div>
    </div>}

    {complete && !isCorporate && <div className="diagnostic-results">
      <div className="results-heading"><Target size={24}/><div><h3>Ruta recomendada</h3><p>La primera opción es la principal. Las otras dos sirven para comparar profundidad o enfoque.</p></div></div>
      {recommendations.length === 0 ? <div className="diagnostic-empty">No encontramos una coincidencia suficiente. Revisa las respuestas o consulta el catálogo completo.</div> : <div className="recommendation-grid">
        {recommendations.map((item, index) => <article key={item.catalogId} className={index === 0 ? "recommendation-result primary" : "recommendation-result"}>
          <div className="recommendation-rank"><span>{index === 0 ? "Recomendación principal" : `Alternativa ${index}`}</span><small>{item.format} · {item.deliveryMode}</small></div>
          <h4>{item.program}</h4>
          {item.reasons.length > 0 && <ul>{item.reasons.map((reason) => <li key={reason}><Check size={14}/>{reason}</li>)}</ul>}
          {item.caution && <p className="recommendation-caution">Antes de ofrecerlo: {item.caution}</p>}
          <div className="recommendation-edition">{item.deliveryMode === "Asincrónico" ? <><strong>Modalidad asincrónica</strong><span>Disponible para avanzar a su propio ritmo.</span></> : item.edition && item.showEditionDate ? <><strong>{new Date(item.edition.startDate) >= new Date() ? "Próxima edición" : "Edición iniciada recientemente"}</strong><span>{curriculaService.formatStartDate(item.edition)}</span></> : null}</div>
          <button className="outline-button" onClick={() => onViewProgram(item.catalogId)}><BookOpen size={15}/> Ver programa</button>
        </article>)}
      </div>}

      {message && <article className="whatsapp-draft"><div className="whatsapp-heading"><div><MessageCircle size={19}/><span>Mensaje listo para WhatsApp</span></div><button onClick={async () => { await navigator.clipboard.writeText(message); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>{copied ? <Check size={15}/> : <Copy size={15}/>} {copied ? "Copiado" : "Copiar mensaje"}</button></div><p>{message}</p></article>}
      <div className="result-actions"><button className="outline-button" onClick={reset}><RotateCcw size={16}/> Nuevo diagnóstico</button><button className="primary-button" onClick={createFollowUp}><CalendarPlus size={16}/> Crear seguimiento con esta recomendación</button></div>
    </div>}
  </section>;
}
