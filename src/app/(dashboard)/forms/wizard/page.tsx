"use client";
import { useState } from "react";
import {
  User, Contact, MapPin, CheckCircle, Check,
  ArrowLeft, ArrowRight, CreditCard, Lock,
  Building2, Briefcase, Settings, Sparkles,
} from "lucide-react";
import {
  Card, CardHeader, CardContent, CardTitle, CardDescription,
  Input, Label, Button, DropdownSelect, Switch,
} from "@/components/ui";
import { cn } from "@/lib/utils";

// ── Shared atoms ──────────────────────────────────────────────────────────────
function Req() {
  return <span className="text-destructive ml-0.5">*</span>;
}

function Field({ label, hint, children }: { label: React.ReactNode; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-[13px] font-semibold">{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold">{value || <span className="text-muted-foreground/50 font-normal">Not set</span>}</span>
    </div>
  );
}

function NavButtons({
  step, total, onPrev, onNext, onSubmit, nextLabel = "Next step",
}: {
  step: number; total: number; onPrev: () => void; onNext: () => void;
  onSubmit?: () => void; nextLabel?: string;
}) {
  const last = step === total - 1;
  return (
    <div className="flex items-center justify-between pt-5 mt-5 border-t border-border">
      <Button variant="outline" size="sm" onClick={onPrev} disabled={step === 0} className="gap-1.5">
        <ArrowLeft size={14} /> Back
      </Button>
      {last ? (
        <Button size="sm" onClick={onSubmit}
          className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600">
          <Check size={14} /> Submit
        </Button>
      ) : (
        <Button size="sm" onClick={onNext} className="gap-1.5">
          {nextLabel} <ArrowRight size={14} />
        </Button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WIZARD 1 — Horizontal (default)
// ─────────────────────────────────────────────────────────────────────────────
const STEPS_H = [
  { label: "Account", icon: User },
  { label: "Profile", icon: Contact },
  { label: "Address", icon: MapPin },
  { label: "Confirm", icon: CheckCircle },
];

function HorizontalWizard() {
  const [step, setStep] = useState(0);
  const [f, sf] = useState({
    email: "", user: "", pw: "", cpw: "",
    fn: "", ln: "", phone: "", bio: "",
    street: "", city: "", zip: "", country: "",
  });
  const u = (k: string, v: string) => sf(p => ({ ...p, [k]: v }));

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border pb-4">
        <CardTitle>Default horizontal wizard</CardTitle>
        <CardDescription>Linear step wizard with a horizontal progress indicator</CardDescription>
      </CardHeader>

      {/* Step bar */}
      <div className="flex items-start px-4 sm:px-8 py-5 border-b border-border bg-muted/40 overflow-x-auto">
        {STEPS_H.map((s, i) => {
          const done = i < step; const active = i === step;
          const Icon = s.icon;
          return (
            <div key={i} className="flex items-center flex-1 last:flex-none min-w-[80px]">
              <button
                onClick={() => done && setStep(i)}
                className="flex flex-col items-center gap-2"
                style={{ cursor: done ? "pointer" : "default" }}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200 font-bold shrink-0",
                  active ? "border-primary bg-primary text-white shadow-[0_0_0_4px_hsl(var(--primary)/0.15)]" :
                    done ? "border-primary bg-primary/10 text-primary" :
                      "border-border bg-background text-muted-foreground",
                )}>
                  {done ? <Check size={16} /> : <Icon size={17} />}
                </div>
                <span className={cn(
                  "text-xs font-semibold whitespace-nowrap",
                  active ? "text-primary" : done ? "text-primary" : "text-muted-foreground",
                )}>{s.label}</span>
              </button>
              {i < STEPS_H.length - 1 && (
                <div className={cn(
                  "flex-1 h-0.5 mx-2 sm:mx-3 mb-6 rounded-full transition-all duration-300",
                  done ? "bg-primary" : "bg-border",
                )} />
              )}
            </div>
          );
        })}
      </div>

      <CardContent className="pt-6 pb-6 max-w-lg mx-auto w-full">
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <Field label={<>Email address <Req /></>} hint="We'll never share your email.">
              <Input placeholder="john@example.com" value={f.email} onChange={e => u("email", e.target.value)} />
            </Field>
            <Field label={<>Username <Req /></>}>
              <Input placeholder="john_doe" value={f.user} onChange={e => u("user", e.target.value)} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label={<>Password <Req /></>}>
                <Input type="password" placeholder="Min 8 chars" value={f.pw} onChange={e => u("pw", e.target.value)} />
              </Field>
              <Field label={<>Confirm password <Req /></>}>
                <Input type="password" placeholder="Re-enter" value={f.cpw} onChange={e => u("cpw", e.target.value)} />
              </Field>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label={<>First name <Req /></>}>
                <Input placeholder="John" value={f.fn} onChange={e => u("fn", e.target.value)} />
              </Field>
              <Field label={<>Last name <Req /></>}>
                <Input placeholder="Doe" value={f.ln} onChange={e => u("ln", e.target.value)} />
              </Field>
            </div>
            <Field label={<>Phone number <Req /></>}>
              <Input placeholder="+1 (555) 000-0000" value={f.phone} onChange={e => u("phone", e.target.value)} />
            </Field>
            <Field label="Bio" hint="Brief description for your profile.">
              <textarea
                rows={3}
                placeholder="Tell us about yourself…"
                value={f.bio}
                onChange={e => u("bio", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm outline-none resize-none focus:ring-2 focus:ring-ring transition-all"
              />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <Field label={<>Street address <Req /></>}>
              <Input placeholder="123 Main St" value={f.street} onChange={e => u("street", e.target.value)} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label={<>City <Req /></>}>
                <Input placeholder="New York" value={f.city} onChange={e => u("city", e.target.value)} />
              </Field>
              <Field label={<>ZIP / Postcode <Req /></>}>
                <Input placeholder="10001" value={f.zip} onChange={e => u("zip", e.target.value)} />
              </Field>
            </div>
            <Field label="Country">
              <DropdownSelect
                value={f.country}
                onChange={v => u("country", v)}
                placeholder="Select country…"
                options={[
                  { value: "us", label: "United States" },
                  { value: "in", label: "India" },
                  { value: "gb", label: "United Kingdom" },
                  { value: "de", label: "Germany" },
                  { value: "fr", label: "France" },
                ]}
              />
            </Field>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/40 mb-1">
              <CheckCircle size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">All steps completed!</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-500">Please review your information before submitting.</p>
              </div>
            </div>
            {[
              ["Email", f.email],
              ["Username", f.user],
              ["Name", [f.fn, f.ln].filter(Boolean).join(" ")],
              ["Phone", f.phone],
              ["Address", [f.street, f.city, f.zip].filter(Boolean).join(", ")],
              ["Country", f.country],
            ].map(([l, v]) => <ReviewRow key={l} label={l} value={v} />)}
          </div>
        )}

        <NavButtons
          step={step} total={4}
          onPrev={() => setStep(s => Math.max(s - 1, 0))}
          onNext={() => setStep(s => s + 1)}
        />
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WIZARD 2 — Colored icon steps
// ─────────────────────────────────────────────────────────────────────────────
const STEPS_I = [
  { label: "Personal", icon: User, color: "#2563eb" },
  { label: "Company", icon: Building2, color: "#7c3aed" },
  { label: "Billing", icon: CreditCard, color: "#f59e0b" },
  { label: "Security", icon: Lock, color: "#10b981" },
];

function IconWizard() {
  const [step, setStep] = useState(0);
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const S = STEPS_I[step];
  const Icon = S.icon;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border pb-4">
        <CardTitle>Wizard with colored icons</CardTitle>
        <CardDescription>Each step has a unique color with animated progress bar</CardDescription>
      </CardHeader>

      {/* Step bubbles */}
      <div
        className="grid px-4 sm:px-8 py-5 border-b border-border bg-muted/40 overflow-x-auto"
        style={{ gridTemplateColumns: `repeat(${STEPS_I.length}, minmax(80px, 1fr))` }}
      >
        {STEPS_I.map((s, i) => {
          const done = i < step; const active = i === step;
          const SI = s.icon;
          return (
            <div key={i} className="flex flex-col items-center gap-2 relative">
              {/* left connector */}
              {i > 0 && (
                <div className="absolute left-0 right-1/2 top-5 h-0.5 -translate-y-1/2 transition-all duration-300"
                  style={{ background: i <= step ? STEPS_I[i - 1].color : "var(--border)" }} />
              )}
              {/* right connector */}
              {i < STEPS_I.length - 1 && (
                <div className="absolute left-1/2 right-0 top-5 h-0.5 -translate-y-1/2 transition-all duration-300"
                  style={{ background: done ? s.color : "var(--border)" }} />
              )}
              <button onClick={() => done && setStep(i)} style={{ cursor: done ? "pointer" : "default", zIndex: 1 }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200"
                  style={{
                    borderColor: active || done ? s.color : "var(--border)",
                    background: active ? s.color : done ? s.color + "20" : "var(--background)",
                    color: active ? "#fff" : done ? s.color : "var(--muted-foreground)",
                    boxShadow: active ? `0 0 0 4px ${s.color}25` : "none",
                  }}>
                  {done ? <Check size={16} /> : <SI size={17} />}
                </div>
              </button>
              <span className="text-xs font-semibold" style={{ color: active || done ? s.color : "var(--muted-foreground)" }}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Animated progress bar */}
      <div className="h-1 bg-muted">
        <div className="h-full transition-all duration-500 rounded-r-full"
          style={{ width: `${(step / (STEPS_I.length - 1)) * 100}%`, background: S.color }} />
      </div>

      <CardContent className="pt-6 pb-6 max-w-lg mx-auto w-full">
        {/* Step heading */}
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: S.color + "18" }}>
            <Icon size={20} style={{ color: S.color }} />
          </div>
          <div>
            <div className="font-bold text-sm">{S.label} Details</div>
            <div className="text-xs text-muted-foreground">Step {step + 1} of {STEPS_I.length}</div>
          </div>
          <span className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ background: S.color + "18", color: S.color }}>
            {Math.round(((step + 1) / STEPS_I.length) * 100)}% complete
          </span>
        </div>

        {step === 0 && (
          <div className="grid grid-cols-2 gap-4">
            <Field label="First name"><Input placeholder="John" /></Field>
            <Field label="Last name"><Input placeholder="Doe" /></Field>
            <Field label="Email"><Input placeholder="john@example.com" /></Field>
            <Field label="Phone"><Input placeholder="+1 555 000 0000" /></Field>
          </div>
        )}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <Field label="Company name"><Input placeholder="Acme Inc." /></Field>
            <Field label="Industry">
              <DropdownSelect
                value={industry} onChange={setIndustry} placeholder="Select industry…"
                options={["Technology", "Finance", "Healthcare", "Retail", "Education"].map(v => ({ value: v, label: v }))}
              />
            </Field>
            <Field label="Company size">
              <DropdownSelect
                value={companySize} onChange={setCompanySize} placeholder="Select size…"
                options={["1–10", "11–50", "51–200", "201–500", "500+"].map(v => ({ value: v, label: v }))}
              />
            </Field>
          </div>
        )}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <Field label="Card number"><Input placeholder="1234 5678 9012 3456" /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Expiry date"><Input placeholder="MM / YY" /></Field>
              <Field label="CVV"><Input placeholder="•••" /></Field>
            </div>
            <Field label="Cardholder name"><Input placeholder="John Doe" /></Field>
          </div>
        )}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <Field label="Current password"><Input type="password" placeholder="••••••••" /></Field>
            <Field label="New password"><Input type="password" placeholder="Min 8 characters" /></Field>
            <Field label="Confirm new password"><Input type="password" placeholder="Re-enter" /></Field>
          </div>
        )}

        <div className="flex items-center justify-between pt-5 mt-5 border-t border-border">
          <Button variant="outline" size="sm" onClick={() => setStep(s => Math.max(s - 1, 0))} disabled={step === 0} className="gap-1.5">
            <ArrowLeft size={14} /> Back
          </Button>
          {step < STEPS_I.length - 1 ? (
            <Button size="sm" onClick={() => setStep(s => s + 1)} className="gap-1.5"
              style={{ background: S.color, borderColor: S.color }}>
              Next <ArrowRight size={14} />
            </Button>
          ) : (
            <Button size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600">
              <Check size={14} /> Finish
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WIZARD 3 — Vertical sidebar
// ─────────────────────────────────────────────────────────────────────────────
const STEPS_V = [
  { label: "Account setup", desc: "Create your login credentials", icon: User },
  { label: "Business profile", desc: "Tell us about your organisation", icon: Briefcase },
  { label: "Preferences", desc: "Customise your experience", icon: Settings },
  { label: "Review & submit", desc: "Confirm everything looks right", icon: Sparkles },
];

function VerticalWizard() {
  const [step, setStep] = useState(0);
  const [prefs, setPrefs] = useState({ email: true, digest: false, dark: false });
  const [teamSize, setTeamSize] = useState("");

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border pb-4">
        <CardTitle>Vertical step wizard</CardTitle>
        <CardDescription>Sidebar navigation with step descriptions and progress connector</CardDescription>
      </CardHeader>

      <div className="flex flex-col md:flex-row" style={{ minHeight: 420 }}>
        {/* Sidebar */}
        <div className="w-full md:w-60 shrink-0 border-b md:border-b-0 md:border-r border-border bg-muted/40 py-3">
          {STEPS_V.map((s, i) => {
            const done = i < step; const active = i === step;
            const SI = s.icon;
            return (
              <div key={i} className="relative">
                {i > 0 && (
                  <div className="absolute left-[2.35rem] -top-3 w-0.5 h-3 transition-colors"
                    style={{ background: i <= step ? "hsl(var(--primary))" : "var(--border)" }} />
                )}
                <button
                  onClick={() => done && setStep(i)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-left border-l-[3px] transition-all",
                    active ? "bg-primary/10 border-l-primary" : "border-l-transparent hover:bg-muted",
                  )}
                  style={{ cursor: done ? "pointer" : "default" }}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 text-xs font-bold transition-all",
                    active ? "border-primary bg-primary text-white" :
                      done ? "border-primary bg-primary/10 text-primary" :
                        "border-border text-muted-foreground bg-background",
                  )}>
                    {done ? <Check size={13} /> : <SI size={14} />}
                  </div>
                  <div className="min-w-0">
                    <div className={cn(
                      "text-[13px] font-semibold truncate",
                      active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground",
                    )}>{s.label}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{s.desc}</div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col min-w-0">
          <h3 className="font-bold text-base mb-5">{STEPS_V[step].label}</h3>

          {step === 0 && (
            <div className="flex flex-col gap-4 flex-1">
              <Field label={<>Email address <Req /></>}><Input placeholder="you@company.com" /></Field>
              <Field label={<>Password <Req /></>}><Input type="password" placeholder="Min 8 characters" /></Field>
              <Field label={<>Confirm password <Req /></>}><Input type="password" placeholder="Re-enter password" /></Field>
            </div>
          )}
          {step === 1 && (
            <div className="flex flex-col gap-4 flex-1">
              <Field label="Company name"><Input placeholder="Acme Corp" /></Field>
              <Field label="Job title"><Input placeholder="e.g. Product Manager" /></Field>
              <Field label="Team size">
                <DropdownSelect
                  value={teamSize} onChange={setTeamSize} placeholder="Select size…"
                  options={["1–5", "6–20", "21–100", "101+"].map(v => ({ value: v, label: v }))}
                />
              </Field>
            </div>
          )}
          {step === 2 && (
            <div className="flex flex-col gap-3 flex-1">
              {([
                ["email", "Email notifications", "Receive updates about your account"],
                ["digest", "Weekly digest", "A weekly summary of activity"],
                ["dark", "Dark mode by default", "Always start in dark theme"],
              ] as [keyof typeof prefs, string, string][]).map(([key, label, desc]) => (
                <div key={key} className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-background hover:bg-muted/40 transition-colors">
                  <div>
                    <div className="text-sm font-semibold">{label}</div>
                    <div className="text-xs text-muted-foreground">{desc}</div>
                  </div>
                  <Switch
                    checked={prefs[key]}
                    onChange={() => setPrefs(p => ({ ...p, [key]: !p[key] }))}
                  />
                </div>
              ))}
            </div>
          )}
          {step === 3 && (
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/40">
                <CheckCircle size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Everything looks great!</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-500">Click Finish to complete your setup.</p>
                </div>
              </div>
            </div>
          )}

          <NavButtons
            step={step} total={STEPS_V.length}
            onPrev={() => setStep(s => Math.max(s - 1, 0))}
            onNext={() => setStep(s => s + 1)}
            nextLabel="Continue"
          />
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WIZARD 4 — Numbered minimal
// ─────────────────────────────────────────────────────────────────────────────
const STEPS_N = [
  { label: "Basic info" },
  { label: "Contact" },
  { label: "Complete" },
];

function NumberedWizard() {
  const [step, setStep] = useState(0);
  const pct = Math.round(((step + 1) / STEPS_N.length) * 100);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border pb-4">
        <CardTitle>Numbered step wizard</CardTitle>
        <CardDescription>Minimal numbered circles with an inline progress indicator</CardDescription>
      </CardHeader>

      {/* Steps + progress */}
      <div className="px-8 pt-5 pb-4 border-b border-border bg-muted/40">
        <div className="flex items-center mb-3">
          {STEPS_N.map((s, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <button
                onClick={() => i < step && setStep(i)}
                style={{ cursor: i < step ? "pointer" : "default" }}
              >
                <div className={cn(
                  "w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm font-extrabold transition-all duration-200",
                  i === step ? "border-primary bg-primary text-white shadow-[0_0_0_3px_hsl(var(--primary)/0.2)]" :
                    i < step ? "border-primary bg-primary/10 text-primary" :
                      "border-border bg-background text-muted-foreground",
                )}>
                  {i < step ? <Check size={14} /> : i + 1}
                </div>
              </button>
              {i < STEPS_N.length - 1 && (
                <div className={cn("flex-1 h-0.5 mx-3 rounded-full transition-all duration-300", i < step ? "bg-primary" : "bg-border")} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between px-0.5 mb-3">
          {STEPS_N.map((s, i) => (
            <span key={i} className={cn("text-xs font-semibold", i <= step ? "text-primary" : "text-muted-foreground")}>
              {s.label}
            </span>
          ))}
        </div>
        {/* Thin progress bar */}
        <div className="h-1 bg-border rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <div className="text-right text-xs text-muted-foreground mt-1">{pct}% complete</div>
      </div>

      <CardContent className="pt-6 pb-6 max-w-lg mx-auto w-full">
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <Field label={<>Full name <Req /></>}><Input placeholder="John Doe" /></Field>
            <Field label={<>Email address <Req /></>}><Input placeholder="john@example.com" /></Field>
          </div>
        )}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <Field label="Phone number"><Input placeholder="+1 (555) 000-0000" /></Field>
            <Field label="Address"><Input placeholder="123 Main St, New York" /></Field>
          </div>
        )}
        {step === 2 && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/40">
            <CheckCircle size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">All done!</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-500">Click Submit to complete your registration.</p>
            </div>
          </div>
        )}

        <NavButtons
          step={step} total={STEPS_N.length}
          onPrev={() => setStep(s => Math.max(s - 1, 0))}
          onNext={() => setStep(s => s + 1)}
        />
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function FormWizardPage() {
  return (
    <div className="flex flex-col gap-6">
      <HorizontalWizard />
      <IconWizard />
      <VerticalWizard />
      <NumberedWizard />
    </div>
  );
}
