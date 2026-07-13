export type BillingPlan = {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  description: string;
  features: string[];
  popular?: boolean;
};

export type PaymentProvider = "stripe" | "razorpay";

export type Invoice = {
  id: string;
  date: string;
  amount: number;
  status: "Paid" | "Pending" | "Failed";
  plan: string;
};

export const billingPlans: BillingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 29,
    interval: "month",
    description: "For small teams getting started",
    features: [
      "Up to 5 team members",
      "Basic analytics",
      "Email support",
      "5 GB storage",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 79,
    interval: "month",
    description: "For growing SaaS businesses",
    features: [
      "Up to 25 team members",
      "Advanced analytics & reports",
      "Priority support",
      "50 GB storage",
      "API access",
      "CRM module",
    ],
    popular: true,
  },
  {
    id: "business",
    name: "Business",
    price: 149,
    interval: "month",
    description: "For agencies and larger teams",
    features: [
      "Unlimited team members",
      "Custom reports & export",
      "24/7 support",
      "200 GB storage",
      "Full API & webhooks",
      "White-label branding",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 399,
    interval: "month",
    description: "Custom solutions at scale",
    features: [
      "Everything in Business",
      "Dedicated account manager",
      "SLA guarantee",
      "Unlimited storage",
      "SSO & advanced security",
      "Custom integrations",
    ],
  },
];

export const currentSubscription = {
  planId: "pro",
  planName: "Pro",
  price: 79,
  interval: "month" as const,
  status: "Active" as const,
  renewsAt: "Jul 23, 2025",
  paymentMethod: "Visa ending in 4242",
  provider: "stripe" as PaymentProvider,
};

export const paymentHistory: Invoice[] = [
  {
    id: "INV-2025-006",
    date: "Jun 23, 2025",
    amount: 79,
    status: "Paid",
    plan: "Pro",
  },
  {
    id: "INV-2025-005",
    date: "May 23, 2025",
    amount: 79,
    status: "Paid",
    plan: "Pro",
  },
  {
    id: "INV-2025-004",
    date: "Apr 23, 2025",
    amount: 79,
    status: "Paid",
    plan: "Pro",
  },
  {
    id: "INV-2025-003",
    date: "Mar 23, 2025",
    amount: 29,
    status: "Paid",
    plan: "Starter",
  },
];

export const stripeConfig = {
  connected: true,
  publishableKey: "pk_test_••••••••••••4242",
  webhookUrl: "https://yourapp.com/api/billing/stripe/webhook",
  lastSync: "Jun 22, 2025",
};

export const razorpayConfig = {
  connected: false,
  keyId: "",
  webhookUrl: "https://yourapp.com/api/billing/razorpay/webhook",
  lastSync: "—",
};
