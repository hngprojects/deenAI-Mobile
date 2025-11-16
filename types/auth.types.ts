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
    createdAt: Date;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface AuthError {
    message: string;
    field?: string;
}

export type SocialProvider = 'apple' | 'google';