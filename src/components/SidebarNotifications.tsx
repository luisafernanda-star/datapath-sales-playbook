import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Bell, CalendarDays, Megaphone, Plus, RefreshCw } from "lucide-react";
import type { AppNotification, FollowUp } from "../data/commercialTypes";
import { commercialService } from "../services/commercialService";

interface SidebarNotificationsProps {
  count: number;
  updateAvailable: boolean;
  onNavigate: (tab: string) => void;
}

export function SidebarNotifications({ count, updateAvailable, onNavigate }: SidebarNotificationsProps) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const session = commercialService.getSession();
  const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || "luisa@datapath.ai").toLowerCase();
  const isAdmin = session?.email.toLowerCase() === adminEmail;

  const load = useCallback(async () => {
    const activeSession = commercialService.getSession();
    if (!activeSession) return;
    setLoading(true);
    const [notificationResult, followUpResult] = await Promise.allSettled([
      commercialService.getNotifications(activeSession), commercialService.getFollowUps(activeSession)
    ]);
    if (notificationResult.status === "fulfilled") setNotifications(notificationResult.value.slice(0, 2));
    if (followUpResult.status === "fulfilled") setFollowUps(followUpResult.value.filter((item) => item.status === "pending"));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    void load();
    const closeOutside = (event: MouseEvent) => { if (!rootRef.current?.contains(event.target as Node)) setOpen(false); };
    const closeEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", closeOutside); document.addEventListener("keydown", closeEscape);
    return () => { document.removeEventListener("mousedown", closeOutside); document.removeEventListener("keydown", closeEscape); };
  }, [load, open]);

  const nextFollowUp = useMemo(() => [...followUps].sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())[0], [followUps]);
  const go = (tab: string) => { setOpen(false); onNavigate(tab); };

  return <div className="sidebar-notifications" ref={rootRef}>
    <button className={`sidebar-bell ${count > 0 ? "has-alerts" : ""}`} onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-label={`Abrir resumen de notificaciones${count ? `, ${count} pendientes` : ""}`} title="Notificaciones"><Bell size={18}/>{count > 0 && <span>{count > 99 ? "99+" : count}</span>}</button>
    {open && <div className="sidebar-notification-popover" role="dialog" aria-label="Notificaciones recientes">
      <div className="sidebar-popover-heading"><div><strong>Notificaciones</strong><small>Lo más reciente</small></div><button onClick={() => go("notifications")}>Ver todas <ArrowRight size={13}/></button></div>
      {!session ? <div className="sidebar-popover-empty"><Bell size={22}/><p>Inicia sesión en Mis seguimientos para ver tus avisos.</p></div> : loading ? <div className="sidebar-popover-empty"><p>Actualizando…</p></div> : <div className="sidebar-popover-list">
        {updateAvailable && <button onClick={() => window.location.reload()}><span className="popover-icon update"><RefreshCw size={16}/></span><span><strong>Nueva versión disponible</strong><small>Recarga para ver los cambios.</small></span></button>}
        {notifications.map((item) => <button key={item.id} onClick={() => go("notifications")}><span className="popover-icon"><Megaphone size={16}/></span><span><strong>{item.title}</strong><small>{item.message}</small></span>{!item.read && <i/>}</button>)}
        {nextFollowUp && <button onClick={() => go("follow-ups")}><span className="popover-icon followup"><CalendarDays size={16}/></span><span><strong>Seguimiento: {nextFollowUp.clientName}</strong><small>{formatFollowUp(nextFollowUp.dueAt)} · {nextFollowUp.program || "Programa por definir"}</small></span></button>}
        {!updateAvailable && notifications.length === 0 && !nextFollowUp && <div className="sidebar-popover-empty"><Bell size={22}/><p>No tienes novedades por ahora.</p></div>}
      </div>}
      <div className="sidebar-popover-footer">{isAdmin && <button className="publish-shortcut" onClick={() => go("notifications")}><Plus size={15}/> Publicar aviso al equipo</button>}<button onClick={() => go("notifications")}>Abrir centro de notificaciones</button></div>
    </div>}
  </div>;
}

const formatFollowUp = (value: string) => new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }).format(new Date(value));
