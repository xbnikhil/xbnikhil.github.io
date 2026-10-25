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
          `rotate(${tilt.toFixed(2)} 105 72)`,
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
      aria-label="A little robot — click to say hi and watch it get shy"
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
                cx="105"
                cy="152"
                rx="52"
                ry="6"
                fill="#1a1208"
                opacity="0.14"
              />

              <g className="dog-speedlines">
                <path className="dog-speedline sl-1" d="M 22 96 h 20" />
                <path className="dog-speedline sl-2" d="M 12 108 h 26" />
                <path className="dog-speedline sl-3" d="M 24 120 h 16" />
              </g>

              {/* rear flag / antenna-back detail that wags */}
              <g className="dog-tail">
                <path
                  d="M 62 110 L 50 98 L 54 90 L 66 102 Z"
                  fill="#c05000"
                  stroke="#4a3728"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M 56 100 Q 48 96 52 88"
                  fill="none"
                  stroke="#a06a42"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.7"
                />
              </g>

              {/* treads / feet */}
              <g className="dog-leg dog-leg-hind-far">
                <rect x="80" y="138" width="9" height="9" rx="2" ry="2"
                  fill="#b8a880" stroke="#4a3728" strokeWidth="2" />
              </g>
              <g className="dog-leg dog-leg-front-far">
                <rect x="100" y="138" width="9" height="9" rx="2" ry="2"
                  fill="#b8a880" stroke="#4a3728" strokeWidth="2" />
              </g>
              <g className="dog-leg dog-leg-hind-near">
                <rect x="114" y="138" width="9" height="9" rx="2" ry="2"
                  fill="#c8b890" stroke="#4a3728" strokeWidth="2" />
              </g>
              <g className="dog-leg dog-leg-front-near">
                <rect x="128" y="138" width="9" height="9" rx="2" ry="2"
                  fill="#c8b890" stroke="#4a3728" strokeWidth="2" />
              </g>

              {/* body */}
              <g className="dog-body">
                <rect x="74" y="100" width="62" height="40" rx="10" ry="10"
                  fill="#f0e6d2" stroke="#4a3728" strokeWidth="2.5" strokeLinejoin="round" />
                {/* chest panel */}
                <rect x="87" y="111" width="36" height="18" rx="5" ry="5"
                  fill="#faf6ec" stroke="#4a3728" strokeWidth="1.6" opacity="0.92" />
                <circle cx="105" cy="120" r="3" fill="#60ff90" />
                <circle cx="105" cy="120" r="1" fill="#ffffff" opacity="0.8" />
              </g>

              {/* arms */}
              <rect x="68" y="108" width="7" height="20" rx="3" ry="3"
                fill="#e0d4b8" stroke="#4a3728" strokeWidth="2" />
              <rect x="135" y="108" width="7" height="20" rx="3" ry="3"
                fill="#e0d4b8" stroke="#4a3728" strokeWidth="2" />

              {/* neck */}
              <rect x="99" y="94" width="12" height="8" rx="2" ry="2"
                fill="#f0e6d2" stroke="#4a3728" strokeWidth="2" />

              {/* head */}
              <g className="dog-head-motion">
                <g className="dog-head" ref={headRef}>
                  <rect x="80" y="52" width="50" height="42" rx="9" ry="9"
                    fill="#faf6ec" stroke="#4a3728" strokeWidth="2.5" strokeLinejoin="round" />

                  {/* side panels / ears */}
                  <g className="dog-ear dog-ear-far">
                    <rect x="70" y="68" width="11" height="22" rx="3" ry="3"
                      fill="#e0d4b8" stroke="#4a3728" strokeWidth="2" />
                  </g>
                  <g className="dog-ear dog-ear-near">
                    <rect x="129" y="68" width="11" height="22" rx="3" ry="3"
                      fill="#e0d4b8" stroke="#4a3728" strokeWidth="2" />
                  </g>

                  {/* antenna */}
                  <line x1="105" y1="52" x2="105" y2="40"
                    stroke="#a06a42" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="105" cy="37" r="3.5" fill="#c05000" stroke="#4a3728" strokeWidth="1.5" />

                  {/* eyes */}
                  <g className="dog-eye dog-eye-far">
                    <circle cx="96" cy="78" r="7" fill="#2b2b2b" stroke="#4a3728" strokeWidth="1.5" />
                    <g className="dog-pupil">
                      <g className="dog-pupil-core">
                        <circle cx="96" cy="78" r="2.6" fill="#111" />
                        <ellipse cx="95" cy="77" rx="1" ry="0.9" fill="#ffffff" opacity="0.9" />
                      </g>
                    </g>
                  </g>
                  <g className="dog-eye dog-eye-near">
                    <circle cx="114" cy="78" r="7" fill="#2b2b2b" stroke="#4a3728" strokeWidth="1.5" />
                    <g className="dog-pupil">
                      <g className="dog-pupil-core">
                        <circle cx="114" cy="78" r="2.6" fill="#111" />
                        <ellipse cx="113" cy="77" rx="1" ry="0.9" fill="#ffffff" opacity="0.92" />
                        <circle cx="115.6" cy="80.6" r="0.8" fill="#ffffff" opacity="0.6" />
                      </g>
                    </g>
                  </g>

                  {expression === 'excited' ? (
                    <g className="dog-mouth">
                      <rect x="98" y="90" width="14" height="7" rx="3" ry="3"
                        fill="#ef7a8c" stroke="#4a3728" strokeWidth="2" />
                      <rect x="102" y="92" width="6" height="3" fill="#ffffff" opacity="0.7" />
                    </g>
                  ) : expression === 'shy' ? (
                    <path className="dog-mouth"
                      d="M 98 92 Q 105 96 112 92"
                      fill="none" stroke="#4a3728" strokeWidth="2.2" strokeLinecap="round" />
                  ) : (
                    <g className="dog-mouth">
                      <path d="M 99 89 Q 105 93 111 89"
                        fill="none" stroke="#4a3728" strokeWidth="2.2" strokeLinecap="round" />
                      <rect x="102" y="91" width="6" height="2" fill="#ef7a8c" opacity="0.7" />
                    </g>
                  )}

                  {expression === 'excited' ? (
                    <g className="dog-brows" fill="none" stroke="#4a3728" strokeWidth="2.4" strokeLinecap="round">
                      <path d="M 90 72 Q 96 68 102 72" />
                      <path d="M 108 72 Q 114 68 120 72" />
                    </g>
                  ) : expression === 'shy' ? (
                    <g className="dog-brows" fill="none" stroke="#4a3728" strokeWidth="2.4" strokeLinecap="round">
                      <path d="M 91 74 Q 96 78 101 74" />
                      <path d="M 109 74 Q 114 78 119 74" />
                    </g>
                  ) : (
                    <g className="dog-brows" fill="none" stroke="#4a3728" strokeWidth="2.2" strokeLinecap="round">
                      <path d="M 92 73 Q 96 71 100 73" />
                      <path d="M 110 73 Q 114 71 118 73" />
                    </g>
                  )}

                  <g className="dog-blush">
                    <circle cx="88" cy="84" r="2.6" fill="#ef7a8c" />
                    <circle cx="122" cy="84" r="2.6" fill="#ef7a8c" />
                  </g>
                </g>
              </g>

              <g className="dog-sparks" aria-hidden="true">
                <path className="dog-spark sp-1" d="M 36 40 l 3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 z" fill="#c0a010" />
                <path className="dog-spark sp-2" d="M 198 28 l 2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2 z" fill="#6040f0" />
                <path className="dog-spark sp-3" d="M 72 10 l 2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 z" fill="#008030" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
