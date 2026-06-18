"use client";
import { useState } from "react";
import {
  CloudUpload, PenLine, Info, Trash2, X, FileText, FileImage, Film, Archive, CircleCheck,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, Button } from "@/components/ui";

export default function FileUpload() {
  const [files, setFiles] = useState([
    { id: 1, name: "quarterly-report.pdf", size: "2.3 MB", pct: 100, ico: FileText, bg: "#2563eb" },
    { id: 2, name: "hero-banner.png", size: "1.8 MB", pct: 100, ico: FileImage, bg: "#10b981" },
    { id: 3, name: "product-demo.mp4", size: "15.0 MB", pct: 72, ico: Film, bg: "#ef4444" },
    { id: 4, name: "brand-assets.zip", size: "8.0 MB", pct: 45, ico: Archive, bg: "#f59e0b" },
  ]);
  const [imgs, setImgs] = useState([
    { id: 1, name: "profile.jpg", size: "416 KB", bg: "#7c3aed", l: "Photo" },
    { id: 2, name: "team.png", size: "871 KB", bg: "#10b981", l: "Team" },
    { id: 3, name: "product.jpg", size: "1.1 MB", bg: "#f59e0b", l: "Product" },
  ]);

  return (
    <div className="sy">
      <Card>
        <CardHeader><CardTitle className="fc g2"><CloudUpload size={17} />Multiple File Upload</CardTitle></CardHeader>
        <CardContent>
          <div className="fu-dr">
            <CloudUpload size={28} style={{ color: "var(--pr)", margin: "0 auto 12px", display: "block" }} />
            <h3 style={{ fontSize: 17, fontWeight: 800, margin: "0 0 5px" }}>Drag & Drop files here</h3>
            <p style={{ fontSize: 13, color: "var(--mt-fg)", margin: "0 0 14px" }}>or click to browse</p>
            <Button size="sm"><PenLine />Choose Files</Button>
            <div className="fc" style={{ justifyContent: "center", gap: 5, fontSize: 12, color: "var(--mt-fg)", marginTop: 14 }}>
              <Info size={13} />PDF, DOC, PNG, JPG, MP4, ZIP | Max 25MB
            </div>
          </div>
          <div className="fb" style={{ margin: "20px 0 12px" }}>
            <h3 style={{ fontSize: 15, fontWeight: 800 }}>Uploaded Files ({files.length})</h3>
            <Button variant="outline" size="sm" onClick={() => setFiles([])}><Trash2 />Clear All</Button>
          </div>
          {files.map((f) => (
            <div key={f.id} className="fu-f">
              <div style={{ width: 38, height: 38, borderRadius: 10, display: "grid", placeItems: "center", background: `${f.bg}18`, color: f.bg }}>
                <f.ico size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700 }}>{f.name}</div>
                <div style={{ fontSize: 12, color: "var(--mt-fg)" }}>{f.size}</div>
                {f.pct < 100 && (
                  <div style={{ height: 4, borderRadius: 4, background: "var(--mt)", marginTop: 6, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 4, background: "var(--pr)", width: `${f.pct}%` }} />
                  </div>
                )}
              </div>
              <div className="fc g2">
                {f.pct < 100 ? (
                  <span style={{ fontSize: 13, fontWeight: 800, color: "var(--pr)" }}>{f.pct}%</span>
                ) : (
                  <CircleCheck size={18} style={{ color: "#10b981" }} />
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setFiles((p) => p.filter((x) => x.id !== f.id))}
                  aria-label={`Remove ${f.name}`}
                >
                  <X />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="gr g-2 g2">
        <Card>
          <CardHeader><CardTitle className="fc g2"><FileText size={17} />Single Upload</CardTitle></CardHeader>
          <CardContent>
            <div className="fu-dr" style={{ padding: "30px 20px" }}>
              <FileText size={32} style={{ color: "var(--pr)", margin: "0 auto 12px", display: "block" }} />
              <h3 style={{ fontSize: 15, fontWeight: 800 }}>Upload a document</h3>
              <p style={{ fontSize: 13, color: "var(--mt-fg)", margin: "4px 0 12px" }}>PDF, DOC, DOCX only</p>
              <Button size="sm">Select Document</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="fc g2"><FileImage size={17} />Image Upload</CardTitle></CardHeader>
          <CardContent>
            <div className="fu-dr" style={{ padding: "28px 20px", background: "rgba(37,99,235,.02)", borderColor: "rgba(37,99,235,.2)" }}>
              <FileImage size={30} style={{ color: "var(--pr)", margin: "0 auto 10px", display: "block" }} />
              <h3 style={{ fontSize: 15, fontWeight: 800 }}>Upload Images</h3>
              <p style={{ fontSize: 13, color: "var(--mt-fg)", margin: "4px 0 12px" }}>JPG, PNG, GIF, WEBP</p>
              <Button size="sm" variant="success">Browse</Button>
            </div>
            <h4 style={{ fontSize: 13.5, fontWeight: 800, margin: "16px 0 10px" }}>Previews</h4>
            <div className="fc g3" style={{ flexWrap: "wrap" }}>
              {imgs.map((im) => (
                <div key={im.id} style={{ textAlign: "center" }}>
                  <div className="fu-pv" style={{ background: im.bg }}>
                    {im.l}
                    <div className="fu-px" onClick={() => setImgs((p) => p.filter((x) => x.id !== im.id))}><X size={10} /></div>
                  </div>
                  <div style={{ fontSize: 11.5, fontWeight: 600, marginTop: 5 }}>{im.name}</div>
                  <div style={{ fontSize: 10.5, color: "var(--mt-fg)" }}>{im.size}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Supported File Types</CardTitle></CardHeader>
        <CardContent>
          <div className="gr g-4 g2">
            {[
              { t: "Documents", ext: "PDF, DOC, DOCX, XLS", max: "10 MB", c: "#2563eb", ico: FileText },
              { t: "Images", ext: "JPG, PNG, GIF, WEBP, SVG", max: "5 MB", c: "#06b6d4", ico: FileImage },
              { t: "Videos", ext: "MP4, AVI, MOV", max: "100 MB", c: "#ef4444", ico: Film },
              { t: "Archives", ext: "ZIP, RAR, 7Z, TAR", max: "25 MB", c: "#f59e0b", ico: Archive },
            ].map((ft, i) => (
              <div key={i} className="fu-tc" style={{ borderTopColor: ft.c }}>
                <h4 style={{ fontSize: 13.5, fontWeight: 800, display: "flex", alignItems: "center", gap: 7, margin: "0 0 5px" }}>
                  <ft.ico size={15} style={{ color: ft.c }} />{ft.t}
                </h4>
                <p style={{ fontSize: 12, color: "var(--mt-fg)", margin: "0 0 6px" }}>{ft.ext}</p>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--mt-fg)" }}>Max: {ft.max}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
