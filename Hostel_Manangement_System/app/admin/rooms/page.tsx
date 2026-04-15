'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Search, DoorOpen, Loader2, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface Room {
  id: string
  roomId: string
  hostelId: string
  hostel?: { hostelName: string }
  roomType: string
  capacity: number
  currentOccupants: number
  status: string
}

interface Hostel {
  id: string
  hostelName: string
}

const emptyForm = { roomId: '', hostelId: '', roomType: 'SINGLE', capacity: '1', status: 'VACANT' }

const statusBadge = (s: string) => {
  switch (s) {
    case 'VACANT':      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Vacant</Badge>
    case 'OCCUPIED':    return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Occupied</Badge>
    case 'MAINTENANCE': return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Maintenance</Badge>
    default:            return <Badge variant="secondary">{s}</Badge>
  }
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [hostels, setHostels] = useState<Hostel[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [hostelFilter, setHostelFilter] = useState('ALL')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editRoom, setEditRoom] = useState<Room | null>(null)
  const [deleteRoom, setDeleteRoom] = useState<Room | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [rRes, hRes] = await Promise.all([
        fetch('/api/rooms'),
        fetch('/api/hostels'),
      ])
      if (!rRes.ok || !hRes.ok) throw new Error('Fetch failed')
      const [rData, hData] = await Promise.all([rRes.json(), hRes.json()])
      setRooms(rData)
      setHostels(hData)
    } catch {
      toast.error('Could not load data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const openAdd = () => {
    setEditRoom(null)
    setForm({ ...emptyForm, hostelId: hostels[0]?.id || '' })
    setDialogOpen(true)
  }

  const openEdit = (r: Room) => {
    setEditRoom(r)
    setForm({ roomId: r.roomId, hostelId: r.hostelId, roomType: r.roomType, capacity: String(r.capacity), status: r.status })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.roomId || !form.hostelId || !form.capacity) return toast.error('All fields are required')
    setSaving(true)
    try {
      const payload = { ...form, capacity: Number(form.capacity) }
      const method = editRoom ? 'PATCH' : 'POST'
      const body = editRoom ? { id: editRoom.id, ...payload } : payload
      const res = await fetch('/api/rooms', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Save failed') }
      toast.success(editRoom ? 'Room updated!' : 'Room created!')
      setDialogOpen(false)
      fetchAll()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteRoom) return
    setDeleting(true)
    try {
      const res = await fetch('/api/rooms', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: deleteRoom.id }) })
      if (!res.ok) throw new Error('Delete failed')
      toast.success('Room deleted!')
      setDeleteRoom(null)
      fetchAll()
    } catch {
      toast.error('Could not delete room')
    } finally {
      setDeleting(false)
    }
  }

  const filtered = rooms.filter(r => {
    const matchSearch = r.roomId.toLowerCase().includes(search.toLowerCase()) ||
      (r.hostel?.hostelName || '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter
    const matchHostel = hostelFilter === 'ALL' || r.hostelId === hostelFilter
    return matchSearch && matchStatus && matchHostel
  })

  const counts = {
    vacant: rooms.filter(r => r.status === 'VACANT').length,
    occupied: rooms.filter(r => r.status === 'OCCUPIED').length,
    maintenance: rooms.filter(r => r.status === 'MAINTENANCE').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <DoorOpen className="h-8 w-8 text-indigo-600" /> Room Management
          </h1>
          <p className="text-gray-500 mt-1">Manage all hostel rooms and occupancy — {rooms.length} total</p>
        </div>
        <Button onClick={openAdd} className="bg-indigo-600 hover:bg-indigo-700 shadow-md" disabled={hostels.length === 0}>
          <Plus className="h-4 w-4 mr-2" /> Add Room
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Vacant', count: counts.vacant, color: 'border-l-green-500', text: 'text-green-600' },
          { label: 'Occupied', count: counts.occupied, color: 'border-l-blue-500', text: 'text-blue-600' },
          { label: 'Maintenance', count: counts.maintenance, color: 'border-l-orange-500', text: 'text-orange-600' },
        ].map(s => (
          <Card key={s.label} className={`border-l-4 ${s.color}`}>
            <CardContent className="pt-4 pb-4">
              <p className={`text-2xl font-bold ${s.text}`}>{s.count}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>All Rooms</CardTitle>
          <CardDescription>Complete list of rooms and their current status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search room ID or hostel..."
                className="pl-9"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="VACANT">Vacant</SelectItem>
                <SelectItem value="OCCUPIED">Occupied</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={hostelFilter} onValueChange={setHostelFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Hostel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Hostels</SelectItem>
                {hostels.map(h => (
                  <SelectItem key={h.id} value={h.id}>{h.hostelName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {search || statusFilter !== 'ALL' || hostelFilter !== 'ALL'
                ? 'No rooms match your filters.'
                : hostels.length === 0
                ? 'Please add a hostel first, then add rooms.'
                : 'No rooms yet. Click "Add Room" to get started.'}
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead>Room ID</TableHead>
                    <TableHead>Hostel</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Occupants</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(r => (
                    <TableRow key={r.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-semibold">{r.roomId}</TableCell>
                      <TableCell>{r.hostel?.hostelName || '—'}</TableCell>
                      <TableCell>{r.roomType}</TableCell>
                      <TableCell>{r.capacity}</TableCell>
                      <TableCell>
                        <span className={r.currentOccupants >= r.capacity ? 'text-red-600 font-medium' : ''}>
                          {r.currentOccupants}
                        </span>
                      </TableCell>
                      <TableCell>{statusBadge(r.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEdit(r)}>
                            <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => setDeleteRoom(r)}>
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
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editRoom ? 'Edit Room' : 'Add New Room'}</DialogTitle>
            <DialogDescription>
              {editRoom ? 'Update the room details below.' : 'Fill in the details to add a new room.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Room ID</Label>
                <Input
                  placeholder="e.g. A-101"
                  value={form.roomId}
                  onChange={e => setForm(f => ({ ...f, roomId: e.target.value }))}
                  disabled={!!editRoom}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Hostel</Label>
                <Select value={form.hostelId} onValueChange={v => setForm(f => ({ ...f, hostelId: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select hostel" />
                  </SelectTrigger>
                  <SelectContent>
                    {hostels.map(h => <SelectItem key={h.id} value={h.id}>{h.hostelName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Room Type</Label>
                <Select value={form.roomType} onValueChange={v => setForm(f => ({ ...f, roomType: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SINGLE">Single</SelectItem>
                    <SelectItem value="DOUBLE">Double</SelectItem>
                    <SelectItem value="TRIPLE">Triple</SelectItem>
                    <SelectItem value="DORMITORY">Dormitory</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Capacity</Label>
                <Input
                  type="number"
                  placeholder="e.g. 2"
                  min="1"
                  value={form.capacity}
                  onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))}
                />
              </div>
            </div>
            {editRoom && (
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VACANT">Vacant</SelectItem>
                    <SelectItem value="OCCUPIED">Occupied</SelectItem>
                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700">
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editRoom ? 'Save Changes' : 'Create Room'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteRoom} onOpenChange={open => !open && setDeleteRoom(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Room</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete room <strong>{deleteRoom?.roomId}</strong>? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700">
              {deleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
