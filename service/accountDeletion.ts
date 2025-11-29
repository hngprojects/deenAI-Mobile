import { useAuthStore } from "@/store/auth-store";

const BASE_URL = "https://api.staging.ottoman.emerj.net/api/v1/users/delete";

interface DeleteRequestResponse {
  message: string;
  status: string;
}

interface DeleteConfirmResponse {
  message: string;
  status: string;
}

export async function requestAccountDeletion(): Promise<DeleteRequestResponse> {
  const token = useAuthStore.getState().token;
  const email = useAuthStore.getState().user?.email;

  if (!token || !email) {
    throw new Error("Missing token or email in auth store");
  }

  const response = await fetch(`${BASE_URL}/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.message ?? "Failed to request account deletion");
  }

  return response.json();
}

export async function confirmAccountDeletion(
  otp: string
): Promise<DeleteConfirmResponse> {
  const token = useAuthStore.getState().token;
  const email = useAuthStore.getState().user?.email;

  if (!token || !email) {
    throw new Error("Missing token or email in auth store");
  }

  const response = await fetch(`${BASE_URL}/confirm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email, otp }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.message ?? "Failed to confirm account deletion");
  }

  return response.json();
}
