"use client";

import { useRef, useState, useCallback } from "react";
import {
  UploadCloud,
  Search,
  LayoutGrid,
  LayoutList,
  Image as ImageIcon,
  Film,
  FileText,
  Music,
  Archive,
  File,
  Trash2,
  Download,
  Check,
  X,
  MoreVertical,
  Plus,
} from "lucide-react";
import { Button, Input, Modal, DropdownSelect } from "@/components/ui";
import { PageStack } from "@/components";

// ── Types ──────────────────────────────────────────────────────────────────────
type MediaType = "Images" | "Video" | "Audio" | "Documents" | "Archives";

interface MediaFile {
  id: string;
  name: string;
  type: MediaType;
  size: string;
  date: string;
  color: string;
  label: string;
  src?: string;
}

// ── Data ───────────────────────────────────────────────────────────────────────
const MEDIA_ITEMS: MediaFile[] = [
  { id: "1", name: "ai-img-1.jpg", type: "Images", size: "1.2 MB", date: "Jun 2026", color: "#2563eb", label: "AI Image 1", src: "/ai-img-1.jpg" },
  { id: "2", name: "ai-img-2.jpg", type: "Images", size: "980 KB", date: "Jun 2026", color: "#0891b2", label: "AI Image 2", src: "/ai-img-2.jpg" },
  { id: "3", name: "ai-img-3.jpg", type: "Images", size: "860 KB", date: "May 2026", color: "#7c3aed", label: "AI Image 3", src: "/ai-img-3.jpg" },
  { id: "4", name: "hd-webcam.mp4", type: "Video", size: "64 MB", date: "May 2026", color: "#b45309", label: "HD Webcam" },
  { id: "5", name: "spacious-play.jpg", type: "Images", size: "1.5 MB", date: "May 2026", color: "#047857", label: "Spacious Play", src: "/ai-img-3.jpg" },
  { id: "6", name: "award-winning-day.jpg", type: "Images", size: "1.1 MB", date: "Apr 2026", color: "#9d174d", label: "Award Winning Day" },
  { id: "7", name: "dogboard-img1.png", type: "Images", size: "320 KB", date: "Apr 2026", color: "#15803d", label: "dogboardImage 1" },
  { id: "8", name: "group-2.jpg", type: "Images", size: "740 KB", date: "Apr 2026", color: "#b91c1c", label: "Group 2" },
  { id: "9", name: "screenshot-4.png", type: "Images", size: "520 KB", date: "Mar 2026", color: "#1d4ed8", label: "Screenshot_4" },
  { id: "10", name: "screenshot-3.png", type: "Images", size: "490 KB", date: "Mar 2026", color: "#6d28d9", label: "Screenshot_3" },
  { id: "11", name: "image-main.png", type: "Images", size: "2.1 MB", date: "Mar 2026", color: "#d97706", label: "image" },
  { id: "12", name: "brand-assets.zip", type: "Archives", size: "18 MB", date: "Mar 2026", color: "#374151", label: "brand-assets" },
  { id: "13", name: "frame-1.psd", type: "Documents", size: "6.4 MB", date: "Feb 2026", color: "#0f766e", label: "Frame 1" },
  { id: "14", name: "heading-2-decatur.jpg", type: "Images", size: "830 KB", date: "Feb 2026", color: "#be185d", label: "Heading 2 – DECATUR" },
  { id: "15", name: "heading-2-cheshire.jpg", type: "Images", size: "910 KB", date: "Feb 2026", color: "#7c3aed", label: "Heading 2 – cheshire" },
  { id: "16", name: "heading-pharr.jpg", type: "Images", size: "870 KB", date: "Feb 2026", color: "#1e40af", label: "Heading 2 – pharr" },
  { id: "17", name: "lambert.jpg", type: "Images", size: "660 KB", date: "Jan 2026", color: "#065f46", label: "Lambert" },
  { id: "18", name: "sandy-springs-1.jpg", type: "Images", size: "720 KB", date: "Jan 2026", color: "#92400e", label: "Heading 2 – SANDY SPRINGS" },
  { id: "19", name: "sandy-springs-2.jpg", type: "Images", size: "750 KB", date: "Jan 2026", color: "#1e3a5f", label: "Heading 2 – SANDY SPRINGS" },
  { id: "20", name: "east-cobb.jpg", type: "Images", size: "800 KB", date: "Jan 2026", color: "#4a1942", label: "Heading 2 – EAST COBB" },
  { id: "21", name: "line-1.svg", type: "Images", size: "12 KB", date: "Dec 2025", color: "#ca8a04", label: "line" },
  { id: "22", name: "line-2.svg", type: "Images", size: "12 KB", date: "Dec 2025", color: "#a16207", label: "line" },
  { id: "23", name: "free-first-day.jpg", type: "Images", size: "1.3 MB", date: "Dec 2025", color: "#0e7490", label: "Tablet" },
  { id: "24", name: "free-first-mobile.jpg", type: "Images", size: "980 KB", date: "Dec 2025", color: "#155e75", label: "Mobile 1" },
  { id: "25", name: "desktop-1.jpg", type: "Images", size: "1.1 MB", date: "Nov 2025", color: "#1e40af", label: "Desktop 1" },
  { id: "26", name: "desktop.jpg", type: "Images", size: "1.0 MB", date: "Nov 2025", color: "#1e3a8a", label: "Desktop" },
  { id: "27", name: "backtowebsite.png", type: "Images", size: "430 KB", date: "Nov 2025", color: "#134e4a", label: "backtowebsite" },
  { id: "28", name: "promo-audio.mp3", type: "Audio", size: "3.2 MB", date: "Nov 2025", color: "#7c2d12", label: "promo-audio" },
  { id: "29", name: "bhv-banner.jpg", type: "Images", size: "1.4 MB", date: "Oct 2025", color: "#14532d", label: "BHV BANNER" },
  { id: "30", name: "first-night-boarding.jpg", type: "Images", size: "1.2 MB", date: "Oct 2025", color: "#1a1a2e", label: "First Night Boarding" },
  { id: "31", name: "east-cobb-4.jpg", type: "Images", size: "690 KB", date: "Oct 2025", color: "#16213e", label: "East Cobb 4" },
  { id: "32", name: "atlanta-dogboarding.jpg", type: "Images", size: "770 KB", date: "Oct 2025", color: "#0f3460", label: "Atlanta-dogboarding" },
  { id: "33", name: "july-special.jpg", type: "Images", size: "880 KB", date: "Sep 2025", color: "#533483", label: "JULY Special" },
  { id: "34", name: "report-q3.pdf", type: "Documents", size: "2.8 MB", date: "Sep 2025", color: "#374151", label: "report-q3" },
  { id: "35", name: "free-1st-promo.jpg", type: "Images", size: "1.0 MB", date: "Sep 2025", color: "#9a3412", label: "Free 1st Night" },
];

