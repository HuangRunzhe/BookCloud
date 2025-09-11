'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BookOpen, User, LogOut, ChevronDown, BarChart3, Trophy } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import AddMenu from './AddMenu'

interface HeaderProps {
  onBookUpdate: () => void
}

export default function Header({ onBookUpdate }: HeaderProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              书云
            </h1>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <AddMenu onBookUpdate={onBookUpdate} />
                
                {/* 统计页面链接 */}
                <Link
                  href="/statistics"
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>统计</span>
                </Link>
                
                {/* 排行榜链接 */}
                <Link
                  href="/leaderboard"
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Trophy className="h-4 w-4" />
                  <span>排行榜</span>
                </Link>
                
                {/* 用户菜单 */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span>{user.username}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {showUserMenu && (
                    <>
                      {/* 背景遮罩 */}
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowUserMenu(false)}
                      />
                      
                      {/* 下拉菜单 */}
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-20">
                        <div className="py-1">
                          <div className="px-4 py-2 text-sm text-gray-500 border-b">
                            <div className="font-medium">{user.nickname || user.username}</div>
                            <div className="text-xs">{user.email}</div>
                            {user.is_admin && (
                              <div className="text-xs text-blue-600 font-medium">管理员</div>
                            )}
                          </div>
                          
                          <Link
                            href="/profile"
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <User className="h-4 w-4 mr-3" />
                            个人主页
                          </Link>
                          
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <LogOut className="h-4 w-4 mr-3" />
                            退出登录
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  登录
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors"
                >
                  注册
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
