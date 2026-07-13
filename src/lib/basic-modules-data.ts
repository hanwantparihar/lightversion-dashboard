export type ManagedFile = {
  id: string;
  name: string;
  type: "Image" | "Video" | "Document" | "Archive";
  size: string;
  folder: string;
  uploadedBy: string;
  storage: "Local" | "S3" | "Drive";
  updatedAt: string;
};

export type MediaItem = {
  id: string;
  name: string;
  category: "Banner" | "Product" | "Avatar" | "Template";
  size: string;
  resolution: string;
  color: string;
};

export type CloudStorage = {
  id: string;
  provider: "AWS S3" | "Google Drive" | "Dropbox";
  status: "Connected" | "Pending" | "Disconnected";
  usage: number;
  total: string;
  syncedAt: string;
};

export type ApiKeyItem = {
  id: string;
  name: string;
  key: string;
  scope: string;
  requests: string;
  lastUsed: string;
  status: "Active" | "Revoked";
};

export type ApiLogItem = {
  id: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  endpoint: string;
  status: number;
  latency: string;
  source: string;
  createdAt: string;
};

export type WebhookItem = {
  id: string;
  event: string;
  target: string;
  deliveries: string;
  lastDelivery: string;
  status: "Healthy" | "Retrying" | "Failed";
};

export type SupportTicket = {
  id: string;
  subject: string;
  customer: string;
  priority: "Low" | "Medium" | "High";
  status: "Open" | "Pending" | "Resolved";
  channel: "Email" | "Chat" | "Portal";
  description?: string;
  assignee?: string;
  updatedAt: string;
};

export type SupportMessage = {
  id: string;
  ticketId: string;
  sender: "customer" | "agent";
  author: string;
  message: string;
  createdAt: string;
};

export type SupportChat = {
  id: string;
  customer: string;
  plan: string;
  lastMessage: string;
  unread: number;
  active: boolean;
};

export const managedFiles: ManagedFile[] = [
  {
    id: "file-1",
    name: "pricing-sheet.pdf",
    type: "Document",
    size: "1.4 MB",
    folder: "Sales",
    uploadedBy: "Olivia Peterson",
    storage: "Local",
    updatedAt: "Jun 24, 2026",
  },
  {
    id: "file-2",
    name: "brand-assets.zip",
    type: "Archive",
    size: "18.9 MB",
    folder: "Branding",
    uploadedBy: "Sophia Nguyen",
    storage: "Drive",
    updatedAt: "Jun 22, 2026",
  },
  {
    id: "file-3",
    name: "dashboard-hero.png",
    type: "Image",
    size: "2.7 MB",
    folder: "Marketing",
    uploadedBy: "Emma Johnson",
    storage: "S3",
    updatedAt: "Jun 21, 2026",
  },
  {
    id: "file-4",
    name: "product-demo.mp4",
    type: "Video",
    size: "64.3 MB",
    folder: "Media",
    uploadedBy: "James Carter",
    storage: "S3",
    updatedAt: "Jun 20, 2026",
  },
];

export const mediaGallery: MediaItem[] = [
  {
    id: "media-1",
    name: "Landing Hero",
    category: "Banner",
    size: "1.2 MB",
    resolution: "1920x1080",
    color: "#2563eb",
  },
  {
    id: "media-2",
    name: "Founder Avatar",
    category: "Avatar",
    size: "320 KB",
    resolution: "512x512",
    color: "#7c3aed",
  },
  {
    id: "media-3",
    name: "CRM Preview",
    category: "Template",
    size: "980 KB",
    resolution: "1440x900",
    color: "#10b981",
  },
  {
    id: "media-4",
    name: "Product Card",
    category: "Product",
    size: "860 KB",
    resolution: "1200x1200",
    color: "#f59e0b",
  },
];

export const cloudStorageProviders: CloudStorage[] = [
  {
    id: "cloud-1",
    provider: "AWS S3",
    status: "Connected",
    usage: 72,
    total: "500 GB",
    syncedAt: "5 min ago",
  },
  {
    id: "cloud-2",
    provider: "Google Drive",
    status: "Connected",
    usage: 41,
    total: "2 TB",
    syncedAt: "20 min ago",
  },
  {
    id: "cloud-3",
    provider: "Dropbox",
    status: "Pending",
    usage: 0,
    total: "1 TB",
    syncedAt: "Not synced",
  },
];

export const apiKeys: ApiKeyItem[] = [
  {
    id: "key-1",
    name: "Production App",
    key: "sk_live_98b4...f321",
    scope: "Read / Write",
    requests: "182K",
    lastUsed: "2 min ago",
    status: "Active",
  },
  {
    id: "key-2",
    name: "Analytics Worker",
    key: "sk_live_a217...c941",
    scope: "Read only",
    requests: "48K",
    lastUsed: "1 hour ago",
    status: "Active",
  },
  {
    id: "key-3",
    name: "Legacy Integration",
    key: "sk_test_12ab...66de",
    scope: "Webhook",
    requests: "0",
    lastUsed: "Revoked",
    status: "Revoked",
  },
];

