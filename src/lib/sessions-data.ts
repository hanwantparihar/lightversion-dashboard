export type ActiveSession = {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  lastActive: string;
  current: boolean;
};

export const initialSessions: ActiveSession[] = [
  {
    id: "sess-1",
    device: "Windows PC",
    browser: "Chrome 121",
    location: "New York, US",
    ip: "192.168.1.42",
    lastActive: "Active now",
    current: true,
  },
  {
    id: "sess-2",
    device: "iPhone 15",
    browser: "Safari 17",
    location: "New York, US",
    ip: "192.168.1.88",
    lastActive: "2 hours ago",
    current: false,
  },
  {
    id: "sess-3",
    device: "MacBook Pro",
    browser: "Firefox 122",
    location: "San Francisco, US",
    ip: "10.0.0.15",
    lastActive: "Yesterday",
    current: false,
  },
  {
    id: "sess-4",
    device: "iPad Air",
    browser: "Safari 17",
    location: "London, UK",
    ip: "172.16.0.22",
    lastActive: "3 days ago",
    current: false,
  },
];
