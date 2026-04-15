'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function WardenAttendancePage() {
  const [students, setStudents] = useState<any[]>([])
  const [attendance, setAttendance] = useState<any[]>([])
  const [todayStatus, setTodayStatus] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    Promise.all([
      fetch('/api/students').then(r => r.json()),
      fetch(`/api/attendance?date=${today}`).then(r => r.json()),
    ]).then(([s, a]) => {
      setStudents(s)
      setAttendance(a)
      // Pre-fill today's recorded attendance
      const map: Record<string, string> = {}
      a.forEach((rec: any) => { map[rec.studentId] = rec.status })
      setTodayStatus(map)
    }).catch(() => toast.error('Failed to load attendance data'))
      .finally(() => setLoading(false))
  }, [])

  const markAll = (status: string) => {
    const map: Record<string, string> = {}
    students.forEach(s => { map[s.id] = status })
    setTodayStatus(map)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const entries = students.map(s => ({
        studentId: s.id,
        attendanceDate: new Date(today).toISOString(),
        status: todayStatus[s.id] || 'ABSENT',
      }))
      await Promise.all(entries.map(e =>
        fetch('/api/attendance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(e),
        })
      ))
      toast.success('Attendance saved successfully!')
    } catch {
      toast.error('Failed to save attendance')
    } finally {
      setSaving(false)
    }
  }

  const presentCount = Object.values(todayStatus).filter(s => s === 'PRESENT').length
  const absentCount = Object.values(todayStatus).filter(s => s === 'ABSENT').length

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600 mt-2">Mark and track daily student attendance — {new Date(today).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => markAll('PRESENT')} className="text-green-600 border-green-600 hover:bg-green-50">
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark All Present
          </Button>
          <Button variant="outline" onClick={() => markAll('ABSENT')} className="text-red-600 border-red-600 hover:bg-red-50">
            <XCircle className="h-4 w-4 mr-2" />
            Mark All Absent
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900">{students.length}</div>
            <p className="text-sm text-muted-foreground">Total Students</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{presentCount}</div>
            <p className="text-sm text-muted-foreground">Present Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{absentCount}</div>
            <p className="text-sm text-muted-foreground">Absent Today</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today&apos;s Attendance Sheet
              </CardTitle>
              <CardDescription>Mark present/absent for each student</CardDescription>
            </div>
            <Button onClick={handleSave} disabled={saving || students.length === 0} className="bg-blue-600 hover:bg-blue-700">
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Save Attendance
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No students registered yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.studentId}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.department}</TableCell>
                    <TableCell>{student.room?.roomId || '—'}</TableCell>
                    <TableCell>
                      <Select
                        value={todayStatus[student.id] || 'ABSENT'}
                        onValueChange={v => setTodayStatus(prev => ({ ...prev, [student.id]: v }))}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PRESENT">
                            <span className="text-green-600 font-medium">Present</span>
                          </SelectItem>
                          <SelectItem value="ABSENT">
                            <span className="text-red-600 font-medium">Absent</span>
                          </SelectItem>
                          <SelectItem value="LATE">
                            <span className="text-orange-600 font-medium">Late</span>
                          </SelectItem>
                          <SelectItem value="LEAVE">
                            <span className="text-blue-600 font-medium">On Leave</span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
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
