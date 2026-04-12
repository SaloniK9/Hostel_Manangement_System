"use client"

import { useState } from "react"
import { Plus, Search, X } from "lucide-react"
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

const initialStudents = [
  { prn: "PRN001", name: "Rahul Sharma", branch: "Computer Science", year: "3rd", phone: "9876543210", roomNo: "A-101", hostelId: "H001" },
  { prn: "PRN002", name: "Priya Patel", branch: "Electronics", year: "2nd", phone: "9876543211", roomNo: "B-205", hostelId: "H002" },
  { prn: "PRN003", name: "Amit Kumar", branch: "Mechanical", year: "4th", phone: "9876543212", roomNo: "A-302", hostelId: "H001" },
  { prn: "PRN004", name: "Sneha Gupta", branch: "Civil", year: "1st", phone: "9876543213", roomNo: "C-102", hostelId: "H003" },
  { prn: "PRN005", name: "Vikram Singh", branch: "Computer Science", year: "2nd", phone: "9876543214", roomNo: "A-103", hostelId: "H001" },
  { prn: "PRN006", name: "Ananya Reddy", branch: "IT", year: "3rd", phone: "9876543215", roomNo: "B-301", hostelId: "H002" },
  { prn: "PRN007", name: "Karan Mehta", branch: "Electronics", year: "4th", phone: "9876543216", roomNo: "D-201", hostelId: "H004" },
  { prn: "PRN008", name: "Neha Joshi", branch: "Computer Science", year: "1st", phone: "9876543217", roomNo: "C-105", hostelId: "H003" },
]

export default function StudentsPage() {
  const [students, setStudents] = useState(initialStudents)
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

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.prn.toLowerCase().includes(search.toLowerCase()) ||
      student.branch.toLowerCase().includes(search.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newStudent = {
      prn: formData.prn,
      name: formData.name,
      branch: formData.branch,
      year: formData.year,
      phone: formData.phone,
      roomNo: formData.roomId,
      hostelId: formData.hostelId,
    }
    setStudents([...students, newStudent])
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
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                  />
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
                      placeholder="e.g., A-101"
                      value={formData.roomId}
                      onChange={(e) =>
                        setFormData({ ...formData, roomId: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hostelId">Hostel ID</Label>
                    <Select
                      value={formData.hostelId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, hostelId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="H001">H001</SelectItem>
                        <SelectItem value="H002">H002</SelectItem>
                        <SelectItem value="H003">H003</SelectItem>
                        <SelectItem value="H004">H004</SelectItem>
                      </SelectContent>
                    </Select>
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
                  <TableHead className="text-muted-foreground">Hostel ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.prn} className="border-border">
                    <TableCell className="font-medium text-foreground">
                      {student.prn}
                    </TableCell>
                    <TableCell className="text-foreground">{student.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {student.branch}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {student.year}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {student.phone}
                    </TableCell>
                    <TableCell>
                      <span className="rounded bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                        {student.roomNo}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="rounded bg-primary/10 px-2 py-1 text-xs text-primary">
                        {student.hostelId}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
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
