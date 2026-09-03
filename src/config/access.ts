export const ADMIN_EMAIL = "luisa@datapath.ai";

export const getAccountRole = (email?: string, customRole?: string) => customRole?.trim() || (email?.toLowerCase() === ADMIN_EMAIL
  ? "Coordinadora comercial"
  : "Asesora comercial");
