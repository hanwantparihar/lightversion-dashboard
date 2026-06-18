"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
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

type Step = "form" | "sent";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("form");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setStep("sent");
  }

  if (step === "sent") {
    return (
      <Card className="w-full max-w-[420px]">
        <CardContent className="pt-8 pb-8 flex flex-col items-center text-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
            <MailCheck size={26} />
          </span>
          <div>
            <h2 className="text-lg font-bold">Check your inbox</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              We sent a password reset link to{" "}
              <span className="font-semibold text-foreground">{email}</span>.
              It expires in 30 minutes.
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Didn&apos;t receive it?{" "}
            <button
              type="button"
              onClick={() => setStep("form")}
              className="font-semibold text-primary hover:underline"
            >
              Try again
            </button>
          </p>
          <Link
            href="/auth/login"
            className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={14} />
            Back to sign in
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-[420px]">
      <CardHeader>
        <CardTitle className="text-xl">Forgot your password?</CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send you a secure reset link.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="forgot-email">Email address</Label>
            <Input
              id="forgot-email"
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 size={15} className="animate-spin" />}
            Send reset link
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
