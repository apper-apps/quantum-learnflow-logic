import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import CourseCard from '@/components/molecules/CourseCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { courseService } from '@/services/api/courseService'

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadFeaturedCourses()
  }, [])

  const loadFeaturedCourses = async () => {
    try {
      setLoading(true)
      setError('')
      const courses = await courseService.getAll()
      setFeaturedCourses(courses.slice(0, 6))
    } catch (err) {
      setError('Failed to load featured courses')
      console.error('Error loading featured courses:', err)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { name: 'Web Development', icon: 'Code', color: 'from-blue-500 to-purple-600' },
    { name: 'Data Science', icon: 'BarChart', color: 'from-green-500 to-teal-600' },
    { name: 'Design', icon: 'Palette', color: 'from-pink-500 to-rose-600' },
    { name: 'Business', icon: 'TrendingUp', color: 'from-orange-500 to-red-600' },
    { name: 'Marketing', icon: 'Megaphone', color: 'from-purple-500 to-indigo-600' },
    { name: 'Photography', icon: 'Camera', color: 'from-yellow-500 to-orange-600' },
  ]

  const stats = [
    { label: 'Students', value: '50K+', icon: 'Users' },
    { label: 'Courses', value: '1K+', icon: 'BookOpen' },
    { label: 'Instructors', value: '200+', icon: 'GraduationCap' },
    { label: 'Countries', value: '190+', icon: 'Globe' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-purple-700 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Learn Without
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                  Limits
                </span>
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-gray-200">
                Discover thousands of courses from world-class instructors and advance your career with practical skills.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  as={Link}
                  to="/courses"
                  variant="warning"
                  size="xlarge"
                  icon="Search"
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-semibold shadow-2xl"
                >
                  Explore Courses
                </Button>
                <Button
                  as={Link}
                  to="/teach"
                  variant="secondary"
                  size="xlarge"
                  icon="Users"
                  className="bg-white bg-opacity-20 border-white border-2 text-white hover:bg-white hover:text-gray-900 backdrop-blur-sm"
                >
                  Become Instructor
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative z-10">
                <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <ApperIcon name="Play" className="w-6 h-6 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Currently Learning</h3>
                      <p className="text-gray-300">React Advanced Patterns</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-300">Progress</span>
                      <span className="text-sm font-medium">75%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full w-3/4"></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>12 lessons completed</span>
                    <span>4 lessons remaining</span>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center floating">
                <ApperIcon name="Star" className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center floating" style={{ animationDelay: '1s' }}>
                <ApperIcon name="Award" className="w-6 h-6 text-white" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name={stat.icon} className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Learning Path
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our diverse range of categories and find the perfect course to advance your skills.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  to={`/courses?category=${encodeURIComponent(category.name)}`}
                  className="group block"
                >
                  <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group-hover:border-gray-200">
                    <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <ApperIcon name={category.icon} className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600">
                      Learn from industry experts and build practical skills that matter.
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Courses
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular and highly-rated courses chosen by thousands of learners.
            </p>
          </motion.div>

          {loading && <Loading type="courses" />}
          
          {error && (
            <Error
              title="Failed to load featured courses"
              message={error}
              onRetry={loadFeaturedCourses}
            />
          )}

          {!loading && !error && featuredCourses.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {featuredCourses.map((course, index) => (
                  <motion.div
                    key={course.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <CourseCard course={course} />
                  </motion.div>
                ))}
              </div>

              <div className="text-center">
                <Button
                  as={Link}
                  to="/courses"
                  variant="primary"
                  size="large"
                  icon="ArrowRight"
                  iconPosition="right"
                >
                  View All Courses
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Start Learning?
            </h2>
            <p className="text-xl mb-8 text-gray-200">
              Join millions of learners around the world and unlock your potential with our expert-led courses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                as={Link}
                to="/courses"
                variant="warning"
                size="xlarge"
                icon="BookOpen"
                className="bg-white text-primary hover:bg-gray-100 shadow-xl"
              >
                Browse Courses
              </Button>
              <Button
                as={Link}
                to="/teach"
                variant="secondary"
                size="xlarge"
                icon="Users"
                className="bg-transparent border-white border-2 text-white hover:bg-white hover:text-primary"
              >
                Teach on LearnFlow
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home