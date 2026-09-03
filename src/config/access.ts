export const ADMIN_EMAIL = "luisa@datapath.ai";

export const getAccountRole = (email?: string) => email?.toLowerCase() === ADMIN_EMAIL
  ? "Coordinadora comercial"
  : "Asesora comercial";
