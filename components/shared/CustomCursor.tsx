'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('hover-target')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <motion.img
      src="/meta_knight_sword.png" 
      alt="Custom Cursor"
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      // Adjusted width for the sword
      style={{ width: '50px', height: 'auto' }} 
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
        // -45deg usually makes a sword point "forward" to the top-left
        rotate: isHovering ? -15 : -45, 
        scale: isHovering ? 1.3 : 1,
      }}
      transition={{ 
        type: 'spring', 
        stiffness: 800, 
        damping: 35
      }}
    />
  );
}