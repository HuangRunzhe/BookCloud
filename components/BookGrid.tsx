'use client'

import { Book } from '@/types'
import BookCard from './BookCard'

interface BookGridProps {
  books: Book[]
  onBookUpdate: () => void
}

export default function BookGrid({ books, onBookUpdate }: BookGridProps) {
  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">暂无图书</p>
        <p className="text-gray-400 mt-2">点击右上角"添加图书"开始收藏</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onBookUpdate={onBookUpdate}
        />
      ))}
    </div>
  )
}
