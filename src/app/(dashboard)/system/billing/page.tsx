"use client";

import Link from "next/link";
import {
  CreditCard,
  ArrowRight,
  DollarSign,
  Receipt,
  Zap,
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
import { PageStack, StatsGrid } from "@/components";
import {
  currentSubscription,
  paymentHistory,
  billingPlans,
} from "@/lib/billing-data";
import { spC, spA, spD } from "@/lib/data";

export default function BillingPage() {
  const currentPlan = billingPlans.find((p) => p.id === currentSubscription.planId);

  return (
    <PageStack>
      <StatsGrid
        stats={[
          {
            icon: CreditCard,
            grad: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
            value: currentSubscription.planName,
            label: "Current Plan",
            change: currentSubscription.status,
            up: true,
            spark: spC,
            color: "#2563eb",
          },
          {
            icon: DollarSign,
            grad: "linear-gradient(135deg,#06b6d4,#0891b2)",
            value: `$${currentSubscription.price}`,
            label: "Monthly Cost",
            change: `Renews ${currentSubscription.renewsAt}`,
            up: true,
            spark: spA,
            color: "#06b6d4",
          },
          {
            icon: Receipt,
            grad: "linear-gradient(135deg,#7c3aed,#6d28d9)",
            value: String(paymentHistory.length),
            label: "Invoices",
            change: "All paid",
            up: true,
            spark: spD,
            color: "#7c3aed",
          },
          {
            icon: Zap,
            grad: "linear-gradient(135deg,#10b981,#059669)",
            value: currentSubscription.provider === "stripe" ? "Stripe" : "Razorpay",
            label: "Payment Provider",
            change: "Connected",
            up: true,
            spark: spA,
            color: "#10b981",
          },
        ]}
      />

      <div className="gr g-2 g2">
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Manage your active plan and billing cycle</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">{currentPlan?.name} Plan</p>
                  <p className="text-sm text-muted-foreground">
                    {currentPlan?.description}
                  </p>
                </div>
                <Badge>{currentSubscription.status}</Badge>
              </div>
              <p className="mt-3 text-2xl font-extrabold">
                ${currentSubscription.price}
                <span className="text-sm font-normal text-muted-foreground">
                  /{currentSubscription.interval}
                </span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Next billing date: {currentSubscription.renewsAt}
              </p>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link href="/system/billing/subscription">
                Manage subscription
                <ArrowRight size={14} />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plans & Pricing</CardTitle>
            <CardDescription>Compare plans and upgrade your subscription</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              {billingPlans.length} plans available — from Starter at $29/mo to
              Enterprise at $399/mo.
            </p>
            <Button asChild className="w-full">
              <Link href="/system/billing/plans">
                View all plans
                <ArrowRight size={14} />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
          <CardDescription>Your latest payment history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 font-semibold">Invoice</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Plan</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((inv) => (
                  <tr key={inv.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{inv.id}</td>
                    <td className="py-3 text-muted-foreground">{inv.date}</td>
                    <td className="py-3">{inv.plan}</td>
                    <td className="py-3 font-semibold">${inv.amount}</td>
                    <td className="py-3">
                      <Badge
                        variant={
                          inv.status === "Paid"
                            ? "default"
                            : inv.status === "Failed"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {inv.status}
                      </Badge>
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
