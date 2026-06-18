'use client'

export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  Settings,
  User,
  Globe,
  Palette,
  Bell,
  Shield,
  CircleCheck,
  RefreshCw,
  Mail,
  Phone
} from 'lucide-react'
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  Input,
  Label,
  Textarea,
  DropdownSelect,
  Switch,
  Button,
  Tabs,
  TabsList,
  TabsTrigger
} from '@/components/ui'
import { PageStack } from '@/components'
import { AvatarInitials } from '@/components/common/avatar-initials'
import {
  CURRENT_USER,
  DEFAULT_APP_SETTINGS,
  PROFILE_KEY,
  type AppSettings
} from '@/lib/current-user'
import type { AppUser } from '@/lib/users-data'

const SETTINGS_KEY = 'nexora-ai-settings'

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' }
]

const TIMEZONE_OPTIONS = [
  { value: 'America/New_York', label: 'Eastern (US)' },
  { value: 'America/Chicago', label: 'Central (US)' },
  { value: 'America/Los_Angeles', label: 'Pacific (US)' },
  { value: 'Europe/London', label: 'London' },
  { value: 'Asia/Tokyo', label: 'Tokyo' }
]

const DATE_FORMAT_OPTIONS = [
  { value: 'MMM d, yyyy', label: 'Jan 15, 2025' },
  { value: 'dd/MM/yyyy', label: '15/01/2025' },
  { value: 'yyyy-MM-dd', label: '2025-01-15' }
]

const THEME_OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' }
]

const SESSION_TIMEOUT_OPTIONS = [
  { value: '15', label: '15 minutes' },
  { value: '30', label: '30 minutes' },
  { value: '60', label: '1 hour' },
  { value: '480', label: '8 hours' }
]

