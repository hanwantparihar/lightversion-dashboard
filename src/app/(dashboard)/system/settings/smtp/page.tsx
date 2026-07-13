"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  DropdownSelect,
} from "@/components/ui";
import { PageStack } from "@/components";
import { smtpConfig } from "@/lib/basic-modules-data";

export default function SmtpSettingsPage() {
  const [encryption, setEncryption] = useState(smtpConfig.encryption);

  return (
    <PageStack>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail size={18} />
            SMTP Settings
          </CardTitle>
          <CardDescription>
            Configure your outbound email provider for alerts, auth, and support replies.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="smtp-host">SMTP Host</Label>
              <Input id="smtp-host" defaultValue={smtpConfig.host} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-port">Port</Label>
              <Input id="smtp-port" defaultValue={smtpConfig.port} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="smtp-user">Username</Label>
              <Input id="smtp-user" defaultValue={smtpConfig.username} />
            </div>
            <div className="space-y-2">
              <Label>Encryption</Label>
              <DropdownSelect
                value={encryption}
                onChange={setEncryption}
                options={[
                  { value: "TLS", label: "TLS" },
                  { value: "SSL", label: "SSL" },
                  { value: "None", label: "None" },
                ]}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="from-name">From Name</Label>
              <Input id="from-name" defaultValue={smtpConfig.fromName} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="from-email">From Email</Label>
              <Input id="from-email" defaultValue={smtpConfig.fromEmail} />
            </div>
          </div>

          <div className="rounded-xl border bg-muted/30 p-4">
            <div className="mb-3 text-sm font-semibold">Send Test Email</div>
            <div className="flex flex-wrap gap-2 items-center">
              <Input
                defaultValue={smtpConfig.testRecipient}
                className="max-w-md"
              />
              <Button>
                <Send size={14} />
                Send Test
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageStack>
  );
}
