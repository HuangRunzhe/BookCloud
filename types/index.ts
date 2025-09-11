export interface Book {
  id: number
  title: string
  author: string
  isbn?: string
  published_date?: string
  cover_image?: string
  description?: string
  category?: string
  review?: string
  status: '已读' | '未读'
  created_at: string
  updated_at?: string
}

export interface BookCreate {
  title: string
  author: string
  isbn?: string
  published_date?: string
  cover_image?: string
  description?: string
  category?: string
  review?: string
  status: '已读' | '未读'
}

export interface BookUpdate {
  title?: string
  author?: string
  isbn?: string
  published_date?: string
  cover_image?: string
  description?: string
  category?: string
  review?: string
  status?: '已读' | '未读'
}

export interface Stats {
  total_books: number
  read_books: number
  unread_books: number
  category_stats: Record<string, number>
  author_stats: Record<string, number>
  year_stats: Record<string, number>
  recent_books: number
  reading_progress: number
}

export interface ChatRequest {
  question: string
}

export interface ChatResponse {
  answer: string
  recommended_books?: Book[]
}
