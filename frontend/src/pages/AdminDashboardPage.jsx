import { useState } from 'react'
import Navbar from '../components/Navbar'
import AdminSidebar from '../components/admin/AdminSidebar'
import AdminOverview from '../components/admin/AdminOverview'
import AdminContentTree from '../components/admin/AdminContentTree'
import AdminMaterials from '../components/admin/AdminMaterials'

const SECTIONS = {
  overview: AdminOverview,
  content: AdminContentTree,
  materials: AdminMaterials,
}

export default function AdminDashboardPage() {
  const [activeSection, setActiveSection] = useState('overview')
  const ActiveComponent = SECTIONS[activeSection]

  return (
    <div className="flex h-screen flex-col bg-background text-foreground overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <ActiveComponent />
        </main>
      </div>
    </div>
  )
}
