// ── Dev Tools mock data ────────────────────────────────────────────────────────

// ── SDK Docs ──────────────────────────────────────────────────────────────────
export type DocSection = {
  id: string;
  title: string;
  category: string;
  description: string;
  code: Record<"ts" | "python" | "curl", string>;
};

export const SDK_DOCS: DocSection[] = [
  {
    id: "auth",
    title: "Authentication",
    category: "Getting Started",
    description: "Authenticate all requests using your API key in the Authorization header.",
    code: {
      ts:     `import { NexoraClient } from "@nexora/sdk";\n\nconst client = new NexoraClient({\n  apiKey: process.env.NEXORA_API_KEY,\n});\n\n// Verify your key\nconst { valid } = await client.auth.verify();\nconsole.log("Key valid:", valid);`,
      python: `from nexora import NexoraClient\n\nclient = NexoraClient(api_key=os.environ["NEXORA_API_KEY"])\n\n# Verify your key\nresult = client.auth.verify()\nprint("Key valid:", result["valid"])`,
      curl:   `curl -X GET https://api.nexoraai.com/v1/auth/verify \\\n  -H "Authorization: Bearer YOUR_API_KEY"`,
    },
  },
  {
    id: "users",
    title: "Users",
    category: "Resources",
    description: "List, create, update, and delete users in your workspace.",
    code: {
      ts:     `// List all users\nconst users = await client.users.list({ page: 1, limit: 20 });\n\n// Create a user\nconst user = await client.users.create({\n  name: "Jane Doe",\n  email: "jane@example.com",\n  role: "editor",\n});\n\n// Delete a user\nawait client.users.delete(user.id);`,
      python: `# List all users\nusers = client.users.list(page=1, limit=20)\n\n# Create a user\nuser = client.users.create(\n    name="Jane Doe",\n    email="jane@example.com",\n    role="editor"\n)\n\n# Delete\nclient.users.delete(user["id"])`,
      curl:   `# List users\ncurl -X GET "https://api.nexoraai.com/v1/users?page=1&limit=20" \\\n  -H "Authorization: Bearer YOUR_API_KEY"\n\n# Create user\ncurl -X POST https://api.nexoraai.com/v1/users \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"name":"Jane Doe","email":"jane@example.com","role":"editor"}'`,
    },
  },
  {
    id: "events",
    title: "Events & Webhooks",
    category: "Resources",
    description: "Subscribe to workspace events and receive real-time webhook deliveries.",
    code: {
      ts:     `// Register a webhook\nconst hook = await client.webhooks.create({\n  url: "https://yourapp.com/hooks/nexora",\n  events: ["user.created", "invoice.paid", "trial.expired"],\n});\n\n// Verify webhook signature\nconst isValid = client.webhooks.verify({\n  payload: rawBody,\n  signature: req.headers["x-nexora-signature"],\n  secret: process.env.WEBHOOK_SECRET,\n});`,
      python: `# Register a webhook\nhook = client.webhooks.create(\n    url="https://yourapp.com/hooks/nexora",\n    events=["user.created", "invoice.paid", "trial.expired"]\n)\n\n# Verify signature\nis_valid = client.webhooks.verify(\n    payload=raw_body,\n    signature=request.headers["X-Nexora-Signature"],\n    secret=os.environ["WEBHOOK_SECRET"]\n)`,
      curl:   `curl -X POST https://api.nexoraai.com/v1/webhooks \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"url":"https://yourapp.com/hooks","events":["user.created"]}'`,
    },
  },
  {
    id: "billing",
    title: "Billing & Subscriptions",
    category: "Resources",
    description: "Manage customer subscriptions, apply coupons, and retrieve invoices.",
    code: {
      ts:     `// Get current subscription\nconst sub = await client.billing.getSubscription();\n\n// Apply coupon\nawait client.billing.applyCoupon({ code: "SAVE50" });\n\n// List invoices\nconst invoices = await client.billing.listInvoices({ status: "paid" });`,
      python: `# Get subscription\nsub = client.billing.get_subscription()\n\n# Apply coupon\nclient.billing.apply_coupon(code="SAVE50")\n\n# List invoices\ninvoices = client.billing.list_invoices(status="paid")`,
      curl:   `curl -X GET https://api.nexoraai.com/v1/billing/subscription \\\n  -H "Authorization: Bearer YOUR_API_KEY"`,
    },
  },
  {
    id: "errors",
    title: "Error Handling",
    category: "Reference",
    description: "All API errors follow a standard structure with a code, message, and optional details.",
    code: {
      ts:     `import { NexoraError } from "@nexora/sdk";\n\ntry {\n  await client.users.create({ email: "bad-email" });\n} catch (err) {\n  if (err instanceof NexoraError) {\n    console.error(err.code);    // "validation_error"\n    console.error(err.message); // "Invalid email format"\n  }\n}`,
      python: `from nexora.exceptions import NexoraError\n\ntry:\n    client.users.create(email="bad-email")\nexcept NexoraError as e:\n    print(e.code)    # "validation_error"\n    print(e.message) # "Invalid email format"`,
      curl:   `{\n  "error": {\n    "code": "validation_error",\n    "message": "Invalid email format",\n    "field": "email"\n  }\n}`,
    },
  },
];

