'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV } from '@/lib/nav'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  open: boolean
  close: () => void
  collapsed: boolean
  onToggleCollapse: () => void
}

export function Sidebar({
  open,
  close,
  collapsed,
  onToggleCollapse
}: SidebarProps) {
  const pathname = usePathname()
  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    if (path === '/users') {
      return pathname === '/users' || pathname.startsWith('/users/profile/')
    }
    return pathname === path
  }
  const groupActive = (children?: { path: string }[]) =>
    children?.some(c => isActive(c.path))

  const [expanded, setExpanded] = useState<string | null>(null)
  const [flyoutId, setFlyoutId] = useState<string | null>(null)
  const [hovered, setHovered] = useState(false)
  const sidebarRef = useRef<HTMLElement>(null)
  const effectiveCollapsed = collapsed && !open && !hovered

  useEffect(() => {
    for (const item of NAV) {
      if ('children' in item && item.children && groupActive(item.children)) {
        setExpanded(item.id)
        return
      }
    }
  }, [pathname])

  useEffect(() => {
    if (!effectiveCollapsed) setFlyoutId(null)
  }, [effectiveCollapsed])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        flyoutId &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        setFlyoutId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [flyoutId])

  return (
    <>
      {open && (
        <div
          className='fixed inset-0 z-[45] bg-black/50 backdrop-blur-sm lg:hidden'
          onClick={close}
          aria-hidden
        />
      )}
      <aside
        ref={sidebarRef}
        onMouseEnter={() => collapsed && !open && setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          'sticky top-0 z-50 flex h-screen shrink-0 flex-col overflow-hidden bg-gradient-to-b from-[#0c2444] via-[#091a33] to-[#071427] transition-[width] duration-300 ease-in-out',
          effectiveCollapsed ? 'w-[80px]' : 'w-[260px]',
          open
            ? 'fixed translate-x-0'
            : 'fixed -translate-x-full lg:sticky lg:translate-x-0'
        )}
      >
        {/* Header + collapse */}
        <div
          className={cn(
            'flex h-[66px] shrink-0 items-center border-b border-white/[0.08]',
            effectiveCollapsed ? 'justify-between px-2' : 'gap-2 px-3'
          )}
        >
          <div
            className={cn(
              'flex min-w-0 items-center',
              !effectiveCollapsed && 'flex-1 gap-3'
            )}
          >
            <div
              className={cn(
                'grid shrink-0 place-items-center rounded-[11px] bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg shadow-primary/30',
                effectiveCollapsed ? 'h-8 w-8' : 'h-9 w-9'
              )}
            >
              <Sparkles size={effectiveCollapsed ? 17 : 20} />
            </div>
            {!effectiveCollapsed && (
              <div className='min-w-0 flex-1 truncate text-lg font-extrabold tracking-tight text-white'>
                Nexora<span className='text-primary'> AI</span>
              </div>
            )}
          </div>
        </div>

        {/* Nav — no visible scrollbar */}
        <nav
          className={cn(
            'flex-1 overflow-x-hidden overflow-y-auto px-2 pb-2 pt-1.5 scrollbar-none',
            effectiveCollapsed && 'px-1.5'
          )}
        >
          {NAV.map((item, i) => {
            if (item.sec) {
              if (effectiveCollapsed) return null
              return (
                <div
                  key={i}
                  className='px-3 pb-1.5 pt-4 text-[10.5px] font-bold uppercase tracking-widest text-[#6f82a0]'
                >
                  {item.sec}
                </div>
              )
            }

            if ('children' in item && item.children) {
              const isOpen = expanded === item.id
              const childActive = groupActive(item.children)
              const GroupIcon = item.icon
              const showFlyout = effectiveCollapsed && flyoutId === item.id

              if (effectiveCollapsed) {
                return (
                  <div key={item.id} className='relative mb-0.5'>
                    <button
                      type='button'
                      title={item.label}
                      className={cn(
                        'relative flex w-full items-center justify-center rounded-[10px] p-2.5 text-[#aebfd6] transition-colors hover:bg-white/5 hover:text-white',
                        (childActive || showFlyout) &&
                        'bg-gradient-to-r from-primary/35 to-primary/5 text-white'
                      )}
                      onClick={() =>
                        setFlyoutId(prev => (prev === item.id ? null : item.id))
                      }
                    >
                      <GroupIcon size={19} />
                    </button>
                    {showFlyout && (
                      <div className='absolute left-full top-0 z-50 ml-2 min-w-[180px] rounded-xl border border-white/10 bg-[#0c2444] py-2 shadow-xl'>
                        <div className='px-3 pb-2 text-xs font-bold text-[#6f82a0]'>
                          {item.label}
                        </div>
                        {item.children.map(child => (
                          <Link
                            key={child.id}
                            href={child.path}
                            className={cn(
                              'block px-3 py-2 text-[13px] font-semibold text-[#8ba0bf] transition-colors hover:bg-white/5 hover:text-white',
                              isActive(child.path) && 'text-white'
                            )}
                            onClick={() => {
                              setFlyoutId(null)
                              close()
                            }}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <div key={item.id}>
                  <button
                    type='button'
                    className={cn(
                      'relative mb-0.5 flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-sm font-semibold text-[#aebfd6] transition-colors hover:bg-white/5 hover:text-white',
                      childActive &&
                      'bg-gradient-to-r from-primary/35 to-primary/5 text-white'
                    )}
                    onClick={() =>
                      setExpanded(prev => (prev === item.id ? null : item.id))
                    }
                  >
                    <span
                      className={cn(
                        'absolute -left-3.5 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-primary opacity-0 shadow-[0_0_10px_1px_hsl(var(--primary)/0.5)] transition-opacity',
                        childActive && 'opacity-100'
                      )}
                    />
                    <GroupIcon size={19} />
                    <span className='truncate'>{item.label}</span>
                    <ChevronDown
                      size={15}
                      className={cn(
                        'ml-auto shrink-0 opacity-50 transition-transform',
                        isOpen && 'rotate-180'
                      )}
                    />
                  </button>
                  <div
                    className='overflow-hidden transition-[max-height] duration-300 ease-in-out'
                    style={{
                      maxHeight: isOpen
                        ? `${item.children.length * 40}px`
                        : '0px'
                    }}
                  >
                    {item.children.map(child => (
                      <Link
                        key={child.id}
                        href={child.path}
                        className={cn(
                          'mb-0.5 flex items-center gap-2 rounded-lg py-2 pl-11 pr-3 text-[13px] font-semibold text-[#8ba0bf] transition-colors hover:text-[#d1dced]',
                          isActive(child.path) && 'text-white'
                        )}
                        onClick={close}
                      >
                        <span
                          className={cn(
                            'h-1.5 w-1.5 shrink-0 rounded-full border-2 border-[#6f82a0]',
                            isActive(child.path) &&
                            'border-primary bg-primary shadow-[0_0_6px_hsl(var(--primary)/0.5)]'
                          )}
                        />
                        <span className='truncate'>{child.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            }

            if ('path' in item && item.path) {
              const NavIcon = item.icon
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  title={effectiveCollapsed ? item.label : undefined}
                  className={cn(
                    'relative mb-0.5 flex w-full items-center rounded-[10px] text-sm font-semibold text-[#aebfd6] no-underline transition-colors hover:bg-white/5 hover:text-white',
                    effectiveCollapsed
                      ? 'justify-center p-2.5'
                      : 'gap-2.5 px-3 py-2.5',
                    isActive(item.path) &&
                    'bg-gradient-to-r from-primary/35 to-primary/5 text-white'
                  )}
                  onClick={close}
                >
                  <span
                    className={cn(
                      'absolute -left-3.5 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-primary opacity-0 shadow-[0_0_10px_1px_hsl(var(--primary)/0.5)] transition-opacity',
                      isActive(item.path) && 'opacity-100'
                    )}
                  />
                  <NavIcon size={19} className='shrink-0' />
                  {!effectiveCollapsed && (
                    <>
                      <span className='truncate'>{item.label}</span>
                      {item.badge && (
                        <span className='ml-auto shrink-0 rounded-full bg-primary px-2 py-0.5 text-[10.5px] font-bold text-white'>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {effectiveCollapsed && item.badge && (
                    <span className='absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary' />
                  )}
                </Link>
              )
            }

            return null
          })}
        </nav>

        {/* Footer */}
        {/* {!effectiveCollapsed && (
          <div className="shrink-0 border-t border-white/5 p-3.5">
            <div className="rounded-[14px] border border-primary/20 bg-gradient-to-br from-primary/20 to-primary/5 p-3.5">
              <h4 className="text-[13.5px] font-bold text-white">
                Upgrade to Pro
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-[#6f82a0]">
                Advanced reports & priority support.
              </p>
              <Button className="mt-3 h-8 w-full rounded-lg bg-white text-xs font-bold text-[#0c2444] hover:bg-white/90">
                Upgrade Now
              </Button>
            </div>
          </div>
        )} */}
      </aside>
    </>
  )
}
