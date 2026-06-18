import type { AppUser } from "@/lib/users-data";

/** Logged-in admin shown in the topbar and profile popup. */
export const CURRENT_USER: AppUser = {
  id: 0,
  name: "Arjun Kapoor",
  firstName: "Arjun",
  lastName: "Kapoor",
  email: "arjun@nexoraai.com",
  phone: "+1 (555) 987-6543",
  location: "San Francisco, USA",
  company: "Nexora AI Inc.",
  jobTitle: "Platform Administrator",
  role: "Admin",
  status: "Active",
  date: "Jan 15, 2025",
  bio: "Building beautiful admin templates and managing platform operations.",
  timezone: "America/Los_Angeles",
  initials: "AK",
  avatarColor: "#2563eb",
  emailNotifications: true,
  pushNotifications: true,
  marketingEmails: false,
};

export type AppSettings = {
  workspaceName: string;
  language: string;
  timezone: string;
  dateFormat: string;
  theme: "light" | "dark" | "system";
  compactSidebar: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  weeklyDigest: boolean;
  twoFactorEnabled: boolean;
  sessionTimeout: string;
};

export const PROFILE_KEY = "nexora-ai-user-profile";

export const DEFAULT_APP_SETTINGS: AppSettings = {
  workspaceName: "Nexora AI",
  language: "en",
  timezone: "America/Los_Angeles",
  dateFormat: "MMM d, yyyy",
  theme: "system",
  compactSidebar: false,
  emailNotifications: true,
  pushNotifications: true,
  marketingEmails: false,
  weeklyDigest: true,
  twoFactorEnabled: false,
  sessionTimeout: "30",
};
