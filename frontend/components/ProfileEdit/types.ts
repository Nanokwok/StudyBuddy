// User types
export interface UserData {
  id: string
  firstName: string
  lastName: string
  bio: string
  social: {
    instagram: string
    facebook: string
  }
  courses: UserCourse[]
  email: string
  username: string
  profilePictureUrl: string
  friendships: {
    count: number
  }
}

export interface UserCourse {
  code: string
  title: string
}

// Friendship types
export interface FriendshipData {
  id: string
  name: string
  bio?: string
  profilePictureUrl?: string
  tags: string[]
}

// Course types
export interface CourseData {
  courseId: string
  code: string
  title: string
  subject: string
  description: string
  studySchedulesDay: string
  studySchedulesTime: string
}