export const apiLogs: ApiLogItem[] = [
  {
    id: "log-1",
    method: "POST",
    endpoint: "/v1/leads",
    status: 201,
    latency: "182 ms",
    source: "Production App",
    createdAt: "2 min ago",
  },
  {
    id: "log-2",
    method: "GET",
    endpoint: "/v1/reports/revenue",
    status: 200,
    latency: "94 ms",
    source: "Analytics Worker",
    createdAt: "8 min ago",
  },
  {
    id: "log-3",
    method: "POST",
    endpoint: "/v1/webhooks/stripe",
    status: 500,
    latency: "410 ms",
    source: "Stripe",
    createdAt: "24 min ago",
  },
  {
    id: "log-4",
    method: "DELETE",
    endpoint: "/v1/api-keys/key-3",
    status: 204,
    latency: "66 ms",
    source: "Admin Console",
    createdAt: "1 hour ago",
  },
];

export const webhookItems: WebhookItem[] = [
  {
    id: "wh-1",
    event: "invoice.payment_succeeded",
    target: "https://app.example.com/api/stripe/webhook",
    deliveries: "1,824",
    lastDelivery: "3 min ago",
    status: "Healthy",
  },
  {
    id: "wh-2",
    event: "lead.created",
    target: "https://crm.example.com/hooks/lead-created",
    deliveries: "684",
    lastDelivery: "17 min ago",
    status: "Healthy",
  },
  {
    id: "wh-3",
    event: "subscription.cancelled",
    target: "https://ops.example.com/hooks/subscription",
    deliveries: "12",
    lastDelivery: "1 hour ago",
    status: "Retrying",
  },
];

export const supportTickets: SupportTicket[] = [
  {
    id: "TKT-1021",
    subject: "Unable to sync S3 assets",
    customer: "Acme Corp",
    priority: "High",
    status: "Open",
    channel: "Portal",
    description:
      "Our marketing team can upload files, but S3 sync stays pending and the asset never appears in the bucket.",
    assignee: "Sophia Nguyen",
    updatedAt: "5 min ago",
  },
  {
    id: "TKT-1018",
    subject: "Webhook signature mismatch",
    customer: "Bright Labs",
    priority: "Medium",
    status: "Pending",
    channel: "Email",
    description:
      "Webhook deliveries from billing succeed, but our receiver rejects the signature after the latest secret rotation.",
    assignee: "James Carter",
    updatedAt: "32 min ago",
  },
  {
    id: "TKT-1014",
    subject: "Need invoice copy for April",
    customer: "Greenfield Co",
    priority: "Low",
    status: "Resolved",
    channel: "Chat",
    description:
      "Customer requested a downloadable invoice copy for an older billing cycle.",
    assignee: "Olivia Peterson",
    updatedAt: "2 hours ago",
  },
];

export const supportMessages: SupportMessage[] = [
  {
    id: "msg-1",
    ticketId: "TKT-1021",
    sender: "customer",
    author: "Acme Corp",
    message:
      "We connected S3 yesterday, but new uploads remain in pending state and never show up in the bucket.",
    createdAt: "Jun 24, 2026 2:08 PM",
  },
  {
    id: "msg-2",
    ticketId: "TKT-1021",
    sender: "agent",
    author: "Sophia Nguyen",
    message:
      "I checked the storage module and the bucket credentials look valid. Can you confirm the IAM policy includes PutObject permissions?",
    createdAt: "Jun 24, 2026 2:14 PM",
  },
  {
    id: "msg-3",
    ticketId: "TKT-1018",
    sender: "customer",
    author: "Bright Labs",
    message:
      "Stripe webhook events reach us, but our service reports signature mismatch after we rotated the secret.",
    createdAt: "Jun 24, 2026 1:41 PM",
  },
  {
    id: "msg-4",
    ticketId: "TKT-1018",
    sender: "agent",
    author: "James Carter",
    message:
      "Please update the webhook secret in your staging environment and retry one delivery from the dashboard.",
    createdAt: "Jun 24, 2026 1:58 PM",
  },
  {
    id: "msg-5",
    ticketId: "TKT-1014",
    sender: "agent",
    author: "Olivia Peterson",
    message:
      "The invoice PDF has been regenerated and sent to your billing contact. Marking this ticket as resolved.",
    createdAt: "Jun 24, 2026 12:10 PM",
  },
];

export const supportChats: SupportChat[] = [
  {
    id: "chat-1",
    customer: "Sarah Mitchell",
    plan: "Business",
    lastMessage: "Can you help me connect Dropbox storage?",
    unread: 2,
    active: true,
  },
  {
    id: "chat-2",
    customer: "David Chen",
    plan: "Pro",
    lastMessage: "Webhook delivery is failing on our staging endpoint.",
    unread: 0,
    active: false,
  },
  {
    id: "chat-3",
    customer: "Lisa Thompson",
    plan: "Enterprise",
    lastMessage: "Need SMTP credentials rotated before next campaign.",
    unread: 1,
    active: true,
  },
];

export const smtpConfig = {
  provider: "SMTP",
  host: "smtp.mailprovider.com",
  port: "587",
  username: "notifications@nexora.ai",
  fromName: "Nexora AI",
  fromEmail: "hello@nexora.ai",
  encryption: "TLS",
  testRecipient: "owner@nexora.ai",
};

export function nextTicketId(tickets: SupportTicket[]): string {
  const next =
    tickets.reduce((max, ticket) => {
      const value = Number(ticket.id.replace("TKT-", ""));
      return Number.isNaN(value) ? max : Math.max(max, value);
    }, 1000) + 1;
  return `TKT-${next}`;
}

export function nextSupportMessageId(messages: SupportMessage[]): string {
  const next =
    messages.reduce((max, item) => {
      const value = Number(item.id.replace("msg-", ""));
      return Number.isNaN(value) ? max : Math.max(max, value);
    }, 0) + 1;
  return `msg-${next}`;
}
