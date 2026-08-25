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
  email: string;
}
