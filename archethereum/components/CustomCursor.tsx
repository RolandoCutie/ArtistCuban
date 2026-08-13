'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [visible, setVisible] = useState(false)
  const [isPointer, setIsPointer] = useState(false)
  const ringRef = useRef<{ x: number; y: number }>({ x: -100, y: -100 })
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 })
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches
    if (isTouchDevice) return

    document.body.classList.add('cursor-none')

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY })
      ringRef.current = { x: e.clientX, y: e.clientY }
      setVisible(true)

      const el = document.elementFromPoint(e.clientX, e.clientY)
      if (el) {
        const tag = el.tagName.toLowerCase()
        const role = el.getAttribute('role')
        const dataCursor = el.getAttribute('data-cursor')
        const closestInteractive = el.closest('a, button, input, [role="button"], [data-cursor="view"]')
        setIsPointer(!!(tag === 'a' || tag === 'button' || tag === 'input' || role === 'button' || dataCursor || closestInteractive))
      }
    }

    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    const animateRing = () => {
      setRingPos((prev) => ({
        x: prev.x + (ringRef.current.x - prev.x) * 0.15,
        y: prev.y + (ringRef.current.y - prev.y) * 0.15,
      }))
      rafRef.current = requestAnimationFrame(animateRing)
    }
    rafRef.current = requestAnimationFrame(animateRing)

    return () => {
      document.body.classList.remove('cursor-none')
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const dotSize = 8
  const ringSize = isPointer ? 48 : 32

  return (
    <>
      {/* Dot — mix-blend-mode:difference hace que sea visible sobre cualquier fondo */}
      <div
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden md:block rounded-full transition-opacity duration-200"
        style={{
          width: dotSize,
          height: dotSize,
          transform: `translate(${pos.x}px, ${pos.y}px)`,
          marginLeft: -dotSize / 2,
          marginTop: -dotSize / 2,
          opacity: visible ? 1 : 0,
          backgroundColor: 'white',
          mixBlendMode: 'difference',
        }}
      />
      {/* Ring */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9998] hidden md:flex items-center justify-center rounded-full"
        style={{
          width: ringSize,
          height: ringSize,
          transform: `translate(${ringPos.x}px, ${ringPos.y}px)`,
          marginLeft: -ringSize / 2,
          marginTop: -ringSize / 2,
          opacity: visible ? 1 : 0,
          border: '1.5px solid white',
          mixBlendMode: 'difference',
        }}
        animate={{
          width: ringSize,
          height: ringSize,
          marginLeft: -ringSize / 2,
          marginTop: -ringSize / 2,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 250 }}
      >
        {isPointer && (
          <span className="text-[8px] uppercase tracking-widest text-white select-none">
            Ver
          </span>
        )}
      </motion.div>
    </>
  )
}
