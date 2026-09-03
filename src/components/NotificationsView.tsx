import { useCallback, useEffect, useMemo, useState } from "react";
import { Bell, CalendarClock, CheckCheck, Megaphone, Plus, RefreshCw, Trash2 } from "lucide-react";
import type { AppNotification, CommercialSession, FollowUp } from "../data/commercialTypes";
import { commercialService } from "../services/commercialService";
import "./NotificationsView.css";

interface NotificationsViewProps {
  updateAvailable: boolean;
  onChanged: () => void;
}

export function NotificationsView({ updateAvailable, onChanged }: NotificationsViewProps) {
  const [session] = useState<CommercialSession | null>(() => commercialService.getSession());
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [showComposer, setShowComposer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || "luisa@datapath.ai").toLowerCase();
  const isAdmin = session?.email.toLowerCase() === adminEmail;

  const load = useCallback(async () => {
    if (!session) return;
    setLoading(true); setMessage("");
    try {
      const [general, followUpItems] = await Promise.all([
        commercialService.getNotifications(session),
        commercialService.getFollowUps(session)
      ]);
      setNotifications(general);
      setFollowUps(followUpItems.filter((item) => item.status === "pending"));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No fue posible cargar las notificaciones.");
    } finally { setLoading(false); }
  }, [session]);

  useEffect(() => { void load(); }, [load]);

  const orderedFollowUps = useMemo(() => [...followUps].sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()), [followUps]);
  const unread = notifications.filter((item) => !item.read);

  if (!session) return <section className="notifications-page"><div><p className="eyebrow">CENTRO PERSONAL</p><h1>Notificaciones</h1><p className="notifications-lead">Inicia sesión primero en <strong>Mis seguimientos</strong> para consultar tus recordatorios y avisos del equipo.</p></div><div className="notifications-empty"><Bell size={30}/><h2>Tu sesión aún no está abierta</h2><p>Cuando ingreses con tu cuenta, aquí encontrarás todos tus avisos.</p></div></section>;

  const markAllRead = async () => {
    if (!session || unread.length === 0) return;
    await Promise.all(unread.map((item) => commercialService.markNotificationRead(session, item.id)));
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
    onChanged();
  };

  const deleteNotification = async (id: string) => {
    if (!session || !window.confirm("¿Eliminar este aviso para todo el equipo?")) return;
    await commercialService.deleteNotification(session, id);
    setNotifications((current) => current.filter((item) => item.id !== id));
    onChanged();
  };

  return <section className="notifications-page">
    <div className="notifications-heading"><div><p className="eyebrow">CENTRO PERSONAL</p><h1>Notificaciones</h1><p className="notifications-lead">Avisos del equipo, actualizaciones y próximos seguimientos.</p></div><div className="notifications-actions">{unread.length > 0 && <button className="outline-button" onClick={() => void markAllRead()}><CheckCheck size={16}/> Marcar avisos como leídos</button>}{isAdmin && <button className="primary-button" onClick={() => setShowComposer(true)}><Plus size={16}/> Publicar aviso</button>}</div></div>
    {message && <p className="form-message" role="alert">{message}</p>}

    {updateAvailable && <article className="update-notification"><div className="notification-icon"><RefreshCw size={19}/></div><div><span className="notification-type">NUEVA ACTUALIZACIÓN</span><h2>Hay una nueva versión de la plataforma</h2><p>Recarga para ver los cambios y mejoras que se acaban de publicar.</p></div><button className="primary-button" onClick={() => window.location.reload()}><RefreshCw size={16}/> Recargar ahora</button></article>}

    <div className="notifications-grid">
      <section className="notification-section"><div className="notification-section-title"><div><Megaphone size={18}/><h2>Avisos del equipo</h2></div><span>{notifications.length}</span></div>{loading ? <p className="notifications-muted">Cargando…</p> : notifications.length === 0 ? <div className="notifications-empty compact"><Megaphone size={24}/><p>Todavía no hay avisos generales.</p></div> : <div className="notification-list">{notifications.map((item) => <article className={`notification-card ${item.read ? "" : "unread"}`} key={item.id} onClick={async () => { if (item.read) return; await commercialService.markNotificationRead(session, item.id); setNotifications((current) => current.map((entry) => entry.id === item.id ? { ...entry, read: true } : entry)); onChanged(); }}><div><div className="notification-meta">{!item.read && <span className="unread-dot"/>}<time>{formatDate(item.createdAt)}</time></div><h3>{item.title}</h3><p>{item.message}</p></div>{isAdmin && <button className="icon-button danger-icon" aria-label="Eliminar aviso" onClick={(event) => { event.stopPropagation(); void deleteNotification(item.id); }}><Trash2 size={15}/></button>}</article>)}</div>}</section>

      <section className="notification-section"><div className="notification-section-title"><div><CalendarClock size={18}/><h2>Seguimientos pendientes</h2></div><span>{orderedFollowUps.length}</span></div>{loading ? <p className="notifications-muted">Cargando…</p> : orderedFollowUps.length === 0 ? <div className="notifications-empty compact"><CalendarClock size={24}/><p>No tienes seguimientos pendientes.</p></div> : <div className="notification-list">{orderedFollowUps.map((item) => { const overdue = new Date(item.dueAt).getTime() < Date.now(); return <article className={`notification-card followup-reminder ${overdue ? "overdue" : ""}`} key={item.id}><div><div className="notification-meta"><span>{overdue ? "VENCIDO" : relativeDay(item.dueAt)}</span><time>{formatDate(item.dueAt, true)}</time></div><h3>{item.clientName}</h3><p>{item.program || "Programa por definir"}{item.notes ? ` · ${item.notes}` : ""}</p></div></article>; })}</div>}</section>
    </div>
    {showComposer && <NotificationComposer loading={loading} onCancel={() => setShowComposer(false)} onSave={async (draft) => { if (!session) return; setLoading(true); setMessage(""); try { const saved = await commercialService.createNotification(session, draft); setNotifications((current) => [saved, ...current]); setShowComposer(false); onChanged(); } catch (error) { setMessage(error instanceof Error ? error.message : "No fue posible publicar el aviso."); } finally { setLoading(false); } }}/>} 
  </section>;
}

