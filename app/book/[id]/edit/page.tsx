'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Book, BookUpdate } from '@/types'
import { getBook, updateBook, uploadCover } from '@/lib/api'
import { ArrowLeft, Upload, X, Sparkles } from 'lucide-react'
import { getImageUrl } from '@/lib/utils'
import Link from 'next/link'

export default function EditBook() {
  const params = useParams()
  const router = useRouter()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [generatingDescription, setGeneratingDescription] = useState(false)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [formData, setFormData] = useState<BookUpdate>({
    title: '',
    author: '',
    isbn: '',
    published_date: '',
    description: '',
    category: '',
    status: '未读',
    review: ''
  })

  useEffect(() => {
    if (params.id) {
      loadBook()
    }
  }, [params.id])

  const loadBook = async () => {
    try {
      setLoading(true)
      const bookData = await getBook(Number(params.id))
      setBook(bookData)
      setFormData({
        title: bookData.title,
        author: bookData.author,
        isbn: bookData.isbn || '',
        published_date: bookData.published_date || '',
        description: bookData.description || '',
        category: bookData.category || '',
        status: bookData.status,
        review: bookData.review || ''
      })
      if (bookData.cover_image) {
        setCoverPreview(getImageUrl(bookData.cover_image))
      }
    } catch (error) {
      console.error('加载图书详情失败:', error)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setCoverPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeCover = () => {
    setCoverFile(null)
    setCoverPreview(null)
  }

  const generateDescription = async () => {
    if (!formData.title?.trim() || !formData.author?.trim()) {
      alert('请先填写书名和作者')
      return
    }

    try {
      setGeneratingDescription(true)
      
      // 调用AI生成描述
      const apiBaseUrl = typeof window !== 'undefined' 
        ? (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
           ? 'http://localhost:8000' 
           : `${window.location.protocol}//${window.location.hostname}:8000`)
        : 'http://localhost:8000'
      
      const response = await fetch(`${apiBaseUrl}/generate-description`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          author: formData.author
        })
      })

      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({
          ...prev,
          description: data.description
        }))
      } else {
        alert('AI生成描述失败，请重试')
      }
    } catch (error) {
      console.error('生成描述失败:', error)
      alert('生成描述失败，请重试')
    } finally {
      setGeneratingDescription(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title?.trim() || !formData.author?.trim()) {
      alert('请填写书名和作者')
      return
    }

    try {
      setSaving(true)
      
      let coverImagePath = book?.cover_image
      if (coverFile) {
        const uploadResult = await uploadCover(coverFile)
        coverImagePath = uploadResult.path
      }

      const updateData: BookUpdate = {
        ...formData,
        cover_image: coverImagePath || undefined,
        published_date: formData.published_date || undefined,
        isbn: formData.isbn || undefined,
        description: formData.description || undefined,
        category: formData.category || undefined,
        review: formData.review || undefined
      }

      await updateBook(book!.id, updateData)
      router.push(`/book/${book!.id}`)
    } catch (error) {
      console.error('更新图书失败:', error)
      alert('更新失败，请重试')
    } finally {
      setSaving(false)
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
        <div className="max-w-2xl mx-auto">
          {/* 头部 */}
          <div className="flex items-center space-x-4 mb-8">
            <Link
              href={`/book/${book.id}`}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">编辑图书</h1>
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* 封面上传 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  封面图片
                </label>
                <div className="flex items-center space-x-4">
                  {coverPreview ? (
                    <div className="relative">
                      <img
                        src={coverPreview}
                        alt="封面预览"
                        className="w-24 h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={removeCover}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <Upload className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  
                  <div>
                    <input
                      type="file"
                      id="cover"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="cover"
                      className="btn-secondary cursor-pointer"
                    >
                      更换封面
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      支持 JPG、PNG 格式
                    </p>
                  </div>
                </div>
              </div>

              {/* 基本信息 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    书名 *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
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
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    required
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
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleInputChange}
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
                    name="published_date"
                    value={formData.published_date}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    分类
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
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
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="未读">未读</option>
                    <option value="已读">已读</option>
                  </select>
                </div>
              </div>

              {/* 描述 */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    图书描述
                  </label>
                  <button
                    type="button"
                    onClick={generateDescription}
                    disabled={generatingDescription || !formData.title?.trim() || !formData.author?.trim()}
                    className="flex items-center space-x-1 px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>{generatingDescription ? '生成中...' : 'AI生成'}</span>
                  </button>
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="input-field"
                  placeholder="请输入图书描述，或点击AI生成按钮自动生成"
                />
              </div>

              {/* 我的评论心得 */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  我的评论心得
                </label>
                <textarea
                  name="review"
                  value={formData.review}
                  onChange={handleInputChange}
                  rows={3}
                  className="input-field"
                  placeholder="记录您对这本书的感想和评论（可选）"
                />
              </div>
            </div>

            {/* 提交按钮 */}
            <div className="flex justify-end space-x-4">
              <Link
                href={`/book/${book.id}`}
                className="btn-secondary"
              >
                取消
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? '保存中...' : '保存更改'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
