import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import { courseService } from '@/services/api/courseService'

const SearchBar = () => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([])
        return
      }

      setIsLoading(true)
      try {
        const courses = await courseService.searchCourses(query)
        setSuggestions(courses.slice(0, 5))
      } catch (error) {
        console.error('Error fetching suggestions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const debounce = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounce)
  }, [query])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/courses?search=${encodeURIComponent(query.trim())}`)
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (course) => {
    navigate(`/course/${course.Id}`)
    setShowSuggestions(false)
    setQuery('')
  }

  return (
    <div className="relative w-full">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <ApperIcon 
            name="Search" 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Search for courses..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
          />
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (query.length >= 2 || suggestions.length > 0) && (
        <motion.div
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {isLoading && (
            <div className="p-4 text-center text-gray-500">
              <div className="loading-spinner mx-auto mb-2"></div>
              Searching...
            </div>
          )}

          {!isLoading && suggestions.length === 0 && query.length >= 2 && (
            <div className="p-4 text-center text-gray-500">
              No courses found for "{query}"
            </div>
          )}

          {!isLoading && suggestions.length > 0 && (
            <div className="py-2">
              {suggestions.map((course) => (
                <div
                  key={course.Id}
                  onClick={() => handleSuggestionClick(course)}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center space-x-3"
                >
                  <div className="w-12 h-8 bg-gradient-to-r from-primary to-secondary rounded flex items-center justify-center">
                    <ApperIcon name="BookOpen" className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {course.title}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {course.instructor.name} • {course.category}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <ApperIcon name="Star" className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600 ml-1">{course.rating}</span>
                    </div>
                    <div className="text-sm font-bold text-primary">
                      ${course.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default SearchBar