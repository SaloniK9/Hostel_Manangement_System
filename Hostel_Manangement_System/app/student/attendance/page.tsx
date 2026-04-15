'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Calendar, Loader2, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'

export default function StudentAttendancePage() {
  const [profile, setProfile] = useState<any>(null)
  const [attendance, setAttendance] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/me')
      .then(r => r.json())
      .then(data => {
        setProfile(data)
        if (data?.student?.id) {
          return fetch(`/api/attendance?studentId=${data.student.id}`)
            .then(r => r.json())
            .then(a => setAttendance(a))
        }
      })
      .catch(() => toast.error('Could not load attendance records'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const present = attendance.filter(a => a.status === 'PRESENT').length
  const absent = attendance.filter(a => a.status === 'ABSENT').length
  const late = attendance.filter(a => a.status === 'LATE').length
  const total = attendance.length
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      PRESENT: 'bg-green-100 text-green-800',
      ABSENT: 'bg-red-100 text-red-800',
      LATE: 'bg-orange-100 text-orange-800',
      LEAVE: 'bg-blue-100 text-blue-800',
    }
    return <span className={`text-xs px-2 py-1 rounded-full font-medium ${map[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Attendance</h1>
        <p className="text-gray-600 mt-2">Track your hostel attendance records</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{percentage}%</div>
            <p className="text-sm text-muted-foreground">Attendance Rate</p>
            <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${percentage >= 75 ? 'bg-green-500' : percentage >= 50 ? 'bg-orange-500' : 'bg-red-500'}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{present}</div>
            <p className="text-sm text-muted-foreground">Days Present</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{absent}</div>
            <p className="text-sm text-muted-foreground">Days Absent</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">{late}</div>
            <p className="text-sm text-muted-foreground">Late Arrivals</p>
          </CardContent>
        </Card>
      </div>

      {percentage < 75 && total > 0 && (
        <Card className="border border-red-200 bg-red-50">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-900">Low Attendance Warning</p>
                <p className="text-xs text-red-700">Your attendance is below 75%. Please improve your attendance to avoid consequences.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Attendance History
          </CardTitle>
          <CardDescription>Your daily attendance records — {total} total entries</CardDescription>
        </CardHeader>
        <CardContent>
          {attendance.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No attendance records found yet.</p>
              <p className="text-sm text-muted-foreground mt-1">Records will appear once your warden marks daily attendance.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      {new Date(record.attendanceDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </TableCell>
                    <TableCell>
                      {new Date(record.attendanceDate).toLocaleDateString('en-IN', { weekday: 'long' })}
                    </TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{record.remarks || '—'}</TableCell>
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
