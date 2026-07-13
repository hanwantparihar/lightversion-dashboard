"use client";

import { useState } from "react";
import { StickyNote, Plus, Trash2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  Button,
  Textarea,
  Label,
  DropdownSelect,
} from "@/components/ui";
import { PageStack } from "@/components";
import { useCrm } from "@/contexts/crm-context";

export default function NotesPage() {
  const { notes, leads, addNote, deleteNote } = useCrm();
  const [showForm, setShowForm] = useState(false);
  const [leadId, setLeadId] = useState(String(leads[0]?.id ?? ""));
  const [content, setContent] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const lead = leads.find((l) => l.id === Number(leadId));
    if (!lead || !content.trim()) return;
    addNote({
      leadId: lead.id,
      leadName: lead.name,
      author: "You",
      content: content.trim(),
      createdAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    });
    setContent("");
    setShowForm(false);
  }

  return (
    <PageStack>
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
          <CardTitle className="flex items-center gap-2">
            <StickyNote size={18} />
            Notes
          </CardTitle>
          <Button size="sm" onClick={() => setShowForm((v) => !v)}>
            <Plus size={14} />
            Add Note
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {showForm && (
            <form
              onSubmit={handleAdd}
              className="space-y-3 rounded-xl border bg-muted/30 p-4"
            >
              <div className="space-y-2">
                <Label>Lead</Label>
                <DropdownSelect
                  value={leadId}
                  onChange={setLeadId}
                  options={leads.map((l) => ({
                    value: String(l.id),
                    label: `${l.name} — ${l.company}`,
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Note</Label>
                <Textarea
                  placeholder="Write your note…"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" size="sm">
                  Save Note
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {notes.map((note) => (
            <div key={note.id} className="rounded-xl border p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{note.leadName}</p>
                  <p className="text-xs text-muted-foreground">
                    {note.author} · {note.createdAt}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteNote(note.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {note.content}
              </p>
            </div>
          ))}

          {notes.length === 0 && (
            <p className="py-8 text-center text-muted-foreground">
              No notes yet. Add your first note above.
            </p>
          )}
        </CardContent>
      </Card>
    </PageStack>
  );
}
