'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { User, Edit3, BookOpen, Calendar, MapPin, User as UserIcon } from 'lucide-react'
import Link from 'next/link'

interface UserProfile {
  id: number
  username: string
  email: string
  nickname?: string
  avatar?: string
  gender?: string
  age?: number
  bio?: string
  location?: string
  is_admin: boolean
  created_at?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total_books: 0,
    read_books: 0,
    unread_books: 0,
    reading_progress: 0
  })

  useEffect(() => {
    if (user) {
      setProfile(user)
      loadStats()
    } else {
      router.push('/login')
    }
  }, [user, router])

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token')
      console.log('Loading stats with token:', token ? 'present' : 'missing')
      
      // 先尝试直接调用后端API
      const apiBaseUrl = window.location.hostname === 'localhost' ? 'http://localhost:8000' : `http://${window.location.hostname}:8000`
      
      const response = await fetch(`${apiBaseUrl}/stats/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      console.log('Stats response status:', response.status)
      console.log('API URL:', `${apiBaseUrl}/stats/`)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Stats data received:', data)
        setStats({
          total_books: data.total_books || 0,
          read_books: data.read_books || 0,
          unread_books: data.unread_books || 0,
          reading_progress: data.reading_progress || 0
        })
      } else {
        const errorText = await response.text()
        console.error('Stats API error:', response.status, errorText)
      }
    } catch (error) {
      console.error('加载统计失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
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

  if (!profile) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">书云</h1>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/profile/edit"
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Edit3 className="h-4 w-4" />
                <span>编辑资料</span>
              </Link>
              
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 个人资料卡片 */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex items-start space-x-6">
              {/* 头像 */}
              <div className="flex-shrink-0">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.nickname || profile.username}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                    <UserIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* 基本信息 */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {profile.nickname || profile.username}
                  </h2>
                  {profile.is_admin && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      管理员
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 mb-4">@{profile.username}</p>
                
                {profile.bio && (
                  <p className="text-gray-700 mb-4">{profile.bio}</p>
                )}

                {/* 详细信息 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <UserIcon className="h-4 w-4" />
                    <span>{profile.email}</span>
                  </div>
                  
                  {profile.gender && (
                    <div className="flex items-center space-x-2">
                      <UserIcon className="h-4 w-4" />
                      <span>{profile.gender}</span>
                    </div>
                  )}
                  
                  {profile.age && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{profile.age}岁</span>
                    </div>
                  )}
                  
                  {profile.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 藏书统计 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {stats.total_books}
              </div>
              <div className="text-gray-600">总藏书</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stats.read_books}
              </div>
              <div className="text-gray-600">已读</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {stats.unread_books}
              </div>
              <div className="text-gray-600">未读</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {stats.reading_progress}%
              </div>
              <div className="text-gray-600">阅读进度</div>
            </div>
          </div>

          {/* 快速操作 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/add"
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <BookOpen className="h-6 w-6 text-primary-600" />
                <div>
                  <div className="font-medium text-gray-900">添加图书</div>
                  <div className="text-sm text-gray-600">添加新的藏书</div>
                </div>
              </Link>
              
              <Link
                href="/batch-add"
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <BookOpen className="h-6 w-6 text-green-600" />
                <div>
                  <div className="font-medium text-gray-900">批量添加</div>
                  <div className="text-sm text-gray-600">通过ISBN批量添加</div>
                </div>
              </Link>
              
              <Link
                href="/"
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <BookOpen className="h-6 w-6 text-purple-600" />
                <div>
                  <div className="font-medium text-gray-900">我的书库</div>
                  <div className="text-sm text-gray-600">查看所有藏书</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
