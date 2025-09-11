'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookCreate } from '@/types'
import { createBooksBatch, downloadCover } from '@/lib/api'
import { ArrowLeft, Upload, X, Plus, BookOpen, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface BookItem {
  id: string
  title: string
  author: string
  isbn?: string
  published_date?: string
  cover_image?: string
  description?: string
  category?: string
  status: '已读' | '未读'
  coverFile?: File
}

export default function BatchAddBooks() {
  const router = useRouter()
  const [books, setBooks] = useState<BookItem[]>([])
  const [saving, setSaving] = useState(false)
  const [nextId, setNextId] = useState(1)

  const addNewBook = () => {
    const newBook: BookItem = {
      id: `book_${nextId}`,
      title: '',
      author: '',
      isbn: '',
      published_date: '',
      cover_image: '',
      description: '',
      category: '',
      status: '未读'
    }
    setBooks([...books, newBook])
    setNextId(nextId + 1)
  }

  const removeBook = (id: string) => {
    setBooks(books.filter(book => book.id !== id))
  }

  const updateBook = (id: string, field: keyof BookItem, value: any) => {
    setBooks(books.map(book => 
      book.id === id ? { ...book, [field]: value } : book
    ))
  }

  const handleCoverUpload = (id: string, file: File) => {
    updateBook(id, 'coverFile', file)
    const reader = new FileReader()
    reader.onload = (e) => {
      updateBook(id, 'cover_image', e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }



  const handleSubmit = async () => {
    const validBooks = books.filter(book => book.title.trim() && book.author.trim())
    
    if (validBooks.length === 0) {
      alert('请至少添加一本有效的图书')
      return
    }

    try {
      setSaving(true)
      
      // 处理封面上传
      const booksWithCovers = []
      for (const book of validBooks) {
        let coverImagePath = book.cover_image
        
        if (book.coverFile) {
          // 上传封面
          const formData = new FormData()
          formData.append('file', book.coverFile)
          const response = await fetch('/api/upload-cover', {
            method: 'POST',
            body: formData
          })
          const result = await response.json()
          coverImagePath = result.path
        }
        
        booksWithCovers.push({
          title: book.title,
          author: book.author,
          isbn: book.isbn || undefined,
          published_date: book.published_date || undefined,
          cover_image: coverImagePath || undefined,
          description: book.description || undefined,
          category: book.category || undefined,
          status: book.status
        })
      }
      
      await createBooksBatch(booksWithCovers)
      router.push('/')
    } catch (error) {
      console.error('批量添加失败:', error)
      alert('批量添加失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* 头部 */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">批量添加图书</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={addNewBook}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>添加图书</span>
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={saving || books.length === 0}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <CheckCircle className="h-4 w-4" />
                <span>{saving ? '保存中...' : `保存全部 (${books.length})`}</span>
              </button>
            </div>
          </div>

          {/* 使用说明 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">使用说明</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 点击"添加图书"按钮添加新的图书条目</li>
              <li>• 📱 点击"拍照上传"直接拍照ISBN条码（最简单）</li>
              <li>• 拍照后使用手机扫码应用（微信、支付宝等）获取ISBN码</li>
              <li>• 直接输入ISBN码可以自动获取图书信息</li>
              <li>• 也可以手动填写图书信息</li>
              <li>• 支持上传封面图片</li>
              <li>• 系统会自动生成图书描述和分类</li>
            </ul>
          </div>

          {/* 图书列表 */}
          <div className="space-y-6">
            {books.map((book, index) => (
              <div key={book.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    图书 {index + 1}
                  </h3>
                  <button
                    onClick={() => removeBook(book.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* 左侧：封面和ISBN上传 */}
                  <div className="space-y-4">
                    {/* 封面上传 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        封面图片
                      </label>
                      <div className="flex items-center space-x-4">
                        {book.cover_image ? (
                          <div className="relative">
                            <img
                              src={book.cover_image}
                              alt="封面预览"
                              className="w-20 h-28 object-cover rounded-lg border"
                            />
                          </div>
                        ) : (
                          <div className="w-20 h-28 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                            <BookOpen className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        
                        <div>
                          <input
                            type="file"
                            id={`cover_${book.id}`}
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleCoverUpload(book.id, file)
                            }}
                            className="hidden"
                          />
                          <label
                            htmlFor={`cover_${book.id}`}
                            className="btn-secondary cursor-pointer text-sm"
                          >
                            上传封面
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* ISBN输入 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ISBN码
                      </label>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={book.isbn}
                          onChange={(e) => updateBook(book.id, 'isbn', e.target.value)}
                          className="input-field"
                          placeholder="输入ISBN码（10位或13位）"
                        />
                        
                        <div className="text-xs text-gray-500">
                          💡 输入ISBN码后，系统会自动获取图书信息
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 右侧：图书信息表单 */}
                  <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          书名 *
                        </label>
                        <input
                          type="text"
                          value={book.title}
                          onChange={(e) => updateBook(book.id, 'title', e.target.value)}
                          className="input-field"
                          placeholder="请输入书名"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          作者 *
                        </label>
                        <input
                          type="text"
                          value={book.author}
                          onChange={(e) => updateBook(book.id, 'author', e.target.value)}
                          className="input-field"
                          placeholder="请输入作者"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ISBN
                        </label>
                        <input
                          type="text"
                          value={book.isbn}
                          onChange={(e) => updateBook(book.id, 'isbn', e.target.value)}
                          className="input-field"
                          placeholder="ISBN（可选）"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          出版日期
                        </label>
                        <input
                          type="date"
                          value={book.published_date}
                          onChange={(e) => updateBook(book.id, 'published_date', e.target.value)}
                          className="input-field"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          分类
                        </label>
                        <select
                          value={book.category}
                          onChange={(e) => updateBook(book.id, 'category', e.target.value)}
                          className="input-field"
                        >
                          <option value="">选择分类</option>
                          <option value="小说">小说</option>
                          <option value="历史">历史</option>
                          <option value="哲学">哲学</option>
                          <option value="技术">技术</option>
                          <option value="科学">科学</option>
                          <option value="艺术">艺术</option>
                          <option value="教育">教育</option>
                          <option value="生活">生活</option>
                          <option value="自传">自传</option>
                          <option value="传记">传记</option>
                          <option value="商业">商业</option>
                          <option value="心理学">心理学</option>
                          <option value="旅行">旅行</option>
                          <option value="其他">其他</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          阅读状态
                        </label>
                        <select
                          value={book.status}
                          onChange={(e) => updateBook(book.id, 'status', e.target.value)}
                          className="input-field"
                        >
                          <option value="未读">未读</option>
                          <option value="已读">已读</option>
                        </select>
                      </div>
                    </div>

                    {/* 描述 */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        图书描述
                      </label>
                      <textarea
                        value={book.description}
                        onChange={(e) => updateBook(book.id, 'description', e.target.value)}
                        rows={3}
                        className="input-field"
                        placeholder="请输入图书描述（可选，AI会自动生成）"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {books.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-4">还没有添加任何图书</p>
                <button
                  onClick={addNewBook}
                  className="btn-primary flex items-center space-x-2 mx-auto"
                >
                  <Plus className="h-4 w-4" />
                  <span>添加第一本图书</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}