const typeOptions = [
  { value: "", label: "All media items" },
  { value: "Images", label: "Images" },
  { value: "Video", label: "Video" },
  { value: "Audio", label: "Audio" },
  { value: "Documents", label: "Documents" },
  { value: "Archives", label: "Archives" },
];

const dateOptions = [
  { value: "", label: "All dates" },
  { value: "Jun 2026", label: "Jun 2026" },
  { value: "May 2026", label: "May 2026" },
  { value: "Apr 2026", label: "Apr 2026" },
  { value: "Mar 2026", label: "Mar 2026" },
  { value: "Feb 2026", label: "Feb 2026" },
  { value: "Jan 2026", label: "Jan 2026" },
  { value: "Dec 2025", label: "Dec 2025" },
  { value: "Nov 2025", label: "Nov 2025" },
  { value: "Oct 2025", label: "Oct 2025" },
  { value: "Sep 2025", label: "Sep 2025" },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
function typeColor(type: MediaType) {
  if (type === "Images") return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
  if (type === "Video") return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
  if (type === "Audio") return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
  if (type === "Documents") return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  if (type === "Archives") return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
  return "bg-muted text-muted-foreground";
}

function TypeIcon({ type, size = 14 }: { type: MediaType; size?: number }) {
  if (type === "Images") return <ImageIcon size={size} />;
  if (type === "Video") return <Film size={size} />;
  if (type === "Audio") return <Music size={size} />;
  if (type === "Documents") return <FileText size={size} />;
  if (type === "Archives") return <Archive size={size} />;
  return <File size={size} />;
}

// ── Grid card ──────────────────────────────────────────────────────────────────
function GridCard({
  item,
  selected,
  bulkMode,
  onToggle,
  onDownload,
  onDelete,
}: {
  item: MediaFile;
  selected: boolean;
  bulkMode: boolean;
  onToggle: (id: string) => void;
  onDownload: (item: MediaFile) => void;
  onDelete: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className={`group relative flex cursor-pointer flex-col rounded-xl border bg-card transition-shadow hover:shadow-md ${selected ? "ring-2 ring-primary border-primary" : ""
        }`}
      onClick={() => bulkMode && onToggle(item.id)}
    >
      {/* Thumbnail */}
      <div
        className="relative flex h-36 items-center justify-center overflow-hidden rounded-t-xl"
        style={item.src ? undefined : { background: `linear-gradient(135deg, ${item.color}dd, ${item.color}66)` }}
      >
        {item.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.src} alt={item.label} className="h-full w-full object-cover" />
        ) : (
          <span className="px-3 text-center text-[10px] font-bold uppercase tracking-wide text-white leading-tight drop-shadow">
            {item.label}
          </span>
        )}
        {/* Bulk checkbox */}
        {bulkMode && (
          <div className={`absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded border-2 bg-white transition-all ${selected ? "border-primary" : "border-white/70"
            }`}>
            {selected && <Check size={11} className="text-primary" />}
          </div>
        )}
        {/* Context menu trigger — only show when not in bulk mode */}
        {!bulkMode && (
          <div className="absolute right-1.5 top-1.5" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="rounded p-1 bg-black/20 hover:bg-black/40 text-white transition-colors opacity-0 group-hover:opacity-100"
              aria-label="More options"
            >
              <MoreVertical size={13} />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-7 z-20 min-w-[130px] rounded-lg border bg-popover py-1 shadow-lg">
                  <button
                    onClick={() => { onDownload(item); setMenuOpen(false); }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors"
                  >
                    <Download size={13} /> Download
                  </button>
                  <button
                    onClick={() => { onDelete(item.id); setMenuOpen(false); }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm rounded-lg text-destructive hover:bg-accent transition-colors"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-0.5 p-2">
        <p className="truncate text-[11px] font-medium text-foreground">{item.name}</p>
        <div className="flex items-center justify-between">
          <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${typeColor(item.type)}`}>
            {item.type}
          </span>
          <span className="text-[10px] text-muted-foreground">{item.size}</span>
        </div>
      </div>
    </div>
  );
}

// ── List row ───────────────────────────────────────────────────────────────────
function ListRow({
  item,
  selected,
  bulkMode,
  onToggle,
  onDownload,
  onDelete,
}: {
  item: MediaFile;
  selected: boolean;
  bulkMode: boolean;
  onToggle: (id: string) => void;
  onDownload: (item: MediaFile) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <tr className={`border-b last:border-0 transition-colors hover:bg-muted/30 ${selected ? "bg-primary/5" : ""}`}>
      <td className="px-4 py-3">
        {bulkMode && (
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggle(item.id)}
            className="h-4 w-4 rounded border-gray-300 accent-primary"
            aria-label={`Select ${item.name}`}
          />
        )}
      </td>
      <td className="px-2 py-3" style={{ minWidth: "200px" }}>
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg overflow-hidden text-white"
            style={item.src ? undefined : { background: `${item.color}cc` }}
          >
            {item.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.src} alt={item.label} className="h-full w-full object-cover" />
            ) : (
              <TypeIcon type={item.type} size={14} />
            )}
          </div>
          <span className="font-medium text-sm truncate">{item.name}</span>
        </div>
      </td>
      <td className="px-2 py-3 text-sm text-muted-foreground whitespace-nowrap" style={{ minWidth: "80px" }}>{item.size}</td>
      <td className="px-2 py-3" style={{ minWidth: "110px" }}>
        <span className={`rounded px-2 py-0.5 text-xs font-medium whitespace-nowrap ${typeColor(item.type)}`}>
          {item.type}
        </span>
      </td>
      <td className="px-2 py-3 text-sm text-muted-foreground whitespace-nowrap" style={{ minWidth: "100px" }}>{item.date}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onDownload(item)}
            className="rounded p-1.5 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Download"
          >
            <Download size={14} />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="rounded p-1.5 hover:bg-muted transition-colors text-muted-foreground hover:text-destructive"
            aria-label="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function MediaGalleryPage() {
  const [items, setItems] = useState<MediaFile[]>(MEDIA_ITEMS);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [search, setSearch] = useState("");
  const [bulkMode, setBulkMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Filter ─────────────────────────────────────────────────────────────────
  const filtered = items.filter((item) => {
    const matchType = !typeFilter || item.type === typeFilter;
    const matchDate = !dateFilter || item.date === dateFilter;
    const matchSearch = !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.label.toLowerCase().includes(search.toLowerCase());
    return matchType && matchDate && matchSearch;
  });

  // ── Select ─────────────────────────────────────────────────────────────────
  const allSelected = filtered.length > 0 && filtered.every((i) => selected.has(i.id));

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(filtered.map((i) => i.id)));
  }

  function exitBulk() {
    setBulkMode(false);
    setSelected(new Set());
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  function confirmDelete() {
    const toRemove = deleteId ? new Set([deleteId]) : selected;
    setItems((prev) => prev.filter((i) => !toRemove.has(i.id)));
    setSelected((prev) => { const next = new Set(prev); toRemove.forEach((id) => next.delete(id)); return next; });
    setDeleteId(null);
  }

  // ── Upload (simulated) ─────────────────────────────────────────────────────
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setPreviewFiles(prev => [...prev, ...files]);
  }, []);

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setPreviewFiles(prev => [...prev, ...newFiles]);
      e.target.value = ''; // Reset input
    }
  }

  function confirmUpload() {
    if (previewFiles.length === 0) return;

    const now = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const date = `${months[now.getMonth()]} ${now.getFullYear()}`;
    const newItems: MediaFile[] = previewFiles.map((f, i) => ({
      id: String(Date.now() + i),
      name: f.name,
      type: f.type.startsWith("image/") ? "Images"
        : f.type.startsWith("video/") ? "Video"
          : f.type.startsWith("audio/") ? "Audio"
            : f.name.endsWith(".zip") || f.name.endsWith(".tar") ? "Archives"
              : "Documents",
      size: f.size > 1_000_000 ? `${(f.size / 1_000_000).toFixed(1)} MB` : `${Math.round(f.size / 1000)} KB`,
      date,
      color: "#2563eb",
      label: f.name.replace(/\.[^.]+$/, ""),
      src: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined,
    }));
    setItems((prev) => [...newItems, ...prev]);
    setPreviewFiles([]);
    setUploadOpen(false);
  }

  function cancelUpload() {
    setPreviewFiles([]);
    setUploadOpen(false);
  }

  function removePreviewFile(index: number) {
    setPreviewFiles(prev => prev.filter((_, i) => i !== index));
  }

  function handleDownload(item: MediaFile) {
    const a = document.createElement("a");
    a.href = "#";
    a.download = item.name;
    a.click();
  }

  const deleteName = deleteId ? items.find((i) => i.id === deleteId)?.name : `${selected.size} items`;

  return (
    <PageStack>
      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Media Gallery</h1>
        <Button size="sm" className="gap-1.5" onClick={() => setUploadOpen(true)}>
          <UploadCloud size={14} /> Upload
        </Button>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* View toggle */}
          <button
            onClick={() => setView("list")}
            className={`rounded-md border p-1.5 transition-colors hover:bg-muted ${view === "list" ? "bg-muted" : "bg-background"}`}
            aria-label="List view"
          >
            <LayoutList size={16} />
          </button>
          <button
            onClick={() => setView("grid")}
            className={`rounded-md border p-1.5 transition-colors hover:bg-muted ${view === "grid" ? "bg-muted" : "bg-background"}`}
            aria-label="Grid view"
          >
            <LayoutGrid size={16} />
          </button>

          {/* Filters */}
          <DropdownSelect
            value={typeFilter}
            onChange={setTypeFilter}
            options={typeOptions}
            className="h-9 w-40 text-sm"
          />
          <DropdownSelect
            value={dateFilter}
            onChange={setDateFilter}
            options={dateOptions}
            className="h-9 w-36 text-sm"
          />

          {/* Bulk */}
          {!bulkMode ? (
            <Button size="sm" variant="outline" onClick={() => setBulkMode(true)}>
              Bulk select
            </Button>
          ) : (
            <>
              <Button size="sm" variant="outline" onClick={toggleAll}>
                {allSelected ? "Deselect all" : "Select all"}
              </Button>
              {selected.size > 0 && (
                <>
                  <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                    {selected.size} selected
                  </span>
                  <Button size="sm" variant="ghost" className="gap-1 text-xs" onClick={() => { setDeleteId(null); confirmDelete(); }}>
                    <Trash2 size={13} /> Delete
                  </Button>
                </>
              )}
              <Button size="sm" variant="ghost" className="gap-1 text-xs" onClick={exitBulk}>
                <X size={13} /> Cancel
              </Button>
            </>
          )}
        </div>

        {/* Search */}
        <div className="relative w-56">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-8 text-sm"
            placeholder="Search media..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── Content ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-20 text-muted-foreground gap-2">
          <ImageIcon size={36} />
          <p className="text-sm">No media items found</p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filtered.map((item) => (
            <GridCard
              key={item.id}
              item={item}
              selected={selected.has(item.id)}
              bulkMode={bulkMode}
              onToggle={toggleOne}
              onDownload={handleDownload}
              onDelete={(id) => setDeleteId(id)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border bg-card overflow-x-auto">
          <table className="w-full text-sm" style={{ minWidth: "650px" }}>
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="w-10 px-4 py-3">
                  {bulkMode && (
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      className="h-4 w-4 rounded border-gray-300 accent-primary"
                      aria-label="Select all"
                    />
                  )}
                </th>
                <th className="px-2 py-3 text-left font-semibold text-foreground" style={{ minWidth: "200px" }}>Name</th>
                <th className="px-2 py-3 text-left font-medium text-muted-foreground" style={{ minWidth: "80px" }}>Size</th>
                <th className="px-2 py-3 text-left font-medium text-muted-foreground" style={{ minWidth: "110px" }}>Type</th>
                <th className="px-2 py-3 text-left font-medium text-muted-foreground" style={{ minWidth: "100px" }}>Date</th>
                <th className="w-20 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <ListRow
                  key={item.id}
                  item={item}
                  selected={selected.has(item.id)}
                  bulkMode={bulkMode}
                  onToggle={toggleOne}
                  onDownload={handleDownload}
                  onDelete={(id) => setDeleteId(id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Footer count ── */}
      <p className="text-xs text-muted-foreground">
        {filtered.length} item{filtered.length !== 1 ? "s" : ""}
        {typeFilter && ` · ${typeFilter}`}
        {dateFilter && ` · ${dateFilter}`}
      </p>

      {/* ── Upload modal ── */}
      <Modal
        open={uploadOpen}
        onClose={cancelUpload}
        title="Upload media"
        footer={
          previewFiles.length > 0 ? (
            <>
              <Button variant="outline" size="sm" onClick={cancelUpload}>
                <X size={13} /> Cancel
              </Button>
              <Button size="sm" onClick={confirmUpload}>
                <Check size={13} /> Upload {previewFiles.length} file{previewFiles.length !== 1 ? 's' : ''}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={cancelUpload}>
                <X size={13} /> Cancel
              </Button>
              <Button size="sm" onClick={() => fileInputRef.current?.click()}>
                <UploadCloud size={13} /> Select files
              </Button>
            </>
          )
        }
      >
        <div className="pt-2 space-y-4">
          {previewFiles.length === 0 ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 border-dashed py-10 text-center transition-colors ${dragging ? "border-primary bg-primary/5" : "border-muted-foreground/30 hover:border-primary/50"
                }`}
            >
              <UploadCloud size={32} className="text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Drop files to upload</p>
                <p className="text-xs text-muted-foreground">or click to browse</p>
              </div>
              <p className="text-xs text-muted-foreground">Maximum upload file size: 256 MB</p>
            </div>
          ) : (
            <>
              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="text-sm font-semibold mb-3">{previewFiles.length} file{previewFiles.length !== 1 ? 's' : ''} ready to upload</p>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {previewFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-3 rounded-lg border bg-card p-3">
                      {file.type.startsWith("image/") ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted">
                          <TypeIcon
                            type={
                              file.type.startsWith("video/") ? "Video"
                                : file.type.startsWith("audio/") ? "Audio"
                                  : file.name.endsWith(".zip") || file.name.endsWith(".tar") ? "Archives"
                                    : "Documents"
                            }
                            size={24}
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {file.size > 1_000_000 ? `${(file.size / 1_000_000).toFixed(1)} MB` : `${Math.round(file.size / 1000)} KB`}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePreviewFile(index)}
                        className="shrink-0"
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Plus size={14} /> Add more files
              </Button>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.zip,.tar"
            className="hidden"
            onChange={handleFileInput}
          />
        </div>
      </Modal>

      {/* ── Delete confirm modal ── */}
      <Modal
        open={deleteId !== null || (bulkMode && selected.size > 0 && deleteId === null && false)}
        onClose={() => setDeleteId(null)}
        title="Delete media"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setDeleteId(null)}>
              <X size={13} /> Cancel
            </Button>
            <Button size="sm" variant="destructive" onClick={confirmDelete}>
              <Trash2 size={13} /> Delete
            </Button>
          </>
        }
      >
        <p className="pt-1 text-sm text-muted-foreground">
          Are you sure you want to delete{" "}
          <span className="font-medium text-foreground">{deleteName}</span>?{" "}
          This cannot be undone.
        </p>
      </Modal>
    </PageStack>
  );
}
