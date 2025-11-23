import { useAuthStore } from "@/store/auth-store";
import { authService } from "./auth.service";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

interface ApiRequestOptions extends RequestInit {
  skipAuth?: boolean;
}

class ApiService {
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  private subscribeTokenRefresh(callback: (token: string) => void) {
    this.refreshSubscribers.push(callback);
  }

  private onTokenRefreshed(token: string) {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  private async refreshAccessToken(): Promise<string> {
    const { refreshToken, clearAuth } = useAuthStore.getState();

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      console.log("🔄 Refreshing token...");
      const response = await authService.refreshToken(refreshToken);

      const newAccessToken = response.tokens.accessToken;
      const newRefreshToken = response.tokens.refreshToken;

      useAuthStore.getState().updateToken(newAccessToken);

      if (newRefreshToken) {
        useAuthStore.setState({ refreshToken: newRefreshToken });
      }

      console.log("✅ Token refreshed successfully");
      return newAccessToken;
    } catch (error) {
      console.error("❌ Token refresh failed:", error);
      clearAuth();
      throw error;
    }
  }

  async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const { skipAuth = false, ...fetchOptions } = options;
    const url = `${API_BASE_URL}${endpoint}`;

    const { token } = useAuthStore.getState();

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
      ...fetchOptions,
    };

    if (!skipAuth && token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);

      if (response.status === 401 && !skipAuth) {
        const { refreshToken } = useAuthStore.getState();

        if (!refreshToken) {
          throw new Error("Unauthorized");
        }

        if (this.isRefreshing) {
          return new Promise((resolve, reject) => {
            this.subscribeTokenRefresh(async (newToken: string) => {
              try {
                config.headers = {
                  ...config.headers,
                  Authorization: `Bearer ${newToken}`,
                };
                const retryResponse = await fetch(url, config);

                if (!retryResponse.ok) {
                  const errorData = await retryResponse
                    .json()
                    .catch(() => ({}));
                  reject(new Error(errorData.message || "Request failed"));
                  return;
                }

                const data = await retryResponse.json();
                resolve(data);
              } catch (error) {
                reject(error);
              }
            });
          });
        }

        this.isRefreshing = true;

        try {
          const newToken = await this.refreshAccessToken();
          this.isRefreshing = false;
          this.onTokenRefreshed(newToken);

          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${newToken}`,
          };

          const retryResponse = await fetch(url, config);

          if (!retryResponse.ok) {
            const errorData = await retryResponse.json().catch(() => ({}));
            throw new Error(errorData.message || "Request failed");
          }

          return await retryResponse.json();
        } catch (refreshError) {
          this.isRefreshing = false;
          throw refreshError;
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API request error data:", errorData);
        throw new Error(
          errorData.message || `Request failed with status ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API request error:", error);
      throw error;
    }
  }

  async get<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    options?: ApiRequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    options?: ApiRequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    options?: ApiRequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export const apiService = new ApiService();
