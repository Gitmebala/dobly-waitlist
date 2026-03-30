'use client';

import { motion } from 'framer-motion';

type LogoProps = {
  className?: string;
  animated?: boolean;
};

export function Logo({ className, animated = false }: LogoProps) {
  const transition = { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <motion.svg
      width="36"
      height="36"
      viewBox="0 0 80 80"
      fill="none"
      className={className}
      initial={false}
      animate={
        animated
          ? {
              rotate: [0, 1.2, -1.2, 0],
              y: [0, -1.5, 1, 0],
              scale: [1, 1.015, 0.995, 1]
            }
          : undefined
      }
      transition={
        animated
          ? {
              duration: 6.4,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut'
            }
          : undefined
      }
      whileHover={animated ? 'hover' : undefined}
    >
      <motion.path
        d="M40 6 C60 6,74 20,74 40 C74 58,62 74,40 74 C24 74,8 62,6 44 C4 28,16 6,40 6Z"
        stroke="#4F46E5"
        strokeWidth="3"
        fill="rgba(79,70,229,0.12)"
        variants={animated ? { hover: { scale: 1.03, filter: 'drop-shadow(0 0 16px rgba(79,70,229,0.34))' } } : undefined}
        transition={transition}
      />
      <motion.path
        d="M40 16 C55 16,64 26,64 40 C64 53,55 63,40 63 C28 63,18 55,17 43 C15 31,24 16,40 16Z"
        stroke="rgba(79,70,229,0.28)"
        strokeWidth="1"
        fill="none"
        variants={animated ? { hover: { pathLength: [1, 0.82, 1] } } : undefined}
        transition={{ ...transition, delay: 0.04 }}
      />
      <motion.circle
        cx="40"
        cy="40"
        r="9"
        fill="rgba(196,154,42,0.18)"
        animate={animated ? { opacity: [0.18, 0.28, 0.18], scale: [1, 1.06, 1] } : undefined}
        variants={animated ? { hover: { scale: [1, 1.16, 1] } } : undefined}
        transition={animated ? { duration: 3.2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' } : { ...transition, delay: 0.08 }}
      />
      <motion.circle
        cx="40"
        cy="40"
        r="5.5"
        fill="#C49A2A"
        animate={animated ? { scale: [1, 1.07, 1], opacity: [1, 0.88, 1] } : undefined}
        variants={animated ? { hover: { scale: [1, 1.18, 1] } } : undefined}
        transition={animated ? { duration: 2.7, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' } : { ...transition, delay: 0.1 }}
      />
      <motion.circle
        cx="35"
        cy="35"
        r="2.5"
        fill="white"
        opacity="0.18"
        animate={animated ? { opacity: [0.18, 0.32, 0.18], x: [0, 0.4, 0], y: [0, -0.4, 0] } : undefined}
        variants={animated ? { hover: { opacity: [0.18, 0.34, 0.18] } } : undefined}
        transition={animated ? { duration: 2.1, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' } : { ...transition, delay: 0.12 }}
      />
    </motion.svg>
  );
}
