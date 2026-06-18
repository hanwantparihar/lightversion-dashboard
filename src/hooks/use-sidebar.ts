"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "nexora-ai-sidebar-collapsed";

export function useSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "true") setCollapsed(true);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  };

  return {
    collapsed,
    mobileOpen,
    toggleCollapsed,
    openMobile: () => setMobileOpen(true),
    closeMobile: () => setMobileOpen(false),
  };
}