function SettingsSection ({
  title,
  description,
  children
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className='border-b border-border px-6 py-6 last:border-b-0'>
      <div className='mb-5'>
        <h3 className='text-sm font-extrabold tracking-tight'>{title}</h3>
        {description && (
          <p className='mt-1 text-xs font-medium text-muted-foreground'>
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  )
}

function NotificationRow ({
  label,
  description,
  checked,
  onChange
}: {
  label: string
  description: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <div className='flex items-center justify-between gap-4 px-4 py-3.5'>
      <div>
        <div className='text-sm font-bold'>{label}</div>
        <div className='text-xs font-medium text-muted-foreground'>
          {description}
        </div>
      </div>
      <Switch checked={checked} onChange={onChange} />
    </div>
  )
}

export default function SettingsContent () {
  const searchParams = useSearchParams()
  const { setTheme } = useTheme()
  const [tab, setTab] = useState('profile')
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS)
  const [profile, setProfile] = useState<AppUser>(CURRENT_USER)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const urlTab = searchParams.get('tab')
    if (urlTab) setTab(urlTab)
  }, [searchParams])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY)
      if (stored)
        setSettings({ ...DEFAULT_APP_SETTINGS, ...JSON.parse(stored) })
      const storedProfile = localStorage.getItem(PROFILE_KEY)
      if (storedProfile)
        setProfile({ ...CURRENT_USER, ...JSON.parse(storedProfile) })
    } catch {
      /* ignore */
    }
  }, [])

  const updateProfile = <K extends keyof AppUser>(
    key: K,
    value: AppUser[K]
  ) => {
    setProfile(prev => ({ ...prev, [key]: value }))
  }

  const update = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
    if (settings.theme !== 'system') {
      setTheme(settings.theme)
    } else {
      setTheme('system')
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleReset = () => {
    setSettings(DEFAULT_APP_SETTINGS)
    setProfile({ ...CURRENT_USER })
    setTheme('system')
  }

  return (
    <PageStack>
      <Card className='overflow-hidden shadow-sm'>
        <CardHeader className='flex flex-row flex-wrap items-start justify-between gap-3 space-y-0'>
          <div>
            <CardTitle className='flex items-center gap-2'>
              <Settings size={18} />
              Settings
            </CardTitle>
            <CardDescription className='mt-1'>
              Manage workspace preferences, appearance, and security.
            </CardDescription>
          </div>
          {saved && (
            <span className='flex items-center gap-1.5 text-sm font-semibold text-emerald-600'>
              <CircleCheck size={15} />
              Settings saved
            </span>
          )}
        </CardHeader>

        <div className='border-b px-6 pt-5'>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className='h-auto flex-wrap gap-1 bg-transparent p-0'>
              <TabsTrigger
                value='profile'
                className='gap-1.5 data-[state=active]:bg-muted'
              >
                <User size={14} />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value='general'
                className='gap-1.5 data-[state=active]:bg-muted'
              >
                <Globe size={14} />
                General
              </TabsTrigger>
              <TabsTrigger
                value='appearance'
                className='gap-1.5 data-[state=active]:bg-muted'
              >
                <Palette size={14} />
                Appearance
              </TabsTrigger>
              <TabsTrigger
                value='security'
                className='gap-1.5 data-[state=active]:bg-muted'
              >
                <Shield size={14} />
                Security
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <CardContent className='p-0'>
          {tab === 'profile' && (
            <SettingsSection
              title='Your profile'
              description='Update your personal information and contact details.'
            >
              <div className='mb-6 flex items-center gap-4'>
                <AvatarInitials
                  bg={profile.avatarColor}
                  initials={profile.initials}
                />
                <div>
                  <div className='text-sm font-extrabold'>{profile.name}</div>
                  <div className='text-xs font-medium text-muted-foreground'>
                    {profile.role}
                  </div>
                </div>
              </div>
              <div className='f2'>
                <div className='fm'>
                  <Label>First name</Label>
                  <Input
                    value={profile.firstName}
                    onChange={e => {
                      const firstName = e.target.value
                      setProfile(p => ({
                        ...p,
                        firstName,
                        name: `${firstName} ${p.lastName}`.trim()
                      }))
                    }}
                  />
                </div>
                <div className='fm'>
                  <Label>Last name</Label>
                  <Input
                    value={profile.lastName}
                    onChange={e => {
                      const lastName = e.target.value
                      setProfile(p => ({
                        ...p,
                        lastName,
                        name: `${p.firstName} ${lastName}`.trim()
                      }))
                    }}
                  />
                </div>
              </div>
              <div className='f2'>
                <div className='fm'>
                  <Label>Email</Label>
                  <div className='relative'>
                    <Mail
                      size={16}
                      className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'
                    />
                    <Input
                      type='email'
                      value={profile.email}
                      onChange={e => updateProfile('email', e.target.value)}
                      className='pl-9'
                    />
                  </div>
                </div>
                <div className='fm'>
                  <Label>Phone</Label>
                  <div className='relative'>
                    <Phone
                      size={16}
                      className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'
                    />
                    <Input
                      value={profile.phone}
                      onChange={e => updateProfile('phone', e.target.value)}
                      className='pl-9'
                    />
                  </div>
                </div>
              </div>
              <div className='f2'>
                <div className='fm'>
                  <Label>Job title</Label>
                  <Input
                    value={profile.jobTitle}
                    onChange={e => updateProfile('jobTitle', e.target.value)}
                  />
                </div>
                <div className='fm'>
                  <Label>Location</Label>
                  <Input
                    value={profile.location}
                    onChange={e => updateProfile('location', e.target.value)}
                  />
                </div>
              </div>
              <div className='fm'>
                <Label>Bio</Label>
                <Textarea
                  value={profile.bio}
                  onChange={e => updateProfile('bio', e.target.value)}
                  rows={3}
                  placeholder='Short description about yourself…'
                />
              </div>
            </SettingsSection>
          )}

          {tab === 'general' && (
            <SettingsSection
              title='Workspace'
              description='Basic information for your Nexora AI workspace.'
            >
              <div className='f2'>
                <div className='fm'>
                  <Label>Workspace name</Label>
                  <Input
                    value={settings.workspaceName}
                    onChange={e => update('workspaceName', e.target.value)}
                    placeholder='Nexora AI'
                  />
                </div>
                <div className='fm'>
                  <Label>Language</Label>
                  <DropdownSelect
                    value={settings.language}
                    onChange={v => update('language', v)}
                    options={LANGUAGE_OPTIONS}
                  />
                </div>
              </div>
              <div className='f2'>
                <div className='fm'>
                  <Label>Timezone</Label>
                  <DropdownSelect
                    value={settings.timezone}
                    onChange={v => update('timezone', v)}
                    options={TIMEZONE_OPTIONS}
                  />
                </div>
                <div className='fm'>
                  <Label>Date format</Label>
                  <DropdownSelect
                    value={settings.dateFormat}
                    onChange={v => update('dateFormat', v)}
                    options={DATE_FORMAT_OPTIONS}
                  />
                </div>
              </div>
            </SettingsSection>
          )}

          {tab === 'appearance' && (
            <SettingsSection
              title='Interface'
              description='Customize how Nexora AI looks and feels.'
            >
              <div className='f2'>
                <div className='fm'>
                  <Label>Theme</Label>
                  <DropdownSelect
                    value={settings.theme}
                    onChange={v => update('theme', v as AppSettings['theme'])}
                    options={THEME_OPTIONS}
                  />
                </div>
                <div className='fm'>
                  <Label>Sidebar</Label>
                  <div className='flex h-10 items-center justify-between rounded-lg border border-input bg-muted/50 px-3'>
                    <span className='text-sm font-medium'>Start collapsed</span>
                    <Switch
                      checked={settings.compactSidebar}
                      onChange={() =>
                        update('compactSidebar', !settings.compactSidebar)
                      }
                    />
                  </div>
                </div>
              </div>
            </SettingsSection>
          )}

          {tab === 'security' && (
            <>
              <SettingsSection
                title='Change password'
                description='Update your password regularly for better security.'
              >
                <div className='f2'>
                  <div className='fm'>
                    <Label>Current password</Label>
                    <Input type='password' placeholder='••••••••' />
                  </div>
                  <div className='fm'>
                    <Label>New password</Label>
                    <Input type='password' placeholder='Min. 8 characters' />
                  </div>
                </div>
                <div className='fm'>
                  <Label>Confirm new password</Label>
                  <Input type='password' placeholder='Re-enter password' />
                </div>
              </SettingsSection>
            </>
          )}
        </CardContent>

        <div className='flex flex-wrap items-center justify-end gap-3 border-t bg-muted/20 px-6 py-4'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={handleReset}
          >
            <RefreshCw size={14} className='mr-1.5' />
            Reset defaults
          </Button>
          <Button type='button' size='sm' onClick={handleSave}>
            <CircleCheck size={14} className='mr-1.5' />
            Save changes
          </Button>
        </div>
      </Card>
    </PageStack>
  )
}
