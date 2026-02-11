import { useState, useEffect, useCallback, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'

// Assets for prefetching upcoming slides
import dashboard from './assets/Full-main-dashboard.jpeg'
import analytics from './assets/PowerBI embed.jpeg'
import aiAction from './assets/AI action.jpeg'
import aiChat from './assets/AI chat.jpeg'
import poster from './assets/HR system FINAL Poster2.jpg'
import employees from './assets/Employees.png'
import jobs from './assets/Job Positions.png'
import training from './assets/Training programs.png'
import departments from './assets/Departments.png'

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
import AiDashboardVideoSlide from './slides/AiDashboardVideoSlide'
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
    { id: 'ai-dashboard-video', component: AiDashboardVideoSlide },
    { id: 'thanks', component: ThanksSlide },
]

const slideAssets = {
    dashboard: [dashboard],
    analytics: [analytics],
    'ai-reveal': [aiChat, aiAction],
    entities: [employees, jobs, training, departments],
    poster: [poster],
    'ai-dashboard-video': [],
}

function App() {
    const [currentSlide, setCurrentSlide] = useState(0)

    // Prefetch the next slide's assets to reduce bandwidth on first load
    useEffect(() => {
        const nextSlide = slides[currentSlide + 1];
        if (!nextSlide) return;
        const assets = slideAssets[nextSlide.id] || [];
        if (!assets.length) return;

        const preload = () => {
            assets.forEach((src) => {
                const img = new Image();
                img.src = src;
            });
        };

        if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
            const handle = window.requestIdleCallback(preload);
            return () => window.cancelIdleCallback?.(handle);
        }

        const timeout = setTimeout(preload, 200);
        return () => clearTimeout(timeout);
    }, [currentSlide]);

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

    // Swipe support
    const touchStart = useRef(null)
    const touchEnd = useRef(null)

    // Minimum swipe distance (in px)
    const minSwipeDistance = 50

    const onTouchStart = (e) => {
        touchEnd.current = null // Reset on start
        touchStart.current = e.targetTouches[0].clientX
    }

    const onTouchMove = (e) => {
        touchEnd.current = e.targetTouches[0].clientX
    }

    const onTouchEnd = () => {
        if (!touchStart.current || !touchEnd.current) return

        const distance = touchStart.current - touchEnd.current
        const isLeftSwipe = distance > minSwipeDistance
        const isRightSwipe = distance < -minSwipeDistance

        if (isLeftSwipe) {
            nextSlide()
        } else if (isRightSwipe) {
            prevSlide()
        }
    }

    const CurrentSlideComponent = slides[currentSlide].component

    return (
        <div
            className="presentation"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
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
