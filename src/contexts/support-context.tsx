"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  nextSupportMessageId,
  nextTicketId,
  supportMessages,
  supportTickets,
  type SupportMessage,
  type SupportTicket,
} from "@/lib/basic-modules-data";

type CreateTicketInput = Omit<SupportTicket, "id" | "updatedAt" | "status">;

type SupportContextValue = {
  tickets: SupportTicket[];
  messages: SupportMessage[];
  getTicket: (id: string) => SupportTicket | undefined;
  getMessagesForTicket: (ticketId: string) => SupportMessage[];
  createTicket: (data: CreateTicketInput) => string;
  addReply: (
    ticketId: string,
    data: Omit<SupportMessage, "id" | "ticketId" | "createdAt">
  ) => void;
  updateTicketStatus: (ticketId: string, status: SupportTicket["status"]) => void;
};

const SupportContext = createContext<SupportContextValue | null>(null);

function nowLabel() {
  return new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function SupportProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<SupportTicket[]>(supportTickets);
  const [messages, setMessages] = useState<SupportMessage[]>(supportMessages);

  const getTicket = useCallback(
    (id: string) => tickets.find((ticket) => ticket.id === id),
    [tickets]
  );

  const getMessagesForTicket = useCallback(
    (ticketId: string) => messages.filter((message) => message.ticketId === ticketId),
    [messages]
  );

  const createTicket = useCallback((data: CreateTicketInput) => {
    let newId = "";
    setTickets((prev) => {
      newId = nextTicketId(prev);
      return [
        {
          id: newId,
          updatedAt: "Just now",
          status: "Open",
          ...data,
        },
        ...prev,
      ];
    });

    setMessages((prev) => [
      ...prev,
      {
        id: nextSupportMessageId(prev),
        ticketId: newId,
        sender: "customer",
        author: data.customer,
        message: data.description ?? data.subject,
        createdAt: nowLabel(),
      },
    ]);

    return newId;
  }, []);

  const addReply = useCallback(
    (
      ticketId: string,
      data: Omit<SupportMessage, "id" | "ticketId" | "createdAt">
    ) => {
      setMessages((prev) => [
        ...prev,
        {
          id: nextSupportMessageId(prev),
          ticketId,
          createdAt: nowLabel(),
          ...data,
        },
      ]);

      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === ticketId
            ? { ...ticket, updatedAt: "Just now", status: "Pending" }
            : ticket
        )
      );
    },
    []
  );

  const updateTicketStatus = useCallback(
    (ticketId: string, status: SupportTicket["status"]) => {
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === ticketId ? { ...ticket, status, updatedAt: "Just now" } : ticket
        )
      );
    },
    []
  );

  const value = useMemo(
    () => ({
      tickets,
      messages,
      getTicket,
      getMessagesForTicket,
      createTicket,
      addReply,
      updateTicketStatus,
    }),
    [
      tickets,
      messages,
      getTicket,
      getMessagesForTicket,
      createTicket,
      addReply,
      updateTicketStatus,
    ]
  );

  return <SupportContext.Provider value={value}>{children}</SupportContext.Provider>;
}

export function useSupport() {
  const ctx = useContext(SupportContext);
  if (!ctx) throw new Error("useSupport must be used within SupportProvider");
  return ctx;
}
