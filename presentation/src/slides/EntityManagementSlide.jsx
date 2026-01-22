import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
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
    const [focusedIndex, setFocusedIndex] = useState(null)
    const [cycleIndex, setCycleIndex] = useState(0)
    const containerRef = useRef(null)
    const cardRefs = useRef({})

    // Animation cycle: wait 4.5s -> show card for 4.5s -> hide -> wait 1.5s -> next
    useEffect(() => {
        // Initial delay before starting
        const startDelay = setTimeout(() => {
            setFocusedIndex(0)
        }, 4500)

        return () => clearTimeout(startDelay)
    }, [])

    useEffect(() => {
        if (focusedIndex === null) return

        // Card is focused, wait 4.5 seconds then unfocus
        const hideTimer = setTimeout(() => {
            setFocusedIndex(null)

            // After 1.5 seconds, show next card
            const nextTimer = setTimeout(() => {
                const nextIndex = (cycleIndex + 1) % entities.length
                setCycleIndex(nextIndex)
                setFocusedIndex(nextIndex)
            }, 1500)

            return () => clearTimeout(nextTimer)
        }, 4500)

        return () => clearTimeout(hideTimer)
    }, [focusedIndex, cycleIndex])

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

            {/* Grid Container */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '40px',
                    width: '100%',
                    maxWidth: '1000px',
                }}
            >
                {entities.map((entity, index) => (
                    <div
                        key={entity.id}
                        ref={(el) => (cardRefs.current[index] = el)}
                        style={{
                            position: 'relative',
                            height: '240px',
                            // Keep layout stable - never hide/remove the placeholder
                        }}
                    >
                        <GridCard
                            entity={entity}
                            isHidden={focusedIndex === index}
                        />
                    </div>
                ))}
            </div>

            {/* Overlay for focused card */}
            <AnimatePresence>
                {focusedIndex !== null && (
                    <FocusedCard
                        key={`focused-${focusedIndex}`}
                        entity={entities[focusedIndex]}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

// Grid card - static, no layout animation
function GridCard({ entity, isHidden }) {
    return (
        <div
            style={{
                background: 'var(--surface)',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid var(--border)',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                opacity: isHidden ? 0 : 1,
                transition: 'opacity 0.3s ease',
            }}
        >
            <div style={{
                flex: 1,
                overflow: 'hidden',
                position: 'relative',
            }}>
                <img
                    src={entity.src}
                    alt={entity.label}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
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
                    color: 'var(--muted)',
                    borderTop: '1px solid var(--border)',
                    background: 'var(--surface)',
                }}
            >
                {entity.label}
            </div>
        </div>
    )
}

// Focused card - uses simple scale/fade animation, not layout
function FocusedCard({ entity }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
                duration: 0.3,
                ease: 'easeOut',
            }}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: '120px', // Keep below title
                zIndex: 50,
                pointerEvents: 'none',
            }}
        >
            <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{
                    duration: 0.4,
                    ease: [0.25, 0.1, 0.25, 1],
                }}
                style={{
                    background: 'var(--surface)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.25)',
                    border: '2px solid var(--primary)',
                    width: '900px',
                    height: '560px',
                    maxWidth: '90vw',
                    maxHeight: '80vh',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <div style={{
                    flex: 1,
                    overflow: 'hidden',
                    position: 'relative',
                }}>
                    <img
                        src={entity.src}
                        alt={entity.label}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'top center',
                        }}
                    />
                </div>

                <div
                    style={{
                        height: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 20px',
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: 'var(--primary)',
                        borderTop: '1px solid var(--border)',
                        background: 'var(--surface)',
                    }}
                >
                    {entity.label}
                </div>
            </motion.div>
        </motion.div>
    )
}
