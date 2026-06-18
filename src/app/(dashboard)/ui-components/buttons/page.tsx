"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  Download,
  Upload,
  Settings,
  Share2,
  Send,
  Heart,
  Briefcase,
  Check,
  X,
  Bookmark,
  ChevronRight,
  Home,
  Bell,
  Mail,
  Bold,
  Italic,
  Underline,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ─── Shared helpers ──────────────────────────────────────────────────────────

function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[11.5px] font-semibold text-primary">
      {children}
    </code>
  );
}

function SectionCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-[15px]">{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}

// ─── Social brand icon ────────────────────────────────────────────────────────

function GitHubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ButtonsPage() {
  const [loadingPrimary, setLoadingPrimary] = useState(false);

  async function handleClickToLoad() {
    setLoadingPrimary(true);
    await new Promise((r) => setTimeout(r, 2000));
    setLoadingPrimary(false);
  }

  return (
    <div className="space-y-6">
      {/* ── 1. Solid Buttons ──────────────────────────────────────────── */}
      <SectionCard
        title="Solid Buttons"
        description={
          <>
            Use the <Code>variant</Code> prop with a colour modifier:{" "}
            <Code>default</Code>, <Code>success</Code>, <Code>destructive</Code>,{" "}
            <Code>warning</Code>, <Code>info</Code>, <Code>light</Code>.
          </>
        }
      >
        <div className="flex flex-wrap gap-2.5">
          <Button variant="default">Primary</Button>
          <Button variant="success">Success</Button>
          <Button variant="destructive">Danger</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="info">Info</Button>
          <Button variant="light">Light</Button>
        </div>
      </SectionCard>

      {/* ── 2. Outline Buttons ────────────────────────────────────────── */}
      <SectionCard
        title="Outline Buttons"
        description={
          <>
            Use <Code>outline-*</Code> variants for a lighter appearance with
            coloured borders.
          </>
        }
      >
        <div className="flex flex-wrap gap-2.5">
          <Button variant="outline-primary">Primary</Button>
          <Button variant="outline-success">Success</Button>
          <Button variant="outline-danger">Danger</Button>
          <Button variant="outline-warning">Warning</Button>
          <Button variant="outline-info">Info</Button>
        </div>
      </SectionCard>

      {/* ── 3. Button Sizes ───────────────────────────────────────────── */}
      <SectionCard
        title="Button Sizes"
        description={
          <>
            Add <Code>size="sm"</Code> or <Code>size="lg"</Code> for different
            sizes.
          </>
        }
      >
        <div className="flex flex-wrap items-center gap-2.5">
          <Button size="sm">Small Button</Button>
          <Button size="default">Default Button</Button>
          <Button size="lg">Large Button</Button>
        </div>
      </SectionCard>

      {/* ── 4. Icon Only  |  Icon + Text ──────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <SectionCard
          title="Icon Only Buttons"
          description={
            <>
              Square icon buttons using <Code>size="icon"</Code>.
            </>
          }
        >
          <div className="flex flex-wrap gap-2.5">
            <Button size="icon" variant="default" aria-label="Add">
              <Plus />
            </Button>
            <Button size="icon" variant="destructive" aria-label="Delete">
              <Trash2 />
            </Button>
            <Button size="icon" variant="success" aria-label="Edit">
              <Pencil />
            </Button>
            <Button size="icon" variant="warning" aria-label="Download">
              <Download />
            </Button>
            <Button size="icon" variant="info" aria-label="Upload">
              <Upload />
            </Button>
            <Button size="icon" variant="light" aria-label="Settings">
              <Settings />
            </Button>
          </div>
        </SectionCard>

        <SectionCard
          title="Icon + Text Buttons"
          description="Combine icons with text labels for clear call-to-actions."
        >
          <div className="flex flex-wrap gap-2.5">
            <Button variant="default">
              <Plus />
              Add Item
            </Button>
            <Button variant="destructive">
              <Trash2 />
              Delete
            </Button>
            <Button variant="success">
              <Download />
              Download
            </Button>
            <Button variant="info">
              <Share2 />
              Share
            </Button>
          </div>
        </SectionCard>
      </div>

      {/* ── 5. Button Groups ──────────────────────────────────────────── */}
      <SectionCard
        title="Button Groups"
        description="Group related buttons together for a unified control set."
      >
        <div className="flex flex-wrap items-center gap-4">
          {/* Solid group */}
          <div className="inline-flex">
            <Button className="rounded-r-none focus-visible:z-10">Left</Button>
            <Button className="rounded-none border-l border-primary-foreground/20 focus-visible:z-10">
              Middle
            </Button>
            <Button className="rounded-l-none border-l border-primary-foreground/20 focus-visible:z-10">
              Right
            </Button>
          </div>

          {/* Outline format group */}
          <div className="inline-flex">
            <Button
              variant="outline"
              size="icon"
              aria-label="Bold"
              className="rounded-r-none focus-visible:z-10"
            >
              <Bold />
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Italic"
              className="rounded-none border-l-0 focus-visible:z-10"
            >
              <Italic />
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Underline"
              className="rounded-l-none border-l-0 focus-visible:z-10"
            >
              <Underline />
            </Button>
          </div>

          {/* Outline icon group */}
          <div className="inline-flex">
            <Button
              variant="outline"
              size="icon"
              aria-label="Home"
              className="rounded-r-none focus-visible:z-10"
            >
              <Home />
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Notifications"
              className="rounded-none border-l-0 focus-visible:z-10"
            >
              <Bell />
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Mail"
              className="rounded-l-none border-l-0 focus-visible:z-10"
            >
              <Mail />
            </Button>
          </div>
        </div>
      </SectionCard>

      {/* ── 6. Loading  |  Block Full Width ───────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <SectionCard
          title="Loading / Spinner Button"
          description="Show a loading state with a spinner animation."
        >
          <div className="flex flex-wrap gap-2.5">
            <Button onClick={handleClickToLoad} disabled={loadingPrimary}>
              <RefreshCw
                className={cn("transition-transform", loadingPrimary && "animate-spin")}
              />
              {loadingPrimary ? "Loading..." : "Click to Load"}
            </Button>
            <Button variant="success" className="pointer-events-none">
              <Loader2 className="animate-spin" />
              Saving...
            </Button>
            <Button variant="destructive" className="pointer-events-none">
              <Loader2 className="animate-spin" />
              Deleting...
            </Button>
          </div>
        </SectionCard>

        <SectionCard
          title="Block (Full Width) Buttons"
          description="Full-width buttons that span the container."
        >
          <div className="flex flex-col gap-2.5">
            <Button className="w-full">Block Primary Button</Button>
            <Button variant="success" className="w-full">
              Block Success Button
            </Button>
            <Button variant="outline-primary" className="w-full">
              Block Outline Button
            </Button>
          </div>
        </SectionCard>
      </div>

      {/* ── 7. Rounded Pill Buttons ───────────────────────────────────── */}
      <SectionCard
        title="Rounded Pill Buttons"
        description={
          <>
            Fully rounded buttons — add <Code>className="rounded-full"</Code> to
            any variant.
          </>
        }
      >
        <div className="flex flex-wrap gap-2.5">
          <Button className="rounded-full">Primary</Button>
          <Button variant="success" className="rounded-full">
            Success
          </Button>
          <Button variant="destructive" className="rounded-full">
            Danger
          </Button>
          <Button variant="warning" className="rounded-full">
            Warning
          </Button>
          <Button variant="info" className="rounded-full">
            Info
          </Button>
          <Button variant="outline" className="rounded-full">
            <Heart size={14} />
            Favorite
          </Button>
        </div>
      </SectionCard>

      {/* ── 8. Social / Styled Buttons ────────────────────────────────── */}
      <SectionCard
        title="Social / Styled Buttons"
        description="Custom-styled buttons for social actions and branded interactions."
      >
        <div className="space-y-2.5">
          {/* Brand buttons */}
          <div className="flex flex-wrap gap-2.5">
            <Button
              className="rounded-full bg-[#1877F2] text-white shadow-sm hover:bg-[#1877F2]/90"
              aria-label="Facebook"
            >
              <Share2 size={14} />
              Facebook
            </Button>
            <Button
              className="rounded-full bg-[#1DA1F2] text-white shadow-sm hover:bg-[#1DA1F2]/90"
              aria-label="Twitter"
            >
              <Send size={14} />
              Twitter
            </Button>
            <Button
              className="rounded-full bg-[#E1306C] text-white shadow-sm hover:bg-[#E1306C]/90"
              aria-label="Instagram"
            >
              <Heart size={14} />
              Instagram
            </Button>
            <Button
              className="rounded-full bg-[#0A66C2] text-white shadow-sm hover:bg-[#0A66C2]/90"
              aria-label="LinkedIn"
            >
              <Briefcase size={14} />
              LinkedIn
            </Button>
            <Button
              className="rounded-full bg-[#24292e] text-white shadow-sm hover:bg-[#24292e]/90"
              aria-label="GitHub"
            >
              <GitHubIcon />
              GitHub
            </Button>
          </div>

          {/* Action pills */}
          <div className="flex flex-wrap gap-2.5">
            <Button variant="success" className="rounded-full">
              <Check size={14} />
              Accept
            </Button>
            <Button variant="destructive" className="rounded-full">
              <X size={14} />
              Reject
            </Button>
            <Button variant="warning" className="rounded-full">
              <Bookmark size={14} />
              Bookmark
            </Button>
            <Button variant="info" className="rounded-full">
              <Send size={14} />
              Send
            </Button>
            <Button className="rounded-full">
              <Plus size={14} />
              Follow
            </Button>
            <Button variant="outline" className="rounded-full">
              Next
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      </SectionCard>

      {/* ── 9. Disabled Buttons ───────────────────────────────────────── */}
      <SectionCard
        title="Disabled Buttons"
        description="Disabled buttons prevent user interaction and indicate unavailable actions."
      >
        <div className="flex flex-wrap gap-2.5">
          <Button disabled>Primary</Button>
          <Button variant="success" disabled>
            Success
          </Button>
          <Button variant="destructive" disabled>
            Danger
          </Button>
          <Button variant="outline-primary" disabled>
            Outline
          </Button>
          <Button variant="light" disabled>
            Light
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}
