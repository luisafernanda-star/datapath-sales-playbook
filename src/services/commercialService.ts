import type { AppNotification, CommercialProgram, CommercialSession, FollowUp, UserProfile } from "../data/commercialTypes";

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
    const session = { accessToken: payload.access_token as string, email: payload.user.email as string, userId: payload.user.id as string };
    localStorage.setItem(storageKey, JSON.stringify(session));
    window.dispatchEvent(new Event("datapath-session-change"));
    return session;
  },
  signOut() { localStorage.removeItem(storageKey); window.dispatchEvent(new Event("datapath-session-change")); },
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
  },
  async getFollowUps(session: CommercialSession): Promise<FollowUp[]> {
    const response = await fetch(`${url}/rest/v1/follow_ups?select=*&order=due_at.asc`, { headers: headers(session.accessToken) });
    if (!response.ok) throw new Error("No fue posible cargar tus seguimientos.");
    return (await response.json()).map((row: any) => ({ id: row.id, userId: row.user_id, clientName: row.client_name, phone: row.phone ?? "", program: row.program ?? "", dueAt: row.due_at, notes: row.notes ?? "", status: row.status, attachmentUrl: row.attachment_url }));
  },
  async saveFollowUp(session: CommercialSession, followUp: FollowUp): Promise<FollowUp> {
    const endpoint = followUp.id ? `${url}/rest/v1/follow_ups?id=eq.${followUp.id}` : `${url}/rest/v1/follow_ups`;
    const body = { user_id: session.userId, client_name: followUp.clientName, phone: followUp.phone, program: followUp.program, due_at: followUp.dueAt, notes: followUp.notes, status: followUp.status, attachment_url: followUp.attachmentUrl || null };
    const response = await fetch(endpoint, { method: followUp.id ? "PATCH" : "POST", headers: { ...headers(session.accessToken), Prefer: "return=representation" }, body: JSON.stringify(body) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message ?? "No fue posible guardar el seguimiento.");
    const row = data[0];
    return { id: row.id, userId: row.user_id, clientName: row.client_name, phone: row.phone ?? "", program: row.program ?? "", dueAt: row.due_at, notes: row.notes ?? "", status: row.status, attachmentUrl: row.attachment_url };
  },
  async deleteFollowUp(session: CommercialSession, id: string) {
    const response = await fetch(`${url}/rest/v1/follow_ups?id=eq.${id}`, { method: "DELETE", headers: headers(session.accessToken) });
    if (!response.ok) throw new Error("No fue posible eliminar el seguimiento.");
  },
  async uploadFollowUpAttachment(session: CommercialSession, file: File): Promise<string> {
    if (!session.userId) throw new Error("Vuelve a iniciar sesión antes de adjuntar archivos.");
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `${session.userId}/${crypto.randomUUID()}-${safeName}`;
    const response = await fetch(`${url}/storage/v1/object/followup-attachments/${path}`, { method: "POST", headers: { apikey: anonKey ?? "", Authorization: `Bearer ${session.accessToken}`, "Content-Type": file.type }, body: file });
    if (!response.ok) throw new Error("No fue posible subir la captura.");
    return commercialService.getFollowUpAttachmentUrl(session, path);
  },
  async getFollowUpAttachmentUrl(session: CommercialSession, path: string): Promise<string> {
    const response = await fetch(`${url}/storage/v1/object/sign/followup-attachments/${path}`, { method: "POST", headers: headers(session.accessToken), body: JSON.stringify({ expiresIn: 31536000 }) });
    const data = await response.json();
    if (!response.ok) throw new Error("No fue posible abrir el archivo.");
    return `${url}/storage/v1${data.signedURL}`;
  },
  async getNotifications(session: CommercialSession): Promise<AppNotification[]> {
    const now = new Date().toISOString();
    const [notificationsResponse, readsResponse] = await Promise.all([
      fetch(`${url}/rest/v1/notifications?select=*&or=(expires_at.is.null,expires_at.gte.${encodeURIComponent(now)})&order=created_at.desc`, { headers: headers(session.accessToken) }),
      fetch(`${url}/rest/v1/notification_reads?select=notification_id`, { headers: headers(session.accessToken) })
    ]);
    const [notificationRows, readRows] = await Promise.all([notificationsResponse.json(), readsResponse.json()]);
    if (!notificationsResponse.ok || !readsResponse.ok) {
      const errorCode = notificationRows?.code || readRows?.code;
      if (errorCode === "PGRST205" || errorCode === "42P01") throw new Error("Falta activar las tablas de notificaciones en Supabase. Ejecuta nuevamente el archivo schema.sql actualizado.");
      throw new Error("No fue posible cargar las notificaciones. Intenta nuevamente en un momento.");
    }
    const readIds = new Set((readRows as Array<{ notification_id: string }>).map((row) => row.notification_id));
    return (notificationRows as Array<{ id: string; title: string; message: string; created_at: string; expires_at?: string }>).map((row) => ({
      id: row.id, title: row.title, message: row.message, createdAt: row.created_at, expiresAt: row.expires_at, read: readIds.has(row.id)
    }));
  },
  async createNotification(session: CommercialSession, notification: { title: string; message: string; expiresAt?: string }): Promise<AppNotification> {
    const response = await fetch(`${url}/rest/v1/notifications`, {
      method: "POST", headers: { ...headers(session.accessToken), Prefer: "return=representation" },
      body: JSON.stringify({ title: notification.title, message: notification.message, expires_at: notification.expiresAt || null })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message ?? "No fue posible publicar la notificación.");
    const row = data[0];
    await commercialService.markNotificationRead(session, row.id);
    return { id: row.id, title: row.title, message: row.message, createdAt: row.created_at, expiresAt: row.expires_at, read: true };
  },
  async markNotificationRead(session: CommercialSession, notificationId: string) {
    const response = await fetch(`${url}/rest/v1/notification_reads?on_conflict=notification_id,user_id`, {
      method: "POST", headers: { ...headers(session.accessToken), Prefer: "resolution=merge-duplicates" },
      body: JSON.stringify({ notification_id: notificationId, user_id: session.userId })
    });
    if (!response.ok) throw new Error("No fue posible marcar la notificación como leída.");
  },
  async deleteNotification(session: CommercialSession, notificationId: string) {
    const response = await fetch(`${url}/rest/v1/notifications?id=eq.${notificationId}`, { method: "DELETE", headers: headers(session.accessToken) });
    if (!response.ok) throw new Error("No fue posible eliminar la notificación.");
  },
  async getUserProfile(session: CommercialSession): Promise<UserProfile | null> {
    const response = await fetch(`${url}/rest/v1/user_profiles?select=*&user_id=eq.${session.userId}&limit=1`, { headers: headers(session.accessToken) });
    if (!response.ok) throw new Error("No fue posible cargar tu perfil.");
    const row = (await response.json())[0];
    if (!row) return null;
    const avatarUrl = row.avatar_path ? await commercialService.getProfileAvatarUrl(session, row.avatar_path) : undefined;
    return { userId: row.user_id, displayName: row.display_name, avatarPath: row.avatar_path, avatarUrl };
  },
  async saveUserProfile(session: CommercialSession, profile: UserProfile): Promise<UserProfile> {
    const response = await fetch(`${url}/rest/v1/user_profiles?on_conflict=user_id`, {
      method: "POST", headers: { ...headers(session.accessToken), Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify({ user_id: session.userId, display_name: profile.displayName.trim(), avatar_path: profile.avatarPath || null, updated_at: new Date().toISOString() })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message ?? "No fue posible guardar tu perfil.");
    const row = data[0];
    const avatarUrl = row.avatar_path ? await commercialService.getProfileAvatarUrl(session, row.avatar_path) : undefined;
    return { userId: row.user_id, displayName: row.display_name, avatarPath: row.avatar_path, avatarUrl };
  },
  async uploadProfileAvatar(session: CommercialSession, file: File): Promise<string> {
    if (!session.userId) throw new Error("Vuelve a iniciar sesión para subir tu foto.");
    if (!file.type.startsWith("image/")) throw new Error("Selecciona una imagen para tu perfil.");
    if (file.size > 5 * 1024 * 1024) throw new Error("La foto debe pesar menos de 5 MB.");
    const path = `${session.userId}/avatar`;
    const response = await fetch(`${url}/storage/v1/object/profile-avatars/${path}`, { method: "POST", headers: { apikey: anonKey ?? "", Authorization: `Bearer ${session.accessToken}`, "Content-Type": file.type, "x-upsert": "true" }, body: file });
    if (!response.ok) throw new Error("No fue posible subir la foto.");
    return path;
  },
  async getProfileAvatarUrl(session: CommercialSession, path: string): Promise<string> {
    const response = await fetch(`${url}/storage/v1/object/sign/profile-avatars/${path}`, { method: "POST", headers: headers(session.accessToken), body: JSON.stringify({ expiresIn: 31536000 }) });
    const data = await response.json();
    if (!response.ok) throw new Error("No fue posible cargar la foto de perfil.");
    return `${url}/storage/v1${data.signedURL}`;
  }
};
