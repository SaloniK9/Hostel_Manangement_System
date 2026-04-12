import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, MapPin, Phone } from 'lucide-react'

export default function HostelsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hostel Management</h1>
          <p className="text-gray-600 mt-2">Manage hostel facilities and information</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Hostel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Boys Hostel A
            </CardTitle>
            <CardDescription>Campus Block A</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Capacity</span>
                <span className="text-sm font-medium">100 students</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Warden</span>
                <span className="text-sm font-medium">John Doe</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Contact</span>
                <span className="text-sm font-medium flex items-center">
                  <Phone className="h-3 w-3 mr-1" />
                  +91 98765 43210
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="default">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Girls Hostel B
            </CardTitle>
            <CardDescription>Campus Block B</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Capacity</span>
                <span className="text-sm font-medium">80 students</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Warden</span>
                <span className="text-sm font-medium">Jane Smith</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Contact</span>
                <span className="text-sm font-medium flex items-center">
                  <Phone className="h-3 w-3 mr-1" />
                  +91 98765 43211
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="default">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              International Hostel
            </CardTitle>
            <CardDescription>Campus Block C</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Capacity</span>
                <span className="text-sm font-medium">50 students</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Warden</span>
                <span className="text-sm font-medium">Bob Johnson</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Contact</span>
                <span className="text-sm font-medium flex items-center">
                  <Phone className="h-3 w-3 mr-1" />
                  +91 98765 43212
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="secondary">Under Maintenance</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}