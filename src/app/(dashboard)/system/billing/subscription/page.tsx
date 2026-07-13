"use client";

import { useState } from "react";
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Copy,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  Button,
  Badge,
  Input,
  Label,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { PageStack } from "@/components";
import {
  currentSubscription,
  stripeConfig,
  razorpayConfig,
  paymentHistory,
} from "@/lib/billing-data";

export default function SubscriptionPage() {
  const [provider, setProvider] = useState<"stripe" | "razorpay">("stripe");
  const [razorpayKey, setRazorpayKey] = useState("");
  const [copied, setCopied] = useState(false);

  function copyWebhook(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <PageStack>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard size={18} />
            Current Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border p-5">
            <div>
              <p className="text-lg font-bold">{currentSubscription.planName} Plan</p>
              <p className="text-sm text-muted-foreground">
                {currentSubscription.paymentMethod}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Renews on {currentSubscription.renewsAt}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold">
                ${currentSubscription.price}
                <span className="text-sm font-normal text-muted-foreground">
                  /mo
                </span>
              </p>
              <Badge className="mt-1">{currentSubscription.status}</Badge>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              Update payment method
            </Button>
            <Button variant="outline" size="sm" className="text-destructive">
              Cancel subscription
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Integrations</CardTitle>
          <CardDescription>
            Connect Stripe or Razorpay to accept payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={provider} onValueChange={(v) => setProvider(v as "stripe" | "razorpay")}>
            <TabsList className="mb-6">
              <TabsTrigger value="stripe">Stripe</TabsTrigger>
              <TabsTrigger value="razorpay">Razorpay</TabsTrigger>
            </TabsList>

            {provider === "stripe" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {stripeConfig.connected ? (
                    <CheckCircle2 size={18} className="text-emerald-500" />
                  ) : (
                    <XCircle size={18} className="text-destructive" />
                  )}
                  <span className="font-semibold">
                    {stripeConfig.connected ? "Stripe connected" : "Stripe not connected"}
                  </span>
                </div>
                <div className="space-y-2">
                  <Label>Publishable Key</Label>
                  <Input value={stripeConfig.publishableKey} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Webhook URL</Label>
                  <div className="flex gap-2">
                    <Input value={stripeConfig.webhookUrl} readOnly />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyWebhook(stripeConfig.webhookUrl)}
                    >
                      <Copy size={14} />
                      {copied ? "Copied" : "Copy"}
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Last synced: {stripeConfig.lastSync}
                </p>
                <Button>
                  <ExternalLink size={14} />
                  Open Stripe Dashboard
                </Button>
              </div>
            )}

            {provider === "razorpay" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {razorpayConfig.connected ? (
                    <CheckCircle2 size={18} className="text-emerald-500" />
                  ) : (
                    <XCircle size={18} className="text-destructive" />
                  )}
                  <span className="font-semibold">
                    {razorpayConfig.connected
                      ? "Razorpay connected"
                      : "Razorpay not connected"}
                  </span>
                </div>
                <div className="space-y-2">
                  <Label>Key ID</Label>
                  <Input
                    placeholder="rzp_test_xxxxxxxx"
                    value={razorpayKey}
                    onChange={(e) => setRazorpayKey(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Webhook URL</Label>
                  <div className="flex gap-2">
                    <Input value={razorpayConfig.webhookUrl} readOnly />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyWebhook(razorpayConfig.webhookUrl)}
                    >
                      <Copy size={14} />
                    </Button>
                  </div>
                </div>
                <Button disabled={!razorpayKey.trim()}>
                  Connect Razorpay
                </Button>
              </div>
            )}
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 font-semibold">Invoice</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((inv) => (
                  <tr key={inv.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{inv.id}</td>
                    <td className="py-3 text-muted-foreground">{inv.date}</td>
                    <td className="py-3 font-semibold">${inv.amount}</td>
                    <td className="py-3">
                      <Badge>{inv.status}</Badge>
                    </td>
                    <td className="py-3 text-right">
                      <Button variant="ghost" size="sm">
                        Download
                      </Button>
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
