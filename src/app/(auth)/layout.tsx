import type { ReactNode } from "react";
import { Sparkles, CheckCircle2, ShieldCheck, BarChart3, Users } from "lucide-react";

const FEATURES = [
  { icon: ShieldCheck, text: "Role-based access control & audit logs" },
  { icon: BarChart3, text: "Real-time analytics and reporting" },
  { icon: Users, text: "Multi-tenant workspace management" },
  { icon: CheckCircle2, text: "Enterprise-grade security & compliance" },
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* ── Left branding panel (desktop only) ── */}
      <div className="relative hidden w-[460px] shrink-0 flex-col justify-between overflow-hidden bg-gradient-to-b from-[#0c2444] via-[#091a33] to-[#071427] p-10 lg:flex">
        {/* Decorative rings */}
        <div className="pointer-events-none absolute -right-40 top-1/2 h-[640px] w-[640px] -translate-y-1/2 rounded-full border border-white/[0.06]" />
        <div className="pointer-events-none absolute -right-24 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full border border-white/[0.06]" />
        <div className="pointer-events-none absolute -right-10 top-1/2 h-[200px] w-[200px] -translate-y-1/2 rounded-full border border-white/[0.06]" />
        {/* Radial glow */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-primary/15 to-transparent" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[11px] bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg shadow-primary/30">
            <Sparkles size={20} />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">
            Nexora<span className="text-primary"> AI</span>
          </span>
        </div>

        {/* Quote */}
        <div className="relative space-y-4">
          <div className="text-4xl font-black leading-none text-primary/30 select-none">"</div>
          <blockquote className="text-[1.35rem] font-bold leading-snug text-white">
            The admin panel that scales with your product. Built for teams that ship fast.
          </blockquote>
          <p className="text-sm text-[#6f82a0]">Trusted by 5,000+ engineering teams worldwide</p>
        </div>

        {/* Feature list */}
        <ul className="relative space-y-3.5">
          {FEATURES.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-sm text-[#aebfd6]">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/20 text-primary">
                <Icon size={14} />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Right form panel ── */}
      <main className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-12">
        {/* Mobile logo (hidden on desktop) */}
        <div className="mb-8 flex items-center gap-2.5 lg:hidden">
          <div className="grid h-8 w-8 place-items-center rounded-[10px] bg-gradient-to-br from-primary to-primary/80 text-white shadow-md shadow-primary/30">
            <Sparkles size={17} />
          </div>
          <span className="text-lg font-extrabold tracking-tight">
            Nexora<span className="text-primary"> AI</span>
          </span>
        </div>

        {children}
      </main>
    </div>
  );
}
