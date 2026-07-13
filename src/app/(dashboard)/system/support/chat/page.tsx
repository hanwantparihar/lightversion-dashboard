"use client";

import { useMemo, useState } from "react";
import {
  MessageCircleMore,
  Phone,
  Search,
  Send,
  MoreVertical,
  Mic,
  Volume2,
  PhoneOff,
  X,
} from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from "@/components/ui";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PageStack, AvatarInitials } from "@/components";
import { supportChats } from "@/lib/basic-modules-data";

const chatMessages = {
  "chat-1": [
    {
      id: "m-1",
      sender: "customer" as const,
      text: "Just sent the Dropbox access details. Let me know if you have issues connecting it.",
      time: "11:03 pm",
    },
    {
      id: "m-2",
      sender: "agent" as const,
      text: "Got them. Everything looks good so far.",
      time: "12:16 pm",
    },
    {
      id: "m-3",
      sender: "customer" as const,
      text: "Awesome. Looking forward to your feedback!",
      time: "12:12 pm",
    },
    {
      id: "m-4",
      sender: "agent" as const,
      text: "We’ll get back to you after lunch with the final sync test.",
      time: "12:13 pm",
    },
    {
      id: "m-5",
      sender: "customer" as const,
      text: "No rush, enjoy your lunch!",
      time: "12:14 pm",
    },
    {
      id: "m-6",
      sender: "agent" as const,
      text: "Thanks! Talk soon.",
      time: "12:15 pm",
    },
  ],
  "chat-2": [
    {
      id: "m-7",
      sender: "customer" as const,
      text: "Webhook delivery is failing on our staging endpoint.",
      time: "9:24 am",
    },
    {
      id: "m-8",
      sender: "agent" as const,
      text: "Please verify the rotated secret and replay the last failed event.",
      time: "9:31 am",
    },
  ],
  "chat-3": [
    {
      id: "m-9",
      sender: "customer" as const,
      text: "Need SMTP credentials rotated before next campaign.",
      time: "8:48 am",
    },
    {
      id: "m-10",
      sender: "agent" as const,
      text: "Understood. We can rotate them today and share the updated settings securely.",
      time: "9:02 am",
    },
  ],
} as const;

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function SupportChatPage() {
  const [search, setSearch] = useState("");
  const [activeChatId, setActiveChatId] = useState(
    supportChats.find((chat) => chat.active)?.id ?? supportChats[0]?.id ?? ""
  );
  const [reply, setReply] = useState("");
  const [isCallOpen, setIsCallOpen] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  const chats = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return supportChats;
    return supportChats.filter(
      (chat) =>
        chat.customer.toLowerCase().includes(query) ||
        chat.plan.toLowerCase().includes(query) ||
        chat.lastMessage.toLowerCase().includes(query)
    );
  }, [search]);

  const activeChat =
    supportChats.find((chat) => chat.id === activeChatId) ?? supportChats[0];
  const messages = chatMessages[activeChat.id as keyof typeof chatMessages] ?? [];

  return (
    <PageStack>
      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="overflow-hidden">
          <CardHeader className="border-b pb-4">
            <CardTitle className="flex items-center gap-2">
              <MessageCircleMore size={18} />
              Chat Support
            </CardTitle>
            <CardDescription>
              Active support conversations from customers and workspace admins.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border-b p-4">
              <div className="relative">
                <Search
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search here..."
                  className="pl-9"
                />
              </div>
            </div>

            <div className="max-h-[640px] overflow-y-auto">
              {chats.map((chat) => {
                const isActive = chat.id === activeChat.id;
                return (
                  <button
                    key={chat.id}
                    type="button"
                    onClick={() => setActiveChatId(chat.id)}
                    className={`flex w-full items-start gap-3 border-b px-4 py-3 text-left transition-colors hover:bg-muted/50 ${
                      isActive ? "bg-primary/5" : "bg-background"
                    }`}
                  >
                    <AvatarInitials
                      bg={isActive ? "#2563eb" : "#7c3aed"}
                      initials={initials(chat.customer)}
                      className="h-10 w-10 rounded-full text-xs"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate font-semibold">
                          {chat.customer}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {chat.unread > 0 ? "Just now" : "5 min"}
                        </span>
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {chat.plan}
                      </div>
                      <div className="mt-1 truncate text-xs text-muted-foreground">
                        {chat.lastMessage}
                      </div>
                    </div>
                    {chat.unread > 0 && (
                      <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                        {chat.unread}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="border-b px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <AvatarInitials
                  bg="#2563eb"
                  initials={initials(activeChat.customer)}
                  className="h-11 w-11 rounded-full text-xs"
                />
                <div>
                  <CardTitle className="text-lg">{activeChat.customer}</CardTitle>
                  <CardDescription className="mt-1 flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                    Active
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setIsCallOpen(true)}
                  aria-label={`Start a call with ${activeChat.customer}`}
                >
                  <Phone size={14} />
                </Button>
                <Button variant="ghost" size="icon-sm">
                  <MoreVertical size={14} />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex min-h-[640px] flex-col p-0">
            <div className="flex-1 space-y-5 overflow-y-auto bg-gradient-to-b from-background to-muted/20 px-5 py-5">
              {messages.map((message) => {
                const isAgent = message.sender === "agent";
                return (
                  <div
                    key={message.id}
                    className={`flex items-end gap-3 ${
                      isAgent ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isAgent && (
                      <AvatarInitials
                        bg="#ec4899"
                        initials={initials(activeChat.customer)}
                        className="h-9 w-9 rounded-full text-[10px]"
                      />
                    )}

                    <div className={`${isAgent ? "order-1" : ""} max-w-[70%]`}>
                      <div
                        className={`rounded-2xl px-4 py-3 text-sm shadow-sm ${
                          isAgent
                            ? "bg-primary/10 text-foreground"
                            : "border bg-background"
                        }`}
                      >
                        {message.text}
                      </div>
                      <div
                        className={`mt-1 text-[11px] text-muted-foreground ${
                          isAgent ? "text-right" : "text-left"
                        }`}
                      >
                        {message.time}
                      </div>
                    </div>

                    {isAgent && (
                      <AvatarInitials
                        bg="#2563eb"
                        initials="ST"
                        className="h-9 w-9 rounded-full text-[10px]"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="border-t bg-background p-4">
              <div className="flex gap-2">
                <Input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Reply to customer..."
                  className="h-11"
                />
                <Button className="h-11 px-5">
                  Send
                <Send size={14} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={isCallOpen}
        onOpenChange={(open: boolean) => {
          setIsCallOpen(open);
          if (!open) {
            setIsMicOn(true);
            setIsSpeakerOn(true);
          }
        }}
      >
        <DialogContent className="max-w-[520px] gap-0 overflow-hidden border-0 bg-slate-800 p-0 text-white shadow-2xl sm:rounded-xl">
          <div className="relative px-8 pb-7 pt-6 text-center">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="absolute right-4 top-4 text-slate-300 hover:bg-white/10 hover:text-white"
              onClick={() => setIsCallOpen(false)}
              aria-label="Close call popup"
            >
              <X size={16} />
            </Button>

            <p className="text-left text-xl font-semibold">Starting Audio Call</p>

            <div className="mt-8 flex justify-center">
              <div className="flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 via-red-500 to-pink-500 text-3xl font-semibold shadow-lg ring-4 ring-white/5">
                {initials(activeChat.customer)}
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-3xl font-semibold tracking-tight">
                {activeChat.customer}
              </h2>
              <p className="mt-2 text-lg text-slate-300">Calling...</p>
            </div>

            <div className="mt-10 flex items-center justify-center gap-3">
              <Button
                type="button"
                variant="secondary"
                className="h-11 min-w-[132px] rounded-md border-0 bg-white px-4 text-slate-700 hover:bg-slate-100"
                onClick={() => setIsMicOn((value) => !value)}
              >
                <Mic size={16} />
                {isMicOn ? "Mic On" : "Mic Off"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="h-11 min-w-[132px] rounded-md border-0 bg-white px-4 text-slate-700 hover:bg-slate-100"
                onClick={() => setIsSpeakerOn((value) => !value)}
              >
                <Volume2 size={16} />
                {isSpeakerOn ? "Speaker On" : "Speaker Off"}
              </Button>
              <Button
                type="button"
                className="h-11 min-w-[132px] rounded-md border-0 bg-rose-500 px-4 text-white hover:bg-rose-600"
                onClick={() => setIsCallOpen(false)}
              >
                <PhoneOff size={16} />
                End Call
              </Button>
            </div>

            <p className="mt-16 text-base italic text-slate-400">
              Ensure your microphone is working properly
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </PageStack>
  );
}
