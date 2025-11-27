export interface EditProfileType {
    username: string;
    language?: string;
    avatar?: string;
    fullname: string;
    email: string
}

export interface ContactSupportType {
    fullname: string;
    email: string;
    subject: string;
    message: string
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
