'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import { Library, Search, BarChart3, Bot, Upload, Camera, Users, Star, CheckCircle, ArrowRight, Trophy } from 'lucide-react'
import PublicLeaderboard from '@/components/PublicLeaderboard'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import EarlyBirdCampaign from '@/components/EarlyBirdCampaign'
import { detectUserLanguage } from '@/lib/geoDetection'

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [locale, setLocale] = useState<'zh' | 'en'>('zh')

  useEffect(() => {
    // 自动检测用户语言偏好
    const detectedLang = detectUserLanguage()
    setLocale(detectedLang)
  }, [])

  // 翻译函数
  const getTranslation = (key: string) => {
    try {
      const keys = key.split('.')
      let value: any
      
      // 动态导入翻译文件
      if (locale === 'zh') {
        value = require('@/messages/zh.json')
      } else {
        value = require('@/messages/en.json')
      }
      
      for (const k of keys) {
        value = value?.[k]
      }
      return value || key
    } catch (error) {
      console.error('Translation error:', error)
      return key
    }
  }

  const features = [
    {
      icon: <Library className="w-8 h-8" />,
      title: getTranslation('landing.features.items.management.title'),
      description: getTranslation('landing.features.items.management.description'),
      details: getTranslation('landing.features.items.management.details')
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: getTranslation('landing.features.items.search.title'),
      description: getTranslation('landing.features.items.search.description'),
      details: getTranslation('landing.features.items.search.details')
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: getTranslation('landing.features.items.analytics.title'),
      description: getTranslation('landing.features.items.analytics.description'),
      details: getTranslation('landing.features.items.analytics.details')
    },
    {
      icon: <Bot className="w-8 h-8" />,
      title: getTranslation('landing.features.items.ai.title'),
      description: getTranslation('landing.features.items.ai.description'),
      details: getTranslation('landing.features.items.ai.details')
    }
  ]

  const stats = [
    { number: '100+', label: getTranslation('landing.stats.earlyUsers') },
    { number: '5,000+', label: getTranslation('landing.stats.booksManaged') },
    { number: '99%', label: getTranslation('landing.stats.stability') },
    { number: '24/7', label: getTranslation('landing.stats.service') }
  ]

  const testimonials = getTranslation('landing.testimonials.items').map((item: any) => ({
    ...item,
    rating: 5
  }))

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": locale === 'zh' ? "书云 - 智能图书管理系统" : "BookCloud - Smart Book Management System",
    "description": locale === 'zh' ? "专业的个人图书管理系统，支持藏书管理、AI推荐、ISBN识别等功能" : "Professional personal book management system with collection management, AI recommendations, ISBN recognition and more",
    "url": "https://bc.aikits.sbs",
    "applicationCategory": "ProductivityApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": locale === 'zh' ? "CNY" : "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1000"
    },
    "author": {
      "@type": "Organization",
      "name": locale === 'zh' ? "书云团队" : "BookCloud Team"
    },
    "featureList": locale === 'zh' ? [
      "智能图书管理",
      "AI智能推荐",
      "批量操作",
      "数据统计分析",
      "多维度搜索"
    ] : [
      "Smart Book Management",
      "AI Recommendations",
      "Batch Operations",
      "Data Analytics",
      "Multi-dimensional Search"
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
      {/* 语言切换器 */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>
      
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Library className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                {locale === 'zh' ? '书云' : 'BookCloud'}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900">
                {getTranslation('landing.nav.login')}
              </Link>
              <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                {getTranslation('landing.nav.register')}
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
              {getTranslation('landing.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {getTranslation('landing.hero.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center">
                {getTranslation('landing.hero.startNow')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link href="#features" className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors">
                {getTranslation('landing.hero.learnMore')}
              </Link>
            </div>
            
            {/* 早期用户活动提示 */}
            <div className="mt-6 inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full text-sm font-semibold">
              <Star className="w-4 h-4 mr-2" />
              {getTranslation('landing.hero.earlyBird')}
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

      {/* 早期用户活动 */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <EarlyBirdCampaign locale={locale} getTranslation={getTranslation} />
          {/* 用户交流群（移动到活动模块） */}
          <div className="mt-10">
            <div className="text-center mb-6">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">用户交流群</h3>
              <p className="text-gray-600 mt-2">扫码加入群聊，获取最新更新与交流</p>
            </div>
            <div className="flex justify-center">
              <div className="bg-white p-6 rounded-xl shadow">
                <Image src="/Group1QR.png" alt="用户交流群二维码" width={240} height={240} className="rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 功能特色 */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {getTranslation('landing.features.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {getTranslation('landing.features.subtitle')}
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
                          {(feature.details as string[]).map((detail: string, detailIndex: number) => (
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
              {getTranslation('landing.testimonials.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {getTranslation('landing.testimonials.subtitle')}
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
                {getTranslation('landing.leaderboard.title')}
              </h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {getTranslation('landing.leaderboard.subtitle')}
            </p>
          </div>

          <PublicLeaderboard />
        </div>
      </section>

      {/* CTA区域 */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {getTranslation('landing.cta.title')}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {getTranslation('landing.cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
              {getTranslation('landing.cta.register')}
            </Link>
            <Link href="/login" className="border border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
              {getTranslation('landing.cta.login')}
            </Link>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Library className="w-8 h-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold">
                {locale === 'zh' ? '书云' : 'BookCloud'}
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              {getTranslation('landing.footer.description')}
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
                {getTranslation('landing.footer.github')}
              </a>
            </div>
            <div className="border-t border-gray-800 pt-4 text-gray-400">
              <p>{getTranslation('landing.footer.copyright')}</p>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </>
  )
}
