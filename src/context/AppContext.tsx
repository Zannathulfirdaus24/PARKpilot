import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";
type BookingDraft = {
  lotId?: string;
  lotName?: string;
  slot?: string;
  hours?: number;
  price?: number;
};

type AppState = {
  theme: Theme;
  toggleTheme: () => void;
  user: { name: string; email: string; phone: string; vehicle: string; avatar: string } | null;
  setUser: (u: AppState["user"]) => void;
  draft: BookingDraft;
  setDraft: (d: BookingDraft) => void;
};

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [user, setUser] = useState<AppState["user"]>({
    name: "Ava Rodriguez",
    email: "ava@example.com",
    phone: "+1 415 555 0134",
    vehicle: "CA 8XYZ 042",
    avatar: "https://i.pravatar.cc/120?img=47",
  });
  const [draft, setDraft] = useState<BookingDraft>({});

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <Ctx.Provider
      value={{
        theme,
        toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
        user,
        setUser,
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
