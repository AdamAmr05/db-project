import { motion } from 'framer-motion'
import dashboard from '../assets/Full-main-dashboard.jpeg'

export default function DashboardSlide() {
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
                System Dashboard
            </motion.h2>

            <motion.img
                src={dashboard}
                alt="System Dashboard"
                className="slide-image"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
            />
        </motion.div>
    )
}
