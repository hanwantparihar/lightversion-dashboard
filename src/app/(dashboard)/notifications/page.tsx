'use client'
import { useState } from 'react'
import {
  Bell,
  ShoppingBag,
  MessageSquare,
  UserPlus,
  CircleCheck,
  TriangleAlert,
  CircleAlert,
  Star,
  FileText,
  Mail,
  Trash2,
  Clock
} from 'lucide-react'
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  Button
} from '@/components/ui'

const initN = [
  {
    id: 1,
    type: 'order',
    icon: ShoppingBag,
    color: '#10b981',
    title: 'New Order Received',
    description: 'Order #PX-7821 — $1,249.00',
    time: '2 minutes ago',
    date: 'today',
    unread: true,
    badge: 'New'
  },
  {
    id: 2,
    type: 'message',
    icon: MessageSquare,
    color: '#2563eb',
    title: 'New message from Olivia',
    description: 'Hey, do you have a minute to discuss…',
    time: '14 minutes ago',
    date: 'today',
    unread: true,
    badge: 'Message'
  },
  {
    id: 3,
    type: 'user',
    icon: UserPlus,
    color: '#7c3aed',
    title: 'New customer registered',
    description: 'Laura Mitchell joined as Premium member',
    time: '1 hour ago',
    date: 'today',
    unread: true,
    badge: 'User'
  },
  {
    id: 4,
    type: 'success',
    icon: CircleCheck,
    color: '#10b981',
    title: 'Payment successful',
    description: 'Stripe payout of $12,840 processed',
    time: '3 hours ago',
    date: 'today',
    unread: false,
    badge: 'Payment'
  },
  {
    id: 5,
    type: 'warning',
    icon: TriangleAlert,
    color: '#f59e0b',
    title: 'Low stock alert',
    description: 'Aurora Headset has only 8 units left',
    time: '5 hours ago',
    date: 'today',
    unread: false,
    badge: 'Inventory'
  },
  {
    id: 6,
    type: 'review',
    icon: Star,
    color: '#f59e0b',
    title: 'New 5-star review',
    description: 'Aurora Headset received excellent feedback',
    time: 'Yesterday',
    date: 'yesterday',
    unread: false,
    badge: 'Review'
  },
  {
    id: 7,
    type: 'report',
    icon: FileText,
    color: '#06b6d4',
    title: 'Weekly report ready',
    description: 'Your sales analytics report is available',
    time: 'Yesterday',
    date: 'yesterday',
    unread: false,
    badge: 'Report'
  },
  {
    id: 8,
    type: 'error',
    icon: CircleAlert,
    color: '#ef4444',
    title: 'Payment failed',
    description: 'Customer card declined',
    time: 'Yesterday',
    date: 'yesterday',
    unread: false,
    badge: 'Error'
  },
  {
    id: 9,
    type: 'email',
    icon: Mail,
    color: '#2563eb',
    title: 'Newsletter sent',
    description: 'Sent to 14,209 subscribers',
    time: '2 days ago',
    date: 'week',
    unread: false,
    badge: 'Email'
  },
  {
    id: 10,
    type: 'order',
    icon: ShoppingBag,
    color: '#10b981',
    title: 'Bulk order received',
    description: 'Enterprise order — 50 units of Vertex Keyboard',
    time: '3 days ago',
    date: 'week',
    unread: false,
    badge: 'Order'
  },
  {
    id: 11,
    type: 'user',
    icon: UserPlus,
    color: '#7c3aed',
    title: '10 new signups today',
    description: 'Daily signup goal exceeded',
    time: '4 days ago',
    date: 'week',
    unread: false,
    badge: 'User'
  },
  {
    id: 12,
    type: 'warning',
    icon: TriangleAlert,
    color: '#f59e0b',
    title: 'Server load high',
    description: 'CPU usage exceeded 80%',
    time: '5 days ago',
    date: 'week',
    unread: false,
    badge: 'System'
  },
  {
    id: 13,
    type: 'success',
    icon: CircleCheck,
    color: '#10b981',
    title: 'Milestone reached!',
    description: '$100K monthly revenue achieved',
    time: '1 week ago',
    date: 'earlier',
    unread: false,
    badge: 'Milestone'
  },
  {
    id: 14,
    type: 'review',
    icon: Star,
    color: '#f59e0b',
    title: 'Product trending',
    description: 'Lumen Desk Lamp is now top-rated',
    time: '2 weeks ago',
    date: 'earlier',
    unread: false,
    badge: 'Trending'
  },
  {
    id: 15,
    type: 'report',
    icon: FileText,
    color: '#06b6d4',
    title: 'Monthly report archived',
    description: 'November report stored in archives',
    time: '3 weeks ago',
    date: 'earlier',
    unread: false,
    badge: 'Archive'
  }
]

