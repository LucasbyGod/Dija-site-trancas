import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminUser } from '../types';

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const SESSION_STORAGE_KEY = 'dija_admin_session_token';

// Accepted owner credentials
const VALID_ACCOUNTS = [
  { email: 'dijatrancas@gmail.com', pass: 'dija2026', name: 'Dija (Proprietária)' },
  { email: 'dija@estudiodija.com', pass: 'dija2026', name: 'Dija (Proprietária)' },
  { email: 'admin@estudiodija.com', pass: 'dija123', name: 'Administração Dija' },
  { email: 'lukastsu0@gmail.com', pass: 'dija2026', name: 'Dija Tranças' },
];

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      // Verify expiry (24 hours)
      const now = Date.now();
      const loginTime = new Date(parsed.loggedInAt).getTime();
      if (now - loginTime > 24 * 60 * 60 * 1000) {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  });

  const login = (email: string, pass: string): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanEmail || !cleanPass) {
      return { success: false, error: 'Por favor, informe o e-mail e a senha administrativa.' };
    }

    const found = VALID_ACCOUNTS.find(
      (acc) => acc.email.toLowerCase() === cleanEmail && acc.pass === cleanPass
    );

    if (found) {
      const user: AdminUser = {
        email: found.email,
        name: found.name,
        role: 'owner',
        token: 'dija_jwt_' + Math.random().toString(36).substring(2) + Date.now(),
        loggedInAt: new Date().toISOString(),
      };

      setAdminUser(user);
      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
      } catch {
        // session storage unavailable
      }
      return { success: true };
    }

    return {
      success: false,
      error: 'E-mail ou senha incorretos. Verifique suas credenciais de proprietária.',
    };
  };

  const logout = () => {
    setAdminUser(null);
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        isAuthenticated: !!adminUser,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth deve ser usado dentro de AdminAuthProvider');
  }
  return context;
};
