'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Plus, Search, MapPin, Phone, Loader2, Building2, Pencil, Trash2, Users } from 'lucide-react'
import { toast } from 'sonner'

interface Hostel {
  id: string
  hostelName: string
  location: string
  capacity: number
  wardenName: string
  contact: string
  _count?: { rooms: number; students: number }
}

const emptyForm = { hostelName: '', location: '', capacity: '', wardenName: '', contact: '' }

export default function HostelsPage() {
  const [hostels, setHostels] = useState<Hostel[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editHostel, setEditHostel] = useState<Hostel | null>(null)
  const [deleteHostel, setDeleteHostel] = useState<Hostel | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => { fetchHostels() }, [])

  const fetchHostels = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/hostels')
      if (!res.ok) throw new Error('Failed to fetch')
      setHostels(await res.json())
    } catch {
      toast.error('Could not load hostels')
    } finally {
      setLoading(false)
    }
  }

  const openAdd = () => {
    setEditHostel(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEdit = (h: Hostel) => {
    setEditHostel(h)
    setForm({ hostelName: h.hostelName, location: h.location, capacity: String(h.capacity), wardenName: h.wardenName, contact: h.contact })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.hostelName || !form.location || !form.capacity || !form.wardenName || !form.contact) {
      return toast.error('All fields are required')
    }
    setSaving(true)
    try {
      const payload = { ...form, capacity: Number(form.capacity) }
      const method = editHostel ? 'PATCH' : 'POST'
      const body = editHostel ? { id: editHostel.id, ...payload } : payload
      const res = await fetch('/api/hostels', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Save failed')
      }
      toast.success(editHostel ? 'Hostel updated!' : 'Hostel created!')
      setDialogOpen(false)
      fetchHostels()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteHostel) return
    setDeleting(true)
    try {
      const res = await fetch('/api/hostels', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: deleteHostel.id }) })
      if (!res.ok) throw new Error('Delete failed')
      toast.success('Hostel deleted!')
      setDeleteHostel(null)
      fetchHostels()
    } catch {
      toast.error('Could not delete hostel')
    } finally {
      setDeleting(false)
    }
  }

  const filtered = hostels.filter(h =>
    h.hostelName.toLowerCase().includes(search.toLowerCase()) ||
    h.location.toLowerCase().includes(search.toLowerCase()) ||
    h.wardenName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="h-8 w-8 text-indigo-600" /> Hostel Management
          </h1>
          <p className="text-gray-500 mt-1">Manage all hostel facilities — {hostels.length} total</p>
        </div>
        <Button onClick={openAdd} className="bg-indigo-600 hover:bg-indigo-700 shadow-md">
          <Plus className="h-4 w-4 mr-2" /> Add Hostel
        </Button>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search hostels..."
          className="pl-9"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-16 text-center">
          <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-muted-foreground">
            {search ? 'No hostels match your search.' : 'No hostels yet. Click "Add Hostel" to get started.'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(hostel => (
            <Card key={hostel.id} className="group hover:shadow-lg transition-shadow duration-200 border border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{hostel.hostelName}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" /> {hostel.location}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Capacity</span>
                    <span className="font-medium">{hostel.capacity} students</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Warden</span>
                    <span className="font-medium">{hostel.wardenName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contact</span>
                    <span className="font-medium flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {hostel.contact}
                    </span>
                  </div>
                  <div className="pt-3 mt-2 border-t border-gray-100 flex justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {hostel._count?.rooms ?? 0} Rooms</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {hostel._count?.students ?? 0} Students</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(hostel)}>
                    <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" className="flex-1" onClick={() => setDeleteHostel(hostel)}>
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editHostel ? 'Edit Hostel' : 'Add New Hostel'}</DialogTitle>
            <DialogDescription>
              {editHostel ? 'Update the hostel details below.' : 'Fill in the details to register a new hostel.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Hostel Name</Label>
                <Input placeholder="e.g. Boys Hostel A" value={form.hostelName} onChange={e => setForm(f => ({ ...f, hostelName: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Location</Label>
                <Input placeholder="e.g. North Campus" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Capacity</Label>
                <Input type="number" placeholder="e.g. 200" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Contact Number</Label>
                <Input placeholder="e.g. 9876543210" value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Warden Name</Label>
              <Input placeholder="e.g. Prof. R. Sharma" value={form.wardenName} onChange={e => setForm(f => ({ ...f, wardenName: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700">
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editHostel ? 'Save Changes' : 'Create Hostel'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteHostel} onOpenChange={open => !open && setDeleteHostel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Hostel</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteHostel?.hostelName}</strong>? All associated rooms and data may be affected.
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