import { motion } from 'framer-motion'

export default function OneMoreThingSlide() {
    return (
        <motion.div
            className="slide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
                background: '#0a0a0a',
            }}
        >
            <motion.p
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 1.2,
                    delay: 0.5,
                    ease: [0.25, 0.1, 0.25, 1]
                }}
                style={{
                    fontSize: '3rem',
                    fontWeight: 300,
                    color: '#ffffff',
                    letterSpacing: '-0.02em',
                }}
            >
                One more thing...
            </motion.p>
        </motion.div>
    )
}
