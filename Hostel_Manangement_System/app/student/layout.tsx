'use client'

import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { SidebarProvider } from '@/lib/sidebar-context'

function StudentContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar role="STUDENT" />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300">
        <Header role="STUDENT" title="Student Portal" />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <StudentContent>{children}</StudentContent>
    </SidebarProvider>
  )
}