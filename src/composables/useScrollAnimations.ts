import { onMounted, onUnmounted, ref } from 'vue'

export function useScrollAnimations() {
  const observerRef = ref<IntersectionObserver | null>(null)

  onMounted(() => {
    // Intersection Observer for scroll animations
    observerRef.value = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active')
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px',
      }
    )

    // Observe all elements with scroll-reveal class
    const elements = document.querySelectorAll('.scroll-reveal')
    elements.forEach((el) => observerRef.value?.observe(el))
  })

  onUnmounted(() => {
    observerRef.value?.disconnect()
  })

  return {
    observerRef,
  }
}

export function useParallax() {
  let ticking = false

  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.pageYOffset
        const parallaxElements = document.querySelectorAll('.parallax-layer')

        parallaxElements.forEach((element) => {
          const speed = parseFloat(element.getAttribute('data-speed') || '0.5')
          const yPos = -(scrolled * speed)
          ;(element as HTMLElement).style.transform = `translate3d(0, ${yPos}px, 0)`
        })

        ticking = false
      })

      ticking = true
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return {
    handleScroll,
  }
}

export function useMouseParallax() {
  const handleMouseMove = (event: MouseEvent) => {
    const elements = document.querySelectorAll('.mouse-parallax')
    const x = event.clientX / window.innerWidth
    const y = event.clientY / window.innerHeight

    elements.forEach((element) => {
      const speed = parseFloat(element.getAttribute('data-mouse-speed') || '20')
      const xMove = (x - 0.5) * speed
      const yMove = (y - 0.5) * speed
      ;(element as HTMLElement).style.transform = `translate(${xMove}px, ${yMove}px)`
    })
  }

  onMounted(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouseMove)
  })

  return {
    handleMouseMove,
  }
}
