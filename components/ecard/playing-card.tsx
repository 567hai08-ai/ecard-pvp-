'use client'

import { useRef, useState } from 'react'
import type { CardType } from '@/lib/ecard/game'

interface PlayingCardProps {
  type: CardType
  faceUp: boolean
  selected?: boolean
  disabled?: boolean
  small?: boolean
  onSelect?: () => void
}

const MAX_TILT = 15

const INDEX_LETTER: Record<CardType, string> = {
  EMPEROR: 'E',
  SLAVE: 'S',
  CITIZEN: 'C',
}

function IndexGlyph({ type }: { type: CardType }) {
  // tiny corner-pip icon, mirrors the center emblem at a glance
  if (type === 'EMPEROR') {
    return (
      <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
        <path
          d="M4 17 L6 8 L10 13 L12 6 L14 13 L18 8 L20 17 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  if (type === 'SLAVE') {
    return (
      <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
        <circle cx="9" cy="10" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="15" cy="14" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <path
        d="M8 6 Q12 3 16 6 Q18 12 14 19 Q12 21 10 19 Q6 12 8 6 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Emblem({ type }: { type: CardType }) {
  if (type === 'EMPEROR') {
    // regal crown with a heavy base and jewel, meant to feel authoritative and almost predatory
    return (
      <svg viewBox="0 0 100 100" width="62%" role="img" aria-label="Emperor crown">
        <defs>
          <radialGradient id="emp-glow" cx="50%" cy="38%" r="55%">
            <stop offset="0%" stopColor="rgba(217,180,106,0.4)" />
            <stop offset="100%" stopColor="rgba(217,180,106,0)" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="42" r="42" fill="url(#emp-glow)" />
        <g fill="none" stroke="var(--gold)" strokeWidth="2.2" strokeLinejoin="round">
          <path d="M22 72 L26 35 L38 54 L50 24 L62 54 L74 35 L78 72 Z" />
          <path d="M26 72 L74 72 L72 82 L28 82 Z" fill="#1b120b" />
          <path d="M50 18 L44 34 L50 28 L56 34 Z" fill="var(--gold)" />
          <circle cx="50" cy="26" r="4.2" fill="#f5e3a3" />
          <circle cx="34" cy="42" r="2.7" fill="var(--gold)" />
          <circle cx="66" cy="42" r="2.7" fill="var(--gold)" />
          <path d="M50 76 L50 92" stroke="var(--gold)" strokeWidth="2.2" />
          <path d="M44 86 L56 86" stroke="var(--gold)" strokeWidth="2.2" />
          <path d="M42 66 L58 66" stroke="#7a1f20" strokeWidth="1.4" opacity="0.8" />
        </g>
      </svg>
    )
  }
  if (type === 'SLAVE') {
    // a bowed human figure with chains around the wrists, meant to feel bound and broken
    return (
      <svg viewBox="0 0 100 100" width="62%" role="img" aria-label="Slave broken chains">
        <defs>
          <radialGradient id="slv-glow" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="rgba(158,42,43,0.4)" />
            <stop offset="100%" stopColor="rgba(158,42,43,0)" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="48" r="42" fill="url(#slv-glow)" />
        <g fill="none" stroke="var(--blood)" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M40 70 C36 58 37 46 44 36 C49 28 57 24 64 24 C71 24 76 28 79 36 C82 44 80 58 74 69" />
          <path d="M40 70 C31 70 25 78 24 85" />
          <path d="M74 69 C82 70 88 77 89 84" />
          <path d="M44 38 C42 44 39 48 33 49" />
          <path d="M71 38 C73 44 76 48 82 49" />
          <path d="M43 56 L58 58" />
          <path d="M48 34 L34 24" />
          <path d="M66 34 L80 24" />
          <path d="M42 72 L54 77" />
          <path d="M58 77 L70 72" />
        </g>
        <path d="M41 62 C48 56 56 54 63 56" stroke="#ff9999" strokeWidth="1.3" opacity="0.95" />
        <circle cx="39" cy="35" r="3.2" fill="var(--blood)" />
        <circle cx="72" cy="35" r="3.2" fill="var(--blood)" />
      </svg>
    )
  }
  // a worn commoner figure with a bowed head and rough shoulders
  return (
    <svg viewBox="0 0 100 100" width="56%" role="img" aria-label="Citizen figure">
      <defs>
        <radialGradient id="cit-glow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="rgba(140,150,158,0.22)" />
          <stop offset="100%" stopColor="rgba(140,150,158,0)" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="48" r="40" fill="url(#cit-glow)" />
      <g fill="none" stroke="var(--citizen)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M38 24 C43 16 57 16 62 24 C66 30 66 40 62 46 C58 52 54 56 50 56 C46 56 42 52 38 46 C34 40 34 30 38 24 Z" />
        <path d="M36 50 C41 58 44 64 50 64 C56 64 59 58 64 50" />
        <path d="M34 72 C40 81 44 87 50 88 C56 87 60 81 66 72" />
        <path d="M32 56 C37 62 39 68 44 74" />
        <path d="M68 56 C63 62 61 68 56 74" />
        <path d="M44 34 L50 40 L56 34" />
      </g>
      <path d="M40 30 Q50 24 60 30" stroke="#0a0805" strokeWidth="1.2" opacity="0.75" />
    </svg>
  )
}

export function PlayingCard({
  type,
  faceUp,
  selected = false,
  disabled = false,
  small = false,
  onSelect,
}: PlayingCardProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const w = small ? 64 : 92
  const h = small ? 96 : 138

  function applyTilt(clientX: number, clientY: number) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (clientX - rect.left) / rect.width - 0.5
    const py = (clientY - rect.top) / rect.height - 0.5
    setTilt({
      x: Math.max(-MAX_TILT, Math.min(MAX_TILT, px * MAX_TILT * 2)),
      y: Math.max(-MAX_TILT, Math.min(MAX_TILT, -py * MAX_TILT * 2)),
    })
  }

  function reset() {
    setTilt({ x: 0, y: 0 })
  }

  const rim = type === 'EMPEROR' ? 'var(--gold)' : type === 'SLAVE' ? 'var(--blood)' : 'var(--border)'
  const indexColor = type === 'EMPEROR' ? 'var(--gold)' : type === 'SLAVE' ? 'var(--blood)' : 'var(--citizen)'

  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      onClick={() => onSelect?.()}
      onMouseMove={(e) => !small && applyTilt(e.clientX, e.clientY)}
      onMouseLeave={reset}
      onTouchStart={(e) => {
        const t = e.touches[0]
        if (t && !small) applyTilt(t.clientX, t.clientY)
      }}
      onTouchMove={(e) => {
        const t = e.touches[0]
        if (t && !small) applyTilt(t.clientX, t.clientY)
      }}
      onTouchEnd={reset}
      className="relative shrink-0 rounded-md disabled:cursor-not-allowed"
      style={{
        width: w,
        height: h,
        perspective: 1000,
        cursor: disabled ? 'not-allowed' : 'pointer',
        outline: 'none',
      }}
      aria-pressed={selected}
      aria-label={faceUp ? `${type} card` : 'Face-down card'}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          willChange: 'transform, filter',
          transition: 'transform 0.2s ease-out, filter 0.3s ease-out',
          transform: selected
            ? 'translateY(-24px) translateZ(30px) rotateY(5deg)'
            : `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translateZ(8px)`,
          filter: selected
            ? `drop-shadow(0 26px 22px rgba(0,0,0,0.9)) drop-shadow(0 0 14px ${rim})`
            : `drop-shadow(${-tilt.x * 1.4}px ${tilt.y * 1.4}px 12px rgba(0,0,0,0.85))`,
        }}
      >
        {faceUp ? (
          <div
            className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[7px]"
            style={{
              background: 'radial-gradient(circle at 50% 32%, #241d15 0%, var(--parchment) 58%, #0a0805 100%)',
              border: `1.5px solid ${rim}`,
              boxShadow: `inset 0 0 0 1px rgba(0,0,0,0.6), inset 0 0 22px rgba(0,0,0,0.75), 0 0 8px ${
                selected ? rim : 'transparent'
              }`,
            }}
          >
            {/* inner filigree line, set slightly in from the outer rim */}
            <div
              className="pointer-events-none absolute rounded-[4px]"
              style={{
                inset: small ? 3 : 5,
                border: `1px solid ${rim}`,
                opacity: 0.55,
              }}
            />
            {/* corner index pips */}
            {!small && (
              <>
                <div
                  className="pointer-events-none absolute left-[6px] top-[5px] flex flex-col items-center gap-0.5"
                  style={{ color: indexColor }}
                >
                  <span className="font-display text-[11px] font-bold leading-none">{INDEX_LETTER[type]}</span>
                  <div style={{ width: 9, height: 9 }}>
                    <IndexGlyph type={type} />
                  </div>
                </div>
                <div
                  className="pointer-events-none absolute bottom-[5px] right-[6px] flex rotate-180 flex-col items-center gap-0.5"
                  style={{ color: indexColor }}
                >
                  <span className="font-display text-[11px] font-bold leading-none">{INDEX_LETTER[type]}</span>
                  <div style={{ width: 9, height: 9 }}>
                    <IndexGlyph type={type} />
                  </div>
                </div>
              </>
            )}
            <Emblem type={type} />
            {!small && (
              <div
                className="pointer-events-none absolute bottom-[14px] text-[9px] font-black uppercase tracking-[0.34em]"
                style={{
                  color: indexColor,
                  textShadow: '0 0 8px rgba(0,0,0,0.72)',
                }}
              >
                {type === 'EMPEROR' ? 'VUA' : type === 'SLAVE' ? 'NÔ LỆ' : 'DÂN'}
              </div>
            )}
          </div>
        ) : (
          <div
            className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[7px]"
            style={{
              background: 'repeating-linear-gradient(45deg, #17130c, #17130c 6px, #120f09 6px, #120f09 12px)',
              border: '1.5px solid var(--gold-dim)',
              boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.6), inset 0 0 18px rgba(0,0,0,0.85)',
            }}
          >
            <div
              className="pointer-events-none absolute rounded-[4px]"
              style={{ inset: 4, border: '1px solid var(--gold-dim)', opacity: 0.6 }}
            />
            <svg viewBox="0 0 40 40" width="42%" aria-hidden="true">
              <circle cx="20" cy="20" r="14" fill="none" stroke="var(--gold-dim)" strokeWidth="1.5" />
              <path d="M12 20 L20 10 L28 20 L20 30 Z" fill="none" stroke="var(--gold-dim)" strokeWidth="1.5" />
            </svg>
          </div>
        )}
      </div>
    </button>
  )
}
