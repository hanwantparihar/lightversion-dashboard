// ── Calendar mock data ────────────────────────────────────────────────────────

export type CalendarEvent = {
  id: string;
  title: string;
  date: number; // day of month
  month: number; // 0-indexed
  year: number;
  time?: string;
  color: string;
  category: "meeting" | "deadline" | "reminder" | "event";
};

const Y = 2026;
const M = 6; // July (0-indexed)

export const CALENDAR_EVENTS: CalendarEvent[] = [
  { id: "e1",  title: "Team Standup",         date: 1,  month: M, year: Y, time: "9:00 AM",  color: "#2563eb", category: "meeting" },
  { id: "e2",  title: "Design Review",         date: 3,  month: M, year: Y, time: "2:00 PM",  color: "#7c3aed", category: "meeting" },
  { id: "e3",  title: "API v3 Deadline",       date: 10, month: M, year: Y,                   color: "#ef4444", category: "deadline" },
  { id: "e4",  title: "Q3 Campaign Kickoff",   date: 14, month: M, year: Y, time: "11:00 AM", color: "#f59e0b", category: "event" },
  { id: "e5",  title: "Board Presentation",    date: 17, month: M, year: Y, time: "3:30 PM",  color: "#10b981", category: "meeting" },
  { id: "e6",  title: "Billing Reminder",      date: 18, month: M, year: Y,                   color: "#f59e0b", category: "reminder" },
  { id: "e7",  title: "Dashboard Launch",      date: 22, month: M, year: Y, time: "10:00 AM", color: "#2563eb", category: "event" },
  { id: "e8",  title: "Security Audit",        date: 24, month: M, year: Y, time: "1:00 PM",  color: "#ef4444", category: "meeting" },
  { id: "e9",  title: "Monthly Retrospective", date: 30, month: M, year: Y, time: "4:00 PM",  color: "#7c3aed", category: "meeting" },
  { id: "e10", title: "Team Standup",          date: 7,  month: M, year: Y, time: "9:00 AM",  color: "#2563eb", category: "meeting" },
  { id: "e11", title: "Sprint Planning",       date: 7,  month: M, year: Y, time: "2:00 PM",  color: "#10b981", category: "meeting" },
  { id: "e12", title: "Mobile Alpha Review",   date: 28, month: M, year: Y, time: "11:00 AM", color: "#06b6d4", category: "meeting" },
];
