"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, Send } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Textarea,
} from "@/components/ui";
import { PageStack } from "@/components";
import { useSupport } from "@/contexts/support-context";

function statusVariant(status: string) {
  if (status === "Resolved") return "default";
  if (status === "Pending") return "outline";
  return "secondary";
}

export default function TicketDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { getTicket, getMessagesForTicket, addReply, updateTicketStatus } =
    useSupport();
  const ticket = getTicket(params.id);
  const [reply, setReply] = useState("");

  if (!ticket) {
    notFound();
  }

  const currentTicket = ticket;
  const messages = getMessagesForTicket(currentTicket.id);

  function handleReply(e: React.FormEvent) {
    e.preventDefault();
    const message = reply.trim();
    if (!message) return;

    addReply(currentTicket.id, {
      sender: "agent",
      author: "Support Agent",
      message,
    });
    setReply("");
  }

  return (
    <PageStack>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/system/support">
            <ArrowLeft />
            Back to tickets
          </Link>
        </Button>
        {currentTicket.status !== "Resolved" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateTicketStatus(currentTicket.id, "Resolved")}
          >
            <CheckCircle2 size={14} />
            Close Ticket
          </Button>
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
        <Card className="flex h-[calc(100dvh-13rem)] flex-col overflow-hidden">
          <CardHeader className="shrink-0">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle>{currentTicket.subject}</CardTitle>
              <Badge variant={statusVariant(currentTicket.status)}>
                {currentTicket.status}
              </Badge>
            </div>
            <CardDescription>
              {currentTicket.id} • {currentTicket.customer} • {currentTicket.channel}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex min-h-0 flex-1 flex-col gap-0 p-0">
            <div className="shrink-0 px-6 pb-4 mt-4">
              <div className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
                {currentTicket.description}
              </div>
            </div>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-6 py-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={
                    message.sender === "agent"
                      ? "ml-auto max-w-[85%] rounded-2xl bg-primary px-4 py-3 text-sm text-primary-foreground"
                      : "max-w-[85%] rounded-2xl bg-background px-4 py-3 text-sm shadow-sm border"
                  }
                >
                  <div className="mb-1 text-xs font-semibold opacity-80">
                    {message.author}
                  </div>
                  <div>{message.message}</div>
                  <div className="mt-2 text-[11px] opacity-75">
                    {message.createdAt}
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleReply}
              className="shrink-0 space-y-3 border-t bg-background p-6"
            >
              <Textarea
                rows={4}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Write your reply to this ticket..."
              />
              <div className="flex flex-wrap gap-2">
                <Button type="submit">
                  <Send size={14} />
                  Send Reply
                </Button>
                {currentTicket.status === "Resolved" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => updateTicketStatus(currentTicket.id, "Pending")}
                  >
                    Reopen Ticket
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ticket Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <div className="font-semibold">Customer</div>
              <div className="text-muted-foreground">{currentTicket.customer}</div>
            </div>
            <div>
              <div className="font-semibold">Priority</div>
              <div className="text-muted-foreground">{currentTicket.priority}</div>
            </div>
            <div>
              <div className="font-semibold">Assignee</div>
              <div className="text-muted-foreground">
                {currentTicket.assignee ?? "Unassigned"}
              </div>
            </div>
            <div>
              <div className="font-semibold">Last Updated</div>
              <div className="text-muted-foreground">{currentTicket.updatedAt}</div>
            </div>
            <div>
              <div className="font-semibold">Conversation</div>
              <div className="text-muted-foreground">
                {messages.length} messages in this thread
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageStack>
  );
}
