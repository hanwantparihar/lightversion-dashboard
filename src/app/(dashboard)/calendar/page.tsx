"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Card, CardContent, Button } from "@/components/ui";
import { PageStack } from "@/components";
import { CALENDAR_EVENTS, type CalendarEvent } from "@/lib/calendar-data";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const CATEGORY_COLORS: Record<CalendarEvent["category"], string> = {
    meeting: "#2563eb",
    deadline: "#ef4444",
    reminder: "#f59e0b",
    event: "#10b981",
};

export default function CalendarPage() {
    const [year, setYear] = useState(2026);
    const [month, setMonth] = useState(6); // July
    const [selected, setSelected] = useState<number | null>(null);

    function prev() {
        if (month === 0) { setMonth(11); setYear((y) => y - 1); }
        else setMonth((m) => m - 1);
        setSelected(null);
    }
    function next() {
        if (month === 11) { setMonth(0); setYear((y) => y + 1); }
        else setMonth((m) => m + 1);
        setSelected(null);
    }

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) =>
        i < firstDay ? null : i - firstDay + 1
    );

    const eventsForMonth = CALENDAR_EVENTS.filter((e) => e.month === month && e.year === year);
    const eventsByDay: Record<number, CalendarEvent[]> = {};
    for (const ev of eventsForMonth) {
        if (!eventsByDay[ev.date]) eventsByDay[ev.date] = [];
        eventsByDay[ev.date].push(ev);
    }

    const selectedEvents = selected ? (eventsByDay[selected] ?? []) : [];
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

    return (
        <PageStack>
            <div className="fb">
                {/* <div>
                    <h2 style={{ fontWeight: 800, fontSize: 22 }}>Calendar</h2>
                    <p style={{ color: "var(--mt-fg)", fontSize: 14, marginTop: 2 }}>Manage team events and deadlines</p>
                </div> */}
                <Button><Plus size={16} /> Add Event</Button>
            </div>

            {/* Legend */}
            <div className="fc g3" style={{ flexWrap: "wrap" }}>
                {(Object.entries(CATEGORY_COLORS) as [CalendarEvent["category"], string][]).map(([cat, color]) => (
                    <span key={cat} className="fc g1" style={{ fontSize: 12, fontWeight: 600, textTransform: "capitalize" }}>
                        <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, display: "inline-block" }} />
                        {cat}
                    </span>
                ))}
            </div>

            <div className="gr g-31 g2" style={{ alignItems: "start" }}>
                <Card style={{ overflow: "hidden" }}>
                    {/* Header */}
                    <div className="fb" style={{ padding: "16px 20px", borderBottom: "1px solid var(--bd)" }}>
                        <button onClick={prev} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--mt-fg)", display: "flex" }}>
                            <ChevronLeft size={20} />
                        </button>
                        <span style={{ fontWeight: 800, fontSize: 17 }}>
                            {MONTHS[month]} {year}
                        </span>
                        <button onClick={next} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--mt-fg)", display: "flex" }}>
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    <CardContent style={{ padding: 0 }}>
                        {/* Day labels */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "1px solid var(--bd)" }}>
                            {DAYS.map((d) => (
                                <div key={d} style={{ padding: "10px 0", textAlign: "center", fontSize: 12, fontWeight: 700, color: "var(--mt-fg)" }}>
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Day cells */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
                            {cells.map((day, i) => {
                                const isToday = isCurrentMonth && day === today.getDate();
                                const isSelected = day === selected;
                                const dayEvents = day ? (eventsByDay[day] ?? []) : [];
                                return (
                                    <div
                                        key={i}
                                        onClick={() => day && setSelected(day === selected ? null : day)}
                                        style={{
                                            minHeight: 80,
                                            borderBottom: "1px solid var(--bd)",
                                            borderRight: (i + 1) % 7 === 0 ? "none" : "1px solid var(--bd)",
                                            padding: "8px 10px",
                                            cursor: day ? "pointer" : "default",
                                            background: isSelected ? "var(--ac)" : "transparent",
                                            transition: "background .15s",
                                        }}
                                    >
                                        {day && (
                                            <>
                                                <div
                                                    style={{
                                                        width: 28, height: 28, borderRadius: "50%",
                                                        background: isToday ? "hsl(var(--primary))" : "transparent",
                                                        color: isToday ? "#fff" : "var(--fg)",
                                                        fontWeight: isToday ? 800 : 500,
                                                        fontSize: 13,
                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                        marginBottom: 4,
                                                    }}
                                                >
                                                    {day}
                                                </div>
                                                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                                    {dayEvents.slice(0, 2).map((ev) => (
                                                        <div
                                                            key={ev.id}
                                                            style={{
                                                                fontSize: 10, fontWeight: 600,
                                                                background: ev.color + "22", color: ev.color,
                                                                borderRadius: 4, padding: "1px 5px",
                                                                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                                                            }}
                                                        >
                                                            {ev.title}
                                                        </div>
                                                    ))}
                                                    {dayEvents.length > 2 && (
                                                        <div style={{ fontSize: 10, color: "var(--mt-fg)", fontWeight: 600 }}>
                                                            +{dayEvents.length - 2} more
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Sidebar — selected day / upcoming */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {selected && (
                        <Card>
                            <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--bd)", fontWeight: 700, fontSize: 15 }}>
                                {MONTHS[month]} {selected}, {year}
                            </div>
                            <CardContent style={{ padding: 0 }}>
                                {selectedEvents.length === 0 ? (
                                    <div style={{ padding: "20px", fontSize: 13, color: "var(--mt-fg)" }}>No events this day.</div>
                                ) : (
                                    selectedEvents.map((ev) => (
                                        <div key={ev.id} className="fc g3" style={{ padding: "14px 20px", borderBottom: "1px solid var(--bd)" }}>
                                            <div style={{ width: 10, height: 10, borderRadius: "50%", background: ev.color, flexShrink: 0 }} />
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: 14 }}>{ev.title}</div>
                                                {ev.time && <div style={{ fontSize: 12, color: "var(--mt-fg)" }}>{ev.time}</div>}
                                            </div>
                                            <span style={{ marginLeft: "auto", fontSize: 11, padding: "2px 8px", borderRadius: 20, background: ev.color + "22", color: ev.color, fontWeight: 600, textTransform: "capitalize" }}>
                                                {ev.category}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--bd)", fontWeight: 700, fontSize: 15 }}>
                            Upcoming Events
                        </div>
                        <CardContent style={{ padding: 0 }}>
                            {eventsForMonth.slice(0, 6).map((ev) => (
                                <div key={ev.id} className="fc g3" style={{ padding: "12px 20px", borderBottom: "1px solid var(--bd)" }}>
                                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: ev.color, flexShrink: 0 }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, fontSize: 13 }}>{ev.title}</div>
                                        <div style={{ fontSize: 11, color: "var(--mt-fg)" }}>
                                            {MONTHS[month]} {ev.date}{ev.time ? ` · ${ev.time}` : ""}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageStack>
    );
}
