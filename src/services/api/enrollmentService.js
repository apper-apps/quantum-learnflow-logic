// Mock enrollment data
const mockEnrollments = [
  {
    Id: 1,
    userId: 1,
    courseId: 1,
    course: {
      Id: 1,
      title: "Complete React Development Course",
      description: "Master React from basics to advanced concepts",
      category: "Web Development",
      level: "Intermediate",
      price: 89.99,
      rating: 4.8,
      enrolled: 15420,
      duration: 840,
      instructor: {
        name: "Sarah Johnson",
        title: "Senior React Developer"
      }
    },
    enrolledDate: "2024-01-01",
    lastAccessed: "2024-01-20",
    progress: 75,
    completedLessons: ["1", "2", "3", "4", "5"],
    currentLesson: "6",
    certificateEarned: false,
    timeSpent: 420 // minutes
  },
  {
    Id: 2,
    userId: 1,
    courseId: 2,
    course: {
      Id: 2,
      title: "Python for Data Science",
      description: "Learn Python programming for data analysis",
      category: "Data Science",
      level: "Beginner",
      price: 79.99,
      rating: 4.6,
      enrolled: 12350,
      duration: 720,
      instructor: {
        name: "Dr. Michael Chen",
        title: "Data Science Professor"
      }
    },
    enrolledDate: "2024-01-15",
    lastAccessed: "2024-01-18",
    progress: 30,
    completedLessons: ["7", "8"],
    currentLesson: "9",
    certificateEarned: false,
    timeSpent: 180
  },
  {
    Id: 3,
    userId: 1,
    courseId: 3,
    course: {
      Id: 3,
      title: "UI/UX Design Masterclass",
      description: "Complete guide to user interface design",
      category: "Design",
      level: "Intermediate",
      price: 94.99,
      rating: 4.9,
      enrolled: 8970,
      duration: 960,
      instructor: {
        name: "Emily Rodriguez",
        title: "Senior UX Designer"
      }
    },
    enrolledDate: "2023-12-20",
    lastAccessed: "2024-01-22",
    progress: 100,
    completedLessons: ["9", "10", "11", "12", "13", "14", "15", "16"],
    currentLesson: null,
    certificateEarned: true,
    timeSpent: 960
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate random failures occasionally
const shouldFail = () => Math.random() < 0.05; // 5% failure rate

export const enrollmentService = {
  // Get user's enrollments
  async getMyEnrollments(userId = 1) {
    await delay(400);
    
    if (shouldFail()) {
      throw new Error('Failed to fetch enrollments');
    }
    
    return mockEnrollments.filter(enrollment => enrollment.userId === userId);
  },

  // Get specific enrollment
  async getEnrollment(courseId, userId = 1) {
    await delay(200);
    
    if (shouldFail()) {
      throw new Error('Failed to fetch enrollment details');
    }
    
    const enrollment = mockEnrollments.find(e => 
      e.courseId === courseId && e.userId === userId
    );
    
    if (!enrollment) {
      throw new Error('Enrollment not found');
    }
    
    return { ...enrollment };
  },

  // Enroll in a course
  async enrollInCourse(courseId, userId = 1) {
    await delay(300);
    
    if (shouldFail()) {
      throw new Error('Failed to enroll in course');
    }
    
    // Check if already enrolled
    const existingEnrollment = mockEnrollments.find(e => 
      e.courseId === courseId && e.userId === userId
    );
    
    if (existingEnrollment) {
      throw new Error('Already enrolled in this course');
    }
    
    // Create new enrollment
    const newEnrollment = {
      Id: mockEnrollments.length + 1,
      userId,
      courseId,
      enrolledDate: new Date().toISOString().split('T')[0],
      lastAccessed: new Date().toISOString().split('T')[0],
      progress: 0,
      completedLessons: [],
      currentLesson: null,
      certificateEarned: false,
      timeSpent: 0
    };
    
    mockEnrollments.push(newEnrollment);
    return newEnrollment;
  },

  // Update lesson progress
  async updateProgress(enrollmentId, lessonId, progress) {
    await delay(150);
    
    if (shouldFail()) {
      throw new Error('Failed to update progress');
    }
    
    const enrollment = mockEnrollments.find(e => e.Id === enrollmentId);
    if (!enrollment) {
      throw new Error('Enrollment not found');
    }
    
    // Update last accessed
    enrollment.lastAccessed = new Date().toISOString().split('T')[0];
    
    // Update current lesson
    enrollment.currentLesson = lessonId;
    
    // Simulate progress calculation
    enrollment.progress = Math.min(100, enrollment.progress + 5);
    
    return enrollment;
  },

  // Mark lesson as complete
  async markLessonComplete(enrollmentId, lessonId) {
    await delay(100);
    
    if (shouldFail()) {
      throw new Error('Failed to mark lesson complete');
    }
    
    const enrollment = mockEnrollments.find(e => e.Id === enrollmentId);
    if (!enrollment) {
      throw new Error('Enrollment not found');
    }
    
    // Add lesson to completed if not already there
    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }
    
    // Update progress and last accessed
    enrollment.lastAccessed = new Date().toISOString().split('T')[0];
    enrollment.timeSpent += 15; // Add 15 minutes
    
    // Calculate progress based on completed lessons
    const totalLessons = 8; // Mock total lessons per course
    enrollment.progress = Math.floor((enrollment.completedLessons.length / totalLessons) * 100);
    
    // Check if course is complete
    if (enrollment.progress >= 100) {
      enrollment.certificateEarned = true;
    }
    
    return enrollment;
  },

  // Get enrollment statistics
  async getStatistics(userId = 1) {
    await delay(200);
    
    if (shouldFail()) {
      throw new Error('Failed to fetch enrollment statistics');
    }
    
    const userEnrollments = mockEnrollments.filter(e => e.userId === userId);
    
    return {
      totalEnrollments: userEnrollments.length,
      completedCourses: userEnrollments.filter(e => e.progress === 100).length,
      inProgressCourses: userEnrollments.filter(e => e.progress > 0 && e.progress < 100).length,
      totalTimeSpent: userEnrollments.reduce((total, e) => total + e.timeSpent, 0),
      averageProgress: userEnrollments.reduce((total, e) => total + e.progress, 0) / userEnrollments.length || 0,
      certificatesEarned: userEnrollments.filter(e => e.certificateEarned).length
    };
  },

  // Get learning streak
  async getLearningStreak(userId = 1) {
    await delay(100);
    
    if (shouldFail()) {
      throw new Error('Failed to fetch learning streak');
    }
    
    // Mock streak calculation
    return {
      currentStreak: Math.floor(Math.random() * 30) + 1,
      longestStreak: Math.floor(Math.random() * 60) + 15,
      lastActivity: new Date().toISOString().split('T')[0]
    };
  },

  // Unenroll from course
  async unenroll(enrollmentId) {
    await delay(200);
    
    if (shouldFail()) {
      throw new Error('Failed to unenroll from course');
    }
    
    const index = mockEnrollments.findIndex(e => e.Id === enrollmentId);
    if (index === -1) {
      throw new Error('Enrollment not found');
    }
    
    mockEnrollments.splice(index, 1);
    return { success: true };
  },

  // Reset course progress
  async resetProgress(enrollmentId) {
    await delay(150);
    
    if (shouldFail()) {
      throw new Error('Failed to reset progress');
    }
    
    const enrollment = mockEnrollments.find(e => e.Id === enrollmentId);
    if (!enrollment) {
      throw new Error('Enrollment not found');
    }
    
    enrollment.progress = 0;
    enrollment.completedLessons = [];
    enrollment.currentLesson = null;
    enrollment.certificateEarned = false;
    enrollment.timeSpent = 0;
    enrollment.lastAccessed = new Date().toISOString().split('T')[0];
    
    return enrollment;
  }
};

export default enrollmentService;