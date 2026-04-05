import { motion } from 'framer-motion';

const severityConfig = {
  high:   { color: '#EF4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)',   label: 'High' },
  medium: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', label: 'Medium' },
};

export default function AnalysisPanel({ annotation, onClose }) {
  if (!annotation) return null;
  const s = severityConfig[annotation.severity] || severityConfig.medium;

  return (
    <motion.div
      className="analysis-panel-mobile"
      initial={{ opacity: 0, y: 48, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 48, scale: 0.96 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        right: '20px',
        top: '76px',
        width: 'min(340px, calc(100vw - 32px))',
        borderRadius: '16px',
        border: '1px solid #2D2D3D',
        backgroundColor: '#1A1A24',
        zIndex: 200,
        overflow: 'hidden',
        boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '16px 18px',
        borderBottom: '1px solid #2D2D3D',
        display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between', gap: '10px',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: '5px' }}>
            <span style={{
              fontSize: '10px', fontWeight: '700', textTransform: 'uppercase',
              letterSpacing: '0.07em', color: s.color,
              backgroundColor: s.bg, border: `1px solid ${s.border}`,
              padding: '2px 8px', borderRadius: '99px',
            }}>
              {s.label} severity
            </span>
          </div>
          <h3 style={{ color: 'white', fontWeight: '700', fontSize: '16px', margin: 0, lineHeight: 1.3 }}>
            {annotation.title}
          </h3>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'transparent', border: 'none', color: '#6B7280',
            cursor: 'pointer', padding: '2px 6px', borderRadius: '6px',
            fontSize: '20px', lineHeight: 1, flexShrink: 0,
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.target.style.color = 'white'}
          onMouseLeave={e => e.target.style.color = '#6B7280'}
        >
          ×
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: '18px' }}>

        {/* Why it confuses */}
        <div style={{ marginBottom: '14px' }}>
          <p style={{
            fontSize: '10px', fontWeight: '700', textTransform: 'uppercase',
            letterSpacing: '0.07em', color: '#6B7280', marginBottom: '6px',
          }}>
            🔍 Why it confuses users
          </p>
          <p style={{
            fontSize: '13px', color: '#D1D5DB', lineHeight: '1.65', margin: 0,
            backgroundColor: '#0F0F13', borderRadius: '8px', padding: '10px 12px',
          }}>
            {annotation.explanation}
          </p>
        </div>

        {/* Suggested fix */}
        <div style={{ marginBottom: '16px' }}>
          <p style={{
            fontSize: '10px', fontWeight: '700', textTransform: 'uppercase',
            letterSpacing: '0.07em', color: '#6B7280', marginBottom: '6px',
          }}>
            ✨ Suggested fix
          </p>
          <div style={{
            fontSize: '13px', color: '#D1D5DB', lineHeight: '1.65',
            backgroundColor: 'rgba(124,58,237,0.08)',
            border: '1px solid rgba(124,58,237,0.2)',
            borderRadius: '8px', padding: '10px 12px',
          }}>
            {annotation.suggestion}
          </div>
        </div>

        {/* Zone coordinates */}
        <div style={{
          padding: '10px 12px', borderRadius: '8px',
          backgroundColor: '#0F0F13',
          display: 'flex', gap: '20px',
        }}>
          <div>
            <p style={{ fontSize: '10px', color: '#6B7280', margin: '0 0 2px 0' }}>Position</p>
            <p style={{ fontSize: '12px', color: 'white', fontFamily: 'monospace', margin: 0 }}>
              x:{Math.round(annotation.zone.xPercent)}% y:{Math.round(annotation.zone.yPercent)}%
            </p>
          </div>
          <div>
            <p style={{ fontSize: '10px', color: '#6B7280', margin: '0 0 2px 0' }}>Size</p>
            <p style={{ fontSize: '12px', color: 'white', fontFamily: 'monospace', margin: 0 }}>
              {Math.round(annotation.zone.widthPercent)}% × {Math.round(annotation.zone.heightPercent)}%
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .analysis-panel-mobile {
            right: 16px !important;
            left: 16px !important;
            width: auto !important;
            max-width: none !important;
            bottom: 16px !important;
            top: auto !important;
            box-shadow: 0 -8px 40px rgba(0,0,0,0.6) !important;
          }
        }
      `}</style>
    </motion.div>
  );
}
