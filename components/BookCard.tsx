'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Book } from '@/types'
import { Eye, Edit, Trash2, BookOpen } from 'lucide-react'
import { deleteBook } from '@/lib/api'
import { getImageUrl, getThumbUrl } from '@/lib/utils'

interface BookCardProps {
  book: Book
  onBookUpdate: () => void
}

export default function BookCard({ book, onBookUpdate }: BookCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [useOriginalImage, setUseOriginalImage] = useState(false)

  const handleDelete = async () => {
    if (!confirm('确定要删除这本书吗？')) return
    
    try {
      setIsDeleting(true)
      await deleteBook(book.id)
      onBookUpdate()
    } catch (error) {
      console.error('删除失败:', error)
      alert('删除失败，请重试')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="book-card group">
      {/* 封面图片 */}
      <Link href={`/book/${book.id}`} className="block">
        <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-2 sm:mb-4 overflow-hidden cursor-pointer">
          {book.cover_image ? (
            <Image
              src={useOriginalImage ? getImageUrl(book.cover_image) : (getThumbUrl(book.cover_image) || getImageUrl(book.cover_image))}
              alt={book.title}
              width={180}
              height={240}
              quality={50}
              loading="lazy"
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 180px"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setUseOriginalImage(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="h-8 w-8 sm:h-16 sm:w-16 text-gray-400" />
            </div>
          )}
        </div>
      </Link>

      {/* 图书信息 */}
      <div className="space-y-1 sm:space-y-2">
        <Link href={`/book/${book.id}`} className="block">
          <h3 className="font-semibold text-gray-900 line-clamp-2 text-xs sm:text-sm hover:text-primary-600 transition-colors cursor-pointer">
            {book.title}
          </h3>
        </Link>
        
        <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">
          {book.author}
        </p>
        
        {book.category && (
          <span className="inline-block px-1 py-0.5 sm:px-2 sm:py-1 text-xs bg-primary-100 text-primary-800 rounded-full">
            {book.category}
          </span>
        )}
        
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center space-x-1 sm:space-x-2">
            <span
              className={`h-2 w-2 rounded-full ${book.status === '已读' ? 'bg-green-500' : 'bg-red-500'}`}
            />
            <span className={`text-xs sm:text-sm font-medium ${
              book.status === '已读' ? 'text-green-600' : 'text-orange-600'
            }`}>
              {book.status}
            </span>
          </span>
          
          <div className="flex items-center space-x-1 sm:space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Link
              href={`/book/${book.id}/edit`}
              className="p-0.5 sm:p-1 text-gray-400 hover:text-primary-600 transition-colors"
              title="编辑"
            >
              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
            </Link>
            
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-0.5 sm:p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
              title="删除"
            >
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
