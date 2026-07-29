'use client'

import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Settings } from 'lucide-react'

export default function ConfiguracionPage() {
  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-8">
        <div>
          <h1 className="font-heading text-4xl font-light">Configuración</h1>
          <p className="mt-1 text-sm text-foreground/50">Ajustes generales de la plataforma</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h3 className="font-heading text-xl font-light">General</h3>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Nombre del sitio</label>
              <input defaultValue="Archethereum" className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-widest text-foreground/40">Email de administración</label>
              <input defaultValue="dualgrid.studio@gmail.com" type="email" className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm focus:border-foreground focus:outline-none" />
            </div>
            <button className="rounded-full bg-foreground px-6 py-2.5 text-sm text-background hover:bg-foreground/90 transition-colors">
              Guardar cambios
            </button>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h3 className="font-heading text-xl font-light">Notificaciones</h3>
            <label className="flex items-center justify-between gap-4 cursor-pointer">
              <div>
                <p className="text-sm font-medium">Suscripciones por vencer</p>
                <p className="text-xs text-foreground/50">Alerta 30 días antes del vencimiento</p>
              </div>
              <div className="h-6 w-11 rounded-full bg-foreground relative cursor-pointer">
                <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-background" />
              </div>
            </label>
            <label className="flex items-center justify-between gap-4 cursor-pointer">
              <div>
                <p className="text-sm font-medium">Facturas vencidas</p>
                <p className="text-xs text-foreground/50">Notificar cuando una factura supere su fecha</p>
              </div>
              <div className="h-6 w-11 rounded-full bg-foreground relative cursor-pointer">
                <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-background" />
              </div>
            </label>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h3 className="font-heading text-xl font-light">Base de datos</h3>
            <p className="text-sm text-foreground/50">
              MongoDB Atlas — Cluster0<br />
              Base de datos: <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">artisthub</code>
            </p>
            <p className="text-xs text-foreground/30">Las colecciones se crean automáticamente con el prefijo <code className="font-mono bg-muted px-1 rounded">artisthub/</code></p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 space-y-2">
            <h3 className="font-heading text-xl font-light">Accesos directos</h3>
            <p className="text-sm text-foreground/50">Atajos hacia la gestión del sistema</p>
            <div className="mt-4 space-y-2">
              <a href="/dashboard/artistas" className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors"><Settings size={14} /> Gestionar artistas</a>
              <a href="/dashboard/suscripciones" className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors"><Settings size={14} /> Ver suscripciones</a>
              <a href="/dashboard/contratos" className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors"><Settings size={14} /> Revisar contratos</a>
              <a href="/dashboard/facturas" className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors"><Settings size={14} /> Facturación</a>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
