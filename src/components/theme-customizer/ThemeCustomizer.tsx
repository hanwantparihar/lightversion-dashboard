'use client'

import { useState, useEffect, useCallback, type ReactNode, type ChangeEvent } from 'react'
import { createPortal } from 'react-dom'
import {
  Settings2,
  X,
  Search,
  Sun,
  Moon,
  Monitor,
  ChevronDown,
  Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  useThemeCustomizer,
  COLOR_PRESETS,
  type ColorMode,
  type SidebarStyle,
  type SidebarColor,
  type HeaderStyle,
  type LayoutWidth,
  type ContentWidth,
  type Direction,
} from '@/contexts/theme-customizer-context'

// ─── Section Block ──────────────────────────────────────────────────────────

function SectionBlock({
  id,
  title,
  icon,
  open,
  onToggle,
  children,
}: {
  id: string
  title: string
  icon: ReactNode
  open: boolean
  onToggle: (id: string) => void
  children: ReactNode
}) {
  return (
    <div className='border-b border-border/60 last:border-0'>
      <button
        type='button'
        onClick={() => onToggle(id)}
        className='flex w-full items-center gap-2.5 px-5 py-3.5 text-left transition-colors hover:bg-muted/40'
      >
        <span className='grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary'>
          {icon}
        </span>
        <span className='flex-1 text-[13px] font-bold text-foreground'>{title}</span>
        <ChevronDown
          size={15}
          className={cn('shrink-0 text-muted-foreground transition-transform duration-200', open && 'rotate-180')}
        />
      </button>
      <div
        className='overflow-hidden transition-all duration-300'
        style={{ maxHeight: open ? '1000px' : '0px', opacity: open ? 1 : 0 }}
      >
        <div className='px-5 pb-4 pt-1'>{children}</div>
      </div>
    </div>
  )
}

// ─── Option Grid (radio-style cards) ────────────────────────────────────────

function OptionGrid<T extends string>({
  options,
  value,
  onChange,
  cols = 2,
}: {
  options: { value: T; label: string; desc?: string }[]
  value: T
  onChange: (v: T) => void
  cols?: 2 | 3 | 4
}) {
  const grid = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' }[cols]
  return (
    <div className={cn('grid gap-2', grid)}>
      {options.map(opt => (
        <button
          key={opt.value}
          type='button'
          onClick={() => onChange(opt.value)}
          className={cn(
            'group flex flex-col items-center justify-center rounded-xl border-2 px-2 py-2.5 text-center text-[11.5px] font-semibold transition-all duration-150',
            value === opt.value
              ? 'border-primary bg-primary/5 text-primary shadow-sm shadow-primary/10'
              : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground',
          )}
        >
          <span className='leading-tight'>{opt.label}</span>
          {opt.desc && <span className='mt-0.5 text-[10px] font-normal opacity-60'>{opt.desc}</span>}
        </button>
      ))}
    </div>
  )
}

// ─── Toggle Row ────────────────────────────────────────────────────────────

function ToggleRow({
  label,
  checked,
  onChange,
  desc,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
  desc?: string
}) {
  return (
    <div className='flex items-center justify-between gap-3 py-2'>
      <div>
        <p className='text-[13px] font-semibold text-foreground'>{label}</p>
        {desc && <p className='text-[11px] text-muted-foreground'>{desc}</p>}
      </div>
      <button
        type='button'
        role='switch'
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200',
          checked ? 'bg-primary' : 'bg-border/60',
        )}
      >
        <span
          className={cn(
            'absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200',
            checked ? 'translate-x-5' : 'translate-x-0',
          )}
        />
      </button>
    </div>
  )
}

// ─── Label ─────────────────────────────────────────────────────────────────

function Label({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('mb-2 text-[11.5px] font-bold uppercase tracking-wider text-muted-foreground', className)}>
      {children}
    </p>
  )
}

// ─── Divider ───────────────────────────────────────────────────────────────

function Divider() {
  return <div className='my-3 h-px bg-border/50' />
}

// ─── Section 1 + 2: Appearance + Primary Color ─────────────────────────────

