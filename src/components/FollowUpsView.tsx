import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Check, LogOut, Paperclip, Pencil, Plus, Trash2 } from "lucide-react";
import type { CommercialSession, FollowUp } from "../data/commercialTypes";
import { commercialService } from "../services/commercialService";
import "./FollowUpsView.css";

const blankFollowUp = (userId = ""): FollowUp => ({
  id: "", userId, clientName: "", phone: "", program: "",
  dueAt: new Date(Date.now() + 86400000).toISOString().slice(0, 16), notes: "", status: "pending"
});

export function FollowUpsView() {
  const [session, setSession] = useState<CommercialSession | null>(commercialService.getSession());
  const [items, setItems] = useState<FollowUp[]>([]);
  const [editing, setEditing] = useState<FollowUp | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"pending" | "completed">("pending");

  useEffect(() => {
    if (!session) return;
    setLoading(true);
    commercialService.getFollowUps(session).then(setItems).catch((error) => setMessage(error.message)).finally(() => setLoading(false));
    const savedDraft = localStorage.getItem("datapath-followup-draft");
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft) as { program?: string; notes?: string };
        setEditing({ ...blankFollowUp(session.userId), program: draft.program ?? "", notes: draft.notes ?? "" });
      } finally {
        localStorage.removeItem("datapath-followup-draft");
      }
    }
  }, [session]);

  const grouped = useMemo(() => items.filter((item) => item.status === view).reduce<Record<string, FollowUp[]>>((result, item) => {
    const key = item.dueAt.slice(0, 10);
    (result[key] ||= []).push(item);
    return result;
  }, {}), [items, view]);

  const signIn = async (event: React.FormEvent) => {
    event.preventDefault(); setLoading(true); setMessage("");
    try { setSession(await commercialService.signIn(email, password)); setPassword(""); }
    catch (error) { setMessage(error instanceof Error ? error.message : "No fue posible iniciar sesión."); }
    finally { setLoading(false); }
  };

  if (!commercialService.configured) return <section className="followups-page"><h1>Mis seguimientos</h1><div className="followups-empty">Conecta Supabase para activar las cuentas y el calendario persistente.</div></section>;
  if (!session) return <section className="followups-page followups-narrow"><div><p className="eyebrow">ESPACIO PERSONAL</p><h1>Mis seguimientos</h1><p className="followups-lead">Entra con la cuenta individual creada para ti.</p></div><form className="followups-form" onSubmit={signIn}><label>Correo<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label>Contraseña<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>{message && <p className="form-message" role="alert">{message}</p>}<button className="primary-button" disabled={loading}>{loading ? "Ingresando…" : "Ingresar"}</button></form></section>;

  const save = async (draft: FollowUp, file?: File) => {
    setLoading(true); setMessage("");
    try {
      const attachmentUrl = file ? await commercialService.uploadFollowUpAttachment(session, file) : draft.attachmentUrl;
      const saved = await commercialService.saveFollowUp(session, { ...draft, attachmentUrl });
      setItems((current) => draft.id ? current.map((item) => item.id === saved.id ? saved : item) : [...current, saved]);
      setEditing(null);
    } catch (error) { setMessage(error instanceof Error ? error.message : "No fue posible guardar."); }
    finally { setLoading(false); }
  };

  const toggleComplete = async (item: FollowUp) => {
    const saved = await commercialService.saveFollowUp(session, { ...item, status: item.status === "pending" ? "completed" : "pending" });
    setItems((current) => current.map((entry) => entry.id === saved.id ? saved : entry));
  };

  return <section className="followups-page">
    <div className="followups-heading"><div><p className="eyebrow">ESPACIO PERSONAL</p><h1>Mis seguimientos</h1><p className="followups-lead">Organiza aquí los próximos contactos con tus prospectos.</p></div><div className="followups-actions"><span>{session.email}</span><button className="primary-button" onClick={() => setEditing(blankFollowUp(session.userId))}><Plus size={16}/> Nuevo seguimiento</button><button className="icon-button" aria-label="Cerrar sesión" onClick={() => { commercialService.signOut(); setSession(null); }}><LogOut size={17}/></button></div></div>
    <div className="followups-tabs" role="tablist"><button className={view === "pending" ? "active" : ""} onClick={() => setView("pending")}>Pendientes</button><button className={view === "completed" ? "active" : ""} onClick={() => setView("completed")}>Completados</button></div>
    {message && <p className="form-message" role="alert">{message}</p>}
    {loading && !editing ? <p>Cargando…</p> : Object.keys(grouped).length === 0 ? <div className="followups-empty"><CalendarDays size={28}/><h2>No tienes seguimientos {view === "pending" ? "pendientes" : "completados"}</h2><p>Crea uno para que la información quede guardada en tu cuenta.</p></div> : Object.entries(grouped).map(([date, dayItems]) => <section className="followups-day" key={date}><h2>{new Intl.DateTimeFormat("es-CO", { weekday: "long", day: "numeric", month: "long" }).format(new Date(`${date}T12:00:00`))}</h2><div className="followups-list">{dayItems.map((item) => <article className="followup-card" key={item.id}><button className="followup-check" aria-label={item.status === "pending" ? "Marcar como completado" : "Marcar como pendiente"} onClick={() => void toggleComplete(item)}><Check size={16}/></button><div><strong>{item.clientName}</strong><p>{new Date(item.dueAt).toLocaleTimeString("es-CO", { hour: "numeric", minute: "2-digit" })} · {item.program || "Programa por definir"}</p>{item.phone && <a href={`https://wa.me/${item.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">{item.phone}</a>}{item.notes && <p className="followup-notes">{item.notes}</p>}{item.attachmentUrl && <a href={item.attachmentUrl} target="_blank" rel="noreferrer"><Paperclip size={13}/> Ver captura</a>}</div><div className="followup-card-actions"><button className="icon-button" aria-label="Editar seguimiento" onClick={() => setEditing(item)}><Pencil size={15}/></button><button className="icon-button danger-icon" aria-label="Eliminar seguimiento" onClick={async () => { await commercialService.deleteFollowUp(session, item.id); setItems((current) => current.filter((entry) => entry.id !== item.id)); }}><Trash2 size={15}/></button></div></article>)}</div></section>)}
    {editing && <FollowUpEditor value={editing} loading={loading} onCancel={() => setEditing(null)} onSave={save}/>} 
  </section>;
}

function FollowUpEditor({ value, loading, onCancel, onSave }: { value: FollowUp; loading: boolean; onCancel: () => void; onSave: (value: FollowUp, file?: File) => void }) {
  const [draft, setDraft] = useState(value); const [file, setFile] = useState<File>();
  const set = (key: keyof FollowUp, value: string) => setDraft((current) => ({ ...current, [key]: value }));
  return <div className="modal-backdrop"><form className="editor-modal followup-editor" onSubmit={(event) => { event.preventDefault(); onSave(draft, file); }}><div className="editor-heading"><div><p className="eyebrow">SEGUIMIENTO</p><h2>{draft.id ? "Editar seguimiento" : "Nuevo seguimiento"}</h2></div><button type="button" className="icon-button" aria-label="Cerrar" onClick={onCancel}>×</button></div><div className="form-grid"><label>Cliente<input value={draft.clientName} onChange={(event) => set("clientName", event.target.value)} required/></label><label>Fecha y hora<input type="datetime-local" value={draft.dueAt.slice(0, 16)} onChange={(event) => set("dueAt", event.target.value)} required/></label><label>Teléfono / WhatsApp<input value={draft.phone} onChange={(event) => set("phone", event.target.value)} placeholder="Ej. +57 300 000 0000"/></label><label>Programa<input value={draft.program} onChange={(event) => set("program", event.target.value)} placeholder="Programa de interés"/></label></div><label>Notas<textarea value={draft.notes} onChange={(event) => set("notes", event.target.value)} placeholder="Contexto, acuerdos y próximo paso"/></label><label>Captura o archivo<input type="file" accept="image/*,.pdf" onChange={(event) => setFile(event.target.files?.[0])}/></label><div className="editor-actions"><span/><button type="button" className="outline-button" onClick={onCancel}>Cancelar</button><button className="primary-button" disabled={loading}>{loading ? "Guardando…" : "Guardar"}</button></div></form></div>;
}
