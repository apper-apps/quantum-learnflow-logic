import React from 'react'
import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  padding = 'medium',
  ...props 
}) => {
  const baseClasses = "bg-white rounded-xl shadow-md border border-gray-100"
  
  const paddings = {
    none: '',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  }

  const hoverClasses = hover ? 'card-hover' : ''
  
  const combinedClasses = `${baseClasses} ${paddings[padding]} ${hoverClasses} ${className}`

  return (
    <motion.div
      className={combinedClasses}
      whileHover={hover ? { y: -8 } : {}}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card