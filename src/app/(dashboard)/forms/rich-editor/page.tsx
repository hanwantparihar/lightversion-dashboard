"use client";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { PenLine, Lock, Eye, Type, FileText, Feather, Edit3, LayoutTemplate } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui";
import "react-quill-new/dist/quill.snow.css";
import "react-quill-new/dist/quill.bubble.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// ── Toolbar presets ───────────────────────────────────────────────────────────
const T_FULL = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, false] }, { font: [] }],
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }, { align: [] }],
    ["link", "image", "video", "blockquote", "code-block"],
    ["clean"],
  ]
};

const T_DOC = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["link", "image", "blockquote"],
    ["clean"],
  ]
};

const T_BALLOON = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    [{ header: [1, 2, false] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "blockquote"],
  ]
};

const T_INLINE = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
  ]
};

// ── Sample content ────────────────────────────────────────────────────────────
const CONTENT_CLASSIC = `<h2>Classic Editor</h2>
<p>Classic editor is what most users traditionally learned to associate with a rich-text editor — a <strong>toolbar with an editing area</strong> placed in a specific position on the page, usually as part of a form you submit to the server.</p>
<p>During initialization the editor hides the original <code>&lt;textarea&gt;</code> and renders in its place. This is why it is usually used to <em>replace textarea elements</em>.</p>
<ul>
  <li>Rich toolbar with all formatting options</li>
  <li>Supports headings, lists, links, images and more</li>
  <li>Familiar word-processor-style interface</li>
</ul>
<blockquote>The best rich-text editor experience for forms and CMS integrations.</blockquote>`;

const CONTENT_DOC = `<h1>Document Editor</h1>
<p>The <strong>document editor</strong> focuses on document creation. It provides a toolbar at the top and a page-like editing area below — similar to Google Docs or Microsoft Word.</p>
<p>It is best suited for long-form content like:</p>
<ol>
  <li>Blog posts and articles</li>
  <li>Legal documents and contracts</li>
  <li>Technical documentation</li>
</ol>
<p>The editing area has a fixed width and a white background to simulate a real document page.</p>`;

const CONTENT_BALLOON = `<h2>Balloon Editor</h2>
<p>Balloon editor is very similar to inline editor. The key difference is that the <strong>toolbar appears in a balloon</strong> next to the selected text — just like the Medium.com editor.</p>
<p>To see the toolbar: <strong>select any text in this area</strong> and a floating toolbar will appear above your selection.</p>
<p>This editor type works great for:</p>
<ul>
  <li>In-place content editing on landing pages</li>
  <li>Minimal UI where you want to hide formatting controls</li>
  <li>Mobile-friendly editing experiences</li>
</ul>`;

const CONTENT_INLINE = `<h2>Inline Editor</h2>
<p>Inline editor comes with a <strong>floating toolbar</strong> that only becomes visible when the editor is focused. Unlike classic editor, it doesn't replace the element — it simply makes it editable in place.</p>
<p>The styles of the edited content are <em>exactly the same</em> before and after the editor initializes. This makes it perfect for editing content directly on the page.</p>
<p>Click anywhere in this text to activate the editor and see the toolbar appear.</p>`;

const CONTENT_READONLY = `<h2>Read-only Mode</h2>
<p>The editor can be set into a <strong>read-only mode</strong>. In this state the content is visible but cannot be modified by the user.</p>
<p>Read-only mode is useful for:</p>
<ul>
  <li>Showing finalized content that should not be changed</li>
  <li>Restricting access for certain user roles (viewers vs editors)</li>
  <li>Displaying financial reports, software logs, or published articles</li>
</ul>
<blockquote>This content is locked and cannot be edited. It remains accessible for reading and copying.</blockquote>
<p>The editor appearance remains identical — only the editing capability is disabled.</p>`;

const CONTENT_PLACEHOLDER = ``;

