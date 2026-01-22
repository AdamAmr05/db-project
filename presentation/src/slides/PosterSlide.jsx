import { motion } from 'framer-motion'
import poster from '../assets/HR system FINAL Poster2.jpg'

export default function PosterSlide() {
    return (
        <motion.div
            className="slide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ padding: '40px' }}
        >
            <motion.img
                src={poster}
                alt="HR System Poster"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{
                    maxHeight: '90vh',
                    maxWidth: '90vw',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.2)',
                }}
            />
        </motion.div>
    )
}
