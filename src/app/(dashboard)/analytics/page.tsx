"use client";
import { Eye, Users, Activity, TrendingDown, Monitor, Smartphone, Tablet } from "lucide-react";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, Progress } from "@/components/ui";
import { ChartTip, StatCard } from "@/components/shared";
import { visitData, devData, countries, spA, spB, spC, spD, ax } from "@/lib/data";

export default function Analytics() {
  return (
    <div className="sy">
      <div className="gr g-4 g2">
        {[
          { icon: Eye, grad: "linear-gradient(135deg,#3b82f6,#1d4ed8)", value: "92,481", label: "Page Views", change: "18.2%", up: true, spark: spC, color: "#2563eb" },
          { icon: Users, grad: "linear-gradient(135deg,#06b6d4,#0891b2)", value: "38,209", label: "Unique Visitors", change: "9.6%", up: true, spark: spA, color: "#06b6d4" },
          { icon: Activity, grad: "linear-gradient(135deg,#7c3aed,#6d28d9)", value: "4m 18s", label: "Avg Session", change: "2.3%", up: true, spark: spD, color: "#7c3aed" },
          { icon: TrendingDown, grad: "linear-gradient(135deg,#f43f5e,#e11d48)", value: "38.4%", label: "Bounce Rate", change: "3.1%", up: false, spark: spB, color: "#f43f5e" },
        ].map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      <div className="gr g-31 g2">
        <Card>
          <CardHeader style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <CardTitle>Visitors & Sessions</CardTitle>
              <CardDescription>Last 14 days</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={visitData} margin={{ top: 8, right: 6, left: -14, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="var(--bd)" vertical={false} />
                  <XAxis dataKey="d" tickLine={false} axisLine={false} tick={ax} />
                  <YAxis tickLine={false} axisLine={false} tick={ax} />
                  <Tooltip content={<ChartTip />} />
                  <Line type="monotone" dataKey="visitors" name="Visitors" stroke="#2563eb" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="sessions" name="Sessions" stroke="#06b6d4" strokeWidth={2.5} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Devices</CardTitle></CardHeader>
          <CardContent>
            <div style={{ height: 190 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={devData} dataKey="value" innerRadius={58} outerRadius={86} paddingAngle={3} stroke="none">
                    {devData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip content={<ChartTip suffix="%" />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-[-113px] mb-[105px] text-center pointer-events-none" >
              <div style={{ fontSize: 24, fontWeight: 800 }}>100%</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[["Desktop", "54%", "#2563eb", Monitor], ["Mobile", "34%", "#06b6d4", Smartphone], ["Tablet", "12%", "#7c3aed", Tablet]].map(([n, p, c, Ic], i) => (
                <div key={i} className="fc" style={{ gap: 8, fontSize: 13 }}>
                  <Ic size={15} color={c as string} />
                  <span style={{ color: "var(--mt-fg)", fontWeight: 600 }}>{n as string}</span>
                  <b style={{ marginLeft: "auto" }}>{p as string}</b>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="gr g-2 g2">
        <Card>
          <CardHeader><CardTitle>Top Countries</CardTitle></CardHeader>
          <CardContent style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {countries.map((c, i) => (
              <div key={i} className="fc g3">
                <span style={{ fontSize: 20 }}>{c.f}</span>
                <span style={{ fontSize: 13, fontWeight: 700, width: 120, flexShrink: 0 }}>{c.n}</span>
                <Progress value={c.pct} />
                <span style={{ fontSize: 13, fontWeight: 700, width: 55, textAlign: "right", flexShrink: 0 }}>{c.v}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Monthly Goals</CardTitle></CardHeader>
          <CardContent style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[{ l: "Revenue Target", p: 84 }, { l: "New Signups", p: 67 }, { l: "Retention Rate", p: 92 }, { l: "Support SLA", p: 58 }].map((g, i) => (
              <div key={i}>
                <div className="fb" style={{ fontSize: 13, fontWeight: 700, marginBottom: 5 }}>
                  <span>{g.l}</span>
                  <span>{g.p}%</span>
                </div>
                <Progress value={g.p} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
