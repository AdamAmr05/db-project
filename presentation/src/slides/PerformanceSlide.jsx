import { motion } from 'framer-motion'

export default function PerformanceSlide() {
    const embedUrl = 'https://www.youtube.com/embed/vkGLCaRv_90?autoplay=1&mute=1&controls=0&playsinline=1&rel=0&modestbranding=1&vq=hd720'

    return (
        <motion.div
            className="slide video-slide video-slide--performance"
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
                className="video-frame video-frame--performance"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.2)',
                    display: 'inline-block',
                    position: 'relative',
                    width: 'min(90vw, calc(75vh * 16 / 9))',
                    aspectRatio: '16 / 9',
                }}
            >
                <iframe
                    src={embedUrl}
                    title="Performance Hub Demo"
                    frameBorder="0"
                    allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                    allowFullScreen
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'block',
                        border: 0,
                        // Slight scale to hide thin letterbox edges
                        transform: 'scale(1.01)',
                        transformOrigin: 'center',
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
