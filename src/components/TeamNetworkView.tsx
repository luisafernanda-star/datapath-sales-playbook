import { useCallback, useEffect, useMemo, useState } from "react";
import { Mail, Search, UserRound, UsersRound } from "lucide-react";
import type { CommercialSession, TeamMember } from "../data/commercialTypes";
import { getAccountRole } from "../config/access";
import { commercialService } from "../services/commercialService";
import "./TeamNetworkView.css";

export function TeamNetworkView() {
  const [session, setSession] = useState<CommercialSession | null>(() => commercialService.getSession());
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(async (activeSession = commercialService.getSession()) => {
    setSession(activeSession);
    if (!activeSession) return;
    setLoading(true); setMessage("");
    try { setMembers(await commercialService.getTeamMembers(activeSession)); }
    catch (error) { setMessage(error instanceof Error ? error.message : "No fue posible cargar tu red."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    void load();
    const refresh = () => void load();
    window.addEventListener("datapath-session-change", refresh); window.addEventListener("datapath-profile-change", refresh);
    return () => { window.removeEventListener("datapath-session-change", refresh); window.removeEventListener("datapath-profile-change", refresh); };
  }, [load]);

  const filtered = useMemo(() => members.filter((member) => [member.displayName, member.email, getAccountRole(member.email)].some((value) => value.toLowerCase().includes(search.toLowerCase()))), [members, search]);

  if (!session) return <section className="team-network-page"><div><p className="eyebrow">EQUIPO DATAPATH</p><h1>Mi red</h1><p className="team-network-lead">Conoce las personas que forman parte del Playbook.</p></div><div className="team-network-empty"><UsersRound size={30}/><h2>Inicia sesión para ver tu red</h2><p>El directorio solo está disponible para integrantes autenticados.</p></div></section>;

  return <section className="team-network-page">
    <div className="team-network-heading"><div><p className="eyebrow">EQUIPO DATAPATH</p><h1>Mi red</h1><p className="team-network-lead">Todos los perfiles registrados dentro del Sales Playbook.</p></div><div className="network-count"><UsersRound size={19}/><strong>{members.length}</strong><span>{members.length === 1 ? "integrante" : "integrantes"}</span></div></div>
    <div className="network-search"><Search size={18}/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre, correo o cargo…" aria-label="Buscar integrante"/><span>{filtered.length} resultados</span></div>
    {message && <p className="form-message" role="alert">{message}</p>}
    {loading ? <p className="network-loading">Cargando perfiles…</p> : filtered.length === 0 ? <div className="team-network-empty"><UsersRound size={30}/><h2>No encontramos perfiles</h2><p>Prueba con otro nombre o correo.</p></div> : <div className="team-members-grid">{filtered.map((member) => <article className="team-member-card" key={member.userId}><MemberAvatar member={member}/><div className="member-copy"><div className="member-name-row"><h2>{member.displayName || "Perfil por completar"}</h2>{member.userId === session.userId && <span>Tú</span>}</div><strong className="member-role">{getAccountRole(member.email)}</strong><a href={`mailto:${member.email}`}><Mail size={14}/>{member.email}</a>{!member.displayName && <small>Esta persona todavía no ha agregado su nombre o fotografía.</small>}</div></article>)}</div>}
  </section>;
}

function MemberAvatar({ member }: { member: TeamMember }) {
  if (member.avatarUrl) return <img className="team-member-avatar" src={member.avatarUrl} alt={`Foto de ${member.displayName || member.email}`}/>;
  const label = member.displayName || member.email;
  const initials = label.split(/[\s@._-]+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
  return <div className="team-member-avatar avatar-placeholder">{initials || <UserRound size={24}/>}</div>;
}
