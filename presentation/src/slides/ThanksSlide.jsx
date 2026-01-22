import { motion } from 'framer-motion'

export default function ThanksSlide() {
    return (
        <motion.div
            className="slide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ fontSize: '4rem', marginBottom: '40px' }}
            >
                Thank You
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                style={{
                    fontSize: '1.5rem',
                    color: 'var(--muted)',
                }}
            >
                Questions?
            </motion.p>
        </motion.div>
    )
}
