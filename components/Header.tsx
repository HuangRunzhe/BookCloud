'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Library, User, LogOut, ChevronDown, BarChart3, Trophy, CreditCard, Settings, Menu, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import AddMenu from './AddMenu'

interface HeaderProps {
  onBookUpdate: () => void
}

export default function Header({ onBookUpdate }: HeaderProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors duration-300">
              <Library className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              书云
            </h1>
          </Link>

          {/* 桌面端菜单 */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <AddMenu onBookUpdate={onBookUpdate} />
                
                {/* 统计页面链接 */}
                <Link
                  href="/statistics"
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>统计</span>
                </Link>
                
                {/* 排行榜链接 */}
                <Link
                  href="/leaderboard"
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                >
                  <Trophy className="h-4 w-4" />
                  <span>排行榜</span>
                </Link>
                
                {/* 充值页面链接 */}
                <Link
                  href="/payment"
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>充值</span>
                </Link>
                
                {/* 管理员页面链接 */}
                {user.is_admin && (
                  <Link
                    href="/admin"
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                  >
                    <Settings className="h-4 w-4" />
                    <span>管理</span>
                  </Link>
                )}
                
                {/* 用户菜单 */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
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
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                        <div className="py-2">
                          <div className="px-6 py-4 text-sm text-gray-600 border-b border-gray-100">
                            <div className="font-semibold text-gray-900 text-base">{user.nickname || user.username}</div>
                            <div className="text-xs text-gray-500 mt-1">{user.email}</div>
                            <div className="flex items-center mt-2">
                              <span className={`badge ${
                                user.membership_status === 'FREE' ? 'badge-secondary' :
                                user.membership_status === 'MONTHLY' ? 'badge-primary' :
                                user.membership_status === 'YEARLY' ? 'badge-success' :
                                'badge-warning'
                              }`}>
                                {user.membership_status === 'FREE' ? '免费用户' :
                                 user.membership_status === 'MONTHLY' ? '月费会员' :
                                 user.membership_status === 'YEARLY' ? '年费会员' :
                                 user.membership_status === 'LIFETIME' ? '终身会员' : '未知状态'}
                              </span>
                              {user.is_admin && (
                                <span className="badge badge-primary ml-2">管理员</span>
                              )}
                            </div>
                          </div>
                          
                          <Link
                            href="/profile"
                            className="flex items-center w-full px-6 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <User className="h-4 w-4 mr-3" />
                            个人主页
                          </Link>
                          
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-6 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
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

          {/* 移动端菜单按钮 */}
          <div className="md:hidden flex items-center space-x-2">
            {user && (
              <AddMenu onBookUpdate={onBookUpdate} />
            )}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
            >
              {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* 移动端菜单 */}
        {showMobileMenu && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="pt-4 space-y-2">
              {user ? (
                <>
                  <Link
                    href="/statistics"
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>统计</span>
                  </Link>
                  
                  <Link
                    href="/leaderboard"
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <Trophy className="h-4 w-4" />
                    <span>排行榜</span>
                  </Link>
                  
                  <Link
                    href="/payment"
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>充值</span>
                  </Link>
                  
                  {user.is_admin && (
                    <Link
                      href="/admin"
                      className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <Settings className="h-4 w-4" />
                      <span>管理</span>
                    </Link>
                  )}
                  
                  <div className="pt-2 border-t border-gray-200">
                    <div className="px-4 py-2 text-sm text-gray-600">
                      <div className="font-semibold text-gray-900">{user.nickname || user.username}</div>
                      <div className="text-xs text-gray-500 mt-1">{user.email}</div>
                      <div className="flex items-center mt-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.membership_status === 'FREE' ? 'bg-gray-100 text-gray-800' :
                          user.membership_status === 'MONTHLY' ? 'bg-blue-100 text-blue-800' :
                          user.membership_status === 'YEARLY' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.membership_status === 'FREE' ? '免费用户' :
                           user.membership_status === 'MONTHLY' ? '月费会员' :
                           user.membership_status === 'YEARLY' ? '年费会员' :
                           user.membership_status === 'LIFETIME' ? '终身会员' : '未知状态'}
                        </span>
                        {user.is_admin && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 ml-2">管理员</span>
                        )}
                      </div>
                    </div>
                    
                    <Link
                      href="/profile"
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <User className="h-4 w-4 mr-3" />
                      个人主页
                    </Link>
                    
                    <button
                      onClick={() => {
                        handleLogout()
                        setShowMobileMenu(false)
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      退出登录
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    登录
                  </Link>
                  <Link
                    href="/register"
                    className="block px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    注册
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
