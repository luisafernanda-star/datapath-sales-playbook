import { useCallback, useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { ProfileContent } from "./components/ProfileContent";
import { ProgramsView } from "./components/ProgramsView";
import { ObjectionsView } from "./components/ObjectionsView";
import { ManualView } from "./components/ManualView";
import { CommercialHub } from "./components/CommercialHub";
import { FollowUpsView } from "./components/FollowUpsView";
import { NotificationsView } from "./components/NotificationsView";
import { HomeDashboard } from "./components/HomeDashboard";
import { commercialService } from "./services/commercialService";
import { contentService } from "./services/contentService";
import type { Profile } from "./data/playbookData";
import { Bell, Menu } from "lucide-react";

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
      const [notificationsResult, followUpsResult] = await Promise.allSettled([commercialService.getNotifications(session), commercialService.getFollowUps(session)]);
      const unread = notificationsResult.status === "fulfilled" ? notificationsResult.value.filter((item) => !item.read).length : 0;
      const pendingReminders = followUpsResult.status === "fulfilled" ? followUpsResult.value.filter((item) => item.status === "pending").length : 0;
      setNotificationCount(unread + pendingReminders + (updateAvailable ? 1 : 0));
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
      return <HomeDashboard profiles={profiles} notificationCount={notificationCount} updateAvailable={updateAvailable} onNavigate={setActiveTab} onSelectProfile={handleSelectProfile} />;
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
        updateAvailable={updateAvailable}
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
