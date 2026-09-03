import { useCallback, useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { ProfileCard } from "./components/ProfileCard";
import { ProfileContent } from "./components/ProfileContent";
import { ProgramsView } from "./components/ProgramsView";
import { ObjectionsView } from "./components/ObjectionsView";
import { ManualView } from "./components/ManualView";
import { CommercialHub } from "./components/CommercialHub";
import { FollowUpsView } from "./components/FollowUpsView";
import { NotificationsView } from "./components/NotificationsView";
import { commercialService } from "./services/commercialService";
import { contentService } from "./services/contentService";
import type { Profile } from "./data/playbookData";
import { Bell, Menu, Sparkles, ShieldCheck } from "lucide-react";

function App() {
  const [activeTab, setActiveTabState] = useState<string>(() => window.location.hash.slice(1) || "home");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [highlightedProgramId, setHighlightedProgramId] = useState<string | undefined>(undefined);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  // Carga inicial de perfiles a través de la capa de servicio (contentService)
  useEffect(() => {
    contentService.getProfiles().then(setProfiles);
  }, []);

  useEffect(() => {
    const checkVersion = async () => {
      try {
        const response = await fetch(`/version.json?t=${Date.now()}`, { cache: "no-store" });
        const payload = await response.json() as { version?: string };
        if (payload.version && payload.version !== __APP_VERSION__) setUpdateAvailable(true);
      } catch { /* La siguiente comprobación lo intentará de nuevo. */ }
    };
    void checkVersion();
    const interval = window.setInterval(checkVersion, 60000);
    const onVisibility = () => { if (document.visibilityState === "visible") void checkVersion(); };
    document.addEventListener("visibilitychange", onVisibility);
    return () => { window.clearInterval(interval); document.removeEventListener("visibilitychange", onVisibility); };
  }, []);

  const refreshNotificationCount = useCallback(async () => {
    const session = commercialService.getSession();
    if (!session) { setNotificationCount(updateAvailable ? 1 : 0); return; }
    try {
      const [notifications, followUps] = await Promise.all([commercialService.getNotifications(session), commercialService.getFollowUps(session)]);
      const pendingReminders = followUps.filter((item) => item.status === "pending").length;
      setNotificationCount(notifications.filter((item) => !item.read).length + pendingReminders + (updateAvailable ? 1 : 0));
    } catch { setNotificationCount(updateAvailable ? 1 : 0); }
  }, [updateAvailable]);

  useEffect(() => {
    void refreshNotificationCount();
    const interval = window.setInterval(refreshNotificationCount, 300000);
    const onSessionChange = () => void refreshNotificationCount();
    window.addEventListener("datapath-session-change", onSessionChange);
    return () => { window.clearInterval(interval); window.removeEventListener("datapath-session-change", onSessionChange); };
  }, [refreshNotificationCount]);

  useEffect(() => {
    const syncFromUrl = () => setActiveTabState(window.location.hash.slice(1) || "home");
    window.addEventListener("hashchange", syncFromUrl);
    return () => window.removeEventListener("hashchange", syncFromUrl);
  }, []);

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    window.history.replaceState(null, "", `#${tab}`);
  };

  const handleSelectProfile = (profileId: string) => {
    setActiveTab(profileId);
  };

  const handleViewProgram = (programId: string) => {
    setHighlightedProgramId(programId);
    setActiveTab("programs");
  };

  const handleClearHighlight = () => {
    setHighlightedProgramId(undefined);
  };

  // Determine what content to display in the main workspace
  const renderWorkspaceContent = () => {
    if (activeTab === "home") {
      return (
        <>
          <div className="welcome-hero animate-fade-in" style={{ padding: "40px 30px", borderRadius: "12px", background: "linear-gradient(135deg, rgba(255,107,0,0.05) 0%, rgba(255,107,0,0.01) 100%)", border: "1px solid rgba(255,107,0,0.15)", marginBottom: "32px" }}>
            <h1 className="welcome-title" style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
              Datapath Sales Playbook
            </h1>
            <p className="welcome-subtitle" style={{ fontSize: "1.05rem", color: "var(--text-secondary)", marginTop: "8px", maxWidth: "700px" }}>
              Guía interactiva para acompañar conversaciones comerciales en WhatsApp y canales digitales mediante un modelo de venta consultiva.
            </p>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "12px" }}>
              Identificación del Perfil
            </h3>
            <div className="profile-grid">
              {Object.values(profiles).map((profile) => (
                <ProfileCard
                  key={profile.id}
                  id={profile.id}
                  title={profile.title}
                  iconName={profile.icon}
                  description={profile.description}
                  onClick={() => handleSelectProfile(profile.id)}
                />
              ))}
            </div>
          </div>

          <div style={{ marginTop: "40px" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "16px" }}>
              Metodología y Filosofía de Ventas
            </h3>
            <div className="methodology-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <button type="button"
                onClick={() => setActiveTab("manual-filosofia-comercial")}
                style={{ 
                  padding: "20px", 
                  background: "var(--bg-card)", 
                  border: "1px solid var(--border-color)", 
                  borderRadius: "8px", 
                  cursor: "pointer", 
                  transition: "all 0.2s", textAlign: "left"
                }}
                className="hover-card-effects"
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--primary-color)", fontWeight: 600, marginBottom: "8px" }}>
                  <ShieldCheck size={18} />
                  <span>Filosofía Comercial</span>
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
                  Conoce nuestra misión, principios comerciales y los estándares esperados que debe experimentar cada prospecto en contacto con una asesora.
                </p>
              </button>

              <button type="button"
                onClick={() => setActiveTab("manual-reglas-de-oro")}
                style={{ 
                  padding: "20px", 
                  background: "var(--bg-card)", 
                  border: "1px solid var(--border-color)", 
                  borderRadius: "8px", 
                  cursor: "pointer", 
                  transition: "all 0.2s", textAlign: "left"
                }}
                className="hover-card-effects"
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--primary-color)", fontWeight: 600, marginBottom: "8px" }}>
                  <Sparkles size={18} />
                  <span>Reglas de Oro</span>
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
                  El decálogo de estándares de calidad comercial de Datapath. Directrices obligatorias para estructurar el valor y generar confianza.
                </p>
              </button>
            </div>
          </div>
        </>
      );
    }

    if (activeTab === "programs") {
      return (
        <ProgramsView
          highlightedProgramId={highlightedProgramId}
          onClearHighlight={handleClearHighlight}
        />
      );
    }

    if (activeTab === "commercial") {
      return <CommercialHub />;
    }

    if (activeTab === "follow-ups") {
      return <FollowUpsView />;
    }

    if (activeTab === "notifications") {
      return <NotificationsView updateAvailable={updateAvailable} onChanged={() => void refreshNotificationCount()} />;
    }

    if (activeTab === "objections") {
      return <ObjectionsView />;
    }

    if (activeTab.startsWith("manual-")) {
      const section = activeTab.replace("manual-", "");
      return (
        <ManualView
          section={section}
          onSectionChange={(newSection) => setActiveTab(`manual-${newSection}`)}
          onGoBackHome={() => setActiveTab("home")}
        />
      );
    }

    // Carga dinámica de la vista de perfiles (Guía + Simulador)
    const selectedProfile = profiles[activeTab];
    if (selectedProfile) {
      return (
        <ProfileContent
          key={selectedProfile.id}
          profile={selectedProfile}
          onGoBackHome={() => setActiveTab("home")}
          onViewProgram={handleViewProgram}
        />
      );
    }

    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h3>Sección en construcción</h3>
        <p style={{ color: "var(--text-muted)", marginTop: "8px" }}>
          Esta característica estará disponible en próximas versiones.
        </p>
        <button onClick={() => setActiveTab("home")} className="btn-reset" style={{ margin: "20px auto 0" }}>
          Volver al Inicio
        </button>
      </div>
    );
  };

  return (
    <div className="app-container">
      {/* Sidebar navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        notificationCount={notificationCount}
      />

      {/* Main content display panel */}
      <main className="main-panel">
        {/* Mobile Header Bar */}
        <header className="mobile-header">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="menu-button"
            aria-label="Abrir menú"
          >
            <Menu size={20} />
          </button>
          <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Datapath Playbook</div>
          <button className="mobile-notification-button" onClick={() => setActiveTab("notifications")} aria-label={`Notificaciones${notificationCount ? `, ${notificationCount} pendientes` : ""}`}><Bell size={19}/>{notificationCount > 0 && <span>{notificationCount > 99 ? "99+" : notificationCount}</span>}</button>
        </header>

        {/* Content canvas container */}
        <div className="content-workspace">
          {renderWorkspaceContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
