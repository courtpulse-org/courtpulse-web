export type UserRole = "LAWYER" | "REGISTRAR" | "ADMIN";

export interface IUser {
  id: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  /** Supreme Court enrolment number — lawyers only. */
  enrolment_number?: string;
  /** Law firm (never "chambers" — that word is reserved for a judge's). */
  firm?: string;
  /** Year called to the Bar. */
  year_of_call?: number;
  /** Courtrooms a registrar is onboarded to manage. */
  courtroom_ids?: string[];
  /** Registrar job title, e.g. "Court Registrar", "Chief Registrar". */
  staff_title?: string;
  is_verified: boolean;
  created_at: string;
}

export interface IAuthTokens {
  access_token: string;
  refresh_token?: string;
}

export interface INotificationPreferences {
  sms: boolean;
  whatsapp: boolean;
  push: boolean;
}
