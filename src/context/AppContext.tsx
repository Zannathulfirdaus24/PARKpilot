import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getToken, setToken as persistToken, api, type UserSummary } from "../lib/api";

type Theme = "light" | "dark";
type BookingDraft = {
  lotId?: string;
  lotName?: string;
  slot?: string;
  slotId?: string;
  hours?: number;
  price?: number;
  reference?: string;
  bookingDate?: string;
  startTime?: string;
  endTime?: string;
};

type AppUser = {
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  avatar: string; // "" means no custom photo → show initials
} | null;

type AppState = {
  theme: Theme;
  toggleTheme: () => void;
  user: AppUser;
  setUser: (u: AppUser) => void;
  loginUser: (u: UserSummary, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  setAvatar: (dataUrl: string) => Promise<void>;
  removeAvatar: () => Promise<void>;
  draft: BookingDraft;
  setDraft: (d: BookingDraft) => void;
};

const Ctx = createContext<AppState | null>(null);
const AVATAR_KEY = "parkpilot_avatar";

function loadSavedAvatar(): string {
  if (typeof localStorage === "undefined") return "";
  return localStorage.getItem(AVATAR_KEY) ?? "";
}

function toAppUser(u: UserSummary): AppUser {
  return {
    name: u.name,
    email: u.email,
    phone: u.phone ?? "",
    vehicle: u.vehicleNo ?? "",
    // Use the backend avatar if set, else any locally saved photo, else "" (initials).
    avatar: u.avatarUrl ?? loadSavedAvatar(),
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [user, setUser] = useState<AppUser>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [draft, setDraft] = useState<BookingDraft>({});

  // Restore auth state on load (token persisted in localStorage).
  useEffect(() => {
    if (getToken()) setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const loginUser = (u: UserSummary, token: string) => {
    persistToken(token);
    setUser(toAppUser(u));
    setIsAuthenticated(true);
  };

  const logout = () => {
    persistToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const setAvatar = async (dataUrl: string) => {
    // Optimistic local update + cache for instant display.
    if (typeof localStorage !== "undefined") localStorage.setItem(AVATAR_KEY, dataUrl);
    setUser((u) => (u ? { ...u, avatar: dataUrl } : u));
    // Persist to the server so it follows the user across devices.
    await api.setAvatar(dataUrl);
  };

  const removeAvatar = async () => {
    if (typeof localStorage !== "undefined") localStorage.removeItem(AVATAR_KEY);
    setUser((u) => (u ? { ...u, avatar: "" } : u));
    await api.deleteAvatar();
  };

  return (
    <Ctx.Provider
      value={{
        theme,
        toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
        user,
        setUser,
        loginUser,
        logout,
        isAuthenticated,
        setAvatar,
        removeAvatar,
        draft,
        setDraft,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useApp = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp outside provider");
  return c;
};
