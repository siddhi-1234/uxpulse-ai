import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  'Reading visual hierarchy…',
  'Scanning for confusion zones…',
  'Evaluating contrast ratios…',
  'Checking label clarity…',
  'Generating fix suggestions…',
];

export default function LoadingOverlay({ visible }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!visible) { setStep(0); return; }
    const id = setInterval(() => setStep(prev => (prev + 1) % steps.length), 900);
    return () => clearInterval(id);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute', inset: 0,
            backgroundColor: 'rgba(15,15,19,0.85)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '16px', zIndex: 20,
          }}
        >
          {/* Spinner */}
          <div style={{
            width: '44px', height: '44px', borderRadius: '50%',
            border: '3px solid #2D2D3D',
            borderTop: '3px solid #7C3AED',
            animation: 'spin 0.75s linear infinite',
          }} />

          {/* Cycling text */}
          <AnimatePresence mode="wait">
            <motion.p
              key={step}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              style={{ color: 'white', fontWeight: '600', fontSize: '15px', margin: 0 }}
            >
              {steps[step]}
            </motion.p>
          </AnimatePresence>

          <p style={{ color: '#6B7280', fontSize: '12px', margin: 0 }}>
            This usually takes 5–10 seconds
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
