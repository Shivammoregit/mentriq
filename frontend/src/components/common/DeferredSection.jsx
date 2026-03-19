import React, { useEffect, useRef, useState } from 'react'

const DeferredSection = ({ children, minHeight = '320px', rootMargin = '300px 0px' }) => {
  const containerRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = containerRef.current
    if (!node || isVisible) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [isVisible, rootMargin])

  return (
    <section ref={containerRef} style={{ minHeight }}>
      {isVisible ? children : null}
    </section>
  )
}

export default DeferredSection
