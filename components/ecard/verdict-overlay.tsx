"use client"

import { useEffect, useRef, useState } from "react"

interface VerdictOverlayProps {
  /** 'despair' = defeat, 'survived' = victory, null = hidden */
  verdict: "despair" | "survived" | null
  onComplete?: () => void
}

/**
 * A restrained full-screen verdict card: the tone is bleak rather than
 * triumphant, and the ending feels more human than theatrical.
 */
export function VerdictOverlay({ verdict, onComplete }: VerdictOverlayProps) {
  const [stage, setStage] = useState<"enter" | "hold" | "out">("enter")
  const doneRef = useRef(onComplete)
  doneRef.current = onComplete

  useEffect(() => {
    if (!verdict) return
    setStage("enter")
    const t1 = window.setTimeout(() => setStage("hold"), 500)
    const t2 = window.setTimeout(() => setStage("out"), 2600)
    const t3 = window.setTimeout(() => doneRef.current?.(), 3200)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.clearTimeout(t3)
    }
  }, [verdict])

  if (!verdict) return null

  const isDespair = verdict === "despair"

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center overflow-hidden scanlines"
      role="alertdialog"
      aria-live="assertive"
      aria-label={isDespair ? "Tuyệt vọng — bạn đã thua" : "Sống sót — bạn đã thắng"}
      style={{
        opacity: stage === "out" ? 0 : 1,
        transition: "opacity 0.6s ease",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isDespair
            ? "radial-gradient(circle at center, rgba(75, 10, 10, 0.82), rgba(8, 3, 3, 0.95))"
            : "radial-gradient(circle at center, rgba(46, 35, 14, 0.8), rgba(8, 6, 2, 0.94))",
        }}
      />

      <div className="relative flex flex-col items-center px-6 text-center">
        <span
          className="font-display uppercase leading-none"
          style={{
            fontSize: "clamp(2.7rem, 9vw, 5.8rem)",
            color: isDespair ? "#ff7070" : "#f3dd9b",
            letterSpacing: "0.14em",
            transform: stage === "enter" ? "scale(0.96)" : "scale(1)",
            transition: "transform 0.45s cubic-bezier(0.2,0.9,0.2,1)",
            textShadow: isDespair
              ? "0 0 18px rgba(255, 0, 0, 0.35)"
              : "0 0 18px rgba(245, 217, 122, 0.26)",
          }}
        >
          {isDespair ? "TỪ BỎ" : "SỐNG SÓT"}
        </span>
        <span
          className="mt-4 max-w-md font-mono text-[11px] uppercase tracking-[0.38em] md:text-sm"
          style={{
            color: isDespair ? "rgba(255, 212, 212, 0.86)" : "rgba(250, 228, 165, 0.9)",
            opacity: stage === "enter" ? 0.7 : 1,
            transition: "opacity 0.5s ease 0.2s",
          }}
        >
          {isDespair ? "Bản án đã chạm đến ngươi." : "Ngươi đã đứng dậy khỏi bàn cược."}
        </span>
      </div>
    </div>
  )
}
