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