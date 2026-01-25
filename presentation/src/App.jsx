import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'

// Import slides
import TitleSlide from './slides/TitleSlide'
import PosterSlide from './slides/PosterSlide'
import DashboardSlide from './slides/DashboardSlide'
import DatabaseSlide from './slides/DatabaseSlide'
import EntityManagementSlide from './slides/EntityManagementSlide'
import PerformanceSlide from './slides/PerformanceSlide'
import AnalyticsSlide from './slides/AnalyticsSlide'
import OneMoreThingSlide from './slides/OneMoreThingSlide'
import AIRevealSlide from './slides/AIRevealSlide'
import ThanksSlide from './slides/ThanksSlide'

const slides = [
    { id: 'title', component: TitleSlide },
    { id: 'database', component: DatabaseSlide },
    // { id: 'poster', component: PosterSlide },
    { id: 'dashboard', component: DashboardSlide },
    { id: 'entities', component: EntityManagementSlide },
    { id: 'performance', component: PerformanceSlide },
    { id: 'analytics', component: AnalyticsSlide },
    { id: 'one-more-thing', component: OneMoreThingSlide },
    { id: 'ai-reveal', component: AIRevealSlide },
    { id: 'thanks', component: ThanksSlide },
]

function App() {
    const [currentSlide, setCurrentSlide] = useState(0)

    const goToSlide = useCallback((index) => {
        if (index >= 0 && index < slides.length) {
            setCurrentSlide(index)
        }
    }, [])

    const nextSlide = useCallback(() => {
        goToSlide(currentSlide + 1)
    }, [currentSlide, goToSlide])

    const prevSlide = useCallback(() => {
        goToSlide(currentSlide - 1)
    }, [currentSlide, goToSlide])

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                case 'PageDown':
                case ' ':
                case 'Enter':
                    e.preventDefault()
                    nextSlide()
                    break
                case 'ArrowLeft':
                case 'ArrowUp':
                case 'PageUp':
                case 'Backspace':
                    e.preventDefault()
                    prevSlide()
                    break
                case 'f':
                    // Toggle fullscreen
                    if (!document.fullscreenElement) {
                        document.documentElement.requestFullscreen()
                    } else {
                        document.exitFullscreen()
                    }
                    break
                case 'Home':
                    goToSlide(0)
                    break
                case 'End':
                    goToSlide(slides.length - 1)
                    break
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [nextSlide, prevSlide, goToSlide])

    const CurrentSlideComponent = slides[currentSlide].component

    return (
        <div className="presentation">
            <AnimatePresence mode="wait">
                <CurrentSlideComponent key={slides[currentSlide].id} />
            </AnimatePresence>

            {/* Progress bar */}
            <div
                className="progress-bar"
                style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
            />

            {/* Slide counter */}
            <div className="slide-counter">
                {currentSlide + 1} / {slides.length}
            </div>

            {/* Keyboard hints (hidden during presentation, visible in dev) */}
            <div className="keyboard-hints">
                ← → navigate · F fullscreen
            </div>
        </div>
    )
}

export default App
