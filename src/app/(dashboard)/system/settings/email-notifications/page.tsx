'use client'

import { useState } from 'react'
import {
    Mail,
    Bell,
    Zap,
    Shield,
    CreditCard,
    Users,
    MessageSquare,
    BarChart3,
    CircleCheck,
    Send,
    Info
} from 'lucide-react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Button,
    Switch,
    Input,
    Label,
    DropdownSelect
} from '@/components/ui'
import { PageStack } from '@/components'

type NotifGroup = {
    id: string
    label: string
    description: string
    icon: React.ReactNode
    toggles: { id: string; label: string; desc: string; defaultOn: boolean }[]
}

const NOTIFICATION_GROUPS: NotifGroup[] = [
    {
        id: 'security',
        label: 'Security & account',
        description: 'Critical alerts about your account safety.',
        icon: <Shield size={16} />,
        toggles: [
            { id: 'login', label: 'New login detected', desc: 'Alert on sign-in from a new device or browser.', defaultOn: true },
            { id: 'password', label: 'Password changed', desc: 'Confirm when your password is updated.', defaultOn: true },
            { id: '2fa', label: 'Two-factor changes', desc: '2FA enabled, disabled, or backup codes regenerated.', defaultOn: true },
            { id: 'api-key', label: 'API key created/revoked', desc: 'Notify when keys are created or deleted.', defaultOn: false }
        ]
    },
    {
        id: 'billing',
        label: 'Billing & payments',
        description: 'Invoices, renewals, and payment failures.',
        icon: <CreditCard size={16} />,
        toggles: [
            { id: 'invoice', label: 'Invoice generated', desc: 'Email a copy of each invoice when issued.', defaultOn: true },
            { id: 'payment-fail', label: 'Payment failed', desc: 'Alert immediately when a charge is declined.', defaultOn: true },
            { id: 'renewal', label: 'Upcoming renewal', desc: '7-day and 1-day reminders before subscription renews.', defaultOn: true },
            { id: 'plan-change', label: 'Plan upgraded / downgraded', desc: 'Confirmation when subscription tier changes.', defaultOn: false }
        ]
    },
    {
        id: 'users',
        label: 'User management',
        description: 'User registrations, role changes, and removals.',
        icon: <Users size={16} />,
        toggles: [
            { id: 'new-signup', label: 'New user registered', desc: 'Notify admin when a user creates an account.', defaultOn: true },
            { id: 'role-change', label: 'Role changed', desc: 'When a user is promoted or demoted.', defaultOn: false },
            { id: 'user-delete', label: 'Account deleted', desc: 'Alert when a user deletes their account.', defaultOn: true },
            { id: 'invite-accept', label: 'Invitation accepted', desc: 'When an invited user completes signup.', defaultOn: false }
        ]
    },
    {
        id: 'support',
        label: 'Support tickets',
        description: 'Ticket activity and resolution updates.',
        icon: <MessageSquare size={16} />,
        toggles: [
            { id: 'ticket-new', label: 'New ticket submitted', desc: 'Email when a customer opens a support ticket.', defaultOn: true },
            { id: 'ticket-reply', label: 'Ticket reply received', desc: 'Notify when a customer replies to a ticket.', defaultOn: true },
            { id: 'ticket-resolved', label: 'Ticket resolved', desc: 'Confirmation when an agent closes a ticket.', defaultOn: false },
            { id: 'ticket-overdue', label: 'Ticket overdue (SLA breach)', desc: 'Alert when a ticket exceeds the response SLA.', defaultOn: true }
        ]
    },
    {
        id: 'reports',
        label: 'Analytics & reports',
        description: 'Automated reports and performance summaries.',
        icon: <BarChart3 size={16} />,
        toggles: [
            { id: 'weekly-digest', label: 'Weekly digest', desc: 'Top metrics summary every Monday morning.', defaultOn: true },
            { id: 'monthly-report', label: 'Monthly report', desc: 'Full platform report on the 1st of each month.', defaultOn: false },
            { id: 'anomaly', label: 'Traffic anomaly detected', desc: 'Alert on unusual spikes or drops in activity.', defaultOn: true },
            { id: 'revenue-milestone', label: 'Revenue milestone reached', desc: 'Celebrate when MRR crosses a new threshold.', defaultOn: false }
        ]
    },
    {
        id: 'system',
        label: 'System & integrations',
        description: 'Webhook failures, API errors, and system health.',
        icon: <Zap size={16} />,
        toggles: [
            { id: 'webhook-fail', label: 'Webhook delivery failure', desc: 'Alert when a webhook endpoint returns an error.', defaultOn: true },
            { id: 'api-limit', label: 'API rate limit approaching', desc: 'Warn when usage nears the monthly quota.', defaultOn: true },
            { id: 'downtime', label: 'Scheduled maintenance', desc: 'Advance notice of planned downtime windows.', defaultOn: true },
            { id: 'integration-broken', label: 'Integration disconnected', desc: 'Notify when an OAuth integration token expires.', defaultOn: false }
        ]
    }
]

