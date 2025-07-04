import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { courseService } from '@/services/api/courseService'
import { useCart } from '@/hooks/useCart'

const CourseDetail = () => {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedSection, setExpandedSection] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const { addToCart, isInCart } = useCart()

  useEffect(() => {
    loadCourse()
  }, [id])

  const loadCourse = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await courseService.getById(parseInt(id))
      setCourse(data)
    } catch (err) {
      setError('Failed to load course details')
      console.error('Error loading course:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (course) {
      addToCart(course)
      toast.success('Course added to cart!')
    }
  }

  const handleEnrollNow = () => {
    if (course) {
      addToCart(course)
      // Navigate to checkout in a real app
      toast.success('Redirecting to checkout...')
    }
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
    switch (level?.toLowerCase()) {
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

  if (loading) return <Loading type="page" />
  if (error) return <Error title="Course not found" message={error} onRetry={loadCourse} />
  if (!course) return <Error title="Course not found" message="The course you're looking for doesn't exist." />

  const totalDuration = course.sections?.reduce((total, section) => 
    total + section.lessons.reduce((sectionTotal, lesson) => sectionTotal + lesson.duration, 0), 0
  ) || 0

  const totalLessons = course.sections?.reduce((total, section) => total + section.lessons.length, 0) || 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ApperIcon name="ChevronRight" className="w-4 h-4" />
            <Link to="/courses" className="hover:text-primary">Courses</Link>
            <ApperIcon name="ChevronRight" className="w-4 h-4" />
            <span className="text-gray-900">{course.title}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Section */}
            <Card className="mb-8">
              <div className="aspect-video bg-gradient-to-br from-primary to-secondary rounded-lg mb-6 flex items-center justify-center relative overflow-hidden">
                <ApperIcon name="PlayCircle" className="w-16 h-16 text-white opacity-80" />
                <div className="absolute inset-0 bg-black bg-opacity-20" />
                
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-sm font-medium bg-white bg-opacity-90 rounded-full">
                    {course.category}
                  </span>
                </div>
                
                <div className="absolute bottom-4 right-4">
                  <button className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all duration-200">
                    <ApperIcon name="Play" className="w-4 h-4 mr-2 inline" />
                    Preview
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(course.level)}`}>
                    {course.level}
                  </span>
                  <div className="flex items-center space-x-1">
                    {renderStars(course.rating)}
                    <span className="text-sm text-gray-600 ml-2">({course.rating})</span>
                  </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
                <p className="text-lg text-gray-600">{course.description}</p>

                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <ApperIcon name="Users" className="w-4 h-4 mr-1" />
                    {course.enrolled} students
                  </div>
                  <div className="flex items-center">
                    <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
                    {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                  </div>
                  <div className="flex items-center">
                    <ApperIcon name="BookOpen" className="w-4 h-4 mr-1" />
                    {totalLessons} lessons
                  </div>
                  <div className="flex items-center">
                    <ApperIcon name="Download" className="w-4 h-4 mr-1" />
                    Certificate
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {course.instructor.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{course.instructor.name}</p>
                    <p className="text-sm text-gray-500">{course.instructor.title}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Tabs */}
            <Card className="mb-8">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {[
                    { id: 'overview', label: 'Overview', icon: 'FileText' },
                    { id: 'curriculum', label: 'Curriculum', icon: 'List' },
                    { id: 'instructor', label: 'Instructor', icon: 'User' },
                    { id: 'reviews', label: 'Reviews', icon: 'Star' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-primary text-primary'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <ApperIcon name={tab.icon} className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="py-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">What you'll learn</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          'Master the fundamentals of the subject',
                          'Build real-world projects',
                          'Learn industry best practices',
                          'Get hands-on experience',
                          'Understand advanced concepts',
                          'Prepare for certification'
                        ].map((item, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <ApperIcon name="Check" className="w-4 h-4 text-green-500" />
                            <span className="text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Requirements</h3>
                      <ul className="space-y-2">
                        {[
                          'Basic computer skills',
                          'Internet connection',
                          'No prior experience required'
                        ].map((req, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <ApperIcon name="Circle" className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-700">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'curriculum' && (
                  <div className="space-y-4">
                    {course.sections?.map((section, sectionIndex) => (
                      <div key={section.id} className="border border-gray-200 rounded-lg">
                        <button
                          onClick={() => setExpandedSection(expandedSection === sectionIndex ? null : sectionIndex)}
                          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
                        >
                          <div>
                            <h4 className="font-medium text-gray-900">{section.title}</h4>
                            <p className="text-sm text-gray-500">
                              {section.lessons.length} lessons • {Math.floor(section.duration / 60)}h {section.duration % 60}m
                            </p>
                          </div>
                          <ApperIcon 
                            name={expandedSection === sectionIndex ? "ChevronUp" : "ChevronDown"} 
                            className="w-5 h-5 text-gray-400" 
                          />
                        </button>
                        
                        {expandedSection === sectionIndex && (
                          <div className="border-t border-gray-200">
                            {section.lessons.map((lesson, lessonIndex) => (
                              <div key={lesson.id} className="px-4 py-3 flex items-center justify-between border-b border-gray-100 last:border-b-0">
                                <div className="flex items-center space-x-3">
                                  <ApperIcon name="PlayCircle" className="w-4 h-4 text-primary" />
                                  <span className="text-sm text-gray-700">{lesson.title}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-500">{lesson.duration}m</span>
                                  {lesson.preview && (
                                    <button className="text-xs text-primary hover:underline">Preview</button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'instructor' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                        <span className="text-white text-xl font-medium">
                          {course.instructor.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{course.instructor.name}</h3>
                        <p className="text-gray-600">{course.instructor.title}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1">
                            {renderStars(4.8)}
                            <span className="text-sm text-gray-600">4.8</span>
                          </div>
                          <span className="text-sm text-gray-500">12,345 students</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">About the instructor</h4>
                      <p className="text-gray-700 leading-relaxed">
                        {course.instructor.name} is a seasoned professional with over 10 years of experience in the field. 
                        They have helped thousands of students achieve their learning goals through practical, hands-on instruction.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-8">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gray-900 mb-2">{course.rating}</div>
                        <div className="flex items-center justify-center space-x-1 mb-2">
                          {renderStars(course.rating)}
                        </div>
                        <p className="text-sm text-gray-500">Course Rating</p>
                      </div>
                      <div className="flex-1">
                        {[5, 4, 3, 2, 1].map((star) => (
                          <div key={star} className="flex items-center space-x-2 mb-1">
                            <span className="text-sm text-gray-600 w-8">{star}★</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-yellow-400 h-2 rounded-full" 
                                style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 5 : star === 2 ? 3 : 2}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-500 w-8">{star === 5 ? '70%' : star === 4 ? '20%' : '5%'}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {[
                        { name: 'John D.', rating: 5, comment: 'Excellent course! Very comprehensive and well-structured.' },
                        { name: 'Sarah M.', rating: 4, comment: 'Great content, but could use more examples.' },
                        { name: 'Mike R.', rating: 5, comment: 'Perfect for beginners. Highly recommended!' },
                      ].map((review, index) => (
                        <div key={index} className="border-b border-gray-200 pb-4">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-medium">{review.name.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{review.name}</p>
                              <div className="flex items-center space-x-1">
                                {renderStars(review.rating)}
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-primary mb-2">
                  ${course.price}
                </div>
                <p className="text-gray-600">One-time payment</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Level</span>
                  <span className="font-medium">{course.level}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{Math.floor(totalDuration / 60)}h {totalDuration % 60}m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Lessons</span>
                  <span className="font-medium">{totalLessons}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Certificate</span>
                  <ApperIcon name="Check" className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Lifetime Access</span>
                  <ApperIcon name="Check" className="w-5 h-5 text-green-500" />
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="large"
                  className="w-full"
                  onClick={handleEnrollNow}
                  icon="Play"
                >
                  Enroll Now
                </Button>
                
                <Button
                  variant="outline"
                  size="large"
                  className="w-full"
                  onClick={handleAddToCart}
                  icon="ShoppingCart"
                  disabled={isInCart(course.Id)}
                >
                  {isInCart(course.Id) ? 'In Cart' : 'Add to Cart'}
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 text-center mb-4">
                  30-day money-back guarantee
                </p>
                <div className="flex justify-center space-x-4">
                  <button className="text-gray-400 hover:text-gray-600">
                    <ApperIcon name="Heart" className="w-5 h-5" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <ApperIcon name="Share" className="w-5 h-5" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <ApperIcon name="Flag" className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetail