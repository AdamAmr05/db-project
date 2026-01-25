import { motion } from 'framer-motion'

export default function TitleSlide() {
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
                style={{ fontSize: '3.5rem', maxWidth: '900px' }}
            >
                AI-Powered HR Management
                <br />
                <span className="text-accent">&amp; Analytics System</span>
            </motion.h1>



            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="mt-12"
                style={{ color: 'var(--muted)', fontSize: '1rem' }}
            >
                {/* Add your name here */}
                Adam Amr
            </motion.div>
        </motion.div>
    )
}
