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
  LEAD_SOURCES,
  LEAD_STATUSES,
  type LeadStatus,
} from "@/lib/crm-data";

type AddLeadModalProps = {
  open: boolean;
  onClose: () => void;
};

const emptyForm = {
  name: "",
  company: "",
  email: "",
  phone: "",
  source: LEAD_SOURCES[0],
  status: "New" as LeadStatus,
  value: "",
  assignee: LEAD_ASSIGNEES[0],
};

export function AddLeadModal({ open, onClose }: AddLeadModalProps) {
  const { addLead } = useCrm();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  function reset() {
    setForm(emptyForm);
    setError("");
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const name = form.name.trim();
    const company = form.company.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const value = Number(form.value);

    if (!name || !company || !email) {
      setError("Name, company, and email are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (form.value && (Number.isNaN(value) || value < 0)) {
      setError("Deal value must be a positive number.");
      return;
    }

    addLead({
      name,
      company,
      email,
      phone,
      source: form.source,
      status: form.status,
      value: value || 0,
      assignee: form.assignee,
      createdAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    });

    handleClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add Lead"
      size="lg"
      footer={
        <>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" form="add-lead-form">
            Add Lead
          </Button>
        </>
      }
    >
      <form id="add-lead-form" onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="lead-name">Full Name *</Label>
            <Input
              id="lead-name"
              placeholder="Sarah Mitchell"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lead-company">Company *</Label>
            <Input
              id="lead-company"
              placeholder="Acme Corp"
              value={form.company}
              onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="lead-email">Email *</Label>
            <Input
              id="lead-email"
              type="email"
              placeholder="sarah@company.com"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lead-phone">Phone</Label>
            <Input
              id="lead-phone"
              type="tel"
              placeholder="+1 555-0100"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Source</Label>
            <DropdownSelect
              value={form.source}
              onChange={(v) => setForm((f) => ({ ...f, source: v }))}
              options={LEAD_SOURCES.map((s) => ({ value: s, label: s }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <DropdownSelect
              value={form.status}
              onChange={(v) =>
                setForm((f) => ({ ...f, status: v as LeadStatus }))
              }
              options={LEAD_STATUSES.map((s) => ({ value: s, label: s }))}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="lead-value">Deal Value ($)</Label>
            <Input
              id="lead-value"
              type="number"
              min={0}
              placeholder="24000"
              value={form.value}
              onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
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
