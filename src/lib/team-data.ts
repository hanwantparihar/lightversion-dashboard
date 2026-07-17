// ── Team Collaboration mock data ──────────────────────────────────────────────

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "editor" | "viewer";
  avatar: string;
  status: "online" | "away" | "offline";
};

export type Workspace = {
  id: string;
  name: string;
  description: string;
  members: number;
  projects: number;
  color: string;
};

export type SharedProject = {
  id: string;
  name: string;
  workspace: string;
  status: "active" | "paused" | "completed";
  progress: number;
  members: TeamMember[];
  dueDate: string;
  tags: string[];
};

export type Comment = {
  id: string;
  author: TeamMember;
  content: string;
  timestamp: string;
  mentions: string[];
  replies?: Comment[];
};

export const TEAM_MEMBERS: TeamMember[] = [
  { id: "u1", name: "Alice Morgan", email: "alice@nexora.ai", role: "owner", avatar: "AM", status: "online" },
  { id: "u2", name: "Ben Clarke", email: "ben@nexora.ai", role: "admin", avatar: "BC", status: "online" },
  { id: "u3", name: "Cara Singh", email: "cara@nexora.ai", role: "editor", avatar: "CS", status: "away" },
  { id: "u4", name: "Dan Reeves", email: "dan@nexora.ai", role: "editor", avatar: "DR", status: "offline" },
  { id: "u5", name: "Eva Lopes", email: "eva@nexora.ai", role: "viewer", avatar: "EL", status: "online" },
  { id: "u6", name: "Frank Wu", email: "frank@nexora.ai", role: "viewer", avatar: "FW", status: "away" },
];

export const WORKSPACES: Workspace[] = [
  { id: "ws1", name: "Product Team", description: "Core product design and engineering", members: 12, projects: 8, color: "#2563eb" },
  { id: "ws2", name: "Marketing", description: "Campaigns, content, and brand growth", members: 6, projects: 5, color: "#7c3aed" },
  { id: "ws3", name: "Engineering", description: "Infrastructure, backend, and DevOps", members: 9, projects: 11, color: "#10b981" },
  { id: "ws4", name: "Design System", description: "Component library and design tokens", members: 4, projects: 3, color: "#f59e0b" },
];

export const SHARED_PROJECTS: SharedProject[] = [
  {
    id: "p1", name: "Dashboard Redesign", workspace: "Product Team", status: "active", progress: 68,
    members: TEAM_MEMBERS.slice(0, 3), dueDate: "Jul 30, 2026", tags: ["UI", "Design"],
  },
  {
    id: "p2", name: "Q3 Campaign Launch", workspace: "Marketing", status: "active", progress: 42,
    members: TEAM_MEMBERS.slice(1, 4), dueDate: "Aug 15, 2026", tags: ["Marketing", "Content"],
  },
  {
    id: "p3", name: "API v3 Migration", workspace: "Engineering", status: "paused", progress: 85,
    members: TEAM_MEMBERS.slice(2, 5), dueDate: "Jul 10, 2026", tags: ["Backend", "API"],
  },
  {
    id: "p4", name: "Component Audit", workspace: "Design System", status: "completed", progress: 100,
    members: TEAM_MEMBERS.slice(0, 2), dueDate: "Jun 28, 2026", tags: ["Components"],
  },
  {
    id: "p5", name: "Mobile App Alpha", workspace: "Product Team", status: "active", progress: 31,
    members: TEAM_MEMBERS.slice(3, 6), dueDate: "Sep 1, 2026", tags: ["Mobile", "Alpha"],
  },
];

export const COMMENTS: Comment[] = [
  {
    id: "c1",
    author: TEAM_MEMBERS[0],
    content: "Let's finalize the color tokens before Thursday's review. @Ben Clarke can you confirm the latest export?",
    timestamp: "10 min ago",
    mentions: ["Ben Clarke"],
    replies: [
      { id: "c1r1", author: TEAM_MEMBERS[1], content: "Sure, I'll have it ready by tomorrow morning.", timestamp: "8 min ago", mentions: [] },
    ],
  },
  {
    id: "c2",
    author: TEAM_MEMBERS[2],
    content: "Dashboard Redesign milestone 2 is ready for QA. @Dan Reeves please review the PR when you get a chance.",
    timestamp: "1 hour ago",
    mentions: ["Dan Reeves"],
    replies: [],
  },
  {
    id: "c3",
    author: TEAM_MEMBERS[4],
    content: "Marketing brief for Q3 is uploaded to shared drive. Tagging @Alice Morgan and @Ben Clarke for approval.",
    timestamp: "3 hours ago",
    mentions: ["Alice Morgan", "Ben Clarke"],
    replies: [
      { id: "c3r1", author: TEAM_MEMBERS[0], content: "Approved. Looks great!", timestamp: "2 hours ago", mentions: [] },
    ],
  },
];
