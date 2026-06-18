export const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const sp = (a) => a.map((v, i) => ({ i, v }));
export const spA = sp([12, 18, 15, 24, 22, 30, 28, 38, 42]);
export const spB = sp([40, 38, 42, 30, 34, 28, 26, 22, 18]);
export const spC = sp([10, 14, 13, 20, 26, 24, 32, 36, 44]);
export const spD = sp([22, 20, 24, 26, 22, 28, 30, 34, 40]);

export const revData = months.map((m, i) => ({
  m,
  rev: 32 + i * 7 + Math.round(Math.sin(i) * 4),
  profit: 14 + i * 4 + Math.round(Math.cos(i) * 3),
}));

export const catData = [
  { name: "Electronics", value: 42, color: "#2563eb" },
  { name: "Fashion", value: 26, color: "#06b6d4" },
  { name: "Home", value: 19, color: "#7c3aed" },
  { name: "Others", value: 13, color: "#94a3b8" },
];

export const trafData = [
  { ch: "Direct", v: 4200 },
  { ch: "Organic", v: 6800 },
  { ch: "Referral", v: 3100 },
  { ch: "Social", v: 5400 },
  { ch: "Email", v: 2300 },
  { ch: "Paid", v: 3900 },
];

export const orders = [
  { id: "#PX-7821", cust: "Olivia Bennett", date: "Dec 12, 2025", amt: "$1,249.00", status: "Completed", v: "default", ini: "OB", c: "#2563eb" },
  { id: "#PX-7820", cust: "Liam Carter", date: "Dec 12, 2025", amt: "$329.50", status: "Processing", v: "secondary", ini: "LC", c: "#06b6d4" },
  { id: "#PX-7819", cust: "Sophia Nguyen", date: "Dec 11, 2025", amt: "$849.00", status: "Pending", v: "outline", ini: "SN", c: "#7c3aed" },
  { id: "#PX-7818", cust: "Noah Williams", date: "Dec 11, 2025", amt: "$2,150.00", status: "Completed", v: "default", ini: "NW", c: "#f59e0b" },
  { id: "#PX-7817", cust: "Emma Davis", date: "Dec 10, 2025", amt: "$76.20", status: "Refunded", v: "destructive", ini: "ED", c: "#10b981" },
  { id: "#PX-7816", cust: "James Miller", date: "Dec 10, 2025", amt: "$540.00", status: "Completed", v: "default", ini: "JM", c: "#f43f5e" },
];

export const products = [
  { n: "Aurora Wireless Headset", cat: "Electronics", sales: "1,284", rev: "$84,120", c: "#2563eb", ini: "AW" },
  { n: "Nimbus Smart Watch", cat: "Wearables", sales: "986", rev: "$62,400", c: "#06b6d4", ini: "NS" },
  { n: "Lumen Desk Lamp", cat: "Home", sales: "742", rev: "$28,900", c: "#7c3aed", ini: "LD" },
  { n: "Vertex Keyboard", cat: "Electronics", sales: "655", rev: "$41,200", c: "#f59e0b", ini: "VM" },
];

export const visitData = Array.from({ length: 14 }, (_, i) => ({
  d: `${i + 1}`,
  visitors: 2000 + Math.round(Math.sin(i / 2) * 800) + i * 120,
  sessions: 1400 + Math.round(Math.cos(i / 2) * 500) + i * 90,
}));

export const devData = [
  { name: "Desktop", value: 54, color: "#2563eb" },
  { name: "Mobile", value: 34, color: "#06b6d4" },
  { name: "Tablet", value: 12, color: "#7c3aed" },
];

export const countries = [
  { f: "🇺🇸", n: "United States", v: "38,420", pct: 84 },
  { f: "🇬🇧", n: "United Kingdom", v: "18,210", pct: 58 },
  { f: "🇩🇪", n: "Germany", v: "12,640", pct: 42 },
  { f: "🇮🇳", n: "India", v: "9,830", pct: 30 },
  { f: "🇨🇦", n: "Canada", v: "5,120", pct: 16 },
];

export const ax = { fill: "var(--mt-fg)", fontSize: 11.5, fontWeight: 600 };
