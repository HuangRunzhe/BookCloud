'use client'

import Link from 'next/link'
import { Library, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 顶部简洁导航 */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors duration-300">
                <Library className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">书云</h1>
            </Link>
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
              <Search className="w-4 h-4" />
              <span>找不到页面</span>
            </div>
          </div>
        </div>
      </header>

      {/* 主体 */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center shadow-medium">
              <svg className="w-12 h-12 text-primary-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 9.75h.008v.008H9.75V9.75zM14.25 9.75h.008v.008h-.008V9.75zM9 13.5h6m-9 7.125V7.875A2.625 2.625 0 018.625 5.25h6.75A2.625 2.625 0 0118 7.875v12.75l-6-3-6 3z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">页面走丢了 (404)</h2>
            <p className="text-gray-600 mb-8">抱歉，您访问的页面不存在或已被移动。您可以返回首页或前往落地页了解更多。</p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/" className="btn-primary px-6 py-3 text-base">
                返回首页
              </Link>
              <Link href="/landing" className="btn-secondary px-6 py-3 text-base">
                前往落地页
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* 页脚简洁版权 */}
      <footer className="bg-gray-900 text-white py-6">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} 书云 BookCloud
        </div>
      </footer>
    </div>
  )
}


