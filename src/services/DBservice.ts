// DBservice.ts
// Client-side service for creating and fetching a user's Neo4j database via backend
// Endpoints (protected by JWT):
//  POST /db/create { neo4jPassword }
//  GET  /db/my-database

import { getAuthToken } from "./authService";

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL ?? "http://localhost:5000";

export type CreateDbPayload = {
  neo4jPassword: string;
};

export type DbInfo = {
  containerName: string;
  httpPort: number; // Neo4j HTTP (browser) port mapped on host
  boltPort: number; // Neo4j Bolt port mapped on host
  neo4jPassword?: string;
};

function authHeaders() {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getAuthToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function createDatabase(payload: CreateDbPayload): Promise<{ success: boolean; message: string; data?: DbInfo }>
{
  const res = await fetch(`${API_BASE_URL}/db/create`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  let data: any = {};
  try { data = await res.json(); } catch {}

  if (!res.ok) {
    return { success: false, message: data?.message ?? `Create failed (${res.status})` };
  }

  const info: DbInfo = {
    containerName: data.containerName,
    httpPort: data.httpPort,
    boltPort: data.boltPort,
    neo4jPassword: data.neo4jPassword,
  };

  return { success: true, message: data?.message ?? "Neo4j database created", data: info };
}

export async function getMyDatabase(): Promise<{ success: boolean; message: string; data?: DbInfo }>
{
  const res = await fetch(`${API_BASE_URL}/db/my-database`, {
    method: "GET",
    headers: authHeaders(),
  });

  let data: any = {};
  try { data = await res.json(); } catch {}

  if (!res.ok) {
    return { success: false, message: data?.message ?? `Fetch failed (${res.status})` };
  }

  const info: DbInfo = {
    containerName: data.containerName,
    httpPort: data.httpPort,
    boltPort: data.boltPort,
    neo4jPassword: data.neo4jPassword,
  };

  return { success: true, message: data?.message ?? "Database info", data: info };
}

// Convenience: open Neo4j Browser for the user's DB
export function openNeo4jBrowser(httpPort: number, path: string = "browser") {
  const url = `http://localhost:${httpPort}/${path}`; // Neo4j browser is at /browser
  window.open(url, "_blank");
}
