"use client";

import { useRef, useState } from "react";
import {
  UploadCloud,
  Search,
  LayoutList,
  LayoutGrid,
  Star,
  MoreVertical,
  Folder,
  FileImage,
  FileVideo,
  FileText,
  FileArchive,
  Download,
  Pencil,
  Trash2,
  X,
  Check,
} from "lucide-react";
import { Button, Input, Modal, DropdownSelect } from "@/components/ui";
import { PageStack } from "@/components";

type FileType = "folder" | "jpg" | "png" | "mp4" | "pdf" | "zip" | "doc";

type FileEntry = {
  id: string;
  name: string;
  size: string;
  type: FileType;
  modified: string;
  modifiedTime: string;
  shared?: string[];
};

const initialEntries: FileEntry[] = [
  { id: "1", name: "Foods", size: "381.47 Mb", type: "folder", modified: "21 Jun 2026", modifiedTime: "11:40 am" },
  { id: "2", name: "Projects", size: "1.12 Gb", type: "folder", modified: "25 Jun 2026", modifiedTime: "3:40 pm", shared: ["A", "B", "C"] },
  { id: "3", name: "Sport", size: "457.76 Mb", type: "folder", modified: "22 Jun 2026", modifiedTime: "12:40 pm" },
  { id: "4", name: "Training", size: "572.2 Mb", type: "folder", modified: "23 Jun 2026", modifiedTime: "1:40 pm", shared: ["C"] },
  { id: "5", name: "Work", size: "762.94 Mb", type: "folder", modified: "24 Jun 2026", modifiedTime: "2:40 pm", shared: ["D", "E"] },
  { id: "6", name: "cover-12.jpg", size: "2.08 Mb", type: "jpg", modified: "04 Jun 2026", modifiedTime: "7:40 pm" },
  { id: "7", name: "dashboard-hero.png", size: "2.7 Mb", type: "png", modified: "21 Jun 2026", modifiedTime: "9:00 am" },
  { id: "8", name: "product-demo.mp4", size: "64.3 Mb", type: "mp4", modified: "20 Jun 2026", modifiedTime: "3:15 pm" },
  { id: "9", name: "pricing-sheet.pdf", size: "1.4 Mb", type: "pdf", modified: "24 Jun 2026", modifiedTime: "11:20 am" },
  { id: "10", name: "brand-assets.zip", size: "18.9 Mb", type: "zip", modified: "22 Jun 2026", modifiedTime: "4:50 pm" },
];

const avatarColors = ["bg-pink-400", "bg-blue-400", "bg-green-400", "bg-orange-400", "bg-purple-400"];

const typeOptions = [
  { value: "", label: "All type" },
  { value: "folder", label: "Folder" },
  { value: "jpg", label: "JPG" },
  { value: "png", label: "PNG" },
  { value: "mp4", label: "MP4" },
  { value: "pdf", label: "PDF" },
  { value: "zip", label: "ZIP" },
  { value: "doc", label: "DOC" },
];

const dateOptions = [
  { value: "", label: "Select date" },
  { value: "Jun 2026", label: "Jun 2026" },
  { value: "May 2026", label: "May 2026" },
  { value: "Apr 2026", label: "Apr 2026" },
];

function FileIcon({ type }: { type: FileType }) {
  if (type === "folder")
    return <Folder size={46} className="fill-amber-400 text-amber-400" />;
  if (type === "jpg" || type === "png")
    return <div className="flex h-12 w-12 items-center justify-center rounded bg-green-500 text-white"><FileImage size={36} /></div>;
  if (type === "mp4")
    return <div className="flex h-12 w-12 items-center justify-center rounded bg-blue-500 text-white"><FileVideo size={36} /></div>;
  if (type === "pdf")
    return <div className="flex h-12 w-12 items-center justify-center rounded bg-red-500 text-white"><FileText size={36} /></div>;
  if (type === "zip")
    return <div className="flex h-12 w-12 items-center justify-center rounded bg-yellow-500 text-white"><FileArchive size={36} /></div>;
  return <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-400 text-white"><FileText size={36} /></div>;
}

