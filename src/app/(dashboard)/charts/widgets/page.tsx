"use client";
import {
  DollarSign, Users, ShoppingBag, Eye, ArrowUpRight, ArrowDownRight, Sparkles,
  Chrome, Globe, Server, Activity, Target,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, Progress } from "@/components/ui";
import { ChartTip, Ring, StatCard } from "@/components/shared";
import { spA, spB, spC, spD, countries, ax } from "@/lib/data";

const wkB = ["M","T","W","T","F","S","S"].map((d, i) => ({ d, v: 40 + Math.sin(i) * 22 + i * 6 }));

export default function AnalyticsWidgets() {
  return (
    <div className="sy">
      <div className="gr g-4 g2">
        {[
          { icon: DollarSign, grad: "linear-gradient(135deg,#3b82f6,#1d4ed8)", value: "$28.4K", label: "Daily Revenue", change: "12.8%", up: true, spark: spC, color: "#2563eb" },
          { icon: Users, grad: "linear-gradient(135deg,#10b981,#059669)", value: "4,209", label: "Active Users", change: "8.2%", up: true, spark: spA, color: "#10b981" },
          { icon: ShoppingBag, grad: "linear-gradient(135deg,#7c3aed,#6d28d9)", value: "847", label: "Orders", change: "4.1%", up: true, spark: spD, color: "#7c3aed" },
          { icon: Eye, grad: "linear-gradient(135deg,#f59e0b,#d97706)", value: "12.4K", label: "Page Views", change: "2.4%", up: false, spark: spB, color: "#f59e0b" },
        ].map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      <div className="gr g-31 g2">
        <div className="aw-gc" style={{ minHeight: 200 }}>
          <div className="fb" style={{ marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.86 }}>Total Revenue</div>
              <div style={{ fontSize: 36, fontWeight: 800, marginTop: 6, letterSpacing: "-.03em" }}>$284,920</div>
            </div>
            <span
              style={{
                background: "rgba(255,255,255,.18)", padding: "5px 10px", borderRadius: 20,
                fontSize: 13, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4,
              }}
            >
              <ArrowUpRight size={14} />+18.4%
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,.18)" }}>
            <div>
              <div style={{ fontSize: 11.5, opacity: 0.78 }}>This Month</div>
              <div style={{ fontSize: 17, fontWeight: 800, marginTop: 3 }}>$48.2K</div>
            </div>
            <div>
              <div style={{ fontSize: 11.5, opacity: 0.78 }}>Last Month</div>
              <div style={{ fontSize: 17, fontWeight: 800, marginTop: 3 }}>$40.7K</div>
            </div>
            <div>
              <div style={{ fontSize: 11.5, opacity: 0.78 }}>Target</div>
              <div style={{ fontSize: 17, fontWeight: 800, marginTop: 3 }}>$55K</div>
            </div>
          </div>
        </div>

        <Card style={{ textAlign: "center", padding: 22 }}>
          <div className="aw-pu">
            <Activity size={20} />
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-.03em" }}>1,284</div>
          <div style={{ fontSize: 13, color: "var(--mt-fg)", fontWeight: 600 }}>Active Visitors Now</div>
          <div className="fc" style={{ justifyContent: "center", gap: 5, marginTop: 8, color: "#10b981", fontSize: 12, fontWeight: 700 }}>
            <Sparkles size={13} />Live tracking
          </div>
        </Card>
      </div>

      <div className="gr g-2 g2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Engagement by day</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wkB} margin={{ top: 6, right: 8, left: -22, bottom: 0 }}>
                  <XAxis dataKey="d" tickLine={false} axisLine={false} tick={ax} />
                  <YAxis tickLine={false} axisLine={false} tick={ax} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "var(--mt)" }} />
                  <Bar dataKey="v" radius={[7, 7, 0, 0]} barSize={22} fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Goal Progress</CardTitle>
            <CardDescription>Quarterly targets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="gr g-3 g3" style={{ marginTop: 6 }}>
              {[
                { l: "Sales", p: 78, c: "#2563eb" },
                { l: "Marketing", p: 64, c: "#7c3aed" },
                { l: "Retention", p: 91, c: "#10b981" },
              ].map((g, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <Ring pct={g.p} color={g.c} size={92} stroke={8} />
                  <div style={{ fontSize: 13, fontWeight: 700, marginTop: 6 }}>{g.l}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="gr g-2 g2">
        <Card>
          <CardHeader>
            <CardTitle>Browser Statistics</CardTitle>
            <CardDescription>Top user agents</CardDescription>
          </CardHeader>
          <CardContent>
            {[
              { n: "Chrome", v: 62, c: "#f59e0b", ic: Chrome },
              { n: "Safari", v: 18, c: "#06b6d4", ic: Globe },
              { n: "Firefox", v: 10, c: "#ef4444", ic: Globe },
              { n: "Edge", v: 7, c: "#2563eb", ic: Globe },
              { n: "Other", v: 3, c: "#7c3aed", ic: Globe },
            ].map((b, i) => (
              <div key={i} className="fc g3" style={{ marginBottom: 10 }}>
                <div className="aw-bi" style={{ background: b.c }}><b.ic size={14} /></div>
                <div style={{ flex: 1 }}>
                  <div className="fb" style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                    <span>{b.n}</span><span>{b.v}%</span>
                  </div>
                  <div className="aw-hb"><div className="aw-hf" style={{ background: b.c, width: `${b.v}%` }} /></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
            <CardDescription>Users by region</CardDescription>
          </CardHeader>
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
      </div>

      <div className="gr g-2 g2">
        <Card>
          <CardHeader>
            <CardTitle className="fc g2"><Server size={16} />Server Health</CardTitle>
          </CardHeader>
          <CardContent>
            {[
              { l: "CPU", v: 48, c: "#10b981" },
              { l: "Memory", v: 72, c: "#f59e0b" },
              { l: "Disk", v: 86, c: "#ef4444" },
              { l: "Network", v: 32, c: "#2563eb" },
            ].map((m, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div className="fb" style={{ fontSize: 13, fontWeight: 700, marginBottom: 5 }}>
                  <span style={{ color: "var(--mt-fg)" }}>{m.l}</span>
                  <span style={{ color: m.c }}>{m.v}%</span>
                </div>
                <div className="aw-hb"><div className="aw-hf" style={{ background: m.c, width: `${m.v}%` }} /></div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="fc g2"><Target size={16} />Quarterly Goals</CardTitle>
          </CardHeader>
          <CardContent style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { l: "Revenue Target", t: "$248K of $300K", p: 82, c: "#2563eb" },
              { l: "New Customers", t: "1,840 of 2,200", p: 84, c: "#10b981" },
              { l: "Customer Retention", t: "94% of 95%", p: 99, c: "#7c3aed" },
              { l: "Support Response", t: "2.4h of 3h", p: 80, c: "#f59e0b" },
            ].map((g, i) => (
              <div key={i} style={{ padding: 11, border: "1px solid var(--bd)", borderRadius: 11 }}>
                <div className="fb" style={{ marginBottom: 5 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{g.l}</div>
                    <div style={{ fontSize: 11.5, color: "var(--mt-fg)" }}>{g.t}</div>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 800, color: g.c }}>{g.p}%</span>
                </div>
                <div className="aw-hb"><div className="aw-hf" style={{ background: g.c, width: `${g.p}%` }} /></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
