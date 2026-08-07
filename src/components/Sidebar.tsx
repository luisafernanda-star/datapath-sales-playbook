import React from "react";
import {
  Home,
  Code,
  TrendingUp,
  GraduationCap,
  Building,
  BookOpen,
  Brain,
  Settings,
  X,
  FileText
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen
}) => {
  const menuItems = [
    { id: "home", label: "Inicio", icon: Home },
    { type: "separator" },
    { type: "section-title", label: "Perfiles de Venta" },
    { id: "tech-pro", label: "Ya trabajo en tecnología", icon: Code },
    {
      id: "career-switcher",
      label: "Quiero crecer/cambiar perfil",
      icon: TrendingUp
    },
    { id: "student", label: "Soy estudiante", icon: GraduationCap },
    { id: "corporate", label: "Capacitación empresarial", icon: Building },
    { type: "separator" },
    { type: "section-title", label: "Metodología de Ventas" },
    { id: "manual-filosofia-comercial", label: "Filosofía Comercial", icon: FileText },
    { id: "manual-mentalidad-comercial", label: "Mentalidad Comercial", icon: FileText },
    { id: "manual-flujo-comercial", label: "Flujo Comercial", icon: FileText },
    { id: "manual-diagnostico-comercial", label: "Diagnóstico Comercial", icon: FileText },
    { id: "manual-reglas-de-oro", label: "Reglas de Oro", icon: FileText },
    { type: "separator" },
    { type: "section-title", label: "Recursos de Venta" },
    { id: "programs", label: "Catálogo de Programas", icon: BookOpen },
    { id: "objections", label: "Objeciones frecuentes", icon: Brain },
    { id: "settings", label: "Configuración", icon: Settings, disabled: true }
  ];

  const handleSelect = (id: string, disabled?: boolean) => {
    if (disabled) return;
    setActiveTab(id);
    setIsOpen(false); // Close on mobile navigation
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <div className="logo-dot" />
        <span className="logo-text">Datapath Playbook</span>
        <span className="logo-tag">Sales</span>
        {isOpen && (
          <button
            onClick={() => setIsOpen(false)}
            className="menu-button"
            style={{ marginLeft: "auto", display: "none" }}
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item, index) => {
          if (item.type === "separator") {
            return <div key={`sep-${index}`} className="nav-separator" />;
          }

          if (item.type === "section-title") {
            return (
              <div key={`title-${index}`} className="nav-section-title">
                {item.label}
              </div>
            );
          }

          const IconComponent = item.icon || Home;
          const isActive = activeTab === item.id;
          const isDisabled = item.disabled;

          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id!, isDisabled)}
              className={`nav-item ${isActive ? "active" : ""}`}
              style={{
                background: "none",
                width: "100%",
                textAlign: "left",
                opacity: isDisabled ? 0.5 : 1,
                cursor: isDisabled ? "not-allowed" : "pointer"
              }}
              disabled={isDisabled}
            >
              <IconComponent size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">DP</div>
          <div>
            <div style={{ fontWeight: 600 }}>Asesora Comercial</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Datapath Interno
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
