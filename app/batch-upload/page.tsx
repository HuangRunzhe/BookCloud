'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { BookCreate } from '@/types'
import { createBook, uploadCover } from '@/lib/api'
import { ArrowLeft, Upload, X, Plus, Sparkles, Save, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface BookItem {
  id: string
  title: string
  author: string
  isbn: string
  published_date: string
  description: string
  category: string
  status: string
  review: string
  coverFile: File | null
  coverPreview: string | null
  coverUploaded: boolean
  coverPath?: string
}

export default function BatchUpload() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [books, setBooks] = useState<BookItem[]>([])
  const [saving, setSaving] = useState(false)
  const [generatingStates, setGeneratingStates] = useState<{[key: string]: {
    author: boolean
    publishedDate: boolean
    category: boolean
    description: boolean
  }}>({})

  const categories = [
    '小说', '历史', '哲学', '技术', '科学', '艺术', '教育', '生活',
    '自传', '传记', '商业', '心理学', '旅行', '其他'
  ]

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const newBook: BookItem = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          title: '',
          author: '',
          isbn: '',
          published_date: '',
          description: '',
          category: '',
          status: '未读',
          review: '',
          coverFile: file,
          coverPreview: URL.createObjectURL(file),
          coverUploaded: false
        }
        
        setBooks(prev => [...prev, newBook])
        setGeneratingStates(prev => ({
          ...prev,
          [newBook.id]: {
            author: false,
            publishedDate: false,
            category: false,
            description: false
          }
        }))
      }
    })
    
    // 清空文件输入
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeBook = (id: string) => {
    setBooks(prev => prev.filter(book => book.id !== id))
    setGeneratingStates(prev => {
      const newStates = { ...prev }
      delete newStates[id]
      return newStates
    })
  }

  const updateBook = (id: string, field: keyof BookItem, value: string | boolean) => {
    setBooks(prev => prev.map(book => 
      book.id === id ? { ...book, [field]: value } : book
    ))
  }

  const generateField = async (bookId: string, field: 'author' | 'publishedDate' | 'category' | 'description') => {
    const book = books.find(b => b.id === bookId)
    if (!book || !book.title.trim()) {
      alert('请先填写书名')
      return
    }

    try {
      setGeneratingStates(prev => ({
        ...prev,
        [bookId]: { ...prev[bookId], [field]: true }
      }))

      const apiBaseUrl = typeof window !== 'undefined' 
        ? (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
           ? 'http://localhost:8000' 
           : window.location.hostname === 'bc.aikits.sbs' ? 'https://bcbk.aikits.sbs' :
             window.location.hostname === 'bcbk.aikits.sbs' ? 'https://bcbk.aikits.sbs' :
             `${window.location.protocol}//${window.location.hostname}:8000`)
        : 'http://localhost:8000'

      let endpoint = ''
      let requestBody: any = { title: book.title }

      switch (field) {
        case 'author':
          endpoint = '/generate-author'
          break
        case 'publishedDate':
          endpoint = '/generate-published-date'
          requestBody.author = book.author || ''
          break
        case 'category':
          endpoint = '/generate-category'
          break
        case 'description':
          endpoint = '/generate-description'
          requestBody.author = book.author || ''
          break
      }

      const response = await fetch(`${apiBaseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      if (response.ok) {
        const data = await response.json()
        const fieldName = field === 'publishedDate' ? 'published_date' : field
        updateBook(bookId, fieldName as keyof BookItem, data[fieldName] || data[field] || '')
      } else {
        alert(`AI生成${field === 'publishedDate' ? '出版日期' : field === 'author' ? '作者' : field === 'category' ? '分类' : '描述'}失败，请重试`)
      }
    } catch (error) {
      console.error(`生成${field}失败:`, error)
      alert(`生成${field === 'publishedDate' ? '出版日期' : field === 'author' ? '作者' : field === 'category' ? '分类' : '描述'}失败，请重试`)
    } finally {
      setGeneratingStates(prev => ({
        ...prev,
        [bookId]: { ...prev[bookId], [field]: false }
      }))
    }
  }

  const uploadCoverForBook = async (bookId: string) => {
    const book = books.find(b => b.id === bookId)
    if (!book || !book.coverFile) return

    try {
      const uploadResult = await uploadCover(book.coverFile)
      updateBook(bookId, 'coverPath', uploadResult.path)
      updateBook(bookId, 'coverUploaded', true)
    } catch (error) {
      console.error('封面上传失败:', error)
      alert('封面上传失败，请重试')
    }
  }

  const saveBook = async (bookId: string) => {
    const book = books.find(b => b.id === bookId)
    if (!book) return

    if (!book.title.trim() || !book.author.trim()) {
      alert('请填写书名和作者')
      return
    }

    try {
      let coverImagePath = book.coverPath
      
      // 如果封面还没有上传，先上传
      if (book.coverFile && !book.coverUploaded) {
        const uploadResult = await uploadCover(book.coverFile)
        coverImagePath = uploadResult.path
      }

      const bookData: BookCreate = {
        title: book.title,
        author: book.author,
        isbn: book.isbn || undefined,
        published_date: book.published_date || undefined,
        cover_image: coverImagePath,
        description: book.description || undefined,
        category: book.category || undefined,
        status: book.status as '已读' | '未读',
        review: book.review || undefined
      }

      await createBook(bookData)
      
      // 从列表中移除已保存的图书
      removeBook(bookId)
      
      alert('图书保存成功！')
    } catch (error) {
      console.error('保存图书失败:', error)
      alert('保存图书失败，请重试')
    }
  }

  const saveAllBooks = async () => {
    const validBooks = books.filter(book => book.title.trim() && book.author.trim())
    
    if (validBooks.length === 0) {
      alert('请至少填写一本书的书名和作者')
      return
    }

    setSaving(true)
    let successCount = 0
    let errorCount = 0

    for (const book of validBooks) {
      try {
        let coverImagePath = book.coverPath
        
        // 如果封面还没有上传，先上传
        if (book.coverFile && !book.coverUploaded) {
          const uploadResult = await uploadCover(book.coverFile)
          coverImagePath = uploadResult.path
        }

        const bookData: BookCreate = {
          title: book.title,
          author: book.author,
          isbn: book.isbn || undefined,
          published_date: book.published_date || undefined,
          cover_image: coverImagePath,
          description: book.description || undefined,
          category: book.category || undefined,
          status: book.status as '已读' | '未读',
          review: book.review || undefined
        }

        await createBook(bookData)
        successCount++
      } catch (error) {
        console.error(`保存图书 ${book.title} 失败:`, error)
        errorCount++
      }
    }

    setSaving(false)
    
    if (successCount > 0) {
      alert(`批量保存完成！成功保存 ${successCount} 本书${errorCount > 0 ? `，${errorCount} 本书保存失败` : ''}`)
      setBooks([])
      setGeneratingStates({})
    } else {
      alert('所有图书保存失败，请检查网络连接后重试')
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
              <div>
                <h1 className="text-2xl font-bold text-gray-900">批量上传图书</h1>
                <p className="text-gray-600 mt-1">一次性上传多张封面，然后逐个填写图书信息</p>
              </div>
            </div>
            
            {books.length > 0 && (
              <div className="flex space-x-3">
                <button
                  onClick={saveAllBooks}
                  disabled={saving}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? '保存中...' : `批量保存 (${books.length})`}</span>
                </button>
              </div>
            )}
          </div>

          {/* 文件上传区域 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="text-center">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-gray-400 transition-colors">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">上传封面图片</h3>
                <p className="text-gray-600 mb-4">选择多张图书封面图片，支持 JPG、PNG 格式</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-primary"
                >
                  选择图片文件
                </button>
              </div>
            </div>
          </div>

          {/* 图书列表 */}
          {books.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">图书信息填写</h2>
              
              {books.map((book) => (
                <div key={book.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start space-x-6">
                    {/* 封面预览 */}
                    <div className="flex-shrink-0">
                      {book.coverPreview ? (
                        <div className="relative">
                          <img
                            src={book.coverPreview}
                            alt="封面预览"
                            className="w-24 h-32 object-cover rounded-lg border"
                          />
                          {!book.coverUploaded && (
                            <button
                              onClick={() => uploadCoverForBook(book.id)}
                              className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600"
                              title="上传封面"
                            >
                              <Upload className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="w-24 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                          <Upload className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* 表单 */}
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 书名 */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
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

                        {/* 作者 */}
                        <div>
                          <div className="flex items-center space-x-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              作者 *
                            </label>
                            <button
                              onClick={() => generateField(book.id, 'author')}
                              disabled={generatingStates[book.id]?.author || !book.title.trim()}
                              className="flex items-center space-x-1 px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Sparkles className="h-3 w-3" />
                              <span>{generatingStates[book.id]?.author ? '生成中' : 'AI'}</span>
                            </button>
                          </div>
                          <input
                            type="text"
                            value={book.author}
                            onChange={(e) => updateBook(book.id, 'author', e.target.value)}
                            className="input-field"
                            placeholder="请输入作者"
                          />
                        </div>

                        {/* ISBN */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
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

                        {/* 出版日期 */}
                        <div>
                          <div className="flex items-center space-x-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              出版日期
                            </label>
                            <button
                              onClick={() => generateField(book.id, 'publishedDate')}
                              disabled={generatingStates[book.id]?.publishedDate || !book.title.trim()}
                              className="flex items-center space-x-1 px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Sparkles className="h-3 w-3" />
                              <span>{generatingStates[book.id]?.publishedDate ? '生成中' : 'AI'}</span>
                            </button>
                          </div>
                          <input
                            type="date"
                            value={book.published_date}
                            onChange={(e) => updateBook(book.id, 'published_date', e.target.value)}
                            className="input-field"
                          />
                        </div>

                        {/* 分类 */}
                        <div>
                          <div className="flex items-center space-x-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              分类
                            </label>
                            <button
                              onClick={() => generateField(book.id, 'category')}
                              disabled={generatingStates[book.id]?.category || !book.title.trim()}
                              className="flex items-center space-x-1 px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Sparkles className="h-3 w-3" />
                              <span>{generatingStates[book.id]?.category ? '生成中' : 'AI'}</span>
                            </button>
                          </div>
                          <select
                            value={book.category}
                            onChange={(e) => updateBook(book.id, 'category', e.target.value)}
                            className="input-field"
                          >
                            <option value="">选择分类</option>
                            {categories.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>

                        {/* 阅读状态 */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <label className="block text-sm font-medium text-gray-700">
                            图书描述
                          </label>
                          <button
                            onClick={() => generateField(book.id, 'description')}
                            disabled={generatingStates[book.id]?.description || !book.title.trim() || !book.author.trim()}
                            className="flex items-center space-x-1 px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Sparkles className="h-3 w-3" />
                            <span>{generatingStates[book.id]?.description ? '生成中' : 'AI'}</span>
                          </button>
                        </div>
                        <textarea
                          value={book.description}
                          onChange={(e) => updateBook(book.id, 'description', e.target.value)}
                          rows={3}
                          className="input-field"
                          placeholder="请输入图书描述，或点击AI生成按钮自动生成"
                        />
                      </div>

                      {/* 我的评论心得 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          我的评论心得
                        </label>
                        <textarea
                          value={book.review}
                          onChange={(e) => updateBook(book.id, 'review', e.target.value)}
                          rows={2}
                          className="input-field"
                          placeholder="记录您对这本书的感想和评论（可选）"
                        />
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex-shrink-0 flex flex-col space-y-2">
                      <button
                        onClick={() => saveBook(book.id)}
                        disabled={!book.title.trim() || !book.author.trim()}
                        className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Save className="h-4 w-4" />
                        <span>保存</span>
                      </button>
                      <button
                        onClick={() => removeBook(book.id)}
                        className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>删除</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 空状态 */}
          {books.length === 0 && (
            <div className="text-center py-12">
              <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">还没有上传任何图片</h3>
              <p className="text-gray-600 mb-4">点击上方按钮选择图书封面图片开始批量添加</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
