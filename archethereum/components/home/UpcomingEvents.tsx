'use client'

import { useTranslation } from '@/components/LanguageProvider'
import { ArrowRight, MapPin } from 'lucide-react'

interface EventItem {
  _id: string
  title: string
  date: string
  time?: string
  venue?: string
  city?: string
  country?: string
  artist_name?: string
  ticket_url?: string
  type?: string
}

interface UpcomingEventsProps {
  events: EventItem[]
}

export default function UpcomingEvents({ events }: UpcomingEventsProps) {
  const { t, locale } = useTranslation()
  const dateLocale = locale === 'en' ? 'en-US' : 'es-ES'
  return (
    <section id="eventos" className="border-t border-border bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
        <div className="mb-16">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-foreground/40">{t.home.eventsLabel}</p>
          <h2 className="font-heading text-5xl font-light leading-none md:text-7xl">
            {t.home.eventsTitle} <span className="italic">{t.home.eventsTitleItalic}</span>
          </h2>
        </div>

        {events.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-foreground/30">
              {t.events.noEvents}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {events.map((event) => {
              const dateObj = new Date(event.date)
              const day = dateObj.toLocaleDateString(dateLocale, { day: '2-digit' })
              const month = dateObj.toLocaleDateString(dateLocale, { month: 'short' })
              const year = dateObj.getFullYear()

              return (
                <div
                  key={event._id}
                  className="grid grid-cols-12 items-center gap-4 border-b border-border py-6 hover:bg-muted/30 transition-colors px-2"
                >
                  {/* Fecha */}
                  <div className="col-span-3 sm:col-span-2">
                    <p className="font-heading text-4xl font-light leading-none">{day}</p>
                    <p className="mt-1 text-xs uppercase tracking-widest text-foreground/40">
                      {month} {year}
                    </p>
                  </div>

                  {/* Título */}
                  <div className="col-span-9 sm:col-span-5">
                    <p className="font-heading text-xl font-medium leading-tight">{event.title}</p>
                    {event.type && (
                      <p className="mt-1 text-sm text-foreground/50">{event.type}</p>
                    )}
                    {event.artist_name && (
                      <p className="text-sm text-foreground/40">{event.artist_name}</p>
                    )}
                  </div>

                  {/* Ubicación */}
                  <div className="hidden sm:flex sm:col-span-3 items-start gap-2 text-sm text-foreground/50">
                    <MapPin size={14} className="mt-1 shrink-0" />
                    <div>
                      {event.venue && <p className="leading-tight">{event.venue}</p>}
                      {(event.city || event.country) && (
                        <p className="text-xs text-foreground/40">
                          {[event.city, event.country].filter(Boolean).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="col-span-12 sm:col-span-2 flex justify-start sm:justify-end">
                    {event.ticket_url ? (
                      <a
                        href={event.ticket_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs uppercase tracking-widest hover:border-foreground transition-colors"
                      >
                        {t.events.getTickets} <ArrowRight size={12} />
                      </a>
                    ) : (
                      <span className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs uppercase tracking-widest text-foreground/40">
                        Gratuito
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
