const TOKEN_KEY = "custom-auth-token";

/** Generate a random session token */
// export function generateToken(): string {
//   return crypto.randomUUID();
// }
export function generateToken(): string {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);

  return Array.from(array, (b) =>
    b.toString(16).padStart(2, "0")
  ).join("");
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// Hardcoded credentials (replace with a real API call when a backend exists)
const VALID_EMAIL = "user@nexora.io";
const VALID_PASSWORD = "Secret1";

export type SignInResult =
  | { success: true }
  | { success: false; error: string };

export async function signInWithPassword(
  email: string,
  password: string
): Promise<SignInResult> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 800));

  if (email !== VALID_EMAIL || password !== VALID_PASSWORD) {
    return { success: false, error: "Invalid email or password" };
  }

  setToken(generateToken());
  return { success: true };
}

export function signOut(): void {
  removeToken();
  // Clear the cookie used by middleware
  if (typeof document !== "undefined") {
    document.cookie = "custom-auth-token=; path=/; max-age=0";
  }
}
