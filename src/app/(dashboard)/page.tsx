"use client";
import {
  DollarSign, ShoppingBag, Users, Target, UserPlus, Star, CreditCard,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Card, CardHeader, CardContent, CardTitle, CardDescription,
  Tabs, TabsList, TabsTrigger,
} from "@/components/ui";
import { ChartTip, StatsGrid, OrdersTable, ProductsTable } from "@/components";
import {
  revData, catData, trafData, orders, products,
  spA, spB, spC, spD, ax,
} from "@/lib/data";

const actFeed = [
  { ico: UserPlus, c: "#2563eb", t: "New customer registered", d: "Olivia Bennett joined", time: "2m ago" },
  { ico: ShoppingBag, c: "#10b981", t: "New order #PX-7821", d: "Order placed for $1,249", time: "14m ago" },
  { ico: Star, c: "#f59e0b", t: "New 5-star review", d: "Aurora Headset reviewed", time: "1h ago" },
  { ico: CreditCard, c: "#7c3aed", t: "Payout processed", d: "$12,840 transferred", time: "3h ago" },
];

export default function Dashboard() {
  return (
    <div className="sy">
      <StatsGrid
        stats={[
          { icon: DollarSign, grad: "linear-gradient(135deg,#3b82f6,#1d4ed8)", value: "$108.4K", label: "Total Revenue", change: "12.8%", up: true, spark: spC, color: "#2563eb" },
          { icon: ShoppingBag, grad: "linear-gradient(135deg,#06b6d4,#0891b2)", value: "2,847", label: "Total Orders", change: "8.2%", up: true, spark: spA, color: "#06b6d4" },
          { icon: Users, grad: "linear-gradient(135deg,#7c3aed,#6d28d9)", value: "14,209", label: "New Customers", change: "4.1%", up: true, spark: spD, color: "#7c3aed" },
          { icon: Target, grad: "linear-gradient(135deg,#f59e0b,#d97706)", value: "3.24%", label: "Conversion Rate", change: "1.4%", up: false, spark: spB, color: "#f59e0b" },
        ]}
      />

      <div className="gr g-31 g2">
        <Card>
          <CardHeader style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Monthly revenue vs profit</CardDescription>
            </div>
            <Tabs defaultValue="y">
              <TabsList>
                <TabsTrigger value="y">Year</TabsTrigger>
                <TabsTrigger value="q">Quarter</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revData} margin={{ top: 8, right: 6, left: -14, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="var(--bd)" vertical={false} />
                  <XAxis dataKey="m" tickLine={false} axisLine={false} tick={ax} />
                  <YAxis tickLine={false} axisLine={false} tick={ax} tickFormatter={(v) => `$${v}k`} />
                  <Tooltip content={<ChartTip prefix="$" suffix="k" />} />
                  <Area type="monotone" dataKey="rev" name="Revenue" stroke="#2563eb" strokeWidth={2.5} fill="url(#gR)" />
                  <Area type="monotone" dataKey="profit" name="Profit" stroke="#06b6d4" strokeWidth={2.5} fill="url(#gP)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Sales by Category</CardTitle></CardHeader>
          <CardContent>
            <div style={{ height: 190 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={catData} dataKey="value" innerRadius={58} outerRadius={86} paddingAngle={3} stroke="none">
                    {catData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip content={<ChartTip suffix="%" />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-[-120px] mb-[105px] text-center" >
              <div className="text-2xl font-bold" >$108K</div>
              <div style={{ fontSize: 11.5, color: "var(--mt-fg)", fontWeight: 600 }}>Total</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {catData.map((c, i) => (
                <div key={i} className="fc" style={{ gap: 8, fontSize: 13 }}>
                  <span style={{ width: 9, height: 9, borderRadius: 3, background: c.color }} />
                  <span style={{ color: "var(--mt-fg)", fontWeight: 600 }}>{c.name}</span>
                  <b style={{ marginLeft: "auto" }}>{c.value}%</b>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="gr g-31 g2">
        <Card>
          <CardHeader><CardTitle>Recent Orders</CardTitle></CardHeader>
          <CardContent className="p-0">
            <OrdersTable orders={orders} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Activity Feed</CardTitle></CardHeader>
          <CardContent>
            {actFeed.map((a, i) => (
              <div
                key={i}
                className="fc"
                style={{
                  gap: 10,
                  padding: "10px 0",
                  borderBottom: i < actFeed.length - 1 ? "1px solid var(--bd)" : "none",
                }}
              >
                <div
                  style={{
                    width: 36, height: 36, borderRadius: 10,
                    display: "grid", placeItems: "center", flexShrink: 0,
                    background: `${a.c}1a`, color: a.c,
                  }}
                >
                  <a.ico size={17} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{a.t}</div>
                  <div style={{ fontSize: 12, color: "var(--mt-fg)", marginTop: 1 }}>{a.d}</div>
                </div>
                <div style={{ fontSize: 11, color: "var(--mt-fg)", fontWeight: 600, whiteSpace: "nowrap" }}>{a.time}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="gr g-2 g2">
        <Card>
          <CardHeader><CardTitle>Top Products</CardTitle></CardHeader>
          <CardContent className="p-0">
            <ProductsTable products={products} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Traffic Sources</CardTitle></CardHeader>
          <CardContent>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trafData} margin={{ top: 8, right: 6, left: -14, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="var(--bd)" vertical={false} />
                  <XAxis dataKey="ch" tickLine={false} axisLine={false} tick={ax} />
                  <YAxis tickLine={false} axisLine={false} tick={ax} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: "var(--mt)" }} />
                  <Bar dataKey="v" name="Visits" radius={[7, 7, 0, 0]} barSize={30}>
                    {trafData.map((_, i) => <Cell key={i} fill={i % 2 ? "#06b6d4" : "#2563eb"} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
