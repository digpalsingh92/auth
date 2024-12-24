import React from 'react'
import PropTypes from "prop-types";
import { motion } from 'framer-motion'

export default function FloatingShape( { color, size, top, left, delay } ) {
  return (
    <motion.div className={`absolute rounded-full ${color} ${size} opacity-20 blur-xl`}
    style={{ top: top, left: left }}
    animate={{
      y: ["0%", "100%", "0%"],
      x: ["0%", "100%", "0%"],
      rotate: [0, 360],
    }}
    transition={{
      duration: 10,
      ease: 'linear',
      repeat: Infinity,
      delay: delay,
    }}
    />

  )
}
FloatingShape.propTypes = {
  color: PropTypes.string, //this is the prop type for the color and string is the type of the color
  size: PropTypes.string, //this is the prop type for the size and string is the type of the size
  top: PropTypes.string, //this is the prop type for the top and string is the type of the top
  left: PropTypes.string, //this is the prop type for the left and string is the type of the left
  delay: PropTypes.number //this is the prop type for the delay and number is the type of the delay
}