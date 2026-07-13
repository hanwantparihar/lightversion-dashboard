"use client";

import { Activity } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { PageStack } from "@/components";
import { apiLogs } from "@/lib/basic-modules-data";

export default function ApiLogsPage() {
  return (
    <PageStack>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity size={18} />
            API Logs
          </CardTitle>
          <CardDescription>
            Inspect request activity, response status, and latency across your endpoints.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 font-semibold">Method</th>
                  <th className="pb-3 font-semibold">Endpoint</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Latency</th>
                  <th className="pb-3 font-semibold">Source</th>
                  <th className="pb-3 font-semibold">Created</th>
                </tr>
              </thead>
              <tbody>
                {apiLogs.map((log) => (
                  <tr key={log.id} className="border-b last:border-0">
                    <td className="py-3 font-semibold">{log.method}</td>
                    <td className="py-3 font-mono text-xs">{log.endpoint}</td>
                    <td className="py-3">{log.status}</td>
                    <td className="py-3">{log.latency}</td>
                    <td className="py-3">{log.source}</td>
                    <td className="py-3 text-muted-foreground">
                      {log.createdAt}
                    </td>
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
