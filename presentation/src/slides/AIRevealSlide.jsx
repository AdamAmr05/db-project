import { motion } from 'framer-motion'
import aiAction from '../assets/AI action.jpeg'
import aiChat from '../assets/AI chat.jpeg'

export default function AIRevealSlide() {
    return (
        <motion.div
            className="slide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ padding: '40px 60px' }}
        >
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                style={{ marginBottom: '16px' }}
            >
                AI Assistant
            </motion.h2>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                style={{
                    marginBottom: '30px',
                    fontSize: '1.1rem',
                    color: 'var(--muted)'
                }}
            >
                Natural Language → Insights & Actions
            </motion.p>

            <div
                style={{
                    display: 'flex',
                    gap: '24px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    maxWidth: '1400px',
                    height: '55vh',
                }}
            >
                {/* Chat screenshot */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    style={{
                        flex: '0 0 auto',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <img
                        src={aiChat}
                        alt="AI Chat"
                        style={{
                            height: '100%',
                            width: 'auto',
                            objectFit: 'contain',
                            borderRadius: '12px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                        }}
                    />
                    <p style={{
                        marginTop: '12px',
                        fontSize: '0.9rem',
                        color: 'var(--muted)',
                        textAlign: 'center'
                    }}>
                        Ask anything
                    </p>
                </motion.div>

                {/* Action screenshot */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.6 }}
                    style={{
                        flex: '0 0 auto',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <img
                        src={aiAction}
                        alt="AI Action"
                        style={{
                            height: '100%',
                            width: 'auto',
                            objectFit: 'contain',
                            borderRadius: '12px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                        }}
                    />
                    <p style={{
                        marginTop: '12px',
                        fontSize: '0.9rem',
                        color: 'var(--muted)',
                        textAlign: 'center'
                    }}>
                        Execute actions
                    </p>
                </motion.div>
            </div>
        </motion.div>
    )
}
