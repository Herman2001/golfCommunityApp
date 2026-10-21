import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { setAuthToken, setUnauthorizedHandler } from '../api/client';
import * as authApi from '../api/auth';

/**
 * Hanterar inloggningen för hela appen. 
 * 
 * Håller redo på vilken användare som är inloggad, och sparar inloggningen i secure store så att 
 * användren fortfarande är inloggad om appen stängs. (likt reddit, instagram osv....)
 * 
 * Wrappar <AuthProvider> runt appen i App.js, och använder useAuth() för att komma åt inloggningsstatus och funktioner.
 */
const TOKEN_KEY = 'authToken';
const USER_KEY = 'authUser';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isRestoring, setIsRestoring] = useState(true);

  const clearSession = useCallback(async () => {
    setAuthToken(null);
    setUser(null);
    await Promise.all([
      SecureStore.deleteItemAsync(TOKEN_KEY),
      SecureStore.deleteItemAsync(USER_KEY),
    ]);
  }, []);

  const saveSession = useCallback(async ({ token, user: loggedInUser }) => {
    await Promise.all([
      SecureStore.setItemAsync(TOKEN_KEY, token),
      SecureStore.setItemAsync(USER_KEY, JSON.stringify(loggedInUser)),
    ]);
    setAuthToken(token);
    setUser(loggedInUser);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(clearSession);
    return () => setUnauthorizedHandler(null);
  }, [clearSession]);

  useEffect(() => {
    async function restoreSession() {
      try {
        const [token, storedUser] = await Promise.all([
          SecureStore.getItemAsync(TOKEN_KEY),
          SecureStore.getItemAsync(USER_KEY),
        ]);

        if (!token || !storedUser) {
          return;
        }

        setAuthToken(token);
        setUser(JSON.parse(storedUser));

        authApi.fetchCurrentUser()
          .then(setUser)
          .catch((error) => console.warn('Kunde inte verifiera inloggningen', error.message));
      } catch (error) {
        console.warn('Kunde inte läsa sparad inloggning', error);
        await clearSession();
      } finally {
        setIsRestoring(false);
      }
    }

    restoreSession();
  }, [clearSession]);

  const login = useCallback(async (email, password) => {
    const result = await authApi.login(email, password);
    await saveSession(result);
  }, [saveSession]);

  const register = useCallback(async (username, email, password) => {
    const result = await authApi.register(username, email, password);
    await saveSession(result);
  }, [saveSession]);

  const value = useMemo(() => ({
    user,
    isLoggedIn: user !== null,
    isRestoring,
    login,
    register,
    logout: clearSession,
  }), [user, isRestoring, login, register, clearSession]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth måste användas inuti <AuthProvider>.');
  }
  return context;
}