// ── Shared Quill style overrides ──────────────────────────────────────────────
const QUILL_STYLES = `
  .ql-toolbar.ql-snow {
    border: none !important;
    border-bottom: 1px solid var(--bd) !important;
    background: var(--mt) !important;
    padding: 8px 14px !important;
    flex-wrap: wrap;
  }
  .ql-container.ql-snow,
  .ql-container.ql-bubble {
    border: none !important;
    font-size: 14px !important;
    font-family: inherit !important;
  }
  .ql-editor {
    min-height: 180px !important;
    padding: 16px 20px !important;
    color: var(--fg) !important;
    line-height: 1.8 !important;
    background: var(--cd) !important;
  }
  .ql-editor p, .ql-editor li { color: var(--fg) !important; }
  .ql-editor h1, .ql-editor h2, .ql-editor h3,
  .ql-editor h4, .ql-editor h5 { color: var(--fg) !important; margin-bottom: 8px; }
  .ql-editor blockquote {
    border-left: 3px solid hsl(var(--primary)) !important;
    padding: 8px 16px !important;
    color: var(--mt-fg) !important;
    font-style: italic;
    margin: 12px 0;
    background: hsl(var(--primary)/0.05);
    border-radius: 0 6px 6px 0;
  }
  .ql-editor code, .ql-editor pre { border-radius: 6px !important; }
  .ql-editor.ql-blank::before {
    color: var(--mt-fg) !important;
    font-style: normal !important;
  }
  .ql-snow .ql-stroke { stroke: var(--fg) !important; }
  .ql-snow .ql-fill  { fill:   var(--fg) !important; }
  .ql-snow .ql-picker-label { color: var(--fg) !important; }
  .ql-snow .ql-picker-options {
    background: var(--cd) !important;
    border: 1px solid var(--bd) !important;
    border-radius: 8px !important;
    box-shadow: 0 4px 16px rgba(0,0,0,.12) !important;
  }
  .ql-snow .ql-picker-item { color: var(--fg) !important; }
  .ql-snow.ql-toolbar button:hover .ql-stroke,
  .ql-snow.ql-toolbar button.ql-active .ql-stroke { stroke: hsl(var(--primary)) !important; }
  .ql-snow.ql-toolbar button:hover .ql-fill,
  .ql-snow.ql-toolbar button.ql-active .ql-fill  { fill:   hsl(var(--primary)) !important; }
  .ql-snow.ql-toolbar button:hover,
  .ql-snow.ql-toolbar button.ql-active {
    background: hsl(var(--primary)/0.1) !important;
    border-radius: 5px;
  }
  .ql-snow .ql-tooltip {
    background: var(--cd) !important;
    border: 1px solid var(--bd) !important;
    color: var(--fg) !important;
    border-radius: 8px !important;
    box-shadow: 0 4px 16px rgba(0,0,0,.12) !important;
  }
  .ql-snow .ql-tooltip input[type=text] {
    background: var(--mt) !important;
    border: 1px solid var(--bd) !important;
    color: var(--fg) !important;
    border-radius: 6px;
  }
  /* Document editor page style */
  .editor-document .ql-editor {
    max-width: 760px !important;
    margin: 24px auto !important;
    min-height: 360px !important;
    background: white !important;
    color: #111 !important;
    border-radius: 4px !important;
    box-shadow: 0 2px 20px rgba(0,0,0,.10) !important;
    padding: 40px 52px !important;
  }
  .editor-document .ql-editor p,
  .editor-document .ql-editor li,
  .editor-document .ql-editor h1,
  .editor-document .ql-editor h2,
  .editor-document .ql-editor h3 { color: #111 !important; }
  .editor-document.ql-container { background: var(--mt) !important; min-height: 420px; }
  /* Balloon bubble */
  .ql-bubble .ql-tooltip { border-radius: 8px !important; background: #1e293b !important; }
  .ql-bubble .ql-tooltip .ql-stroke { stroke: #f8fafc !important; }
  .ql-bubble .ql-tooltip .ql-fill  { fill:   #f8fafc !important; }
  .ql-bubble .ql-editor { min-height: 180px !important; padding: 16px 20px !important; }
  /* Inline: no border, merges with page */
  .editor-inline .ql-editor {
    border: 1px dashed var(--bd) !important;
    border-radius: 8px !important;
    background: transparent !important;
  }
  .editor-inline .ql-editor:focus { border-color: hsl(var(--primary)) !important; background: var(--mt) !important; }
  /* Read-only: muted, locked appearance */
  .editor-readonly .ql-editor {
    cursor: default !important;
    background: var(--mt) !important;
    opacity: 0.85;
  }
`;

