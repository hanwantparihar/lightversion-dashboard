"use client";

import { Copy, KeyRound, Plus } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { PageStack } from "@/components";
import { apiKeys } from "@/lib/basic-modules-data";

export default function ApiKeysPage() {
  return (
    <PageStack>
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2">
              <KeyRound size={18} />
              API Keys
            </CardTitle>
            <CardDescription>
              Manage access tokens for internal apps, automations, and integrations.
            </CardDescription>
          </div>
          <Button size="sm">
            <Plus size={14} />
            Generate Key
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 font-semibold">Name</th>
                  <th className="pb-3 font-semibold">Key</th>
                  <th className="pb-3 font-semibold">Scope</th>
                  <th className="pb-3 font-semibold">Requests</th>
                  <th className="pb-3 font-semibold">Last Used</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{item.name}</td>
                    <td className="py-3">
                      <span className="mr-2 font-mono text-xs">{item.key}</span>
                      <Button variant="ghost" size="sm">
                        <Copy size={13} />
                      </Button>
                    </td>
                    <td className="py-3">{item.scope}</td>
                    <td className="py-3">{item.requests}</td>
                    <td className="py-3 text-muted-foreground">
                      {item.lastUsed}
                    </td>
                    <td className="py-3">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </PageStack>
  );
}
