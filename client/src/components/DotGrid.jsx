import { useRef, useEffect, useCallback, useMemo } from 'react'

const throttle = (func, limit) => {
  let lastCall = 0
  return function throttled(...args) {
    const now = performance.now()
    if (now - lastCall >= limit) {
      lastCall = now
      func.apply(this, args)
    }
  }
}

function hexToRgb(hex) {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
  if (!m) return { r: 0, g: 0, b: 0 }
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16),
  }
}

const DotGrid = ({
  dotSize = 16,
  gap = 32,
  baseColor = '#5227FF',
  activeColor = '#5227FF',
  proximity = 150,
  shockRadius = 250,
  shockStrength = 5,
  resistance = 750,
  returnDuration = 1.5,
  className = '',
  style,
}) => {
  const wrapperRef = useRef(null)
  const canvasRef = useRef(null)
  const dotsRef = useRef([])
  const pointerRef = useRef({
    x: -10000,
    y: -10000,
  })

  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor])
  const activeRgb = useMemo(() => hexToRgb(activeColor), [activeColor])

  const circlePath = useMemo(() => {
    if (typeof window === 'undefined' || !window.Path2D) return null

    const p = new Path2D()
    p.arc(0, 0, dotSize / 2, 0, Math.PI * 2)
    return p
  }, [dotSize])

  const buildGrid = useCallback(() => {
    const wrap = wrapperRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    const { width, height } = wrap.getBoundingClientRect()
    const dpr = Math.min(2, window.devicePixelRatio || 1)

    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    const ctx = canvas.getContext('2d')
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const cols = Math.max(1, Math.floor((width + gap) / (dotSize + gap)))
    const rows = Math.max(1, Math.floor((height + gap) / (dotSize + gap)))
    const cell = dotSize + gap

    const gridW = cell * cols - gap
    const gridH = cell * rows - gap

    const extraX = width - gridW
    const extraY = height - gridH

    const startX = extraX / 2 + dotSize / 2
    const startY = extraY / 2 + dotSize / 2

    const dots = []
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        const cx = startX + x * cell
        const cy = startY + y * cell
        dots.push({ cx, cy, ox: 0, oy: 0, vx: 0, vy: 0 })
      }
    }
    dotsRef.current = dots
  }, [dotSize, gap])

  useEffect(() => {
    if (!circlePath) return undefined

    let rafId
    const proxSq = proximity * proximity
    const damping = Math.max(0.82, Math.min(0.96, 1 - resistance / 10000))
    const spring = Math.max(0.02, 0.065 / Math.max(0.75, returnDuration))
    const maxOffset = Math.max(18, shockRadius * 0.35)
    const repelStrength = Math.max(0.08, shockStrength * 0.07)

    const draw = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const logicalWidth = canvas.width / Math.min(2, window.devicePixelRatio || 1)
      const logicalHeight = canvas.height / Math.min(2, window.devicePixelRatio || 1)
      ctx.clearRect(0, 0, logicalWidth, logicalHeight)

      const { x: px, y: py } = pointerRef.current

      for (const dot of dotsRef.current) {
        const dx = dot.cx - px
        const dy = dot.cy - py
        const dsq = dx * dx + dy * dy

        if (dsq <= proxSq && dsq > 0.0001) {
          const dist = Math.sqrt(dsq)
          const pull = (1 - dist / proximity) * repelStrength
          dot.vx += (dx / dist) * pull
          dot.vy += (dy / dist) * pull
        }

        // Spring back to home position.
        dot.vx += -dot.ox * spring
        dot.vy += -dot.oy * spring
        dot.vx *= damping
        dot.vy *= damping
        dot.ox += dot.vx
        dot.oy += dot.vy

        if (dot.ox > maxOffset) dot.ox = maxOffset
        if (dot.ox < -maxOffset) dot.ox = -maxOffset
        if (dot.oy > maxOffset) dot.oy = maxOffset
        if (dot.oy < -maxOffset) dot.oy = -maxOffset

        let fill = baseColor
        if (dsq <= proxSq) {
          const dist = Math.sqrt(dsq)
          const t = 1 - dist / proximity
          const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t)
          const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t)
          const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t)
          fill = `rgb(${r},${g},${b})`
        }

        ctx.save()
        ctx.translate(dot.cx + dot.ox, dot.cy + dot.oy)
        ctx.fillStyle = fill
        ctx.fill(circlePath)
        ctx.restore()
      }

      rafId = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(rafId)
  }, [proximity, baseColor, activeRgb, baseRgb, circlePath, resistance, returnDuration, shockRadius, shockStrength])

  useEffect(() => {
    buildGrid()

    let ro = null
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(buildGrid)
      if (wrapperRef.current) ro.observe(wrapperRef.current)
    } else {
      window.addEventListener('resize', buildGrid)
    }

    return () => {
      if (ro) {
        ro.disconnect()
      } else {
        window.removeEventListener('resize', buildGrid)
      }
    }
  }, [buildGrid])

  useEffect(() => {
    const onMove = (e) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom

      if (!inside) {
        pointerRef.current.x = -10000
        pointerRef.current.y = -10000
        return
      }

      pointerRef.current.x = e.clientX - rect.left
      pointerRef.current.y = e.clientY - rect.top
    }

    const onLeaveWindow = () => {
      pointerRef.current.x = -10000
      pointerRef.current.y = -10000
    }

    const onClick = (e) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const cx = e.clientX - rect.left
      const cy = e.clientY - rect.top

      for (const dot of dotsRef.current) {
        const dx = dot.cx - cx
        const dy = dot.cy - cy
        const dist = Math.hypot(dx, dy)
        if (dist < shockRadius && dist > 0.0001) {
          const falloff = 1 - dist / shockRadius
          const impulse = shockStrength * falloff * 0.45
          dot.vx += (dx / dist) * impulse
          dot.vy += (dy / dist) * impulse
        }
      }
    }

    const throttledMove = throttle(onMove, 16)
    window.addEventListener('mousemove', throttledMove, { passive: true })
    window.addEventListener('blur', onLeaveWindow)
    window.addEventListener('click', onClick)

    return () => {
      window.removeEventListener('mousemove', throttledMove)
      window.removeEventListener('blur', onLeaveWindow)
      window.removeEventListener('click', onClick)
    }
  }, [shockRadius, shockStrength])

  return (
    <section className={`h-full w-full relative ${className}`} style={style}>
      <div ref={wrapperRef} className="h-full w-full relative">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full pointer-events-none"
        />
      </div>
    </section>
  )
}

export default DotGrid
