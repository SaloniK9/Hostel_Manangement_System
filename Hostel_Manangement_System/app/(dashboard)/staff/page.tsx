"use client"

import { useState } from "react"
import { Search, X, Star, Phone, Mail, UserCog } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const staff = [
  {
    id: "STF001",
    name: "Rajesh Kumar",
    post: "Warden",
    age: 45,
    phone: "9876543001",
    email: "rajesh.k@hostel.edu",
    hostel: "H001",
    rating: 4.8,
    reviews: 156,
  },
  {
    id: "STF002",
    name: "Sunita Sharma",
    post: "Assistant Warden",
    age: 38,
    phone: "9876543002",
    email: "sunita.s@hostel.edu",
    hostel: "H001",
    rating: 4.6,
    reviews: 89,
  },
  {
    id: "STF003",
    name: "Mohammed Ali",
    post: "Security Guard",
    age: 35,
    phone: "9876543003",
    email: "ali.m@hostel.edu",
    hostel: "H002",
    rating: 4.5,
    reviews: 120,
  },
  {
    id: "STF004",
    name: "Lakshmi Devi",
    post: "Housekeeper",
    age: 42,
    phone: "9876543004",
    email: "lakshmi.d@hostel.edu",
    hostel: "H002",
    rating: 4.9,
    reviews: 210,
  },
  {
    id: "STF005",
    name: "Arun Patel",
    post: "Maintenance",
    age: 32,
    phone: "9876543005",
    email: "arun.p@hostel.edu",
    hostel: "H003",
    rating: 4.3,
    reviews: 67,
  },
  {
    id: "STF006",
    name: "Priya Singh",
    post: "Assistant Warden",
    age: 34,
    phone: "9876543006",
    email: "priya.s@hostel.edu",
    hostel: "H003",
    rating: 4.7,
    reviews: 98,
  },
  {
    id: "STF007",
    name: "Ramesh Verma",
    post: "Warden",
    age: 50,
    phone: "9876543007",
    email: "ramesh.v@hostel.edu",
    hostel: "H004",
    rating: 4.4,
    reviews: 145,
  },
  {
    id: "STF008",
    name: "Kavita Reddy",
    post: "Cook",
    age: 40,
    phone: "9876543008",
    email: "kavita.r@hostel.edu",
    hostel: "H001",
    rating: 4.8,
    reviews: 234,
  },
]

const getPostColor = (post: string) => {
  switch (post) {
    case "Warden":
      return "bg-primary/10 text-primary"
    case "Assistant Warden":
      return "bg-chart-2/10 text-chart-2"
    case "Security Guard":
      return "bg-chart-4/10 text-chart-4"
    case "Housekeeper":
      return "bg-chart-1/10 text-chart-1"
    case "Maintenance":
      return "bg-chart-3/10 text-chart-3"
    case "Cook":
      return "bg-chart-5/10 text-chart-5"
    default:
      return "bg-secondary text-secondary-foreground"
  }
}

export default function StaffPage() {
  const [search, setSearch] = useState("")
  const [postFilter, setPostFilter] = useState("all")

  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.id.toLowerCase().includes(search.toLowerCase())
    const matchesPost = postFilter === "all" || member.post === postFilter
    return matchesSearch && matchesPost
  })

  const uniquePosts = Array.from(new Set(staff.map((s) => s.post)))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Staff</h1>
        <p className="text-muted-foreground">
          Manage hostel staff and their information
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or ID..."
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
        <Select value={postFilter} onValueChange={setPostFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by post" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Posts</SelectItem>
            {uniquePosts.map((post) => (
              <SelectItem key={post} value={post}>
                {post}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Staff Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredStaff.map((member) => (
          <Card
            key={member.id}
            className="border-border bg-card transition-colors hover:border-primary/50"
          >
            <CardContent className="p-5">
              {/* Header */}
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-lg font-medium text-secondary-foreground">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-card-foreground">
                    {member.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{member.id}</p>
                </div>
              </div>

              {/* Post Badge */}
              <div className="mb-4">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${getPostColor(
                    member.post
                  )}`}
                >
                  <UserCog className="h-3 w-3" />
                  {member.post}
                </span>
              </div>

              {/* Info */}
              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{member.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate text-muted-foreground">
                    {member.email}
                  </span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-chart-3 text-chart-3" />
                  <span className="font-medium text-card-foreground">
                    {member.rating}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {member.reviews} reviews
                </span>
              </div>

              {/* Age & Hostel */}
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>Age: {member.age}</span>
                <span className="rounded bg-secondary px-2 py-0.5">
                  {member.hostel}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredStaff.length} of {staff.length} staff members
      </p>
    </div>
  )
}
