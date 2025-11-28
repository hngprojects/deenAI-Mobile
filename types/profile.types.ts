export interface EditProfileType {
  username: string;
  language?: string;
  avatar?: string;
  fullname: string;
  email: string;
}
export interface ContactSupportType {
  name: string;
  email: string;
  subject: string;
  content: string;
}
export interface RequestOtpPayload {
  email: string;
}
export interface VerifyOtpPayload {
  email: string;
  otp: string;
}
export interface OtpResponse {
  success: boolean;
  message: string;
}