export default function Notifications () {
  const [n, setN] = useState(initN)
  const [f, setF] = useState('all')

  const types = [
    'all',
    'order',
    'message',
    'user',
    'success',
    'warning',
    'error',
    'review',
    'report',
    'email'
  ]
  const fil = f === 'all' ? n : n.filter(x => x.type === f)
  const ur = n.filter(x => x.unread).length

  const grp = (d: string) => fil.filter(x => x.date === d)
  const groups = [
    { key: 'today', label: 'Today' },
    { key: 'yesterday', label: 'Yesterday' },
    { key: 'week', label: 'This Week' },
    { key: 'earlier', label: 'Earlier' }
  ]

  const mr = (id: number) =>
    setN(p => p.map(x => (x.id === id ? { ...x, unread: false } : x)))
  const del = (id: number) => setN(p => p.filter(x => x.id !== id))
  const mra = () => setN(p => p.map(x => ({ ...x, unread: false })))

  return (
    <div className='sy'>
      <Card>
        <CardHeader
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 14
          }}
        >
          <div>
            <CardTitle className='fc g2'>
              <Bell size={17} />
              Notifications
            </CardTitle>
            <CardDescription>
              {ur > 0 ? (
                <span>
                  <span style={{ color: 'var(--pr)', fontWeight: 700 }}>
                    {ur} unread
                  </span>{' '}
                  of {n.length} total
                </span>
              ) : (
                <span>All caught up — {n.length} total notifications</span>
              )}
            </CardDescription>
          </div>
          <div className='fc g2'>
            <Button variant='outline' size='sm' onClick={mra}>
              <CircleCheck />
              Mark all read
            </Button>
            <Button variant='destructive' size='sm' onClick={() => setN([])}>
              <Trash2 />
              Clear all
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className='mb-2 flex flex-wrap gap-2'>
            {types.map(t => (
              <Button
                key={t}
                type="button"
                variant={f === t ? 'default' : 'outline'}
                size="sm"
                className="rounded-full"
                onClick={() => setF(t)}
              >
                {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
              </Button>
            ))}
          </div>

          {groups.map(g => {
            const items = grp(g.key as string)
            if (items.length === 0) return null
            return (
              <div key={g.key}>
                <div className='nf-g'>{g.label}</div>
                {items.map(it => (
                  <div
                    key={it.id}
                    className={`nf-i ${it.unread ? 'ur' : ''}`}
                    style={{ borderLeftColor: it.color }}
                  >
                    <div
                      className='nf-ic'
                      style={{ background: `${it.color}1a`, color: it.color }}
                    >
                      <it.icon size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className='nf-tt'>
                        {it.title}
                        <span
                          className='nf-bg'
                          style={{
                            background: `${it.color}1a`,
                            color: it.color
                          }}
                        >
                          {it.badge}
                        </span>
                      </div>
                      <div className='nf-ds'>{it.description}</div>
                    </div>
                    {it.unread && <div className='nf-dt' />}
                    <div
                      className='nf-tm'
                      onClick={() => mr(it.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <Clock size={12} />
                      {it.time}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:bg-destructive/5 hover:text-destructive"
                      onClick={() => del(it.id)}
                      aria-label="Delete notification"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ))}
              </div>
            )
          })}

          {fil.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: 40,
                color: 'var(--mt-fg)'
              }}
            >
              <Bell
                size={36}
                style={{
                  margin: '0 auto 12px',
                  display: 'block',
                  opacity: 0.4
                }}
              />
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>
                No notifications
              </h3>
              <p style={{ fontSize: 13, marginTop: 4 }}>
                You're all caught up!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
