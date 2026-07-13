"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  MessageSquare, Paperclip, Calendar, Plus,
  Trash2, MoreHorizontal, X, Check,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────
export type KanbanCard = {
  id: number;
  title: string;
  company?: string;
  assigneeName?: string;
  amount?: number;
  tags: string[];
  tagColors: string[];
  progress: number;
  comments: number;
  attachments: number;
  assignee: string;
  aColor: string;
  due: string;
};

export type KanbanColumn = {
  name: string;
  color: string;
  cards: KanbanCard[];
};

export type KanbanData = Record<string, KanbanColumn>;

type KanbanBoardProps = {
  initialColumns: KanbanData;
  title?: string;
  enableDragDrop?: boolean;
};

const COLUMN_COLORS = [
  "#6366f1", "#f59e0b", "#10b981", "#ef4444",
  "#3b82f6", "#7c3aed", "#06b6d4", "#ec4899",
];

let _nextId = 300;
function nextId() { return ++_nextId; }

// ── Card background tint per column ──────────────────────────────────────────
function colBg(color: string) {
  const map: Record<string, string> = {
    "#6366f1": "bg-indigo-50 dark:bg-indigo-950/20",
    "#f59e0b": "bg-amber-50 dark:bg-amber-950/20",
    "#10b981": "bg-emerald-50 dark:bg-emerald-950/20",
    "#ef4444": "bg-red-50 dark:bg-red-950/20",
    "#3b82f6": "bg-blue-50 dark:bg-blue-950/20",
    "#7c3aed": "bg-violet-50 dark:bg-violet-950/20",
    "#06b6d4": "bg-cyan-50 dark:bg-cyan-950/20",
    "#ec4899": "bg-pink-50 dark:bg-pink-950/20",
    "#94a3b8": "bg-slate-50 dark:bg-slate-950/20",
  };
  return map[color] ?? "bg-muted/40";
}

// ── Floating drag preview ─────────────────────────────────────────────────────
function DragPreview({ card, col, x, y }: { card: KanbanCard; col: KanbanColumn; x: number; y: number }) {
  return createPortal(
    <div
      style={{ position: "fixed", left: x + 14, top: y + 14, width: 260, zIndex: 9999, pointerEvents: "none", transform: "rotate(2deg)" }}
      className={cn("rounded-xl border bg-card p-3.5 shadow-2xl ring-2 ring-primary/30", colBg(col.color))}
    >
      <p className="mb-0.5 text-[13px] font-bold leading-snug">{card.title}</p>
      {card.company && <p className="mb-2.5 text-xs text-muted-foreground">{card.company}</p>}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold text-white" style={{ background: card.aColor }}>{card.assignee}</div>
          <span>{card.assigneeName ?? card.assignee}</span>
        </div>
        {card.due && <span className="flex items-center gap-1"><Calendar size={11} />{card.due}</span>}
      </div>
      {card.amount != null && (
        <p className="mt-2 text-right text-sm font-extrabold" style={{ color: col.color }}>${card.amount.toLocaleString()}</p>
      )}
    </div>,
    document.body,
  );
}

