'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, MapPin, Phone, BookOpen, Loader2, Calendar } from 'lucide-react'
import { toast } from 'sonner'

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/me')
      .then(r => r.json())
      .then(data => setProfile(data))
      .catch(() => toast.error('Could not load profile'))
      .finally(() => setLoading(false))
  }, [])

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
        <p className="text-muted-foreground">No student profile linked to this account.</p>
      </Card>
    )
  }

  const infoRows = [
    { label: 'Full Name', value: student.name, icon: User },
    { label: 'Student ID', value: student.studentId, icon: BookOpen },
    { label: 'Email', value: student.email, icon: User },
    { label: 'Phone', value: student.phone, icon: Phone },
    { label: 'Department', value: student.department, icon: BookOpen },
    { label: 'Academic Year', value: `Year ${student.academicYear}`, icon: Calendar },
    { label: 'Hostel', value: student.hostel?.hostelName || 'Not assigned', icon: MapPin },
    { label: 'Room', value: student.room?.roomId || 'Not assigned', icon: MapPin },
    { label: 'Admission Date', value: new Date(student.admissionDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }), icon: Calendar },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-2">Your personal and academic information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="text-center">
          <CardContent className="pt-8 pb-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{student.name}</h2>
            <p className="text-sm text-muted-foreground">{student.studentId}</p>
            <div className="mt-3">
              <Badge variant={student.status === 'ACTIVE' ? 'default' : 'secondary'} className="bg-green-600">
                {student.status}
              </Badge>
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">Warden</p>
              <p className="text-sm font-medium">{student.hostel?.wardenName || 'Not assigned'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Info Grid */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your registered details in the hostel management system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {infoRows.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-sm font-medium text-gray-900">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
