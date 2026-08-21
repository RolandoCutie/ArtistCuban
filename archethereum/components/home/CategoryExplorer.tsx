'use client'

import { useTranslation } from '@/components/LanguageProvider'
import { categories, categorySlug } from '@/lib/categories'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function CategoryExplorer() {
  const { t } = useTranslation()
  return (
    <section id="categorias" className="border-t border-border bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
        <div className="mb-16 max-w-2xl">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-foreground/40">
            {t.home.categoriesLabel}
          </p>
          <h2 className="font-heading text-5xl font-light leading-none md:text-7xl">
            {t.home.categoriesTitle} <span className="italic">{t.home.categoriesTitleItalic}</span>
          </h2>
          <p className="mt-6 text-lg text-foreground/50">
            {t.home.categoriesDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <Link
                href={`/artistas/categoria/${categorySlug(cat.name)}`}
                className="group relative flex items-center gap-5 overflow-hidden rounded-lg border border-border p-4 transition-colors hover:border-foreground"
              >
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-heading text-xl font-medium">{cat.name}</p>
                  <p className="truncate text-sm text-foreground/50">{cat.description}</p>
                </div>
                <span className="shrink-0 text-xs uppercase tracking-widest text-foreground/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {t.home.categoriesView}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
