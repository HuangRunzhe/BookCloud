'use client'

import { useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { BookOpen, Search, BarChart3, Bot, Upload, Camera, Users, Star, CheckCircle, ArrowRight, Trophy } from 'lucide-react'
import PublicLeaderboard from '@/components/PublicLeaderboard'

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: '智能图书管理',
      description: '轻松添加、编辑、删除图书，支持批量操作和智能分类',
      details: ['手动添加图书', '自动获取图书信息', '智能分类建议', '批量导入导出']
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: '强大搜索功能',
      description: '多维度搜索，快速找到您需要的图书',
      details: ['书名、作者搜索', '分类筛选', '阅读状态筛选', '高级搜索']
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: '数据统计分析',
      description: '可视化您的藏书数据，了解阅读习惯',
      details: ['藏书统计图表', '分类分布分析', '阅读进度跟踪', '个人阅读报告']
    },
    {
      icon: <Bot className="w-8 h-8" />,
      title: 'AI智能助手',
      description: '基于DeepSeek的AI问答和推荐系统',
      details: ['智能图书推荐', '自然语言查询', '阅读建议', '个性化推荐']
    }
  ]

  const stats = [
    { number: '100+', label: '早期用户' },
    { number: '5,000+', label: '图书管理' },
    { number: '99%', label: '系统稳定性' },
    { number: '24/7', label: '在线服务' }
  ]

  const testimonials = [
    {
      name: '张先生',
      role: '图书爱好者',
      content: '书云让我的藏书管理变得如此简单，AI推荐功能帮我发现了许多好书！',
      rating: 5
    },
    {
      name: '李女士',
      role: '图书管理员',
      content: '批量添加功能大大提高了我的工作效率，强烈推荐！',
      rating: 5
    },
    {
      name: '王老师',
      role: '教育工作者',
      content: '数据统计功能让我清楚了解自己的阅读习惯，非常实用。',
      rating: 5
    }
  ]

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "书云 - 智能图书管理系统",
    "description": "专业的个人图书管理系统，支持藏书管理、AI推荐、ISBN识别等功能",
    "url": "https://bc.aikits.sbs",
    "applicationCategory": "ProductivityApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "CNY"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1000"
    },
    "author": {
      "@type": "Organization",
      "name": "书云团队"
    },
    "featureList": [
      "智能图书管理",
      "AI智能推荐",
      "批量操作",
      "数据统计分析",
      "多维度搜索"
    ]
  }

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <div className="min-h-screen bg-white">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">书云</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900">
                登录
              </Link>
              <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                免费注册
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 英雄区域 */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              智能图书管理系统
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              让您的图书收藏管理更简单高效，支持AI推荐、批量操作等强大功能
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center">
                立即开始
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link href="#features" className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors">
                了解更多
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 统计数据 */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 功能特色 */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              强大功能特色
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              为图书爱好者和管理者量身打造的专业工具
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-lg cursor-pointer transition-all ${
                    activeFeature === index
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white hover:shadow-md'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`${activeFeature === index ? 'text-white' : 'text-blue-600'}`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">
                        {feature.title}
                      </h3>
                      <p className={`${activeFeature === index ? 'text-blue-100' : 'text-gray-600'}`}>
                        {feature.description}
                      </p>
                      {activeFeature === index && (
                        <ul className="mt-4 space-y-2">
                          {feature.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="flex items-center text-blue-100">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {features[activeFeature].icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {features[activeFeature].title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {features[activeFeature].description}
                </p>
                <div className="space-y-3">
                  {features[activeFeature].details.map((detail, index) => (
                    <div key={index} className="flex items-center text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      {detail}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 用户评价 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              用户评价
            </h2>
            <p className="text-xl text-gray-600">
              看看其他用户是如何使用书云的
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.name[0]}
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 排行榜 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8 text-yellow-500 mr-3" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                藏书排行榜
              </h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              看看哪些用户拥有最多的图书收藏，点击用户名称可以查看他们的公开图书
            </p>
          </div>

          <PublicLeaderboard />
        </div>
      </section>

      {/* CTA区域 */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            开始管理您的图书收藏
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            立即注册，体验智能图书管理系统的强大功能
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
              免费注册
            </Link>
            <Link href="/login" className="border border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
              立即登录
            </Link>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold">书云</span>
            </div>
            <p className="text-gray-400 mb-4">
              专业的智能图书管理系统，让您的图书收藏管理更简单高效。
            </p>
            <div className="mb-4">
              <a 
                href="https://github.com/HuangRunzhe/BookCloud" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
                GitHub 开源地址
              </a>
            </div>
            <div className="border-t border-gray-800 pt-4 text-gray-400">
              <p>&copy; 2024 书云. 保留所有权利.</p>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </>
  )
}
