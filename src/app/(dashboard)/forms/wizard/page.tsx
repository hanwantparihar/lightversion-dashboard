"use client";
import { useState } from "react";
import {
  User, Contact, MapPin, CheckCircle, Check, ArrowLeft, ArrowRight,
} from "lucide-react";
import { Card, CardContent, Input, Label, DropdownSelect, Button } from "@/components/ui";
import { useAlert } from "@/contexts/alert-context";

const WS = [
  { key: "account", label: "Account", icon: User },
  { key: "personal", label: "Personal", icon: Contact },
  { key: "address", label: "Address", icon: MapPin },
  { key: "confirm", label: "Confirmation", icon: CheckCircle },
];

export default function FormWizard() {
  const { showAlert } = useAlert();
  const [step, ss] = useState(0);
  const [w, sw] = useState({
    email: "", username: "", password: "", cpw: "",
    fn: "", ln: "", dob: "", gender: "", phone: "",
    street: "", city: "", state: "", zip: "", country: "",
  });
  const up = (k: string, v: any) => sw((p) => ({ ...p, [k]: v }));
  const Req = () => <span style={{ color: "var(--ds)", marginLeft: 2 }}>*</span>;

  return (
    <div className="sy">
      <Card>
        <CardContent style={{ padding: 0 }}>
          <div className="wz-st">
            {WS.map((s, i) => {
              const d = i < step, a = i === step;
              return (
                <div key={s.key} style={{ display: "contents" }}>
                  {i > 0 && <div className={`wz-l ${d ? "dn" : ""}`} />}
                  <div
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: d ? "pointer" : "default" }}
                    onClick={() => { if (d) ss(i); }}
                  >
                    <div className={`wz-c ${a ? "av" : ""} ${d ? "dn" : ""}`}>
                      {d ? <Check size={22} /> : <s.icon size={20} />}
                    </div>
                    <div className={`wz-lb ${a ? "av" : ""} ${d ? "dn" : ""}`}>{s.label}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ padding: "0 28px 28px", maxWidth: 680, margin: "0 auto" }} className="fd" key={step}>
            {step === 0 && (
              <>
                <h3 className="fc" style={{ gap: 8, fontSize: 18, fontWeight: 800, marginBottom: 20 }}>
                  <User size={20} />Account Information
                </h3>
                <div className="fm"><Label>Email<Req /></Label><Input placeholder="john@example.com" value={w.email} onChange={(e) => up("email", e.target.value)} /></div>
                <div className="fm"><Label>Username<Req /></Label><Input placeholder="john_doe" value={w.username} onChange={(e) => up("username", e.target.value)} /></div>
                <div className="f2">
                  <div className="fm"><Label>Password<Req /></Label><Input type="password" placeholder="Min 8 chars" value={w.password} onChange={(e) => up("password", e.target.value)} /></div>
                  <div className="fm"><Label>Confirm<Req /></Label><Input type="password" placeholder="Re-enter" value={w.cpw} onChange={(e) => up("cpw", e.target.value)} /></div>
                </div>
              </>
            )}
            {step === 1 && (
              <>
                <h3 className="fc" style={{ gap: 8, fontSize: 18, fontWeight: 800, marginBottom: 20 }}>
                  <Contact size={20} />Personal Details
                </h3>
                <div className="f2">
                  <div className="fm"><Label>First Name<Req /></Label><Input placeholder="John" value={w.fn} onChange={(e) => up("fn", e.target.value)} /></div>
                  <div className="fm"><Label>Last Name<Req /></Label><Input placeholder="Doe" value={w.ln} onChange={(e) => up("ln", e.target.value)} /></div>
                </div>
                <div className="f2">
                  <div className="fm"><Label>Date of Birth<Req /></Label><Input type="date" value={w.dob} onChange={(e) => up("dob", e.target.value)} /></div>
                  <div className="fm">
                    <Label>Gender<Req /></Label>
                    <DropdownSelect
                      value={w.gender}
                      onChange={(v) => up("gender", v)}
                      placeholder="Select…"
                      options={[
                        { value: "", label: "Select…" },
                        { value: "Male", label: "Male" },
                        { value: "Female", label: "Female" },
                      ]}
                    />
                  </div>
                </div>
                <div className="fm"><Label>Phone<Req /></Label><Input placeholder="1234567890" value={w.phone} onChange={(e) => up("phone", e.target.value)} /></div>
              </>
            )}
            {step === 2 && (
              <>
                <h3 className="fc" style={{ gap: 8, fontSize: 18, fontWeight: 800, marginBottom: 20 }}>
                  <MapPin size={20} />Address Information
                </h3>
                <div className="fm"><Label>Street<Req /></Label><Input placeholder="123 Main St" value={w.street} onChange={(e) => up("street", e.target.value)} /></div>
                <div className="f2">
                  <div className="fm"><Label>City<Req /></Label><Input placeholder="New York" value={w.city} onChange={(e) => up("city", e.target.value)} /></div>
                  <div className="fm"><Label>State<Req /></Label><Input placeholder="NY" value={w.state} onChange={(e) => up("state", e.target.value)} /></div>
                </div>
                <div className="f2">
                  <div className="fm"><Label>ZIP<Req /></Label><Input placeholder="10001" value={w.zip} onChange={(e) => up("zip", e.target.value)} /></div>
                  <div className="fm">
                    <Label>Country<Req /></Label>
                    <DropdownSelect
                      value={w.country}
                      onChange={(v) => up("country", v)}
                      placeholder="Select…"
                      options={[
                        { value: "", label: "Select…" },
                        { value: "United States", label: "United States" },
                        { value: "India", label: "India" },
                      ]}
                    />
                  </div>
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <h3 className="fc" style={{ gap: 8, fontSize: 18, fontWeight: 800, marginBottom: 20 }}>
                  <CheckCircle size={20} />Review & Confirm
                </h3>
                <div
                  style={{
                    display: "flex", alignItems: "flex-start", gap: 10, padding: 16, borderRadius: 11,
                    background: "rgba(16,185,129,.06)", border: "1px solid rgba(16,185,129,.18)", marginBottom: 20,
                  }}
                >
                  <CheckCircle size={20} style={{ color: "#10b981", flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <b style={{ color: "#10b981", fontSize: 14 }}>All information collected!</b>
                    <p style={{ color: "var(--mt-fg)", fontSize: 13, margin: "3px 0 0" }}>Please review before submitting.</p>
                  </div>
                </div>
                {[
                  { t: "Account", i: User, rows: [["Email", w.email], ["Username", w.username]] },
                  { t: "Personal", i: Contact, rows: [["Name", [w.fn, w.ln].filter(Boolean).join(" ")], ["DOB", w.dob], ["Phone", w.phone]] },
                  { t: "Address", i: MapPin, rows: [["Street", w.street], ["City/State", [w.city, w.state].filter(Boolean).join(", ")], ["ZIP", w.zip]] },
                ].map((s, i) => (
                  <div key={i} className="wz-rs">
                    <div className="wz-rh"><s.i size={15} />{s.t}</div>
                    {s.rows.map(([l, v], j) => (
                      <div key={j} className="wz-rr"><span>{l}</span><span>{v || "—"}</span></div>
                    ))}
                  </div>
                ))}
              </>
            )}

            <div className="fb" style={{ marginTop: 24 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => ss((s) => Math.max(s - 1, 0))}
                disabled={step === 0}
              >
                <ArrowLeft />
                Previous
              </Button>
              {step < 3 ? (
                <Button size="sm" onClick={() => ss((s) => s + 1)}>
                  Next Step
                  <ArrowRight />
                </Button>
              ) : (
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => showAlert("Submitted!", { variant: "success" })}
                >
                  <CheckCircle />
                  Submit
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
