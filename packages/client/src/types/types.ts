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
  author: string
  content: string
  createdAt: Date
}
