'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, MapPin, Phone, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function HostelsPage() {
  const [hostels, setHostels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHostels()
  }, [])

  const fetchHostels = async () => {
    try {
      const response = await fetch('/api/hostels')
      if (!response.ok) throw new Error('Failed to fetch hostels')
      const data = await response.json()
      setHostels(data)
    } catch (error) {
      toast.error('Could not load hostels')
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hostel Management</h1>
          <p className="text-gray-600 mt-2">Manage hostel facilities and information ({hostels.length} total)</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Hostel
        </Button>
      </div>

      {hostels.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No hostels found. Add your first hostel to get started.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hostels.map((hostel) => (
            <Card key={hostel.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {hostel.hostelName}
                </CardTitle>
                <CardDescription>{hostel.location}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Capacity</span>
                    <span className="text-sm font-medium">{hostel.capacity} students</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Warden</span>
                    <span className="text-sm font-medium">{hostel.wardenName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Contact</span>
                    <span className="text-sm font-medium flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      {hostel.contact}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="mt-4 pt-4 border-t flex justify-between text-xs text-muted-foreground">
                    <span>Rooms: {hostel._count?.rooms || 0}</span>
                    <span>Students: {hostel._count?.students || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}