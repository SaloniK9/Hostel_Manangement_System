"use client"

import { useState, useEffect } from "react"
import { Plus, Search, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    prn: "",
    name: "",
    branch: "",
    year: "",
    city: "",
    phone: "",
    roomId: "",
    hostelId: "",
  })

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students')
      if (!response.ok) throw new Error('Failed to fetch students')
      const data = await response.json()
      setStudents(data)
    } catch (error) {
      toast.error('Could not load students')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = students.filter(
    (student) =>
      student.name?.toLowerCase().includes(search.toLowerCase()) ||
      student.prn?.toLowerCase().includes(search.toLowerCase()) ||
      student.department?.toLowerCase().includes(search.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentData: {
            prn: formData.prn,
            name: formData.name,
            department: formData.branch,
            academicYear: parseInt(formData.year.replace(/\D/g, '')) || 1,
            phoneNumber: formData.phone,
            room: { connect: { id: formData.roomId } }, // This might need roomId lookup
            hostel: { connect: { id: formData.hostelId } },
          },
          userData: {
            email: `${formData.prn.toLowerCase()}@hms.student.com`,
            password: 'student123',
            role: 'STUDENT'
          }
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to add student')
      }

      toast.success('Student added successfully')
      fetchStudents()
      setFormData({
        prn: "",
        name: "",
        branch: "",
        year: "",
        city: "",
        phone: "",
        roomId: "",
        hostelId: "",
      })
      setDialogOpen(false)
    } catch (error: any) {
      toast.error(error.message)
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
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Students</h1>
          <p className="text-muted-foreground">
            Manage all registered students in hostels
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prn">PRN</Label>
                  <Input
                    id="prn"
                    placeholder="Enter PRN"
                    value={formData.prn}
                    onChange={(e) =>
                      setFormData({ ...formData, prn: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch</Label>
                    <Select
                      value={formData.branch}
                      onValueChange={(value) =>
                        setFormData({ ...formData, branch: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Mechanical">Mechanical</SelectItem>
                        <SelectItem value="Civil">Civil</SelectItem>
                        <SelectItem value="IT">IT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Select
                      value={formData.year}
                      onValueChange={(value) =>
                        setFormData({ ...formData, year: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1st">1st Year</SelectItem>
                        <SelectItem value="2nd">2nd Year</SelectItem>
                        <SelectItem value="3rd">3rd Year</SelectItem>
                        <SelectItem value="4th">4th Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="roomId">Room ID</Label>
                    <Input
                      id="roomId"
                      placeholder="Enter Room Slug (A-101)"
                      value={formData.roomId}
                      onChange={(e) =>
                        setFormData({ ...formData, roomId: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hostelId">Hostel ID</Label>
                    <Input
                      id="hostelId"
                      placeholder="Enter Hostel ID"
                      value={formData.hostelId}
                      onChange={(e) =>
                        setFormData({ ...formData, hostelId: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Student</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, PRN, or branch..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Table */}
      <Card className="border-border bg-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">PRN</TableHead>
                  <TableHead className="text-muted-foreground">Name</TableHead>
                  <TableHead className="text-muted-foreground">Branch</TableHead>
                  <TableHead className="text-muted-foreground">Year</TableHead>
                  <TableHead className="text-muted-foreground">Phone</TableHead>
                  <TableHead className="text-muted-foreground">Room No.</TableHead>
                  <TableHead className="text-muted-foreground">Hostel</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No students found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow key={student.prn} className="border-border">
                      <TableCell className="font-medium text-foreground">
                        {student.prn}
                      </TableCell>
                      <TableCell className="text-foreground">{student.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {student.department}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {student.academicYear}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {student.phoneNumber}
                      </TableCell>
                      <TableCell>
                        <span className="rounded bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                          {student.room?.roomId || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="rounded bg-primary/10 px-2 py-1 text-xs text-primary">
                          {student.hostel?.hostelName || 'N/A'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredStudents.length} of {students.length} students
      </p>
    </div>
  )
}
