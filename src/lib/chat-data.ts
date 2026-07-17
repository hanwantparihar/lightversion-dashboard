// ── Chat mock data ─────────────────────────────────────────────────────────────

export type ChatContact = {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "away" | "offline";
  lastMessage: string;
  lastTime: string;
  unread: number;
  isGroup?: boolean;
};

export type ChatMessage = {
  id: string;
  sender: string;
  avatar: string;
  content: string;
  time: string;
  isMine: boolean;
};

export const CHAT_CONTACTS: ChatContact[] = [
  { id: "ch1", name: "Alice Morgan",    avatar: "AM", status: "online",  lastMessage: "Sure, I'll have it ready!", lastTime: "2m",    unread: 0 },
  { id: "ch2", name: "Ben Clarke",      avatar: "BC", status: "online",  lastMessage: "Can you review the PR?",   lastTime: "14m",   unread: 2 },
  { id: "ch3", name: "Cara Singh",      avatar: "CS", status: "away",    lastMessage: "QA is done, looks great.", lastTime: "1h",    unread: 0 },
  { id: "ch4", name: "Dan Reeves",      avatar: "DR", status: "offline", lastMessage: "See you tomorrow.",        lastTime: "3h",    unread: 0 },
  { id: "ch5", name: "Eva Lopes",       avatar: "EL", status: "online",  lastMessage: "Budget approved ✅",       lastTime: "5h",    unread: 1 },
  { id: "ch6", name: "Product Team",    avatar: "PT", status: "online",  lastMessage: "Sprint planning @ 2pm",   lastTime: "10m",   unread: 4, isGroup: true },
  { id: "ch7", name: "Design System",   avatar: "DS", status: "online",  lastMessage: "New tokens pushed",       lastTime: "30m",   unread: 0, isGroup: true },
  { id: "ch8", name: "Engineering",     avatar: "EG", status: "away",    lastMessage: "Deploy to prod tonight",  lastTime: "2h",    unread: 7, isGroup: true },
];

export const CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  ch1: [
    { id: "m1", sender: "Alice Morgan", avatar: "AM", content: "Hey! Did you finish the component review?",     time: "10:02 AM", isMine: false },
    { id: "m2", sender: "You",          avatar: "ME", content: "Almost done, just the table variants left.",    time: "10:04 AM", isMine: true  },
    { id: "m3", sender: "Alice Morgan", avatar: "AM", content: "Great, no rush. Let me know when it's up.",     time: "10:05 AM", isMine: false },
    { id: "m4", sender: "You",          avatar: "ME", content: "Sure, I'll have it ready by EOD!",              time: "10:06 AM", isMine: true  },
  ],
  ch2: [
    { id: "m1", sender: "Ben Clarke",   avatar: "BC", content: "Morning! The API is live on staging.",          time: "9:15 AM",  isMine: false },
    { id: "m2", sender: "You",          avatar: "ME", content: "Perfect, I'll test it now.",                   time: "9:17 AM",  isMine: true  },
    { id: "m3", sender: "Ben Clarke",   avatar: "BC", content: "Can you review the PR when you're done?",      time: "9:20 AM",  isMine: false },
    { id: "m4", sender: "Ben Clarke",   avatar: "BC", content: "It's the last one for this sprint.",           time: "9:21 AM",  isMine: false },
  ],
  ch6: [
    { id: "m1", sender: "Cara Singh",   avatar: "CS", content: "Hey team, design review is at 2 PM today.",   time: "8:45 AM",  isMine: false },
    { id: "m2", sender: "Dan Reeves",   avatar: "DR", content: "I'll be there, sharing my screen.",            time: "8:50 AM",  isMine: false },
    { id: "m3", sender: "You",          avatar: "ME", content: "Same, I have the mockups ready.",              time: "8:52 AM",  isMine: true  },
    { id: "m4", sender: "Alice Morgan", avatar: "AM", content: "Sprint planning @ 2pm — don't forget!",       time: "9:00 AM",  isMine: false },
  ],
};
