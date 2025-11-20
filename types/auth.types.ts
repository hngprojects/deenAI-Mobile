export interface SignupFormValues {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface LoginFormValues {
    email: string;
    password: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    authProvider: string;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        tokens: AuthTokens;
        user: User;
    };
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface RequestOtpPayload {
    email: string;
}

export interface VerifyOtpPayload {
    email: string;
    otp: string;
}

export interface ResetPasswordPayload {
    email: string;
    otp: string;
    newPassword: string;
}

export interface OtpResponse {
    success: boolean;
    message: string;
}