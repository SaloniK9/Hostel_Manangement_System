'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, DoorOpen, Calendar, MessageSquare, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function WardenDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeAllocations: 0,
    presentRate: '0%',
    pendingComplaints: 0
  })
  const [recentLeaves, setRecentLeaves] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [studentsRes, leavesRes, complaintsRes] = await Promise.all([
        fetch('/api/students'),
        fetch('/api/leaves'),
        fetch('/api/complaints')
      ])

      const students = await studentsRes.json()
      const leaves = await leavesRes.json()
      const complaints = await complaintsRes.json()

      setStats({
        totalStudents: students.length || 0,
        activeAllocations: students.filter((s: any) => s.status === 'ACTIVE').length || 0,
        presentRate: '100%', // Placeholder for now
        pendingComplaints: complaints.filter((c: any) => c.status === 'OPEN').length || 0
      })

      setRecentLeaves(leaves.slice(0, 3) || [])
    } catch (error) {
      toast.error('Could not load dashboard data')
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
        <h1 className="text-3xl font-bold text-gray-900">Warden Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to PCCOE Hostel Management System - Warden Portal</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">In hostel</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Room Allocations</CardTitle>
            <DoorOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeAllocations}</div>
            <p className="text-xs text-muted-foreground">Active allocations</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.presentRate}</div>
            <p className="text-xs text-muted-foreground">Present rate</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Complaints</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingComplaints}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Leave Requests</CardTitle>
            <CardDescription>Pending approvals for student leaves</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLeaves.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent leave requests.</p>
              ) : (
                recentLeaves.map((leave: any) => (
                  <div key={leave.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{leave.student?.name}</p>
                      <p className="text-xs text-muted-foreground">{leave.reason} - {new Date(leave.startDate).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      leave.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                      leave.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {leave.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Room Occupancy</CardTitle>
            <CardDescription>Current hostel room status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">General Occupancy</span>
                <span className="text-sm font-medium">Monitoring...</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground italic">Hostel-specific occupancy metrics will populate once more data is available.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}