// ── Add Deal Modal ────────────────────────────────────────────────────────────
function AddDealModal({ open, onClose, onAdd }: {
  open: boolean;
  onClose: () => void;
  onAdd: (card: Omit<KanbanCard, "id">) => void;
}) {
  const [title, setTitle] = useState("");
  const [userName, setUserName] = useState("");
  const [company, setCompany] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  function reset() { setTitle(""); setUserName(""); setCompany(""); setAmount(""); setDate(""); }

  function handleAdd() {
    if (!title.trim()) return;
    const initials = userName.trim().split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "??";
    onAdd({
      title: title.trim(),
      company: company.trim(),
      assigneeName: userName.trim(),
      assignee: initials,
      aColor: COLUMN_COLORS[Math.floor(Math.random() * COLUMN_COLORS.length)],
      amount: amount ? Number(amount.replace(/[^0-9.]/g, "")) : undefined,
      due: date ? new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "",
      tags: [], tagColors: [], progress: 0, comments: 0, attachments: 0,
    });
    reset();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={() => { reset(); onClose(); }}
      title="Add New Deal"
      footer={
        <>
          <Button variant="outline" onClick={() => { reset(); onClose(); }}>Cancel</Button>
          <Button onClick={handleAdd} disabled={!title.trim()}>Add Deal</Button>
        </>
      }
    >
      <div className="flex flex-col gap-4 pt-1">
        <div className="flex flex-col gap-1.5">
          <Label>Title</Label>
          <Input placeholder="Enter task title" value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAdd()} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>User Name</Label>
          <Input placeholder="Enter user name" value={userName} onChange={e => setUserName(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Company Name</Label>
          <Input placeholder="Enter company name" value={company} onChange={e => setCompany(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Amount</Label>
          <Input placeholder="Enter amount" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Date</Label>
          <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>
      </div>
    </Modal>
  );
}

// ── Main Board ────────────────────────────────────────────────────────────────
export function KanbanBoard({
  initialColumns,
  title = "Project Board",
  enableDragDrop = false,
}: KanbanBoardProps) {
  const [cols, setCols] = useState<KanbanData>(initialColumns);
  const [colOrder, setColOrder] = useState(Object.keys(initialColumns));

  // drag
  const [dragging, setDragging] = useState<{ fromKey: string; card: KanbanCard } | null>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [overKey, setOverKey] = useState<string | null>(null);
  const draggingRef = useRef(dragging);
  draggingRef.current = dragging;
  const columnRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // add pipeline column
  const [addingCol, setAddingCol] = useState(false);
  const [newColName, setNewColName] = useState("");

  // add deal modal — tracks which column the + was clicked on
  const [addDealCol, setAddDealCol] = useState<string | null>(null);

  // column ⋯ menu
  const [colMenu, setColMenu] = useState<string | null>(null);

  const colKeys = colOrder.filter((k) => cols[k]);
  const total = colKeys.reduce((s, k) => s + cols[k].cards.length, 0);

  // ── drag helpers ────────────────────────────────────────────────────────────
  const columnAtPoint = useCallback((x: number, y: number) => {
    let found: string | null = null;
    columnRefs.current.forEach((el, key) => {
      if (found) return;
      const r = el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) found = key;
    });
    return found;
  }, []);

  const startDrag = useCallback((e: React.PointerEvent, fromKey: string, card: KanbanCard) => {
    if (!enableDragDrop || e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    setCursor({ x: e.clientX, y: e.clientY });
    setDragging({ fromKey, card });
    setOverKey(fromKey);

    const onMove = (ev: PointerEvent) => {
      setCursor({ x: ev.clientX, y: ev.clientY });
      setOverKey(columnAtPoint(ev.clientX, ev.clientY));
    };
    const onUp = (ev: PointerEvent) => {
      const drag = draggingRef.current;
      if (drag) {
        const target = columnAtPoint(ev.clientX, ev.clientY);
        if (target && target !== drag.fromKey) {
          setCols(p => {
            const c = p[drag.fromKey].cards.find(c => c.id === drag.card.id);
            if (!c) return p;
            return {
              ...p,
              [drag.fromKey]: { ...p[drag.fromKey], cards: p[drag.fromKey].cards.filter(c => c.id !== drag.card.id) },
              [target]: { ...p[target], cards: [...p[target].cards, c] },
            };
          });
        }
      }
      setDragging(null);
      setOverKey(null);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  }, [enableDragDrop, columnAtPoint]);

  useEffect(() => {
    if (dragging) document.body.style.userSelect = "none";
    else document.body.style.userSelect = "";
    return () => { document.body.style.userSelect = ""; };
  }, [!!dragging]);

  // ── column actions ──────────────────────────────────────────────────────────
  function confirmAddColumn() {
    const name = newColName.trim();
    if (!name) return;
    const key = `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    const color = COLUMN_COLORS[colKeys.length % COLUMN_COLORS.length];
    setCols(p => ({ ...p, [key]: { name, color, cards: [] } }));
    setColOrder(p => [...p, key]);
    setNewColName("");
    setAddingCol(false);
  }

  function deleteColumn(key: string) {
    setCols(p => { const n = { ...p }; delete n[key]; return n; });
    setColOrder(p => p.filter(k => k !== key));
    setColMenu(null);
  }

  function deleteCard(colKey: string, cardId: number) {
    setCols(p => ({ ...p, [colKey]: { ...p[colKey], cards: p[colKey].cards.filter(c => c.id !== cardId) } }));
  }

  function handleAddDeal(colKey: string, card: Omit<KanbanCard, "id">) {
    setCols(p => ({ ...p, [colKey]: { ...p[colKey], cards: [...p[colKey].cards, { ...card, id: nextId() }] } }));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <>
      {dragging && <DragPreview card={dragging.card} col={cols[dragging.fromKey]} x={cursor.x} y={cursor.y} />}

      <AddDealModal
        open={addDealCol !== null}
        onClose={() => setAddDealCol(null)}
        onAdd={(card) => { if (addDealCol) handleAddDeal(addDealCol, card); }}
      />

      <Card onClick={() => setColMenu(null)}>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              {total} deals across {colKeys.length} stages
              {enableDragDrop && " · drag to move"}
            </CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setAddingCol(true); }}>
            <Plus size={14} /> Add Stage
          </Button>
        </CardHeader>

        <CardContent>
          <div className={cn("kb-b", dragging && "cursor-grabbing")}>
            {colKeys.map((key) => {
              const col = cols[key];
              const isOver = overKey === key && dragging !== null;

              return (
                <div
                  key={key}
                  ref={(el) => { if (el) columnRefs.current.set(key, el); else columnRefs.current.delete(key); }}
                  className={cn("flex w-[260px] min-w-[260px] shrink-0 flex-col gap-0 rounded-2xl border transition-colors", colBg(col.color), isOver && "ring-2 ring-primary/40")}
                >
                  {/* Column header */}
                  <div className="flex items-center gap-2 px-3.5 py-3">
                    <span className="flex-1 text-sm font-bold">
                      {col.name}
                      <span className="ml-2 rounded-full border px-1.5 py-0.5 text-[10px] font-extrabold" style={{ color: col.color, borderColor: `${col.color}40` }}>
                        {col.cards.length}
                      </span>
                    </span>
                    {/* + add deal */}
                    <button
                      className="grid h-6 w-6 place-items-center rounded-full text-white shadow transition-opacity hover:opacity-80"
                      style={{ background: col.color }}
                      onClick={(e) => { e.stopPropagation(); setAddDealCol(key); }}
                      aria-label="Add deal"
                    >
                      <Plus size={13} />
                    </button>
                    {/* ⋯ menu */}
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="rounded p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setColMenu(colMenu === key ? null : key)}
                      >
                        <MoreHorizontal size={15} />
                      </button>
                      {colMenu === key && (
                        <div className="absolute right-0 top-6 z-50 min-w-[140px] rounded-lg border bg-popover py-1 shadow-lg">
                          <button
                            className="flex w-full items-center gap-2 px-3 py-2 text-xs text-destructive hover:bg-accent"
                            onClick={() => deleteColumn(key)}
                          >
                            <Trash2 size={12} /> Delete stage
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cards list */}
                  <div className="flex flex-col gap-2.5 px-2.5 pb-2.5">
                    {col.cards.map((c) => {
                      const isDragging = dragging?.card.id === c.id;
                      const isWon = c.tags.includes("Won");
                      const isLost = c.tags.includes("Lost");

                      return (
                        <div
                          key={c.id}
                          className={cn(
                            "group relative rounded-xl border bg-card p-3.5 shadow-sm transition-all",
                            enableDragDrop && !isDragging && "cursor-grab active:cursor-grabbing hover:shadow-md",
                            isDragging && "opacity-30 scale-95 pointer-events-none",
                          )}
                          onPointerDown={(e) => startDrag(e, key, c)}
                        >
                          {/* ⋯ delete */}
                          <button
                            className="absolute right-2.5 top-2.5 rounded p-0.5 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={() => deleteCard(key, c.id)}
                            aria-label="Delete"
                          >
                            <MoreHorizontal size={14} />
                          </button>

                          {/* Title + company */}
                          <p className="mb-0.5 pr-5 text-[13px] font-bold leading-snug">{c.title}</p>
                          {c.company && <p className="mb-3 text-xs text-muted-foreground">{c.company}</p>}

                          {/* Assignee row */}
                          <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white" style={{ background: c.aColor }}>
                              {c.assignee}
                            </div>
                            <span className="truncate">{c.assigneeName ?? c.assignee}</span>
                          </div>

                          {/* Date + meta */}
                          <div className="mb-2.5 flex items-center gap-3 text-xs text-muted-foreground">
                            {c.due && (
                              <span className="flex items-center gap-1">
                                <Calendar size={11} /> {c.due}
                              </span>
                            )}
                            {c.comments > 0 && (
                              <span className="flex items-center gap-1">
                                <MessageSquare size={11} /> {c.comments}
                              </span>
                            )}
                            {c.attachments > 0 && (
                              <span className="flex items-center gap-1">
                                <Paperclip size={11} /> {c.attachments}
                              </span>
                            )}
                          </div>

                          {/* Status badge + amount */}
                          <div className="flex items-center justify-between">
                            {isWon && (
                              <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                <Check size={9} /> Won
                              </span>
                            )}
                            {isLost && (
                              <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:bg-red-900/30 dark:text-red-400">
                                <X size={9} /> Lost
                              </span>
                            )}
                            {!isWon && !isLost && <span />}
                            {c.amount != null && (
                              <span className="text-sm font-extrabold" style={{ color: isLost ? "#ef4444" : col.color }}>
                                ${c.amount.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Empty drop zone */}
                    {col.cards.length === 0 && (
                      <div className={cn(
                        "rounded-xl border-2 border-dashed border-border px-4 py-6 text-center text-xs font-semibold text-muted-foreground transition-colors",
                        isOver && dragging && "border-primary/50 bg-primary/5 text-primary"
                      )}>
                        Drop here
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Add pipeline stage */}
            {addingCol ? (
              <div className="flex w-[260px] min-w-[260px] shrink-0 flex-col gap-2 rounded-2xl border-2 border-dashed border-primary/40 bg-muted p-3">
                <p className="text-xs font-semibold text-muted-foreground">New pipeline stage</p>
                <Input
                  autoFocus
                  placeholder="Stage name…"
                  value={newColName}
                  onChange={(e) => setNewColName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") confirmAddColumn();
                    if (e.key === "Escape") { setAddingCol(false); setNewColName(""); }
                  }}
                  className="h-8 text-xs"
                />
                <div className="flex gap-1.5">
                  <Button size="sm" className="h-7 flex-1 text-xs" onClick={confirmAddColumn}>
                    <Check size={12} /> Add
                  </Button>
                  <button
                    className="rounded-md px-2 text-muted-foreground hover:text-foreground"
                    onClick={() => { setAddingCol(false); setNewColName(""); }}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="flex w-[200px] min-w-[200px] shrink-0 items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border py-10 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                onClick={() => { setAddingCol(true); setNewColName(""); }}
              >
                <Plus size={15} /> Add stage
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
