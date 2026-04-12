"use client"

import { useState } from "react"
import { Search, X, Star, Building2, Layers, DoorOpen, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

const hostels = [
  {
    id: "H001",
    name: "Hostel A - Scholars Block",
    area: "North Campus",
    floors: 4,
    totalRooms: 80,
    rating: 4.5,
    occupancy: 92,
  },
  {
    id: "H002",
    name: "Hostel B - Engineers Block",
    area: "South Campus",
    floors: 5,
    totalRooms: 100,
    rating: 4.2,
    occupancy: 78,
  },
  {
    id: "H003",
    name: "Hostel C - Research Block",
    area: "East Campus",
    floors: 3,
    totalRooms: 60,
    rating: 4.8,
    occupancy: 85,
  },
  {
    id: "H004",
    name: "Hostel D - Innovation Block",
    area: "West Campus",
    floors: 4,
    totalRooms: 80,
    rating: 4.0,
    occupancy: 64,
  },
  {
    id: "H005",
    name: "Hostel E - Graduate Block",
    area: "North Campus",
    floors: 6,
    totalRooms: 120,
    rating: 4.6,
    occupancy: 88,
  },
  {
    id: "H006",
    name: "Hostel F - International Block",
    area: "Central Campus",
    floors: 5,
    totalRooms: 90,
    rating: 4.9,
    occupancy: 95,
  },
]

export default function HostelsPage() {
  const [search, setSearch] = useState("")

  const filteredHostels = hostels.filter(
    (hostel) =>
      hostel.name.toLowerCase().includes(search.toLowerCase()) ||
      hostel.area.toLowerCase().includes(search.toLowerCase()) ||
      hostel.id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Hostels</h1>
        <p className="text-muted-foreground">
          Overview of all hostels and their details
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search hostels..."
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

      {/* Hostels Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredHostels.map((hostel) => (
          <Card
            key={hostel.id}
            className="border-border bg-card transition-colors hover:border-primary/50"
          >
            <CardContent className="p-6">
              {/* Header */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">
                      {hostel.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{hostel.id}</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{hostel.area}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{hostel.floors} Floors</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DoorOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {hostel.totalRooms} Rooms
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 text-chart-3" />
                  <span className="text-card-foreground">{hostel.rating}</span>
                </div>
              </div>

              {/* Occupancy */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Occupancy</span>
                  <span className="font-medium text-card-foreground">
                    {hostel.occupancy}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${hostel.occupancy}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredHostels.length} of {hostels.length} hostels
      </p>
    </div>
  )
}
