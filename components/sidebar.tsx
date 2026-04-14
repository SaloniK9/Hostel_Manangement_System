"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  DoorOpen,
  Building2,
  ClipboardList,
  UserCog,
  Menu,
  X,
  FileText,
  CreditCard,
  Calendar,
  MessageSquare,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/hostels", label: "Hostels", icon: Building2 },
  { href: "/admin/rooms", label: "Rooms", icon: DoorOpen },
  { href: "/admin/reports", label: "Reports", icon: FileText },
]

const wardenNavItems = [
  { href: "/warden", label: "Dashboard", icon: LayoutDashboard },
  { href: "/warden/students", label: "Students", icon: Users },
  { href: "/warden/allocations", label: "Allocations", icon: DoorOpen },
  { href: "/warden/attendance", label: "Attendance", icon: Calendar },
  { href: "/warden/leaves", label: "Leaves", icon: ClipboardList },
  { href: "/warden/complaints", label: "Complaints", icon: MessageSquare },
]

const studentNavItems = [
  { href: "/student", label: "Dashboard", icon: LayoutDashboard },
  { href: "/student/profile", label: "Profile", icon: Users },
  { href: "/student/fees", label: "Fees", icon: CreditCard },
  { href: "/student/attendance", label: "Attendance", icon: Calendar },
  { href: "/student/complaints", label: "Complaints", icon: MessageSquare },
]

interface SidebarProps {
  role?: 'ADMIN' | 'WARDEN' | 'STUDENT'
}

export function Sidebar({ role = 'STUDENT' }: SidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = role === 'ADMIN' ? adminNavItems : role === 'WARDEN' ? wardenNavItems : studentNavItems

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6 bg-gradient-to-r from-blue-900 to-blue-800">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white">
              <Building2 className="h-5 w-5 text-blue-900" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">PCCOE</h1>
              <p className="text-xs text-blue-100">Hostel Management</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-primary"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-sidebar-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-900 text-sm font-medium">
                {role.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-sidebar-foreground capitalize">{role.toLowerCase()} Portal</p>
                <p className="text-xs text-muted-foreground">PCCOE HMS</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
