'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Plus, Search, Pencil, Trash2, Loader2, Users } from 'lucide-react'
import { toast } from 'sonner'

interface User {
  id: string
  email: string
  role: string
  createdAt: string
}

const roleBadge = (role: string) => {
  switch (role) {
    case 'ADMIN':   return <Badge className="bg-red-500 hover:bg-red-600">ADMIN</Badge>
    case 'WARDEN':  return <Badge className="bg-blue-500 hover:bg-blue-600">WARDEN</Badge>
    case 'STUDENT': return <Badge className="bg-green-500 hover:bg-green-600">STUDENT</Badge>
    default:        return <Badge variant="secondary">{role}</Badge>
  }
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [deleteUser, setDeleteUser] = useState<User | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Form state
  const [form, setForm] = useState({ email: '', password: '', role: 'STUDENT' })

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/users')
      if (!res.ok) throw new Error('Failed to fetch users')
      setUsers(await res.json())
    } catch {
      toast.error('Could not load users')
    } finally {
      setLoading(false)
    }
  }

  const openAdd = () => {
    setEditUser(null)
    setForm({ email: '', password: '', role: 'STUDENT' })
    setDialogOpen(true)
  }

  const openEdit = (u: User) => {
    setEditUser(u)
    setForm({ email: u.email, password: '', role: u.role })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.email || !form.role) return toast.error('Email and role are required')
    if (!editUser && !form.password) return toast.error('Password is required for new users')
    setSaving(true)
    try {
      const method = editUser ? 'PATCH' : 'POST'
      const body = editUser
        ? { id: editUser.id, email: form.email, role: form.role, ...(form.password ? { password: form.password } : {}) }
        : { email: form.email, password: form.password, role: form.role }
      const res = await fetch('/api/users', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to save user')
      }
      toast.success(editUser ? 'User updated!' : 'User created!')
      setDialogOpen(false)
      fetchUsers()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteUser) return
    setDeleting(true)
    try {
      const res = await fetch('/api/users', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: deleteUser.id }) })
      if (!res.ok) throw new Error('Failed to delete user')
      toast.success('User deleted!')
      setDeleteUser(null)
      fetchUsers()
    } catch {
      toast.error('Could not delete user')
    } finally {
      setDeleting(false)
    }
  }

  const filtered = users.filter(u => {
    const matchSearch = u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter
    return matchSearch && matchRole
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-8 w-8 text-indigo-600" /> User Management
          </h1>
          <p className="text-gray-500 mt-1">Manage system users and their access roles</p>
        </div>
        <Button onClick={openAdd} className="bg-indigo-600 hover:bg-indigo-700 shadow-md">
          <Plus className="h-4 w-4 mr-2" /> Add User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {['ADMIN', 'WARDEN', 'STUDENT'].map(role => (
          <Card key={role} className="border-l-4" style={{ borderLeftColor: role === 'ADMIN' ? '#ef4444' : role === 'WARDEN' ? '#3b82f6' : '#22c55e' }}>
            <CardContent className="pt-4 pb-4">
              <p className="text-2xl font-bold">{users.filter(u => u.role === role).length}</p>
              <p className="text-sm text-muted-foreground">{role}s</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>A list of all users registered in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search & filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email..."
                className="pl-9"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="WARDEN">Warden</SelectItem>
                <SelectItem value="STUDENT">Student</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {search || roleFilter !== 'ALL' ? 'No users match your search.' : 'No users found. Add your first user!'}
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(u => (
                    <TableRow key={u.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium">{u.email}</TableCell>
                      <TableCell>{roleBadge(u.role)}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEdit(u)}>
                            <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => setDeleteUser(u)}>
                            <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editUser ? 'Edit User' : 'Add New User'}</DialogTitle>
            <DialogDescription>
              {editUser ? 'Update user information below.' : 'Fill in the details to create a new user.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@pccoe.edu"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">{editUser ? 'New Password (leave blank to keep current)' : 'Password'}</Label>
              <Input
                id="password"
                type="password"
                placeholder={editUser ? 'Leave blank to keep unchanged' : 'Enter password'}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="role">Role</Label>
              <Select value={form.role} onValueChange={v => setForm(f => ({ ...f, role: v }))}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="WARDEN">Warden</SelectItem>
                  <SelectItem value="STUDENT">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700">
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editUser ? 'Save Changes' : 'Create User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteUser} onOpenChange={open => !open && setDeleteUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteUser?.email}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700 focus:ring-red-600">
              {deleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}