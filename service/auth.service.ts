import { AuthResponse, LoginFormValues, SignupFormValues, SocialProvider, User } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class AuthService {
    private baseURL = 'https://your-api.com/api';

    async signup(data: SignupFormValues): Promise<AuthResponse> {
        try {
            await delay(1500);

            const response = await fetch(`${this.baseURL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Signup failed');
            }

            const result = await response.json();

            return result;
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        }
    }

    async login(data: LoginFormValues): Promise<AuthResponse> {
        try {
            await delay(1500);

            const response = await fetch(`${this.baseURL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Login failed');
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async socialLogin(provider: SocialProvider, token: string): Promise<AuthResponse> {
        try {
            await delay(1500);

            const response = await fetch(`${this.baseURL}/auth/${provider}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Social login failed');
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Social login error:', error);
            throw error;
        }
    }

    async logout(): Promise<void> {
        try {
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }

    async getCurrentUser(): Promise<User | null> {
        try {
            const response = await fetch(`${this.baseURL}/auth/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) return null;

            const user = await response.json();
            return user;
        } catch (error) {
            console.error('Get current user error:', error);
            return null;
        }
    }
}

export default new AuthService();