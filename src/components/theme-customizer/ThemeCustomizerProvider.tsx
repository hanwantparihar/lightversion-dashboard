'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { useTheme } from 'next-themes'
import {
  useThemeCustomizer,
  hexToHsl,
  FONT_OPTIONS,
} from '@/contexts/theme-customizer-context'

// ─── DOM effect helper ─────────────────────────────────────────────────────

function cssVar(name: string, value: string) {
  document.documentElement.style.setProperty(name, value)
}

function setAttr(name: string, value: string) {
  document.documentElement.setAttribute(name, value)
}

function removeAttr(name: string) {
  document.documentElement.removeAttribute(name)
}

// ─── Provider ──────────────────────────────────────────────────────────────

export function ThemeCustomizerProvider({ children }: { children: ReactNode }) {
  const { settings, isReady } = useThemeCustomizer()
  const { setTheme }          = useTheme()
  const loadedFonts           = useRef<Set<string>>(new Set())

  // ── Color mode → next-themes ────────────────────────────────────────────
  useEffect(() => {
    if (!isReady) return
    setTheme(settings.colorMode)
  }, [settings.colorMode, isReady, setTheme])

  // ── Primary color → CSS variables ───────────────────────────────────────
  useEffect(() => {
    if (!isReady) return
    const hsl = hexToHsl(settings.primaryColor)
    cssVar('--primary',          hsl)
    cssVar('--ring',             hsl)
    cssVar('--chart-1',          hsl)
    cssVar('--sidebar-primary',  hsl)
    cssVar('--sidebar-ring',     hsl)
    cssVar('--accent-foreground', hsl)
  }, [settings.primaryColor, isReady])

  // ── Border radius → CSS variable ────────────────────────────────────────
  useEffect(() => {
    if (!isReady) return
    cssVar('--radius', `${settings.borderRadius / 16}rem`)
  }, [settings.borderRadius, isReady])

  // ── Font → Google Fonts load + CSS variable ─────────────────────────────
  useEffect(() => {
    if (!isReady) return
    const meta = FONT_OPTIONS.find(f => f.value === settings.font)
    if (!meta) return

    // Inject Google Font link tag only once per session
    if (meta.url && !loadedFonts.current.has(meta.value)) {
      const link      = document.createElement('link')
      link.rel        = 'stylesheet'
      link.href       = meta.url
      link.id         = `tc-font-${meta.value}`
      document.head.appendChild(link)
      loadedFonts.current.add(meta.value)
    }

    cssVar('--font-sans', meta.family)
    document.body.style.fontFamily = meta.family
  }, [settings.font, isReady])

  // ── Sidebar color → data attribute ──────────────────────────────────────
  useEffect(() => {
    if (!isReady) return
    setAttr('data-sidebar-color', settings.sidebarColor)
  }, [settings.sidebarColor, isReady])

  // ── Sidebar style → data attribute ──────────────────────────────────────
  useEffect(() => {
    if (!isReady) return
    setAttr('data-sidebar-style', settings.sidebarStyle)
  }, [settings.sidebarStyle, isReady])

  // ── Header style → data attribute ───────────────────────────────────────
  useEffect(() => {
    if (!isReady) return
    setAttr('data-header-style', settings.headerStyle)
  }, [settings.headerStyle, isReady])

  // ── Density → data attribute ─────────────────────────────────────────────
  useEffect(() => {
    if (!isReady) return
    setAttr('data-density', settings.density)
  }, [settings.density, isReady])

  // ── Card style → data attribute ──────────────────────────────────────────
  useEffect(() => {
    if (!isReady) return
    setAttr('data-card-style', settings.cardStyle)
  }, [settings.cardStyle, isReady])

  // ── Button style → data attribute ────────────────────────────────────────
  useEffect(() => {
    if (!isReady) return
    setAttr('data-button-style', settings.buttonStyle)
  }, [settings.buttonStyle, isReady])

  // ── Table styles → data attribute ───────────────────────────────────────
  useEffect(() => {
    if (!isReady) return
    setAttr('data-table-style', settings.tableStyles.join(' '))
  }, [settings.tableStyles, isReady])

  // ── Scrollbar → data attribute ───────────────────────────────────────────
  useEffect(() => {
    if (!isReady) return
    setAttr('data-scrollbar', settings.scrollbar)
  }, [settings.scrollbar, isReady])

  // ── Animation ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isReady) return
    if (!settings.animationEnabled) {
      setAttr('data-animation', 'off')
    } else {
      setAttr('data-animation', settings.animationSpeed)
    }
  }, [settings.animationEnabled, settings.animationSpeed, isReady])

  // ── Page transition ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!isReady) return
    setAttr('data-transition', settings.pageTransition)
  }, [settings.pageTransition, isReady])

  // ── Layout & content width ────────────────────────────────────────────────
  useEffect(() => {
    if (!isReady) return
    setAttr('data-layout', settings.layoutWidth)
    setAttr('data-content-width', settings.contentWidth)
  }, [settings.layoutWidth, settings.contentWidth, isReady])

  // ── Breadcrumb ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isReady) return
    settings.breadcrumb ? removeAttr('data-no-breadcrumb') : setAttr('data-no-breadcrumb', 'true')
  }, [settings.breadcrumb, isReady])

  // ── RTL direction ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isReady) return
    document.documentElement.dir = settings.direction
  }, [settings.direction, isReady])

  // ── Accessibility ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isReady) return
    const html = document.documentElement
    settings.increaseContrast ? html.classList.add('a11y-contrast')    : html.classList.remove('a11y-contrast')
    settings.reduceMotion     ? html.classList.add('a11y-motion')      : html.classList.remove('a11y-motion')
    settings.largeText        ? html.classList.add('a11y-large-text')  : html.classList.remove('a11y-large-text')
    settings.focusHighlight   ? html.classList.add('a11y-focus')       : html.classList.remove('a11y-focus')
  }, [settings.increaseContrast, settings.reduceMotion, settings.largeText, settings.focusHighlight, isReady])

  // ── Loader ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isReady) return
    settings.loaderEnabled
      ? setAttr('data-loader', settings.loaderStyle)
      : removeAttr('data-loader')
  }, [settings.loaderEnabled, settings.loaderStyle, isReady])

  return <>{children}</>
}
