'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ClipboardList, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function WardenLeavesPage() {
  const [leaves, setLeaves] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchLeaves()
  }, [])

  const fetchLeaves = async () => {
    try {
      const res = await fetch('/api/leaves')
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setLeaves(data)
    } catch {
      toast.error('Could not load leave requests')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (id: string, status: string) => {
    setUpdating(id)
    try {
      const res = await fetch('/api/leaves', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, approvedBy: 'Warden' }),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success(`Leave request ${status.toLowerCase()}`)
      setLeaves(prev => prev.map(l => l.id === id ? { ...l, status } : l))
    } catch {
      toast.error('Failed to update leave request')
    } finally {
      setUpdating(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'APPROVED': return <Badge variant="default" className="bg-green-600">Approved</Badge>
      case 'REJECTED': return <Badge variant="destructive">Rejected</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  const pending = leaves.filter(l => l.status === 'PENDING')
  const approved = leaves.filter(l => l.status === 'APPROVED')

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
        <h1 className="text-3xl font-bold text-gray-900">Leave Requests</h1>
        <p className="text-gray-600 mt-2">Review and approve student leave applications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">{pending.length}</div>
            <p className="text-sm text-muted-foreground">Pending Approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{approved.length}</div>
            <p className="text-sm text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900">{leaves.length}</div>
            <p className="text-sm text-muted-foreground">Total Requests</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            All Leave Requests
          </CardTitle>
          <CardDescription>Manage student leave applications — approve or reject</CardDescription>
        </CardHeader>
        <CardContent>
          {leaves.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No leave requests submitted yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaves.map((leave) => (
                  <TableRow key={leave.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{leave.student?.name || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground">{leave.student?.studentId}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{leave.reason}</TableCell>
                    <TableCell>{new Date(leave.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(leave.endDate).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(leave.status)}</TableCell>
                    <TableCell>
                      {leave.status === 'PENDING' ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="h-7 text-xs bg-green-600 hover:bg-green-700"
                            onClick={() => handleUpdate(leave.id, 'APPROVED')}
                            disabled={updating === leave.id}
                          >
                            {updating === leave.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3 mr-1" />}
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-7 text-xs"
                            onClick={() => handleUpdate(leave.id, 'REJECTED')}
                            disabled={updating === leave.id}
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Reviewed</span>
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
