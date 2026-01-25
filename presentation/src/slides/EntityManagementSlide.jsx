import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import employees from '../assets/Employees.png'
import jobs from '../assets/Job Positions.png'
import training from '../assets/Training programs.png'
import departments from '../assets/Departments.png'

const entities = [
    { src: employees, label: 'Employees', id: 'employees' },
    { src: jobs, label: 'Jobs', id: 'jobs' },
    { src: training, label: 'Training', id: 'training' },
    { src: departments, label: 'Departments', id: 'departments' },
]

export default function EntityManagementSlide() {
    const [focusedId, setFocusedId] = useState(null)
    const [cycleIndex, setCycleIndex] = useState(0)
    const cardRefs = useRef({})
    const containerRef = useRef(null)
    const isAnimating = useRef(false)
    const tweenRef = useRef(null)

    const getCardTransform = useCallback((cardId) => {
        const card = cardRefs.current[cardId]
        const container = containerRef.current
        if (!card || !container) return null

        const cardRect = card.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()

        // Target: center of container, preserving aspect ratio approx 16:9
        const targetWidth = Math.min(900, containerRect.width * 0.9)
        const targetHeight = targetWidth / 1.6 // Maintain roughly 16:10 or 16:9 ratio

        const scaleX = targetWidth / cardRect.width
        const scaleY = targetHeight / cardRect.height
        // Use the larger scale to ensure it fills (?) - actually we want uniform scale
        // But since we want to morph the SHAPE too? 
        // GSAP scale just zooms. It doesn't change aspect ratio unless we scaleX != scaleY.
        // If we scaleX != scaleY, the content stretches.
        // We want the CARD to resize, but maintain Aspect Ratio.
        // If grid card is 16:9 and Target is 16:9, then uniform scale works.
        const scale = Math.min(scaleX, scaleY)

        // Calculate translation
        const cardCenterX = cardRect.left + cardRect.width / 2
        const cardCenterY = cardRect.top + cardRect.height / 2
        const targetCenterX = containerRect.left + containerRect.width / 2
        const targetCenterY = containerRect.top + containerRect.height / 2 + 30

        const translateX = targetCenterX - cardCenterX
        const translateY = targetCenterY - cardCenterY

        return { scale, translateX, translateY }
    }, [])

    const focusCard = useCallback((id) => {
        if (isAnimating.current) return

        const card = cardRefs.current[id]
        const transform = getCardTransform(id)
        if (!card || !transform) return

        isAnimating.current = true
        setFocusedId(id)

        if (tweenRef.current) tweenRef.current.kill()

        tweenRef.current = gsap.to(card, {
            scale: transform.scale,
            x: transform.translateX,
            y: transform.translateY,
            zIndex: 100,
            boxShadow: '0 30px 60px rgba(0,0,0,0.25)',
            duration: 0.6,
            ease: 'power2.out',
            onComplete: () => {
                isAnimating.current = false
            }
        })
    }, [getCardTransform])

    const unfocusCard = useCallback((id) => {
        if (isAnimating.current) return

        const card = cardRefs.current[id]
        if (!card) return

        isAnimating.current = true

        if (tweenRef.current) tweenRef.current.kill()

        tweenRef.current = gsap.to(card, {
            scale: 1,
            x: 0,
            y: 0,
            zIndex: 1,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            duration: 0.6,
            ease: 'power2.inOut',
            onComplete: () => {
                isAnimating.current = false
                setFocusedId(null)
            }
        })
    }, [])

    useEffect(() => {
        const startDelay = setTimeout(() => {
            focusCard(entities[0].id)
        }, 6000)
        return () => clearTimeout(startDelay)
    }, [focusCard])

    useEffect(() => {
        if (focusedId === null) return

        const hideTimer = setTimeout(() => {
            const currentId = focusedId
            unfocusCard(currentId)

            setTimeout(() => {
                const nextIndex = (cycleIndex + 1) % entities.length
                setCycleIndex(nextIndex)
                focusCard(entities[nextIndex].id)
            }, 1100)
        }, 6000)

        return () => clearTimeout(hideTimer)
    }, [focusedId, cycleIndex, unfocusCard, focusCard])

    return (
        <div
            ref={containerRef}
            className="slide"
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '40px',
                overflow: 'hidden',
            }}
        >
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ marginBottom: '60px', textAlign: 'center' }}
            >
                Entity Management
            </motion.h2>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '40px',
                    width: '100%',
                    maxWidth: '1000px',
                }}
            >
                {entities.map((entity) => {
                    const isFocused = focusedId === entity.id

                    return (
                        <div
                            key={entity.id}
                            style={{
                                position: 'relative',
                                width: '100%',
                                aspectRatio: '1.6', // Enforce aspect ratio
                            }}
                        >
                            <div
                                ref={(el) => (cardRefs.current[entity.id] = el)}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    background: 'var(--surface)',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    boxShadow: isFocused ? '0 30px 60px rgba(0,0,0,0.25)' : '0 4px 20px rgba(0,0,0,0.08)',
                                    border: isFocused
                                        ? '1px solid var(--primary)' // Thinner border!
                                        : '1px solid var(--border)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transformOrigin: 'center center',
                                    willChange: 'transform',
                                }}
                            >
                                <div style={{
                                    flex: 1,
                                    overflow: 'hidden',
                                    position: 'relative',
                                    minHeight: 0,
                                }}>
                                    <img
                                        src={entity.src}
                                        alt={entity.label}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover', // Use cover with correct aspect ratio
                                            objectPosition: 'top center',
                                        }}
                                    />
                                </div>
                                <div
                                    style={{
                                        height: '40px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        padding: '0 16px',
                                        fontSize: '0.9rem',
                                        fontWeight: 500,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        color: isFocused ? 'var(--primary)' : 'var(--muted)',
                                        borderTop: '1px solid var(--border)',
                                        background: 'var(--surface)',
                                        flexShrink: 0,
                                    }}
                                >
                                    {entity.label}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
