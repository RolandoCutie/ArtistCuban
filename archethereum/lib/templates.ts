export interface TemplateConfig {
  id: string
  name: string
  description: string
  preview_bg: string
  cssVars: Record<string, string>
  fontHeading: string
  fontBody: string
  accentClass: string
}

export const TEMPLATES: TemplateConfig[] = [
  {
    id: 'template1',
    name: 'Clásica',
    description: 'La plantilla original. Fondo crema, tipografía elegante, estilo galería contemporánea.',
    preview_bg: 'bg-[hsl(40,20%,97%)]',
    cssVars: {},
    fontHeading: "'Cormorant Garamond', Georgia, serif",
    fontBody: "'Inter', ui-sans-serif, system-ui, sans-serif",
    accentClass: '',
  },
  {
    id: 'template2',
    name: 'Blanca Dorada',
    description: 'Minimalista clara. Mucho blanco, tipografía elegante, detalles dorados.',
    preview_bg: 'bg-white',
    cssVars: {
      '--background': '0 0% 100%',
      '--foreground': '0 0% 5%',
      '--card': '0 0% 99%',
      '--card-foreground': '0 0% 5%',
      '--border': '45 40% 70%',
      '--muted': '45 30% 95%',
      '--muted-foreground': '0 0% 45%',
      '--accent': '45 60% 55%',
      '--accent-foreground': '0 0% 5%',
      '--primary': '0 0% 5%',
      '--primary-foreground': '0 0% 100%',
      '--ring': '45 60% 55%',
    },
    fontHeading: "'Cormorant Garamond', Georgia, serif",
    fontBody: "'Inter', ui-sans-serif, system-ui, sans-serif",
    accentClass: 'template-gold',
  },
  {
    id: 'template3',
    name: 'Noche Cobre',
    description: 'Minimalista oscura. Fondos negros, tipografía blanca, acentos cobre. Ideal para fotografía.',
    preview_bg: 'bg-neutral-950',
    cssVars: {
      '--background': '0 0% 4%',
      '--foreground': '30 10% 92%',
      '--card': '0 0% 6%',
      '--card-foreground': '30 10% 92%',
      '--border': '20 30% 18%',
      '--muted': '0 0% 10%',
      '--muted-foreground': '0 0% 55%',
      '--accent': '20 70% 45%',
      '--accent-foreground': '30 10% 92%',
      '--primary': '30 10% 92%',
      '--primary-foreground': '0 0% 4%',
      '--ring': '20 70% 45%',
    },
    fontHeading: "'Cormorant Garamond', Georgia, serif",
    fontBody: "'Inter', ui-sans-serif, system-ui, sans-serif",
    accentClass: 'template-copper',
  },
  {
    id: 'template4',
    name: 'Museo Crema',
    description: 'Inspiración museo. Fondos crema, detalles finos, mucho espacio. Sensación de galería de arte.',
    preview_bg: 'bg-[#f5f0e8]',
    cssVars: {
      '--background': '38 35% 95%',
      '--foreground': '25 15% 15%',
      '--card': '38 30% 97%',
      '--card-foreground': '25 15% 15%',
      '--border': '35 20% 78%',
      '--muted': '38 25% 90%',
      '--muted-foreground': '25 10% 40%',
      '--accent': '35 20% 72%',
      '--accent-foreground': '25 15% 15%',
      '--primary': '25 15% 15%',
      '--primary-foreground': '38 35% 95%',
      '--ring': '25 15% 15%',
      '--radius': '0rem',
    },
    fontHeading: "'Cormorant Garamond', Georgia, serif",
    fontBody: "'Georgia', 'Times New Roman', serif",
    accentClass: 'template-museum',
  },
  {
    id: 'template5',
    name: 'Creativa',
    description: 'Fondos con degradados sutiles, tarjetas modernas, sombras elegantes, animaciones discretas.',
    preview_bg: 'bg-gradient-to-br from-slate-50 to-slate-100',
    cssVars: {
      '--background': '220 20% 97%',
      '--foreground': '220 25% 10%',
      '--card': '0 0% 100%',
      '--card-foreground': '220 25% 10%',
      '--border': '220 15% 85%',
      '--muted': '220 15% 92%',
      '--muted-foreground': '220 10% 45%',
      '--accent': '250 60% 60%',
      '--accent-foreground': '0 0% 100%',
      '--primary': '220 25% 10%',
      '--primary-foreground': '0 0% 100%',
      '--ring': '250 60% 60%',
      '--radius': '0.75rem',
    },
    fontHeading: "'Cormorant Garamond', Georgia, serif",
    fontBody: "'Inter', ui-sans-serif, system-ui, sans-serif",
    accentClass: 'template-creative',
  },
  {
    id: 'template6',
    name: 'Premium Oscuro',
    description: 'Diseño sofisticado. Acentos oscuros, tipografía moderna, glassmorphism, transiciones suaves.',
    preview_bg: 'bg-neutral-900',
    cssVars: {
      '--background': '220 15% 8%',
      '--foreground': '220 10% 90%',
      '--card': '220 15% 11%',
      '--card-foreground': '220 10% 90%',
      '--border': '220 15% 20%',
      '--muted': '220 15% 14%',
      '--muted-foreground': '220 10% 55%',
      '--accent': '220 15% 22%',
      '--accent-foreground': '220 10% 90%',
      '--primary': '220 10% 90%',
      '--primary-foreground': '220 15% 8%',
      '--ring': '220 10% 90%',
      '--radius': '0.5rem',
    },
    fontHeading: "'Cormorant Garamond', Georgia, serif",
    fontBody: "'Inter', ui-sans-serif, system-ui, sans-serif",
    accentClass: 'template-premium',
  },
]

export function getTemplate(id?: string): TemplateConfig {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0]
}

export function templateToCssVars(config: TemplateConfig): React.CSSProperties {
  return Object.entries(config.cssVars).reduce(
    (acc, [key, value]) => ({ ...acc, [key]: value }),
    {} as React.CSSProperties
  )
}
