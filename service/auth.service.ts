import { AuthResponse, LoginFormValues, SignupFormValues, User } from "@/types";
class AuthService {
    private async mockApiCall<T>(data: T, delay: number = 1000): Promise<T> {
        return new Promise((resolve) => {
            setTimeout(() => resolve(data), delay);
        });
    }

    async login(credentials: LoginFormValues): Promise<AuthResponse> {
        // Mock successful login
        const mockUser: User = {
            id: '1',
            name: 'Test User',
            email: credentials.email,
            createdAt: new Date(),
        };

        const mockResponse: AuthResponse = {
            user: mockUser,
            token: 'mock-jwt-token-12345',
        };

        return this.mockApiCall(mockResponse, 1500);
    }

    async signup(userData: SignupFormValues): Promise<AuthResponse> {
        // Mock successful signup
        const mockUser: User = {
            id: '1',
            name: userData.name,
            email: userData.email,
            createdAt: new Date(),
        };

        const mockResponse: AuthResponse = {
            user: mockUser,
            token: 'mock-jwt-token-12345',
        };

        return this.mockApiCall(mockResponse, 1500);
    }

    async logout(): Promise<void> {
        return this.mockApiCall(undefined, 500);
    }

    async getCurrentUser(token: string): Promise<User> {
        // Mock current user
        const mockUser: User = {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            createdAt: new Date(),
        };

        return this.mockApiCall(mockUser, 500);
    }
}

export const authService = new AuthService();