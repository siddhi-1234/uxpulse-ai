import { useDropzone } from 'react-dropzone';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

function Particle({ x, y, size, duration, delay, color }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
        pointerEvents: 'none',
      }}
      animate={{ y: [0, -28, 0], opacity: [0, 0.6, 0], scale: [0.5, 1, 0.5] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

function ScanLine({ active }) {
  return (
    <motion.div
      animate={active ? { y: ['0%', '100%', '0%'] } : { y: '0%' }}
      transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
      style={{
        position: 'absolute', left: 0, right: 0, top: 0,
        height: '2px',
        background: 'linear-gradient(90deg, transparent, #7C3AED, #A78BFA, #7C3AED, transparent)',
        opacity: active ? 0.8 : 0,
        transition: 'opacity 0.3s',
        zIndex: 3, pointerEvents: 'none',
      }}
    />
  );
}

function CornerBrackets({ color }) {
  const size = 18;
  const t = 2;
  const corners = [
    { top: -1, left: -1, borderTop: t, borderLeft: t },
    { top: -1, right: -1, borderTop: t, borderRight: t },
    { bottom: -1, left: -1, borderBottom: t, borderLeft: t },
    { bottom: -1, right: -1, borderBottom: t, borderRight: t },
  ];
  return (
    <>
      {corners.map((s, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: size, height: size,
          borderStyle: 'solid', borderColor: color,
          borderTopWidth: s.borderTop || 0,
          borderLeftWidth: s.borderLeft || 0,
          borderRightWidth: s.borderRight || 0,
          borderBottomWidth: s.borderBottom || 0,
          top: s.top, bottom: s.bottom,
          left: s.left, right: s.right,
          transition: 'border-color 0.3s', zIndex: 4,
        }} />
      ))}
    </>
  );
}

function AnimatedWord({ word, color, staggerDelay = 0 }) {
  return (
    <>
      {word.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 40, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.5, delay: staggerDelay + i * 0.05, ease: [0.215, 0.61, 0.355, 1] }}
          style={{ display: 'inline-block', color, transformOrigin: 'bottom' }}
        >
          {char}
        </motion.span>
      ))}
    </>
  );
}

const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: `${2 + Math.random() * 2.5}px`,
  duration: 3 + Math.random() * 4,
  delay: Math.random() * 4,
  color: i % 3 === 0 ? '#7C3AED' : i % 3 === 1 ? '#A78BFA' : '#4F46E5',
}));

