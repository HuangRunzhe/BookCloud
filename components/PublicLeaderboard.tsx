'use client'

import { useState, useEffect } from 'react'
import { Trophy, Crown, Medal, User, BookOpen, ExternalLink } from 'lucide-react'
import { getLeaderboard } from '@/lib/api'

interface LeaderboardUser {
  id: number
  username: string
  nickname: string
  avatar?: string
  bio?: string
  book_count: number
}

export default function PublicLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    loadLeaderboard()
  }, [])

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
        return <Crown className="w-5 h-5 text-yellow-500" />
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 2:
        return <Medal className="w-5 h-5 text-amber-600" />
      default:
        return <span className="text-sm font-bold text-gray-600">#{index + 1}</span>
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

  const displayUsers = showAll ? leaderboard : leaderboard.slice(0, 10)

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载排行榜中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Trophy className="w-8 h-8 text-yellow-500 mr-3" />
          <h2 className="text-3xl font-bold text-gray-900">藏书排行榜</h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          看看哪些用户拥有最多的图书收藏，点击用户名称可以查看他们的公开图书
        </p>
      </div>

      {leaderboard.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">暂无排行榜数据</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {displayUsers.map((user, index) => (
              <div
                key={user.id}
                className="flex items-center p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-gray-200"
                onClick={() => window.open(`/user/${user.id}`, '_blank')}
              >
                {/* 排名 */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mr-4 ${getRankColor(index)}`}>
                  {getRankIcon(index)}
                </div>

                {/* 用户信息 */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.nickname}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {user.nickname}
                      </h3>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                      {user.bio && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                          {user.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 藏书数量 */}
                <div className="text-right mr-4">
                  <div className="text-xl font-bold text-gray-900">
                    {user.book_count}
                  </div>
                  <div className="text-sm text-gray-500">本藏书</div>
                </div>

                {/* 查看按钮 */}
                <div className="text-gray-400">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>

          {/* 展开/收起按钮 */}
          {leaderboard.length > 10 && (
            <div className="text-center mt-6">
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showAll ? '收起' : `查看全部 ${leaderboard.length} 名用户`}
              </button>
            </div>
          )}

          {/* 底部提示 */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              注册账号开始管理您的图书收藏，加入排行榜！
            </p>
          </div>
        </>
      )}
    </div>
  )
}
