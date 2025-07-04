import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Empty = ({ 
  title = 'No content found',
  message = 'There\'s nothing to display here yet.',
  icon = 'Search',
  actionLabel,
  onAction,
  showAction = true
}) => {
  return (
    <motion.div
      className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <ApperIcon name={icon} className="w-10 h-10 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">{message}</p>
      
      {showAction && onAction && (
        <Button
          variant="primary"
          onClick={onAction}
          icon="Plus"
          size="large"
        >
          {actionLabel || 'Get Started'}
        </Button>
      )}
    </motion.div>
  )
}

export default Empty