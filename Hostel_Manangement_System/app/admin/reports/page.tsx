'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { BarChart2, TrendingUp, Users, DoorOpen, Loader2, FileText } from 'lucide-react'
import { toast } from 'sonner'

export default function ReportsPage() {
  const [stats, setStats] = useState({ students: 0, rooms: 0, hostels: 0, payments: 0 })
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReportData()
  }, [])

  const fetchReportData = async () => {
    try {
      const [studentsRes, roomsRes, hostelsRes, paymentsRes] = await Promise.all([
        fetch('/api/students'),
        fetch('/api/rooms'),
        fetch('/api/hostels'),
        fetch('/api/payments'),
      ])
      const students = await studentsRes.json()
      const rooms = await roomsRes.json()
      const hostels = await hostelsRes.json()
      const paymentsData = await paymentsRes.json()

      setStats({
        students: students.length || 0,
        rooms: rooms.length || 0,
        hostels: hostels.length || 0,
        payments: paymentsData.length || 0,
      })
      setPayments(paymentsData.slice(0, 10))
    } catch (error) {
      toast.error('Could not load report data')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

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
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-2">System-wide overview and operational statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.students}</div>
            <p className="text-xs text-muted-foreground">Registered in system</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
            <DoorOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rooms}</div>
            <p className="text-xs text-muted-foreground">Across all hostels</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hostels</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.hostels}</div>
            <p className="text-xs text-muted-foreground">Active facilities</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.payments}</div>
            <p className="text-xs text-muted-foreground">Payment records</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Payment Records
          </CardTitle>
          <CardDescription>Latest fee payment transactions across all students</CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No payment records found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.student?.name || 'N/A'}</TableCell>
                    <TableCell>{p.student?.studentId || 'N/A'}</TableCell>
                    <TableCell>₹{Number(p.amount).toLocaleString()}</TableCell>
                    <TableCell>{p.paymentType}</TableCell>
                    <TableCell>{new Date(p.paymentDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={p.status === 'PAID' ? 'default' : p.status === 'PENDING' ? 'secondary' : 'destructive'}>
                        {p.status}
                      </Badge>
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
