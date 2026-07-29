'use client'

import ArtistManager from '@/components/dashboard/ArtistManager'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

export default function ArtistasPage() {
  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-light">Artistas</h1>
          <p className="mt-1 text-sm text-foreground/50">Gestiona los artistas de la plataforma</p>
        </div>
        <ArtistManager />
      </div>
    </DashboardLayout>
  )
}
