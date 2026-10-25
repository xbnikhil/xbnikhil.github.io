import { useEffect, useRef, useState } from 'react'

export default function HeroDog() {
  const dogRef = useRef(null)
  const modeRef = useRef('roam')
  const [mode, setMode] = useState('roam')
  const timersRef = useRef([])
  const jumpTimerRef = useRef(null)
  const rafRef = useRef(0)

  function setDogMode(next) {
    modeRef.current = next
    setMode(next)
  }

  function schedule(fn, ms) {
    timersRef.current.push(setTimeout(fn, ms))
  }

  useEffect(() => {
    function onPointerMove(event) {
      const el = dogRef.current
      if (!el) return
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = event.clientX - cx
        const dy = event.clientY - cy
        const distance = Math.min(1, Math.hypot(dx, dy) / 260)
        const angle = Math.atan2(dy, dx)
        const max = 3.2
        el.style.setProperty('--eye-x', `${Math.cos(angle) * max * distance}px`)
        el.style.setProperty('--eye-y', `${Math.sin(angle) * max * distance}px`)
        const tilt = Math.max(-8, Math.min(8, dx / 45))
        el.style.setProperty('--head-tilt', `${tilt}deg`)
      })
    }

    function onDocumentClick() {
      if (modeRef.current !== 'roam') return
      setDogMode('jumping')
      clearTimeout(jumpTimerRef.current)
      jumpTimerRef.current = setTimeout(() => {
        if (modeRef.current === 'jumping') setDogMode('roam')
      }, 640)
    }

    window.addEventListener('pointermove', onPointerMove)
    document.addEventListener('click', onDocumentClick)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('click', onDocumentClick)
      clearTimeout(jumpTimerRef.current)
      timersRef.current.forEach(clearTimeout)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  function handleDogClick(event) {
    event.stopPropagation()
    if (
      modeRef.current === 'hiding' ||
      modeRef.current === 'peeking' ||
      modeRef.current === 'returning'
    ) {
      return
    }
    clearTimeout(jumpTimerRef.current)
    setDogMode('hiding')
    schedule(() => setDogMode('peeking'), 380)
    schedule(() => setDogMode('returning'), 3300)
    schedule(() => setDogMode('roam'), 3560)
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleDogClick(event)
    }
  }

  return (
    <div
      ref={dogRef}
      className={`hero-dog is-${mode}`}
      onClick={handleDogClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="A little dog — click to make it hide"
    >
      <div className="dog">
        <span className="dog-tail" />
        <span className="dog-body" />
        <span className="dog-leg dog-leg-front" />
        <span className="dog-leg dog-leg-back" />
        <span className="dog-collar" />
        <span className="dog-head">
          <span className="dog-ear dog-ear-left" />
          <span className="dog-ear dog-ear-right" />
          <span className="dog-eye dog-eye-left">
            <span className="dog-pupil" />
          </span>
          <span className="dog-eye dog-eye-right">
            <span className="dog-pupil" />
          </span>
          <span className="dog-nose" />
          <span className="dog-mouth" />
        </span>
      </div>
    </div>
  )
}
