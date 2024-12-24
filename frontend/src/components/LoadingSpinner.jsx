import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  const circles = Array.from({ length: 12 }).map((_, index) => (
    <motion.div
      className="absolute w-4 h-4 bg-blue-500 rounded-full"
      key={index}
      style={{
        rotate: index * 30,
        translateX: '0',
        translateY: '-1.5rem',
      }}
      animate={{
        scale: [1, 1.5, 1],
        opacity: [1, 0.5, 1],
      }}
      transition={{
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut",
        repeatDelay: 0.1,
      }}
    />
  ));

  return (
    <div className="relative flex items-center justify-center h-screen">
      <div className="relative w-16 h-16">
        {circles}
      </div>
    </div>
  );
};

export default LoadingSpinner;
