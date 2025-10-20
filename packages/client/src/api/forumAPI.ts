import api from './API'
import {
  ApiResponse,
  Reaction,
  Topic,
  Comment,
  Reply,
  PaginationParams,
  PaginatedResponse,
  CreateTopicRequest,
  CreateCommentRequest,
  CreateReplyRequest,
} from '../types/forum'

interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
}

const isApiError = (error: unknown): error is ApiError => {
  return typeof error === 'object' && error !== null && 'response' in error
}

const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (isApiError(error)) {
    return error.response?.data?.message || defaultMessage
  }

  if (error instanceof Error) {
    return error.message
  }

  return defaultMessage
}

const handleApiError = <T>(
  error: unknown,
  defaultMessage: string
): ApiResponse<T> => ({
  data: null,
  success: false,
  message: getErrorMessage(error, defaultMessage),
})

const handlePaginatedResponse = <T>(response: {
  data: { data: T; pagination: any }
}): ApiResponse<PaginatedResponse<T>> => ({
  data: {
    data: response.data.data,
    pagination: response.data.pagination,
  },
  success: true,
})

const handleSimpleResponse = <T>(response: { data: T }): ApiResponse<T> => ({
  data: response.data,
  success: true,
})

const emptyPagination = {
  page: 1,
  limit: 10,
  pageCount: 0,
  total: 0,
}

export const forumAPI = {
  async getTopics(
    params?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<Topic[]>>> {
    try {
      const response = await api.get('/forum/topics', { params })
      return handlePaginatedResponse<Topic[]>(response)
    } catch (error: unknown) {
      return {
        data: { data: [], pagination: emptyPagination },
        success: false,
        message: getErrorMessage(error, 'Ошибка загрузки топиков'),
      }
    }
  },

  async getTopic(topicId: string): Promise<ApiResponse<Topic>> {
    try {
      const response = await api.get(`/forum/topics/${topicId}`)
      return handleSimpleResponse<Topic>(response)
    } catch (error: unknown) {
      return handleApiError<Topic>(error, 'Ошибка загрузки топика')
    }
  },

  async createTopic(
    topicData: CreateTopicRequest
  ): Promise<ApiResponse<{ id: string }>> {
    try {
      const response = await api.post('/forum/topics', topicData)
      return handleSimpleResponse<{ id: string }>(response)
    } catch (error: unknown) {
      return handleApiError<{ id: string }>(error, 'Ошибка создания топика')
    }
  },
  async deleteTopic(topicId: string): Promise<ApiResponse<void>> {
    try {
      await api.delete(`/forum/topics/${topicId}`)
      return {
        data: null,
        success: true,
      }
    } catch (error) {
      return handleApiError(error, 'Ошибка удаления топика')
    }
  },

  async updateTopic(
    topicId: string,
    topicData: { title: string; description: string }
  ): Promise<ApiResponse<Topic>> {
    try {
      const response = await api.put(`/forum/topics/${topicId}`, topicData)
      return {
        data: response.data,
        success: true,
      }
    } catch (error) {
      return handleApiError(error, 'Ошибка обновления топика')
    }
  },

  async getComments(
    topicId: string,
    params?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<Comment[]>>> {
    try {
      const response = await api.get(`/forum/topics/${topicId}/comments`, {
        params,
      })
      return handlePaginatedResponse<Comment[]>(response)
    } catch (error: unknown) {
      return {
        data: { data: [], pagination: emptyPagination },
        success: false,
        message: getErrorMessage(error, 'Ошибка загрузки комментариев'),
      }
    }
  },

  async createComment(
    commentData: CreateCommentRequest
  ): Promise<ApiResponse<{ id: string }>> {
    try {
      const response = await api.post('/forum/comments', commentData)
      return handleSimpleResponse<{ id: string }>(response)
    } catch (error: unknown) {
      return handleApiError<{ id: string }>(
        error,
        'Ошибка создания комментария'
      )
    }
  },
  async updateComment(
    commentId: string,
    message: string
  ): Promise<ApiResponse<Comment>> {
    try {
      const response = await api.put(`/forum/comments/${commentId}`, {
        message,
      })
      return {
        data: response.data,
        success: true,
      }
    } catch (error) {
      return handleApiError(error, 'Ошибка обновления комментария')
    }
  },

  async deleteComment(commentId: string): Promise<ApiResponse<void>> {
    try {
      await api.delete(`/forum/comments/${commentId}`)
      return {
        data: null,
        success: true,
      }
    } catch (error) {
      return handleApiError(error, 'Ошибка удаления комментария')
    }
  },
  async getCommentReactions(
    commentId: string
  ): Promise<ApiResponse<Reaction[]>> {
    try {
      const response = await api.get(`/forum/comments/${commentId}/reactions`)
      return {
        data: response.data,
        success: true,
      }
    } catch (error: unknown) {
      return handleApiError<Reaction[]>(error, 'Ошибка при загрузке реакций')
    }
  },

  async addReaction(
    commentId: string,
    emoji: string
  ): Promise<ApiResponse<Reaction>> {
    try {
      const response = await api.post('/forum/reactions', {
        commentId,
        code: emoji,
      })
      return {
        data: response.data,
        success: true,
      }
    } catch (error) {
      return handleApiError(error, 'Ошибка при добавлении реакции')
    }
  },

  async deleteReaction(reactionId: string): Promise<ApiResponse<void>> {
    try {
      await api.delete(`/forum/reactions/${reactionId}`)
      return {
        data: null,
        success: true,
      }
    } catch (error) {
      return handleApiError(error, 'Ошибка при удалении реакции')
    }
  },

  async getReplies(
    commentId: string,
    params?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<Reply[]>>> {
    try {
      const response = await api.get(`/forum/comments/${commentId}/replies`, {
        params,
      })
      return handlePaginatedResponse<Reply[]>(response)
    } catch (error: unknown) {
      return {
        data: { data: [], pagination: emptyPagination },
        success: false,
        message: getErrorMessage(error, 'Ошибка загрузки ответов'),
      }
    }
  },

  async createReply(
    replyData: CreateReplyRequest
  ): Promise<ApiResponse<{ id: string }>> {
    try {
      const response = await api.post('/forum/replies', replyData)
      return handleSimpleResponse<{ id: string }>(response)
    } catch (error: unknown) {
      return handleApiError<{ id: string }>(error, 'Ошибка создания ответа')
    }
  },
}
