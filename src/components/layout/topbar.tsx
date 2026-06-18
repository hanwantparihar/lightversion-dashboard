'use client'

import { useRef, useState, useCallback } from 'react'
import {
  Search,
  Menu,
  Sun,
  Moon,
  Bell,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useIsMobile } from '@/hooks/use-mobile'
import { ProfileMenu } from '@/components/layout/profile-menu'
import { NotificationMenu } from '@/components/layout/notification-menu'
import { CURRENT_USER } from '@/lib/current-user'
import { cn } from '@/lib/utils'

interface TopbarProps {
  openMenu: () => void
  collapsed: boolean
  onToggleCollapse: () => void
}

export function Topbar ({ openMenu, collapsed, onToggleCollapse }: TopbarProps) {
  const { theme, setTheme } = useTheme()
  const isMobile = useIsMobile()

  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  const [notifOpen, setNotifOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(3)
  const notifRef = useRef<HTMLDivElement>(null)

  const handleUnreadChange = useCallback((count: number) => {
    setUnreadCount(count)
  }, [])

  return (
    <header className='sticky top-0 z-30 flex h-[66px] items-center gap-3 border-b bg-background/80 px-5 backdrop-blur-xl'>
      {isMobile && (
        <Button variant='outline' size='icon' onClick={openMenu}>
          <Menu size={19} />
        </Button>
      )}
      <Button
        variant='outline'
        size='icon'
        onClick={onToggleCollapse}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className='hidden lg:grid'
      >
        {collapsed ? (
          <ChevronRight size={14} strokeWidth={2.5} />
        ) : (
          <ChevronLeft size={16} strokeWidth={2.5} />
        )}
      </Button>
      <div className='relative max-w-md flex-1'>
        <Search
          size={16}
          className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'
        />
        <Input placeholder='Search…' className='h-10 rounded-xl pl-9' />
      </div>
      <div className='flex-1' />

      <div className='flex items-center gap-3'>
        {/* Theme toggle */}
        <Button
          variant='outline'
          size='icon'
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
        </Button>

        {/* Notifications */}
        <div className='relative' ref={notifRef}>
          <Button
            variant='outline'
            size='icon'
            onClick={() => {
              setNotifOpen(v => !v)
              setProfileOpen(false)
            }}
            aria-label='Notifications'
            aria-expanded={notifOpen}
            className={cn(notifOpen && 'border-primary text-primary')}
          >
            <Bell size={19} />
          </Button>

          {/* Unread badge */}
          {unreadCount > 0 && (
            <span className='pointer-events-none absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white'>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}

          <NotificationMenu
            open={notifOpen}
            onClose={() => setNotifOpen(false)}
            containerRef={notifRef}
            onUnreadChange={handleUnreadChange}
          />
        </div>

        {/* Profile */}
        <div className='relative' ref={profileRef}>
          <button
            type='button'
            onClick={() => {
              setProfileOpen(v => !v)
              setNotifOpen(false)
            }}
            className='flex items-center gap-2 rounded-full border bg-card py-1 pl-1 pr-2.5 transition-colors hover:bg-muted/60'
            aria-label='Open profile menu'
            aria-expanded={profileOpen}
          >
            <div
              className='grid h-8 w-8 place-items-center rounded-full text-xs font-bold text-white'
              style={{
                background: `linear-gradient(135deg, ${CURRENT_USER.avatarColor}, #1d4ed8)`
              }}
            >
              {CURRENT_USER.initials}
            </div>
            <div className='hidden leading-tight sm:block'>
              <div className='text-left text-[13px] font-bold'>
                {CURRENT_USER.name}
              </div>
              <div className='text-left text-[11px] text-muted-foreground'>
                {CURRENT_USER.role}
              </div>
            </div>
          </button>
          <ProfileMenu
            open={profileOpen}
            onClose={() => setProfileOpen(false)}
            containerRef={profileRef}
          />
        </div>
      </div>
    </header>
  )
}
