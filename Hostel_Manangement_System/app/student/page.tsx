'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, CreditCard, Calendar, MessageSquare, MapPin, Phone, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function StudentDashboard() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/me')
      if (!response.ok) throw new Error('Failed to fetch profile')
      const data = await response.json()
      setProfile(data)
    } catch (error) {
      toast.error('Could not load student profile')
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

  const student = profile?.student

  if (!student) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">No student profile found for this user.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {student.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Room Number</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{student.room?.roomId || 'Unallocated'}</div>
            <p className="text-xs text-muted-foreground">{student.hostel?.hostelName || 'No Hostel Assigned'}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fee Status</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${student.payments?.[0]?.status === 'PAID' ? 'text-green-600' : 'text-orange-600'}`}>
              {student.payments?.[0]?.status || 'No Record'}
            </div>
            <p className="text-xs text-muted-foreground">Latest Transaction</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{student.attendances?.[0]?.status || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">Last Recorded</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Complaints</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{student.complaints?.filter((c: any) => c.status === 'OPEN').length || 0}</div>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Room Details</CardTitle>
            <CardDescription>Your current accommodation information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Hostel</span>
                <span className="text-sm font-medium">{student.hostel?.hostelName || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Room ID</span>
                <span className="text-sm font-medium">{student.room?.roomId || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Department</span>
                <span className="text-sm font-medium">{student.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Academic Year</span>
                <span className="text-sm font-medium">Year {student.academicYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Warden</span>
                <span className="text-sm font-medium">{student.hostel?.wardenName || 'Not Assigned'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest hostel activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {student.complaints?.length === 0 && student.leaveRequests?.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent activity found.</p>
              ) : (
                <>
                  {student.complaints?.slice(0, 2).map((c: any) => (
                    <div key={c.id} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Complaint: {c.status}</p>
                        <p className="text-xs text-muted-foreground">{c.title}</p>
                        <p className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                  {student.leaveRequests?.slice(0, 1).map((l: any) => (
                    <div key={l.id} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Leave Request: {l.status}</p>
                        <p className="text-xs text-muted-foreground">{l.reason}</p>
                        <p className="text-xs text-muted-foreground">{new Date(l.startDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Important Notices</CardTitle>
          <CardDescription>Latest announcements from hostel administration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p className="text-sm font-medium text-blue-900">Hostel Maintenance Schedule</p>
              <p className="text-xs text-blue-700">Electrical maintenance scheduled for 20th April, 2-4 PM</p>
            </div>
            <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded">
              <p className="text-sm font-medium text-green-900">Fee Payment Reminder</p>
              <p className="text-xs text-green-700">May month fees due by 25th April</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}