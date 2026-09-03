import { useCallback, useEffect, useMemo, useState } from "react";
import { Mail, Pencil, Search, UserRound, UsersRound } from "lucide-react";
import type { CommercialSession, TeamMember } from "../data/commercialTypes";
import { ADMIN_EMAIL, getAccountRole } from "../config/access";
import { commercialService } from "../services/commercialService";
import "./TeamNetworkView.css";

export function TeamNetworkView() {
  const [session, setSession] = useState<CommercialSession | null>(() => commercialService.getSession());
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const isAdmin = session?.email.toLowerCase() === ADMIN_EMAIL;

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

  const filtered = useMemo(() => members.filter((member) => [member.displayName, member.email, getAccountRole(member.email, member.roleLabel)].some((value) => value.toLowerCase().includes(search.toLowerCase()))), [members, search]);

  if (!session) return <section className="team-network-page"><div><p className="eyebrow">EQUIPO DATAPATH</p><h1>Mi red</h1><p className="team-network-lead">Conoce las personas que forman parte del Playbook.</p></div><div className="team-network-empty"><UsersRound size={30}/><h2>Inicia sesión para ver tu red</h2><p>El directorio solo está disponible para integrantes autenticados.</p></div></section>;

  return <section className="team-network-page">
    <div className="team-network-heading"><div><p className="eyebrow">EQUIPO DATAPATH</p><h1>Mi red</h1><p className="team-network-lead">Todos los perfiles registrados dentro del Sales Playbook.</p></div><div className="network-count"><UsersRound size={19}/><strong>{members.length}</strong><span>{members.length === 1 ? "integrante" : "integrantes"}</span></div></div>
    <div className="network-search"><Search size={18}/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre, correo o cargo…" aria-label="Buscar integrante"/><span>{filtered.length} resultados</span></div>
    {message && <p className="form-message" role="alert">{message}</p>}
    {loading ? <p className="network-loading">Cargando perfiles…</p> : filtered.length === 0 ? <div className="team-network-empty"><UsersRound size={30}/><h2>No encontramos perfiles</h2><p>Prueba con otro nombre o correo.</p></div> : <div className="team-members-grid">{filtered.map((member) => <article className="team-member-card" key={member.userId}><MemberAvatar member={member}/><div className="member-copy"><div className="member-name-row"><h2>{member.displayName || "Perfil por completar"}</h2>{member.userId === session.userId && <span>Tú</span>}</div><strong className="member-role">{getAccountRole(member.email, member.roleLabel)}</strong><a href={`mailto:${member.email}`}><Mail size={14}/>{member.email}</a>{!member.displayName && <small>Esta persona todavía no ha agregado su nombre o fotografía.</small>}</div>{isAdmin && <button className="member-edit-button" onClick={() => setEditing(member)}><Pencil size={14}/> Editar perfil y cargo</button>}</article>)}</div>}
    {editing && <TeamMemberEditor
      member={editing}
      loading={loading}
      onCancel={() => setEditing(null)}
      onSave={async (draft) => {
        setLoading(true); setMessage("");
        try {
          await commercialService.updateTeamMember(session, draft);
          setEditing(null); await load(session);
          window.dispatchEvent(new Event("datapath-profile-change"));
        } catch (error) {
          setMessage(error instanceof Error ? error.message : "No fue posible actualizar el perfil.");
          setLoading(false);
        }
      }}
    />}
  </section>;
}

function TeamMemberEditor({ member, loading, onCancel, onSave }: { member: TeamMember; loading: boolean; onCancel: () => void; onSave: (draft: { userId: string; displayName: string; roleLabel: string }) => void }) {
  const [displayName, setDisplayName] = useState(member.displayName);
  const [roleLabel, setRoleLabel] = useState(member.roleLabel || getAccountRole(member.email));
  return <div className="modal-backdrop"><form className="editor-modal member-role-editor" onSubmit={(event) => { event.preventDefault(); onSave({ userId: member.userId, displayName, roleLabel }); }}><div className="editor-heading"><div><p className="eyebrow">ADMINISTRACIÓN</p><h2>Editar integrante</h2></div><button type="button" className="icon-button" aria-label="Cerrar" onClick={onCancel}>×</button></div><p>{member.email}</p><label>Nombre que verá el equipo<input value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Nombre de la persona" required maxLength={80}/></label><label>Cargo dentro del equipo<input value={roleLabel} onChange={(event) => setRoleLabel(event.target.value)} placeholder="Ej. Líder comercial" required maxLength={80}/></label><small>Puedes escribir el nombre del cargo libremente. Esto no entrega permisos administrativos.</small><div className="editor-actions"><span/><button type="button" className="outline-button" onClick={onCancel}>Cancelar</button><button className="primary-button" disabled={loading}>{loading ? "Guardando…" : "Guardar cambios"}</button></div></form></div>;
}

function MemberAvatar({ member }: { member: TeamMember }) {
  if (member.avatarUrl) return <img className="team-member-avatar" src={member.avatarUrl} alt={`Foto de ${member.displayName || member.email}`}/>;
  const label = member.displayName || member.email;
  const initials = label.split(/[\s@._-]+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
  return <div className="team-member-avatar avatar-placeholder">{initials || <UserRound size={24}/>}</div>;
}
