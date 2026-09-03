import { useCallback, useEffect, useState } from "react";
import { Camera, Check, Pencil, UserRound } from "lucide-react";
import type { CommercialSession, UserProfile } from "../data/commercialTypes";
import { getAccountRole } from "../config/access";
import { commercialService } from "../services/commercialService";

interface UserProfileMenuProps { onNavigate: (tab: string) => void; }

export function UserProfileMenu({ onNavigate }: UserProfileMenuProps) {
  const [session, setSession] = useState<CommercialSession | null>(() => commercialService.getSession());
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);

  const load = useCallback(async (activeSession = commercialService.getSession()) => {
    setSession(activeSession);
    if (!activeSession) { setProfile(null); return; }
    try { setProfile(await commercialService.getUserProfile(activeSession)); }
    catch { setProfile(null); }
  }, []);

  useEffect(() => {
    void load();
    const onSessionChange = () => void load();
    window.addEventListener("datapath-session-change", onSessionChange);
    return () => window.removeEventListener("datapath-session-change", onSessionChange);
  }, [load]);

  if (!session) return <button className="user-profile user-profile-button" onClick={() => onNavigate("follow-ups")}><span className="avatar"><UserRound size={15}/></span><span><strong>Inicia sesión</strong><small>Para personalizar tu perfil</small></span></button>;

  const name = profile?.displayName || session.email.split("@")[0];
  return <>
    <button className="user-profile user-profile-button" onClick={() => setEditing(true)} aria-label="Editar mi perfil"><ProfileAvatar profile={profile} name={name}/><span className="user-profile-copy"><strong>{profile?.displayName || "Completa tu perfil"}</strong><small>{getAccountRole(session.email, profile?.roleLabel)}</small>{!profile?.displayName && <em>Agrega tu nombre y foto</em>}</span><Pencil className="profile-edit-icon" size={14}/></button>
    {editing && <ProfileEditor session={session} profile={profile} onCancel={() => setEditing(false)} onSaved={(saved) => { setProfile(saved); setEditing(false); }}/>} 
  </>;
}

function ProfileAvatar({ profile, name, preview }: { profile: UserProfile | null; name: string; preview?: string }) {
  const source = preview || profile?.avatarUrl;
  return source ? <img className="profile-avatar-image" src={source} alt="Foto de perfil"/> : <span className="avatar profile-avatar-fallback">{initials(name)}</span>;
}

function ProfileEditor({ session, profile, onCancel, onSaved }: { session: CommercialSession; profile: UserProfile | null; onCancel: () => void; onSaved: (profile: UserProfile) => void }) {
  const [displayName, setDisplayName] = useState(profile?.displayName || "");
  const [file, setFile] = useState<File>();
  const [preview, setPreview] = useState<string>();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  const choosePhoto = (selected?: File) => {
    if (!selected) return;
    if (preview) URL.revokeObjectURL(preview);
    setFile(selected); setPreview(URL.createObjectURL(selected)); setMessage("");
  };

  return <div className="modal-backdrop"><form className="editor-modal profile-editor-modal" onSubmit={async (event) => { event.preventDefault(); setSaving(true); setMessage(""); try { const avatarPath = file ? await commercialService.uploadProfileAvatar(session, file) : profile?.avatarPath; const saved = await commercialService.saveUserProfile(session, { userId: session.userId || "", displayName, avatarPath }); window.dispatchEvent(new Event("datapath-profile-change")); onSaved(saved); } catch (error) { setMessage(error instanceof Error ? error.message : "No fue posible guardar tu perfil."); } finally { setSaving(false); } }}>
    <div className="editor-heading"><div><p className="eyebrow">MI CUENTA</p><h2>Personaliza tu perfil</h2></div><button type="button" className="icon-button" aria-label="Cerrar" onClick={onCancel}>×</button></div>
    <div className="profile-photo-editor"><ProfileAvatar profile={profile} name={displayName || session.email} preview={preview}/><label className="outline-button"><Camera size={16}/> Cambiar foto<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => choosePhoto(event.target.files?.[0])}/></label></div>
    <label>Nombre que verá el equipo<input value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Ej. María Fernanda" required maxLength={80}/></label>
    <div className="profile-role-preview"><Check size={16}/><span>Tu cargo aparece como <strong>{getAccountRole(session.email, profile?.roleLabel)}</strong> y solo la administradora puede modificarlo.</span></div>
    {message && <p className="form-message" role="alert">{message}</p>}
    <div className="editor-actions"><span/><button type="button" className="outline-button" onClick={onCancel}>Cancelar</button><button className="primary-button" disabled={saving}>{saving ? "Guardando…" : "Guardar perfil"}</button></div>
  </form></div>;
}

const initials = (value: string) => value.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "DP";
