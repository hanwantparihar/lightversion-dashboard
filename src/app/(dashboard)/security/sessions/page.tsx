"use client";

import { useState } from "react";
import {
  Monitor,
  Smartphone,
  Tablet,
  LogOut,
  Shield,
  MapPin,
  Globe,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  Button,
  Badge,
} from "@/components/ui";
import { PageStack } from "@/components";
import { initialSessions, type ActiveSession } from "@/lib/sessions-data";

function deviceIcon(device: string) {
  if (device.toLowerCase().includes("iphone") || device.toLowerCase().includes("phone"))
    return Smartphone;
  if (device.toLowerCase().includes("ipad") || device.toLowerCase().includes("tablet"))
    return Tablet;
  return Monitor;
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<ActiveSession[]>(initialSessions);

  function revokeSession(id: string) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }

  function revokeAllOthers() {
    setSessions((prev) => prev.filter((s) => s.current));
  }

  return (
    <PageStack>
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield size={18} />
              Active Sessions
            </CardTitle>
            <CardDescription>
              Manage devices where you&apos;re currently signed in
            </CardDescription>
          </div>
          {sessions.length > 1 && (
            <Button variant="outline" size="sm" onClick={revokeAllOthers}>
              <LogOut size={14} />
              Sign out all other devices
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {sessions.map((session) => {
            const Icon = deviceIcon(session.device);
            return (
              <div
                key={session.id}
                className="flex flex-wrap items-center gap-4 rounded-xl border p-4"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{session.device}</span>
                    {session.current && (
                      <Badge variant="default" className="text-xs">
                        Current session
                      </Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {session.browser}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {session.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe size={12} />
                      {session.ip}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    {session.lastActive}
                  </span>
                  {!session.current && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => revokeSession(session.id)}
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
          {sessions.length === 0 && (
            <p className="py-8 text-center text-muted-foreground">
              No active sessions found.
            </p>
          )}
        </CardContent>
      </Card>
    </PageStack>
  );
}
