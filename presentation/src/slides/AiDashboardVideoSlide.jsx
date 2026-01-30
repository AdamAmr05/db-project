import { motion } from 'framer-motion'

export default function AiDashboardVideoSlide() {
    const embedUrl = 'https://www.youtube.com/embed/4SbajJbVu5w?autoplay=1&mute=1&controls=0&playsinline=1&rel=0&modestbranding=1&vq=hd720'

    return (
        <motion.div
            className="slide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ padding: '40px' }}
        >
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                style={{ marginBottom: '24px' }}
            >
                AI-Generated Dashboards
            </motion.h2>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                style={{ marginBottom: '24px', fontSize: '1.1rem', color: 'var(--muted)' }}
            >
                Live generation from natural language prompts
            </motion.p>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.2)',
                    display: 'inline-block',
                    position: 'relative',
                    // Match the source video (approx 16:10) to avoid bars
                    width: 'min(85vw, calc(75vh * 16 / 10))',
                    aspectRatio: '16 / 10',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                }}
            >
                {embedUrl ? (
                    <iframe
                        src={embedUrl}
                        title="AI Dashboard Demo"
                        frameBorder="0"
                        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                        allowFullScreen
                        style={{
                            width: '100%',
                            height: '100%',
                            display: 'block',
                            border: 0,
                        }}
                    />
                ) : (
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            color: 'var(--muted)',
                            fontSize: '1rem',
                            padding: '24px',
                            background: 'linear-gradient(135deg, rgba(78, 155, 255, 0.08), rgba(255, 120, 214, 0.08))',
                        }}
                    >
                        Video embed coming soon
                    </div>
                )}
            </motion.div>
        </motion.div>
    )
}
