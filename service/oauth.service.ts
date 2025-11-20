const BASE_URL = "https://api.ottoman.emerj.net/api/v1";

export async function loginWithBackend(idToken: string) {
  try {
    const res = await fetch(`${BASE_URL}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    const data = await res.json();
    return { ok: res.ok, data };
  } catch (error) {
    let message = "Something went wrong";

    if (error instanceof Error) {
      message = error.message;
    }

    return { ok: false, data: { message } };
  }
}
