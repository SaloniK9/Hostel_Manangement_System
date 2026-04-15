'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Plus, Search, Loader2, Users, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface Student {
  id: string
  studentId: string
  name: string
  email: string
  phone: string
  department: string
  academicYear: number
  status: string
  hostel?: { hostelName: string }
  room?: { roomId: string }
}

interface Hostel { id: string; hostelName: string }
interface Room { id: string; roomId: string; hostelId: string }

const DEPARTMENTS = ['Computer Engineering', 'Information Technology', 'Mechanical Engineering', 'Civil Engineering', 'Electronics Engineering', 'Other']

const emptyForm = {
  name: '', email: '', phone: '', department: 'Computer Engineering',
  academicYear: '1', hostelId: '', roomId: '', userEmail: '', userPassword: '',
}

export default function WardenStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [hostels, setHostels] = useState<Hostel[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editStudent, setEditStudent] = useState<Student | null>(null)
  const [deleteStudent, setDeleteStudent] = useState<Student | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [sRes, hRes, rRes] = await Promise.all([
        fetch('/api/students'),
        fetch('/api/hostels'),
        fetch('/api/rooms'),
      ])
      const [sData, hData, rData] = await Promise.all([sRes.json(), hRes.json(), rRes.json()])
      setStudents(Array.isArray(sData) ? sData : [])
      setHostels(Array.isArray(hData) ? hData : [])
      setRooms(Array.isArray(rData) ? rData : [])
    } catch {
      toast.error('Could not load data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const availableRooms = rooms.filter(r => !form.hostelId || r.hostelId === form.hostelId)

  const openAdd = () => {
    setEditStudent(null)
    setForm({ ...emptyForm, hostelId: hostels[0]?.id || '', roomId: '' })
    setDialogOpen(true)
  }

  const openEdit = (s: Student) => {
    setEditStudent(s)
    const hostel = hostels.find(h => h.hostelName === s.hostel?.hostelName)
    const room = rooms.find(r => r.roomId === s.room?.roomId)
    setForm({
      name: s.name, email: s.email, phone: s.phone,
      department: s.department, academicYear: String(s.academicYear),
      hostelId: hostel?.id || '', roomId: room?.id || '',
      userEmail: '', userPassword: '',
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.email || !form.phone || !form.department) {
      return toast.error('Name, email, phone and department are required')
    }
    if (!editStudent && (!form.userEmail || !form.userPassword)) {
      return toast.error('Login email and password are required for new students')
    }
    setSaving(true)
    try {
      let res: Response
      if (editStudent) {
        const payload = {
          id: editStudent.id,
          name: form.name, email: form.email, phone: form.phone,
          department: form.department, academicYear: Number(form.academicYear),
          ...(form.hostelId ? { hostelId: form.hostelId } : {}),
          ...(form.roomId ? { roomId: form.roomId } : {}),
        }
        res = await fetch('/api/students', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      } else {
        const payload = {
          studentData: {
            name: form.name, email: form.email, phone: form.phone,
            department: form.department, academicYear: Number(form.academicYear),
            ...(form.hostelId ? { hostelId: form.hostelId } : {}),
            ...(form.roomId ? { roomId: form.roomId } : {}),
          },
          userData: { email: form.userEmail, password: form.userPassword },
        }
        res = await fetch('/api/students', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      }
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Save failed') }
      toast.success(editStudent ? 'Student updated!' : 'Student registered!')
      setDialogOpen(false)
      fetchAll()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteStudent) return
    setDeleting(true)
    try {
      const res = await fetch('/api/students', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: deleteStudent.id }) })
      if (!res.ok) throw new Error('Delete failed')
      toast.success('Student removed!')
      setDeleteStudent(null)
      fetchAll()
    } catch {
      toast.error('Could not delete student')
    } finally {
      setDeleting(false)
    }
  }

  const filtered = students.filter(s => {
    const q = search.toLowerCase()
    const matchSearch = s.name.toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q) || s.department.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
    const matchStatus = statusFilter === 'ALL' || s.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-8 w-8 text-teal-600" /> Student Management
          </h1>
          <p className="text-gray-500 mt-1">View and manage all registered students — {students.length} total</p>
        </div>
        <Button onClick={openAdd} className="bg-teal-600 hover:bg-teal-700 shadow-md">
          <Plus className="h-4 w-4 mr-2" /> Register Student
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active', count: students.filter(s => s.status === 'ACTIVE').length, color: 'border-l-green-500', text: 'text-green-600' },
          { label: 'Inactive', count: students.filter(s => s.status !== 'ACTIVE').length, color: 'border-l-gray-400', text: 'text-gray-600' },
          { label: 'Total', count: students.length, color: 'border-l-teal-500', text: 'text-teal-600' },
        ].map(s => (
          <Card key={s.label} className={`border-l-4 ${s.color}`}>
            <CardContent className="pt-4 pb-4">
              <p className={`text-2xl font-bold ${s.text}`}>{s.count}</p>
              <p className="text-sm text-muted-foreground">{s.label} Students</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
          <CardDescription>Complete student roster with room and hostel assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, ID, email or department..."
                className="pl-9"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {search || statusFilter !== 'ALL' ? 'No students match your search.' : 'No students registered yet.'}
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Hostel</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(s => (
                    <TableRow key={s.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-mono text-sm">{s.studentId}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{s.department}</TableCell>
                      <TableCell>Year {s.academicYear}</TableCell>
                      <TableCell>{s.hostel?.hostelName || <span className="text-muted-foreground text-xs">Unassigned</span>}</TableCell>
                      <TableCell>{s.room?.roomId || <span className="text-muted-foreground text-xs">Unassigned</span>}</TableCell>
                      <TableCell>
                        <Badge className={s.status === 'ACTIVE' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-600 hover:bg-gray-100'}>
                          {s.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEdit(s)}>
                            <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => setDeleteStudent(s)}>
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
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editStudent ? 'Edit Student' : 'Register New Student'}</DialogTitle>
            <DialogDescription>
              {editStudent ? 'Update student information below.' : 'Fill in the details to register a new student.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Full Name *</Label>
                <Input placeholder="e.g. Rahul Sharma" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Personal Email *</Label>
                <Input type="email" placeholder="personal@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Phone *</Label>
                <Input placeholder="9876543210" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Academic Year *</Label>
                <Select value={form.academicYear} onValueChange={v => setForm(f => ({ ...f, academicYear: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4].map(y => <SelectItem key={y} value={String(y)}>Year {y}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Department *</Label>
              <Select value={form.department} onValueChange={v => setForm(f => ({ ...f, department: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Hostel Assignment</Label>
                <Select value={form.hostelId} onValueChange={v => setForm(f => ({ ...f, hostelId: v, roomId: '' }))}>
                  <SelectTrigger><SelectValue placeholder="Select hostel" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {hostels.map(h => <SelectItem key={h.id} value={h.id}>{h.hostelName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Room Assignment</Label>
                <Select value={form.roomId} onValueChange={v => setForm(f => ({ ...f, roomId: v }))} disabled={!form.hostelId}>
                  <SelectTrigger><SelectValue placeholder="Select room" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {availableRooms.map(r => <SelectItem key={r.id} value={r.id}>{r.roomId}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {!editStudent && (
              <div className="border-t pt-4 space-y-3">
                <p className="text-sm font-medium text-gray-700">Login Credentials (for student portal access)</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Login Email *</Label>
                    <Input type="email" placeholder="student@pccoe.edu" value={form.userEmail} onChange={e => setForm(f => ({ ...f, userEmail: e.target.value }))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Password *</Label>
                    <Input type="password" placeholder="Min 6 characters" value={form.userPassword} onChange={e => setForm(f => ({ ...f, userPassword: e.target.value }))} />
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-teal-600 hover:bg-teal-700">
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editStudent ? 'Save Changes' : 'Register Student'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteStudent} onOpenChange={open => !open && setDeleteStudent(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{deleteStudent?.name}</strong> ({deleteStudent?.studentId})? Their login account will also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700">
              {deleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Remove Student
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
