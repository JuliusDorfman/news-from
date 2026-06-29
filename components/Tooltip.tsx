'use client'
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'

type Tip = { content: ReactNode; x: number; y: number }
type Ctx = { show: (content: ReactNode, x: number, y: number, autoHide?: boolean) => void; hide: () => void }
const TooltipCtx = createContext<Ctx | null>(null)

export function TooltipProvider({ children }: { children: ReactNode }) {
  const [tip, setTip] = useState<Tip | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const show = useCallback((content: ReactNode, x: number, y: number, autoHide = false) => {
    if (timer.current) { clearTimeout(timer.current); timer.current = null }
    setTip({ content, x, y })
    if (autoHide) timer.current = setTimeout(() => setTip(null), 2200)
  }, [])
  const hide = useCallback(() => {
    if (timer.current) { clearTimeout(timer.current); timer.current = null }
    setTip(null)
  }, [])
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  let style: React.CSSProperties = { left: 0, top: 0 }
  if (tip) {
    const pad = 14, w = 256, h = 96
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1024
    const vh = typeof window !== 'undefined' ? window.innerHeight : 768
    const left = tip.x + pad + w > vw ? tip.x - w - pad : tip.x + pad
    const top = tip.y + pad + h > vh ? tip.y - h - pad : tip.y + pad
    style = { left: Math.max(8, left), top: Math.max(8, top) }
  }

  return (
    <TooltipCtx.Provider value={{ show, hide }}>
      {children}
      {tip && (
        <div
          role="tooltip"
          className="pointer-events-none fixed z-50 w-max max-w-[16rem] rounded-md border border-black/10 bg-paper px-3 py-2 text-xs leading-snug text-ink shadow-lg"
          style={style}
        >
          {tip.content}
        </div>
      )}
    </TooltipCtx.Provider>
  )
}

export function useTooltip() {
  const ctx = useContext(TooltipCtx)
  return useCallback((content: ReactNode) => {
    if (!ctx) return {}
    return {
      onPointerMove: (e: React.PointerEvent) => { if (e.pointerType !== 'touch') ctx.show(content, e.clientX, e.clientY) },
      onPointerLeave: (e: React.PointerEvent) => { if (e.pointerType !== 'touch') ctx.hide() },
      onPointerDown: (e: React.PointerEvent) => { if (e.pointerType === 'touch') ctx.show(content, e.clientX, e.clientY, true) },
      onPointerCancel: (e: React.PointerEvent) => { if (e.pointerType === 'touch') ctx.hide() },
    }
  }, [ctx])
}
