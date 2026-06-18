"use client";

import { useState } from "react";
import {
  ShoppingBag,
  Check,
  Activity,
  TrendingDown,
  Filter,
  Download,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { PageStack, StatsGrid, OrdersTable } from "@/components";
import { orders, spA, spB, spC, spD } from "@/lib/data";

export default function Orders() {
  const [tab, setTab] = useState("All");
  const tabs = ["All", "Completed", "Processing", "Pending", "Refunded"];
  const filtered =
    tab === "All" ? orders : orders.filter((o) => o.status === tab);

  return (
    <PageStack>
      <StatsGrid
        stats={[
          {
            icon: ShoppingBag,
            grad: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
            value: "2,847",
            label: "Total Orders",
            change: "8.2%",
            up: true,
            spark: spA,
            color: "#2563eb",
          },
          {
            icon: Check,
            grad: "linear-gradient(135deg,#10b981,#059669)",
            value: "2,103",
            label: "Completed",
            change: "6.4%",
            up: true,
            spark: spC,
            color: "#10b981",
          },
          {
            icon: Activity,
            grad: "linear-gradient(135deg,#f59e0b,#d97706)",
            value: "512",
            label: "Processing",
            change: "2.1%",
            up: true,
            spark: spD,
            color: "#f59e0b",
          },
          {
            icon: TrendingDown,
            grad: "linear-gradient(135deg,#f43f5e,#e11d48)",
            value: "232",
            label: "Refunded",
            change: "0.9%",
            up: false,
            spark: spB,
            color: "#f43f5e",
          },
        ]}
      />

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              {tabs.map((t) => (
                <TabsTrigger key={t} value={t}>
                  {t}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="fc g2">
            <Button variant="outline" size="sm">
              <Filter size={14} className="mr-1" />
              Filter
            </Button>
            <Button size="sm">
              <Download size={14} className="mr-1" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <OrdersTable orders={filtered} emptyMessage="No orders." />
          <div className="fb px-5 py-3.5 text-[13px] font-semibold text-muted-foreground">
            <span>
              Showing {filtered.length} of {orders.length}
            </span>
            <div className="fc g2">
              <Button variant="outline" size="sm">
                Previous
              </Button>
              <Button size="sm">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageStack>
  );
}
