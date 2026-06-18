"use client";

import { useEffect, useState, type RefObject } from "react";
import Link from "next/link";
import {
  UserPlus,
  ShoppingCart,
  CreditCard,
  AlertTriangle,
  MessageSquare,
  Server,
  CheckCheck,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type NotifType = "user" | "order" | "payment" | "warning" | "message" | "system";

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const INITIAL: Notification[] = [
  {
    id: "n1",
    type: "user",
    title: "New user registered",
    message: "Sarah Johnson signed up and is awaiting role assignment.",
    time: "2 min ago",
    read: false,
  },
  {
    id: "n2",
    type: "order",
    title: "New order received",
    message: "Order #ORD-4821 placed for $349.00 — pending fulfilment.",
    time: "14 min ago",
    read: false,
  },
  {
    id: "n3",
    type: "payment",
    title: "Payment successful",
    message: "Invoice #INV-2047 paid in full. Amount: $1,200.00.",
    time: "1 hr ago",
    read: false,
  },
  {
    id: "n4",
    type: "warning",
    title: "Storage limit approaching",
    message: "You have used 87% of your allocated storage quota.",
    time: "3 hr ago",
    read: true,
  },
  {
    id: "n5",
    type: "message",
    title: "New comment from Alex",
    message: "Alex left a comment on the Q4 analytics report.",
    time: "5 hr ago",
    read: true,
  },
  {
    id: "n6",
    type: "system",
    title: "System update completed",
    message: "Nexora AI has been updated to v2.5.0 with performance improvements.",
    time: "Yesterday",
    read: true,
  },
];

// ─── Icon map ─────────────────────────────────────────────────────────────────

const ICON_CONFIG: Record<
  NotifType,
  { icon: React.ReactNode; bg: string; text: string }
> = {
  user:    { icon: <UserPlus size={15} />,     bg: "bg-primary/10",      text: "text-primary" },
  order:   { icon: <ShoppingCart size={15} />, bg: "bg-violet-500/10",   text: "text-violet-500" },
  payment: { icon: <CreditCard size={15} />,   bg: "bg-success/10",      text: "text-success" },
  warning: { icon: <AlertTriangle size={15} />,bg: "bg-warning/10",      text: "text-warning" },
  message: { icon: <MessageSquare size={15} />,bg: "bg-cyan-500/10",     text: "text-cyan-500" },
  system:  { icon: <Server size={15} />,       bg: "bg-muted",           text: "text-muted-foreground" },
};

// ─── Component ────────────────────────────────────────────────────────────────

type NotificationMenuProps = {
  open: boolean;
  onClose: () => void;
  containerRef: RefObject<HTMLElement | null>;
  onUnreadChange: (count: number) => void;
};

export function NotificationMenu({
  open,
  onClose,
  containerRef,
  onUnreadChange,
}: NotificationMenuProps) {
  const [items, setItems] = useState<Notification[]>(INITIAL);

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;

    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose, containerRef]);

  // Keep parent badge count in sync
  useEffect(() => {
    onUnreadChange(items.filter((n) => !n.read).length);
  }, [items, onUnreadChange]);

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markRead(id: string) {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  const unread = items.filter((n) => !n.read).length;

  if (!open) return null;

  return (
    <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[360px] overflow-hidden rounded-2xl border bg-popover shadow-xl animate-in fade-in-0 zoom-in-95">

      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-bold">Notifications</span>
          {unread > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground">
              {unread}
            </span>
          )}
        </div>
        {unread > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <CheckCheck size={13} />
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-[420px] overflow-y-auto">
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
            <Bell size={28} className="opacity-30" />
            <p className="text-sm font-semibold">No notifications</p>
          </div>
        ) : (
          items.map((n) => {
            const cfg = ICON_CONFIG[n.type];
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => markRead(n.id)}
                className={cn(
                  "flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/60",
                  !n.read && "bg-primary/[0.03]"
                )}
              >
                {/* Icon */}
                <span
                  className={cn(
                    "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full",
                    cfg.bg,
                    cfg.text
                  )}
                >
                  {cfg.icon}
                </span>

                {/* Text */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[13px] font-bold leading-snug">
                      {n.title}
                    </span>
                    {!n.read && (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    )}
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                    {n.message}
                  </p>
                  <span className="mt-1 text-[11px] font-semibold text-muted-foreground/70">
                    {n.time}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="border-t p-2">
        <Link
          href="/notifications"
          onClick={onClose}
          className="flex w-full items-center justify-center rounded-xl py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
        >
          View all notifications
        </Link>
      </div>
    </div>
  );
}
