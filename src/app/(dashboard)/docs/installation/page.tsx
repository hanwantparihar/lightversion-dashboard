import {
  CheckCircle2,
  Terminal,
  FolderOpen,
  Cpu,
  Rocket,
  GitBranch,
  Package,
  Play,
  Box,
  FileCode2,
  Globe,
  Layers,
  Zap,
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

function Step({
  number,
  title,
  description,
  children,
}: {
  number: number;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-md">
          {number}
        </div>
        <div className="mt-2 w-px flex-1 bg-border" />
      </div>
      <div className="pb-8 pt-1 min-w-0 flex-1">
        <h3 className="mb-1 text-base font-bold">{title}</h3>
        {description && (
          <p className="mb-3 text-sm text-muted-foreground">{description}</p>
        )}
        {children}
      </div>
    </div>
  );
}

function Badge({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
      {children}
    </span>
  );
}

function InlineCode({ children }: { children: string }) {
  return (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px] font-semibold text-foreground">
      {children}
    </code>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InstallationGuidePage() {
  return (
    <div className="space-y-8">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/70 p-8 text-white shadow-lg">
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-8 -right-4 h-32 w-32 rounded-full bg-white/5" />
        <div className="relative flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/20 backdrop-blur">
            <Rocket size={24} />
          </div>
          <div>
            <div className="mb-1 text-xs font-bold uppercase tracking-widest text-white/70">
              Getting Started
            </div>
            <h1 className="text-2xl font-extrabold">Installation Guide</h1>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-white/80">
              Follow these steps to set up Nexora AI on your local machine. From cloning the
              repository to launching your first development server — you'll be up and
              running in under five minutes.
            </p>
          </div>
        </div>
      </div>

      {/* ── Prerequisites ────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-[15px]">
            <Cpu size={18} className="text-primary" />
            Prerequisites
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Make sure the following tools are installed on your machine before proceeding.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                name: "Node.js",
                version: "v18 or higher",
                note: "LTS recommended",
                icon: <Zap size={18} />,
              },
              {
                name: "npm / pnpm / yarn",
                version: "Any package manager",
                note: "npm is included with Node.js",
                icon: <Package size={18} />,
              },
              {
                name: "Git",
                version: "v2 or higher",
                note: "For cloning the repository",
                icon: <GitBranch size={18} />,
              },
            ].map((req) => (
              <div
                key={req.name}
                className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-4"
              >
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  {req.icon}
                </span>
                <div>
                  <div className="text-sm font-bold">{req.name}</div>
                  <div className="text-xs font-semibold text-primary">
                    {req.version}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {req.note}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Step-by-step ─────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-[15px]">
            <Terminal size={18} className="text-primary" />
            Installation Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mt-2">

            <Step
              number={1}
              title="Clone the repository"
              description="Download the Nexora AI source code to your local machine using Git."
            >
              <CodeBlock>{`git clone https://github.com/your-org/nexora-ai.git
cd nexora-ai`}</CodeBlock>
            </Step>

            <Step
              number={2}
              title="Install dependencies"
              description="Install all required npm packages. Choose your preferred package manager."
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                  Using npm
                </div>
                <CodeBlock>{`npm install`}</CodeBlock>
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                  Or using pnpm (recommended — faster installs)
                </div>
                <CodeBlock>{`pnpm install`}</CodeBlock>
              </div>
            </Step>

            <Step
              number={3}
              title="Set up environment variables"
              description="Create a local environment file from the provided example template."
            >
              <CodeBlock>{`cp .env.example .env.local`}</CodeBlock>
              <p className="mt-3 text-sm text-muted-foreground">
                Open <InlineCode>.env.local</InlineCode> and fill in the required values.
                See the{" "}
                <span className="font-semibold text-primary">Environment Variables</span>{" "}
                section below for a full reference.
              </p>
            </Step>

            <Step
              number={4}
              title="Start the development server"
              description="Launch Next.js in development mode with hot-reloading enabled."
            >
              <CodeBlock>{`npm run dev
# or
pnpm dev`}</CodeBlock>
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-success/30 bg-success/5 px-4 py-3 text-sm font-semibold text-success">
                <CheckCircle2 size={16} className="shrink-0" />
                Open{" "}
                <span className="font-mono text-xs font-bold">
                  http://localhost:3000
                </span>{" "}
                in your browser — the dashboard is live.
              </div>
            </Step>

            <Step
              number={5}
              title="Build for production"
              description="When you're ready to deploy, create an optimised production build."
            >
              <CodeBlock>{`npm run build
npm run start`}</CodeBlock>
            </Step>

          </div>
        </CardContent>
      </Card>

      {/* ── Project structure ─────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-[15px]">
            <FolderOpen size={18} className="text-primary" />
            Project Structure
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Key directories and their purpose inside the Nexora AI codebase.
          </p>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-lg bg-slate-900 p-5 text-[12.5px] leading-7 text-slate-300 dark:bg-slate-950">
{`nexora-ai/
├── src/
│   ├── app/
│   │   ├── (auth)/               # Auth layout + pages (login, register…)
│   │   │   ├── layout.tsx        # Split-screen auth layout
│   │   │   └── auth/             # /auth/login  /auth/register …
│   │   └── (dashboard)/          # Main app layout + all dashboard pages
│   │       ├── layout.tsx        # Shell with sidebar + topbar
│   │       └── page.tsx          # Dashboard home  →  /
│   │
│   ├── components/
│   │   ├── ui/                   # Reusable primitives (Button, Alert, Card…)
│   │   ├── layout/               # Sidebar, Topbar
│   │   ├── common/               # Shared page helpers (Placeholder…)
│   │   └── providers/            # ThemeProvider, context wrappers
│   │
│   ├── config/
│   │   ├── colors.ts             # ← Brand colors — change primary here
│   │   ├── nav.ts                # ← Sidebar navigation tree
│   │   └── site.ts               # Site name, description, links
│   │
│   └── lib/
│       └── utils.ts              # Tailwind cn() helper
│
├── tailwind.config.ts            # Tailwind + CSS variable token mapping
├── globals.css                   # CSS custom properties (neutral tokens)
└── .env.local                    # Environment variables (local only)`}
          </pre>
        </CardContent>
      </Card>

      {/* ── Available scripts ─────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-[15px]">
            <Play size={18} className="text-primary" />
            Available Scripts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Script
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { cmd: "npm run dev", desc: "Start development server at localhost:3000 with hot-reload" },
                  { cmd: "npm run build", desc: "Create an optimised production build in .next/" },
                  { cmd: "npm run start", desc: "Serve the production build locally" },
                  { cmd: "npm run lint", desc: "Run ESLint across the entire codebase" },
                  { cmd: "npm run type-check", desc: "Run TypeScript compiler without emitting files" },
                ].map((row, i) => (
                  <tr
                    key={row.cmd}
                    className={i % 2 === 0 ? "bg-background" : "bg-muted/30"}
                  >
                    <td className="px-4 py-3 font-mono text-[12px] font-bold text-primary">
                      {row.cmd}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── Tech stack ────────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-[15px]">
            <Box size={18} className="text-primary" />
            Tech Stack
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Core technologies powering Nexora AI.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                name: "Next.js 14",
                role: "Framework",
                desc: "App Router, server components, file-based routing",
                color: "bg-slate-800 text-white",
              },
              {
                name: "TypeScript",
                role: "Language",
                desc: "Strict typing across all components and utilities",
                color: "bg-blue-600 text-white",
              },
              {
                name: "Tailwind CSS v3",
                role: "Styling",
                desc: "Utility-first CSS with CSS variable token system",
                color: "bg-cyan-500 text-white",
              },
              {
                name: "shadcn/ui",
                role: "Component base",
                desc: "Accessible primitives with Radix UI under the hood",
                color: "bg-violet-600 text-white",
              },
              {
                name: "lucide-react",
                role: "Icons",
                desc: "600+ consistent, tree-shakeable SVG icons",
                color: "bg-orange-500 text-white",
              },
              {
                name: "class-variance-authority",
                role: "Variant system",
                desc: "Type-safe component variants (buttons, alerts…)",
                color: "bg-emerald-600 text-white",
              },
            ].map((tech) => (
              <div
                key={tech.name}
                className="flex items-start gap-3 rounded-xl border border-border p-4"
              >
                <span
                  className={`shrink-0 rounded-lg px-2 py-1 text-[11px] font-extrabold ${tech.color}`}
                >
                  {tech.role}
                </span>
                <div>
                  <div className="text-sm font-bold">{tech.name}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {tech.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Next steps ────────────────────────────────────────────────── */}
      <Card className="border-primary/20 bg-primary/[0.03]">
        <CardContent className="flex items-start gap-4 pt-6">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
            <Layers size={20} />
          </div>
          <div>
            <h3 className="font-bold">What's next?</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Now that Nexora AI is running, head over to the{" "}
              <span className="font-semibold text-primary">Basic Setup</span>{" "}
              guide to learn how to configure your brand colors, add navigation
              items, create new pages, and wire up your data.
            </p>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
