"use client";
import { MouseEventHandler, ReactNode, useRef, useState } from "react";
import {
  PenLine, Layers, Eye, Undo2, Redo2, Bold, Italic, Underline, Strikethrough,
  List, ListOrdered, Link2, Quote, AlignLeft, AlignCenter, AlignRight, Trash2,
} from "lucide-react";
import { Card, CardHeader, Button } from "@/components/ui";

export default function RichEditor() {
  const ref = useRef(null);
  const [wc, swc] = useState(92);
  const [cc, scc] = useState(527);
  const ex = (cmd: string, val: any = null) => { document.execCommand(cmd, false, val); (ref.current as unknown as HTMLElement)?.focus(); uc(); };
  const uc = () => {
    const t = (ref.current as unknown as HTMLElement)?.innerText || "";
    swc(t.trim().split(/\s+/).filter(Boolean).length);
    scc(t.length);
  };
  const html = `<h1>Welcome to the Rich Text Editor</h1><p>This is a <b>feature-rich</b> editor built for the Nexora AI admin template.</p><ul><li>Apply <b>bold</b>, <i>italic</i>, and <u>underline</u></li><li>Create headings H1–H3</li></ul><blockquote>"The best way to predict the future is to create it."</blockquote><p>Start editing above.</p>`;

  const tools = [
    [() => ex("undo"), <Undo2 size={16} key="u" />],
    [() => ex("redo"), <Redo2 size={16} key="r" />],
    "s",
    [() => ex("bold"), <Bold size={16} key="b" />],
    [() => ex("italic"), <Italic size={16} key="i" />],
    [() => ex("underline"), <Underline size={16} key="u2" />],
    [() => ex("strikeThrough"), <Strikethrough size={16} key="s" />],
    "s",
    [() => ex("formatBlock", "h1"), "H1"],
    [() => ex("formatBlock", "h2"), "H2"],
    [() => ex("formatBlock", "h3"), "H3"],
    "s",
    [() => ex("insertUnorderedList"), <List size={16} key="ul" />],
    [() => ex("insertOrderedList"), <ListOrdered size={16} key="ol" />],
    "s",
    [() => { const u = prompt("URL:"); if (u) ex("createLink", u); }, <Link2 size={16} key="l" />],
    [() => ex("formatBlock", "blockquote"), <Quote size={16} key="q" />],
    "s",
    [() => ex("justifyLeft"), <AlignLeft size={16} key="al" />],
    [() => ex("justifyCenter"), <AlignCenter size={16} key="ac" />],
    [() => ex("justifyRight"), <AlignRight size={16} key="ar" />],
    "s",
    [() => { if (ref.current) { (ref.current as unknown as HTMLElement).innerHTML = ""; uc(); } }, <Trash2 size={16} key="t" />],
  ];

  return (
    <div className="sy">
      <Card style={{ overflow: "hidden" }}>
        <CardHeader style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--bd)", padding: "14px 20px" }}>
          <div className="fc g2" style={{ fontWeight: 800 }}>
            <PenLine size={17} />Content Editor
          </div>
          <div className="fc g2">
            <Button variant="outline" size="sm"><Layers size={14} style={{ marginRight: 4 }} />Templates</Button>
            <Button variant="outline" size="sm"><Eye size={14} style={{ marginRight: 4 }} />Preview</Button>
          </div>
        </CardHeader>
        <div className="rte-tb">
          {tools.map((item, i) =>
            item === "s" ? (
              <div key={i} className="sp" />
            ) : (
              <button key={i} className="rte-b" onClick={item[0] as MouseEventHandler<HTMLButtonElement>}>{item[1] as ReactNode}</button>
            ) as ReactNode
          ) as ReactNode  }
        </div>
        <div
          ref={ref}
          className="rte-bd"
          contentEditable
          suppressContentEditableWarning
          onInput={uc}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <div className="fb" style={{ padding: "12px 18px", borderTop: "1px solid var(--bd)" }}>
          <div className="fc g3" style={{ fontSize: 13, fontWeight: 600, color: "var(--mt-fg)" }}>
            <span>Words: <b style={{ color: "var(--fg)" }}>{wc}</b></span>
            <span>Chars: <b style={{ color: "var(--fg)" }}>{cc}</b></span>
          </div>
          <div className="fc g2">
            <Button variant="outline" size="sm">Save Draft</Button>
            <Button size="sm">Publish</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
