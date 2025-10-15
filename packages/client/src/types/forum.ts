export interface Topic {
  id: number
  title: string
  content: string
  author: string
  createdAt: Date
  commentsCount: number
}

export interface Comment {
  id: number
  topicId: number
  author: string
  content: string
  createdAt: Date
  reactions?: ReactionStats
}

export interface ReactionStats {
  [emoji: string]: string[]
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}