export default function RichEditorPage() {
  const [classic, setClassic] = useState(CONTENT_CLASSIC);
  const [doc, setDoc] = useState(CONTENT_DOC);
  const [balloon, setBalloon] = useState(CONTENT_BALLOON);
  const [inline_, setInline] = useState(CONTENT_INLINE);
  const [placeholder, setPlaceholder] = useState(CONTENT_PLACEHOLDER);

  const wc = (html: string) => {
    const t = html.replace(/<[^>]*>/g, " ").trim();
    return t ? t.split(/\s+/).filter(Boolean).length : 0;
  };

  return (
    <div className="sy">
      <style>{QUILL_STYLES}</style>

      {/* ── 1. Classic ───────────────────────────────────────────────────── */}
      <Card style={{ overflow: "hidden" }}>
        <CardHeader style={{ borderBottom: "1px solid var(--bd)", padding: "16px 20px" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Type size={16} className="text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm">Classic editor</CardTitle>
              <CardDescription>
                Traditional rich-text editor with a fixed toolbar — replaces a textarea element
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <ReactQuill
          theme="snow"
          value={classic}
          onChange={setClassic}
          modules={T_FULL}
          placeholder="Start typing…"
        />
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-border bg-muted/30" style={{ marginTop: 42 }}>
          <span className="text-xs text-muted-foreground">{wc(classic)} words</span>
          <span className="text-xs text-muted-foreground font-mono">{classic.length} chars</span>
        </div>
      </Card>

      {/* ── 2. Placeholder ───────────────────────────────────────────────── */}
      <Card style={{ overflow: "hidden" }}>
        <CardHeader style={{ borderBottom: "1px solid var(--bd)", padding: "16px 20px" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Edit3 size={16} className="text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm">Editor with placeholder</CardTitle>
              <CardDescription>
                CKEditor can show a configurable placeholder when the content area is empty
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <ReactQuill
          theme="snow"
          value={placeholder}
          onChange={setPlaceholder}
          modules={T_FULL}
          placeholder="Click here to start writing your content. This placeholder text disappears once you begin typing…"
        />
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-border bg-muted/30" style={{ marginTop: 42 }}>
          <span className="text-xs text-muted-foreground">{wc(placeholder)} words</span>
          <span className="text-xs text-muted-foreground">Empty editor placeholder demo</span>
        </div>
      </Card>

      {/* ── 3. Document ──────────────────────────────────────────────────── */}
      <Card style={{ overflow: "hidden" }}>
        <CardHeader style={{ borderBottom: "1px solid var(--bd)", padding: "16px 20px" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FileText size={16} className="text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm">Document editor</CardTitle>
              <CardDescription>
                Focused document creation — editing area looks like a real page with a white background
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <div className="editor-document">
          <ReactQuill
            theme="snow"
            value={doc}
            onChange={setDoc}
            modules={T_DOC}
            placeholder="Start writing your document…"
          />
        </div>
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-border bg-muted/30">
          <span className="text-xs text-muted-foreground">{wc(doc)} words</span>
          <span className="text-xs text-muted-foreground">Page-style layout</span>
        </div>
      </Card>

      {/* ── 4. Balloon ───────────────────────────────────────────────────── */}
      <Card style={{ overflow: "hidden" }}>
        <CardHeader style={{ borderBottom: "1px solid var(--bd)", padding: "16px 20px" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Feather size={16} className="text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm">Balloon editor</CardTitle>
              <CardDescription>
                Select any text below to reveal the floating balloon toolbar — Medium.com style
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <ReactQuill
          theme="bubble"
          value={balloon}
          onChange={setBalloon}
          modules={T_BALLOON}
          placeholder="Select text to see the balloon toolbar…"
        />
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-border bg-muted/30">
          <span className="text-xs text-muted-foreground">{wc(balloon)} words</span>
          <span className="text-xs text-muted-foreground">Toolbar appears on selection</span>
        </div>
      </Card>

      {/* ── 5. Inline ────────────────────────────────────────────────────── */}
      <Card style={{ overflow: "hidden" }}>
        <CardHeader style={{ borderBottom: "1px solid var(--bd)", padding: "16px 20px" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <LayoutTemplate size={16} className="text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm">Inline editor</CardTitle>
              <CardDescription>
                Edits content in-place — the toolbar floats in when the area is focused
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <div className="editor-inline px-5 py-4">
          <ReactQuill
            theme="snow"
            value={inline_}
            onChange={setInline}
            modules={T_INLINE}
            placeholder="Click to activate and start editing inline…"
          />
        </div>
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-border bg-muted/30" style={{ marginTop: 42 }}>
          <span className="text-xs text-muted-foreground">{wc(inline_)} words</span>
          <span className="text-xs text-muted-foreground">In-place editing</span>
        </div>
      </Card>

      {/* ── 6. Read-only ─────────────────────────────────────────────────── */}
      <Card style={{ overflow: "hidden" }}>
        <CardHeader style={{ borderBottom: "1px solid var(--bd)", padding: "16px 20px" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Lock size={16} className="text-muted-foreground" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-sm flex items-center gap-2">
                Read-only mode
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Locked</span>
              </CardTitle>
              <CardDescription>
                Content is visible but cannot be edited — useful for enforcing view-only access
              </CardDescription>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
              <Eye size={13} />
              <span>View only</span>
            </div>
          </div>
        </CardHeader>
        <div className="editor-readonly">
          <ReactQuill
            theme="snow"
            value={CONTENT_READONLY}
            onChange={() => { }}
            modules={{ toolbar: false }}
            readOnly
          />
        </div>
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-border bg-muted/30">
          <span className="text-xs text-muted-foreground">{wc(CONTENT_READONLY)} words</span>
          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <Lock size={11} /> Editing disabled
          </span>
        </div>
      </Card>
    </div>
  );
}
