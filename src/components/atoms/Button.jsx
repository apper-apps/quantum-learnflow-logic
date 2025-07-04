import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  icon, 
  iconPosition = 'left',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg focus:ring-primary",
    secondary: "bg-white text-primary border border-primary hover:bg-primary hover:text-white focus:ring-primary",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    success: "bg-gradient-to-r from-success to-green-600 text-white hover:shadow-lg focus:ring-success",
    warning: "bg-gradient-to-r from-warning to-orange-600 text-white hover:shadow-lg focus:ring-warning",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:shadow-lg focus:ring-error",
  }

  const sizes = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-sm",
    large: "px-6 py-3 text-base",
    xlarge: "px-8 py-4 text-lg",
  }

  const combinedClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${
    disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
  }`

  const handleClick = (e) => {
    if (disabled || loading) return
    onClick && onClick(e)
  }

  return (
    <motion.button
      className={combinedClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      {...props}
    >
      {loading && (
        <div className="loading-spinner mr-2" />
      )}
      
      {icon && iconPosition === 'left' && !loading && (
        <ApperIcon name={icon} className="w-4 h-4 mr-2" />
      )}
      
      {children}
      
      {icon && iconPosition === 'right' && !loading && (
        <ApperIcon name={icon} className="w-4 h-4 ml-2" />
      )}
    </motion.button>
  )
}

export default Button