---
applyTo: '**'
---

# Coding Preferences
- Mantener visual premium y layouts con alto contraste narrativo.
- Evitar cambios destructivos; preferir capas reutilizables para evolucionar todos los layouts.

# Project Architecture
- Next.js App Router con perfiles en app/artista/[id].
- Los 10 layouts viven en app/artista/[id]/components/Layout*.tsx y se seleccionan desde ArtistViewer.
- Administracion de artistas y seleccion de plantilla en components/dashboard/ArtistManager.tsx.

# Solutions Repository
- Para variar estructura en todos los layouts sin duplicar logica, usar componente compartido de narrativa por actos (NarrativeRibbon + NarrativeLead).
- Para previsualizar plantilla sin guardar, usar query previewTemplate validada en page.tsx y controlada por sesion admin.
- Para comparativa de 2-3 plantillas, usar iframes inline en ArtistManager con limite de 3 para preservar rendimiento.
- Para estabilizar builds remotos cuando Turbopack falla en pipeline CSS, usar build de produccion con `next build --webpack` y dejar `build:turbo` separado para pruebas.
- Mantener `tailwindcss` y `@tailwindcss/postcss` en dependencies para evitar fallos cuando el entorno de deploy omite devDependencies durante build.
