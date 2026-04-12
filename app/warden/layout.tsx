import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'

export default function WardenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role="WARDEN" />
      <div className="flex-1 flex flex-col">
        <Header role="WARDEN" title="Warden Dashboard" />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}