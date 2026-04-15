'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Plus, Loader2, Send } from 'lucide-react'
import { toast } from 'sonner'

const CATEGORIES = ['MAINTENANCE', 'FOOD', 'SECURITY', 'FACILITIES', 'OTHER']

export default function StudentComplaintsPage() {
  const [profile, setProfile] = useState<any>(null)
  const [complaints, setComplaints] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', category: 'MAINTENANCE' })

  useEffect(() => {
    fetch('/api/me')
      .then(r => r.json())
      .then(data => {
        setProfile(data)
        if (data?.student?.id) {
          return fetch(`/api/complaints?studentId=${data.student.id}`)
            .then(r => r.json())
            .then(c => setComplaints(c))
        }
      })
      .catch(() => toast.error('Could not load complaints'))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile?.student?.id) return toast.error('Student profile not found')
    if (!form.title.trim() || !form.description.trim()) return toast.error('Please fill all fields')

    setSubmitting(true)
    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          category: form.category,
          student: { connect: { id: profile.student.id } },
        }),
      })
      if (!res.ok) throw new Error('Failed')
      const newComplaint = await res.json()
      setComplaints(prev => [newComplaint, ...prev])
      setForm({ title: '', description: '', category: 'MAINTENANCE' })
      setShowForm(false)
      toast.success('Complaint submitted successfully!')
    } catch {
      toast.error('Failed to submit complaint')
    } finally {
      setSubmitting(false)
    }
  }

  const getCategoryColor = (category: string) => {
    const map: Record<string, string> = {
      MAINTENANCE: 'bg-orange-100 text-orange-800',
      FOOD: 'bg-yellow-100 text-yellow-800',
      SECURITY: 'bg-red-100 text-red-800',
      FACILITIES: 'bg-blue-100 text-blue-800',
      OTHER: 'bg-gray-100 text-gray-800',
    }
    return map[category?.toUpperCase()] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const open = complaints.filter(c => c.status === 'OPEN').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Complaints</h1>
          <p className="text-gray-600 mt-2">Submit issues and track resolution status</p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Complaint
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{open}</div>
            <p className="text-sm text-muted-foreground">Open Issues</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{complaints.filter(c => c.status === 'RESOLVED').length}</div>
            <p className="text-sm text-muted-foreground">Resolved</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{complaints.length}</div>
            <p className="text-sm text-muted-foreground">Total Submitted</p>
          </CardContent>
        </Card>
      </div>

      {/* New Complaint Form */}
      {showForm && (
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Send className="h-5 w-5" />
              Submit New Complaint
            </CardTitle>
            <CardDescription>Describe your issue clearly so the warden can address it promptly</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Issue Title *</Label>
                  <Input
                    id="title"
                    placeholder="Brief title of the issue"
                    value={form.title}
                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the issue in detail..."
                  rows={4}
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  required
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700">
                  {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                  Submit Complaint
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Complaints Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            My Complaint History
          </CardTitle>
          <CardDescription>All complaints you&apos;ve submitted and their current status</CardDescription>
        </CardHeader>
        <CardContent>
          {complaints.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No complaints submitted yet.</p>
              <p className="text-sm text-muted-foreground mt-1">Click &quot;New Complaint&quot; to report an issue.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Resolution</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complaints.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{c.title}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{c.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(c.category)}`}>
                        {c.category}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(c.createdAt).toLocaleDateString('en-IN')}</TableCell>
                    <TableCell>
                      <Badge variant={c.status === 'OPEN' ? 'destructive' : c.status === 'RESOLVED' ? 'default' : 'secondary'}
                             className={c.status === 'RESOLVED' ? 'bg-green-600' : ''}>
                        {c.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[180px]">
                      {c.resolution || (c.status === 'OPEN' ? 'Awaiting review' : '—')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
