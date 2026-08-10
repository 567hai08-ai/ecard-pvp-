'use client'

import type { Faction } from '@/lib/ecard/game'

interface SilhouetteProps {
  faction: Faction
  side: 'left' | 'right'
  /** 0-5, how deep the drill has advanced */
  drillProgress?: number
  /** true while the execution split is animating */
  split?: boolean
  /** 0..1, how badly the figure is hurt */
  injuryLevel?: number
  label: string
}

/**
 * PENSIVE FIGURE REDESIGN v2 — chin-on-fist seated silhouette, styled after
 * the classic "two men brooding over a game board" chiaroscuro composition:
 * a hooded, cloaked bust leaning forward in thought, warm rim-lit like a
 * single candle on the table between them. Pure SVG/CSS, no external art.
 *
 * Kẻ Vô Danh (Left/Slave, crimson rim, tattered collar) vs
 * Hyodo (Right/Emperor, gold rim, structured epaulette collar).
 */
export function Silhouette({ faction, side, drillProgress = 0, split = false, injuryLevel = 0, label }: SilhouetteProps) {
  const isLeft = side === 'left'
  const glowColor = isLeft ? '#9e2a2b' : '#b3914a'
  const glowSoft = isLeft ? '#c8484a' : '#d9bb72'
  const flickerDelay = isLeft ? '0s' : '1.3s' // desynced so both sides never flicker in unison
  const gradId = `rim-${side}-${faction}`
  const auraId = `aura-${side}-${faction}`
  const isInDanger = split || drillProgress > 0
  const injury = Math.max(0, Math.min(1, injuryLevel))
  const poseTransform = split
    ? isLeft
      ? 'translate(24px,-40px) rotate(11deg)'
      : 'translate(-24px,-40px) rotate(-11deg)'
    : drillProgress > 0
      ? isLeft
        ? 'translate(4px,6px) rotate(-3deg)'
        : 'translate(-4px,6px) rotate(3deg)'
      : injury > 0.55
        ? isLeft
          ? 'translate(2px,8px) rotate(-2deg)'
          : 'translate(-2px,8px) rotate(2deg)'
        : injury > 0.2
          ? isLeft
            ? 'translate(1px,3px) rotate(-1deg)'
            : 'translate(-1px,3px) rotate(1deg)'
          : 'none'

  return (
    <div
      className="relative flex flex-col items-center justify-end select-none"
      style={{ width: 176, height: 200 }}
      aria-label={label}
    >
      <div
        className="relative transition-transform duration-[2000ms] ease-[cubic-bezier(0.1,0.8,0.3,1)]"
        style={{
          width: 132,
          height: 176,
          animation: `candle-rim-flicker 4.2s ease-in-out infinite`,
          animationDelay: flickerDelay,
          filter: `drop-shadow(0 0 15px ${glowColor})`,
          transform: poseTransform,
        }}
      >
        {/* Soft ambient candle-glow pooling behind the figure */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 150,
            height: 150,
            left: isLeft ? -10 : -8,
            top: 10,
            background: `radial-gradient(circle, ${glowColor}33 0%, transparent 70%)`,
          }}
        />

        <svg
          viewBox="0 0 132 176"
          width={132}
          height={176}
          style={{ transform: isLeft ? 'none' : 'scaleX(-1)', position: 'relative' }}
        >
          <defs>
            {/* Rim-lit body gradient: near-black core, warm edge catching the candle */}
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="20%">
              <stop offset="0%" stopColor="#050506" />
              <stop offset="62%" stopColor="#0a0a0d" />
              <stop offset="88%" stopColor={glowColor} stopOpacity="0.55" />
              <stop offset="100%" stopColor={glowSoft} stopOpacity="0.85" />
            </linearGradient>
            <radialGradient id={auraId} cx="70%" cy="30%" r="70%">
              <stop offset="0%" stopColor={glowSoft} stopOpacity="0.25" />
              <stop offset="100%" stopColor={glowSoft} stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect x="0" y="0" width="132" height="176" rx="10" fill="#060607" />
          <rect x="10" y="12" width="112" height="152" rx="8" fill="#0b0b0d" stroke="#3d2412" strokeWidth="1.2" />
          <path d="M 18 132 Q 66 110 114 132" stroke="#7a1f20" strokeWidth="1.2" fill="none" opacity="0.65" />
          <circle cx="66" cy="78" r="38" fill="none" stroke="#5d2017" strokeWidth="1.1" opacity="0.6" />
          <path d="M 34 88 L 98 88" stroke="#2d1612" strokeWidth="1" opacity="0.8" />
          <path d="M 34 112 L 98 112" stroke="#2d1612" strokeWidth="1" opacity="0.8" />
          <path d="M 34 84 Q 54 72 66 54 Q 78 72 98 84" stroke="#4f140d" strokeWidth="1.1" fill="none" opacity="0.8" />
          <path d="M 54 28 L 62 18 L 70 28" stroke="#caa35d" strokeWidth="1.2" fill="none" opacity="0.8" />
          <path d="M 56 16 L 66 10 L 76 18" stroke="#7d2c20" strokeWidth="1.2" fill="none" opacity="0.75" />
          <path d="M 28 140 L 104 140" stroke="#6f4a20" strokeWidth="0.8" opacity="0.8" />
          <path d="M 28 154 L 104 154" stroke="#6f4a20" strokeWidth="0.8" opacity="0.8" />
          <path d="M 35 136 L 35 162" stroke="#6f4a20" strokeWidth="0.8" opacity="0.7" />
          <path d="M 66 136 L 66 162" stroke="#6f4a20" strokeWidth="0.8" opacity="0.7" />
          <path d="M 97 136 L 97 162" stroke="#6f4a20" strokeWidth="0.8" opacity="0.7" />
          <rect x="22" y="128" width="88" height="28" rx="7" fill="#100a07" stroke="#5f4121" strokeWidth="1" />
          <rect x="28" y="132" width="76" height="20" rx="5" fill="#1b130d" stroke="#6e4b1d" strokeWidth="1" />

          <path
            d="M 24 176 L 19 120 Q 17 94 33 77 L 49 63 Q 58 55 66 55 L 79 55 Q 89 55 93 67 L 97 120 Q 99 150 101 176 Z"
            fill={`url(#${gradId})`}
          />
          <path d="M 44 84 Q 40 118 42 158" stroke="#000" strokeWidth="1.4" fill="none" opacity="0.45" />
          <path d="M 64 70 Q 62 106 63 168" stroke="#000" strokeWidth="1.2" fill="none" opacity="0.35" />
          <path d="M 82 80 Q 86 116 88 160" stroke="#000" strokeWidth="1.4" fill="none" opacity="0.4" />

          <path d="M 44 92 Q 37 110 34 130 Q 32 147 35 160" stroke="#08080a" strokeWidth="3" fill="none" opacity="0.8" />
          <path d="M 69 90 Q 76 109 78 130 Q 80 147 77 160" stroke="#08080a" strokeWidth="3" fill="none" opacity="0.8" />
          {injury > 0.2 && (
            <path
              d={isLeft ? 'M 56 70 C 53 82 49 94 46 108' : 'M 56 70 C 59 82 63 94 66 108'}
              stroke={injury > 0.55 ? '#ff5b5b' : '#8d1f1f'}
              strokeWidth={1.2 + injury * 0.6}
              fill="none"
              opacity={0.45 + injury * 0.25}
            />
          )}
          <path
            d={isLeft ? 'M 48 74 Q 42 58 39 42 Q 37 28 44 24 Q 52 18 58 29 Q 62 38 62 56 Q 62 64 58 72 Z' : 'M 48 74 Q 54 58 57 42 Q 59 28 52 24 Q 44 18 38 29 Q 34 38 34 56 Q 34 64 38 72 Z'}
            fill="#08080b"
          />
          <ellipse cx="58" cy="43" rx="13" ry="15" fill={`url(#${gradId})`} />
          <path d="M 48 63 Q 58 55 69 58" stroke={glowSoft} strokeWidth="1.1" fill="none" opacity="0.85" />
          <path d="M 46 72 Q 56 62 69 68" stroke="#000" strokeWidth="2" fill="none" opacity="0.6" />
          <path d="M 46 54 Q 42 44 40 35" stroke={glowSoft} strokeWidth="1.2" fill="none" opacity="0.9" />
          <path d="M 62 54 Q 68 44 74 35" stroke={glowSoft} strokeWidth="1.2" fill="none" opacity="0.9" />
          <path d="M 55 58 Q 62 66 70 60" stroke="#000" strokeWidth="1.8" fill="none" opacity="0.65" />
          <path d="M 50 59 L 67 59 L 74 69 L 56 69 Z" fill="#0a0a0d" opacity="0.8" />
          <path d="M 53 29 Q 58 22 64 22" stroke="#8a0f15" strokeWidth="1.8" fill="none" opacity="0.85" />
          <path d="M 44 32 Q 48 24 54 18" stroke="#8a0f15" strokeWidth="1.3" fill="none" opacity="0.75" />
          <path d="M 63 32 Q 68 24 74 18" stroke="#8a0f15" strokeWidth="1.3" fill="none" opacity="0.75" />
          {isInDanger && (
            <>
              <path d="M 52 31 C 56 34 60 35 64 34" stroke="#ff4d4d" strokeWidth="1.6" fill="none" opacity="0.95" />
              <path d="M 58 24 L 64 18" stroke="#ff4d4d" strokeWidth="2" fill="none" />
              <path d="M 63 18 L 68 14" stroke="#ff4d4d" strokeWidth="1.6" fill="none" />
              <circle cx="54" cy="33" r="2.2" fill="#ff6b6b" opacity="0.95" />
            </>
          )}

          <path d="M 82 40 Q 87 48 82 56" stroke={glowSoft} strokeWidth="1" fill="none" opacity="0.5" />
          <path d="M 52 60 Q 66 68 84 60" stroke="#000" strokeWidth="2" fill="none" opacity="0.6" />

          <path d="M 91 129 Q 104 126 113 133 L 113 150 Q 100 155 89 150 Z" fill="#07070a" />
          <path d="M 96 150 L 96 156 M 102 151 L 102 158 M 108 150 L 109 157" stroke="#000" strokeWidth="1.6" opacity="0.4" strokeLinecap="round" />
          <rect x="20" y="158" width="80" height="18" rx="4" fill="#07070a" />

          <path
            d="M 24 176 L 19 120 Q 17 94 33 77 L 49 63 Q 58 55 66 55 L 79 55 Q 89 55 93 67 L 97 120 Q 99 150 101 176 Z"
            fill={`url(#${auraId})`}
          />
        </svg>
      </div>

      {/* Crimson slice line during execution */}
      {split && (
        <div
          className="absolute top-1/2 left-[-20px] right-[-20px] h-[3px] bg-[#ff2222] z-10 rotate-[-5deg]"
          style={{ filter: 'drop-shadow(0 0 6px #ff0000)' }}
        />
      )}

      {/* Mechanical ear-drill advancing toward the head - kept for game logic */}
      {drillProgress > 0 && !split && (
        <div
          className="absolute top-[34px] z-20"
          style={{
            left: isLeft ? 118 : -30,
            transform: `translateX(${isLeft ? -drillProgress * 16 : drillProgress * 16}px) ${!isLeft ? 'scaleX(-1)' : ''}`,
            transition: 'transform 0.4s ease-out',
            willChange: 'transform',
          }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 60 24" width={60} height={24}>
            <rect x="30" y="8" width="26" height="8" rx="1" fill="#3a3a42" stroke="#6b6b75" strokeWidth="0.6" />
            <rect x="24" y="9.5" width="8" height="5" fill="#8a8a94" />
            <polygon points="24,12 8,7 8,17" fill="#b7b7c0" stroke="#dcdce4" strokeWidth="0.5" />
            <line x1="14" y1="9" x2="20" y2="11" stroke="#5a5a63" strokeWidth="0.5" />
            <line x1="14" y1="15" x2="20" y2="13" stroke="#5a5a63" strokeWidth="0.5" />
          </svg>
        </div>
      )}
    </div>
  )
}
