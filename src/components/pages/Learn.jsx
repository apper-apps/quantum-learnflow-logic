import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import VideoPlayer from '@/components/molecules/VideoPlayer'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { courseService } from '@/services/api/courseService'
import { enrollmentService } from '@/services/api/enrollmentService'

const Learn = () => {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [enrollment, setEnrollment] = useState(null)
  const [currentLesson, setCurrentLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [videoProgress, setVideoProgress] = useState(0)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    loadCourseData()
  }, [courseId, lessonId])

  const loadCourseData = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Load course data
      const courseData = await courseService.getById(parseInt(courseId))
      setCourse(courseData)
      
      // Load enrollment data
      const enrollmentData = await enrollmentService.getEnrollment(parseInt(courseId))
      setEnrollment(enrollmentData)
      
      // Set current lesson
      if (lessonId) {
        const lesson = findLessonById(courseData, lessonId)
        setCurrentLesson(lesson)
      } else {
        // Default to first lesson
        const firstLesson = courseData.sections?.[0]?.lessons?.[0]
        if (firstLesson) {
          setCurrentLesson(firstLesson)
          navigate(`/learn/${courseId}/lesson/${firstLesson.id}`, { replace: true })
        }
      }
      
    } catch (err) {
      setError('Failed to load course data')
      console.error('Error loading course:', err)
    } finally {
      setLoading(false)
    }
  }

  const findLessonById = (courseData, lessonId) => {
    for (const section of courseData.sections || []) {
      for (const lesson of section.lessons || []) {
        if (lesson.id === lessonId) {
          return lesson
        }
      }
    }
    return null
  }

  const handleLessonSelect = (lesson) => {
    setCurrentLesson(lesson)
    navigate(`/learn/${courseId}/lesson/${lesson.id}`)
  }

  const handleVideoProgress = (progress) => {
    setVideoProgress(progress)
    // Update enrollment progress
    if (enrollment && currentLesson) {
      enrollmentService.updateProgress(enrollment.Id, currentLesson.id, progress)
    }
  }

  const handleLessonComplete = () => {
    if (currentLesson && enrollment) {
      enrollmentService.markLessonComplete(enrollment.Id, currentLesson.id)
      toast.success('Lesson completed!')
      
      // Move to next lesson
      const nextLesson = getNextLesson()
      if (nextLesson) {
        handleLessonSelect(nextLesson)
      } else {
        toast.success('🎉 Congratulations! You\'ve completed the course!')
      }
    }
  }

  const getNextLesson = () => {
    if (!course || !currentLesson) return null
    
    let foundCurrent = false
    for (const section of course.sections || []) {
      for (const lesson of section.lessons || []) {
        if (foundCurrent) {
          return lesson
        }
        if (lesson.id === currentLesson.id) {
          foundCurrent = true
        }
      }
    }
    return null
  }

  const getPreviousLesson = () => {
    if (!course || !currentLesson) return null
    
    let previousLesson = null
    for (const section of course.sections || []) {
      for (const lesson of section.lessons || []) {
        if (lesson.id === currentLesson.id) {
          return previousLesson
        }
        previousLesson = lesson
      }
    }
    return null
  }

  const isLessonCompleted = (lessonId) => {
    return enrollment?.completedLessons?.includes(lessonId) || false
  }

  const getSectionProgress = (section) => {
    if (!enrollment) return 0
    const completedLessons = section.lessons.filter(lesson => 
      isLessonCompleted(lesson.id)
    ).length
    return (completedLessons / section.lessons.length) * 100
  }

  const getOverallProgress = () => {
    if (!course || !enrollment) return 0
    const totalLessons = course.sections?.reduce((total, section) => 
      total + section.lessons.length, 0
    ) || 0
    const completedLessons = enrollment.completedLessons?.length || 0
    return (completedLessons / totalLessons) * 100
  }

  if (loading) return <Loading type="page" />
  if (error) return <Error title="Course not found" message={error} />
  if (!course || !currentLesson) return <Error title="Course not found" message="Unable to load course content" />

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <motion.div
        className={`${sidebarOpen ? 'w-80' : 'w-0'} lg:w-80 bg-white shadow-xl flex-shrink-0 overflow-hidden transition-all duration-300`}
        initial={{ x: -320 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 truncate">
                {course.title}
              </h2>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Overall Progress</span>
                <span className="text-sm font-medium text-primary">{Math.round(getOverallProgress())}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getOverallProgress()}%` }}
                />
              </div>
            </div>
          </div>

          {/* Course Content */}
          <div className="flex-1 overflow-y-auto">
            {course.sections?.map((section, sectionIndex) => (
              <div key={section.id} className="border-b border-gray-200">
                <div className="p-4 bg-gray-50">
                  <h3 className="font-medium text-gray-900 mb-2">{section.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {section.lessons.length} lessons
                    </span>
                    <span className="text-sm font-medium text-primary">
                      {Math.round(getSectionProgress(section))}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                    <div 
                      className="bg-gradient-to-r from-primary to-secondary h-1 rounded-full transition-all duration-300"
                      style={{ width: `${getSectionProgress(section)}%` }}
                    />
                  </div>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {section.lessons.map((lesson, lessonIndex) => (
                    <button
                      key={lesson.id}
                      onClick={() => handleLessonSelect(lesson)}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                        currentLesson?.id === lesson.id ? 'bg-primary bg-opacity-10 border-r-4 border-primary' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {isLessonCompleted(lesson.id) ? (
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <ApperIcon name="Check" className="w-4 h-4 text-white" />
                            </div>
                          ) : currentLesson?.id === lesson.id ? (
                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                              <ApperIcon name="Play" className="w-3 h-3 text-white" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                              <ApperIcon name="PlayCircle" className="w-4 h-4 text-gray-600" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {lesson.title}
                          </h4>
                          <p className="text-xs text-gray-500">{lesson.duration} min</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Video Player */}
        <div className="bg-black p-4 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="mb-4 p-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors lg:hidden"
              >
                <ApperIcon name="Menu" className="w-5 h-5" />
              </button>
            )}
            
            <VideoPlayer
              src={currentLesson.videoUrl}
              title={currentLesson.title}
              onProgress={handleVideoProgress}
              onEnded={handleLessonComplete}
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white p-4 lg:p-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Lesson Content */}
              <div className="lg:col-span-2">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {currentLesson.title}
                  </h1>
                  <p className="text-gray-600">
                    Learn the fundamentals and advanced concepts in this comprehensive lesson.
                  </p>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mb-8">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const prevLesson = getPreviousLesson()
                      if (prevLesson) handleLessonSelect(prevLesson)
                    }}
                    disabled={!getPreviousLesson()}
                    icon="ChevronLeft"
                  >
                    Previous
                  </Button>
                  
                  <Button
                    variant="success"
                    onClick={handleLessonComplete}
                    icon="Check"
                  >
                    Mark Complete
                  </Button>
                  
                  <Button
                    variant="primary"
                    onClick={() => {
                      const nextLesson = getNextLesson()
                      if (nextLesson) handleLessonSelect(nextLesson)
                    }}
                    disabled={!getNextLesson()}
                    icon="ChevronRight"
                    iconPosition="right"
                  >
                    Next
                  </Button>
                </div>

                {/* Lesson Resources */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Lesson Resources</h3>
                  <div className="space-y-3">
                    {currentLesson.resources?.map((resource, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <ApperIcon name="Download" className="w-4 h-4 text-primary" />
                        <a href="#" className="text-primary hover:underline">
                          {resource.title}
                        </a>
                      </div>
                    )) || (
                      <p className="text-gray-600">No additional resources for this lesson.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">My Notes</h3>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Take notes during the lesson..."
                    className="w-full h-40 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <Button
                    variant="outline"
                    size="small"
                    className="mt-3"
                    icon="Save"
                  >
                    Save Notes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Learn