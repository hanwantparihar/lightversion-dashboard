'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'

// ─── Types ─────────────────────────────────────────────────────────────────

export type ColorMode       = 'light' | 'dark' | 'system'
export type SidebarStyle    = 'default' | 'compact' | 'mini' | 'collapsed' | 'expanded' | 'hover-expand' | 'icon-only'
export type SidebarColor    = 'default' | 'dark' | 'light' | 'primary' | 'gradient' | 'transparent' | 'glassmorphism'
export type HeaderStyle     = 'solid' | 'glass' | 'transparent' | 'border-bottom' | 'floating' | 'sticky' | 'static'
export type Density         = 'comfortable' | 'compact' | 'spacious'
export type FontFamily      = 'inter' | 'poppins' | 'manrope' | 'outfit' | 'dm-sans' | 'plus-jakarta-sans' | 'nunito' | 'system'
export type LayoutWidth     = 'full' | 'boxed' | 'centered' | 'fluid'
export type ContentWidth    = '1140px' | '1280px' | '1440px' | '1600px' | 'full'
export type Navigation      = 'accordion' | 'collapse' | 'icon-expand' | 'hover-expand' | 'always-expanded'
export type AnimationSpeed  = 'fast' | 'normal' | 'slow'
export type CardStyle       = 'flat' | 'elevated' | 'outlined' | 'glass' | 'soft-shadow'
export type TableStyleOption = 'striped' | 'bordered' | 'compact' | 'hover' | 'rounded'
export type ButtonStyle     = 'rounded' | 'square' | 'pill' | 'soft' | 'outlined'
export type PageTransition  = 'fade' | 'slide' | 'scale' | 'none'
export type LoaderStyle     = 'spinner' | 'pulse' | 'bar' | 'skeleton'
export type ScrollbarStyle  = 'default' | 'thin' | 'rounded' | 'hidden' | 'colored'
export type Direction       = 'ltr' | 'rtl'

export interface ThemeSettings {
  colorMode:        ColorMode
  primaryColor:     string
  sidebarStyle:     SidebarStyle
  sidebarColor:     SidebarColor
  headerStyle:      HeaderStyle
  borderRadius:     number
  density:          Density
  font:             FontFamily
  layoutWidth:      LayoutWidth
  contentWidth:     ContentWidth
  navigation:       Navigation
  animationEnabled: boolean
  animationSpeed:   AnimationSpeed
  cardStyle:        CardStyle
  tableStyles:      TableStyleOption[]
  buttonStyle:      ButtonStyle
  breadcrumb:       boolean
  pageTransition:   PageTransition
  loaderEnabled:    boolean
  loaderStyle:      LoaderStyle
  scrollbar:        ScrollbarStyle
  direction:        Direction
  increaseContrast: boolean
  reduceMotion:     boolean
  largeText:        boolean
  focusHighlight:   boolean
}

export interface SavedTheme {
  id:        string
  name:      string
  settings:  ThemeSettings
  createdAt: string
}

// ─── Defaults ──────────────────────────────────────────────────────────────

export const DEFAULT_SETTINGS: ThemeSettings = {
  colorMode:        'light',
  primaryColor:     '#2563eb',
  sidebarStyle:     'default',
  sidebarColor:     'default',
  headerStyle:      'solid',
  borderRadius:     14,
  density:          'comfortable',
  font:             'plus-jakarta-sans',
  layoutWidth:      'full',
  contentWidth:     '1280px',
  navigation:       'accordion',
  animationEnabled: true,
  animationSpeed:   'normal',
  cardStyle:        'elevated',
  tableStyles:      ['hover'],
  buttonStyle:      'rounded',
  breadcrumb:       true,
  pageTransition:   'fade',
  loaderEnabled:    false,
  loaderStyle:      'spinner',
  scrollbar:        'default',
  direction:        'ltr',
  increaseContrast: false,
  reduceMotion:     false,
  largeText:        false,
  focusHighlight:   false,
}

// ─── Color Presets ─────────────────────────────────────────────────────────

export interface ColorPreset {
  name:   string
  hex:    string
  bg:     string  // Tailwind bg class for the swatch
}

