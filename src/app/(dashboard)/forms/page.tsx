"use client";
import { useState } from "react";
import { User, Mail, Lock } from "lucide-react";
import {
  Card, CardHeader, CardContent, CardTitle,
  Input, Textarea, Label, DropdownSelect, Checkbox, Switch, Radio,
} from "@/components/ui";

export default function Forms() {
  const [f, sf] = useState({
    name: "", email: "", bio: "", role: "developer",
    nl: true, terms: false, dm: true, gender: "male",
    range: 50, color: "#2563eb", num: 0,
  });
  const u = (k: string, v: any) => sf((p) => ({ ...p, [k]: v }));

  return (
    <div className="sy">
      <div className="gr g-2 g2">
        <Card>
          <CardHeader><CardTitle>Basic Inputs</CardTitle></CardHeader>
          <CardContent>
            <div className="fm">
              <Label>Full Name</Label>
              <div style={{ position: "relative" }}>
                <User size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--mt-fg)" }} />
                <Input
                  placeholder="Enter your full name"
                  value={f.name}
                  onChange={(e) => u("name", e.target.value)}
                  style={{ paddingLeft: 38 }}
                />
              </div>
              <div className="fh">Your name as it appears on your profile.</div>
            </div>
            <div className="fm">
              <Label>Email</Label>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--mt-fg)" }} />
                <Input type="email" placeholder="you@company.com" style={{ paddingLeft: 38 }} />
              </div>
            </div>
            <div className="fm">
              <Label>Password</Label>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--mt-fg)" }} />
                <Input type="password" placeholder="••••••••" style={{ paddingLeft: 38 }} />
              </div>
            </div>
            <div className="f2">
              <div className="fm">
                <Label>Phone</Label>
                <Input type="tel" placeholder="+1 (555) 000-0000" />
              </div>
              <div className="fm">
                <Label>Location</Label>
                <Input placeholder="City, Country" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Select, Radio & Switches</CardTitle></CardHeader>
          <CardContent>
            <div className="fm">
              <Label>Role</Label>
              <DropdownSelect
                value={f.role}
                onChange={(role) => u("role", role)}
                options={[
                  { value: "developer", label: "Developer" },
                  { value: "designer", label: "Designer" },
                  { value: "manager", label: "Manager" },
                ]}
              />
            </div>
            <div className="fm">
              <Label style={{ marginBottom: 10 }}>Gender</Label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Radio label="Male" checked={f.gender === "male"} onChange={() => u("gender", "male")} />
                <Radio label="Female" checked={f.gender === "female"} onChange={() => u("gender", "female")} />
                <Radio label="Other" checked={f.gender === "other"} onChange={() => u("gender", "other")} />
              </div>
            </div>
            <div style={{ height: 1, background: "var(--bd)", margin: "16px 0" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Checkbox checked={f.nl} onChange={() => u("nl", !f.nl)} label="Newsletter" description="Get weekly updates." />
              <Checkbox checked={f.terms} onChange={() => u("terms", !f.terms)} label="Accept terms" />
              <div className="fb">
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>Dark Mode</div>
                  <div style={{ fontSize: 12, color: "var(--mt-fg)" }}>Toggle interface theme</div>
                </div>
                <Switch checked={f.dm} onChange={() => u("dm", !f.dm)} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="gr g-2 g2">
        <Card>
          <CardHeader><CardTitle>Textarea</CardTitle></CardHeader>
          <CardContent>
            <div className="fm">
              <Label>Bio</Label>
              <Textarea placeholder="Tell us about yourself…" value={f.bio} onChange={(e) => u("bio", e.target.value)} />
              <div className="fh">{f.bio.length}/500</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Range & Color</CardTitle></CardHeader>
          <CardContent>
            <div className="fm">
              <Label>Range: <b style={{ color: "var(--pr)" }}>{f.range}</b></Label>
              <input
                type="range" min={0} max={100} value={f.range}
                onChange={(e) => u("range", +e.target.value)}
                style={{ width: "100%", accentColor: "var(--pr)" }}
              />
            </div>
            <div className="fm">
              <Label>Color Picker</Label>
              <div className="fc g3">
                <input
                  type="color" value={f.color}
                  onChange={(e) => u("color", e.target.value)}
                  style={{ width: 42, height: 42, borderRadius: 10, border: "none", cursor: "pointer" }}
                />
                <Input value={f.color} onChange={(e) => u("color", e.target.value)} style={{ maxWidth: 140, fontFamily: "monospace", fontWeight: 700 }} />
              </div>
            </div>
            <div className="fm">
              <Label># Number</Label>
              <Input type="number" value={f.num} onChange={(e) => u("num", e.target.value)} placeholder="0" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
