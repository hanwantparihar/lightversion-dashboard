"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  initialLeads,
  initialNotes,
  initialTasks,
  nextLeadId,
  nextNoteId,
  nextTaskId,
  type CrmNote,
  type CrmTask,
  type Lead,
} from "@/lib/crm-data";

type CrmContextValue = {
  leads: Lead[];
  tasks: CrmTask[];
  notes: CrmNote[];
  addLead: (data: Omit<Lead, "id">) => number;
  updateLead: (id: number, data: Partial<Lead>) => void;
  deleteLead: (id: number) => void;
  addTask: (data: Omit<CrmTask, "id">) => number;
  updateTask: (id: number, data: Partial<CrmTask>) => void;
  addNote: (data: Omit<CrmNote, "id">) => number;
  deleteNote: (id: number) => void;
};

const CrmContext = createContext<CrmContextValue | null>(null);

export function CrmProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [tasks, setTasks] = useState<CrmTask[]>(initialTasks);
  const [notes, setNotes] = useState<CrmNote[]>(initialNotes);

  const addLead = useCallback((data: Omit<Lead, "id">) => {
    let newId = 0;
    setLeads((prev) => {
      newId = nextLeadId(prev);
      return [...prev, { ...data, id: newId }];
    });
    return newId;
  }, []);

  const updateLead = useCallback((id: number, data: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...data } : l))
    );
  }, []);

  const deleteLead = useCallback((id: number) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const addTask = useCallback((data: Omit<CrmTask, "id">) => {
    let newId = 0;
    setTasks((prev) => {
      newId = nextTaskId(prev);
      return [...prev, { ...data, id: newId }];
    });
    return newId;
  }, []);

  const updateTask = useCallback((id: number, data: Partial<CrmTask>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t))
    );
  }, []);

  const addNote = useCallback((data: Omit<CrmNote, "id">) => {
    let newId = 0;
    setNotes((prev) => {
      newId = nextNoteId(prev);
      return [...prev, { ...data, id: newId }];
    });
    return newId;
  }, []);

  const deleteNote = useCallback((id: number) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      leads,
      tasks,
      notes,
      addLead,
      updateLead,
      deleteLead,
      addTask,
      updateTask,
      addNote,
      deleteNote,
    }),
    [
      leads,
      tasks,
      notes,
      addLead,
      updateLead,
      deleteLead,
      addTask,
      updateTask,
      addNote,
      deleteNote,
    ]
  );

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>;
}

export function useCrm() {
  const ctx = useContext(CrmContext);
  if (!ctx) throw new Error("useCrm must be used within CrmProvider");
  return ctx;
}