export const COLOR_PRESETS: ColorPreset[] = [
  { name: 'Blue',    hex: '#2563eb', bg: '#2563eb' },
  { name: 'Purple',  hex: '#7c3aed', bg: '#7c3aed' },
  { name: 'Emerald', hex: '#059669', bg: '#059669' },
  { name: 'Green',   hex: '#16a34a', bg: '#16a34a' },
  { name: 'Red',     hex: '#dc2626', bg: '#dc2626' },
  { name: 'Orange',  hex: '#ea580c', bg: '#ea580c' },
  { name: 'Pink',    hex: '#db2777', bg: '#db2777' },
  { name: 'Rose',    hex: '#f43f5e', bg: '#f43f5e' },
  { name: 'Indigo',  hex: '#4f46e5', bg: '#4f46e5' },
  { name: 'Sky',     hex: '#0284c7', bg: '#0284c7' },
  { name: 'Teal',    hex: '#0d9488', bg: '#0d9488' },
  { name: 'Amber',   hex: '#d97706', bg: '#d97706' },
  { name: 'Slate',   hex: '#475569', bg: '#475569' },
  { name: 'Zinc',    hex: '#52525b', bg: '#52525b' },
  { name: 'Neutral', hex: '#525252', bg: '#525252' },
  { name: 'Stone',   hex: '#57534e', bg: '#57534e' },
]

// ─── Font Metadata ─────────────────────────────────────────────────────────

export interface FontMeta {
  label:    string
  value:    FontFamily
  url:      string | null
  family:   string
}

