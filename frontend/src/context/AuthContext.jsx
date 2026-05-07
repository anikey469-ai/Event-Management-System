import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { loginUser, registerUser } from "../services/api";

const AuthContext = createContext(null);

const STORAGE_KEYS = {
  token: "ems_token",
  user: "ems_user",
};

function readStoredUser() {
  const value = localStorage.getItem(STORAGE_KEYS.user);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    localStorage.removeItem(STORAGE_KEYS.user);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.token) || "");
  const [user, setUser] = useState(() => readStoredUser());

  useEffect(() => {
    if (token) {
      localStorage.setItem(STORAGE_KEYS.token, token);
    } else {
      localStorage.removeItem(STORAGE_KEYS.token);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.user);
    }
  }, [user]);

  async function login(credentials) {
    const response = await loginUser(credentials);
    setToken(response.token);
    setUser(response.user);
    return response;
  }

  async function register(payload) {
    const response = await registerUser(payload);
    setToken(response.token);
    setUser(response.user);
    return response;
  }

  function logout() {
    setToken("");
    setUser(null);
  }

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token),
      login,
      logout,
      register,
      token,
      user,
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
