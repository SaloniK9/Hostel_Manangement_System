'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Loader2, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function WardenComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [resolving, setResolving] = useState<string | null>(null)

  useEffect(() => {
    fetchComplaints()
  }, [])

  const fetchComplaints = async () => {
    try {
      const res = await fetch('/api/complaints')
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setComplaints(data)
    } catch {
      toast.error('Could not load complaints')
    } finally {
      setLoading(false)
    }
  }

  const handleResolve = async (id: string) => {
    setResolving(id)
    try {
      const res = await fetch('/api/complaints', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'RESOLVED', resolution: 'Issue reviewed and resolved by warden.' }),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success('Complaint marked as resolved')
      setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: 'RESOLVED', resolution: 'Issue reviewed and resolved by warden.' } : c))
    } catch {
      toast.error('Failed to resolve complaint')
    } finally {
      setResolving(null)
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

  const open = complaints.filter(c => c.status === 'OPEN')
  const resolved = complaints.filter(c => c.status === 'RESOLVED')

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Complaint Management</h1>
        <p className="text-gray-600 mt-2">Track and resolve student-submitted complaints</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{open.length}</div>
            <p className="text-sm text-muted-foreground">Open Complaints</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{resolved.length}</div>
            <p className="text-sm text-muted-foreground">Resolved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900">{complaints.length}</div>
            <p className="text-sm text-muted-foreground">Total Complaints</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            All Complaints
          </CardTitle>
          <CardDescription>Student issues requiring warden attention</CardDescription>
        </CardHeader>
        <CardContent>
          {complaints.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No complaints filed yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complaints.map((complaint) => (
                  <TableRow key={complaint.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{complaint.student?.name || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground">{complaint.student?.studentId}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{complaint.title}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{complaint.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(complaint.category)}`}>
                        {complaint.category}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(complaint.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={complaint.status === 'OPEN' ? 'destructive' : complaint.status === 'RESOLVED' ? 'default' : 'secondary'}>
                        {complaint.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {complaint.status === 'OPEN' ? (
                        <Button
                          size="sm"
                          className="h-7 text-xs bg-green-600 hover:bg-green-700"
                          onClick={() => handleResolve(complaint.id)}
                          disabled={resolving === complaint.id}
                        >
                          {resolving === complaint.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3 mr-1" />}
                          Resolve
                        </Button>
                      ) : (
                        complaint.resolution ?
                          <p className="text-xs text-muted-foreground max-w-[120px] truncate" title={complaint.resolution}>{complaint.resolution}</p>
                          : <span className="text-xs text-muted-foreground">Closed</span>
                      )}
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