export default function UploadZone({ onImageUpload }) {
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Detect mobile once on mount
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const rotateX = useTransform(mouseY, [-200, 200], [3, -3]);
  const rotateY = useTransform(mouseX, [-200, 200], [-3, 3]);

  const handleMouseMove = (e) => {
    if (isMobile) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/png':  ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (!acceptedFiles || acceptedFiles.length === 0) return;
      const file = acceptedFiles[0];
      onImageUpload(URL.createObjectURL(file), file);
    },
  });

  const accentColor = isDragActive ? '#A78BFA' : '#7C3AED';

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      width: '100%', padding: '0 16px 64px',
      position: 'relative', overflow: 'hidden',
    }}>

      {/* Background particles — hidden on mobile for performance */}
      {!isMobile && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          {PARTICLES.map(p => <Particle key={p.id} {...p} />)}
        </div>
      )}

      {/* Radial glow */}
      <div style={{
        position: 'absolute', top: '5%', left: '50%',
        transform: 'translateX(-50%)',
        width: '500px', height: '280px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(124,58,237,0.1) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ── HERO ── */}
      <div style={{
        textAlign: 'center', marginTop: '48px', marginBottom: '36px',
        position: 'relative', zIndex: 1,
        // Force crisp text rendering on mobile
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      }}>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            padding: '5px 14px', borderRadius: '99px',
            border: '1px solid rgba(124,58,237,0.35)',
            backgroundColor: 'rgba(124,58,237,0.08)',
            marginBottom: '20px',
          }}
        >
          <motion.span
            animate={{ scale: [1, 1.35, 1], opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            style={{
              width: '6px', height: '6px', borderRadius: '50%',
              backgroundColor: '#7C3AED', display: 'inline-block', flexShrink: 0,
            }}
          />
          <span style={{
            fontSize: '11px', fontWeight: '600', color: '#A78BFA',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            AI-Powered UX Analysis
          </span>
        </motion.div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(32px, 8vw, 62px)',
          fontWeight: '800',
          margin: '0 0 4px 0',
          lineHeight: 1.08,
          letterSpacing: '-1px',
          // Prevent blur from perspective on mobile
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}>
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            style={{ display: 'block', color: 'white' }}
          >
            Visualize the
          </motion.span>
          <span style={{
            display: 'block',
            // No perspective on mobile — prevents blur
            perspective: isMobile ? 'none' : '600px',
          }}>
            <AnimatedWord word="Invisible" color="#7C3AED" staggerDelay={0.42} />
          </span>
        </h1>

        {/* Underline */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.65, delay: 1.05, ease: 'easeOut' }}
          style={{
            height: '3px',
            width: 'clamp(140px, 28vw, 260px)',
            margin: '10px auto 18px',
            borderRadius: '99px',
            background: 'linear-gradient(90deg, transparent, #7C3AED, #A78BFA, transparent)',
            transformOrigin: 'left',
          }}
        />

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.85 }}
          style={{
            color: '#9CA3AF',
            fontSize: 'clamp(13px, 2.5vw, 15px)',
            maxWidth: '420px',
            margin: '0 auto',
            lineHeight: 1.7,
            fontWeight: '400',
          }}
        >
          Upload your interface designs and let our AI detect friction,
          confusion zones, and hierarchy issues in seconds.
        </motion.p>
      </div>

      {/* ── DROP ZONE ── */}
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => !isMobile && setHovered(true)}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.45 }}
        style={{
          width: '100%',
          maxWidth: '640px',
          position: 'relative', zIndex: 1,
          // Only apply 3D tilt on desktop
          rotateX: isMobile ? 0 : rotateX,
          rotateY: isMobile ? 0 : rotateY,
          transformStyle: isMobile ? 'flat' : 'preserve-3d',
          // Force GPU layer but avoid subpixel blur on mobile
          transform: isMobile ? 'translateZ(0)' : undefined,
          willChange: isMobile ? 'auto' : 'transform',
        }}
      >
        <div
          {...getRootProps()}
          style={{
            width: '100%',
            borderRadius: '18px',
            border: `2px solid ${
              isDragActive ? '#7C3AED'
              : hovered ? 'rgba(124,58,237,0.55)'
              : 'rgba(124,58,237,0.28)'
            }`,
            backgroundColor: isDragActive
              ? 'rgba(124,58,237,0.1)'
              : hovered ? 'rgba(124,58,237,0.05)'
              : '#131320',
            padding: 'clamp(32px, 7vw, 60px) clamp(20px, 5vw, 40px)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            transition: 'border-color 0.25s, background-color 0.25s, box-shadow 0.25s',
            boxSizing: 'border-box',
            position: 'relative', overflow: 'hidden',
            boxShadow: isDragActive
              ? '0 0 36px rgba(124,58,237,0.22), inset 0 0 36px rgba(124,58,237,0.04)'
              : hovered ? '0 0 20px rgba(124,58,237,0.1)' : 'none',
            // Sharp rendering
            WebkitFontSmoothing: 'antialiased',
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)',
          }}
        >
          <input {...getInputProps()} />

          <CornerBrackets color={
            isDragActive ? '#A78BFA'
            : hovered ? '#7C3AED'
            : 'rgba(124,58,237,0.45)'
          } />

          <ScanLine active={isDragActive || hovered} />

          {/* Grid pattern */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `
              linear-gradient(rgba(124,58,237,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(124,58,237,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
            opacity: isDragActive ? 1 : hovered ? 0.6 : 0.35,
            transition: 'opacity 0.3s', zIndex: 0,
          }} />

          {/* Upload icon */}
          <motion.div
            animate={isDragActive
              ? { scale: [1, 1.12, 1], rotate: [0, -4, 4, 0] }
              : { scale: 1, rotate: 0 }
            }
            transition={{ duration: 0.5, repeat: isDragActive ? Infinity : 0 }}
            style={{
              width: '64px', height: '64px', borderRadius: '16px',
              backgroundColor: isDragActive
                ? 'rgba(124,58,237,0.22)'
                : 'rgba(124,58,237,0.1)',
              border: `1px solid ${isDragActive ? '#7C3AED' : 'rgba(124,58,237,0.28)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '18px', position: 'relative', zIndex: 1,
              transition: 'background-color 0.3s, border-color 0.3s',
              // Prevent icon blur
              transform: 'translateZ(0)',
            }}
          >
            <svg width="30" height="30" fill="none" viewBox="0 0 24 24"
              stroke={accentColor} strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.338-2.32 5.75 5.75 0 011.571 11.096" />
            </svg>
          </motion.div>

          <p style={{
            color: isDragActive ? '#A78BFA' : 'white',
            fontWeight: '700',
            fontSize: 'clamp(15px, 3.5vw, 20px)',
            margin: '0 0 6px 0', textAlign: 'center',
            position: 'relative', zIndex: 1,
            transition: 'color 0.2s',
            letterSpacing: '-0.2px',
          }}>
            {isDragActive ? 'Release to analyze →' : 'Drop your UI screenshot here'}
          </p>

          <p style={{
            color: '#6B7280', fontSize: '11px',
            letterSpacing: '0.09em', textTransform: 'uppercase',
            margin: '0 0 22px 0', textAlign: 'center',
            position: 'relative', zIndex: 1,
          }}>
            or click to browse — PNG · JPG · WEBP
          </p>

          <motion.button
            type="button"
            whileHover={{ scale: 1.04, boxShadow: '0 0 22px rgba(124,58,237,0.45)' }}
            whileTap={{ scale: 0.96 }}
            style={{
              padding: '10px 30px', borderRadius: '10px',
              border: '1px solid rgba(124,58,237,0.45)',
              backgroundColor: 'rgba(124,58,237,0.18)',
              color: '#A78BFA', fontSize: '13px', fontWeight: '600',
              cursor: 'pointer', letterSpacing: '0.02em',
              position: 'relative', zIndex: 1,
              transition: 'background-color 0.2s',
            }}
          >
            Upload Screenshot
          </motion.button>

          {/* Format badges */}
          <div style={{ display: 'flex', gap: '6px', marginTop: '14px', position: 'relative', zIndex: 1 }}>
            {['PNG', 'JPG', 'WEBP'].map(fmt => (
              <span key={fmt} style={{
                fontSize: '10px', fontWeight: '600',
                color: 'rgba(167,139,250,0.7)',
                border: '1px solid rgba(124,58,237,0.2)',
                padding: '2px 7px', borderRadius: '4px',
                backgroundColor: 'rgba(124,58,237,0.06)',
                letterSpacing: '0.04em',
              }}>
                {fmt}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Feature chips ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        style={{
          display: 'flex', gap: '8px', marginTop: '24px',
          flexWrap: 'wrap', justifyContent: 'center',
          position: 'relative', zIndex: 1,
        }}
      >
        {[
          { icon: '🔍', label: 'Confusion Zones', tag: 'AI-detected' },
          { icon: '🧠', label: 'AI Reasoning',    tag: 'Explained'  },
          { icon: '✨', label: 'Fix Suggestions', tag: 'Actionable' },
        ].map((chip, i) => (
          <motion.div
            key={chip.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.88 + i * 0.1 }}
            whileHover={{ borderColor: 'rgba(124,58,237,0.45)', backgroundColor: 'rgba(124,58,237,0.06)' }}
            style={{
              padding: '7px 14px', borderRadius: '99px',
              border: '1px solid #2D2D3D', backgroundColor: '#1A1A24',
              display: 'flex', alignItems: 'center', gap: '6px',
              cursor: 'default', transition: 'all 0.2s',
            }}
          >
            <span style={{ fontSize: '13px' }}>{chip.icon}</span>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#9CA3AF', letterSpacing: '0.03em' }}>
              {chip.label}
            </span>
            <span style={{
              fontSize: '10px', color: '#7C3AED',
              backgroundColor: 'rgba(124,58,237,0.1)',
              padding: '1px 6px', borderRadius: '99px', fontWeight: '600',
            }}>
              {chip.tag}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