export default function EmailNotificationsPage() {
    const [toggles, setToggles] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {}
        for (const g of NOTIFICATION_GROUPS) {
            for (const t of g.toggles) {
                initial[t.id] = t.defaultOn
            }
        }
        return initial
    })

    const [digestFreq, setDigestFreq] = useState('weekly')
    const [testEmail, setTestEmail] = useState('arjun@nexoraai.com')
    const [saved, setSaved] = useState(false)
    const [testSent, setTestSent] = useState(false)

    const toggle = (id: string) =>
        setToggles(prev => ({ ...prev, [id]: !prev[id] }))

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
    }

    const handleTest = () => {
        setTestSent(true)
        setTimeout(() => setTestSent(false), 3000)
    }

    const enabledCount = Object.values(toggles).filter(Boolean).length
    const totalCount = Object.values(toggles).length

    return (
        <PageStack>
            {/* Header summary card */}
            <Card className='shadow-sm'>
                <CardHeader className='flex flex-row flex-wrap items-start justify-between gap-3 space-y-0'>
                    <div>
                        <CardTitle className='flex items-center gap-2'>
                            <Bell size={18} />
                            Email Notifications
                        </CardTitle>
                        <CardDescription className='mt-1'>
                            Configure which platform events trigger email alerts to admins and users.
                        </CardDescription>
                    </div>
                    <div className='flex items-center gap-3'>
                        {saved && (
                            <span className='flex items-center gap-1.5 text-sm font-semibold text-emerald-600'>
                                <CircleCheck size={15} />
                                Saved
                            </span>
                        )}
                        <Button size='sm' onClick={handleSave}>
                            <CircleCheck size={14} />
                            Save preferences
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-wrap items-center gap-6 rounded-xl border bg-muted/30 px-5 py-4'>
                        <div>
                            <div className='text-2xl font-extrabold'>{enabledCount}</div>
                            <div className='text-xs font-medium text-muted-foreground'>Active alerts</div>
                        </div>
                        <div className='h-8 w-px bg-border' />
                        <div>
                            <div className='text-2xl font-extrabold'>{totalCount - enabledCount}</div>
                            <div className='text-xs font-medium text-muted-foreground'>Disabled</div>
                        </div>
                        <div className='h-8 w-px bg-border' />
                        <div className='flex-1'>
                            <Label className='text-xs'>Digest frequency</Label>
                            <div className='mt-1.5 max-w-[220px]'>
                                <DropdownSelect
                                    value={digestFreq}
                                    onChange={setDigestFreq}
                                    options={[
                                        { value: 'realtime', label: 'Real-time (immediate)' },
                                        { value: 'daily', label: 'Daily digest' },
                                        { value: 'weekly', label: 'Weekly digest' },
                                        { value: 'never', label: 'Never (disable digests)' }
                                    ]}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Notification groups */}
            {NOTIFICATION_GROUPS.map(group => (
                <Card key={group.id} className='shadow-sm'>
                    <CardHeader className='pb-3'>
                        <CardTitle className='flex items-center gap-2 text-base'>
                            {group.icon}
                            {group.label}
                        </CardTitle>
                        <CardDescription>{group.description}</CardDescription>
                    </CardHeader>
                    <CardContent className='p-0'>
                        <div className='divide-y divide-border'>
                            {group.toggles.map(t => (
                                <div
                                    key={t.id}
                                    className='flex items-center justify-between gap-4 px-6 py-4'
                                >
                                    <div className='min-w-0'>
                                        <div className='text-sm font-bold'>{t.label}</div>
                                        <div className='mt-0.5 text-xs font-medium text-muted-foreground'>
                                            {t.desc}
                                        </div>
                                    </div>
                                    <Switch
                                        checked={toggles[t.id] ?? false}
                                        onChange={() => toggle(t.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}

            {/* Test email card */}
            <Card className='shadow-sm'>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        <Mail size={18} />
                        Test notification delivery
                    </CardTitle>
                    <CardDescription>
                        Send a test email to verify your SMTP configuration and notification templates.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Label>Recipient email</Label>
                    <div className='flex flex-wrap items-center gap-3'>
                        <div className='fm min-w-[260px] flex-1 mb-0'>
                            <Input
                                type='email'
                                value={testEmail}
                                onChange={e => setTestEmail(e.target.value)}
                                placeholder='you@company.com'
                            />
                        </div>
                        <Button variant='outline' onClick={handleTest} className='h-10 gap-2'>
                            <Send size={14} />
                            {testSent ? 'Sent!' : 'Send test email'}
                        </Button>
                    </div>
                    {testSent && (
                        <div className='mt-3 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-900 dark:bg-emerald-950/30'>
                            <CircleCheck size={15} className='mt-0.5 shrink-0 text-emerald-600' />
                            <p className='text-xs font-medium text-emerald-700 dark:text-emerald-400'>
                                Test email dispatched to <strong>{testEmail}</strong>. Check your inbox in a few seconds.
                            </p>
                        </div>
                    )}
                    <div className='mt-4 flex items-start gap-2 rounded-lg border bg-muted/30 px-4 py-3'>
                        <Info size={15} className='mt-0.5 shrink-0 text-muted-foreground' />
                        <p className='text-xs leading-relaxed text-muted-foreground'>
                            Make sure your SMTP credentials are configured under{' '}
                            <a href='/system/settings/smtp' className='font-semibold underline'>
                                Settings → SMTP
                            </a>{' '}
                            before sending.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </PageStack>
    )
}
