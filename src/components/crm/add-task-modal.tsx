"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Label,
  DropdownSelect,
  Modal,
} from "@/components/ui";
import { useCrm } from "@/contexts/crm-context";
import {
  LEAD_ASSIGNEES,
  TASK_PRIORITIES,
  TASK_STATUSES,
  type CrmTask,
} from "@/lib/crm-data";

type AddTaskModalProps = {
  open: boolean;
  onClose: () => void;
};

const emptyForm = {
  title: "",
  leadId: "",
  priority: "Medium" as CrmTask["priority"],
  status: "Todo" as CrmTask["status"],
  dueDate: "",
  assignee: LEAD_ASSIGNEES[0],
};

export function AddTaskModal({ open, onClose }: AddTaskModalProps) {
  const { leads, addTask } = useCrm();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  function reset() {
    setForm({
      ...emptyForm,
      leadId: leads[0] ? String(leads[0].id) : "",
    });
    setError("");
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const title = form.title.trim();
    const lead = leads.find((l) => l.id === Number(form.leadId));

    if (!title) {
      setError("Task title is required.");
      return;
    }
    if (!lead) {
      setError("Please select a lead.");
      return;
    }
    if (!form.dueDate) {
      setError("Due date is required.");
      return;
    }

    addTask({
      title,
      leadId: lead.id,
      leadName: lead.name,
      priority: form.priority,
      status: form.status,
      dueDate: new Date(form.dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      assignee: form.assignee,
    });

    handleClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add Task"
      size="lg"
      footer={
        <>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" form="add-task-form">
            Add Task
          </Button>
        </>
      }
    >
      <form id="add-task-form" onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="space-y-2">
          <Label htmlFor="task-title">Task Title *</Label>
          <Input
            id="task-title"
            placeholder="Send proposal to client"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Related Lead *</Label>
            <DropdownSelect
              value={form.leadId || (leads[0] ? String(leads[0].id) : "")}
              onChange={(v) => setForm((f) => ({ ...f, leadId: v }))}
              options={leads.map((l) => ({
                value: String(l.id),
                label: `${l.name} — ${l.company}`,
              }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="task-due">Due Date *</Label>
            <Input
              id="task-due"
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Priority</Label>
            <DropdownSelect
              value={form.priority}
              onChange={(v) =>
                setForm((f) => ({ ...f, priority: v as CrmTask["priority"] }))
              }
              options={TASK_PRIORITIES.map((p) => ({ value: p, label: p }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <DropdownSelect
              value={form.status}
              onChange={(v) =>
                setForm((f) => ({ ...f, status: v as CrmTask["status"] }))
              }
              options={TASK_STATUSES.map((s) => ({ value: s, label: s }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Assignee</Label>
            <DropdownSelect
              value={form.assignee}
              onChange={(v) => setForm((f) => ({ ...f, assignee: v }))}
              options={LEAD_ASSIGNEES.map((a) => ({ value: a, label: a }))}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
