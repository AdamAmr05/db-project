import { motion } from 'framer-motion'
import employees from '../assets/Employees.png'
import jobs from '../assets/Job Positions.png'
import training from '../assets/Training programs.png'
import departments from '../assets/Departments.png'

const entities = [
    { src: employees, label: 'Employees' },
    { src: jobs, label: 'Jobs' },
    { src: training, label: 'Training' },
    { src: departments, label: 'Departments' },
]

export default function EntityManagementSlide() {
    return (
        <motion.div
            className="slide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ padding: '50px 60px' }}
        >
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ marginBottom: '40px' }}
            >
                Entity Management
            </motion.h2>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '24px',
                    maxWidth: '1200px',
                }}
            >
                {entities.map((entity, index) => (
                    <motion.div
                        key={entity.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                        style={{
                            background: 'var(--surface)',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            border: '1px solid var(--border)',
                        }}
                    >
                        <img
                            src={entity.src}
                            alt={entity.label}
                            style={{
                                width: '100%',
                                height: '200px',
                                objectFit: 'cover',
                                objectPosition: 'top',
                            }}
                        />
                        <div
                            style={{
                                padding: '12px 16px',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                color: 'var(--muted)',
                            }}
                        >
                            {entity.label}
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}
