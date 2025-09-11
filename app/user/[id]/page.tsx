'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, BookOpen, Calendar, MapPin, MessageCircle, ExternalLink } from 'lucide-react'
import { getUserProfile, getUserBooks, getUserBooksCount } from '@/lib/api'
import { Book } from '@/types'
import BookGrid from '@/components/BookGrid'
import Pagination from '@/components/Pagination'
import { useAuth } from '@/contexts/AuthContext'

interface UserProfile {
  id: number
  username: string
  nickname?: string
  avatar?: string
  bio?: string
  location?: string
  created_at: string
}

export default function UserProfilePage() {
  const router = useRouter()
  const params = useParams()
  const { user: currentUser, loading: authLoading } = useAuth()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [books, setBooks] = useState<Book[]>([])
  const [totalBooks, setTotalBooks] = useState(0)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)

  const userId = parseInt(params.id as string)

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push('/landing')
      return
    }
    
    if (currentUser && userId) {
      loadUserData()
    }
  }, [currentUser, authLoading, userId, router])

  const loadUserData = async (page: number = 1) => {
    try {
      setLoading(true)
      const [profile, booksData, countData] = await Promise.all([
        getUserProfile(userId),
        getUserBooks(userId, page, itemsPerPage),
        getUserBooksCount(userId)
      ])
      
      setUserProfile(profile)
      setBooks(booksData)
      setTotalBooks(countData.total)
      setCurrentPage(page)
    } catch (error: any) {
      console.error('加载用户数据失败:', error)
      if (error.response?.status === 404) {
        router.push('/leaderboard')
      }
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = async (page: number) => {
    await loadUserData(page)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (!currentUser || !userProfile) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">用户主页</h1>
            </div>
            <Link
              href="/leaderboard"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              排行榜
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 用户信息卡片 */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* 头像 */}
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {userProfile.avatar ? (
                <img
                  src={userProfile.avatar}
                  alt={userProfile.nickname || userProfile.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-gray-500" />
              )}
            </div>

            {/* 用户信息 */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {userProfile.nickname || userProfile.username}
              </h2>
              <p className="text-lg text-gray-600 mb-4">@{userProfile.username}</p>
              
              {userProfile.bio && (
                <p className="text-gray-700 mb-4 max-w-2xl">{userProfile.bio}</p>
              )}

              <div className="flex flex-wrap items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span>{totalBooks} 本藏书</span>
                </div>
                
                {userProfile.location && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{userProfile.location}</span>
                  </div>
                )}
                
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>加入于 {formatDate(userProfile.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 图书收藏 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              图书收藏 ({totalBooks} 本)
            </h3>
          </div>

          {books.length > 0 ? (
            <>
              <BookGrid books={books} onBookUpdate={() => {}} />
              {totalBooks > itemsPerPage && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(totalBooks / itemsPerPage)}
                    onPageChange={handlePageChange}
                    totalItems={totalBooks}
                    itemsPerPage={itemsPerPage}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">该用户还没有添加任何图书</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
