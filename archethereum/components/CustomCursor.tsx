'use client'

import { useEffect, useRef } from 'react'

// Zero React re-renders: todo via refs directas al DOM + RAF
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches
    if (isTouchDevice) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    document.body.classList.add('cursor-none')

    const mouse = { x: -100, y: -100 }
    const ringPos = { x: -100, y: -100 }
    let isPointer = false
    let rafId: number

    const applyDot = () => {
      dot.style.transform = `translate(${mouse.x - 4}px, ${mouse.y - 4}px)`
    }

    const applyRing = () => {
      ring.style.transform = `translate(${ringPos.x - 20}px, ${ringPos.y - 20}px)`
    }

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      applyDot()
      dot.style.opacity = '1'

      const el = document.elementFromPoint(e.clientX, e.clientY)
      const wasPointer = isPointer
      isPointer = !!(el?.closest('a, button, input, [role="button"], [data-cursor="view"]'))
      if (isPointer !== wasPointer) {
        const s = ring.style as CSSStyleDeclaration & { '--ring-size': string }
        ring.style.width = isPointer ? '48px' : '32px'
        ring.style.height = isPointer ? '48px' : '32px'
        ring.style.marginLeft = isPointer ? '-24px' : '-16px'
        ring.style.marginTop = isPointer ? '-24px' : '-16px'
      }
    }

    const onLeave = () => { dot.style.opacity = '0'; ring.style.opacity = '0' }
    const onEnter = () => { dot.style.opacity = '1'; ring.style.opacity = '1' }

    const tick = () => {
      ringPos.x += (mouse.x - ringPos.x) * 0.15
      ringPos.y += (mouse.y - ringPos.y) * 0.15
      applyRing()
      ring.style.opacity = dot.style.opacity
      rafId = requestAnimationFrame(tick)
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    rafId = requestAnimationFrame(tick)

    return () => {
      document.body.classList.remove('cursor-none')
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden md:block"
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: 'white',
          mixBlendMode: 'difference',
          opacity: 0,
          willChange: 'transform',
        }}
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[9998] hidden md:block"
        style={{
          width: 32,
          height: 32,
          marginLeft: -16,
          marginTop: -16,
          borderRadius: '50%',
          border: '1.5px solid white',
          mixBlendMode: 'difference',
          opacity: 0,
          willChange: 'transform',
          transition: 'width 0.2s ease, height 0.2s ease, margin 0.2s ease',
        }}
      />
    </>
  )
}
