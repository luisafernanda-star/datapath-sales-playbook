import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Bell, BookOpen, CalendarDays, CreditCard, FileText, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";
import type { AppNotification, FollowUp } from "../data/commercialTypes";
import type { Profile } from "../data/playbookData";
import { commercialService } from "../services/commercialService";
import { curriculaService } from "../services/curriculaService";
import { ProfileCard } from "./ProfileCard";
import "./HomeDashboard.css";

interface HomeDashboardProps {
  profiles: Record<string, Profile>;
  notificationCount: number;
  updateAvailable: boolean;
  onNavigate: (tab: string) => void;
  onSelectProfile: (profileId: string) => void;
}

export function HomeDashboard({ profiles, notificationCount, updateAvailable, onNavigate, onSelectProfile }: HomeDashboardProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const loadPreview = useCallback(async () => {
    const session = commercialService.getSession();
    if (!session) return;
    setLoading(true);
    const [notificationResult, followUpResult] = await Promise.allSettled([
      commercialService.getNotifications(session), commercialService.getFollowUps(session)
    ]);
    if (notificationResult.status === "fulfilled") setNotifications(notificationResult.value);
    if (followUpResult.status === "fulfilled") setFollowUps(followUpResult.value.filter((item) => item.status === "pending"));
    setLoading(false);
  }, []);

  useEffect(() => { void loadPreview(); }, [loadPreview]);
  useEffect(() => {
    if (!previewOpen) return;
    const close = (event: MouseEvent) => { if (!previewRef.current?.contains(event.target as Node)) setPreviewOpen(false); };
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setPreviewOpen(false); };
    document.addEventListener("mousedown", close); document.addEventListener("keydown", closeOnEscape);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", closeOnEscape); };
  }, [previewOpen]);

  const nextFollowUp = useMemo(() => [...followUps].sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())[0], [followUps]);
  const latestNotification = notifications[0];

  return <div className="home-dashboard animate-fade-in">
    <header className="dashboard-header">
      <div><p className="eyebrow">ESPACIO DE TRABAJO COMERCIAL</p><h1>Hola, equipo Datapath</h1><p>Todo lo necesario para gestionar conversaciones, programas y seguimientos desde un solo lugar.</p></div>
      <div className="home-notification" ref={previewRef}>
        <button className={`home-bell ${notificationCount > 0 ? "has-notifications" : ""}`} onClick={() => { setPreviewOpen((current) => !current); void loadPreview(); }} aria-expanded={previewOpen} aria-label={`Abrir resumen de notificaciones${notificationCount ? `, ${notificationCount} pendientes` : ""}`}><Bell size={22}/><span className="home-bell-label">Notificaciones</span>{notificationCount > 0 && <strong>{notificationCount > 99 ? "99+" : notificationCount}</strong>}</button>
        {previewOpen && <div className="notification-preview" role="dialog" aria-label="Resumen de notificaciones"><div className="preview-heading"><div><strong>Lo más reciente</strong><span>Resumen de tus notificaciones</span></div><button onClick={() => onNavigate("notifications")}>Ver todas <ArrowRight size={14}/></button></div>{loading ? <p className="preview-empty">Actualizando…</p> : <div className="preview-list">{updateAvailable && <button onClick={() => window.location.reload()}><span className="preview-icon update"><RefreshCw size={16}/></span><span><strong>Nueva versión disponible</strong><small>Haz clic para recargar la plataforma.</small></span></button>}{latestNotification && <button onClick={() => onNavigate("notifications")}><span className="preview-icon"><Bell size={16}/></span><span><strong>{latestNotification.title}</strong><small>{latestNotification.message}</small></span></button>}{nextFollowUp && <button onClick={() => onNavigate("follow-ups")}><span className="preview-icon calendar"><CalendarDays size={16}/></span><span><strong>Seguimiento: {nextFollowUp.clientName}</strong><small>{formatFollowUp(nextFollowUp.dueAt)} · {nextFollowUp.program || "Programa por definir"}</small></span></button>}{!updateAvailable && !latestNotification && !nextFollowUp && <p className="preview-empty">No tienes novedades por ahora.</p>}</div>}<button className="preview-footer" onClick={() => onNavigate("notifications")}>Abrir centro de notificaciones</button></div>}
      </div>
    </header>

    <section className="dashboard-summary" aria-label="Resumen del día">
      <button onClick={() => onNavigate("follow-ups")}><span className="summary-icon"><CalendarDays size={21}/></span><span><small>Seguimientos pendientes</small><strong>{followUps.length}</strong></span><ArrowRight size={17}/></button>
      <button onClick={() => onNavigate("programs")}><span className="summary-icon blue"><BookOpen size={21}/></span><span><small>Programas en Currículas</small><strong>{curriculaService.getPrograms().length}</strong></span><ArrowRight size={17}/></button>
      <button onClick={() => onNavigate("notifications")}><span className="summary-icon violet"><Bell size={21}/></span><span><small>Novedades por revisar</small><strong>{notificationCount}</strong></span><ArrowRight size={17}/></button>
    </section>

    <div className="dashboard-main-grid">
      <section><div className="dashboard-section-heading"><div><p className="eyebrow">ACCESOS RÁPIDOS</p><h2>¿Qué necesitas hacer?</h2></div></div><div className="quick-actions"><button onClick={() => onNavigate("follow-ups")}><CalendarDays size={21}/><span><strong>Gestionar seguimientos</strong><small>Agenda y revisa contactos pendientes.</small></span></button><button onClick={() => onNavigate("programs")}><BookOpen size={21}/><span><strong>Consultar programas</strong><small>Explora la currícula y edición vigente.</small></span></button><button onClick={() => onNavigate("commercial")}><CreditCard size={21}/><span><strong>Links y cupones</strong><small>Encuentra precios y recursos de pago.</small></span></button><button onClick={() => onNavigate("manual-flujo-comercial")}><FileText size={21}/><span><strong>Guía comercial</strong><small>Repasa el flujo y las mejores prácticas.</small></span></button></div></section>
      <aside className="today-card"><p className="eyebrow">PRÓXIMO PASO</p>{nextFollowUp ? <><div className="today-date">{formatFollowUp(nextFollowUp.dueAt)}</div><h2>{nextFollowUp.clientName}</h2><p>{nextFollowUp.program || "Programa por definir"}</p>{nextFollowUp.notes && <blockquote>{nextFollowUp.notes}</blockquote>}<button className="primary-button" onClick={() => onNavigate("follow-ups")}>Ver seguimiento <ArrowRight size={15}/></button></> : <><span className="today-empty-icon"><CalendarDays size={25}/></span><h2>Tu agenda está al día</h2><p>No hay seguimientos pendientes en tu cuenta.</p><button className="outline-button" onClick={() => onNavigate("follow-ups")}>Crear seguimiento</button></>}</aside>
    </div>

    <section className="dashboard-profiles"><div className="dashboard-section-heading"><div><p className="eyebrow">SIMULADOR DE CONVERSACIONES</p><h2>Empieza por el perfil del prospecto</h2></div><span>Selecciona el caso que mejor corresponda.</span></div><div className="profile-grid">{Object.values(profiles).map((profile) => <ProfileCard key={profile.id} id={profile.id} title={profile.title} iconName={profile.icon} description={profile.description} onClick={() => onSelectProfile(profile.id)}/>)}</div></section>

    <section className="dashboard-resources"><button onClick={() => onNavigate("manual-filosofia-comercial")}><ShieldCheck size={18}/><span><strong>Filosofía Comercial</strong><small>Misión, principios y estándares.</small></span></button><button onClick={() => onNavigate("manual-reglas-de-oro")}><Sparkles size={18}/><span><strong>Reglas de Oro</strong><small>Estándares de calidad comercial.</small></span></button></section>
  </div>;
}

const formatFollowUp = (value: string) => new Intl.DateTimeFormat("es-CO", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }).format(new Date(value));
