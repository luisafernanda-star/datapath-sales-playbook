import { useEffect, useMemo, useState } from "react";
import { Check, Copy, ExternalLink, KeyRound, LogOut, Pencil, Plus, Save, Trash2 } from "lucide-react";
import type { CommercialProgram, Coupon, PaymentLink } from "../data/commercialTypes";
import { commercialService } from "../services/commercialService";
import "./CommercialHub.css";

const emptyProgram = (): CommercialProgram => ({
  id: "", name: "", shortName: "", type: "En vivo", status: "active", description: "", paymentLinks: [], coupons: []
});
const makeId = () => crypto.randomUUID();

export function CommercialHub() {
  const [session, setSession] = useState(commercialService.getSession());
  const [programs, setPrograms] = useState<CommercialProgram[]>([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<CommercialProgram | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessMode, setAccessMode] = useState<"sales" | "admin">("sales");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState("");
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL?.toLowerCase();
  const salesEmail = import.meta.env.VITE_SALES_EMAIL;
  const isAdmin = Boolean(session && adminEmail && session.email.toLowerCase() === adminEmail);

  const loadPrograms = async () => {
    if (!session) return;
    setLoading(true);
    try { setPrograms(await commercialService.getPrograms(session)); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Ocurrió un error al cargar los programas."); }
    finally { setLoading(false); }
  };

  useEffect(() => { void loadPrograms(); }, [session]);

  const filteredPrograms = useMemo(() => programs.filter((program) =>
    program.status === "active" && [program.name, program.shortName, program.description, program.type]
      .some((value) => value.toLowerCase().includes(search.toLowerCase()))
  ), [programs, search]);

  const copy = async (value: string, id: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(id);
    window.setTimeout(() => setCopied(""), 1500);
  };

  const signIn = async (event: React.FormEvent) => {
    event.preventDefault(); setMessage(""); setLoading(true);
    const loginEmail = accessMode === "sales" ? salesEmail : email;
    try {
      if (!loginEmail) throw new Error("El acceso del equipo aún no está configurado.");
      setSession(await commercialService.signIn(loginEmail, password)); setPassword("");
    }
    catch (error) { setMessage(error instanceof Error ? error.message : "No fue posible iniciar sesión."); }
    finally { setLoading(false); }
  };

  if (!commercialService.configured) return (
    <section className="commercial-page">
      <div className="commercial-hero"><p className="eyebrow">RECURSOS COMERCIALES</p><h1>Cursos, links y cupones</h1><p>Esta sección está lista; solo falta conectarla con tu espacio privado de Supabase.</p></div>
      <div className="setup-card"><KeyRound size={22} /><div><h2>Configuración pendiente</h2><p>Sigue los pasos que te compartiré para crear tu cuenta y pegar tres datos en el archivo de configuración. Después podrás administrar todo desde aquí.</p></div></div>
    </section>
  );

  if (!session) return (
    <section className="commercial-page narrow">
      <div className="commercial-hero"><p className="eyebrow">DATAPATH COMMERCIAL HUB</p><h1>Links de pago y cupones, en un solo lugar.</h1><p>Inicia sesión con tu cuenta del equipo para consultar la información vigente.</p></div>
      <form className="login-card" onSubmit={signIn}>
        <h2>{accessMode === "sales" ? "Acceso para vendedoras" : "Acceso de administración"}</h2>
        {accessMode === "sales" ? <p className="login-help">Ingresa la clave compartida del equipo comercial.</p> : <label>Correo<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>}
        <label>Contraseña<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
        {message && <p className="form-message">{message}</p>}<button className="primary-button" disabled={loading}>{loading ? "Ingresando…" : "Ingresar al hub"}</button>
        <button type="button" className="access-switch" onClick={() => { setAccessMode((mode) => mode === "sales" ? "admin" : "sales"); setMessage(""); setPassword(""); }}>
          {accessMode === "sales" ? "¿Eres administradora? Ingresa con tu correo" : "Volver al acceso de vendedoras"}
        </button>
      </form>
    </section>
  );

  return <section className="commercial-page">
    <div className="commercial-topbar"><div><p className="eyebrow">DATAPATH COMMERCIAL HUB</p><h1>Cursos, links y cupones</h1><p>Información comercial actualizada para el equipo.</p></div><div className="account-actions"><span>{session.email}</span>{isAdmin && <button className="outline-button" onClick={() => setEditing(emptyProgram())}><Plus size={16} /> Agregar programa</button>}<button className="icon-button" title="Cerrar sesión" onClick={() => { commercialService.signOut(); setSession(null); }}><LogOut size={17} /></button></div></div>
    <div className="commercial-toolbar"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar programa…" /><span>{programs.filter((program) => program.status === "active").length} activos</span></div>
    {message && <p className="form-message">{message}</p>}
    {loading ? <p className="loading-copy">Cargando información…</p> : filteredPrograms.length === 0 ? <div className="empty-state"><h2>No hay programas publicados todavía</h2><p>{isAdmin ? "Agrega el primer programa para que el equipo pueda consultarlo aquí." : "Consulta con la persona administradora del playbook."}</p></div> : <div className="commercial-grid">{filteredPrograms.map((program) => <ProgramCard key={program.id} program={program} copied={copied} onCopy={copy} canEdit={isAdmin} onEdit={() => setEditing(program)} />)}</div>}
    {editing && <ProgramEditor program={editing} onCancel={() => setEditing(null)} onSave={async (program) => { if (!session) return; setLoading(true); setMessage(""); try { const saved = await commercialService.saveProgram(session, program); setPrograms((current) => program.id ? current.map((item) => item.id === saved.id ? saved : item) : [...current, saved]); setEditing(null); } catch (error) { setMessage(error instanceof Error ? error.message : "No fue posible guardar."); } finally { setLoading(false); } }} onDelete={async () => { if (!session || !editing.id || !window.confirm("¿Eliminar este programa?")) return; try { await commercialService.deleteProgram(session, editing.id); setPrograms((items) => items.filter((item) => item.id !== editing.id)); setEditing(null); } catch (error) { setMessage(error instanceof Error ? error.message : "No fue posible eliminar."); } }} />}
  </section>;
}

function ProgramCard({ program, copied, onCopy, canEdit, onEdit }: { program: CommercialProgram; copied: string; onCopy: (value: string, id: string) => void; canEdit: boolean; onEdit: () => void }) {
  const regular = program.coupons.filter((coupon) => coupon.category === "regular"); const special = program.coupons.filter((coupon) => coupon.category === "special");
  return <article className="commercial-card"><div className="card-heading"><div><span className="program-code">{program.shortName}</span><h2>{program.name}</h2><p>{program.description}</p></div>{canEdit && <button className="icon-button" title="Editar" onClick={onEdit}><Pencil size={16} /></button>}</div><span className="type-badge">{program.type}</span>
    <CardSection title="Links de pago">{program.paymentLinks.length ? program.paymentLinks.map((link) => <div className="resource-row" key={link.id}><div><strong>{link.label}</strong>{link.price && <small>{link.price}</small>}</div><div><button className="copy-button" onClick={() => onCopy(link.url, `link-${link.id}`)}>{copied === `link-${link.id}` ? <Check size={15} /> : <Copy size={15} />}{copied === `link-${link.id}` ? "Copiado" : "Copiar"}</button><a className="open-button" href={link.url} target="_blank" rel="noreferrer"><ExternalLink size={15} /> Abrir</a></div></div>) : <p className="muted">Aún no hay links configurados.</p>}</CardSection>
    <CardSection title="Cupones">{regular.length ? <div className="coupon-list">{regular.map((coupon) => <CouponItem coupon={coupon} copied={copied} onCopy={onCopy} />)}</div> : <p className="muted">Aún no hay cupones configurados.</p>}</CardSection>
    {special.length > 0 && <CardSection title="Cupones especiales"><div className="coupon-list">{special.map((coupon) => <CouponItem coupon={coupon} copied={copied} onCopy={onCopy} />)}</div></CardSection>}
  </article>;
}
function CardSection({ title, children }: { title: string; children: React.ReactNode }) { return <section className="card-section"><h3>{title}</h3>{children}</section>; }
function CouponItem({ coupon, copied, onCopy }: { coupon: Coupon; copied: string; onCopy: (value: string, id: string) => void }) { const id = `coupon-${coupon.id}`; return <div className="coupon"><div><strong>{coupon.label}</strong>{coupon.discount && <small>{coupon.discount}</small>}<code>{coupon.code}</code></div><button className="copy-button" onClick={() => onCopy(coupon.code, id)}>{copied === id ? <Check size={15} /> : <Copy size={15} />}{copied === id ? "Copiado" : "Copiar"}</button></div>; }

function ProgramEditor({ program, onCancel, onSave, onDelete }: { program: CommercialProgram; onCancel: () => void; onSave: (program: CommercialProgram) => void; onDelete: () => void }) {
  const [draft, setDraft] = useState(program); const set = <K extends keyof CommercialProgram>(key: K, value: CommercialProgram[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const addLink = () => set("paymentLinks", [...draft.paymentLinks, { id: makeId(), label: "", url: "", price: "" }]);
  const addCoupon = (category: Coupon["category"]) => set("coupons", [...draft.coupons, { id: makeId(), label: "", code: "", discount: "", category }]);
  const updateLink = (id: string, key: keyof PaymentLink, value: string) => set("paymentLinks", draft.paymentLinks.map((item) => item.id === id ? { ...item, [key]: value } : item));
  const updateCoupon = (id: string, key: keyof Coupon, value: string) => set("coupons", draft.coupons.map((item) => item.id === id ? { ...item, [key]: value } : item));
  return <div className="modal-backdrop"><form className="editor-modal" onSubmit={(event) => { event.preventDefault(); onSave(draft); }}><div className="editor-heading"><div><p className="eyebrow">ADMINISTRACIÓN</p><h2>{program.id ? "Editar programa" : "Nuevo programa"}</h2></div><button type="button" className="icon-button" onClick={onCancel}>×</button></div>
    <div className="form-grid"><label>Nombre<input value={draft.name} onChange={(e) => set("name", e.target.value)} required /></label><label>Abreviatura<input value={draft.shortName} onChange={(e) => set("shortName", e.target.value)} required /></label><label>Tipo<select value={draft.type} onChange={(e) => set("type", e.target.value as CommercialProgram["type"])}><option>En vivo</option><option>Asincrónico</option><option>Híbrido</option></select></label><label>Estado<select value={draft.status} onChange={(e) => set("status", e.target.value as CommercialProgram["status"])}><option value="active">Activo</option><option value="inactive">Inactivo</option></select></label></div><label>Descripción<textarea value={draft.description} onChange={(e) => set("description", e.target.value)} /></label>
    <EditorList title="Links de pago" addLabel="Agregar link" onAdd={addLink}>{draft.paymentLinks.map((link) => <div className="editor-row" key={link.id}><input placeholder="Plan / nombre" value={link.label} onChange={(e) => updateLink(link.id, "label", e.target.value)} required /><input placeholder="https://…" type="url" value={link.url} onChange={(e) => updateLink(link.id, "url", e.target.value)} required /><input placeholder="Precio (opcional)" value={link.price ?? ""} onChange={(e) => updateLink(link.id, "price", e.target.value)} /><button type="button" className="remove-button" onClick={() => set("paymentLinks", draft.paymentLinks.filter((item) => item.id !== link.id))}><Trash2 size={15} /></button></div>)}</EditorList>
    <EditorList title="Cupones regulares" addLabel="Agregar cupón" onAdd={() => addCoupon("regular")}>{draft.coupons.filter((item) => item.category === "regular").map((coupon) => <CouponEditor coupon={coupon} update={updateCoupon} remove={() => set("coupons", draft.coupons.filter((item) => item.id !== coupon.id))} />)}</EditorList>
    <EditorList title="Cupones especiales" addLabel="Agregar cupón especial" onAdd={() => addCoupon("special")}>{draft.coupons.filter((item) => item.category === "special").map((coupon) => <CouponEditor coupon={coupon} update={updateCoupon} remove={() => set("coupons", draft.coupons.filter((item) => item.id !== coupon.id))} />)}</EditorList>
    <div className="editor-actions">{program.id && <button type="button" className="danger-button" onClick={onDelete}><Trash2 size={16} /> Eliminar</button>}<span /><button type="button" className="outline-button" onClick={onCancel}>Cancelar</button><button className="primary-button"><Save size={16} /> Guardar cambios</button></div>
  </form></div>;
}
function EditorList({ title, addLabel, onAdd, children }: { title: string; addLabel: string; onAdd: () => void; children: React.ReactNode }) { return <section className="editor-list"><div><h3>{title}</h3><button type="button" className="text-button" onClick={onAdd}><Plus size={15} /> {addLabel}</button></div>{children}</section>; }
function CouponEditor({ coupon, update, remove }: { coupon: Coupon; update: (id: string, key: keyof Coupon, value: string) => void; remove: () => void }) { return <div className="editor-row" key={coupon.id}><input placeholder="Nombre" value={coupon.label} onChange={(e) => update(coupon.id, "label", e.target.value)} required /><input placeholder="Código" value={coupon.code} onChange={(e) => update(coupon.id, "code", e.target.value)} required /><input placeholder="Descuento (opcional)" value={coupon.discount ?? ""} onChange={(e) => update(coupon.id, "discount", e.target.value)} /><button type="button" className="remove-button" onClick={remove}><Trash2 size={15} /></button></div>; }
