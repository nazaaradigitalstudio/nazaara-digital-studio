"use client";

import { motion } from "framer-motion";
import { useMagnetic } from "@/hooks/useMagnetic";

type Props = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  cursorLabel?: string;
  strength?: number;
};

/**
 * Magnetic container: the wrapper drifts toward the cursor and the inner
 * content trails slightly further for a layered pull. Pure motion values.
 * Renders an anchor when given href, a button when given onClick, else a div.
 */
export default function MagneticButton({
  children,
  href,
  onClick,
  type,
  className,
  cursorLabel,
  strength = 0.5,
}: Props) {
  const { ref, x, y, onMove, onLeave } = useMagnetic(strength);
  const Tag = href ? motion.a : onClick ? motion.button : motion.div;

  return (
    <Tag
      ref={ref as never}
      href={href}
      onClick={onClick}
      type={onClick && !href ? type ?? "button" : undefined}
      data-cursor={cursorLabel}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x, y }}
      className={`magnetic inline-block ${className ?? ""}`}
    >
      {children}
    </Tag>
  );
}