// ── API Playground endpoints ───────────────────────────────────────────────────
export type PlaygroundEndpoint = {
  id: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  description: string;
  params?: { name: string; in: "query" | "body" | "path"; required: boolean; type: string; defaultValue?: string }[];
  sampleResponse: string;
};

export const PLAYGROUND_ENDPOINTS: PlaygroundEndpoint[] = [
  {
    id: "e1", method: "GET", path: "/v1/users",
    description: "List all users in your workspace.",
    params: [
      { name: "page",  in: "query", required: false, type: "integer", defaultValue: "1"  },
      { name: "limit", in: "query", required: false, type: "integer", defaultValue: "20" },
      { name: "role",  in: "query", required: false, type: "string",  defaultValue: ""   },
    ],
    sampleResponse: JSON.stringify({ data: [{ id: "u_01", name: "Alice Morgan", email: "alice@nexora.ai", role: "owner" }], total: 1, page: 1 }, null, 2),
  },
  {
    id: "e2", method: "POST", path: "/v1/users",
    description: "Create a new user.",
    params: [
      { name: "name",  in: "body", required: true,  type: "string" },
      { name: "email", in: "body", required: true,  type: "string" },
      { name: "role",  in: "body", required: false, type: "string", defaultValue: "viewer" },
    ],
    sampleResponse: JSON.stringify({ id: "u_02", name: "New User", email: "user@example.com", role: "viewer", createdAt: "2026-07-01T09:00:00Z" }, null, 2),
  },
  {
    id: "e3", method: "GET", path: "/v1/billing/subscription",
    description: "Get the current workspace subscription.",
    params: [],
    sampleResponse: JSON.stringify({ plan: "Pro", status: "active", price: 129, interval: "month", renewsAt: "2026-08-01" }, null, 2),
  },
  {
    id: "e4", method: "POST", path: "/v1/billing/coupons/apply",
    description: "Apply a discount coupon to the current subscription.",
    params: [
      { name: "code", in: "body", required: true, type: "string" },
    ],
    sampleResponse: JSON.stringify({ success: true, discount: { type: "percent", value: 20 }, newPrice: 103.20 }, null, 2),
  },
  {
    id: "e5", method: "DELETE", path: "/v1/users/{id}",
    description: "Delete a user by ID.",
    params: [
      { name: "id", in: "path", required: true, type: "string" },
    ],
    sampleResponse: JSON.stringify({ success: true, deleted: "u_02" }, null, 2),
  },
  {
    id: "e6", method: "GET", path: "/v1/audit-logs",
    description: "Retrieve security audit logs.",
    params: [
      { name: "severity", in: "query", required: false, type: "string", defaultValue: "all" },
      { name: "limit",    in: "query", required: false, type: "integer", defaultValue: "50" },
    ],
    sampleResponse: JSON.stringify({ data: [{ action: "User login", actor: "alice@nexora.ai", severity: "info", timestamp: "2026-07-01T09:02:00Z" }], total: 1 }, null, 2),
  },
];
