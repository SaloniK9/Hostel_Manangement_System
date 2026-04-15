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
  FileText,
  CreditCard,
  Calendar,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSidebar } from "@/lib/sidebar-context"

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

const roleColors: Record<string, string> = {
  ADMIN: "from-indigo-900 to-indigo-800",
  WARDEN: "from-teal-900 to-teal-800",
  STUDENT: "from-violet-900 to-violet-800",
}

interface SidebarProps {
  role?: 'ADMIN' | 'WARDEN' | 'STUDENT'
}

export function Sidebar({ role = 'STUDENT' }: SidebarProps) {
  const pathname = usePathname()
  const { collapsed, toggle } = useSidebar()
  const navItems = role === 'ADMIN' ? adminNavItems : role === 'WARDEN' ? wardenNavItems : studentNavItems
  const gradient = roleColors[role] || roleColors.STUDENT

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "relative flex-shrink-0 h-screen flex flex-col border-r border-white/10 bg-gray-950 transition-all duration-300 ease-in-out shadow-xl",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className={cn(
          "flex h-16 items-center border-b border-white/10 bg-gradient-to-r shrink-0",
          gradient,
          collapsed ? "justify-center px-0" : "gap-3 px-5"
        )}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-base font-bold text-white leading-tight">PCCOE HMS</h1>
              <p className="text-[11px] text-white/60 leading-tight">Hostel Management</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== `/${role.toLowerCase()}` && pathname.startsWith(item.href))
            const linkEl = (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  collapsed ? "justify-center" : "",
                  isActive
                    ? "bg-white/15 text-white shadow-sm"
                    : "text-white/50 hover:bg-white/8 hover:text-white/90"
                )}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-white" : "text-white/50")} />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {!collapsed && isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white shrink-0" />
                )}
              </Link>
            )
            return collapsed ? (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
                <TooltipContent side="right" className="font-medium">{item.label}</TooltipContent>
              </Tooltip>
            ) : linkEl
          })}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="shrink-0 border-t border-white/10 p-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white bg-gradient-to-br",
                gradient
              )}>
                {role.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white/80 capitalize truncate">{role.toLowerCase()} Portal</p>
                <p className="text-xs text-white/40">PCCOE HMS</p>
              </div>
            </div>
          </div>
        )}

        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className={cn(
            "absolute -right-3 top-20 h-6 w-6 rounded-full border border-white/20 bg-gray-900 text-white/60 hover:bg-gray-800 hover:text-white shadow-lg z-10 transition-all",
          )}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </Button>
      </aside>
    </TooltipProvider>
  )
}
