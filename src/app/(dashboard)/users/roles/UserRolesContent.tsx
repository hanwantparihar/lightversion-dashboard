'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Shield, Search, CircleCheck, Plus } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  Input,
  DropdownSelect,
  Button,
  Label,
  Modal,
  Checkbox,
  Tabs,
  TabsList,
  TabsTrigger
} from '@/components/ui'
import { PageStack } from '@/components'
import { RolesList } from '@/components/users/roles-list'
import { UserRolesTable } from '@/components/users/user-roles-table'
import { useUsers } from '@/contexts/users-context'
import { useRoles } from '@/contexts/roles-context'
import {
  PERMISSION_LABELS,
  type Role,
  type RolePermissions
} from '@/lib/roles-data'

const EMPTY_PERMISSIONS: RolePermissions = {
  users: false,
  products: false,
  orders: false,
  settings: false,
  billing: false
}

const ROLE_COLORS = [
  '#2563eb',
  '#10b981',
  '#7c3aed',
  '#f59e0b',
  '#ef4444',
  '#06b6d4',
  '#ec4899'
]

export default function UserRolesContent () {
  const searchParams = useSearchParams()
  const highlightId = Number(searchParams.get('user') || 0)
  const { users, updateUserRole } = useUsers()
  const { roles, roleNames, addRole, updateRole, deleteRole } = useRoles()

  const [tab, setTab] = useState(highlightId ? 'assign' : 'roles')
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [roleDrafts, setRoleDrafts] = useState<Record<number, string>>({})
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [bulkRole, setBulkRole] = useState(roleNames[0] ?? 'Admin')
  const [assignSaved, setAssignSaved] = useState(false)

  const [roleModalOpen, setRoleModalOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [roleDraft, setRoleDraft] = useState<{
    name: string
    description: string
    color: string
    permissions: RolePermissions
  } | null>(null)
  const [roleError, setRoleError] = useState('')

  useEffect(() => {
    const drafts: Record<number, string> = {}
    users.forEach(u => {
      drafts[u.id] = u.role
    })
    setRoleDrafts(drafts)
  }, [users])

  useEffect(() => {
    if (highlightId) {
      setSelectedIds([highlightId])
      setTab('assign')
    }
  }, [highlightId])

  useEffect(() => {
    if (roleNames.length && !roleNames.includes(bulkRole)) {
      setBulkRole(roleNames[0])
    }
  }, [roleNames, bulkRole])

  const userCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    roleNames.forEach(name => {
      counts[name] = users.filter(u => u.role === name).length
    })
    return counts
  }, [users, roleNames])

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase()
    return users.filter(u => {
      const matchesSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      const matchesRole = roleFilter === 'All' || u.role === roleFilter
      return matchesSearch && matchesRole
    })
  }, [users, search, roleFilter])

  const pendingChanges = users.filter(
    u => roleDrafts[u.id] !== undefined && roleDrafts[u.id] !== u.role
  )

  const openAddRole = () => {
    setEditingRole(null)
    setRoleDraft({
      name: '',
      description: '',
      color: ROLE_COLORS[roles.length % ROLE_COLORS.length],
      permissions: { ...EMPTY_PERMISSIONS }
    })
    setRoleError('')
    setRoleModalOpen(true)
  }

  const openEditRole = (role: Role) => {
    setEditingRole(role)
    setRoleDraft({
      name: role.name,
      description: role.description,
      color: role.color,
      permissions: { ...role.permissions }
    })
    setRoleError('')
    setRoleModalOpen(true)
  }

  const saveRoleDefinition = () => {
    if (!roleDraft?.name.trim()) {
      setRoleError('Role name is required.')
      return
    }
    const duplicate = roles.some(
      r =>
        r.name.toLowerCase() === roleDraft.name.trim().toLowerCase() &&
        r.id !== editingRole?.id
    )
    if (duplicate) {
      setRoleError('A role with this name already exists.')
      return
    }

    if (editingRole) {
      const oldName = editingRole.name
      const newName = roleDraft.name.trim()
      updateRole(editingRole.id, {
        name: newName,
        description: roleDraft.description.trim(),
        color: roleDraft.color,
        permissions: roleDraft.permissions
      })
      if (oldName !== newName) {
        users
          .filter(u => u.role === oldName)
          .forEach(u => updateUserRole(u.id, newName))
      }
    } else {
      addRole({
        name: roleDraft.name.trim(),
        description: roleDraft.description.trim(),
        color: roleDraft.color,
        permissions: roleDraft.permissions
      })
    }

    setRoleModalOpen(false)
  }

  const handleDeleteRole = (role: Role) => {
    const count = userCounts[role.name] ?? 0
    if (count > 0) return
    deleteRole(role.id)
  }

  const saveAssignments = () => {
    pendingChanges.forEach(u => {
      const role = roleDrafts[u.id]
      if (role) updateUserRole(u.id, role)
    })
    setAssignSaved(true)
    setTimeout(() => setAssignSaved(false), 2500)
  }

  const filterOptions = ['All', ...roleNames]

  return (
    <PageStack>
      <Card>
        <CardHeader className='space-y-4'>
          <div className='flex flex-wrap items-start justify-between gap-3'>
            <div>
              <CardTitle className='fc g2'>
                <Shield size={18} />
                Role management
              </CardTitle>
              <CardDescription>
                Create roles and assign them to users across your organization.
              </CardDescription>
            </div>
            {tab === 'roles' && (
              <Button size='sm' onClick={openAddRole}>
                <Plus size={14} className='mr-1' />
                Add role
              </Button>
            )}
            {tab === 'assign' && (
              <Button
                size='sm'
                onClick={saveAssignments}
                disabled={pendingChanges.length === 0}
              >
                <CircleCheck size={14} className='mr-1' />
                Save assignments
                {pendingChanges.length > 0 ? ` (${pendingChanges.length})` : ''}
              </Button>
            )}
          </div>

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className='mb-5'>
              <TabsTrigger value='roles'>Roles</TabsTrigger>
              <TabsTrigger value='assign'>Assign to users</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent style={{ padding: 0 }}>
          {tab === 'roles' && (
            <RolesList
              roles={roles}
              userCounts={userCounts}
              onEdit={openEditRole}
              onDelete={handleDeleteRole}
            />
          )}

          {tab === 'assign' && (
            <>
              {assignSaved && (
                <div className='border-b border-emerald-500/30 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-700'>
                  User role assignments saved.
                </div>
              )}
              <div className='dt-f'>
                <div className='fc g2' style={{ flexWrap: 'wrap' }}>
                  <DropdownSelect
                    style={{ width: 140 }}
                    value={bulkRole}
                    onChange={setBulkRole}
                    options={roleNames.map(role => ({
                      value: role,
                      label: role
                    }))}
                  />
                  <Button
                    size='sm'
                    variant='outline'
                    disabled={selectedIds.length === 0}
                    onClick={() => {
                      setRoleDrafts(prev => {
                        const next = { ...prev }
                        selectedIds.forEach(id => {
                          next[id] = bulkRole
                        })
                        return next
                      })
                    }}
                  >
                    Apply to selected ({selectedIds.length})
                  </Button>
                </div>
                <div className='fc g2' style={{ flexWrap: 'wrap' }}>
                  <DropdownSelect
                    style={{ width: 130 }}
                    value={roleFilter}
                    onChange={setRoleFilter}
                    placeholder='All roles'
                    options={filterOptions.map(r => ({
                      value: r,
                      label: r === 'All' ? 'All roles' : r
                    }))}
                  />
                  <div className='relative'>
                    <Search
                      size={15}
                      className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'
                    />
                    <Input
                      placeholder='Search users…'
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className='h-9 w-[220px] rounded-lg pl-9'
                    />
                  </div>
                </div>
              </div>
              <UserRolesTable
                users={filteredUsers}
                roleNames={roleNames}
                roleDrafts={roleDrafts}
                onRoleChange={(userId, role) =>
                  setRoleDrafts(prev => ({ ...prev, [userId]: role }))
                }
                selectedIds={selectedIds}
                onToggleSelect={id =>
                  setSelectedIds(prev =>
                    prev.includes(id)
                      ? prev.filter(x => x !== id)
                      : [...prev, id]
                  )
                }
                onToggleSelectAll={checked =>
                  setSelectedIds(checked ? filteredUsers.map(u => u.id) : [])
                }
              />
            </>
          )}
        </CardContent>
      </Card>

      <Modal
        open={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        title={editingRole ? `Edit ${editingRole.name}` : 'Add role'}
        footer={
          <>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setRoleModalOpen(false)}
            >
              Cancel
            </Button>
            <Button size='sm' onClick={saveRoleDefinition}>
              <CircleCheck size={14} className='mr-1' />
              {editingRole ? 'Update role' : 'Create role'}
            </Button>
          </>
        }
      >
        {roleDraft && (
          <div className='space-y-4 text-foreground'>
            {roleError && (
              <p className='rounded-lg bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive'>
                {roleError}
              </p>
            )}
            <div className='fm'>
              <Label>Role name</Label>
              <Input
                value={roleDraft.name}
                onChange={e =>
                  setRoleDraft({ ...roleDraft, name: e.target.value })
                }
                placeholder='e.g. Support Agent'
              />
            </div>
            <div className='fm'>
              <Label>Description</Label>
              <Input
                value={roleDraft.description}
                onChange={e =>
                  setRoleDraft({ ...roleDraft, description: e.target.value })
                }
                placeholder='What can users with this role do?'
              />
            </div>
            <div className='fm'>
              <Label>Color</Label>
              <div className='flex flex-wrap gap-2'>
                {ROLE_COLORS.map(color => (
                  <button
                    key={color}
                    type='button'
                    className='h-8 w-8 rounded-lg border-2 transition-transform hover:scale-105'
                    style={{
                      background: color,
                      borderColor:
                        roleDraft.color === color ? 'var(--fg)' : 'transparent'
                    }}
                    onClick={() => setRoleDraft({ ...roleDraft, color })}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>
            <div className='fm'>
              <Label className='mb-2 block'>Permissions</Label>
              <div className='flex flex-col gap-2.5'>
                {(
                  Object.keys(PERMISSION_LABELS) as (keyof RolePermissions)[]
                ).map(key => (
                  <Checkbox
                    key={key}
                    label={PERMISSION_LABELS[key]}
                    checked={roleDraft.permissions[key]}
                    onChange={() =>
                      setRoleDraft({
                        ...roleDraft,
                        permissions: {
                          ...roleDraft.permissions,
                          [key]: !roleDraft.permissions[key]
                        }
                      })
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </PageStack>
  )
}
