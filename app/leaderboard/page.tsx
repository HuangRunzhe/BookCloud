'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Trophy, Crown, Medal, User, BookOpen, ArrowLeft, ExternalLink } from 'lucide-react'
import { getLeaderboard } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

interface LeaderboardUser {
  id: number
  username: string
  nickname: string
  avatar?: string
  bio?: string
  book_count: number
}

export default function LeaderboardPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/landing')
      return
    }
    
    if (user) {
      loadLeaderboard()
    }
  }, [user, authLoading, router])

  const loadLeaderboard = async () => {
    try {
      setLoading(true)
      const data = await getLeaderboard()
      setLeaderboard(data)
    } catch (error) {
      console.error('加载排行榜失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-6 h-6 text-yellow-500" />
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 2:
        return <Medal className="w-6 h-6 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-gray-600">#{index + 1}</span>
    }
  }

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
      case 1:
        return 'bg-gradient-to-r from-gray-300 to-gray-500'
      case 2:
        return 'bg-gradient-to-r from-amber-400 to-amber-600'
      default:
        return 'bg-blue-500'
    }
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

  if (!user) {
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
              <Trophy className="w-8 h-8 text-yellow-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">藏书排行榜</h1>
            </div>
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              返回首页
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 排行榜说明 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <Trophy className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-blue-900">排行榜说明</h3>
              <p className="text-sm text-blue-700 mt-1">
                根据用户的藏书数量进行排名，点击用户名称可以查看其公开的图书收藏。
              </p>
            </div>
          </div>
        </div>

        {/* 排行榜列表 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">暂无排行榜数据</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {leaderboard.map((user, index) => (
                <div
                  key={user.id}
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/user/${user.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* 排名 */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${getRankColor(index)}`}>
                        {getRankIcon(index)}
                      </div>

                      {/* 用户信息 */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.nickname}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-6 h-6 text-gray-500" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {user.nickname}
                            </h3>
                            <p className="text-sm text-gray-500">@{user.username}</p>
                            {user.bio && (
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {user.bio}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 藏书数量 */}
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {user.book_count}
                        </div>
                        <div className="text-sm text-gray-500">本藏书</div>
                      </div>

                      {/* 查看按钮 */}
                      <div className="ml-4">
                        <ExternalLink className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 底部提示 */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            排行榜每小时更新一次，展示前50名用户
          </p>
        </div>
      </main>
    </div>
  )
}
