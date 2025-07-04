import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const CourseFilters = ({ filters, onFiltersChange, onClear }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const categories = [
    'All Categories',
    'Web Development',
    'Data Science',
    'Machine Learning',
    'Mobile Development',
    'Design',
    'Business',
    'Photography',
    'Marketing',
    'Music'
  ]

  const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced']
  const durations = ['Any Duration', '0-2 hours', '2-6 hours', '6-12 hours', '12+ hours']
  const ratings = ['Any Rating', '4.5+', '4.0+', '3.5+', '3.0+']

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const handlePriceChange = (key, value) => {
    onFiltersChange({
      ...filters,
      price: {
        ...filters.price,
        [key]: value
      }
    })
  }

  const activeFiltersCount = Object.values(filters).filter(value => {
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(v => v !== '')
    }
    return value !== '' && value !== 'All Categories' && value !== 'All Levels' && value !== 'Any Duration' && value !== 'Any Rating'
  }).length

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <ApperIcon name="Filter" className="w-5 h-5 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="ml-2 px-2 py-1 text-xs bg-primary text-white rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </h3>
          <div className="flex items-center space-x-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="small"
                onClick={onClear}
                className="text-gray-500 hover:text-gray-700"
              >
                Clear All
              </Button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
            >
              <ApperIcon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <motion.div
        className={`${isExpanded ? 'block' : 'hidden'} lg:block`}
        initial={{ height: 0 }}
        animate={{ height: isExpanded ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-4 space-y-6">
          {/* Category Filter */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Category</h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleFilterChange('category', category)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                    filters.category === category
                      ? 'bg-gradient-to-r from-primary to-secondary text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Level Filter */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Level</h4>
            <div className="space-y-2">
              {levels.map((level) => (
                <button
                  key={level}
                  onClick={() => handleFilterChange('level', level)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                    filters.level === level
                      ? 'bg-gradient-to-r from-primary to-secondary text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Duration Filter */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Duration</h4>
            <div className="space-y-2">
              {durations.map((duration) => (
                <button
                  key={duration}
                  onClick={() => handleFilterChange('duration', duration)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                    filters.duration === duration
                      ? 'bg-gradient-to-r from-primary to-secondary text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {duration}
                </button>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Rating</h4>
            <div className="space-y-2">
              {ratings.map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleFilterChange('rating', rating)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center ${
                    filters.rating === rating
                      ? 'bg-gradient-to-r from-primary to-secondary text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {rating !== 'Any Rating' && (
                    <div className="flex items-center mr-2">
                      <ApperIcon name="Star" className="w-4 h-4 text-yellow-400 fill-current" />
                    </div>
                  )}
                  {rating}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Min Price</label>
                <input
                  type="number"
                  value={filters.price.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Max Price</label>
                <input
                  type="number"
                  value={filters.price.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  placeholder="1000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default CourseFilters