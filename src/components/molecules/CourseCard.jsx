import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import { useCart } from '@/hooks/useCart'

const CourseCard = ({ course, showProgress = false }) => {
  const { addToCart } = useCart()

  const handleAddToCart = (e) => {
    e.preventDefault()
    addToCart(course)
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <ApperIcon key={i} name="Star" className="w-4 h-4 text-yellow-400 fill-current" />
      )
    }

    if (hasHalfStar) {
      stars.push(
        <ApperIcon key="half" name="Star" className="w-4 h-4 text-yellow-400 fill-current opacity-50" />
      )
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <ApperIcon key={`empty-${i}`} name="Star" className="w-4 h-4 text-gray-300" />
      )
    }

    return stars
  }

  const getDifficultyColor = (level) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card hover className="overflow-hidden">
      <Link to={`/course/${course.Id}`}>
        <div className="aspect-video bg-gradient-to-br from-primary to-secondary rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
          <ApperIcon name="PlayCircle" className="w-12 h-12 text-white opacity-80" />
          <div className="absolute inset-0 bg-black bg-opacity-20" />
          
          {/* Category Badge */}
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 text-xs font-medium bg-white bg-opacity-90 rounded-full">
              {course.category}
            </span>
          </div>
          
          {/* Duration Badge */}
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 text-xs font-medium bg-black bg-opacity-70 text-white rounded-full">
              {Math.floor(course.duration / 60)}h {course.duration % 60}m
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(course.level)}`}>
              {course.level}
            </span>
            <div className="flex items-center space-x-1">
              {renderStars(course.rating)}
              <span className="text-sm text-gray-600 ml-1">({course.rating})</span>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {course.title}
          </h3>

          <p className="text-sm text-gray-600 line-clamp-2">
            {course.description}
          </p>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {course.instructor.name.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{course.instructor.name}</p>
              <p className="text-xs text-gray-500">{course.instructor.title}</p>
            </div>
          </div>

          {showProgress && course.progress !== undefined && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="text-sm font-medium text-primary">{course.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-500">
                <ApperIcon name="Users" className="w-4 h-4 mr-1" />
                {course.enrolled} students
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
                {Math.floor(course.duration / 60)}h {course.duration % 60}m
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                ${course.price}
              </div>
            </div>
          </div>
        </div>
      </Link>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex space-x-2">
          <Button
            variant="primary"
            size="small"
            className="flex-1"
            onClick={handleAddToCart}
            icon="ShoppingCart"
          >
            Add to Cart
          </Button>
          <Button
            variant="outline"
            size="small"
            icon="Heart"
            className="flex-shrink-0"
          />
        </div>
      </div>
    </Card>
  )
}

export default CourseCard