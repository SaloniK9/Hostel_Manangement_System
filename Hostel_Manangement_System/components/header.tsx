'use client'

import { Button } from '@/components/ui/button'
import { LogOut, User, Menu, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSidebar } from '@/lib/sidebar-context'

interface HeaderProps {
  role: 'ADMIN' | 'WARDEN' | 'STUDENT'
  title: string
}

export function Header({ role, title }: HeaderProps) {
  const router = useRouter()
  const { collapsed, toggle } = useSidebar()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const getRoleColor = () => {
    switch (role) {
      case 'ADMIN':   return 'bg-red-100 text-red-800'
      case 'WARDEN':  return 'bg-blue-100 text-blue-800'
      case 'STUDENT': return 'bg-green-100 text-green-800'
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="h-9 w-9 text-gray-600 hover:bg-gray-100"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </Button>
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor()}`}>
            {role}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>PCCOE HMS</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}