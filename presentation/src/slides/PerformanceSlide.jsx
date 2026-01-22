import { motion } from 'framer-motion'
import performanceHub from '../assets/Performance hub.jpeg'

export default function PerformanceSlide() {
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
                Performance Hub
            </motion.h2>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                style={{ marginBottom: '30px', fontSize: '1.1rem' }}
            >
                Cycles • Appraisals • KPIs • Appeals
            </motion.p>

            <motion.img
                src={performanceHub}
                alt="Performance Hub"
                className="slide-image"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
            />
        </motion.div>
    )
}
