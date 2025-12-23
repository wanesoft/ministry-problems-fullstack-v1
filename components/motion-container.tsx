"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

interface MotionContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function MotionContainer({ children, className, delay = 0 }: MotionContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function MotionWrapper({ children }: { children: ReactNode }) {
  return <AnimatePresence mode="wait">{children}</AnimatePresence>;
}