function typeColor(type: FileType) {
  if (type === "folder") return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
  if (type === "jpg" || type === "png") return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
  if (type === "mp4") return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
  if (type === "pdf") return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  if (type === "zip") return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
  return "bg-muted text-muted-foreground";
}

export default function FileManagerPage() {
  const [entries, setEntries] = useState<FileEntry[]>(initialEntries);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [starred, setStarred] = useState<Set<string>>(new Set(["2", "3"]));
  const [view, setView] = useState<"list" | "grid">("list");
  const [sortAsc, setSortAsc] = useState(true);

  // Upload dialog
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadName, setUploadName] = useState("");
  const [uploadType, setUploadType] = useState<FileType>("pdf");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Rename dialog
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameName, setRenameName] = useState("");

  // Delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Context menu
  const [menuId, setMenuId] = useState<string | null>(null);

  // ── derived list ──────────────────────────────────────────────────────────
  const filtered = entries
    .filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))
    .filter((e) => (typeFilter ? e.type === typeFilter : true))
    .filter((e) => (dateFilter ? e.modified.includes(dateFilter.replace(" 2026", "")) : true))
    .sort((a, b) => {
      const cmp = a.name.localeCompare(b.name);
      return sortAsc ? cmp : -cmp;
    });

  // ── select ────────────────────────────────────────────────────────────────
  const allChecked = filtered.length > 0 && filtered.every((e) => selected.has(e.id));

  function toggleAll() {
    if (allChecked) setSelected(new Set());
    else setSelected(new Set(filtered.map((e) => e.id)));
  }

  function toggleOne(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  }

  // ── star ──────────────────────────────────────────────────────────────────
  function toggleStar(id: string) {
    const next = new Set(starred);
    if (next.has(id)) next.delete(id); else next.add(id);
    setStarred(next);
  }

  // ── upload ────────────────────────────────────────────────────────────────
  function handleUpload() {
    if (!uploadName.trim()) return;
    const now = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const modified = `${String(now.getDate()).padStart(2, "0")} ${months[now.getMonth()]} ${now.getFullYear()}`;
    const modifiedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }).toLowerCase();
    setEntries((prev) => [
      {
        id: String(Date.now()),
        name: uploadName.trim(),
        size: "—",
        type: uploadType,
        modified,
        modifiedTime,
      },
      ...prev,
    ]);
    setUploadName("");
    setUploadOpen(false);
  }

  // ── rename ────────────────────────────────────────────────────────────────
  function openRename(entry: FileEntry) {
    setMenuId(null);
    setRenameId(entry.id);
    setRenameName(entry.name);
  }

  function confirmRename() {
    if (!renameName.trim()) return;
    setEntries((prev) => prev.map((e) => e.id === renameId ? { ...e, name: renameName.trim() } : e));
    setRenameId(null);
  }

  // ── delete ────────────────────────────────────────────────────────────────
  function openDelete(id: string) {
    setMenuId(null);
    setDeleteId(id);
  }

  function confirmDelete() {
    setEntries((prev) => prev.filter((e) => e.id !== deleteId));
    setSelected((prev) => { const next = new Set(prev); next.delete(deleteId!); return next; });
    setDeleteId(null);
  }

  // ── download (simulated) ──────────────────────────────────────────────────
  function handleDownload(entry: FileEntry) {
    setMenuId(null);
    const a = document.createElement("a");
    a.href = "#";
    a.download = entry.name;
    a.click();
  }

  // ── grid card ─────────────────────────────────────────────────────────────
  function GridCard({ entry }: { entry: FileEntry }) {
    return (
      <div className="group relative flex flex-col gap-3 rounded-xl border bg-card p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <input
            type="checkbox"
            checked={selected.has(entry.id)}
            onChange={() => toggleOne(entry.id)}
            className="h-4 w-4 rounded border-gray-300 accent-primary"
            aria-label={`Select ${entry.name}`}
          />
          <div className="flex items-center gap-1">
            <button onClick={() => toggleStar(entry.id)} className="rounded p-1 hover:bg-muted" aria-label="Toggle star">
              <Star size={14} className={starred.has(entry.id) ? "fill-amber-400 text-amber-400" : "text-muted-foreground"} />
            </button>
            <div className="relative">
              <button onClick={() => setMenuId(menuId === entry.id ? null : entry.id)} className="rounded p-1 hover:bg-muted" aria-label="More options">
                <MoreVertical size={14} className="text-muted-foreground" />
              </button>
              {menuId === entry.id && <ContextMenu entry={entry} />}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 py-2">
          <FileIcon type={entry.type} />
          <span className="text-center text-sm font-medium leading-tight">{entry.name}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{entry.size}</span>
          <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${typeColor(entry.type)}`}>{entry.type}</span>
        </div>
        <div className="text-xs text-muted-foreground">{entry.modified} · {entry.modifiedTime}</div>
      </div>
    );
  }

  // ── context menu ──────────────────────────────────────────────────────────
  function ContextMenu({ entry }: { entry: FileEntry }) {
    return (
      <div className="absolute right-0 top-7 z-50 min-w-[140px] rounded-lg border bg-popover py-1 shadow-lg">
        <button
          onClick={() => handleDownload(entry)}
          className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
        >
          <Download size={13} /> Download
        </button>
        <button
          onClick={() => openRename(entry)}
          className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
        >
          <Pencil size={13} /> Rename
        </button>
        <button
          onClick={() => openDelete(entry.id)}
          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-accent"
        >
          <Trash2 size={13} /> Delete
        </button>
      </div>
    );
  }

  return (
    <PageStack>
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">File manager</h1>
        <Button size="sm" className="gap-1.5" onClick={() => setUploadOpen(true)}>
          <UploadCloud size={14} />
          Upload
        </Button>
      </div>

      {/* ── Toolbar ────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-56">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-8 text-sm" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <DropdownSelect
            value={dateFilter}
            onChange={setDateFilter}
            options={dateOptions}
            className="h-9 w-36 text-sm"
          />
          <DropdownSelect
            value={typeFilter}
            onChange={setTypeFilter}
            options={typeOptions}
            className="h-9 w-32 text-sm"
          />
          <button
            onClick={() => setView("list")}
            className={`rounded-md border p-1.5 hover:bg-muted transition-colors ${view === "list" ? "bg-muted" : "bg-background"}`}
            aria-label="List view"
          >
            <LayoutList size={16} />
          </button>
          <button
            onClick={() => setView("grid")}
            className={`rounded-md border p-1.5 hover:bg-muted transition-colors ${view === "grid" ? "bg-muted" : "bg-background"}`}
            aria-label="Grid view"
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>

      {/* ── Grid view ──────────────────────────────────────── */}
      {view === "grid" && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((entry) => <GridCard key={entry.id} entry={entry} />)}
          {filtered.length === 0 && (
            <p className="col-span-full py-10 text-center text-sm text-muted-foreground">No files found.</p>
          )}
        </div>
      )}

      {/* ── List view ──────────────────────────────────────── */}
      {view === "list" && (
        <div
          className="rounded-xl border bg-card"
          onClick={(e) => { if ((e.target as HTMLElement).closest("[data-menu]") === null) setMenuId(null); }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="w-10 px-4 py-3">
                  <input type="checkbox" checked={allChecked} onChange={toggleAll} className="h-4 w-4 rounded border-gray-300 accent-primary" aria-label="Select all" />
                </th>
                <th className="px-2 py-3 text-left">
                  <button
                    className="flex items-center gap-1 font-semibold text-foreground hover:text-primary transition-colors"
                    onClick={() => setSortAsc(!sortAsc)}
                  >
                    Name {sortAsc ? "↑" : "↓"}
                  </button>
                </th>
                <th className="px-2 py-3 text-left font-medium text-muted-foreground">Size</th>
                <th className="px-2 py-3 text-left font-medium text-muted-foreground">Type</th>
                <th className="px-2 py-3 text-left font-medium text-muted-foreground">Modified</th>
                <th className="px-2 py-3 text-left font-medium text-muted-foreground">Shared</th>
                <th className="w-20 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="py-10 text-center text-sm text-muted-foreground">No files found.</td></tr>
              )}
              {filtered.map((entry) => (
                <tr key={entry.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.has(entry.id)} onChange={() => toggleOne(entry.id)} className="h-4 w-4 rounded border-gray-300 accent-primary" aria-label={`Select ${entry.name}`} />
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-3">
                      <FileIcon type={entry.type} />
                      <span className="font-medium">{entry.name}</span>
                    </div>
                  </td>
                  <td className="px-2 py-3 text-muted-foreground">{entry.size}</td>
                  <td className="px-2 py-3">
                    <span className={`rounded px-2 py-0.5 text-xs font-medium ${typeColor(entry.type)}`}>{entry.type}</span>
                  </td>
                  <td className="px-2 py-3">
                    <div className="text-sm">{entry.modified}</div>
                    <div className="text-xs text-muted-foreground">{entry.modifiedTime}</div>
                  </td>
                  <td className="px-2 py-3">
                    {entry.shared && entry.shared.length > 0 && (
                      <div className="flex -space-x-2">
                        {entry.shared.slice(0, 2).map((s, i) => (
                          <div key={i} className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-background text-xs font-semibold text-white ${avatarColors[i % avatarColors.length]}`}>{s}</div>
                        ))}
                        {entry.shared.length > 2 && (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-semibold text-muted-foreground">+{entry.shared.length - 2}</div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => toggleStar(entry.id)} className="rounded p-1 hover:bg-muted" aria-label="Toggle star">
                        <Star size={15} className={starred.has(entry.id) ? "fill-amber-400 text-amber-400" : "text-muted-foreground"} />
                      </button>
                      <div className="relative" data-menu>
                        <button onClick={() => setMenuId(menuId === entry.id ? null : entry.id)} className="rounded p-1 hover:bg-muted" aria-label="More options">
                          <MoreVertical size={15} className="text-muted-foreground" />
                        </button>
                        {menuId === entry.id && <ContextMenu entry={entry} />}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Upload dialog ──────────────────────────────────── */}
      <Modal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Upload file"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setUploadOpen(false)}><X size={13} /> Cancel</Button>
            <Button size="sm" onClick={handleUpload} disabled={!uploadName.trim()}><UploadCloud size={13} /> Upload</Button>
          </>
        }
      >
        <div className="flex flex-col gap-3 pt-2">
          <div
            className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/30 py-6 text-center hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud size={28} className="text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Click to browse or drag &amp; drop</p>
            <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => { if (e.target.files?.[0]) setUploadName(e.target.files[0].name); }} />
          </div>
          <Input placeholder="File name" value={uploadName} onChange={(e) => setUploadName(e.target.value)} />
          <DropdownSelect
            value={uploadType}
            onChange={(v) => setUploadType(v as FileType)}
            options={typeOptions.filter((o) => o.value !== "")}
            placeholder="File type"
          />
        </div>
      </Modal>

      {/* ── Rename dialog ──────────────────────────────────── */}
      <Modal
        open={renameId !== null}
        onClose={() => setRenameId(null)}
        title="Rename"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setRenameId(null)}><X size={13} /> Cancel</Button>
            <Button size="sm" onClick={confirmRename} disabled={!renameName.trim()}><Check size={13} /> Save</Button>
          </>
        }
      >
        <div className="pt-2">
          <Input
            value={renameName}
            onChange={(e) => setRenameName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && confirmRename()}
            autoFocus
          />
        </div>
      </Modal>

      {/* ── Delete confirm dialog ──────────────────────────── */}
      <Modal
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="Delete file"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setDeleteId(null)}><X size={13} /> Cancel</Button>
            <Button size="sm" variant="destructive" onClick={confirmDelete}><Trash2 size={13} /> Delete</Button>
          </>
        }
      >
        <p className="pt-1">
          Are you sure you want to delete{" "}
          <span className="font-medium text-foreground">{entries.find((e) => e.id === deleteId)?.name}</span>?
          {" "}This cannot be undone.
        </p>
      </Modal>
    </PageStack>
  );
}
