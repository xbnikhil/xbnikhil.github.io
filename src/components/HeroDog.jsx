import { useEffect, useRef, useState } from 'react'

const JUMP_MS = { 1: 780, 2: 920, 3: 860 }

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const lerp = (a, b, t) => a + (b - a) * t
const easeInOut = (t) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
const easeOut = (t) => 1 - Math.pow(1 - t, 3)

function setWalk(el, pos, moving, pace = 'walk') {
  if (moving !== pos.walking) {
    pos.walking = moving
    if (moving) el.dataset.walking = 'true'
    else delete el.dataset.walking
  }
  if (moving) {
    if (pace !== pos.pace) {
      pos.pace = pace
      el.dataset.pace = pace
    }
  } else if (el.dataset.pace) {
    delete el.dataset.pace
    pos.pace = 'walk'
  }
}

export default function HeroDog() {
  const dogRef = useRef(null)
  const heroRef = useRef(null)
  const headRef = useRef(null)
  const geomRef = useRef(null)
  const cursorRef = useRef({ x: 0, y: 0, seen: false, movedAt: 0 })
  const posRef = useRef({
    x: 40,
    y: 0,
    mode: 'hero',
    facing: 1,
    walking: false,
    pace: 'walk',
  })
  const phaseRef = useRef('chase')
  const busyRef = useRef(false)
  const tweenRef = useRef(null)
  const timersRef = useRef([])
  const jumpTimerRef = useRef(null)
  const lastVariantRef = useRef(0)
  const reducedRef = useRef(false)

  const [phase, setPhase] = useState('chase')
  const [expression, setExpression] = useState('idle')
  const [blinking, setBlinking] = useState(false)
  const [jump, setJump] = useState({ active: false, variant: 1, seq: 0 })

  function setPhaseBoth(next) {
    phaseRef.current = next
    setPhase(next)
  }

  function after(ms, fn) {
    const id = setTimeout(fn, ms)
    timersRef.current.push(id)
    return id
  }

  function triggerJump() {
    if (phaseRef.current !== 'chase' || busyRef.current) return
    let variant = 1 + Math.floor(Math.random() * 3)
    if (variant === lastVariantRef.current) variant = (variant % 3) + 1
    lastVariantRef.current = variant

    setJump((prev) => ({ active: true, variant, seq: prev.seq + 1 }))
    setExpression('excited')
    clearTimeout(jumpTimerRef.current)
    jumpTimerRef.current = setTimeout(() => {
      setJump((prev) => ({ ...prev, active: false }))
      if (phaseRef.current === 'chase') setExpression('idle')
    }, JUMP_MS[variant])
  }

  /* ---------- shy → corner → peek → return ---------- */

  function startShy() {
    if (busyRef.current) return
    busyRef.current = true
    clearTimeout(jumpTimerRef.current)
    setJump((prev) => ({ ...prev, active: false }))
    setExpression('shy')
    setPhaseBoth('shy')
    const el = dogRef.current
    if (el) setWalk(el, posRef.current, false)
    after(1000, runToCorner)
  }

  function runToCorner() {
    const el = dogRef.current
    if (!el) {
      busyRef.current = false
      return
    }
    const w = el.offsetWidth
    const h = el.offsetHeight
    const vw = window.innerWidth
    const vh = window.innerHeight
    const rect = el.getBoundingClientRect()

    posRef.current.mode = 'fixed'
    posRef.current.facing = 1
    posRef.current.x = rect.left
    posRef.current.y = rect.top
    el.dataset.fixed = 'true'
    el.style.setProperty('--facing', '1')
    el.style.transform = `translate3d(${rect.left}px, ${rect.top}px, 0)`
    setWalk(el, posRef.current, true, 'run')
    setPhaseBoth('flee')

    tweenRef.current = {
      x0: rect.left,
      y0: rect.top,
      x1: vw - w * 0.56,
      y1: vh - h * 0.62,
      t0: performance.now(),
      dur: 900,
      ease: easeInOut,
      onDone: () => {
        setPhaseBoth('hide')
        tweenRef.current = {
          x0: vw - w * 0.56,
          y0: vh - h * 0.62,
          x1: vw - w * 0.16,
          y1: vh - h * 0.1,
          t0: performance.now(),
          dur: 340,
          ease: easeInOut,
          onDone: () => {
            const dog = dogRef.current
            if (dog) setWalk(dog, posRef.current, false)
            after(650, peekOut)
          },
        }
      },
    }
  }

  function peekOut() {
    const el = dogRef.current
    if (!el) return
    const w = el.offsetWidth
    const h = el.offsetHeight
    const vw = window.innerWidth
    const vh = window.innerHeight

    posRef.current.facing = -1
    el.style.setProperty('--facing', '-1')
    setExpression('shy')
    setPhaseBoth('peek')
    tweenRef.current = {
      x0: posRef.current.x,
      y0: posRef.current.y,
      x1: vw - w * 0.62,
      y1: vh - h * 0.55,
      t0: performance.now(),
      dur: 420,
      ease: easeOut,
      onDone: () => after(1750, comeHome),
    }
  }

  function comeHome() {
    setPhaseBoth('return')
    after(300, () => {
      const el = dogRef.current
      const hero = heroRef.current
      if (!el || !hero) {
        busyRef.current = false
        return
      }
      const rect = hero.getBoundingClientRect()
      const w = el.offsetWidth
      const maxX = Math.max(4, rect.width - w - 6)
      const homeX = clamp(rect.width * 0.5, 4, maxX)

      el.removeAttribute('data-fixed')
      posRef.current = {
        x: homeX,
        y: 0,
        mode: 'hero',
        facing: 1,
        walking: false,
        pace: 'walk',
      }
      el.style.setProperty('--facing', '1')
      el.style.transform = `translate3d(${homeX}px, 0, 0)`
      setWalk(el, posRef.current, false)
      setPhaseBoth('recover')
      setExpression('shy')

      after(1200, () => {
        setExpression('idle')
        setPhaseBoth('chase')
        busyRef.current = false
      })
    })
  }

  function handleDogClick(event) {
    event.stopPropagation()
    event.preventDefault()
    startShy()
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      startShy()
    }
  }

  /* ---------- lifecycle: listeners, blink, animation loop ---------- */

  useEffect(() => {
    const el = dogRef.current
    if (!el) return undefined
    const hero = el.closest('.hero')
    if (!hero) return undefined
    heroRef.current = hero

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncReduced = () => {
      reducedRef.current = mq.matches
    }
    syncReduced()
    mq.addEventListener?.('change', syncReduced)

    const invalidateGeom = () => {
      geomRef.current = null
    }
    const ro = new ResizeObserver(invalidateGeom)
    ro.observe(hero)

    const onPointerMove = (event) => {
      cursorRef.current = {
        x: event.clientX,
        y: event.clientY,
        seen: true,
        movedAt: performance.now(),
      }
    }
    const onPointerOut = (event) => {
      if (!event.relatedTarget) cursorRef.current.seen = false
    }
    const onDocumentClick = (event) => {
      const target = event.target
      if (target instanceof Element && target.closest('.hero-dog')) return
      triggerJump()
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', onPointerMove, { passive: true })
    document.addEventListener('pointerout', onPointerOut)
    document.addEventListener('click', onDocumentClick)
    window.addEventListener('resize', invalidateGeom)
    window.addEventListener('scroll', invalidateGeom, { passive: true })

    // place the dog initially
    const initial = hero.getBoundingClientRect()
    const startX = clamp(initial.width * 0.16, 4, initial.width - el.offsetWidth - 6)
    posRef.current.x = startX
    el.style.transform = `translate3d(${startX}px, 0, 0)`
    geomRef.current = {
      left: initial.left,
      top: initial.top,
      width: initial.width,
      height: initial.height,
    }

    let frameId = 0
    let last = 0

    const updateFace = (now, w, h, geom, pos, currentPhase) => {
      let anchorX
      let anchorY
      if (pos.mode === 'fixed') {
        anchorX = pos.x + w * (pos.facing === 1 ? 0.72 : 0.28)
        anchorY = pos.y + h * 0.36
      } else {
        anchorX = geom.left + pos.x + w * (pos.facing === 1 ? 0.72 : 0.28)
        anchorY = geom.top + geom.height - h + h * 0.36
      }

      let lookX = 0
      let lookY = 0

      if (currentPhase === 'shy' || currentPhase === 'recover') {
        lookX = -1.6
        lookY = 2.6
      } else if (currentPhase === 'peek') {
        lookX = -3
        lookY = 0.8
      } else if (cursorRef.current.seen) {
        const dx = cursorRef.current.x - anchorX
        const dy = cursorRef.current.y - anchorY
        const dist = Math.max(24, Math.hypot(dx, dy))
        const strength = Math.min(1, dist / 170)
        lookX = (dx / dist) * 3.6 * strength
        lookY = (dy / dist) * 2.9 * strength
      }

      el.style.setProperty('--eye-x', `${(lookX * pos.facing).toFixed(2)}px`)
      el.style.setProperty('--eye-y', `${lookY.toFixed(2)}px`)

      if (headRef.current) {
        let tilt = 0
        if (currentPhase === 'shy' || currentPhase === 'recover') {
          tilt = 7
        } else if (currentPhase === 'peek') {
          tilt = -5
        } else if (cursorRef.current.seen) {
          const dx = cursorRef.current.x - anchorX
          tilt = clamp(dx / 34, -7, 7) * pos.facing
        }
        headRef.current.setAttribute(
          'transform',
          `rotate(${tilt.toFixed(2)} 132 96)`,
        )
      }

      return now
    }

    const frame = (now) => {
      frameId = requestAnimationFrame(frame)
      const step = now - last
      if (step < 30) return
      last = now

      const dog = dogRef.current
      if (!dog) return
      if (!geomRef.current) {
        const rect = hero.getBoundingClientRect()
        geomRef.current = {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        }
      }

      const geom = geomRef.current
      const pos = posRef.current
      const currentPhase = phaseRef.current
      const w = dog.offsetWidth
      const h = dog.offsetHeight

      if (currentPhase === 'chase' && !reducedRef.current) {
        const t = now / 1000
        const current = cursorRef.current
        const maxX = Math.max(4, geom.width - w - 6)
        let target

        if (current.seen && now - current.movedAt < 5200) {
          target = current.x - geom.left - w * 0.5
        } else {
          const span = Math.max(50, geom.width * 0.28)
          target = geom.width * 0.5 + Math.sin(t * 0.42) * span - w * 0.5
        }
        target = clamp(target, 4, maxX)

        const dx = target - pos.x
        const distance = Math.abs(dx)

        if (distance > 0.8) {
          const speed = Math.min(340, 60 + distance * 2.2)
          pos.x += Math.sign(dx) * Math.min(distance, (speed * step) / 1000)
          const want = dx > 0 ? 1 : -1
          if (want !== pos.facing) {
            pos.facing = want
            dog.style.setProperty('--facing', String(want))
          }
          setWalk(dog, pos, true, speed > 170 ? 'run' : 'walk')
        } else {
          setWalk(dog, pos, false)
        }

        pos.mode = 'hero'
        dog.style.transform = `translate3d(${pos.x}px, 0, 0)`
      } else if (
        currentPhase === 'flee' ||
        currentPhase === 'hide' ||
        currentPhase === 'peek'
      ) {
        const tw = tweenRef.current
        if (tw) {
          const progress = clamp((now - tw.t0) / tw.dur, 0, 1)
          const eased = tw.ease(progress)
          pos.x = lerp(tw.x0, tw.x1, eased)
          pos.y = lerp(tw.y0, tw.y1, eased)
          dog.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
          if (progress >= 1) {
            const done = tw.onDone
            tweenRef.current = null
            if (done) done()
          }
        }
      }

      updateFace(now, w, h, geom, pos, currentPhase)
    }

    frameId = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(frameId)
      ro.disconnect()
      mq.removeEventListener?.('change', syncReduced)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerMove)
      document.removeEventListener('pointerout', onPointerOut)
      document.removeEventListener('click', onDocumentClick)
      window.removeEventListener('resize', invalidateGeom)
      window.removeEventListener('scroll', invalidateGeom)
      clearTimeout(jumpTimerRef.current)
      timersRef.current.forEach(clearTimeout)
      timersRef.current = []
    }
  }, [])

  useEffect(() => {
    let alive = true
    let id

    function schedule() {
      id = setTimeout(
        () => {
          if (!alive) return
          setBlinking(true)
          setTimeout(() => {
            if (alive) setBlinking(false)
          }, 140)
          schedule()
        },
        2200 + Math.random() * 3400,
      )
    }

    schedule()
    return () => {
      alive = false
      clearTimeout(id)
    }
  }, [])

  const className = [
    'hero-dog',
    `phase-${phase}`,
    `expr-${expression}`,
    blinking ? 'is-blinking' : '',
    jump.active ? `is-jumping jump-${jump.variant}` : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      ref={dogRef}
      className={className}
      onClick={handleDogClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="A little dog — click to say hi and watch it get shy"
      title="Click me!"
    >
      <div className="dog-jump">
        <div className="dog-face">
          <div className="dog-bob">
            <svg
              className="dog-art"
              viewBox="0 0 210 160"
              aria-hidden="true"
              focusable="false"
            >
              <ellipse
                className="dog-shadow"
                cx="104"
                cy="151.5"
                rx="57"
                ry="6.5"
                fill="#1a1208"
                opacity="0.14"
              />

              <g className="dog-speedlines">
                <path className="dog-speedline sl-1" d="M 22 96 h 20" />
                <path className="dog-speedline sl-2" d="M 12 108 h 26" />
                <path className="dog-speedline sl-3" d="M 24 120 h 16" />
              </g>

              {/* tail */}
              <g className="dog-tail">
                <path
                  d="M 68 100 C 50 103 33 95 30 79 C 28 68 39 63 45 71 C 50 78 45 87 57 91 C 64 93 72 87 76 80 C 80 87 78 95 73 99 C 71 101 70 100 68 100 Z"
                  fill="#dc9d51"
                  stroke="#3f2817"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M 70 94 C 58 96 45 91 38 81"
                  fill="none"
                  stroke="#b87833"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  opacity="0.75"
                />
              </g>

              {/* far legs */}
              <g className="dog-leg dog-leg-hind-far">
                <path
                  d="M 80 104 C 73 115 70 129 73 141 C 74 147 84 147 85 141 L 87 123 L 94 104 Z"
                  fill="#b87c3a"
                  stroke="#3f2817"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M 75 140 q 4 3 8 0"
                  fill="none"
                  stroke="#3f2817"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  opacity="0.8"
                />
              </g>
              <g className="dog-leg dog-leg-front-far">
                <path
                  d="M 122 104 C 117 116 116 131 119 142 C 120 148 130 148 131 142 L 133 121 L 139 104 Z"
                  fill="#b87c3a"
                  stroke="#3f2817"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M 121 141 q 4 3 8 0"
                  fill="none"
                  stroke="#3f2817"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  opacity="0.8"
                />
              </g>

              {/* body */}
              <g className="dog-body">
                <path
                  d="M 62 103 C 56 87 68 75 88 71 C 108 67 128 73 137 83 C 145 93 141 111 131 120 C 119 130 92 132 78 126 C 68 121 64 112 62 103 Z"
                  fill="#e4a85e"
                  stroke="#3f2817"
                  strokeWidth="2.4"
                  strokeLinejoin="round"
                />
                <path
                  d="M 72 87 C 81 77 94 73 107 73 C 119 73 129 78 135 84"
                  fill="none"
                  stroke="#f4c78a"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  opacity="0.7"
                />
                <path
                  d="M 77 119 C 91 128 113 129 127 119 C 122 127 106 131 92 130 C 84 129 80 125 77 119 Z"
                  fill="#c98a45"
                  opacity="0.55"
                />
                <path
                  d="M 70 95 C 74 100 76 106 76 112"
                  fill="none"
                  stroke="#c98a45"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  opacity="0.5"
                />
                <path
                  d="M 133 85 C 143 93 146 107 139 118 C 134 125 124 129 115 127 C 123 121 127 112 126 103 C 125 94 128 87 133 85 Z"
                  fill="#f6e2c0"
                  stroke="#3f2817"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M 137 104 C 136 110 133 115 128 118"
                  fill="none"
                  stroke="#d9b98b"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.8"
                />
              </g>

              {/* near legs */}
              <g className="dog-leg dog-leg-hind-near">
                <path
                  d="M 86 107 C 79 118 77 132 80 143 C 81 149 91 149 92 143 L 94 124 L 100 107 Z"
                  fill="#e9ae64"
                  stroke="#3f2817"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                />
                <path
                  d="M 82 142 q 4 3 8 0"
                  fill="none"
                  stroke="#3f2817"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.85"
                />
              </g>
              <g className="dog-leg dog-leg-front-near">
                <path
                  d="M 129 104 C 124 117 123 133 126 144 C 127 150 137 150 138 144 L 140 121 L 146 104 Z"
                  fill="#e9ae64"
                  stroke="#3f2817"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                />
                <path
                  d="M 128 143 q 4 3 8 0"
                  fill="none"
                  stroke="#3f2817"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.85"
                />
                <path
                  d="M 133 112 C 132 120 132 130 133 138"
                  fill="none"
                  stroke="#d99a4e"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  opacity="0.55"
                />
              </g>

              {/* neck + collar */}
              <path
                d="M 120 93 C 117 79 124 68 136 65 L 151 76 C 147 91 141 101 132 106 Z"
                fill="#e9ae64"
                stroke="#3f2817"
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
              <g className="dog-collar">
                <path
                  d="M 121 92 C 127 102 140 107 153 104 L 156 113 C 142 117 128 111 119 99 Z"
                  fill="#6040f0"
                  stroke="#3f2817"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <circle
                  cx="155"
                  cy="108"
                  r="6.2"
                  fill="#c0a010"
                  stroke="#3f2817"
                  strokeWidth="1.6"
                />
                <circle cx="155" cy="108" r="2" fill="#3f2817" opacity="0.55" />
              </g>

              {/* head */}
              <g className="dog-head-motion">
                <g className="dog-head" ref={headRef}>
                  <g className="dog-ear dog-ear-far">
                    <path
                      d="M 160 23 C 172 12 190 17 192 31 C 194 42 185 50 176 45 C 167 40 163 31 160 23 Z"
                      fill="#9c6029"
                      stroke="#3f2817"
                      strokeWidth="2.2"
                      strokeLinejoin="round"
                    />
                  </g>

                  <path
                    d="M 122 52 C 122 33 135 21 151 21 C 168 21 181 34 181 50 C 181 64 172 74 159 76 L 140 76 C 129 72 122 63 122 52 Z"
                    fill="#e9ae64"
                    stroke="#3f2817"
                    strokeWidth="2.4"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 149 60 C 166 55 183 63 187 77 C 190 90 178 100 165 97 C 152 95 145 85 145 74 C 145 67 146 63 149 60 Z"
                    fill="#e9ae64"
                    stroke="#3f2817"
                    strokeWidth="2.4"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 133 39 C 142 31 157 30 168 36 C 161 33 146 34 138 40 Z"
                    fill="#c98a45"
                    opacity="0.5"
                  />

                  <g className="dog-ear dog-ear-near">
                    <path
                      d="M 129 38 C 114 31 100 41 98 56 C 96 71 105 84 116 82 C 125 80 128 68 130 55 Z"
                      fill="#a96a2f"
                      stroke="#3f2817"
                      strokeWidth="2.4"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 122 46 C 113 45 106 52 104 63"
                      fill="none"
                      stroke="#7e4d21"
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity="0.6"
                    />
                  </g>

                  <ellipse
                    cx="168"
                    cy="82"
                    rx="22"
                    ry="16.5"
                    fill="#f7e6c8"
                    stroke="#3f2817"
                    strokeWidth="2.2"
                  />

                  <g fill="#c98a45" opacity="0.5">
                    <circle cx="156" cy="86" r="1.6" />
                    <circle cx="161" cy="90" r="1.5" />
                    <circle cx="153" cy="91" r="1.2" />
                  </g>

                  <ellipse
                    className="dog-blush"
                    cx="148"
                    cy="80"
                    rx="8.5"
                    ry="4.8"
                    fill="#ef7a8c"
                  />

                  {expression === 'excited' ? (
                    <g className="dog-mouth">
                      <path
                        d="M 170 87 C 172 97 183 100 189 90 C 185 92 176 92 172 89 Z"
                        fill="#7c2f3a"
                        stroke="#3f2817"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M 177 92 C 175 100 184 103 187 95 C 184 97 180 95 177 92 Z"
                        fill="#ef7a8c"
                      />
                    </g>
                  ) : expression === 'shy' ? (
                    <path
                      className="dog-mouth"
                      d="M 173 91 q 3.5 -2.5 7 0 q 3.5 2.5 7 0"
                      fill="none"
                      stroke="#3f2817"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  ) : (
                    <g className="dog-mouth">
                      <path
                        d="M 171 88 C 175 93 183 94 188 89"
                        fill="none"
                        stroke="#3f2817"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 178 92 C 178 96 181 97 183 93 Z"
                        fill="#ef7a8c"
                      />
                    </g>
                  )}

                  <ellipse
                    cx="182"
                    cy="75"
                    rx="9.5"
                    ry="7.5"
                    fill="#2b1a10"
                    stroke="#3f2817"
                    strokeWidth="1.6"
                  />
                  <ellipse cx="179" cy="72" rx="3.2" ry="2" fill="#ffffff" opacity="0.55" />
                  <path
                    d="M 176 80 q 6 2 11 -1"
                    fill="none"
                    stroke="#140b06"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    opacity="0.5"
                  />

                  {expression === 'excited' ? (
                    <g
                      className="dog-brows"
                      fill="none"
                      stroke="#3f2817"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    >
                      <path d="M 132 37 C 137 31 145 31 149 36" />
                      <path d="M 154 33 C 160 28 169 30 173 35" />
                    </g>
                  ) : expression === 'shy' ? (
                    <g
                      className="dog-brows"
                      fill="none"
                      stroke="#3f2817"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    >
                      <path d="M 132 40 C 138 35 145 36 149 41" />
                      <path d="M 155 38 C 161 33 168 34 172 39" />
                    </g>
                  ) : (
                    <g
                      className="dog-brows"
                      fill="none"
                      stroke="#3f2817"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    >
                      <path d="M 134 39 C 138 36 144 36 147 38" />
                      <path d="M 156 36 C 160 33 167 34 170 37" />
                    </g>
                  )}

                  <g className="dog-eye dog-eye-far">
                    <ellipse
                      cx="141"
                      cy="52"
                      rx="6.6"
                      ry="7.8"
                      fill="#fffdf6"
                      stroke="#3f2817"
                      strokeWidth="1.9"
                    />
                    <g className="dog-pupil">
                      <g className="dog-pupil-core">
                        <circle cx="141.5" cy="52.5" r="4.2" fill="#2b1a10" />
                        <ellipse
                          cx="140"
                          cy="50.7"
                          rx="1.4"
                          ry="1.2"
                          fill="#ffffff"
                          opacity="0.9"
                        />
                      </g>
                    </g>
                  </g>
                  <g className="dog-eye dog-eye-near">
                    <ellipse
                      cx="161"
                      cy="49"
                      rx="7.4"
                      ry="8.6"
                      fill="#fffdf6"
                      stroke="#3f2817"
                      strokeWidth="2"
                    />
                    <g className="dog-pupil">
                      <g className="dog-pupil-core">
                        <circle cx="161.5" cy="49.5" r="4.7" fill="#2b1a10" />
                        <ellipse
                          cx="159.8"
                          cy="47.5"
                          rx="1.6"
                          ry="1.4"
                          fill="#ffffff"
                          opacity="0.92"
                        />
                        <circle cx="163.6" cy="52.8" r="0.9" fill="#ffffff" opacity="0.6" />
                      </g>
                    </g>
                  </g>
                </g>
              </g>

              <g className="dog-sparks" aria-hidden="true">
                <path
                  className="dog-spark sp-1"
                  d="M 36 40 l 3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 z"
                  fill="#c0a010"
                />
                <path
                  className="dog-spark sp-2"
                  d="M 198 28 l 2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2 z"
                  fill="#6040f0"
                />
                <path
                  className="dog-spark sp-3"
                  d="M 72 10 l 2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 z"
                  fill="#008030"
                />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