function AppearanceSection() {
  const { settings, updateSetting } = useThemeCustomizer()
  const [customColor, setCustomColor] = useState(settings.primaryColor)

  const MODES: { value: ColorMode; label: string; icon: ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <Sun size={15} /> },
    { value: 'dark', label: 'Dark', icon: <Moon size={15} /> },
    { value: 'system', label: 'System', icon: <Monitor size={15} /> },
  ]

  return (
    <div className='space-y-4'>
      <div>
        <Label>Theme Mode</Label>
        <div className='grid grid-cols-3 gap-2'>
          {MODES.map(m => (
            <button
              key={m.value}
              type='button'
              onClick={() => updateSetting('colorMode', m.value)}
              className={cn(
                'flex flex-col items-center gap-1.5 rounded-xl border-2 py-2.5 text-[12px] font-semibold transition-all',
                settings.colorMode === m.value
                  ? 'border-primary bg-primary/5 text-primary shadow-sm'
                  : 'border-border bg-card text-muted-foreground hover:border-primary/40',
              )}
            >
              {m.icon}
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <Divider />

      <div>
        <Label>Primary Color</Label>
        <div className='grid grid-cols-8 gap-1.5'>
          {COLOR_PRESETS.map(p => (
            <button
              key={p.hex}
              type='button'
              title={p.name}
              onClick={() => updateSetting('primaryColor', p.hex)}
              className='group relative h-7 w-7 rounded-lg border-2 border-transparent transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1'
              style={{ backgroundColor: p.bg }}
            >
              {settings.primaryColor === p.hex && (
                <Check size={12} className='absolute inset-0 m-auto text-white drop-shadow' />
              )}
            </button>
          ))}
        </div>

        <div className='mt-3'>
          <Label className='mb-1.5'>Custom Color</Label>
          <div className='flex items-center gap-2'>
            <div className='relative'>
              <div
                className='h-9 w-9 cursor-pointer rounded-lg border-2 border-border'
                style={{ backgroundColor: customColor }}
              >
                <input
                  type='color'
                  value={customColor}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setCustomColor(e.target.value)
                    updateSetting('primaryColor', e.target.value)
                  }}
                  className='absolute inset-0 h-full w-full cursor-pointer opacity-0'
                />
              </div>
            </div>
            <input
              type='text'
              value={customColor}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setCustomColor(e.target.value)
                if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) {
                  updateSetting('primaryColor', e.target.value)
                }
              }}
              className='h-9 flex-1 rounded-lg border border-border bg-card px-3 text-[13px] font-mono font-semibold text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'
              placeholder='#2563eb'
              maxLength={7}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Section 3 + 4: Sidebar ─────────────────────────────────────────────────

