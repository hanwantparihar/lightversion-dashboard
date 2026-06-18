"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Paperclip,
  Calendar,
  Plus,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export type KanbanCard = {
  id: number;
  title: string;
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
};

export function KanbanBoard({
  initialColumns,
  title = "Project Board",
}: KanbanBoardProps) {
  const [cols, setCols] = useState(initialColumns);
  const colKeys = Object.keys(cols);
  const total = colKeys.reduce((s, k) => s + cols[k].cards.length, 0);

  const move = (fromKey: string, cardIdx: number, dir: number) => {
    const fromIdx = colKeys.indexOf(fromKey);
    const toIdx = fromIdx + dir;
    if (toIdx < 0 || toIdx >= colKeys.length) return;
    const toKey = colKeys[toIdx];
    setCols((p) => {
      const card = p[fromKey].cards[cardIdx];
      const newFrom = p[fromKey].cards.filter((_, i) => i !== cardIdx);
      const newTo = [...p[toKey].cards, card];
      return {
        ...p,
        [fromKey]: { ...p[fromKey], cards: newFrom },
        [toKey]: { ...p[toKey], cards: newTo },
      };
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {total} tasks across {colKeys.length} columns
          </CardDescription>
        </div>
        <Button size="sm">
          <Plus />
          Add Task
        </Button>
      </CardHeader>
      <CardContent>
        <div className="kb-b">
          {colKeys.map((key, ki) => {
            const col = cols[key];
            return (
              <div key={key} className="kb-c">
                <div className="kb-ch">
                  <span
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: 50,
                      background: col.color,
                    }}
                  />
                  <span className="kb-cn">{col.name}</span>
                  <span className="kb-ct">{col.cards.length}</span>
                </div>
                <div className="kb-cs">
                  {col.cards.map((c, ci) => (
                    <div key={c.id} className="kb-cd">
                      <div>
                        {c.tags.map((t, ti) => (
                          <span
                            key={ti}
                            className="kb-tg"
                            style={{
                              background: `${c.tagColors[ti]}1c`,
                              color: c.tagColors[ti],
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="kb-ti">{c.title}</div>
                      {c.progress > 0 && (
                        <div className="kb-pr">
                          <span>{c.progress}%</span>
                          <div className="kb-br">
                            <div
                              className="kb-bf"
                              style={{
                                background: col.color,
                                width: `${c.progress}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                      <div className="kb-mt">
                        {c.comments > 0 && (
                          <span className="fc" style={{ gap: 3 }}>
                            <MessageSquare size={12} />
                            {c.comments}
                          </span>
                        )}
                        {c.attachments > 0 && (
                          <span className="fc" style={{ gap: 3 }}>
                            <Paperclip size={12} />
                            {c.attachments}
                          </span>
                        )}
                        <span className="fc" style={{ gap: 3 }}>
                          <Calendar size={12} />
                          {c.due}
                        </span>
                        <div
                          className="kb-av"
                          style={{ background: c.aColor }}
                        >
                          {c.assignee}
                        </div>
                      </div>
                      <div
                        className="fc"
                        style={{
                          gap: 5,
                          marginTop: 9,
                          paddingTop: 9,
                          borderTop: "1px dashed var(--bd)",
                        }}
                      >
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => move(key, ci, -1)}
                          disabled={ki === 0}
                        >
                          <ChevronLeft />
                          Back
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => move(key, ci, 1)}
                          disabled={ki === colKeys.length - 1}
                        >
                          Next
                          <ChevronRight />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {col.cards.length === 0 && (
                    <div
                      style={{
                        padding: 18,
                        textAlign: "center",
                        color: "var(--mt-fg)",
                        fontSize: 12,
                        fontWeight: 600,
                        border: "2px dashed var(--bd)",
                        borderRadius: 10,
                      }}
                    >
                      Drop tasks here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
