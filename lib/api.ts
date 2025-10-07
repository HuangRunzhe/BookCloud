import axios from 'axios'
import { Book, BookCreate, BookUpdate, Stats, ChatRequest, ChatResponse, ReadingSession, ReadingStats } from '@/types'

// 动态检测API地址
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // 客户端环境
    const hostname = window.location.hostname
    const protocol = window.location.protocol
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8000'
    } else if (hostname === 'bc.aikits.sbs') {
      return 'https://bcbk.aikits.sbs'
    } else if (hostname === 'bcbk.aikits.sbs') {
      return 'https://bcbk.aikits.sbs'
    } else {
      return `${protocol}//${hostname}:8000`
    }
  }
  // 服务端环境
  return process.env.NEXT_PUBLIC_API_URL || 'https://bcbk.aikits.sbs'
}

const API_BASE_URL = getApiBaseUrl()

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器，添加认证头
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器，处理401错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token过期或无效，清除本地存储并重定向到登录页
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// 图书管理API
export const getBooks = async (params?: {
  keyword?: string
  category?: string
  status?: string
  page?: number
  page_size?: number
}): Promise<Book[]> => {
  const response = await api.get('/books/', { params })
  return response.data
}

export const getBooksCount = async (params?: {
  keyword?: string
  category?: string
  status?: string
}): Promise<{ total: number }> => {
  const response = await api.get('/books/count/', { params })
  return response.data
}

export const getBook = async (id: number): Promise<Book> => {
  const response = await api.get(`/books/${id}`)
  return response.data
}

export const createBook = async (book: BookCreate): Promise<Book> => {
  const response = await api.post('/books/', book)
  return response.data
}

export const updateBook = async (id: number, book: BookUpdate): Promise<Book> => {
  const response = await api.put(`/books/${id}`, book)
  return response.data
}

export const deleteBook = async (id: number): Promise<void> => {
  await api.delete(`/books/${id}`)
}

// 文件上传API
export const uploadCover = async (file: File): Promise<{ filename: string; path: string }> => {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await api.post('/upload-cover', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

// 统计API
export const getStats = async (): Promise<Stats> => {
  const response = await api.get('/stats/')
  return response.data
}

// AI对话API
export const chat = async (request: ChatRequest): Promise<ChatResponse> => {
  // 避免 FastAPI 对结尾斜杠的 307 重定向，直接使用无斜杠路径
  const response = await api.post('/chat', request)
  return response.data
}

// 阅读计时 API
export const startReading = async (bookId: number, note?: string): Promise<ReadingSession> => {
  const response = await api.post('/reading/start', { book_id: bookId, note })
  return response.data
}

export const stopReading = async (sessionId: number, note?: string): Promise<ReadingSession> => {
  const response = await api.post('/reading/stop', { session_id: sessionId, note })
  return response.data
}

export const getReadingStats = async (bookId: number): Promise<ReadingStats> => {
  const response = await api.get(`/reading/stats/${bookId}`)
  return response.data
}

export const addReadingManual = async (bookId: number, seconds: number, date?: string): Promise<ReadingSession> => {
  const response = await api.post('/reading/manual', { book_id: bookId, seconds, reading_date: date })
  return response.data
}


// 批量创建图书API
export const createBooksBatch = async (books: BookCreate[]): Promise<Book[]> => {
  const response = await api.post('/books/batch/', books)
  return response.data
}

// 下载封面API
export const downloadCover = async (coverUrl: string): Promise<{ filename: string; path: string }> => {
  const response = await api.post('/download-cover', null, {
    params: { cover_url: coverUrl }
  })
  return response.data
}

// 用户个人资料API
export const updateUserProfile = async (profileData: any): Promise<any> => {
  const response = await api.put('/auth/profile', profileData)
  return response.data
}

export const getUserProfile = async (userId: number): Promise<any> => {
  const response = await api.get(`/auth/profile/${userId}`)
  return response.data
}

// 排行榜API
export const getLeaderboard = async (): Promise<any[]> => {
  const response = await api.get('/leaderboard/')
  return response.data
}

// 用户图书API
export const getUserBooks = async (userId: number, page: number = 1, pageSize: number = 20): Promise<Book[]> => {
  const response = await api.get(`/users/${userId}/books/`, {
    params: { page, page_size: pageSize }
  })
  return response.data
}

export const getUserBooksCount = async (userId: number): Promise<{ total: number }> => {
  const response = await api.get(`/users/${userId}/books/count/`)
  return response.data
}

// 支付相关API
export const createPayment = async (paymentData: { payment_type: string; payment_method: string }): Promise<any> => {
  const response = await api.post('/payments/', paymentData)
  return response.data
}

export const getUserPayments = async (): Promise<any[]> => {
  const response = await api.get('/payments/')
  return response.data
}

// 管理员API
export const getAllUsers = async (page: number = 1, pageSize: number = 20): Promise<any[]> => {
  const response = await api.get('/admin/users/', {
    params: { page, page_size: pageSize }
  })
  return response.data
}

export const updateUserPermissions = async (userId: number, permissions: any): Promise<any> => {
  const response = await api.put(`/admin/users/${userId}/permissions`, permissions)
  return response.data
}

export const getAllPayments = async (page: number = 1, pageSize: number = 20): Promise<any[]> => {
  const response = await api.get('/admin/payments/', {
    params: { page, page_size: pageSize }
  })
  return response.data
}

export const updatePaymentStatus = async (paymentId: number, status: string, transactionId?: string): Promise<any> => {
  const response = await api.put(`/admin/payments/${paymentId}/status`, null, {
    params: { status, transaction_id: transactionId }
  })
  return response.data
}
