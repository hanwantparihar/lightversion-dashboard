"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LifeBuoy, MessageSquareText } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { PageStack } from "@/components";
import { CreateTicketModal } from "@/components/support/create-ticket-modal";
import { useSupport } from "@/contexts/support-context";

function statusVariant(status: string) {
  if (status === "Resolved") return "default";
  if (status === "Pending") return "outline";
  return "secondary";
}

function priorityVariant(priority: string) {
  if (priority === "High") return "destructive";
  if (priority === "Medium") return "outline";
  return "secondary";
}

export default function SupportPage() {
  const { tickets } = useSupport();
  const [open, setOpen] = useState(false);
  const sortedTickets = useMemo(() => tickets, [tickets]);

  return (
    <PageStack>
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2">
              <LifeBuoy size={18} />
              Ticket System
            </CardTitle>
            <CardDescription>
              Track customer issues, priorities, and current resolution status.
            </CardDescription>
          </div>
          <Button size="sm" onClick={() => setOpen(true)}>
            <MessageSquareText size={14} />
            Create Ticket
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 font-semibold">Ticket</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Priority</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Channel</th>
                  <th className="pb-3 font-semibold">Updated</th>
                </tr>
              </thead>
              <tbody>
                {sortedTickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b last:border-0">
                    <td className="py-3">
                      <Link
                        href={`/system/support/${ticket.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {ticket.id}
                      </Link>
                      <div className="text-xs text-muted-foreground">
                        {ticket.subject}
                      </div>
                    </td>
                    <td className="py-3">{ticket.customer}</td>
                    <td className="py-3">
                      <Badge variant={priorityVariant(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Badge variant={statusVariant(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </td>
                    <td className="py-3">{ticket.channel}</td>
                    <td className="py-3 text-muted-foreground">
                      {ticket.updatedAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <CreateTicketModal open={open} onClose={() => setOpen(false)} />
    </PageStack>
  );
}
