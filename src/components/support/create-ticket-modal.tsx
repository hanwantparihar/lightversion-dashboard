"use client";

import { useState } from "react";
import {
  Button,
  DropdownSelect,
  Input,
  Label,
  Modal,
  Textarea,
} from "@/components/ui";
import { useSupport } from "@/contexts/support-context";
import type { SupportTicket } from "@/lib/basic-modules-data";

type CreateTicketModalProps = {
  open: boolean;
  onClose: () => void;
};

const emptyForm = {
  subject: "",
  customer: "",
  priority: "Medium" as SupportTicket["priority"],
  channel: "Portal" as SupportTicket["channel"],
  description: "",
  assignee: "Support Team",
};

export function CreateTicketModal({
  open,
  onClose,
}: CreateTicketModalProps) {
  const { createTicket } = useSupport();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  function handleClose() {
    setForm(emptyForm);
    setError("");
    onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const subject = form.subject.trim();
    const customer = form.customer.trim();
    const description = form.description.trim();

    if (!subject || !customer || !description) {
      setError("Subject, customer, and description are required.");
      return;
    }

    createTicket({
      subject,
      customer,
      priority: form.priority,
      channel: form.channel,
      description,
      assignee: form.assignee,
    });

    handleClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Create Ticket"
      size="lg"
      footer={
        <>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" form="create-ticket-form">
            Open Ticket
          </Button>
        </>
      }
    >
      <form
        id="create-ticket-form"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="ticket-subject">Subject</Label>
            <Input
              id="ticket-subject"
              value={form.subject}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, subject: e.target.value }))
              }
              placeholder="Webhook delivery issue"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ticket-customer">Customer</Label>
            <Input
              id="ticket-customer"
              value={form.customer}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, customer: e.target.value }))
              }
              placeholder="Acme Corp"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Priority</Label>
            <DropdownSelect
              value={form.priority}
              onChange={(v) =>
                setForm((prev) => ({
                  ...prev,
                  priority: v as SupportTicket["priority"],
                }))
              }
              options={["Low", "Medium", "High"].map((value) => ({
                value,
                label: value,
              }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Channel</Label>
            <DropdownSelect
              value={form.channel}
              onChange={(v) =>
                setForm((prev) => ({
                  ...prev,
                  channel: v as SupportTicket["channel"],
                }))
              }
              options={["Portal", "Email", "Chat"].map((value) => ({
                value,
                label: value,
              }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ticket-assignee">Assignee</Label>
            <Input
              id="ticket-assignee"
              value={form.assignee}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, assignee: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ticket-description">Description</Label>
          <Textarea
            id="ticket-description"
            rows={4}
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Describe the issue, expected behavior, and any recent changes."
          />
        </div>
      </form>
    </Modal>
  );
}
