// Mock course data
const mockCourses = [
  {
    Id: 1,
    title: "Complete React Development Course",
    description: "Master React from basics to advanced concepts with hands-on projects and real-world applications.",
    category: "Web Development",
    level: "Intermediate",
    price: 89.99,
    rating: 4.8,
    enrolled: 15420,
    duration: 840, // minutes
    instructor: {
      name: "Sarah Johnson",
      title: "Senior React Developer",
      id: 1
    },
    sections: [
      {
        id: 1,
        title: "React Fundamentals",
        duration: 180,
        lessons: [
          { id: 1, title: "Introduction to React", duration: 15, videoUrl: "/videos/react-intro.mp4", preview: true },
          { id: 2, title: "Components and JSX", duration: 25, videoUrl: "/videos/components.mp4" },
          { id: 3, title: "Props and State", duration: 30, videoUrl: "/videos/props-state.mp4" }
        ]
      },
      {
        id: 2,
        title: "Advanced React Patterns",
        duration: 220,
        lessons: [
          { id: 4, title: "Hooks Deep Dive", duration: 35, videoUrl: "/videos/hooks.mp4" },
          { id: 5, title: "Context API", duration: 40, videoUrl: "/videos/context.mp4" },
          { id: 6, title: "Performance Optimization", duration: 45, videoUrl: "/videos/performance.mp4" }
        ]
      }
    ]
  },
  {
    Id: 2,
    title: "Python for Data Science",
    description: "Learn Python programming with focus on data analysis, visualization, and machine learning fundamentals.",
    category: "Data Science",
    level: "Beginner",
    price: 79.99,
    rating: 4.6,
    enrolled: 12350,
    duration: 720,
    instructor: {
      name: "Dr. Michael Chen",
      title: "Data Science Professor",
      id: 2
    },
    sections: [
      {
        id: 3,
        title: "Python Basics",
        duration: 200,
        lessons: [
          { id: 7, title: "Python Syntax", duration: 20, videoUrl: "/videos/python-basics.mp4", preview: true },
          { id: 8, title: "Data Types", duration: 25, videoUrl: "/videos/data-types.mp4" }
        ]
      }
    ]
  },
  {
    Id: 3,
    title: "UI/UX Design Masterclass",
    description: "Complete guide to user interface and user experience design with practical projects and industry insights.",
    category: "Design",
    level: "Intermediate",
    price: 94.99,
    rating: 4.9,
    enrolled: 8970,
    duration: 960,
    instructor: {
      name: "Emily Rodriguez",
      title: "Senior UX Designer",
      id: 3
    },
    sections: [
      {
        id: 4,
        title: "Design Principles",
        duration: 180,
        lessons: [
          { id: 9, title: "Typography Fundamentals", duration: 30, videoUrl: "/videos/typography.mp4", preview: true },
          { id: 10, title: "Color Theory", duration: 25, videoUrl: "/videos/color-theory.mp4" }
        ]
      }
    ]
  },
  {
    Id: 4,
    title: "Digital Marketing Strategy",
    description: "Comprehensive digital marketing course covering SEO, social media, email marketing, and analytics.",
    category: "Marketing",
    level: "Beginner",
    price: 69.99,
    rating: 4.5,
    enrolled: 11200,
    duration: 600,
    instructor: {
      name: "James Wilson",
      title: "Marketing Director",
      id: 4
    },
    sections: [
      {
        id: 5,
        title: "Marketing Fundamentals",
        duration: 150,
        lessons: [
          { id: 11, title: "Digital Marketing Overview", duration: 20, videoUrl: "/videos/marketing-intro.mp4", preview: true },
          { id: 12, title: "Target Audience Analysis", duration: 30, videoUrl: "/videos/audience.mp4" }
        ]
      }
    ]
  },
  {
    Id: 5,
    title: "Business Analytics with Excel",
    description: "Master business data analysis using Excel with advanced formulas, pivot tables, and visualization techniques.",
    category: "Business",
    level: "Intermediate",
    price: 59.99,
    rating: 4.4,
    enrolled: 9850,
    duration: 480,
    instructor: {
      name: "Lisa Thompson",
      title: "Business Analyst",
      id: 5
    },
    sections: [
      {
        id: 6,
        title: "Excel Fundamentals",
        duration: 120,
        lessons: [
          { id: 13, title: "Excel Interface", duration: 15, videoUrl: "/videos/excel-basics.mp4", preview: true },
          { id: 14, title: "Formulas and Functions", duration: 35, videoUrl: "/videos/formulas.mp4" }
        ]
      }
    ]
  },
  {
    Id: 6,
    title: "Professional Photography",
    description: "Learn professional photography techniques, composition, lighting, and post-processing with expert guidance.",
    category: "Photography",
    level: "Advanced",
    price: 129.99,
    rating: 4.7,
    enrolled: 6720,
    duration: 1080,
    instructor: {
      name: "Alexander Kim",
      title: "Professional Photographer",
      id: 6
    },
    sections: [
      {
        id: 7,
        title: "Camera Fundamentals",
        duration: 200,
        lessons: [
          { id: 15, title: "Camera Settings", duration: 25, videoUrl: "/videos/camera-settings.mp4", preview: true },
          { id: 16, title: "Composition Rules", duration: 30, videoUrl: "/videos/composition.mp4" }
        ]
      }
    ]
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate random failures occasionally
const shouldFail = () => Math.random() < 0.05; // 5% failure rate

export const courseService = {
  // Get all courses
  async getAll() {
    await delay(300);
    
    if (shouldFail()) {
      throw new Error('Failed to fetch courses');
    }
    
    return [...mockCourses];
  },

  // Get course by ID
  async getById(id) {
    await delay(200);
    
    if (shouldFail()) {
      throw new Error('Failed to fetch course details');
    }
    
    const course = mockCourses.find(c => c.Id === id);
    if (!course) {
      throw new Error('Course not found');
    }
    
    return { ...course };
  },

  // Search courses
  async searchCourses(query) {
    await delay(150);
    
    if (shouldFail()) {
      throw new Error('Search failed');
    }
    
    if (!query || query.length < 2) {
      return [];
    }
    
    const searchTerm = query.toLowerCase();
    return mockCourses.filter(course => 
      course.title.toLowerCase().includes(searchTerm) ||
      course.description.toLowerCase().includes(searchTerm) ||
      course.category.toLowerCase().includes(searchTerm) ||
      course.instructor.name.toLowerCase().includes(searchTerm)
    );
  },

  // Get courses by category
  async getByCategory(category) {
    await delay(250);
    
    if (shouldFail()) {
      throw new Error('Failed to fetch courses by category');
    }
    
    return mockCourses.filter(course => 
      course.category.toLowerCase() === category.toLowerCase()
    );
  },

  // Get featured courses
  async getFeatured(limit = 6) {
    await delay(200);
    
    if (shouldFail()) {
      throw new Error('Failed to fetch featured courses');
    }
    
    return mockCourses
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  },

  // Get popular courses
  async getPopular(limit = 6) {
    await delay(200);
    
    if (shouldFail()) {
      throw new Error('Failed to fetch popular courses');
    }
    
    return mockCourses
      .sort((a, b) => b.enrolled - a.enrolled)
      .slice(0, limit);
  },

  // Get course recommendations
  async getRecommendations(courseId, limit = 4) {
    await delay(180);
    
    if (shouldFail()) {
      throw new Error('Failed to fetch recommendations');
    }
    
    const currentCourse = mockCourses.find(c => c.Id === courseId);
    if (!currentCourse) {
      return mockCourses.slice(0, limit);
    }
    
    // Simple recommendation: same category or similar rating
    return mockCourses
      .filter(c => c.Id !== courseId)
      .filter(c => 
        c.category === currentCourse.category || 
        Math.abs(c.rating - currentCourse.rating) < 0.5
      )
      .slice(0, limit);
  },

  // Get course reviews
  async getReviews(courseId) {
    await delay(150);
    
    if (shouldFail()) {
      throw new Error('Failed to fetch reviews');
    }
    
    // Mock reviews
    return [
      {
        id: 1,
        userId: 1,
        userName: "John Doe",
        userAvatar: null,
        rating: 5,
        comment: "Excellent course! Very comprehensive and well-structured.",
        date: "2024-01-15",
        helpful: 24
      },
      {
        id: 2,
        userId: 2,
        userName: "Jane Smith",
        userAvatar: null,
        rating: 4,
        comment: "Great content, but could use more practical examples.",
        date: "2024-01-10",
        helpful: 12
      },
      {
        id: 3,
        userId: 3,
        userName: "Mike Johnson",
        userAvatar: null,
        rating: 5,
        comment: "Perfect for beginners. Highly recommended!",
        date: "2024-01-08",
        helpful: 18
      }
    ];
  },

  // Get course statistics
  async getStatistics(courseId) {
    await delay(100);
    
    if (shouldFail()) {
      throw new Error('Failed to fetch course statistics');
    }
    
    return {
      totalStudents: Math.floor(Math.random() * 20000) + 5000,
      completionRate: Math.floor(Math.random() * 30) + 70,
      averageRating: (Math.random() * 1.5 + 3.5).toFixed(1),
      totalReviews: Math.floor(Math.random() * 500) + 100,
      lastUpdated: "2024-01-01"
    };
  }
};

export default courseService;