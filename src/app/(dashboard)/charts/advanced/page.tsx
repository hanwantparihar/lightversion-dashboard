"use client";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui";
import { ChartTip } from "@/components/shared";
import { ax } from "@/lib/data";

const radarD = [
  { s: "Speed", A: 90, B: 78 }, { s: "Reliability", A: 85, B: 88 },
  { s: "Comfort", A: 70, B: 92 }, { s: "Safety", A: 95, B: 82 },
  { s: "Efficiency", A: 80, B: 70 }, { s: "Price", A: 65, B: 85 },
];
const scA = Array.from({ length: 18 }, (_, i) => ({ x: 20 + i * 4 + Math.random() * 8, y: 40 + i * 3 + Math.random() * 20, z: 100 + Math.random() * 250 }));
const scB = Array.from({ length: 18 }, (_, i) => ({ x: 25 + i * 4 + Math.random() * 8, y: 70 - i * 1 + Math.random() * 22, z: 100 + Math.random() * 250 }));
const fwk = [
  { n: "React", v: 78 }, { n: "Vue", v: 56 }, { n: "Angular", v: 42 },
  { n: "Svelte", v: 28 }, { n: "Solid", v: 18 }, { n: "Astro", v: 22 },
];
const taskSt = [
  { name: "Done", value: 48, color: "#10b981" },
  { name: "In Progress", value: 28, color: "#2563eb" },
  { name: "Pending", value: 16, color: "#f59e0b" },
  { name: "Blocked", value: 8, color: "#ef4444" },
];
const weatherD = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d, i) => ({
  d, temp: 18 + Math.sin(i) * 4 + i * 1.2, humidity: 60 + Math.cos(i) * 12, wind: 8 + Math.abs(Math.sin(i * 2)) * 6,
}));

export default function AdvancedCharts() {
  return (
    <div className="sy">
      <div className="gr g-2 g2">
        <Card>
          <CardHeader>
            <CardTitle>Performance Comparison</CardTitle>
            <CardDescription>Product A vs Product B (radar)</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarD}>
                  <PolarGrid stroke="var(--bd)" />
                  <PolarAngleAxis dataKey="s" tick={ax} />
                  <PolarRadiusAxis tick={ax} angle={90} />
                  <Tooltip content={<ChartTip />} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12.5, fontWeight: 700, paddingTop: 6 }} />
                  <Radar name="Product A" dataKey="A" stroke="#2563eb" fill="#2563eb" fillOpacity={0.25} strokeWidth={2} />
                  <Radar name="Product B" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.25} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Distribution</CardTitle>
            <CardDescription>Scatter plot — value vs satisfaction</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 14, left: -10, bottom: 6 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="var(--bd)" />
                  <XAxis dataKey="x" name="Spend" tickLine={false} axisLine={false} tick={ax} />
                  <YAxis dataKey="y" name="Satisfaction" tickLine={false} axisLine={false} tick={ax} />
                  <ZAxis dataKey="z" range={[40, 220]} />
                  <Tooltip content={<ChartTip />} cursor={{ strokeDasharray: "3 3" }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12.5, fontWeight: 700, paddingTop: 6 }} />
                  <Scatter name="Group A" data={scA} fill="#2563eb" />
                  <Scatter name="Group B" data={scB} fill="#7c3aed" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="gr g-2 g2">
        <Card>
          <CardHeader><CardTitle>Framework Popularity</CardTitle></CardHeader>
          <CardContent>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fwk} layout="vertical" margin={{ top: 6, right: 18, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="var(--bd)" horizontal={false} />
                  <XAxis type="number" tickLine={false} axisLine={false} tick={ax} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="n" tickLine={false} axisLine={false} tick={ax} width={68} />
                  <Tooltip content={<ChartTip suffix="%" />} cursor={{ fill: "var(--mt)" }} />
                  <Bar dataKey="v" radius={[0, 6, 6, 0]} barSize={18}>
                    {fwk.map((_, i) => <Cell key={i} fill={["#2563eb","#10b981","#ef4444","#f59e0b","#7c3aed","#06b6d4"][i]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Task Status</CardTitle></CardHeader>
          <CardContent>
            <div style={{ height: 230 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={taskSt} dataKey="value" innerRadius={62} outerRadius={100} paddingAngle={3} stroke="none">
                    {taskSt.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip content={<ChartTip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="fc" style={{ justifyContent: "center", gap: 14, flexWrap: "wrap", marginTop: 8 }}>
              {taskSt.map((s, i) => (
                <div key={i} className="fc g2" style={{ fontSize: 12.5, fontWeight: 700 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color }} />{s.name}
                  <span style={{ color: "var(--mt-fg)" }}>({s.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weather Forecast</CardTitle>
          <CardDescription>Multi-axis weekly view</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weatherD} margin={{ top: 8, right: 14, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--bd)" vertical={false} />
                <XAxis dataKey="d" tickLine={false} axisLine={false} tick={ax} />
                <YAxis yAxisId="l" tickLine={false} axisLine={false} tick={ax} tickFormatter={(v) => `${v}°`} />
                <YAxis yAxisId="r" orientation="right" tickLine={false} axisLine={false} tick={ax} tickFormatter={(v) => `${v}%`} />
                <Tooltip content={<ChartTip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12.5, fontWeight: 700, paddingTop: 8 }} />
                <Line yAxisId="l" type="monotone" dataKey="temp" name="Temp °C" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4, fill: "#ef4444", stroke: "#fff", strokeWidth: 2 }} />
                <Line yAxisId="r" type="monotone" dataKey="humidity" name="Humidity %" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4, fill: "#2563eb", stroke: "#fff", strokeWidth: 2 }} />
                <Line yAxisId="l" type="monotone" dataKey="wind" name="Wind m/s" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
