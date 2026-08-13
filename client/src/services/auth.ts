// client/src/services/auth.ts
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  const data = await res.json();
  localStorage.setItem('ts_token', data.token);
  localStorage.setItem('ts_user', JSON.stringify(data.user));
  return data;
}

export function logout() {
  localStorage.removeItem('ts_token');
  localStorage.removeItem('ts_user');
}

export function getToken(): string | null {
  return localStorage.getItem('ts_token');
}

export function getUser() {
  const s = localStorage.getItem('ts_user');
  return s ? JSON.parse(s) : null;
}

export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
  const token = getToken();
  const headers = new Headers(init.headers || {});
  headers.set('Content-Type', headers.get('Content-Type') || 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const res = await fetch(typeof input === 'string' ? input : input.toString(), { ...init, headers });
  if (res.status === 401) {
    // token expired or unauthorized
    logout();
    throw new Error('Unauthorized');
  }
  return res;
}
