export interface Topic {
  id: string
  title: string
  description: string
  authorLogin: string
  authorAvatar?: string
  createdAt: string
  updatedAt?: string
  commentsCount?: number
}

export interface Comment {
  id: string
  topicId: string
  authorLogin: string
  authorAvatar?: string
  message: string
  createdAt: string
  updatedAt?: string
  replies?: Reply[]
  reactions?: Reaction[]
}

export interface Reply {
  id: string
  commentId: string
  parentReplyId?: string
  authorLogin: string
  authorAvatar?: string
  message: string
  createdAt: string
  updatedAt?: string
  childReplies?: Reply[]
}

export interface Reaction {
  id: string
  commentId: string
  authorLogin: string
  code: string
  createdAt: string
}

export interface ApiResponse<T> {
  data: T | null
  success: boolean
  message?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginationInfo {
  page: number
  limit: number
  pageCount: number
  total: number
}

export interface PaginatedResponse<T> {
  data: T
  pagination: PaginationInfo
}

export interface AuthorInfo {
  authorLogin: string
  authorAvatar?: string
}

export interface Timestamps {
  createdAt: string
  updatedAt?: string
}

export interface EntityWithId {
  id: string
}

export interface Topic extends EntityWithId, AuthorInfo, Timestamps {
  title: string
  description: string
  commentsCount?: number
}

export interface Comment extends EntityWithId, AuthorInfo, Timestamps {
  topicId: string
  message: string
  replies?: Reply[]
  reactions?: Reaction[]
}

export interface Reply extends EntityWithId, AuthorInfo, Timestamps {
  commentId: string
  parentReplyId?: string
  message: string
  childReplies?: Reply[]
}

export type CreateTopicRequest = Pick<Topic, 'title' | 'description'>
export type CreateCommentRequest = Pick<Comment, 'topicId' | 'message'>
export type CreateReplyRequest = Pick<Reply, 'commentId' | 'message'> & {
  parentReplyId?: string
}
export type CreateReactionRequest = Pick<Reaction, 'commentId' | 'code'>