function NotificationComposer({ loading, onCancel, onSave }: { loading: boolean; onCancel: () => void; onSave: (draft: { title: string; message: string; expiresAt?: string }) => void }) {
  const [title, setTitle] = useState(""); const [message, setMessage] = useState(""); const [expiresAt, setExpiresAt] = useState("");
  return <div className="modal-backdrop"><form className="editor-modal notification-composer" onSubmit={(event) => { event.preventDefault(); onSave({ title, message, expiresAt: expiresAt ? new Date(`${expiresAt}T23:59:59`).toISOString() : undefined }); }}><div className="editor-heading"><div><p className="eyebrow">ADMINISTRACIÓN</p><h2>Publicar aviso para el equipo</h2></div><button type="button" className="icon-button" aria-label="Cerrar" onClick={onCancel}>×</button></div><label>Título<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ej. Nuevo beneficio disponible" required/></label><label>Mensaje<textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Escribe el aviso que verán las asesoras…" required/></label><label>Mostrar hasta esta fecha (opcional)<input type="date" value={expiresAt} onChange={(event) => setExpiresAt(event.target.value)}/></label><div className="editor-actions"><span/><button type="button" className="outline-button" onClick={onCancel}>Cancelar</button><button className="primary-button" disabled={loading}>{loading ? "Publicando…" : "Publicar aviso"}</button></div></form></div>;
}

const formatDate = (value: string, includeTime = false) => new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", ...(includeTime ? { hour: "numeric", minute: "2-digit" } : {}) }).format(new Date(value));
const relativeDay = (value: string) => {
  const date = new Date(value); const today = new Date();
  const dateKey = date.toLocaleDateString("en-CA"); const todayKey = today.toLocaleDateString("en-CA");
  const tomorrowKey = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toLocaleDateString("en-CA");
  if (dateKey === todayKey) return "HOY";
  if (dateKey === tomorrowKey) return "MAÑANA";
  return "PRÓXIMO";
};
