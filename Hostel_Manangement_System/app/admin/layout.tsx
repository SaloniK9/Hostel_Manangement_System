'use client'

import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { SidebarProvider, useSidebar } from '@/lib/sidebar-context'
import { cn } from '@/lib/utils'

function AdminContent({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar()
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar role="ADMIN" />
      <div className={cn(
        'flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300',
      )}>
        <Header role="ADMIN" title="Admin Portal" />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminContent>{children}</AdminContent>
    </SidebarProvider>
  )
}