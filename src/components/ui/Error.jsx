import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Error = ({ 
  title = 'Something went wrong',
  message = 'We encountered an error while loading this content. Please try again.',
  onRetry,
  showRetry = true
}) => {
  return (
    <motion.div
      className="bg-red-50 border border-red-200 rounded-xl p-8 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <ApperIcon name="AlertCircle" className="w-8 h-8 text-red-500" />
      </div>
      
      <h3 className="text-lg font-semibold text-red-900 mb-2">{title}</h3>
      <p className="text-red-700 mb-6 max-w-md mx-auto">{message}</p>
      
      {showRetry && onRetry && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="danger"
            onClick={onRetry}
            icon="RefreshCw"
          >
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            icon="RotateCcw"
          >
            Reload Page
          </Button>
        </div>
      )}
    </motion.div>
  )
}

export default Error