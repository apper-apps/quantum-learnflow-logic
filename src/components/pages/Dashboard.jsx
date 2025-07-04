import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import CourseCard from '@/components/molecules/CourseCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { enrollmentService } from '@/services/api/enrollmentService'

const Dashboard = () => {
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    loadEnrollments()
  }, [])

  const loadEnrollments = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await enrollmentService.getMyEnrollments()
      setEnrollments(data)
    } catch (err) {
      setError('Failed to load your courses')
      console.error('Error loading enrollments:', err)
    } finally {
      setLoading(false)
    }
  }

  const getFilteredEnrollments = () => {
    switch (activeTab) {
      case 'in-progress':
        return enrollments.filter(e => e.progress > 0 && e.progress < 100)
      case 'completed':
        return enrollments.filter(e => e.progress === 100)
      case 'not-started':
        return enrollments.filter(e => e.progress === 0)
      default:
        return enrollments
    }
  }

  const getTotalHours = () => {
    return enrollments.reduce((total, enrollment) => {
      return total + (enrollment.course?.duration || 0)
    }, 0)
  }

  const getCompletedCourses = () => {
    return enrollments.filter(e => e.progress === 100).length
  }

  const getAverageProgress = () => {
    if (enrollments.length === 0) return 0
    const totalProgress = enrollments.reduce((sum, e) => sum + e.progress, 0)
    return Math.round(totalProgress / enrollments.length)
  }

  const stats = [
    {
      label: 'Enrolled Courses',
      value: enrollments.length,
      icon: 'BookOpen',
      color: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Completed Courses',
      value: getCompletedCourses(),
      icon: 'Award',
      color: 'from-green-500 to-green-600'
    },
    {
      label: 'Learning Hours',
      value: Math.round(getTotalHours() / 60),
      icon: 'Clock',
      color: 'from-purple-500 to-purple-600'
    },
    {
      label: 'Average Progress',
      value: `${getAverageProgress()}%`,
      icon: 'TrendingUp',
      color: 'from-orange-500 to-orange-600'
    }
  ]

  const tabs = [
    { id: 'all', label: 'All Courses', count: enrollments.length },
    { id: 'in-progress', label: 'In Progress', count: enrollments.filter(e => e.progress > 0 && e.progress < 100).length },
    { id: 'completed', label: 'Completed', count: getCompletedCourses() },
    { id: 'not-started', label: 'Not Started', count: enrollments.filter(e => e.progress === 0).length }
  ]

  const filteredEnrollments = getFilteredEnrollments()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Learning Dashboard</h1>
          <p className="text-gray-600">Track your progress and continue your learning journey</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="text-center">
                <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <ApperIcon name={stat.icon} className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Continue Learning</h3>
              <p className="text-gray-600">Pick up where you left off or explore new courses</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                as={Link}
                to="/courses"
                variant="primary"
                icon="Search"
              >
                Browse Courses
              </Button>
              <Button
                as={Link}
                to="/teach"
                variant="outline"
                icon="Users"
              >
                Become Instructor
              </Button>
            </div>
          </div>
        </Card>

        {/* Course Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                      activeTab === tab.id 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Course List */}
        {loading && <Loading type="courses" />}
        
        {error && (
          <Error
            title="Failed to load your courses"
            message={error}
            onRetry={loadEnrollments}
          />
        )}

        {!loading && !error && filteredEnrollments.length === 0 && (
          <Empty
            title="No courses found"
            message={
              activeTab === 'all' 
                ? "You haven't enrolled in any courses yet. Start your learning journey by exploring our course catalog."
                : `No courses match the ${activeTab.replace('-', ' ')} filter.`
            }
            icon="BookOpen"
            actionLabel="Browse Courses"
            onAction={() => window.location.href = '/courses'}
          />
        )}

        {!loading && !error && filteredEnrollments.length > 0 && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {filteredEnrollments.map((enrollment, index) => (
              <motion.div
                key={enrollment.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="relative">
                  <CourseCard 
                    course={{
                      ...enrollment.course,
                      progress: enrollment.progress
                    }}
                    showProgress={true}
                  />
                  
                  {/* Continue Learning Button */}
                  <div className="absolute top-4 right-4">
                    <Button
                      as={Link}
                      to={`/learn/${enrollment.course.Id}`}
                      variant="primary"
                      size="small"
                      icon="Play"
                      className="opacity-90 hover:opacity-100"
                    >
                      {enrollment.progress > 0 ? 'Continue' : 'Start'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Recent Activity */}
        {!loading && !error && enrollments.length > 0 && (
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <Button variant="ghost" size="small" icon="ExternalLink">
                  View All
                </Button>
              </div>
              
              <div className="space-y-4">
                {enrollments.slice(0, 3).map((enrollment) => (
                  <div key={enrollment.Id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                      <ApperIcon name="BookOpen" className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{enrollment.course.title}</h4>
                      <p className="text-sm text-gray-500">
                        Last accessed: {enrollment.lastAccessed ? new Date(enrollment.lastAccessed).toLocaleDateString() : 'Never'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-primary">{enrollment.progress}%</div>
                      <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                          style={{ width: `${enrollment.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Dashboard