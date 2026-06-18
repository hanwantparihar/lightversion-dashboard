"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Strength = 0 | 1 | 2 | 3 | 4;

const STRENGTH_META: Record<
  Strength,
  { label: string; color: string; barColor: string }
> = {
  0: { label: "", color: "text-muted-foreground", barColor: "bg-muted" },
  1: { label: "Weak", color: "text-red-500", barColor: "bg-red-500" },
  2: { label: "Fair", color: "text-amber-500", barColor: "bg-amber-500" },
  3: { label: "Good", color: "text-yellow-500", barColor: "bg-yellow-500" },
  4: { label: "Strong", color: "text-emerald-500", barColor: "bg-emerald-500" },
};

function getStrength(value: string): Strength {
  if (!value) return 0;
  let score = 0;
  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value)) score++;
  if (/[0-9]/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;
  return score as Strength;
}

type Step = "form" | "done";

export default function ResetPasswordPage() {
  const [step, setStep] = useState<Step>("form");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const strength = getStrength(newPassword);
  const meta = STRENGTH_META[strength];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    if (fd.get("confirmPassword") !== newPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (strength < 2) {
      setError("Please choose a stronger password.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setStep("done");
  }

  if (step === "done") {
    return (
      <Card className="w-full max-w-[420px]">
        <CardContent className="flex flex-col items-center gap-4 pb-8 pt-8 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-emerald-500/10 text-emerald-500">
            <ShieldCheck size={26} />
          </span>
          <div>
            <h2 className="text-lg font-bold">Password updated</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Your password has been changed successfully. You can now sign in
              with your new password.
            </p>
          </div>
          <Button asChild className="w-full">
            <Link href="/auth/login">Go to sign in</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-[420px]">
      <CardHeader>
        <CardTitle className="text-xl">Set a new password</CardTitle>
        <CardDescription>
          Your new password must be at least 8 characters and include numbers
          and special characters.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          {/* New password */}
          <div className="space-y-1.5">
            <Label htmlFor="new-password">New password</Label>
            <div className="relative">
              <Input
                id="new-password"
                name="newPassword"
                type={showNew ? "text" : "password"}
                placeholder="Enter new password"
                autoComplete="new-password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                tabIndex={-1}
                aria-label={showNew ? "Hide password" : "Show password"}
                onClick={() => setShowNew((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {/* Strength meter */}
            {newPassword.length > 0 && (
              <div className="space-y-1.5 pt-0.5">
                <div className="flex gap-1">
                  {([1, 2, 3, 4] as Strength[]).map((s) => (
                    <div
                      key={s}
                      className={cn(
                        "h-1 flex-1 rounded-full transition-colors duration-300",
                        strength >= s ? meta.barColor : "bg-muted"
                      )}
                    />
                  ))}
                </div>
                <p className={cn("text-xs font-semibold", meta.color)}>
                  {meta.label}
                  {strength < 3 && (
                    <span className="ml-1 font-normal text-muted-foreground">
                      — add uppercase, numbers &amp; symbols
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirm-password">Confirm new password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter new password"
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

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 size={15} className="animate-spin" />}
            Reset password
          </Button>
        </form>

        <Link
          href="/auth/login"
          className="flex items-center justify-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={14} />
          Back to sign in
        </Link>
      </CardContent>
    </Card>
  );
}
