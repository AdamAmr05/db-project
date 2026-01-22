import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

function CountUp({ end, duration = 1.5, delay = 0 }) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        const timeout = setTimeout(() => {
            let start = 0
            const increment = end / (duration * 60)
            const timer = setInterval(() => {
                start += increment
                if (start >= end) {
                    setCount(end)
                    clearInterval(timer)
                } else {
                    setCount(Math.floor(start))
                }
            }, 1000 / 60)
            return () => clearInterval(timer)
        }, delay * 1000)
        return () => clearTimeout(timeout)
    }, [end, duration, delay])

    return <span>{count}+</span>
}

const stats = [
    { number: 20, label: 'Tables' },
    { number: 26, label: 'Views' },
    { number: 18, label: 'Stored Procedures' },
    { number: 15, label: 'Functions' },
    { number: 6, label: 'Triggers' },
    { number: 12, label: 'Check Constraints' },
]

export default function DatabaseSlide() {
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
                transition={{ duration: 0.6 }}
            >
                The Foundation
            </motion.h2>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                style={{ marginBottom: '50px' }}
            >
                An Engineered Relational Database
            </motion.p>

            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        className="stat-item"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    >
                        <div className="stat-number">
                            <CountUp end={stat.number} delay={0.5 + index * 0.1} />
                        </div>
                        <div className="stat-label">{stat.label}</div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}
