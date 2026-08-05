"use client";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { PenLine, Layers, Eye, Download, Save } from "lucide-react";
import { Card, CardHeader, Button } from "@/components/ui";
import "react-quill-new/dist/quill.snow.css";

// Dynamically import to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const INITIAL_HTML = `<h1>Welcome to the Rich Text Editor</h1>
<p>This is a <strong>feature-rich</strong> editor built for the Nexora AI admin template.</p>
<ul>
  <li>Apply <strong>bold</strong>, <em>italic</em>, and <u>underline</u></li>
  <li>Create headings H1–H3</li>
  <li>Insert links, images, and blockquotes</li>
</ul>
<blockquote>"The best way to predict the future is to create it."</blockquote>
<p>Start editing above.</p>`;

const TOOLBAR = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ align: [] }],
  ["link", "image", "blockquote", "code-block"],
  ["clean"],
];

export default function RichEditor() {
  const [value, setValue] = useState(INITIAL_HTML);

  const wordCount = useMemo(() => {
    const text = value.replace(/<[^>]*>/g, " ").trim();
    return text ? text.split(/\s+/).filter(Boolean).length : 0;
  }, [value]);

  const charCount = useMemo(() => {
    return value.replace(/<[^>]*>/g, "").length;
  }, [value]);

  return (
    <div className="sy">
      <Card style={{ overflow: "hidden" }}>
        {/* Header */}
        <CardHeader
          style={{
            flexDirection: "row", justifyContent: "space-between",
            alignItems: "center", borderBottom: "1px solid var(--bd)", padding: "14px 20px",
          }}
        >
          <div className="fc g2" style={{ fontWeight: 800 }}>
            <PenLine size={17} /> Content Editor
          </div>
          {/* <div className="fc g2">
            <Button variant="outline" size="sm"><Layers size={14} /> Templates</Button>
            <Button variant="outline" size="sm"><Eye size={14} /> Preview</Button>
          </div> */}
        </CardHeader>

        {/* Quill editor */}
        <div style={{ minHeight: 360 }}>
          <ReactQuill
            theme="snow"
            value={value}
            onChange={setValue}
            modules={{ toolbar: TOOLBAR }}
            style={{ height: 320 }}
          />
        </div>

        {/* Footer */}
        <div
          className="fb"
          style={{ padding: "12px 18px", borderTop: "1px solid var(--bd)", marginTop: 44 }}
        >
          <div className="fc g3" style={{ fontSize: 13, fontWeight: 600, color: "var(--mt-fg)" }}>
            <span>Words: <b style={{ color: "var(--fg)" }}>{wordCount}</b></span>
            <span>Chars: <b style={{ color: "var(--fg)" }}>{charCount}</b></span>
          </div>
          <div className="fc g2">
            <Button variant="outline" size="sm">
              <Save size={14} /> Save Draft
            </Button>
            <Button size="sm">
              <Download size={14} /> Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Override Quill styles to match the dashboard theme */}
      <style>{`
        .ql-toolbar.ql-snow {
          border: none !important;
          border-bottom: 1px solid var(--bd) !important;
          background: var(--mt) !important;
          padding: 10px 14px !important;
        }
        .ql-container.ql-snow {
          border: none !important;
          font-size: 14px !important;
          font-family: inherit !important;
        }
        .ql-editor {
          min-height: 280px !important;
          padding: 16px 20px !important;
          color: var(--fg) !important;
          line-height: 1.75 !important;
        }
        .ql-editor.ql-blank::before {
          color: var(--mt-fg) !important;
        }
        .ql-snow .ql-stroke { stroke: var(--fg) !important; }
        .ql-snow .ql-fill  { fill: var(--fg) !important; }
        .ql-snow .ql-picker-label { color: var(--fg) !important; }
        .ql-snow .ql-picker-options {
          background: var(--cd) !important;
          border-color: var(--bd) !important;
        }
        .ql-snow.ql-toolbar button:hover .ql-stroke,
        .ql-snow.ql-toolbar button.ql-active .ql-stroke {
          stroke: hsl(var(--primary)) !important;
        }
        .ql-snow.ql-toolbar button:hover .ql-fill,
        .ql-snow.ql-toolbar button.ql-active .ql-fill {
          fill: hsl(var(--primary)) !important;
        }
      `}</style>
    </div>
  );
}
