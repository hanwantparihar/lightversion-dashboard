"use client";
import { useState } from "react";
import { User, Mail, Phone, Building2, Check, RefreshCw, Search } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, Input, Textarea, Label, DropdownSelect, Button } from "@/components/ui";

export default function FormLayouts() {
  const [category, setCategory] = useState("All");
  const rows = [
    { l: "Full Name", p: "Enter full name", i: User },
    { l: "Email", p: "Enter email", i: Mail },
    { l: "Phone", p: "+1 (555) 000-0000", i: Phone },
    { l: "Company", p: "Company name", i: Building2 },
  ];

  return (
    <div className="sy">
      <Card>
        <CardHeader><CardTitle>Horizontal Form</CardTitle></CardHeader>
        <CardContent style={{ padding: 0 }}>
          {rows.map((r, i) => (
            <div
              key={i}
              className="fc"
              style={{
                padding: "14px 20px",
                borderBottom: i < rows.length - 1 ? "1px solid var(--bd)" : "none",
                gap: 0,
              }}
            >
              <div style={{ width: 180, flexShrink: 0, fontSize: 14, fontWeight: 700 }}>{r.l}</div>
              <div style={{ flex: 1, position: "relative" }}>
                <r.i size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--mt-fg)" }} />
                <Input placeholder={r.p} style={{ paddingLeft: 38 }} />
              </div>
            </div>
          ))}
          <div style={{ padding: "14px 20px" }} className="fc g3">
            <Button size="sm"><Check size={14} style={{ marginRight: 4 }} />Submit</Button>
            <Button variant="outline" size="sm"><RefreshCw size={14} style={{ marginRight: 4 }} />Reset</Button>
          </div>
        </CardContent>
      </Card>

      <div className="gr g-2 g2">
        <Card>
          <CardHeader><CardTitle>Vertical Form</CardTitle></CardHeader>
          <CardContent>
            <div className="fm"><Label>First Name</Label><Input placeholder="John" /></div>
            <div className="fm"><Label>Last Name</Label><Input placeholder="Doe" /></div>
            <div className="fm"><Label>Email</Label><Input placeholder="john@example.com" /></div>
            <div className="fm"><Label>Message</Label><Textarea placeholder="Your message..." /></div>
            <Button style={{ width: "100%" }} size="sm"><Check size={14} style={{ marginRight: 4 }} />Send Message</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Inline Form</CardTitle></CardHeader>
          <CardContent>
            <div className="fc g2" style={{ flexWrap: "wrap", marginBottom: 18 }}>
              <div style={{ flex: 1, minWidth: 100 }}><Label>Search</Label><Input placeholder="Keywords…" /></div>
              <div style={{ flex: 1, minWidth: 100 }}>
                <Label>Category</Label>
                <DropdownSelect
                  value={category}
                  onChange={setCategory}
                  options={[
                    { value: "All", label: "All" },
                    { value: "Tech", label: "Tech" },
                    { value: "Design", label: "Design" },
                  ]}
                />
              </div>
              <div style={{ flex: "none", alignSelf: "flex-end" }}>
                <Button size="sm"><Search size={14} style={{ marginRight: 4 }} />Search</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Two Column Form</CardTitle></CardHeader>
        <CardContent>
          <div className="f2">
            <div className="fm"><Label>First Name</Label><Input placeholder="John" /></div>
            <div className="fm"><Label>Last Name</Label><Input placeholder="Doe" /></div>
          </div>
          <div className="f2">
            <div className="fm"><Label>Email</Label><Input placeholder="john@example.com" /></div>
            <div className="fm"><Label>Phone</Label><Input placeholder="+1 (555) 000-0000" /></div>
          </div>
          <div className="fc g3">
            <Button size="sm">Save</Button>
            <Button variant="outline" size="sm">Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