function SidebarSection() {
  const { settings, updateSetting } = useThemeCustomizer()

  const STYLES: { value: SidebarStyle; label: string }[] = [
    { value: 'default', label: 'Default' },
    { value: 'compact', label: 'Compact' },
    { value: 'mini', label: 'Mini' },
    { value: 'collapsed', label: 'Collapsed' },
    { value: 'expanded', label: 'Expanded' },
    { value: 'hover-expand', label: 'Hover' },
    { value: 'icon-only', label: 'Icon Only' },
  ]

  const COLORS: { value: SidebarColor; label: string; preview: string }[] = [
    { value: 'default', label: 'Default', preview: 'bg-[#0c2444]' },
    { value: 'dark', label: 'Dark', preview: 'bg-slate-900' },
    { value: 'light', label: 'Light', preview: 'bg-white border border-border' },
    { value: 'primary', label: 'Primary', preview: 'bg-primary' },
    { value: 'gradient', label: 'Gradient', preview: 'bg-gradient-to-b from-violet-600 to-blue-600' },
    { value: 'transparent', label: 'Transparent', preview: 'bg-transparent border border-dashed border-border' },
    { value: 'glassmorphism', label: 'Glass', preview: 'bg-white/10 backdrop-blur border border-white/20' },
  ]

  return (
    <div className='space-y-4'>
      <div>
        <Label>Sidebar Style</Label>
        <div className='grid grid-cols-2 gap-2'>
          {STYLES.map(s => (
            <button
              key={s.value}
              type='button'
              onClick={() => updateSetting('sidebarStyle', s.value)}
              className={cn(
                'rounded-xl border-2 px-3 py-2 text-center text-[12px] font-semibold transition-all',
                settings.sidebarStyle === s.value
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border bg-card text-muted-foreground hover:border-primary/40',
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <Divider />

      <div>
        <Label>Sidebar Color</Label>
        <div className='grid grid-cols-2 gap-2'>
          {COLORS.map(c => (
            <button
              key={c.value}
              type='button'
              onClick={() => updateSetting('sidebarColor', c.value)}
              className={cn(
                'flex items-center gap-2.5 rounded-xl border-2 px-3 py-2 text-[12px] font-semibold transition-all',
                settings.sidebarColor === c.value
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border bg-card text-muted-foreground hover:border-primary/40',
              )}
            >
              <div className={cn('h-5 w-5 shrink-0 rounded-md', c.preview)} />
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Section 5: Header ───────────────────────────────────────────────────────

function HeaderSection() {
  const { settings, updateSetting } = useThemeCustomizer()

  const STYLES: { value: HeaderStyle; label: string }[] = [
    { value: 'solid', label: 'Solid' },
    { value: 'glass', label: 'Glass' },
    { value: 'transparent', label: 'Transparent' },
    { value: 'border-bottom', label: 'Border' },
    { value: 'floating', label: 'Floating' },
    { value: 'sticky', label: 'Sticky' },
    { value: 'static', label: 'Static' },
  ]

  return (
    <OptionGrid
      options={STYLES}
      value={settings.headerStyle}
      onChange={v => updateSetting('headerStyle', v)}
      cols={2}
    />
  )
}

// ─── Section 9–11: Layout & Navigation ──────────────────────────────────────

function LayoutSection() {
  const { settings, updateSetting } = useThemeCustomizer()

  const LAYOUT_WIDTHS: { value: LayoutWidth; label: string }[] = [
    { value: 'full', label: 'Full Width' },
    { value: 'boxed', label: 'Boxed' },
    { value: 'centered', label: 'Centered' },
    { value: 'fluid', label: 'Fluid' },
  ]

  const CONTENT_WIDTHS: { value: ContentWidth; label: string }[] = [
    { value: '1140px', label: '1140px' },
    { value: '1280px', label: '1280px' },
    { value: '1440px', label: '1440px' },
    { value: '1600px', label: '1600px' },
    { value: 'full', label: 'Full' },
  ]

  return (
    <div className='space-y-4'>
      <div>
        <Label>Layout Width</Label>
        <OptionGrid options={LAYOUT_WIDTHS} value={settings.layoutWidth} onChange={v => updateSetting('layoutWidth', v)} cols={2} />
      </div>

      <Divider />

      <div>
        <Label>Content Width</Label>
        <OptionGrid options={CONTENT_WIDTHS} value={settings.contentWidth} onChange={v => updateSetting('contentWidth', v)} cols={3} />
      </div>
    </div>
  )
}

// ─── Section 21–22: Accessibility & RTL ──────────────────────────────────────

function AccessibilitySection() {
  const { settings, updateSetting } = useThemeCustomizer()

  const DIRECTIONS: { value: Direction; label: string }[] = [
    { value: 'ltr', label: 'LTR — Left to Right' },
    { value: 'rtl', label: 'RTL — Right to Left' },
  ]

  return (
    <div className='space-y-1'>
      <Label className='mb-3'>Text Direction</Label>
      <div className='mb-4 grid grid-cols-1 gap-2'>
        {DIRECTIONS.map(d => (
          <button
            key={d.value}
            type='button'
            onClick={() => updateSetting('direction', d.value)}
            className={cn(
              'rounded-xl border-2 px-3 py-2.5 text-left text-[13px] font-semibold transition-all',
              settings.direction === d.value
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border bg-card text-muted-foreground hover:border-primary/40',
            )}
          >
            {d.label}
          </button>
        ))}
      </div>

      <Divider />
      <Label className='mt-3 mb-2'>Accessibility</Label>

      <ToggleRow
        label='Increase Contrast'
        desc='Boost foreground / background contrast'
        checked={settings.increaseContrast}
        onChange={v => updateSetting('increaseContrast', v)}
      />
      <ToggleRow
        label='Reduce Motion'
        desc='Disable animations for motion sensitivity'
        checked={settings.reduceMotion}
        onChange={v => updateSetting('reduceMotion', v)}
      />
      <ToggleRow
        label='Large Text'
        desc='Increase base font size'
        checked={settings.largeText}
        onChange={v => updateSetting('largeText', v)}
      />
      <ToggleRow
        label='Focus Highlight'
        desc='Show prominent focus rings'
        checked={settings.focusHighlight}
        onChange={v => updateSetting('focusHighlight', v)}
      />
    </div>
  )
}

// ─── Section Registry ────────────────────────────────────────────────────────

interface Section {
  id: string
  title: string
  icon: ReactNode
  keywords: string[]
}

const SECTIONS: Section[] = [
  { id: 'appearance', title: 'Appearance & Color', icon: <Sun size={14} />, keywords: ['light', 'dark', 'mode', 'theme', 'primary', 'color', 'brand', 'hue'] },
  { id: 'sidebar', title: 'Sidebar', icon: <Settings2 size={14} />, keywords: ['sidebar', 'nav', 'navigation', 'menu', 'panel'] },
  { id: 'header', title: 'Header Style', icon: <Monitor size={14} />, keywords: ['header', 'topbar', 'navbar', 'glass', 'solid', 'floating'] },
  { id: 'layout', title: 'Layout & Navigation', icon: <Settings2 size={14} />, keywords: ['layout', 'width', 'content', 'boxed', 'navigation', 'nav'] },
  { id: 'a11y', title: 'Accessibility & RTL', icon: <Settings2 size={14} />, keywords: ['rtl', 'ltr', 'direction', 'contrast', 'motion', 'text', 'focus', 'accessibility', 'a11y'] },
]

// ─── Main ThemeCustomizer Component ─────────────────────────────────────────

export function ThemeCustomizer() {
  const { isReady } = useThemeCustomizer()

  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['appearance']))

  useEffect(() => { setMounted(true) }, [])

  const toggleSection = useCallback((id: string) => {
    setOpenSections(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const filteredSections = search.trim()
    ? SECTIONS.filter(s =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.keywords.some(k => k.includes(search.toLowerCase()))
    )
    : SECTIONS

  if (!mounted || !isReady) return null

  const sectionContent = (id: string) => {
    switch (id) {
      case 'appearance': return <AppearanceSection />
      case 'sidebar': return <SidebarSection />
      case 'header': return <HeaderSection />
      case 'layout': return <LayoutSection />
      case 'a11y': return <AccessibilitySection />
      default: return null
    }
  }

  return createPortal(
    <>
      {/* Floating trigger button */}
      <button
        type='button'
        onClick={() => setIsOpen(true)}
        aria-label='Open theme customizer'
        className='fixed bottom-6 right-6 z-[60] flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xl shadow-primary/40 transition-all duration-200 hover:scale-110 hover:shadow-primary/60 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
      // style={{ animation: 'tc-pulse 3s ease infinite' }}
      >
        <Settings2 size={20} />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className='fixed inset-0 z-[69] bg-black/30 backdrop-blur-[2px] transition-opacity'
          onClick={() => setIsOpen(false)}
          aria-hidden
        />
      )}

      {/* Panel */}
      <div
        role='dialog'
        aria-label='Theme Customizer'
        aria-modal='true'
        className={cn(
          'fixed inset-y-0 right-0 z-[70] flex w-[380px] max-w-full flex-col bg-background shadow-2xl transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Header */}
        <div className='flex shrink-0 items-center gap-3 border-b border-border bg-background px-5 py-4'>
          <div className='grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary'>
            <Settings2 size={17} />
          </div>
          <div className='min-w-0 flex-1'>
            <h2 className='text-[14px] font-extrabold tracking-tight text-foreground'>Theme Customizer</h2>
            <p className='text-[11px] text-muted-foreground'>Customize to your taste</p>
          </div>
          <button
            type='button'
            onClick={() => setIsOpen(false)}
            aria-label='Close'
            className='grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
          >
            <X size={16} />
          </button>
        </div>

        {/* Search */}
        <div className='shrink-0 border-b border-border px-4 py-3'>
          <div className='relative'>
            <Search size={14} className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground' />
            <input
              type='text'
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder='Search settings…'
              className='h-9 w-full rounded-lg border border-border bg-muted pl-8 pr-3 text-[13px] font-semibold text-foreground outline-none transition-colors focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20'
            />
          </div>
        </div>

        {/* Sections */}
        <div className='flex-1 overflow-y-auto scrollbar-none'>
          {filteredSections.length === 0 ? (
            <div className='flex flex-col items-center gap-2 py-16 text-center'>
              <Search size={32} className='text-muted-foreground/40' />
              <p className='text-[13px] font-semibold text-muted-foreground'>No settings found</p>
              <button
                onClick={() => setSearch('')}
                className='text-[12px] font-bold text-primary hover:underline'
              >
                Clear search
              </button>
            </div>
          ) : (
            filteredSections.map(s => (
              <SectionBlock
                key={s.id}
                id={s.id}
                title={s.title}
                icon={s.icon}
                open={openSections.has(s.id)}
                onToggle={toggleSection}
              >
                {sectionContent(s.id)}
              </SectionBlock>
            ))
          )}
        </div>

        {/* Footer */}
        <div className='shrink-0 border-t border-border bg-muted/40 px-5 py-3'>
          <p className='text-center text-[11px] text-muted-foreground'>
            Changes apply instantly and save automatically
          </p>
        </div>
      </div>
    </>,
    document.body,
  )
}
