"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckboxPrimitive } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const fd = new FormData(e.currentTarget);
    if (fd.get("password") !== fd.get("confirmPassword")) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreed) {
      setError("You must accept the Terms of Service to continue.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
  }

  return (
    <Card className="w-full max-w-[420px]">
      <CardHeader>
        <CardTitle className="text-xl">Create an account</CardTitle>
        <CardDescription>Start your 14-day free trial — no credit card required</CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Social sign-up */}
        <div className="grid grid-cols-2 gap-3">
          <Button type="button" variant="outline" className="gap-2 text-sm">
            <GoogleIcon />
            Google
          </Button>
          <Button type="button" variant="outline" className="gap-2 text-sm">
            <GitHubIcon />
            GitHub
          </Button>
        </div>

        <Divider label="or sign up with email" />

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="reg-name">Full name</Label>
            <Input
              id="reg-name"
              name="fullName"
              type="text"
              placeholder="Arjun Kapoor"
              autoComplete="name"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reg-email">Work email</Label>
            <Input
              id="reg-email"
              name="email"
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reg-password">Password</Label>
            <div className="relative">
              <Input
                id="reg-password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                minLength={8}
                required
                className="pr-10"
              />
              <button
                type="button"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reg-confirm">Confirm password</Label>
            <div className="relative">
              <Input
                id="reg-confirm"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                required
                className="pr-10"
              />
              <button
                type="button"
                tabIndex={-1}
                aria-label={showConfirm ? "Hide password" : "Show password"}
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-2.5">
            <CheckboxPrimitive
              id="terms"
              checked={agreed}
              onCheckedChange={(v) => setAgreed(v === true)}
              className="mt-0.5"
            />
            <span className="text-sm text-muted-foreground">
              I agree to the{" "}
              <span className="font-semibold text-primary hover:underline cursor-pointer">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="font-semibold text-primary hover:underline cursor-pointer">
                Privacy Policy
              </span>
            </span>
          </label>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 size={15} className="animate-spin" />}
            Create account
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="relative flex items-center">
      <div className="flex-1 border-t border-border" />
      <span className="mx-3 text-xs text-muted-foreground">{label}</span>
      <div className="flex-1 border-t border-border" />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}
