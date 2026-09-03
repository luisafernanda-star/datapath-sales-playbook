export type ProgramStatus = "active" | "inactive";

export interface PaymentLink {
  id: string;
  label: string;
  url: string;
  price?: string;
}

export interface Coupon {
  id: string;
  label: string;
  code: string;
  discount?: string;
  category: "regular" | "special";
}

export interface CommercialProgram {
  id: string;
  name: string;
  shortName: string;
  type: "En vivo" | "Asincrónico" | "Híbrido";
  status: ProgramStatus;
  description: string;
  paymentLinks: PaymentLink[];
  coupons: Coupon[];
  updatedAt?: string;
}

export interface CommercialSession {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  email: string;
  userId?: string;
}

export interface FollowUp {
  id: string;
  userId: string;
  clientName: string;
  phone: string;
  program: string;
  dueAt: string;
  notes: string;
  status: "pending" | "completed";
  attachmentUrl?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  expiresAt?: string;
  read: boolean;
}

export interface UserProfile {
  userId: string;
  displayName: string;
  avatarPath?: string;
  avatarUrl?: string;
}
