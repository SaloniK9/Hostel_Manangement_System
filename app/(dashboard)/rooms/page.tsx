"use client"

import { useState } from "react"
import { Search, X, CheckCircle, AlertCircle, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const rooms = [
  { roomNo: "A-101", hostelId: "H001", capacity: 4, occupied: 4, cleaningStatus: "Clean", lastCleaned: "2024-01-15" },
  { roomNo: "A-102", hostelId: "H001", capacity: 4, occupied: 3, cleaningStatus: "Clean", lastCleaned: "2024-01-15" },
  { roomNo: "A-103", hostelId: "H001", capacity: 4, occupied: 4, cleaningStatus: "Pending", lastCleaned: "2024-01-14" },
  { roomNo: "A-201", hostelId: "H001", capacity: 3, occupied: 2, cleaningStatus: "Clean", lastCleaned: "2024-01-15" },
  { roomNo: "A-202", hostelId: "H001", capacity: 3, occupied: 3, cleaningStatus: "In Progress", lastCleaned: "2024-01-13" },
  { roomNo: "B-101", hostelId: "H002", capacity: 4, occupied: 4, cleaningStatus: "Clean", lastCleaned: "2024-01-15" },
  { roomNo: "B-102", hostelId: "H002", capacity: 4, occupied: 2, cleaningStatus: "Pending", lastCleaned: "2024-01-14" },
  { roomNo: "B-205", hostelId: "H002", capacity: 3, occupied: 3, cleaningStatus: "Clean", lastCleaned: "2024-01-15" },
  { roomNo: "C-101", hostelId: "H003", capacity: 4, occupied: 3, cleaningStatus: "Clean", lastCleaned: "2024-01-15" },
  { roomNo: "C-102", hostelId: "H003", capacity: 4, occupied: 4, cleaningStatus: "In Progress", lastCleaned: "2024-01-12" },
  { roomNo: "D-101", hostelId: "H004", capacity: 3, occupied: 1, cleaningStatus: "Clean", lastCleaned: "2024-01-15" },
  { roomNo: "D-201", hostelId: "H004", capacity: 3, occupied: 3, cleaningStatus: "Pending", lastCleaned: "2024-01-14" },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Clean":
      return <CheckCircle className="h-4 w-4 text-chart-1" />
    case "Pending":
      return <AlertCircle className="h-4 w-4 text-chart-4" />
    case "In Progress":
      return <Clock className="h-4 w-4 text-chart-2" />
    default:
      return null
  }
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case "Clean":
      return "bg-chart-1/10 text-chart-1"
    case "Pending":
      return "bg-chart-4/10 text-chart-4"
    case "In Progress":
      return "bg-chart-2/10 text-chart-2"
    default:
      return ""
  }
}

export default function RoomsPage() {
  const [search, setSearch] = useState("")
  const [hostelFilter, setHostelFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.roomNo.toLowerCase().includes(search.toLowerCase())
    const matchesHostel = hostelFilter === "all" || room.hostelId === hostelFilter
    const matchesStatus = statusFilter === "all" || room.cleaningStatus === statusFilter
    return matchesSearch && matchesHostel && matchesStatus
  })

  const totalCapacity = filteredRooms.reduce((acc, room) => acc + room.capacity, 0)
  const totalOccupied = filteredRooms.reduce((acc, room) => acc + room.occupied, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Rooms</h1>
        <p className="text-muted-foreground">
          View and manage all hostel rooms and their status
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Rooms</p>
            <p className="text-2xl font-semibold text-card-foreground">
              {filteredRooms.length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Capacity</p>
            <p className="text-2xl font-semibold text-card-foreground">
              {totalCapacity}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Occupancy Rate</p>
            <p className="text-2xl font-semibold text-primary">
              {totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by room number..."
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
        <Select value={hostelFilter} onValueChange={setHostelFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Hostel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Hostels</SelectItem>
            <SelectItem value="H001">H001</SelectItem>
            <SelectItem value="H002">H002</SelectItem>
            <SelectItem value="H003">H003</SelectItem>
            <SelectItem value="H004">H004</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Clean">Clean</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="border-border bg-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Room Number</TableHead>
                  <TableHead className="text-muted-foreground">Hostel ID</TableHead>
                  <TableHead className="text-muted-foreground">Capacity</TableHead>
                  <TableHead className="text-muted-foreground">Occupied</TableHead>
                  <TableHead className="text-muted-foreground">Cleaning Status</TableHead>
                  <TableHead className="text-muted-foreground">Last Cleaned</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRooms.map((room) => (
                  <TableRow key={room.roomNo} className="border-border">
                    <TableCell className="font-medium text-foreground">
                      {room.roomNo}
                    </TableCell>
                    <TableCell>
                      <span className="rounded bg-primary/10 px-2 py-1 text-xs text-primary">
                        {room.hostelId}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {room.capacity}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-foreground">{room.occupied}</span>
                        <span className="text-muted-foreground">/</span>
                        <span className="text-muted-foreground">{room.capacity}</span>
                        {room.occupied === room.capacity && (
                          <span className="rounded bg-destructive/10 px-1.5 py-0.5 text-[10px] text-destructive">
                            Full
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs ${getStatusStyle(
                          room.cleaningStatus
                        )}`}
                      >
                        {getStatusIcon(room.cleaningStatus)}
                        {room.cleaningStatus}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(room.lastCleaned).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
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
        Showing {filteredRooms.length} of {rooms.length} rooms
      </p>
    </div>
  )
}
