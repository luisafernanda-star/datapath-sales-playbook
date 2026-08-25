import type { CommercialProgram, CommercialSession } from "../data/commercialTypes";

const url = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "");
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const storageKey = "datapath-commercial-session";

type DatabaseRow = Omit<CommercialProgram, "shortName" | "paymentLinks" | "updatedAt"> & {
  short_name: string;
  payment_links: CommercialProgram["paymentLinks"];
  updated_at?: string;
};

const fromRow = (row: DatabaseRow): CommercialProgram => ({
  id: row.id,
  name: row.name,
  shortName: row.short_name,
  type: row.type,
  status: row.status,
  description: row.description,
  paymentLinks: row.payment_links ?? [],
  coupons: row.coupons ?? [],
  updatedAt: row.updated_at
});

const toRow = (program: Omit<CommercialProgram, "id" | "updatedAt">) => ({
  name: program.name,
  short_name: program.shortName,
  type: program.type,
  status: program.status,
  description: program.description,
  payment_links: program.paymentLinks,
  coupons: program.coupons
});

const headers = (token?: string) => ({
  apikey: anonKey ?? "",
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {})
});

const configured = Boolean(url && anonKey);

export const commercialService = {
  configured,
  getSession(): CommercialSession | null {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    try { return JSON.parse(raw) as CommercialSession; } catch { return null; }
  },
  async signIn(email: string, password: string): Promise<CommercialSession> {
    if (!configured) throw new Error("La conexión con Supabase aún no está configurada.");
    const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
      method: "POST", headers: headers(), body: JSON.stringify({ email, password })
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error_description ?? "No fue posible iniciar sesión.");
    const session = { accessToken: payload.access_token as string, email: payload.user.email as string };
    localStorage.setItem(storageKey, JSON.stringify(session));
    return session;
  },
  signOut() { localStorage.removeItem(storageKey); },
  async getPrograms(session: CommercialSession): Promise<CommercialProgram[]> {
    const response = await fetch(`${url}/rest/v1/commercial_programs?select=*&order=name.asc`, { headers: headers(session.accessToken) });
    if (!response.ok) throw new Error("No fue posible cargar la información comercial.");
    return (await response.json() as DatabaseRow[]).map(fromRow);
  },
  async saveProgram(session: CommercialSession, program: CommercialProgram): Promise<CommercialProgram> {
    const isNew = !program.id;
    const endpoint = isNew ? `${url}/rest/v1/commercial_programs` : `${url}/rest/v1/commercial_programs?id=eq.${program.id}`;
    const response = await fetch(endpoint, {
      method: isNew ? "POST" : "PATCH",
      headers: { ...headers(session.accessToken), Prefer: "return=representation" },
      body: JSON.stringify(toRow(program))
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message ?? "No fue posible guardar el programa.");
    return fromRow(data[0] as DatabaseRow);
  },
  async deleteProgram(session: CommercialSession, id: string) {
    const response = await fetch(`${url}/rest/v1/commercial_programs?id=eq.${id}`, {
      method: "DELETE", headers: headers(session.accessToken)
    });
    if (!response.ok) throw new Error("No fue posible eliminar el programa.");
  }
};
