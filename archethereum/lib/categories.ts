/** Genera un slug URL-safe desde el nombre de una categoría */
export function categorySlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

/** Encuentra la categoría cuyo slug coincide */
export function findCategoryBySlug(slug: string): CategoryItem | undefined {
  return categories.find((c) => categorySlug(c.name) === slug)
}

export interface CategoryItem {
  name: string
  image: string
  description: string
}

export const categories: CategoryItem[] = [
  {
    name: "Pintura",
    image: "/img/cat-pintura.jpg",
    description: "Expresión visual en lienzo y más allá",
  },
  {
    name: "Escultura",
    image: "/img/cat-escultura.jpg",
    description: "Formas tridimensionales que perviven en el tiempo",
  },
  {
    name: "Fotografía",
    image: "/img/cat-fotografia.jpg",
    description: "El instante capturado como arte eterno",
  },
  {
    name: "Arte Digital",
    image: "/img/cat-arte-digital.jpg",
    description: "Creatividad sin límites en el universo digital",
  },
  {
    name: "Música",
    image: "/img/cat-musica.jpg",
    description: "El sonido como vehículo de emociones profundas",
  },
  {
    name: "Performance",
    image: "/img/cat-performance.jpg",
    description: "El cuerpo y la acción como medio artístico",
  },
  {
    name: "Moda",
    image: "/img/cat-moda.jpg",
    description: "La vestimenta como lenguaje y arte vivo",
  },
  {
    name: "Arquitectura",
    image: "/img/cat-arquitectura.jpg",
    description: "Espacios que dialogan con quienes los habitan",
  },
  {
    name: "Ilustración",
    image: "/img/cat-ilustracion.jpg",
    description: "Narrativas visuales de mundos imaginados",
  },
  {
    name: "Cerámica",
    image: "/img/cat-ceramica.jpg",
    description: "La arcilla transformada en objeto de belleza",
  },
  {
    name: "Grabado",
    image: "/img/cat-grabado.jpg",
    description: "La huella y la matriz como poética única",
  },
  {
    name: "Danza",
    image: "/img/cat-danza.jpg",
    description: "El movimiento del cuerpo como poema en acción",
  },
]

export const allSpecialties = [
  "Pintura",
  "Escultura",
  "Fotografía",
  "Música",
  "Danza",
  "Teatro",
  "Arte digital",
  "Ilustración",
  "Performance",
  "Cerámica",
  "Grabado",
  "Diseño",
  "Arquitectura",
  "Moda",
  "Arte urbano",
]
