'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Book, Stats } from '@/types'
import BookGrid from '@/components/BookGrid'
import StatsPanel from '@/components/StatsPanel'
import AIChat from '@/components/AIChat'
import Header from '@/components/Header'
import Pagination from '@/components/Pagination'
import { useAuth } from '@/contexts/AuthContext'
import { getBooks, getBooksCount, getStats } from '@/lib/api'

export default function Home() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [books, setBooks] = useState<Book[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [itemsPerPage] = useState(20)

  // 重定向到介绍页面
  useEffect(() => {
    console.log('Auth state:', { authLoading, user })
    if (!authLoading && !user) {
      console.log('Redirecting to landing page...')
      router.push('/landing')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async (page: number = 1) => {
    try {
      setLoading(true)
      const searchParams = {
        keyword: searchKeyword,
        category: selectedCategory,
        status: selectedStatus,
        page,
        page_size: itemsPerPage
      }
      
      const [booksData, countData, statsData] = await Promise.all([
        getBooks(searchParams),
        getBooksCount({
          keyword: searchKeyword,
          category: selectedCategory,
          status: selectedStatus
        }),
        getStats()
      ])
      setBooks(booksData)
      setTotalItems(countData.total)
      setStats(statsData)
      setCurrentPage(page)
    } catch (error) {
      console.error('加载数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    setCurrentPage(1)
    await loadData(1)
  }

  const handlePageChange = async (page: number) => {
    await loadData(page)
  }

  const handleBookUpdate = () => {
    loadData(currentPage)
  }

  // 显示加载状态
  if (authLoading || (loading && books.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  // 如果未登录，不渲染内容（会被重定向）
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onBookUpdate={handleBookUpdate} />
      
      <main className="container mx-auto px-4 py-8">
        {/* 搜索和筛选 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                搜索关键词
              </label>
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="书名、作者或ISBN"
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                分类
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
              >
                <option value="">全部分类</option>
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
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="input-field"
              >
                <option value="">全部状态</option>
                <option value="已读">已读</option>
                <option value="未读">未读</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="btn-primary w-full"
              >
                搜索
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 主要内容区域 */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                我的藏书 ({totalItems} 本)
              </h2>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">搜索中...</p>
              </div>
            ) : books.length > 0 ? (
              <>
                <BookGrid books={books} onBookUpdate={handleBookUpdate} />
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(totalItems / itemsPerPage)}
                  onPageChange={handlePageChange}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                />
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">没有找到图书</p>
                <p className="text-gray-400 mt-2">尝试调整搜索条件或添加新图书</p>
              </div>
            )}
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 统计面板 */}
            {stats && <StatsPanel stats={stats} />}
            
            {/* AI对话 */}
            <AIChat onBookUpdate={handleBookUpdate} />
          </div>
        </div>
      </main>
    </div>
  )
}
