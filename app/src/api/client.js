/**
 * Gemensam fil för alla anrop till backend API.
 * 
 * Alla anrop går genom apiRequest, så att taoken, timeout och felhantering hanteras på ett ställe.
 */

// IP adressen till backend, läser från .env, ändras IP adress och .env ändras behöver appen startas om med: npx expo start -c
const API_URL = process.env.EXPO_PUBLIC_API_URL;
// Antal ms ett anrop får ta innan det avbryts. (15 sekunder)
const TIMEOUT_MS = 15000;

export class ApiError extends Error {
  constructor(message, { status = 0, fieldErrors = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

let authToken = null;
let onUnauthorized = null;

export function setAuthToken(token) {
  authToken = token;
}

export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

export async function apiRequest(path, { method = 'GET', body } = {}) {
const isFormData = body instanceof FormData;

const headers = {};
if (body && !isFormData) {
  headers['Content-Type'] = 'application/json';
}
if (authToken) {
  headers.Authorization = `Bearer ${authToken}`;
}

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (error) {
    console.warn(`Nätverksfel: ${method} ${path}`, error);
    throw new ApiError('Kunde inte nå servern. Kontrollera din anslutning.');
  } finally {
    clearTimeout(timeoutId);
  }

  // Gick bra att hämta, men inget innehåll. T.ex DELETE som lyckades.
  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 && authToken && onUnauthorized) {
      onUnauthorized();
    }
    throw new ApiError(data?.message ?? 'Något gick fel. Försök igen.', {
      status: response.status,
      fieldErrors: data?.fieldErrors ?? null,
    });
  }

  return data;
}

export function imageUri(path) {
  return path ? `${API_URL}${path}` : null;
}