export const FONT_OPTIONS: FontMeta[] = [
  { label: 'Plus Jakarta Sans', value: 'plus-jakarta-sans', url: null,                                                                                                           family: '"Plus Jakarta Sans", system-ui, sans-serif' },
  { label: 'Inter',             value: 'inter',             url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',                          family: '"Inter", system-ui, sans-serif' },
  { label: 'Poppins',          value: 'poppins',           url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap',                        family: '"Poppins", system-ui, sans-serif' },
  { label: 'Manrope',          value: 'manrope',           url: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap',                        family: '"Manrope", system-ui, sans-serif' },
  { label: 'Outfit',           value: 'outfit',            url: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap',                         family: '"Outfit", system-ui, sans-serif' },
  { label: 'DM Sans',          value: 'dm-sans',           url: 'https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap', family: '"DM Sans", system-ui, sans-serif' },
  { label: 'Nunito',           value: 'nunito',            url: 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap',                         family: '"Nunito", system-ui, sans-serif' },
  { label: 'System Font',      value: 'system',            url: null,                                                                                                           family: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
]

// ─── Hex → HSL ─────────────────────────────────────────────────────────────

export function hexToHsl(hex: string): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l   = (max + min) / 2

  if (max === min) return `0 0% ${Math.round(l * 100)}%`

  const d   = max - min
  const s   = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let hue   = 0

  if (max === r)      hue = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) hue = ((b - r) / d + 2) / 6
  else                hue = ((r - g) / d + 4) / 6

  return `${Math.round(hue * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

// ─── Random Theme Generator ────────────────────────────────────────────────

const RANDOM_SIDEBAR_COLORS: SidebarColor[]   = ['default', 'dark', 'primary', 'gradient', 'glassmorphism']
const RANDOM_HEADER_STYLES: HeaderStyle[]     = ['solid', 'glass', 'border-bottom', 'floating']
const RANDOM_CARD_STYLES: CardStyle[]         = ['flat', 'elevated', 'outlined', 'glass', 'soft-shadow']
const RANDOM_BUTTON_STYLES: ButtonStyle[]     = ['rounded', 'square', 'pill', 'soft']
const RANDOM_FONTS: FontFamily[]              = ['inter', 'poppins', 'manrope', 'outfit', 'dm-sans', 'plus-jakarta-sans', 'nunito']
const RANDOM_PAGE_TRANSITIONS: PageTransition[] = ['fade', 'slide', 'scale', 'none']

export function generateRandomTheme(current: ThemeSettings): ThemeSettings {
  const preset  = COLOR_PRESETS[Math.floor(Math.random() * COLOR_PRESETS.length)]
  const radii   = [0, 4, 8, 12, 14, 16, 20, 24]
  return {
    ...current,
    primaryColor:   preset.hex,
    sidebarColor:   RANDOM_SIDEBAR_COLORS[Math.floor(Math.random() * RANDOM_SIDEBAR_COLORS.length)],
    headerStyle:    RANDOM_HEADER_STYLES[Math.floor(Math.random() * RANDOM_HEADER_STYLES.length)],
    cardStyle:      RANDOM_CARD_STYLES[Math.floor(Math.random() * RANDOM_CARD_STYLES.length)],
    buttonStyle:    RANDOM_BUTTON_STYLES[Math.floor(Math.random() * RANDOM_BUTTON_STYLES.length)],
    font:           RANDOM_FONTS[Math.floor(Math.random() * RANDOM_FONTS.length)],
    borderRadius:   radii[Math.floor(Math.random() * radii.length)],
    pageTransition: RANDOM_PAGE_TRANSITIONS[Math.floor(Math.random() * RANDOM_PAGE_TRANSITIONS.length)],
  }
}

// ─── Storage Keys ──────────────────────────────────────────────────────────

const STORAGE_KEY          = 'nexora-tc-settings'
const SAVED_THEMES_KEY     = 'nexora-tc-saved'
const RECENT_THEMES_KEY    = 'nexora-tc-recent'
const MAX_RECENT           = 5

// ─── Context ───────────────────────────────────────────────────────────────

interface ThemeCustomizerContextValue {
  settings:       ThemeSettings
  isReady:        boolean
  savedThemes:    SavedTheme[]
  recentThemes:   ThemeSettings[]
  updateSetting:  <K extends keyof ThemeSettings>(key: K, value: ThemeSettings[K]) => void
  resetSettings:  () => void
  exportSettings: () => string
  importSettings: (json: string) => void
  saveTheme:      (name: string) => void
  loadTheme:      (theme: SavedTheme) => void
  deleteTheme:    (id: string) => void
  randomTheme:    () => void
  copyConfig:     () => Promise<void>
}

const ThemeCustomizerContext = createContext<ThemeCustomizerContextValue | null>(null)

// ─── Provider ──────────────────────────────────────────────────────────────

export function ThemeCustomizerContextProvider({ children }: { children: ReactNode }) {
  const [settings,     setSettings]     = useState<ThemeSettings>(DEFAULT_SETTINGS)
  const [isReady,      setIsReady]      = useState(false)
  const [savedThemes,  setSavedThemes]  = useState<SavedTheme[]>([])
  const [recentThemes, setRecentThemes] = useState<ThemeSettings[]>([])

  // Hydrate from localStorage once on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<ThemeSettings>
        setSettings(s => ({ ...s, ...parsed }))
      }
      const storedSaved = localStorage.getItem(SAVED_THEMES_KEY)
      if (storedSaved) setSavedThemes(JSON.parse(storedSaved))
      const storedRecent = localStorage.getItem(RECENT_THEMES_KEY)
      if (storedRecent) setRecentThemes(JSON.parse(storedRecent))
    } catch { /* ignore corrupt data */ }
    setIsReady(true)
  }, [])

  // Persist settings whenever they change (after hydration)
  useEffect(() => {
    if (!isReady) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings, isReady])

  const pushRecent = useCallback((s: ThemeSettings) => {
    setRecentThemes(prev => {
      const next = [s, ...prev.filter((_, i) => i < MAX_RECENT - 1)]
      localStorage.setItem(RECENT_THEMES_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const updateSetting = useCallback(<K extends keyof ThemeSettings>(key: K, value: ThemeSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }, [])

  const resetSettings = useCallback(() => {
    pushRecent(settings)
    setSettings(DEFAULT_SETTINGS)
  }, [settings, pushRecent])

  const exportSettings = useCallback(() => JSON.stringify(settings, null, 2), [settings])

  const importSettings = useCallback((json: string) => {
    try {
      const parsed = JSON.parse(json) as Partial<ThemeSettings>
      pushRecent(settings)
      setSettings(s => ({ ...s, ...parsed }))
    } catch { throw new Error('Invalid theme JSON') }
  }, [settings, pushRecent])

  const saveTheme = useCallback((name: string) => {
    const theme: SavedTheme = {
      id:        crypto.randomUUID(),
      name,
      settings:  { ...settings },
      createdAt: new Date().toISOString(),
    }
    setSavedThemes(prev => {
      const next = [theme, ...prev]
      localStorage.setItem(SAVED_THEMES_KEY, JSON.stringify(next))
      return next
    })
  }, [settings])

  const loadTheme = useCallback((theme: SavedTheme) => {
    pushRecent(settings)
    setSettings(theme.settings)
  }, [settings, pushRecent])

  const deleteTheme = useCallback((id: string) => {
    setSavedThemes(prev => {
      const next = prev.filter(t => t.id !== id)
      localStorage.setItem(SAVED_THEMES_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const randomTheme = useCallback(() => {
    pushRecent(settings)
    setSettings(prev => generateRandomTheme(prev))
  }, [settings, pushRecent])

  const copyConfig = useCallback(async () => {
    await navigator.clipboard.writeText(exportSettings())
  }, [exportSettings])

  return (
    <ThemeCustomizerContext.Provider value={{
      settings, isReady, savedThemes, recentThemes,
      updateSetting, resetSettings, exportSettings, importSettings,
      saveTheme, loadTheme, deleteTheme, randomTheme, copyConfig,
    }}>
      {children}
    </ThemeCustomizerContext.Provider>
  )
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useThemeCustomizer() {
  const ctx = useContext(ThemeCustomizerContext)
  if (!ctx) throw new Error('useThemeCustomizer must be used inside ThemeCustomizerContextProvider')
  return ctx
}
