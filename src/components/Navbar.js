import { motion } from 'framer-motion';

export default function Navbar({ onReset }) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      style={{
        width: '100%',
        padding: '14px clamp(16px, 5vw, 32px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #2D2D3D',
        backgroundColor: '#0F0F13',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <motion.button
        onClick={onReset}
        whileHover={{ opacity: 0.8 }}
        whileTap={{ scale: 0.97 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          background: 'none',
          border: 'none',
          cursor: onReset ? 'pointer' : 'default',
          padding: 0,
        }}
      >
        <span style={{ fontSize: '20px', fontWeight: '800', color: 'white', letterSpacing: '-0.3px' }}>
          UXPulse
        </span>
        <span style={{ fontSize: '20px', fontWeight: '800', color: '#7C3AED', letterSpacing: '-0.3px' }}>
          AI
        </span>
      </motion.button>

      {/* Tagline center */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <span className="nav-tagline-dot" style={{
          width: '6px', height: '6px', borderRadius: '50%',
          backgroundColor: '#7C3AED',
          display: 'inline-block',
          boxShadow: '0 0 8px #7C3AED',
          animation: 'pulse 2s infinite',
        }} />
        <motion.span
          className="nav-tagline-text"
          initial={{ filter: 'blur(4px)', opacity: 0 }}
          animate={{ filter: 'blur(0px)', opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            fontWeight: '700',
            background: 'linear-gradient(90deg, #6B7280 0%, #E5E7EB 50%, #6B7280 100%)',
            backgroundSize: '200% auto',
            color: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'shimmer 5s linear infinite',
          }}
        >
          AI that reveals hidden UX problems
        </motion.span>
      </motion.div>

      {/* Right: avatar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1, rotate: 10, boxShadow: '0 0 15px rgba(124,58,237,0.6)' }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #7C3AED, #4B3B8C)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: '800',
          color: 'white',
          cursor: 'pointer',
          flexShrink: 0,
          border: '2px solid rgba(255,255,255,0.08)',
          boxShadow: '0 4px 10px rgba(124,58,237,0.2)',
          userSelect: 'none',
        }}
      >
        <motion.span
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          style={{ textShadow: '0 0 8px rgba(255,255,255,0.3)' }}
        >
          U
        </motion.span>
      </motion.div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes shimmer {
          to { background-position: 200% center; }
        }
        @media (max-width: 500px) {
          .nav-tagline-text { display: none !important; }
          .nav-tagline-dot { display: none !important; }
        }
      `}</style>
    </motion.nav>
  );
}
