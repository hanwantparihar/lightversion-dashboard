"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { getToken, signOut as authSignOut } from "@/lib/auth";

type AuthState = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
    state: AuthState;
    isAuthenticated: boolean;
    signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AuthState>("loading");
    const router = useRouter();

    useEffect(() => {
        const token = getToken();
        setState(token ? "authenticated" : "unauthenticated");
    }, []);

    const signOut = useCallback(() => {
        authSignOut();
        setState("unauthenticated");
        router.push("/auth/login");
    }, [router]);

    return (
        <AuthContext.Provider
            value={{ state, isAuthenticated: state === "authenticated", signOut }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
