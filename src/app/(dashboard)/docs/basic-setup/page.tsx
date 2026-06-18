import {
  Palette,
  LayoutDashboard,
  FilePlus2,
  Component,
  ShieldCheck,
  Moon,
  Server,
  CheckCircle2,
  Settings,
  BookOpen,
  Database,
  Globe,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-[13px] leading-relaxed text-slate-300 dark:bg-slate-950">
      <code>{children}</code>
    </pre>
  );
}

function InlineCode({ children }: { children: string }) {
  return (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px] font-semibold text-foreground">
      {children}
    </code>
  );
}

function SectionCard({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-[15px]">
          <span className="text-primary">{icon}</span>
          {title}
        </CardTitle>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
      <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-primary" />
      <span className="leading-relaxed text-foreground">{children}</span>
    </div>
  );
}

function FileLabel({ children }: { children: string }) {
  return (
    <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
      <span className="h-px flex-1 bg-border" />
      <span className="rounded bg-muted px-2 py-0.5 font-mono">{children}</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BasicSetupPage() {
  return (
    <div className="space-y-8">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 to-violet-500 p-8 text-white shadow-lg">
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-8 -right-4 h-32 w-32 rounded-full bg-white/5" />
        <div className="relative flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/20 backdrop-blur">
            <Settings size={24} />
          </div>
          <div>
            <div className="mb-1 text-xs font-bold uppercase tracking-widest text-white/70">
              Configuration
            </div>
            <h1 className="text-2xl font-extrabold">Basic Setup</h1>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-white/80">
              Learn how to configure your brand colors, navigation, pages, and data
              connections. Every section in this guide maps directly to a file in the
              project — making customisation fast and predictable.
            </p>
          </div>
        </div>
      </div>

      {/* ── 1. Brand Colors ───────────────────────────────────────────── */}
      <SectionCard
        icon={<Palette size={18} />}
        title="1 — Brand Colors"
        subtitle="Change the primary color (and all semantic colors) in one file. Every button, sidebar highlight, focus ring, and alert updates automatically."
      >
        <FileLabel>src/config/colors.ts</FileLabel>
        <CodeBlock>{`export const BRAND_COLORS = {
  // ↓ Change this hex value to rebrand the entire dashboard
  primary:           "#2563eb",   // Main brand color
  primaryDark:       "#3b82f6",   // Shown in dark mode

  // Semantic colors
  success:           "#10b981",
  warning:           "#f59e0b",
  danger:            "#ef4444",
  info:              "#06b6d4",
} as const;`}</CodeBlock>

        <Tip>
          After saving <InlineCode>colors.ts</InlineCode>, the dev server hot-reloads
          and every component using <InlineCode>bg-primary</InlineCode>,{" "}
          <InlineCode>text-success</InlineCode>, etc. updates instantly — no other
          file needs touching.
        </Tip>

        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Token</th>
                <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">CSS variable</th>
                <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Tailwind class prefix</th>
              </tr>
            </thead>
            <tbody>
              {[
                { token: "primary", css: "--primary", tw: "bg-primary / text-primary / border-primary" },
                { token: "success", css: "--success", tw: "bg-success / text-success / border-success" },
                { token: "warning", css: "--warning", tw: "bg-warning / text-warning / border-warning" },
                { token: "danger", css: "--destructive", tw: "bg-destructive / text-destructive" },
                { token: "info", css: "--info", tw: "bg-info / text-info / border-info" },
              ].map((row, i) => (
                <tr key={row.token} className={i % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                  <td className="px-4 py-2.5 font-mono text-[12px] font-bold text-primary">{row.token}</td>
                  <td className="px-4 py-2.5 font-mono text-[12px] text-muted-foreground">{row.css}</td>
                  <td className="px-4 py-2.5 font-mono text-[12px] text-muted-foreground">{row.tw}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* ── 2. Navigation ─────────────────────────────────────────────── */}
      <SectionCard
        icon={<LayoutDashboard size={18} />}
        title="2 — Navigation Setup"
        subtitle="The entire sidebar is driven by the NAV array in nav.ts. Add, remove, or reorder items here."
      >
        <FileLabel>src/config/nav.ts</FileLabel>

        <p className="text-sm text-muted-foreground">
          There are three types of entries in the <InlineCode>NAV</InlineCode> array:
        </p>

        <div className="space-y-3">
          {[
            {
              type: "Section header",
              desc: "Renders a label separator in the sidebar.",
              example: `{ sec: "My Section" }`,
            },
            {
              type: "Single link",
              desc: "A direct navigation link with an icon.",
              example: `{ id: "dashboard", path: "/", label: "Dashboard", icon: LayoutDashboard }`,
            },
            {
              type: "Dropdown group",
              desc: "A collapsible group of child links.",
              example: `{
  id: "reports-g",
  label: "Reports",
  icon: BarChart3,
  children: [
    { id: "sales",    path: "/reports/sales",    label: "Sales" },
    { id: "traffic",  path: "/reports/traffic",  label: "Traffic" },
  ],
}`,
            },
          ].map((item) => (
            <div key={item.type} className="rounded-xl border border-border overflow-hidden">
              <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-2.5">
                <ArrowRight size={13} className="text-primary" />
                <span className="text-xs font-bold">{item.type}</span>
                <span className="text-xs text-muted-foreground">— {item.desc}</span>
              </div>
              <CodeBlock>{item.example}</CodeBlock>
            </div>
          ))}
        </div>

        <Tip>
          Page titles and breadcrumb groups are auto-generated from the NAV array by
          <InlineCode>buildNavMeta()</InlineCode> — you never need to maintain a
          separate title map.
        </Tip>
      </SectionCard>

      {/* ── 3. Adding pages ───────────────────────────────────────────── */}
      <SectionCard
        icon={<FilePlus2 size={18} />}
        title="3 — Adding New Pages"
        subtitle="Nexora AI uses Next.js App Router. Every folder under (dashboard) becomes a route automatically."
      >
        <p className="text-sm text-muted-foreground">
          To add a new page at <InlineCode>/reports/monthly</InlineCode>:
        </p>

        <div className="space-y-3">
          <div>
            <p className="mb-1.5 text-xs font-bold text-muted-foreground">
              Step 1 — Create the page file
            </p>
            <CodeBlock>{`// src/app/(dashboard)/reports/monthly/page.tsx

import { PlaceholderPage } from "@/components/common/placeholder";

export default function MonthlyReportPage() {
  return <PlaceholderPage title="Monthly Report" />;
}`}</CodeBlock>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-bold text-muted-foreground">
              Step 2 — Add it to the sidebar (nav.ts)
            </p>
            <CodeBlock>{`{
  id: "reports-g",
  label: "Reports",
  icon: BarChart3,
  children: [
    { id: "monthly", path: "/reports/monthly", label: "Monthly Report" },
  ],
}`}</CodeBlock>
          </div>
        </div>

        <Tip>
          All pages inside <InlineCode>(dashboard)/</InlineCode> automatically inherit
          the sidebar + topbar shell layout. Pages inside <InlineCode>(auth)/</InlineCode>{" "}
          get the split-screen auth layout instead.
        </Tip>
      </SectionCard>

      {/* ── 4. UI Components ──────────────────────────────────────────── */}
      <SectionCard
        icon={<Component size={18} />}
        title="4 — Using UI Components"
        subtitle="All reusable components are exported from the ui/ barrel. Import them in any page."
      >
        <p className="text-sm text-muted-foreground">
          Common components and their import paths:
        </p>

        <CodeBlock>{`// Primitive UI components
import { Button }  from "@/components/ui/button";
import { Alert, AlertIcon, AlertContent } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input }   from "@/components/ui/input";
import { Badge }   from "@/components/ui/badge";

// Usage examples
<Button variant="default">Save</Button>
<Button variant="success">Confirm</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline" size="sm">Cancel</Button>

<Alert variant="success">
  <AlertIcon><CheckCircle2 size={16} /></AlertIcon>
  <AlertContent>Changes saved successfully.</AlertContent>
</Alert>`}</CodeBlock>

        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { name: "Button", variants: "default · destructive · success · warning · info · outline · ghost · link · light" },
            { name: "Alert", variants: "primary · success · danger · warning · info · dark  ×  default / outline / solid styles" },
            { name: "Card", variants: "CardHeader · CardTitle · CardContent · CardDescription · CardFooter" },
            { name: "Input / Textarea", variants: "Controlled via React state. Pair with Label for accessible forms." },
          ].map((c) => (
            <div key={c.name} className="rounded-xl border border-border p-4">
              <div className="mb-1 font-mono text-sm font-bold text-primary">
                {c.name}
              </div>
              <div className="text-xs leading-relaxed text-muted-foreground">
                {c.variants}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ── 5. Data & API ─────────────────────────────────────────────── */}
      <SectionCard
        icon={<Database size={18} />}
        title="5 — Connecting Your Data"
        subtitle="Nexora AI ships as a UI shell. Here's how to wire it to your API or database."
      >
        <div className="space-y-4">
          <div>
            <p className="mb-1.5 text-xs font-bold text-muted-foreground">
              Server component — fetch on the server (recommended)
            </p>
            <CodeBlock>{`// src/app/(dashboard)/users/page.tsx
// No "use client" needed — runs on the server

async function getUsers() {
  const res = await fetch("https://api.example.com/users", {
    next: { revalidate: 60 },   // ISR: revalidate every 60 s
  });
  return res.json();
}

export default async function UsersPage() {
  const users = await getUsers();
  return (
    <div>
      {users.map((u) => <div key={u.id}>{u.name}</div>)}
    </div>
  );
}`}</CodeBlock>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-bold text-muted-foreground">
              Client component — fetch with useState + useEffect
            </p>
            <CodeBlock>{`"use client";

import { useState, useEffect } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then(setOrders);
  }, []);

  return <div>{/* render orders */}</div>;
}`}</CodeBlock>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-bold text-muted-foreground">
              API routes — add backend logic inside Next.js
            </p>
            <CodeBlock>{`// src/app/api/users/route.ts

import { NextResponse } from "next/server";

export async function GET() {
  // Connect to your DB here (Prisma, Drizzle, Supabase…)
  const users = await db.user.findMany();
  return NextResponse.json(users);
}`}</CodeBlock>
          </div>
        </div>

        <Tip>
          For real-time data, consider pairing Nexora AI with{" "}
          <strong>Supabase</strong> (Postgres + auth + realtime) or{" "}
          <strong>PlanetScale</strong> (serverless MySQL). Both integrate cleanly with
          Next.js server components.
        </Tip>
      </SectionCard>

      {/* ── 6. Auth Pages ─────────────────────────────────────────────── */}
      <SectionCard
        icon={<ShieldCheck size={18} />}
        title="6 — Authentication Pages"
        subtitle="Pre-built auth pages live under the (auth) route group and are completely separate from the dashboard shell."
      >
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Page</th>
                <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Route</th>
                <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">File</th>
              </tr>
            </thead>
            <tbody>
              {[
                { page: "Login", route: "/auth/login", file: "auth/login/page.tsx" },
                { page: "Register", route: "/auth/register", file: "auth/register/page.tsx" },
                { page: "Forgot Password", route: "/auth/forgot-password", file: "auth/forgot-password/page.tsx" },
                { page: "Reset Password", route: "/auth/reset-password", file: "auth/reset-password/page.tsx" },
                // { page: "Two-Factor Auth", route: "/auth/two-factor",     file: "auth/two-factor/page.tsx" },
              ].map((row, i) => (
                <tr key={row.route} className={i % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                  <td className="px-4 py-2.5 font-semibold">{row.page}</td>
                  <td className="px-4 py-2.5 font-mono text-[12px] text-primary">{row.route}</td>
                  <td className="px-4 py-2.5 font-mono text-[12px] text-muted-foreground">{row.file}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Tip>
          Connect real auth by replacing the simulated{" "}
          <InlineCode>setTimeout</InlineCode> calls in each page with calls to your
          auth provider (NextAuth.js, Clerk, Supabase Auth, or a custom JWT endpoint).
        </Tip>
      </SectionCard>

      {/* ── 7. Dark mode ──────────────────────────────────────────────── */}
      <SectionCard
        icon={<Moon size={18} />}
        title="7 — Dark Mode"
        subtitle="Dark mode is handled by the ThemeProvider and toggled via the topbar button."
      >
        <p className="text-sm text-muted-foreground">
          The theme is stored in <InlineCode>localStorage</InlineCode> and applied as a{" "}
          <InlineCode>.dark</InlineCode> class on the <InlineCode>{"<html>"}</InlineCode>{" "}
          element. All CSS variables have dark-mode overrides defined in{" "}
          <InlineCode>globals.css</InlineCode> and <InlineCode>colors.ts</InlineCode>.
        </p>
        <CodeBlock>{`// src/components/providers/theme-provider.tsx
// Wraps next-themes — no additional setup needed.

// To read the current theme in a component:
import { useTheme } from "next-themes";

const { theme, setTheme } = useTheme();
setTheme("dark");   // "light" | "dark" | "system"`}</CodeBlock>
        <Tip>
          To add a dark-mode override for a custom color, add a value inside the{" "}
          <InlineCode>.dark</InlineCode> block in <InlineCode>globals.css</InlineCode>{" "}
          or extend <InlineCode>generateBrandCssVars()</InlineCode> in{" "}
          <InlineCode>colors.ts</InlineCode>.
        </Tip>
      </SectionCard>

      {/* ── 8. Deployment checklist ───────────────────────────────────── */}
      <SectionCard
        icon={<Globe size={18} />}
        title="8 — Deployment Checklist"
        subtitle="Before going live, verify each of these items."
      >
        <div className="space-y-2">
          {[
            "All .env.local variables are added to your hosting provider's environment settings",
            "Run npm run build locally first to catch TypeScript and lint errors",
            "Replace simulated auth (setTimeout) with a real auth provider",
            "Replace placeholder API calls with production endpoints",
            "Set NEXT_PUBLIC_API_URL (or equivalent) in your environment",
            "Configure CORS on your backend to allow requests from the production domain",
            "Review Next.js caching strategy (revalidate, cache: 'no-store') on all fetch calls",
            "Enable HTTPS — required for cookies and secure auth flows",
          ].map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm"
            >
              <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-success" />
              <span className="text-foreground">{item}</span>
            </div>
          ))}
        </div>
      </SectionCard>

    </div>
  );
}
