"use client";

import { Cloud, Database, RefreshCw } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Progress,
} from "@/components/ui";
import { PageStack } from "@/components";
import { cloudStorageProviders } from "@/lib/basic-modules-data";

export default function StoragePage() {
  return (
    <PageStack>
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Cloud size={18} />
              Cloud Storage
            </CardTitle>
            <CardDescription>
              Connect buckets and drives to sync uploads across environments.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw size={14} />
            Sync Now
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-3">
          {cloudStorageProviders.map((provider) => (
            <Card key={provider.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Database size={16} />
                  {provider.provider}
                </CardTitle>
                <CardDescription>Status: {provider.status}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm font-medium">
                  Capacity: {provider.total}
                </div>
                <Progress value={provider.usage} />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{provider.usage}% used</span>
                  <span>{provider.syncedAt}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </PageStack>
  );
}
