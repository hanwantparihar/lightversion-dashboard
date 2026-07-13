"use client";

import { Webhook } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { PageStack } from "@/components";
import { webhookItems } from "@/lib/basic-modules-data";

export default function WebhooksPage() {
  return (
    <PageStack>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Webhook size={18} />
            Webhook Support
          </CardTitle>
          <CardDescription>
            Monitor event delivery health and connected webhook endpoints.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {webhookItems.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="font-semibold">{item.event}</div>
                    <div className="mt-1 font-mono text-xs text-muted-foreground">
                      {item.target}
                    </div>
                  </div>
                  <div className="text-sm font-medium">{item.status}</div>
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span>Deliveries: {item.deliveries}</span>
                  <span>Last delivery: {item.lastDelivery}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageStack>
  );
}
