import { motion } from 'framer-motion'
import analytics from '../assets/PowerBI embed.jpeg'

export default function AnalyticsSlide() {
    return (
        <motion.div
            className="slide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                style={{ marginBottom: '30px' }}
            >
                Analytics Dashboard
            </motion.h2>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                style={{ marginBottom: '30px', fontSize: '1.1rem' }}
            >
                Power BI Integration
            </motion.p>

            <motion.img
                src={analytics}
                alt="Analytics Dashboard"
                className="slide-image"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
            />
        </motion.div>
    )
}
