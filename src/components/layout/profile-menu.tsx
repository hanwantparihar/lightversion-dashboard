'use client'

import { useEffect, type RefObject } from 'react'
import Link from 'next/link'
import { Settings, LogOut } from 'lucide-react'
import { CURRENT_USER } from '@/lib/current-user'
import { useAuth } from '@/contexts/auth-context'

type ProfileMenuProps = {
  open: boolean
  onClose: () => void
  containerRef: RefObject<HTMLElement | null>
}

export function ProfileMenu({ open, onClose, containerRef }: ProfileMenuProps) {
  const { signOut } = useAuth()
  useEffect(() => {
    if (!open) return

    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onClose()
      }
    }

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open, onClose, containerRef])

  if (!open) return null

  return (
    <div className='absolute right-0 top-[calc(100%+8px)] z-50 w-52 overflow-hidden rounded-xl border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95'>
      <div className='border-b px-3 py-2.5'>
        <div className='truncate text-sm font-bold'>{CURRENT_USER.name}</div>
        <div className='truncate text-xs text-muted-foreground'>
          {CURRENT_USER.email}
        </div>
      </div>
      <div className='p-1.5'>
        <Link
          href='/system/settings'
          onClick={onClose}
          className='flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-semibold transition-colors hover:bg-muted'
        >
          <Settings size={15} />
          Settings
        </Link>
        <button
          type='button'
          onClick={() => { onClose(); signOut(); }}
          className='flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10'
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </div>
  )
}
