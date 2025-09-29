'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface VisualEffectsProps {
  children: React.ReactNode;
  variant?: 'hero' | 'section' | 'card';
  className?: string;
}

export function VisualEffects({
  children,
  variant = 'section',
  className = '',
}: Readonly<VisualEffectsProps>) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Efectos de parallax sutiles
  const y = useTransform(scrollYProgress, [0, 1], [0, variant === 'hero' ? -50 : -20]);

  const variants = {
    hero: {
      initial: { y: 20, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
    },
    section: {
      initial: { y: 30, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
    },
    card: {
      initial: { y: 20, opacity: 0, scale: 0.95 },
      animate: { y: 0, opacity: 1, scale: 1 },
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ y: variant === 'hero' ? y : undefined }}
      initial={variants[variant].initial}
      whileInView={variants[variant].animate}
      transition={variants[variant].transition}
      viewport={{ once: true, margin: '-100px' }}
    >
      {children}
    </motion.div>
  );
}

// Componente para efectos de fondo animados
export function BackgroundEffects() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Partículas flotantes sutiles */}
      {Array.from({ length: 6 }, () => {
        const id = `particle-${Math.random().toString(36).substring(2, 9)}`;
        return (
          <motion.div
            key={id}
            className="absolute w-1 h-1 bg-neutral-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20],
              x: [-10, 10],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 2,
            }}
          />
        );
      })}

      {/* Ondas de luz sutiles */}
      <motion.div
        className="absolute top-1/4 left-0 w-full h-32 bg-gradient-to-r from-transparent via-neutral-300/5 to-transparent blur-xl"
        animate={{
          x: [-200, window.innerWidth + 200],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <motion.div
        className="absolute bottom-1/3 right-0 w-full h-24 bg-gradient-to-l from-transparent via-neutral-400/8 to-transparent blur-2xl"
        animate={{
          x: [200, -window.innerWidth - 200],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
          delay: 5,
        }}
      />
    </div>
  );
}

// Hook para efectos de hover con framer-motion
export function useHoverEffect() {
  return {
    initial: { scale: 1 },
    whileHover: {
      scale: 1.02,
      transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
    whileTap: { scale: 0.98 },
  };
}

// Componente para efectos metálicos en hover
export function MetallicHover({
  children,
  className = '',
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-full ${className}`}
      whileHover="hover"
      initial="initial"
    >
      {children}

      {/* Efecto de barrido metálico */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-sm"
        variants={{
          initial: { x: '-100%', opacity: 0 },
          hover: {
            x: '100%',
            opacity: [0, 1, 0],
            transition: { duration: 0.6, ease: 'easeInOut' },
          },
        }}
        style={{ mixBlendMode: 'overlay' }}
      />
    </motion.div>
  );
}
