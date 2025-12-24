// Authentication Service wired to backend
// Endpoints:
//   POST /auth/register { email, password }
//   POST /auth/login    { email, password } -> { message, token }

// Configure API base URL via Vite env (VITE_API_URL) or default to localhost.
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL ?? "http://localhost:5000";

export interface LoginCredentials {
  email: string;
  password: string;
}

// Backend register accepts only email + password. Keep name optional for future UI.
export interface RegisterCredentials {
  email: string;
  password: string;
  name?: string;
}

export type LoginResult = {
  success: boolean;
  message: string;
  token?: string;
};

export type RegisterResult = {
  success: boolean;
  message: string;
};

// Simple token utilities
const TOKEN_KEY = "authToken";
export const getAuthToken = (): string | null => {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
};
export const setAuthToken = (token: string) => {
  try { localStorage.setItem(TOKEN_KEY, token); } catch {}
};
export const clearAuthToken = () => {
  try { localStorage.removeItem(TOKEN_KEY); } catch {}
};

// Helpers
async function jsonPost<TBody extends object>(path: string, body: TBody): Promise<Response> {
  const url = `${API_BASE_URL}${path}`;
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export const register = async (credentials: RegisterCredentials): Promise<RegisterResult> => {
  // Send only fields backend expects
  const payload = { email: credentials.email, password: credentials.password };
  const res = await jsonPost("/auth/register", payload);

  let data: any = {};
  try { data = await res.json(); } catch {}

  if (!res.ok) {
    return { success: false, message: data?.message ?? `Register failed (${res.status})` };
  }
  return { success: true, message: data?.message ?? "User registered successfully" };
};

export const login = async (credentials: LoginCredentials): Promise<LoginResult> => {
  const res = await jsonPost("/auth/login", credentials);
  let data: any = {};
  try { data = await res.json(); } catch {}

  if (!res.ok) {
    return { success: false, message: data?.message ?? "Invalid credentials" };
  }

  const token = data?.token as string | undefined;
  if (token) setAuthToken(token);
  return { success: true, message: data?.message ?? "Login successful", token };
};

export const logout = async (): Promise<{ success: boolean; message: string }> => {
  // Clear client token; backend example does not expose /auth/logout.
  clearAuthToken();
  return { success: true, message: "Logged out" };
};
