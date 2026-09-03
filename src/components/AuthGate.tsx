import { useState } from "react";
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import type { CommercialSession } from "../data/commercialTypes";
import { commercialService } from "../services/commercialService";
import "./AuthGate.css";

export function AuthGate({ onSignedIn }: { onSignedIn: (session: CommercialSession) => void }) {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const signIn = async (event: React.FormEvent) => {
    event.preventDefault(); setLoading(true); setMessage("");
    try { onSignedIn(await commercialService.signIn(email, password)); }
    catch (error) { setMessage(error instanceof Error ? error.message : "No fue posible iniciar sesión."); }
    finally { setLoading(false); }
  };

  return <main className="public-gate">
    <header className="public-header"><div className="public-brand"><span/><strong>Datapath</strong><small>Sales Playbook</small></div><button className="outline-button" onClick={() => setShowLogin(true)}><LockKeyhole size={16}/> Iniciar sesión</button></header>
    <section className="public-hero">
      <div className="public-copy"><span className="public-eyebrow"><ShieldCheck size={15}/> PLATAFORMA INTERNA</span><h1>Herramientas comerciales para acompañar mejores conversaciones.</h1><p>Un espacio privado para el equipo comercial de Datapath. Inicia sesión con tu cuenta autorizada para acceder al contenido.</p><button className="primary-button public-login-button" onClick={() => setShowLogin(true)}>Ingresar al Playbook <ArrowRight size={17}/></button></div>
      <div className="public-panel" aria-hidden="true"><div className="public-panel-bar"><i/><i/><i/></div><div className="public-panel-content"><span/><strong/><span/><span/><div><i/><i/><i/></div></div></div>
    </section>
    <footer className="public-footer">Datapath · Acceso exclusivo para personal autorizado</footer>
    {showLogin && <div className="modal-backdrop"><form className="editor-modal auth-modal" onSubmit={signIn}><div className="editor-heading"><div><p className="eyebrow">ACCESO PRIVADO</p><h2>Iniciar sesión</h2></div><button type="button" className="icon-button" aria-label="Cerrar" onClick={() => { setShowLogin(false); setMessage(""); }}>×</button></div><p>Ingresa con la cuenta que recibiste para acceder al Sales Playbook.</p><label>Correo<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required autoFocus/></label><label>Contraseña<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required/></label>{message && <p className="form-message" role="alert">{message}</p>}<button className="primary-button auth-submit" disabled={loading}>{loading ? "Ingresando…" : "Ingresar"}<ArrowRight size={16}/></button></form></div>}
  </main>;
}
