export interface AuthUser {
  id: string;
  nombre: string;
  email: string;
  telefono?: string | null;
  rol: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

const STORAGE_KEY = 'vidrieria_auth_session';

export function getAuthSession(): AuthSession | null {
  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function setAuthSession(session: AuthSession) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  window.localStorage.removeItem(STORAGE_KEY);
}
