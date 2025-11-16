import * as Yup from 'yup';

export const SignupSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters')
        .required('Name is required')
        .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),

    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required')
        .lowercase()
        .trim(),

    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .max(50, 'Password must be less than 50 characters')
        .required('Password is required')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        ),

    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Password does not match')
        .required('Please confirm your password'),
});

export const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required')
        .lowercase()
        .trim(),

    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .max(50, 'Password must be less than 50 characters')
        .required('Password is required')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        ),
});

export const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required')
        .lowercase()
        .trim(),
});

export const ResetPasswordSchema = Yup.object().shape({
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .max(50, 'Password must be less than 50 characters')
        .required('Password is required')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        ),

    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Password does not match')
        .required('Please confirm your password'),
});

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
    if (password.length < 6) return 'weak';

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;

    if (strength >= 3 && password.length >= 8) return 'strong';
    if (strength >= 2 && password.length >= 6) return 'medium';
    return 'weak';
};