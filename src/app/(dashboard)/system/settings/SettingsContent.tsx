'use client'

export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  User, Bell, Shield, CreditCard, Users, Puzzle,
  Globe, Palette, Mail, RefreshCw, CircleCheck,
  Paintbrush, Linkedin, Twitter, Github, Upload, Link2,
  Zap, Send, Info, MessageSquare, BarChart3,
  KeyRound, Activity, Webhook, Copy, Plus
} from 'lucide-react'
import {
  Input, Label, Textarea, DropdownSelect, Switch, Button
} from '@/components/ui'
import { smtpConfig, apiKeys, apiLogs, webhookItems } from '@/lib/basic-modules-data'
import { PageStack } from '@/components'
import { AvatarInitials } from '@/components/common/avatar-initials'
import {
  CURRENT_USER, DEFAULT_APP_SETTINGS, PROFILE_KEY, type AppSettings
} from '@/lib/current-user'
import type { AppUser } from '@/lib/users-data'

const SETTINGS_KEY = 'nexora-ai-settings'
const BRANDING_KEY = 'nexora-ai-branding'

// ── nav config ────────────────────────────────────────────────────────────────
const NAV = [
  {
    group: 'Personal',
    items: [
      { id: 'account', icon: User, label: 'Account' },
      { id: 'notifications', icon: Bell, label: 'Notifications' },
      { id: 'security', icon: Shield, label: 'Security' },
    ],
  },
  {
    group: 'Organization',
    items: [
      // { id: 'billing', icon: CreditCard, label: 'Billing & plans' },
      // { id: 'team', icon: Users, label: 'Team' },
      { id: 'general', icon: Globe, label: 'General' },
      { id: 'appearance', icon: Palette, label: 'Appearance' },
      { id: 'branding', icon: Paintbrush, label: 'Branding' },
      { id: 'email-notif', icon: Mail, label: 'Email Notifications' },
      { id: 'smtp', icon: Send, label: 'SMTP Settings' },
      // { id: 'integrations', icon: Puzzle, label: 'Integrations' },
    ],
  },
  {
    group: 'Developer',
    items: [
      { id: 'api-keys', icon: KeyRound, label: 'API Keys' },
      { id: 'api-logs', icon: Activity, label: 'API Logs' },
      { id: 'webhooks', icon: Webhook, label: 'Webhooks' },
    ],
  },
]

// ── option lists ──────────────────────────────────────────────────────────────
const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
]
const TIMEZONE_OPTIONS = [
  { value: 'America/New_York', label: 'Eastern (US)' },
  { value: 'America/Chicago', label: 'Central (US)' },
  { value: 'America/Los_Angeles', label: 'Pacific (US)' },
  { value: 'Europe/London', label: 'London' },
  { value: 'Asia/Tokyo', label: 'Tokyo' },
]
const DATE_FORMAT_OPTIONS = [
  { value: 'MMM d, yyyy', label: 'Jan 15, 2025' },
  { value: 'dd/MM/yyyy', label: '15/01/2025' },
  { value: 'yyyy-MM-dd', label: '2025-01-15' },
]
const THEME_OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
]
const DIAL_OPTIONS = [
  { value: '+1', label: '🇺🇸 United States' },
  { value: '+44', label: '🇬🇧 United Kingdom' },
  { value: '+91', label: '🇮🇳 India' },
  { value: '+34', label: '🇪🇸 Spain' },
  { value: '+49', label: '🇩🇪 Germany' },
  { value: '+81', label: '🇯🇵 Japan' },
]

// ── branding type ─────────────────────────────────────────────────────────────
type BrandingSettings = {
  appName: string; tagline: string; supportEmail: string; websiteUrl: string
  primaryColor: string; accentColor: string; twitterUrl: string
  linkedinUrl: string; githubUrl: string; faviconUrl: string
  logoUrl: string; footerText: string
}
const DEFAULT_BRANDING: BrandingSettings = {
  appName: 'Nexora AI', tagline: 'Intelligent admin for modern SaaS',
  supportEmail: 'support@nexoraai.com', websiteUrl: 'https://nexoraai.com',
  primaryColor: '#2563eb', accentColor: '#7c3aed',
  twitterUrl: 'https://twitter.com/nexoraai',
  linkedinUrl: 'https://linkedin.com/company/nexoraai',
  githubUrl: 'https://github.com/nexoraai',
  faviconUrl: '', logoUrl: '',
  footerText: '© 2025 Nexora AI Inc. All rights reserved.',
}

