"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  initialUsers,
  syncUserName,
  type AppUser,
} from "@/lib/users-data";

type UsersContextValue = {
  users: AppUser[];
  getUser: (id: number) => AppUser | undefined;
  updateUser: (id: number, data: Partial<AppUser>) => void;
  updateUserRole: (id: number, role: string) => void;
};

const UsersContext = createContext<UsersContextValue | null>(null);

export function UsersProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<AppUser[]>(initialUsers);

  const getUser = useCallback(
    (id: number) => users.find((u) => u.id === id),
    [users]
  );

  const updateUser = useCallback((id: number, data: Partial<AppUser>) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u;
        return syncUserName({ ...u, ...data });
      })
    );
  }, []);

  const updateUserRole = useCallback((id: number, role: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role } : u))
    );
  }, []);

  const value = useMemo(
    () => ({ users, getUser, updateUser, updateUserRole }),
    [users, getUser, updateUser, updateUserRole]
  );

  return (
    <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
  );
}

export function useUsers() {
  const ctx = useContext(UsersContext);
  if (!ctx) {
    throw new Error("useUsers must be used within UsersProvider");
  }
  return ctx;
}
