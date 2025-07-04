import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import CourseCard from '@/components/molecules/CourseCard'
import CourseFilters from '@/components/molecules/CourseFilters'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { courseService } from '@/services/api/courseService'

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [courses, setCourses] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sortBy, setSortBy] = useState('popularity')
  const [viewMode, setViewMode] = useState('grid')

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'All Categories',
    level: 'All Levels',
    duration: 'Any Duration',
    rating: 'Any Rating',
    price: { min: '', max: '' }
  })

  useEffect(() => {
    loadCourses()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [courses, filters, sortBy, searchParams])

  const loadCourses = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await courseService.getAll()
      setCourses(data)
    } catch (err) {
      setError('Failed to load courses')
      console.error('Error loading courses:', err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...courses]
    const searchQuery = searchParams.get('search')

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply category filter
    if (filters.category !== 'All Categories') {
      filtered = filtered.filter(course => course.category === filters.category)
    }

    // Apply level filter
    if (filters.level !== 'All Levels') {
      filtered = filtered.filter(course => course.level === filters.level)
    }

    // Apply duration filter
    if (filters.duration !== 'Any Duration') {
      filtered = filtered.filter(course => {
        const hours = course.duration / 60
        switch (filters.duration) {
          case '0-2 hours':
            return hours <= 2
          case '2-6 hours':
            return hours > 2 && hours <= 6
          case '6-12 hours':
            return hours > 6 && hours <= 12
          case '12+ hours':
            return hours > 12
          default:
            return true
        }
      })
    }

    // Apply rating filter
    if (filters.rating !== 'Any Rating') {
      const minRating = parseFloat(filters.rating.replace('+', ''))
      filtered = filtered.filter(course => course.rating >= minRating)
    }

    // Apply price filter
    if (filters.price.min || filters.price.max) {
      filtered = filtered.filter(course => {
        const price = course.price
        const min = filters.price.min ? parseFloat(filters.price.min) : 0
        const max = filters.price.max ? parseFloat(filters.price.max) : Infinity
        return price >= min && price <= max
      })
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        filtered.sort((a, b) => b.Id - a.Id)
        break
      case 'popularity':
      default:
        filtered.sort((a, b) => b.enrolled - a.enrolled)
        break
    }

    setFilteredCourses(filtered)
  }

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters({
      category: 'All Categories',
      level: 'All Levels',
      duration: 'Any Duration',
      rating: 'Any Rating',
      price: { min: '', max: '' }
    })
    setSearchParams({})
  }

  const sortOptions = [
    { value: 'popularity', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {searchParams.get('search') ? `Search Results for "${searchParams.get('search')}"` : 'All Courses'}
          </h1>
          <p className="text-gray-600">
            {loading ? 'Loading courses...' : `${filteredCourses.length} courses found`}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <CourseFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClear={handleClearFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">Sort by:</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-primary text-white' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <ApperIcon name="Grid3X3" className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-primary text-white' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <ApperIcon name="List" className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Course Grid */}
            {loading && <Loading type="courses" />}
            
            {error && (
              <Error
                title="Failed to load courses"
                message={error}
                onRetry={loadCourses}
              />
            )}

            {!loading && !error && filteredCourses.length === 0 && (
              <Empty
                title="No courses found"
                message="Try adjusting your filters or search terms to find more courses."
                icon="Search"
                actionLabel="Clear Filters"
                onAction={handleClearFilters}
              />
            )}

            {!loading && !error && filteredCourses.length > 0 && (
              <motion.div
                className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                    : 'grid-cols-1'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {filteredCourses.map((course, index) => (
                  <motion.div
                    key={course.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <CourseCard course={course} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Courses