// ── small helpers ─────────────────────────────────────────────────────────────
function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className='rounded-xl border bg-card p-6'>
      <div className='mb-5 flex items-center justify-between gap-2'>
        <div className='flex items-center gap-2 text-sm font-semibold'>
          <User size={15} className='text-muted-foreground' />
          {title}
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: React.ReactNode }) {
  return (
    <div className='flex flex-col gap-1.5'>
      <Label className='text-xs font-medium text-muted-foreground'>{label}</Label>
      {children}
      {hint && <p className='text-xs text-muted-foreground'>{hint}</p>}
    </div>
  )
}

function NotifRow({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: () => void }) {
  return (
    <div className='flex items-center justify-between gap-4 rounded-lg border bg-muted/30 px-4 py-3'>
      <div>
        <p className='text-sm font-medium'>{label}</p>
        <p className='text-xs text-muted-foreground'>{desc}</p>
      </div>
      <Switch checked={checked} onChange={onChange} />
    </div>
  )
}

export default function SettingsContent() {
  const searchParams = useSearchParams()
  const { setTheme } = useTheme()
  const [tab, setTab] = useState('account')
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS)
  const [profile, setProfile] = useState<AppUser>(CURRENT_USER)
  const [branding, setBranding] = useState<BrandingSettings>(DEFAULT_BRANDING)
  const [dialCode, setDialCode] = useState('+1')
  const [saved, setSaved] = useState(false)

  // email notifications state
  type ToggleMap = Record<string, boolean>
  const NOTIF_GROUPS = [
    {
      id: 'security', label: 'Security & account', icon: Shield,
      toggles: [
        { id: 'login', label: 'New login detected', desc: 'Alert on sign-in from a new device or browser.', defaultOn: true },
        { id: 'password', label: 'Password changed', desc: 'Confirm when your password is updated.', defaultOn: true },
        { id: '2fa', label: 'Two-factor changes', desc: '2FA enabled, disabled, or backup codes regenerated.', defaultOn: true },
        { id: 'api-key', label: 'API key created/revoked', desc: 'Notify when keys are created or deleted.', defaultOn: false },
      ],
    },
    {
      id: 'billing', label: 'Billing & payments', icon: CreditCard,
      toggles: [
        { id: 'invoice', label: 'Invoice generated', desc: 'Email a copy of each invoice when issued.', defaultOn: true },
        { id: 'payment-fail', label: 'Payment failed', desc: 'Alert immediately when a charge is declined.', defaultOn: true },
        { id: 'renewal', label: 'Upcoming renewal', desc: '7-day and 1-day reminders before subscription renews.', defaultOn: true },
        { id: 'plan-change', label: 'Plan upgraded / downgraded', desc: 'Confirmation when subscription tier changes.', defaultOn: false },
      ],
    },
    {
      id: 'users', label: 'User management', icon: Users,
      toggles: [
        { id: 'new-signup', label: 'New user registered', desc: 'Notify admin when a user creates an account.', defaultOn: true },
        { id: 'role-change', label: 'Role changed', desc: 'When a user is promoted or demoted.', defaultOn: false },
        { id: 'user-delete', label: 'Account deleted', desc: 'Alert when a user deletes their account.', defaultOn: true },
        { id: 'invite-accept', label: 'Invitation accepted', desc: 'When an invited user completes signup.', defaultOn: false },
      ],
    },
    {
      id: 'support', label: 'Support tickets', icon: MessageSquare,
      toggles: [
        { id: 'ticket-new', label: 'New ticket submitted', desc: 'Email when a customer opens a support ticket.', defaultOn: true },
        { id: 'ticket-reply', label: 'Ticket reply received', desc: 'Notify when a customer replies to a ticket.', defaultOn: true },
        { id: 'ticket-resolved', label: 'Ticket resolved', desc: 'Confirmation when an agent closes a ticket.', defaultOn: false },
        { id: 'ticket-overdue', label: 'Ticket overdue (SLA breach)', desc: 'Alert when a ticket exceeds the response SLA.', defaultOn: true },
      ],
    },
    {
      id: 'reports', label: 'Analytics & reports', icon: BarChart3,
      toggles: [
        { id: 'weekly-digest', label: 'Weekly digest', desc: 'Top metrics summary every Monday morning.', defaultOn: true },
        { id: 'monthly-report', label: 'Monthly report', desc: 'Full platform report on the 1st of each month.', defaultOn: false },
        { id: 'anomaly', label: 'Traffic anomaly detected', desc: 'Alert on unusual spikes or drops in activity.', defaultOn: true },
        { id: 'revenue-milestone', label: 'Revenue milestone reached', desc: 'Celebrate when MRR crosses a new threshold.', defaultOn: false },
      ],
    },
    {
      id: 'system', label: 'System & integrations', icon: Zap,
      toggles: [
        { id: 'webhook-fail', label: 'Webhook delivery failure', desc: 'Alert when a webhook endpoint returns an error.', defaultOn: true },
        { id: 'api-limit', label: 'API rate limit approaching', desc: 'Warn when usage nears the monthly quota.', defaultOn: true },
        { id: 'downtime', label: 'Scheduled maintenance', desc: 'Advance notice of planned downtime windows.', defaultOn: true },
        { id: 'integration-broken', label: 'Integration disconnected', desc: 'Notify when an OAuth integration token expires.', defaultOn: false },
      ],
    },
  ]
  const [notifToggles, setNotifToggles] = useState<ToggleMap>(() => {
    const m: ToggleMap = {}
    for (const g of NOTIF_GROUPS) for (const t of g.toggles) m[t.id] = t.defaultOn
    return m
  })
  const [digestFreq, setDigestFreq] = useState('weekly')
  const [testEmail, setTestEmail] = useState(CURRENT_USER.email)
  const [testSent, setTestSent] = useState(false)

  // smtp state
  const [smtpHost, setSmtpHost] = useState(smtpConfig.host)
  const [smtpPort, setSmtpPort] = useState(smtpConfig.port)
  const [smtpUser, setSmtpUser] = useState(smtpConfig.username)
  const [smtpEncryption, setSmtpEncryption] = useState(smtpConfig.encryption)
  const [smtpFromName, setSmtpFromName] = useState(smtpConfig.fromName)
  const [smtpFromEmail, setSmtpFromEmail] = useState(smtpConfig.fromEmail)
  const [smtpTestEmail, setSmtpTestEmail] = useState(smtpConfig.testRecipient)
  const [smtpTestSent, setSmtpTestSent] = useState(false)

  useEffect(() => {
    const urlTab = searchParams.get('tab')
    if (urlTab) setTab(urlTab)
  }, [searchParams])

  useEffect(() => {
    try {
      const s = localStorage.getItem(SETTINGS_KEY)
      if (s) setSettings({ ...DEFAULT_APP_SETTINGS, ...JSON.parse(s) })
      const p = localStorage.getItem(PROFILE_KEY)
      if (p) setProfile({ ...CURRENT_USER, ...JSON.parse(p) })
      const b = localStorage.getItem(BRANDING_KEY)
      if (b) setBranding({ ...DEFAULT_BRANDING, ...JSON.parse(b) })
    } catch { /* ignore */ }
  }, [])

  const updateProfile = <K extends keyof AppUser>(k: K, v: AppUser[K]) =>
    setProfile(p => ({ ...p, [k]: v }))
  const update = <K extends keyof AppSettings>(k: K, v: AppSettings[K]) =>
    setSettings(p => ({ ...p, [k]: v }))
  const updateBranding = <K extends keyof BrandingSettings>(k: K, v: BrandingSettings[K]) =>
    setBranding(p => ({ ...p, [k]: v }))

  function handleSave() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
    localStorage.setItem(BRANDING_KEY, JSON.stringify(branding))
    setTheme(settings.theme)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function handleReset() {
    setSettings(DEFAULT_APP_SETTINGS)
    setProfile({ ...CURRENT_USER })
    setBranding({ ...DEFAULT_BRANDING })
    setTheme('system')
  }

  // ── tab titles ──────────────────────────────────────────────────────────────
  const TITLES: Record<string, string> = {
    account: 'Account', notifications: 'Notifications', security: 'Security',
    billing: 'Billing & plans', team: 'Team', general: 'General',
    appearance: 'Appearance', branding: 'Branding', integrations: 'Integrations',
    'email-notif': 'Email Notifications', smtp: 'SMTP Settings',
    'api-keys': 'API Keys', 'api-logs': 'API Logs', webhooks: 'Webhooks',
  }

  return (
    <PageStack>
      <div className='flex gap-8'>

        {/* ── Left sidebar nav ─────────────────────────────────── */}
        <aside className='hidden w-52 shrink-0 md:block'>
          {NAV.map((group) => (
            <div key={group.group} className='mb-6'>
              <p className='mb-2 px-3 text-xs font-semibold text-muted-foreground'>{group.group}</p>
              <nav className='flex flex-col gap-0.5'>
                {group.items.map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${tab === id
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                      }`}
                  >
                    <Icon size={15} />
                    {label}
                  </button>
                ))}
              </nav>
            </div>
          ))}

          {/* User card at bottom */}
          <div className='mt-4 flex items-center gap-2.5 rounded-xl border bg-card px-3 py-2.5'>
            <AvatarInitials bg={profile.avatarColor} initials={profile.initials} />
            <div className='min-w-0'>
              <p className='truncate text-sm font-semibold'>{profile.name}</p>
              <p className='truncate text-xs text-muted-foreground'>{profile.email}</p>
            </div>
          </div>
        </aside>

        {/* ── Right content ─────────────────────────────────────── */}
        <div className='min-w-0 flex-1'>
          <h1 className='mb-6 text-2xl font-bold'>{TITLES[tab] ?? tab}</h1>

          <div className='flex flex-col gap-5'>

            {/* ── ACCOUNT ──────────────────────────────────────── */}
            {tab === 'account' && (
              <>
                <Section title='Basic details'>
                  {/* Avatar row */}
                  <div className='mb-6 flex items-center gap-4'>
                    <AvatarInitials bg={profile.avatarColor} initials={profile.initials} />
                    <button className='text-sm text-muted-foreground underline-offset-2 hover:text-destructive hover:underline'>
                      Remove
                    </button>
                  </div>

                  <div className='flex flex-col gap-4'>
                    <Field label='Full name'>
                      <Input
                        value={profile.name}
                        onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                        placeholder='Sofia Rivers'
                      />
                    </Field>

                    <Field
                      label='Email address'
                      hint={<>Please <span className='text-primary cursor-pointer hover:underline'>contact us</span> to change your email</>}
                    >
                      <Input
                        type='email'
                        value={profile.email}
                        onChange={e => updateProfile('email', e.target.value)}
                      />
                    </Field>

                    <div className='grid grid-cols-[160px_1fr] gap-3'>
                      <Field label='Dial code'>
                        <DropdownSelect
                          value={dialCode}
                          onChange={setDialCode}
                          options={DIAL_OPTIONS}
                        />
                      </Field>
                      <Field label='Phone number'>
                        <Input
                          value={profile.phone}
                          onChange={e => updateProfile('phone', e.target.value)}
                          placeholder='965 245 7623'
                        />
                      </Field>
                    </div>

                    <Field label='Title'>
                      <Input
                        value={profile.jobTitle}
                        onChange={e => updateProfile('jobTitle', e.target.value)}
                        placeholder='e.g Golang Developer'
                      />
                    </Field>

                    <Field label='Biography (optional)'>
                      <Textarea
                        value={profile.bio}
                        onChange={e => updateProfile('bio', e.target.value)}
                        rows={3}
                        placeholder='Short description about yourself…'
                      />
                    </Field>

                    <Field label='Location'>
                      <Input
                        value={profile.location}
                        onChange={e => updateProfile('location', e.target.value)}
                        placeholder='San Francisco, USA'
                      />
                    </Field>
                  </div>
                </Section>
              </>
            )}

            {/* ── NOTIFICATIONS ────────────────────────────────── */}
            {tab === 'notifications' && (
              <Section title='Notification preferences'>
                <div className='flex flex-col gap-3'>
                  <NotifRow label='Email notifications' desc='Receive updates and alerts via email.' checked={settings.emailNotifications} onChange={() => update('emailNotifications', !settings.emailNotifications)} />
                  <NotifRow label='Push notifications' desc='Browser and mobile push alerts.' checked={settings.pushNotifications} onChange={() => update('pushNotifications', !settings.pushNotifications)} />
                  <NotifRow label='Marketing emails' desc='Product news, tips, and announcements.' checked={settings.marketingEmails} onChange={() => update('marketingEmails', !settings.marketingEmails)} />
                  <NotifRow label='Weekly digest' desc='Summary of activity sent every Monday.' checked={settings.weeklyDigest} onChange={() => update('weeklyDigest', !settings.weeklyDigest)} />
                </div>
              </Section>
            )}

            {/* ── SECURITY ─────────────────────────────────────── */}
            {tab === 'security' && (
              <Section title='Change password'>
                <div className='flex flex-col gap-4'>
                  <Field label='Current password'>
                    <Input type='password' placeholder='••••••••' />
                  </Field>
                  <Field label='New password'>
                    <Input type='password' placeholder='Min. 8 characters' />
                  </Field>
                  <Field label='Confirm new password'>
                    <Input type='password' placeholder='Re-enter password' />
                  </Field>
                </div>
              </Section>
            )}

            {/* ── GENERAL ──────────────────────────────────────── */}
            {tab === 'general' && (
              <Section title='Workspace'>
                <div className='grid grid-cols-2 gap-4'>
                  <Field label='Workspace name'>
                    <Input value={settings.workspaceName} onChange={e => update('workspaceName', e.target.value)} />
                  </Field>
                  <Field label='Language'>
                    <DropdownSelect value={settings.language} onChange={v => update('language', v)} options={LANGUAGE_OPTIONS} />
                  </Field>
                  <Field label='Timezone'>
                    <DropdownSelect value={settings.timezone} onChange={v => update('timezone', v)} options={TIMEZONE_OPTIONS} />
                  </Field>
                  <Field label='Date format'>
                    <DropdownSelect value={settings.dateFormat} onChange={v => update('dateFormat', v)} options={DATE_FORMAT_OPTIONS} />
                  </Field>
                </div>
              </Section>
            )}

            {/* ── APPEARANCE ───────────────────────────────────── */}
            {tab === 'appearance' && (
              <Section title='Interface'>
                <div className='grid grid-cols-2 gap-4'>
                  <Field label='Theme'>
                    <DropdownSelect value={settings.theme} onChange={v => update('theme', v as AppSettings['theme'])} options={THEME_OPTIONS} />
                  </Field>
                  <Field label='Sidebar'>
                    <div className='flex h-10 items-center justify-between rounded-lg border border-input bg-muted/50 px-3'>
                      <span className='text-sm'>Start collapsed</span>
                      <Switch checked={settings.compactSidebar} onChange={() => update('compactSidebar', !settings.compactSidebar)} />
                    </div>
                  </Field>
                </div>
              </Section>
            )}

            {/* ── BRANDING ─────────────────────────────────────── */}
            {tab === 'branding' && (
              <>
                <Section title='Brand identity'>
                  <div className='grid grid-cols-2 gap-4'>
                    <Field label='App / product name'>
                      <Input value={branding.appName} onChange={e => updateBranding('appName', e.target.value)} />
                    </Field>
                    <Field label='Tagline'>
                      <Input value={branding.tagline} onChange={e => updateBranding('tagline', e.target.value)} />
                    </Field>
                    <Field label='Support email'>
                      <div className='relative'>
                        <Mail size={15} className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground' />
                        <Input value={branding.supportEmail} onChange={e => updateBranding('supportEmail', e.target.value)} className='pl-9' />
                      </div>
                    </Field>
                    <Field label='Website URL'>
                      <div className='relative'>
                        <Link2 size={15} className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground' />
                        <Input value={branding.websiteUrl} onChange={e => updateBranding('websiteUrl', e.target.value)} className='pl-9' />
                      </div>
                    </Field>
                  </div>
                  <div className='mt-4'>
                    <Field label='Footer text'>
                      <Input value={branding.footerText} onChange={e => updateBranding('footerText', e.target.value)} />
                    </Field>
                  </div>
                </Section>

                <Section title='Logo & favicon'>
                  <div className='grid grid-cols-2 gap-4'>
                    <Field label='Logo URL'>
                      <div className='flex gap-2'>
                        <div className='relative flex-1'>
                          <Upload size={15} className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground' />
                          <Input value={branding.logoUrl} onChange={e => updateBranding('logoUrl', e.target.value)} className='pl-9' placeholder='https://cdn.yourapp.com/logo.svg' />
                        </div>
                        {branding.logoUrl && (
                          <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-muted'>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={branding.logoUrl} alt='Logo' className='max-h-8 max-w-8 object-contain' />
                          </div>
                        )}
                      </div>
                    </Field>
                    <Field label='Favicon URL'>
                      <div className='flex gap-2'>
                        <div className='relative flex-1'>
                          <Upload size={15} className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground' />
                          <Input value={branding.faviconUrl} onChange={e => updateBranding('faviconUrl', e.target.value)} className='pl-9' placeholder='https://cdn.yourapp.com/favicon.ico' />
                        </div>
                        {branding.faviconUrl && (
                          <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-muted'>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={branding.faviconUrl} alt='Favicon' className='max-h-6 max-w-6 object-contain' />
                          </div>
                        )}
                      </div>
                    </Field>
                  </div>
                </Section>

                <Section title='Social links'>
                  <div className='flex flex-col gap-4'>
                    <Field label='Twitter / X'>
                      <div className='relative'>
                        <Twitter size={15} className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground' />
                        <Input value={branding.twitterUrl} onChange={e => updateBranding('twitterUrl', e.target.value)} className='pl-9' />
                      </div>
                    </Field>
                    <div className='grid grid-cols-2 gap-4'>
                      <Field label='LinkedIn'>
                        <div className='relative'>
                          <Linkedin size={15} className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground' />
                          <Input value={branding.linkedinUrl} onChange={e => updateBranding('linkedinUrl', e.target.value)} className='pl-9' />
                        </div>
                      </Field>
                      <Field label='GitHub'>
                        <div className='relative'>
                          <Github size={15} className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground' />
                          <Input value={branding.githubUrl} onChange={e => updateBranding('githubUrl', e.target.value)} className='pl-9' />
                        </div>
                      </Field>
                    </div>
                  </div>
                </Section>
              </>
            )}

            {/* ── EMAIL NOTIFICATIONS ──────────────────────────── */}
            {tab === 'email-notif' && (
              <>
                {/* summary bar */}
                <div className='flex flex-wrap items-center gap-6 rounded-xl border bg-card px-5 py-4 '>
                  <div>
                    <div className='text-2xl font-extrabold'>{Object.values(notifToggles).filter(Boolean).length}</div>
                    <div className='text-xs text-muted-foreground'>Active alerts</div>
                  </div>
                  <div className='h-8 w-px bg-border' />
                  <div>
                    <div className='text-2xl font-extrabold'>{Object.values(notifToggles).filter(v => !v).length}</div>
                    <div className='text-xs text-muted-foreground'>Disabled</div>
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
                          { value: 'never', label: 'Never (disable digests)' },
                        ]}
                      />
                    </div>
                  </div>
                </div>

                {/* notification groups */}
                {NOTIF_GROUPS.map(group => (
                  <Section key={group.id} title={group.label}>
                    <div className='flex flex-col divide-y divide-border -mx-6 -mt-5'>
                      {group.toggles.map(t => (
                        <div key={t.id} className='flex items-center justify-between gap-4 px-6 py-3.5'>
                          <div>
                            <p className='text-sm font-medium'>{t.label}</p>
                            <p className='text-xs text-muted-foreground'>{t.desc}</p>
                          </div>
                          <Switch checked={notifToggles[t.id] ?? false} onChange={() => setNotifToggles(prev => ({ ...prev, [t.id]: !prev[t.id] }))} />
                        </div>
                      ))}
                    </div>
                  </Section>
                ))}

                {/* test email */}
                <Section title='Test notification delivery'>
                  <Field label='Recipient email'>
                    <div className='flex flex-wrap gap-2'>
                      <Input type='email' value={testEmail} onChange={e => setTestEmail(e.target.value)} className='flex-1' placeholder='you@company.com' />
                      <Button variant='outline' onClick={() => { setTestSent(true); setTimeout(() => setTestSent(false), 3000) }}>
                        <Send size={14} /> {testSent ? 'Sent!' : 'Send test email'}
                      </Button>
                    </div>
                  </Field>
                  {testSent && (
                    <div className='mt-3 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-900 dark:bg-emerald-950/30'>
                      <CircleCheck size={14} className='mt-0.5 shrink-0 text-emerald-600' />
                      <p className='text-xs text-emerald-700 dark:text-emerald-400'>Test email dispatched to <strong>{testEmail}</strong>.</p>
                    </div>
                  )}
                  <div className='mt-3 flex items-start gap-2 rounded-lg border bg-muted/30 px-4 py-3'>
                    <Info size={14} className='mt-0.5 shrink-0 text-muted-foreground' />
                    <p className='text-xs text-muted-foreground'>Make sure SMTP is configured under the <button onClick={() => setTab('smtp')} className='font-semibold underline'>SMTP Settings</button> tab first.</p>
                  </div>
                </Section>
              </>
            )}

            {/* ── SMTP SETTINGS ────────────────────────────────── */}
            {tab === 'smtp' && (
              <Section title='Outbound email provider'>
                <div className='flex flex-col gap-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    <Field label='SMTP Host'>
                      <Input value={smtpHost} onChange={e => setSmtpHost(e.target.value)} />
                    </Field>
                    <Field label='Port'>
                      <Input value={smtpPort} onChange={e => setSmtpPort(e.target.value)} />
                    </Field>
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <Field label='Username'>
                      <Input value={smtpUser} onChange={e => setSmtpUser(e.target.value)} />
                    </Field>
                    <Field label='Encryption'>
                      <DropdownSelect value={smtpEncryption} onChange={setSmtpEncryption} options={[{ value: 'TLS', label: 'TLS' }, { value: 'SSL', label: 'SSL' }, { value: 'None', label: 'None' }]} />
                    </Field>
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <Field label='From name'>
                      <Input value={smtpFromName} onChange={e => setSmtpFromName(e.target.value)} />
                    </Field>
                    <Field label='From email'>
                      <Input type='email' value={smtpFromEmail} onChange={e => setSmtpFromEmail(e.target.value)} />
                    </Field>
                  </div>
                  <div className='rounded-xl border bg-muted/30 p-4'>
                    <p className='mb-3 text-sm font-semibold'>Send test email</p>
                    <div className='flex flex-wrap items-center gap-2'>
                      <Input value={smtpTestEmail} onChange={e => setSmtpTestEmail(e.target.value)} className='flex-1' />
                      <Button variant='outline' onClick={() => { setSmtpTestSent(true); setTimeout(() => setSmtpTestSent(false), 3000) }}>
                        <Send size={14} /> {smtpTestSent ? 'Sent!' : 'Send test'}
                      </Button>
                    </div>
                    {smtpTestSent && (
                      <div className='mt-3 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-900 dark:bg-emerald-950/30'>
                        <CircleCheck size={14} className='mt-0.5 shrink-0 text-emerald-600' />
                        <p className='text-xs text-emerald-700 dark:text-emerald-400'>Test email sent to <strong>{smtpTestEmail}</strong>.</p>
                      </div>
                    )}
                  </div>
                </div>
              </Section>
            )}

            {/* ── API KEYS ─────────────────────────────────────── */}
            {tab === 'api-keys' && (
              <Section title='API Keys' action={<Button size='sm'><Plus size={14} /> Generate Key</Button>}>
                <div className='overflow-x-auto'>
                  <table className='w-full text-sm'>
                    <thead>
                      <tr className='border-b text-left text-muted-foreground'>
                        <th className='pb-3 font-semibold'>Name</th>
                        <th className='pb-3 font-semibold'>Key</th>
                        <th className='pb-3 font-semibold'>Scope</th>
                        <th className='pb-3 font-semibold'>Requests</th>
                        <th className='pb-3 font-semibold'>Last Used</th>
                        <th className='pb-3 font-semibold'>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apiKeys.map((item) => (
                        <tr key={item.id} className='border-b last:border-0'>
                          <td className='py-3 font-medium'>{item.name}</td>
                          <td className='py-3'>
                            <span className='mr-2 font-mono text-xs'>{item.key}</span>
                            <Button variant='ghost' size='sm'><Copy size={13} /></Button>
                          </td>
                          <td className='py-3'>{item.scope}</td>
                          <td className='py-3'>{item.requests}</td>
                          <td className='py-3 text-muted-foreground'>{item.lastUsed}</td>
                          <td className='py-3'>{item.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>
            )}

            {/* ── API LOGS ──────────────────────────────────────── */}
            {tab === 'api-logs' && (
              <Section title='API Logs'>
                <div className='overflow-x-auto'>
                  <table className='w-full text-sm'>
                    <thead>
                      <tr className='border-b text-left text-muted-foreground'>
                        <th className='pb-3 font-semibold'>Method</th>
                        <th className='pb-3 font-semibold'>Endpoint</th>
                        <th className='pb-3 font-semibold'>Status</th>
                        <th className='pb-3 font-semibold'>Latency</th>
                        <th className='pb-3 font-semibold'>Source</th>
                        <th className='pb-3 font-semibold'>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apiLogs.map((log) => (
                        <tr key={log.id} className='border-b last:border-0'>
                          <td className='py-3 font-semibold'>{log.method}</td>
                          <td className='py-3 font-mono text-xs'>{log.endpoint}</td>
                          <td className='py-3'>{log.status}</td>
                          <td className='py-3'>{log.latency}</td>
                          <td className='py-3'>{log.source}</td>
                          <td className='py-3 text-muted-foreground'>{log.createdAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>
            )}

            {/* ── WEBHOOKS ──────────────────────────────────────── */}
            {tab === 'webhooks' && (
              <Section title='Webhooks'>
                <div className='space-y-4'>
                  {webhookItems.map((item) => (
                    <div key={item.id} className='rounded-xl border p-4'>
                      <div className='flex flex-wrap items-center justify-between gap-2'>
                        <div>
                          <div className='font-semibold'>{item.event}</div>
                          <div className='mt-1 font-mono text-xs text-muted-foreground'>{item.target}</div>
                        </div>
                        <div className='text-sm font-medium'>{item.status}</div>
                      </div>
                      <div className='mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground'>
                        <span>Deliveries: {item.deliveries}</span>
                        <span>Last delivery: {item.lastDelivery}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* ── BILLING / TEAM / INTEGRATIONS (stubs) ────────── */}
            {(tab === 'billing' || tab === 'team' || tab === 'integrations') && (
              <div className='flex h-48 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground'>
                {TITLES[tab]} — coming soon
              </div>
            )}

          </div>

          {/* ── Footer actions ──────────────────────────────────── */}
          <div className='mt-6 flex items-center justify-end gap-3'>
            {saved && (
              <span className='flex items-center gap-1.5 text-sm font-semibold text-emerald-600'>
                <CircleCheck size={14} /> Saved
              </span>
            )}
            <Button variant='outline' size='sm' onClick={handleReset}>
              <RefreshCw size={13} /> Reset defaults
            </Button>
            <Button size='sm' onClick={handleSave}>
              <CircleCheck size={13} /> Save changes
            </Button>
          </div>
        </div>
      </div>
    </PageStack>
  )
}
