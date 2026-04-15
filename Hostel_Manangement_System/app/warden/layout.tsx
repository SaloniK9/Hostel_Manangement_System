'use client'

import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { SidebarProvider } from '@/lib/sidebar-context'

function WardenContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar role="WARDEN" />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300">
        <Header role="WARDEN" title="Warden Portal" />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function WardenLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <WardenContent>{children}</WardenContent>
    </SidebarProvider>
  )
}