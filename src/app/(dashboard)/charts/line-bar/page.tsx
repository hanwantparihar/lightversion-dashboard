"use client";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, ComposedChart, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui";
import { ChartTip } from "@/components/shared";
import { months, ax } from "@/lib/data";

const revT = months.map((m, i) => ({ m, profit: 18 + i * 2.2 + Math.sin(i) * 3, revenue: 38 + i * 3.8 + Math.cos(i) * 4 }));
const webT = months.map((m, i) => ({ m, organic: 8 + i * 2.8 + Math.sin(i / 2) * 3, paid: 5 + i * 1.8 + Math.cos(i / 2) * 2, social: 2 + i * 0.8 + Math.sin(i / 3) }));
const qR = [
  { q: "Q1'24", p: 32, sv: 18, sb: 14 },
  { q: "Q2'24", p: 28, sv: 22, sb: 16 },
  { q: "Q3'24", p: 38, sv: 25, sb: 19 },
  { q: "Q4'24", p: 46, sv: 28, sb: 20 },
  { q: "Q1'25", p: 26, sv: 24, sb: 22 },
  { q: "Q2'25", p: 52, sv: 30, sb: 28 },
];
const eng = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m, i) => ({ m, sessions: 1200 + i * 800, users: 1000 + i * 200, bounce: 48 - i * 5 }));
const tSrc = [
  { name: "Direct", value: 35, color: "#7c3aed" },
  { name: "Email", value: 12, color: "#ef4444" },
  { name: "Organic", value: 28, color: "#2563eb" },
  { name: "Referral", value: 10, color: "#10b981" },
  { name: "Social", value: 15, color: "#f59e0b" },
];

export default function ApexCharts() {
  return (
    <div className="sy">
      <div className="gr g-2 g2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue and profit</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revT} margin={{ top: 8, right: 14, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="var(--bd)" vertical={false} />
                  <XAxis dataKey="m" tickLine={false} axisLine={false} tick={ax} />
                  <YAxis tickLine={false} axisLine={false} tick={ax} tickFormatter={(v) => `$${v}k`} />
                  <Tooltip content={<ChartTip prefix="$" suffix="k" />} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12.5, fontWeight: 700, paddingTop: 10 }} />
                  <Line type="monotone" dataKey="profit" name="Profit" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3.5, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }} />
                  <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 3.5, fill: "#7c3aed", stroke: "#fff", strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Website Traffic</CardTitle>
            <CardDescription>Sources by month</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={webT} margin={{ top: 8, right: 14, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="go" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.25} /><stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity={0.25} /><stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} /><stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="var(--bd)" vertical={false} />
                  <XAxis dataKey="m" tickLine={false} axisLine={false} tick={ax} />
                  <YAxis tickLine={false} axisLine={false} tick={ax} tickFormatter={(v) => `${v}k`} />
                  <Tooltip content={<ChartTip suffix="k" />} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12.5, fontWeight: 700, paddingTop: 10 }} />
                  <Area type="monotone" dataKey="organic" name="Organic" stroke="#7c3aed" strokeWidth={2} fill="url(#go)" stackId="1" />
                  <Area type="monotone" dataKey="paid" name="Paid" stroke="#2563eb" strokeWidth={2} fill="url(#gp)" stackId="1" />
                  <Area type="monotone" dataKey="social" name="Social" stroke="#10b981" strokeWidth={2} fill="url(#gs)" stackId="1" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="gr g-2 g2">
        <Card>
          <CardHeader><CardTitle>Quarterly Revenue</CardTitle></CardHeader>
          <CardContent>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={qR} margin={{ top: 8, right: 14, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="var(--bd)" vertical={false} />
                  <XAxis dataKey="q" tickLine={false} axisLine={false} tick={ax} />
                  <YAxis tickLine={false} axisLine={false} tick={ax} tickFormatter={(v) => `$${v}k`} />
                  <Tooltip content={<ChartTip prefix="$" suffix="k" />} />
                  <Legend iconType="square" wrapperStyle={{ fontSize: 12.5, fontWeight: 700, paddingTop: 10 }} />
                  <Bar dataKey="p" name="Products" fill="#7c3aed" radius={[3, 3, 0, 0]} barSize={20} />
                  <Bar dataKey="sv" name="Services" fill="#2563eb" radius={[3, 3, 0, 0]} barSize={20} />
                  <Bar dataKey="sb" name="Subs" fill="#10b981" radius={[3, 3, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>User Engagement</CardTitle></CardHeader>
          <CardContent>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={eng} margin={{ top: 8, right: 6, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="var(--bd)" vertical={false} />
                  <XAxis dataKey="m" tickLine={false} axisLine={false} tick={ax} />
                  <YAxis yAxisId="l" tickLine={false} axisLine={false} tick={ax} />
                  <YAxis yAxisId="r" orientation="right" tickLine={false} axisLine={false} tick={ax} tickFormatter={(v) => `${v}%`} />
                  <Tooltip content={<ChartTip />} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12.5, fontWeight: 700, paddingTop: 10 }} />
                  <Bar yAxisId="l" dataKey="sessions" name="Sessions" fill="rgba(124,58,237,.18)" radius={[3, 3, 0, 0]} barSize={36} />
                  <Line yAxisId="r" type="monotone" dataKey="bounce" name="Bounce %" stroke="#ef4444" strokeWidth={2.2} dot={{ r: 4, fill: "#ef4444", stroke: "#fff", strokeWidth: 2 }} />
                  <Line yAxisId="l" type="monotone" dataKey="users" name="Users" stroke="#2563eb" strokeWidth={2.2} dot={{ r: 3.5, fill: "#2563eb", stroke: "#fff", strokeWidth: 2 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Traffic Sources</CardTitle></CardHeader>
        <CardContent>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={tSrc} dataKey="value" innerRadius={65} outerRadius={105} paddingAngle={2} stroke="none">
                  {tSrc.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip content={<ChartTip suffix="%" />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="fc" style={{ justifyContent: "center", gap: 16, flexWrap: "wrap", marginTop: 6 }}>
            {tSrc.map((s, i) => (
              <div key={i} className="fc g2" style={{ fontSize: 12.5, fontWeight: 700 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color }} />{s.name}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
