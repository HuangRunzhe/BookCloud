'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Book } from '@/types'
import { getBook, deleteBook } from '@/lib/api'
import { ArrowLeft, Edit, Trash2, BookOpen, Calendar, Tag, User } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { getImageUrl, getThumbUrl } from '@/lib/utils'

export default function BookDetail() {
  const params = useParams()
  const router = useRouter()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (params.id) {
      loadBook()
    }
  }, [params.id])

  const loadBook = async () => {
    try {
      setLoading(true)
      const bookData = await getBook(Number(params.id))
      console.log('图书详情数据:', bookData)
      if (bookData.cover_image) {
        console.log('封面图片路径:', bookData.cover_image)
        console.log('缩略图URL:', getThumbUrl(bookData.cover_image))
        console.log('原图URL:', getImageUrl(bookData.cover_image))
      }
      setBook(bookData)
    } catch (error) {
      console.error('加载图书详情失败:', error)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!book || !confirm('确定要删除这本书吗？')) return
    
    try {
      setDeleting(true)
      await deleteBook(book.id)
      router.push('/')
    } catch (error) {
      console.error('删除失败:', error)
      alert('删除失败，请重试')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">图书不存在</p>
          <Link href="/" className="btn-primary mt-4">
            返回首页
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 头部 */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>返回首页</span>
            </Link>
            
            <div className="flex items-center space-x-2">
              <Link
                href={`/book/${book.id}/edit`}
                className="btn-secondary flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>编辑</span>
              </Link>
              
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                <span>{deleting ? '删除中...' : '删除'}</span>
              </button>
            </div>
          </div>

          {/* 图书详情 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
              {/* 封面 */}
              <div className="lg:col-span-1">
                <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                  {book.cover_image ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={getThumbUrl(book.cover_image) || getImageUrl(book.cover_image)}
                        alt={book.title}
                        width={600}
                        height={800}
                        quality={90}
                        unoptimized
                        priority
                        sizes="(max-width: 1024px) 80vw, 400px"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('图片加载失败:', e)
                          // 如果缩略图失败，回退到原图
                          const target = e.target as HTMLImageElement
                          const currentSrc = (target as any).src || ''
                          const original = getImageUrl(book.cover_image)
                          if (!currentSrc.includes(original)) {
                            ;(target as any).src = original
                            return
                          }
                          // 原图也失败则降级为原生img（避免Image优化器缓存）
                          const fallbackImg = document.createElement('img')
                          fallbackImg.src = original
                          fallbackImg.alt = book.title
                          fallbackImg.className = 'w-full h-full object-cover'
                          target.parentNode?.replaceChild(fallbackImg, target)
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="h-24 w-24 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* 图书信息 */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {book.title}
                  </h1>
                  
                  <div className="flex items-center space-x-4 text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{book.author}</span>
                    </div>
                    
                    {book.published_date && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(book.published_date).getFullYear()}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-4">
                    {book.category && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                        <Tag className="h-3 w-3 mr-1" />
                        {book.category}
                      </span>
                    )}
                    
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      book.status === '已读' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {book.status}
                    </span>
                  </div>
                </div>

                {/* 详细信息 */}
                <div className="space-y-4">
                  {book.isbn && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-1">ISBN</h3>
                      <p className="text-gray-900">{book.isbn}</p>
                    </div>
                  )}

                  {book.description && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">图书描述</h3>
                      <p className="text-gray-900 leading-relaxed">
                        {book.description}
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">添加时间：</span>
                        <span>{new Date(book.created_at).toLocaleDateString('zh-CN')}</span>
                      </div>
                      {book.updated_at && (
                        <div>
                          <span className="font-medium">更新时间：</span>
                          <span>{new Date(book.updated_at).toLocaleDateString('zh-CN')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
