import { motion } from 'framer-motion'
import { useRef, useEffect } from 'react'
import performanceVideo from '../assets/Performance hub demo.mp4'

export default function PerformanceSlide() {
    const videoRef = useRef(null)

    // Auto-play when slide becomes visible
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.currentTime = 0
            videoRef.current.play().catch(() => {
                // Autoplay might be blocked, that's ok
            })
        }
    }, [])

    return (
        <motion.div
            className="slide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ padding: '40px' }}
        >
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                style={{ marginBottom: '24px' }}
            >
                Performance Hub
            </motion.h2>

            {/* Wrapper to clip edges */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.2)',
                    display: 'inline-block',
                    position: 'relative',
                }}
            >
                <video
                    ref={videoRef}
                    src={performanceVideo}
                    controls
                    muted
                    style={{
                        maxHeight: '75vh',
                        maxWidth: '90vw',
                        display: 'block',
                        // Slight scale to hide black edges
                        transform: 'scale(1.01)',
                        margin: '-0.5%',
                    }}
                />
                {/* Right edge cover to hide black line */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '3px',
                        height: '100%',
                        background: 'var(--background)',
                    }}
                />
            </motion.div>
        </motion.div>
    )
}
