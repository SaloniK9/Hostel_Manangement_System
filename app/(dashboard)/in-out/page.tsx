"use client"

import { useState } from "react"
import { Plus, Search, X, LogIn, LogOut } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"

const initialEntries = [
  {
    id: 1,
    prn: "PRN001",
    studentName: "Rahul Sharma",
    outDate: "2024-01-15",
    outTime: "10:30",
    inDate: "2024-01-15",
    inTime: "18:45",
    reason: "Medical appointment",
  },
  {
    id: 2,
    prn: "PRN003",
    studentName: "Amit Kumar",
    outDate: "2024-01-15",
    outTime: "09:00",
    inDate: "2024-01-15",
    inTime: "14:30",
    reason: "Home visit",
  },
  {
    id: 3,
    prn: "PRN005",
    studentName: "Vikram Singh",
    outDate: "2024-01-15",
    outTime: "11:15",
    inDate: null,
    inTime: null,
    reason: "Shopping",
  },
  {
    id: 4,
    prn: "PRN002",
    studentName: "Priya Patel",
    outDate: "2024-01-14",
    outTime: "08:00",
    inDate: "2024-01-14",
    inTime: "20:00",
    reason: "Family function",
  },
  {
    id: 5,
    prn: "PRN007",
    studentName: "Karan Mehta",
    outDate: "2024-01-15",
    outTime: "14:00",
    inDate: null,
    inTime: null,
    reason: "Library - City Central",
  },
  {
    id: 6,
    prn: "PRN006",
    studentName: "Ananya Reddy",
    outDate: "2024-01-14",
    outTime: "10:00",
    inDate: "2024-01-14",
    inTime: "19:30",
    reason: "Internship interview",
  },
]

export default function InOutPage() {
  const [entries, setEntries] = useState(initialEntries)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    prn: "",
    outDate: "",
    outTime: "",
    inDate: "",
    inTime: "",
    reason: "",
  })

  const filteredEntries = entries.filter(
    (entry) =>
      entry.studentName.toLowerCase().includes(search.toLowerCase()) ||
      entry.prn.toLowerCase().includes(search.toLowerCase())
  )

  const currentlyOutside = entries.filter((e) => !e.inDate).length

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newEntry = {
      id: entries.length + 1,
      prn: formData.prn,
      studentName: "New Student",
      outDate: formData.outDate,
      outTime: formData.outTime,
      inDate: formData.inDate || null,
      inTime: formData.inTime || null,
      reason: formData.reason,
    }
    setEntries([newEntry, ...entries])
    setFormData({
      prn: "",
      outDate: "",
      outTime: "",
      inDate: "",
      inTime: "",
      reason: "",
    })
    setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">In-Out Entries</h1>
          <p className="text-muted-foreground">
            Track student movement in and out of hostels
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Record In-Out Entry</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prn">Student PRN</Label>
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

              <div className="rounded-lg border border-border p-4">
                <p className="mb-3 text-sm font-medium text-foreground">
                  Out Details
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="outDate">Out Date</Label>
                    <Input
                      id="outDate"
                      type="date"
                      value={formData.outDate}
                      onChange={(e) =>
                        setFormData({ ...formData, outDate: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="outTime">Out Time</Label>
                    <Input
                      id="outTime"
                      type="time"
                      value={formData.outTime}
                      onChange={(e) =>
                        setFormData({ ...formData, outTime: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border p-4">
                <p className="mb-3 text-sm font-medium text-foreground">
                  In Details (Optional)
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="inDate">In Date</Label>
                    <Input
                      id="inDate"
                      type="date"
                      value={formData.inDate}
                      onChange={(e) =>
                        setFormData({ ...formData, inDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inTime">In Time</Label>
                    <Input
                      id="inTime"
                      type="time"
                      value={formData.inTime}
                      onChange={(e) =>
                        setFormData({ ...formData, inTime: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  placeholder="Enter reason for going out"
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Entry</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-chart-4/10 p-2">
                <LogOut className="h-5 w-5 text-chart-4" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Currently Outside</p>
                <p className="text-2xl font-semibold text-card-foreground">
                  {currentlyOutside}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-chart-1/10 p-2">
                <LogIn className="h-5 w-5 text-chart-1" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Returned Today</p>
                <p className="text-2xl font-semibold text-card-foreground">
                  {entries.filter((e) => e.inDate === "2024-01-15").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-chart-2/10 p-2">
                <LogOut className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Entries</p>
                <p className="text-2xl font-semibold text-card-foreground">
                  {entries.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or PRN..."
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
                  <TableHead className="text-muted-foreground">Out Date</TableHead>
                  <TableHead className="text-muted-foreground">Out Time</TableHead>
                  <TableHead className="text-muted-foreground">In Date</TableHead>
                  <TableHead className="text-muted-foreground">In Time</TableHead>
                  <TableHead className="text-muted-foreground">Reason</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => (
                  <TableRow key={entry.id} className="border-border">
                    <TableCell className="font-medium text-foreground">
                      {entry.prn}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {entry.studentName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(entry.outDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {entry.outTime}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {entry.inDate
                        ? new Date(entry.inDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {entry.inTime || "-"}
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate text-muted-foreground">
                      {entry.reason}
                    </TableCell>
                    <TableCell>
                      {entry.inDate ? (
                        <span className="inline-flex items-center gap-1 rounded bg-chart-1/10 px-2 py-1 text-xs text-chart-1">
                          <LogIn className="h-3 w-3" />
                          Returned
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded bg-chart-4/10 px-2 py-1 text-xs text-chart-4">
                          <LogOut className="h-3 w-3" />
                          Outside
                        </span>
                      )}
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
        Showing {filteredEntries.length} of {entries.length} entries
      </p>
    </div>
  )
}
