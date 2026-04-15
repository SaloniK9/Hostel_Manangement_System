import { Users, DoorOpen, Building2, LogOut } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const stats = [
  {
    label: "Total Students",
    value: "1,284",
    icon: Users,
    color: "bg-chart-1/10 text-chart-1",
  },
  {
    label: "Total Rooms",
    value: "320",
    icon: DoorOpen,
    color: "bg-chart-2/10 text-chart-2",
  },
  {
    label: "Total Hostels",
    value: "8",
    icon: Building2,
    color: "bg-chart-3/10 text-chart-3",
  },
  {
    label: "Students Outside",
    value: "47",
    icon: LogOut,
    color: "bg-chart-4/10 text-chart-4",
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here is an overview of your hostel management system.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 text-3xl font-semibold text-card-foreground">
                    {stat.value}
                  </p>
                </div>
                <div className={`rounded-lg p-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-card-foreground">
              Recent In-Out Activity
            </h2>
            <div className="space-y-4">
              {[
                { name: "Rahul Sharma", action: "Checked Out", time: "10:30 AM" },
                { name: "Priya Patel", action: "Checked In", time: "09:45 AM" },
                { name: "Amit Kumar", action: "Checked Out", time: "09:15 AM" },
                { name: "Sneha Gupta", action: "Checked In", time: "08:30 AM" },
              ].map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-medium">
                      {activity.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">
                        {activity.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.action}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-card-foreground">
              Hostel Occupancy
            </h2>
            <div className="space-y-4">
              {[
                { name: "Hostel A", occupancy: 92 },
                { name: "Hostel B", occupancy: 78 },
                { name: "Hostel C", occupancy: 85 },
                { name: "Hostel D", occupancy: 64 },
              ].map((hostel, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-card-foreground">
                      {hostel.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
