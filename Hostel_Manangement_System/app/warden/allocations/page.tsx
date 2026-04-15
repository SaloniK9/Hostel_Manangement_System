'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DoorOpen, Loader2, Plus } from 'lucide-react'
import { toast } from 'sonner'

export default function AllocationsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [allocating, setAllocating] = useState<string | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<Record<string, string>>({})

  useEffect(() => {
    Promise.all([
      fetch('/api/students').then(r => r.json()),
      fetch('/api/rooms').then(r => r.json()),
    ]).then(([s, r]) => {
      setStudents(s)
      setRooms(r)
    }).catch(() => toast.error('Failed to load allocation data'))
      .finally(() => setLoading(false))
  }, [])

  const handleAllocate = async (studentId: string) => {
    const roomId = selectedRoom[studentId]
    if (!roomId) return toast.error('Please select a room first')
    setAllocating(studentId)
    try {
      const room = rooms.find(r => r.id === roomId)
      const hostelId = room?.hostelId
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, roomId, hostelId, status: 'ACTIVE' })
      })
      if (!res.ok) throw new Error('Failed')
      toast.success('Room allocated successfully')
      // Refresh
      const updated = await fetch('/api/students').then(r => r.json())
      setStudents(updated)
    } catch {
      toast.error('Failed to allocate room')
    } finally {
      setAllocating(null)
    }
  }

  const vacantRooms = rooms.filter(r => r.status === 'VACANT' || r.currentOccupants < r.capacity)

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
        <h1 className="text-3xl font-bold text-gray-900">Room Allocations</h1>
        <p className="text-gray-600 mt-2">Assign students to rooms and manage housing placements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{students.filter(s => s.roomId).length}</div>
            <p className="text-sm text-muted-foreground">Students Allocated</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">{students.filter(s => !s.roomId).length}</div>
            <p className="text-sm text-muted-foreground">Pending Allocation</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{vacantRooms.length}</div>
            <p className="text-sm text-muted-foreground">Available Rooms</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DoorOpen className="h-5 w-5" />
            Student Room Assignments
          </CardTitle>
          <CardDescription>View current allocations and assign rooms to unallocated students</CardDescription>
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
                  <TableHead>Current Room</TableHead>
                  <TableHead>Hostel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.studentId}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>
                      {student.room?.roomId
                        ? <Badge variant="default">{student.room.roomId}</Badge>
                        : <span className="text-muted-foreground text-sm">Unallocated</span>}
                    </TableCell>
                    <TableCell>{student.hostel?.hostelName || '—'}</TableCell>
                    <TableCell>
                      <Badge variant={student.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {!student.roomId ? (
                        <div className="flex items-center gap-2">
                          <Select
                            value={selectedRoom[student.id] || ''}
                            onValueChange={v => setSelectedRoom(prev => ({ ...prev, [student.id]: v }))}
                          >
                            <SelectTrigger className="w-32 h-8 text-xs">
                              <SelectValue placeholder="Select room" />
                            </SelectTrigger>
                            <SelectContent>
                              {vacantRooms.map(r => (
                                <SelectItem key={r.id} value={r.id}>
                                  {r.roomId} ({r.roomType})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            size="sm"
                            className="h-8 text-xs bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleAllocate(student.id)}
                            disabled={allocating === student.id || !selectedRoom[student.id]}
                          >
                            {allocating === student.id ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Assign'}
                          </Button>
                        </div>
                      ) : (
                        <Button variant="outline" size="sm" className="h-8 text-xs">Transfer</Button>
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
