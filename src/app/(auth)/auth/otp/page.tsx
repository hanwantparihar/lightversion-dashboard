"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Mail, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const OTP_LENGTH = 6;

type Step = "contact" | "otp" | "done";
type ContactMethod = "email" | "phone";

export default function OtpLoginPage() {
  const [step, setStep] = useState<Step>("contact");
  const [method, setMethod] = useState<ContactMethod>("email");
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const focusAt = useCallback((index: number) => {
    inputRefs.current[Math.max(0, Math.min(index, OTP_LENGTH - 1))]?.focus();
  }, []);

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < OTP_LENGTH - 1) focusAt(index + 1);
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const next = [...otp];
        next[index] = "";
        setOtp(next);
      } else if (index > 0) {
        focusAt(index - 1);
      }
    } else if (e.key === "ArrowLeft") {
      focusAt(index - 1);
    } else if (e.key === "ArrowRight") {
      focusAt(index + 1);
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const text = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!text) return;
    const next = [...Array(OTP_LENGTH).fill("")];
    text.split("").forEach((ch, i) => (next[i] = ch));
    setOtp(next);
    focusAt(Math.min(text.length, OTP_LENGTH - 1));
  }

  const isComplete = otp.every((d) => d !== "");

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!contact.trim()) {
      setError(`Please enter your ${method === "email" ? "email" : "phone number"}.`);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setStep("otp");
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!isComplete) {
      setError("Please enter all 6 digits.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setStep("done");
  }

  if (step === "done") {
    return (
      <Card className="w-full max-w-[400px]">
        <CardContent className="flex flex-col items-center gap-4 pb-8 pt-8 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-emerald-500/10 text-emerald-500 text-2xl">
            ✓
          </span>
          <div>
            <h2 className="text-lg font-bold">Signed in successfully</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              OTP verification complete. Welcome back!
            </p>
          </div>
          <Button asChild className="w-full">
            <Link href="/">Go to dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (step === "otp") {
    return (
      <Card className="w-full max-w-[400px]">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Enter verification code</CardTitle>
          <CardDescription>
            We sent a 6-digit code to{" "}
            <span className="font-semibold text-foreground">{contact}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <form onSubmit={handleVerify} className="space-y-5" noValidate>
            {error && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
                {error}
              </p>
            )}
            <div className="flex justify-center gap-2.5" onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onFocus={(e) => e.target.select()}
                  aria-label={`Digit ${i + 1} of ${OTP_LENGTH}`}
                  className={cn(
                    "h-12 w-11 rounded-lg border bg-muted/50 text-center text-lg font-bold transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    digit
                      ? "border-primary text-foreground"
                      : "border-input text-muted-foreground"
                  )}
                />
              ))}
            </div>
            <Button type="submit" className="w-full" disabled={loading || !isComplete}>
              {loading && <Loader2 size={15} className="animate-spin" />}
              Verify & sign in
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            Didn&apos;t receive a code?{" "}
            {resendCooldown > 0 ? (
              <span className="font-semibold">Resend in {resendCooldown}s</span>
            ) : (
              <button
                type="button"
                onClick={() => setResendCooldown(60)}
                className="font-semibold text-primary hover:underline"
              >
                Resend
              </button>
            )}
          </p>
          <button
            type="button"
            onClick={() => setStep("contact")}
            className="flex w-full items-center justify-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={14} />
            Change {method}
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-[400px]">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Sign in with OTP</CardTitle>
        <CardDescription>
          Enter your email or phone to receive a one-time password
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex gap-2 rounded-lg bg-muted p-1">
          {(
            [
              { id: "email" as const, label: "Email", icon: Mail },
              { id: "phone" as const, label: "Phone", icon: Smartphone },
            ] as const
          ).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setMethod(id);
                setContact("");
              }}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-semibold transition-colors",
                method === id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSendCode} className="space-y-4" noValidate>
          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="contact">
              {method === "email" ? "Email address" : "Phone number"}
            </Label>
            <Input
              id="contact"
              type={method === "email" ? "email" : "tel"}
              placeholder={
                method === "email" ? "you@company.com" : "+1 (555) 000-0000"
              }
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 size={15} className="animate-spin" />}
            Send verification code
          </Button>
        </form>

        <Link
          href="/auth/login"
          className="flex items-center justify-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={14} />
          Sign in with password
        </Link>
      </CardContent>
    </Card>
  );
}
