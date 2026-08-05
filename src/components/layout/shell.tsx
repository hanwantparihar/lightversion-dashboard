'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { Sidebar } from './sidebar'
import { Topbar } from './topbar'
import { getBreadcrumbGroup, getGroupPath, getPageTitle } from '@/lib/nav'
import { useSidebar } from '@/hooks/use-sidebar'
import Link from 'next/link'

interface ShellProps {
  children: ReactNode
}

export function Shell({ children }: ShellProps) {
  const { collapsed, mobileOpen, toggleCollapsed, openMobile, closeMobile } =
    useSidebar()
  const pathname = usePathname()
  const title = getPageTitle(pathname)
  const group = getBreadcrumbGroup(pathname)
  const groupPath = getGroupPath(pathname)

  return (
    <div className='flex min-h-screen w-full bg-background text-foreground'>
      <Sidebar
        open={mobileOpen}
        close={closeMobile}
        collapsed={collapsed}
        onToggleCollapse={toggleCollapsed}
      />
      <div className='flex min-w-0 flex-1 flex-col'>
        <Topbar
          openMenu={openMobile}
          collapsed={collapsed}
          onToggleCollapse={toggleCollapsed}
        />
        <main className='flex-1 animate-fade-in p-5' key={pathname}>
          <div className='mb-5 flex flex-wrap items-end justify-between gap-3.5'>
            <div>
              <nav className='mb-1 flex items-center gap-2 text-xs font-semibold text-muted-foreground'>
                <Link href='/' className='transition-colors hover:text-foreground'>
                  Home
                </Link>
                {group && (
                  <>
                    <ChevronRight size={13} className='shrink-0' />
                    {groupPath ? (
                      <Link href={groupPath} className='transition-colors hover:text-foreground'>
                        {group}
                      </Link>
                    ) : (
                      <span>{group}</span>
                    )}
                  </>
                )}
                <ChevronRight size={13} className='shrink-0' />
                <span className='font-bold text-primary'>{title}</span>
              </nav>
              <h1 className='text-2xl font-extrabold tracking-tight'>{title}</h1>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}
