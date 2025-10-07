'use client'

import { useState, useEffect } from 'react'
import { 
  Library, 
  Users, 
  BookOpen, 
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowRight,
  Database,
  Zap,
  Shield,
  Star,
  Award,
  Target,
  PieChart,
  Activity,
  MessageCircle,
  Smartphone,
  Search
} from 'lucide-react'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import EarlyBirdCampaign from '@/components/EarlyBirdCampaign'
import { detectUserLanguage } from '@/lib/geoDetection'

export default function PromoPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [locale, setLocale] = useState<'zh' | 'en'>('zh')

  useEffect(() => {
    setIsVisible(true)
    
    // 自动检测用户语言偏好
    const detectedLang = detectUserLanguage()
    setLocale(detectedLang)
  }, [])

  // 调试信息
  console.log('Current locale:', locale)

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

  const stats = [
    { number: "50+", label: getTranslation('promo.stats.users'), icon: <Users className="w-6 h-6" /> },
    { number: "2,000+", label: getTranslation('promo.stats.books'), icon: <BookOpen className="w-6 h-6" /> },
    { number: "99.9%", label: getTranslation('promo.stats.stability'), icon: <Shield className="w-6 h-6" /> },
    { number: "24/7", label: getTranslation('promo.stats.service'), icon: <Clock className="w-6 h-6" /> }
  ]

  const features = [
    {
      icon: <Database className="w-8 h-8" />,
      title: getTranslation('promo.features.items.database.title'),
      description: getTranslation('promo.features.items.database.description')
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: getTranslation('promo.features.items.analysis.title'),
      description: getTranslation('promo.features.items.analysis.description')
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: getTranslation('promo.features.items.search.title'),
      description: getTranslation('promo.features.items.search.description')
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: getTranslation('promo.features.items.reports.title'),
      description: getTranslation('promo.features.items.reports.description')
    }
  ]

  const pricingPlans = [
    {
      name: getTranslation('promo.pricing.plans.free.name'),
      price: locale === 'zh' ? "¥0" : "$0",
      period: getTranslation('promo.pricing.plans.free.period'),
      features: getTranslation('promo.pricing.plans.free.features'),
      popular: false
    },
    {
      name: getTranslation('promo.pricing.plans.monthly.name'),
      price: locale === 'zh' ? "¥12.9" : "$1.99",
      period: getTranslation('promo.pricing.plans.monthly.period'),
      features: getTranslation('promo.pricing.plans.monthly.features'),
      popular: true
    },
    {
      name: getTranslation('promo.pricing.plans.yearly.name'),
      price: locale === 'zh' ? "¥129" : "$19.99",
      period: getTranslation('promo.pricing.plans.yearly.period'),
      features: getTranslation('promo.pricing.plans.yearly.features'),
      popular: false
    }
  ]

  const achievements = [
    { icon: <Award className="w-5 h-5" />, text: getTranslation('promo.achievements.items.ai') },
    { icon: <Star className="w-5 h-5" />, text: getTranslation('promo.achievements.items.ui') },
    { icon: <Target className="w-5 h-5" />, text: getTranslation('promo.achievements.items.focus') },
    { icon: <Activity className="w-5 h-5" />, text: getTranslation('promo.achievements.items.optimization') }
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      {/* Language Switcher */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>
      
      {/* Hero Section */}
      <section className="pt-16 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* 品牌区域 */}
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-8">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mr-4">
                  <Library className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-5xl font-bold text-gray-900">
                  {getTranslation('promo.title')}
                </h1>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-light mb-6 text-gray-700">
                {getTranslation('promo.subtitle')}
              </h2>
              
              <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                {getTranslation('promo.description')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="px-8 py-4 bg-blue-600 rounded-lg text-white font-semibold text-lg hover:bg-blue-700 transition-all duration-300 shadow-lg">
                  {getTranslation('promo.tryNow')}
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                </button>
                <button className="px-8 py-4 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold text-lg hover:bg-gray-50 transition-all duration-300">
                  {getTranslation('promo.watchDemo')}
                </button>
              </div>
            </div>

            {/* 统计数据 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {stats.map((stat: any, index: number) => (
                <div key={index} className="text-center p-6 bg-gray-50 rounded-xl">
                  <div className="text-blue-600 mb-3 flex justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI对话场景展示 */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4 text-gray-900">{getTranslation('promo.aiAssistant.title')}</h3>
            <p className="text-gray-600 text-lg">{getTranslation('promo.aiAssistant.description')}</p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="relative">
              {/* iPhone 框架 - 更真实的iPhone外观 */}
              <div className="w-80 h-[640px] bg-gray-900 rounded-[3.5rem] p-1 shadow-2xl">
                {/* 刘海屏 */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-10"></div>
                <div className="w-full h-full bg-black rounded-[3rem] p-2">
                  <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                    {/* 状态栏 */}
                    <div className="h-14 bg-white flex items-center justify-between px-8 text-sm font-semibold text-gray-900 relative z-20">
                      <span className="text-black">9:41</span>
                      <div className="flex items-center space-x-1">
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-gray-900 rounded-full"></div>
                          <div className="w-1 h-1 bg-gray-900 rounded-full"></div>
                          <div className="w-1 h-1 bg-gray-900 rounded-full"></div>
                        </div>
                        <div className="w-6 h-3 border-2 border-gray-900 rounded-sm ml-2">
                          <div className="w-4 h-1.5 bg-gray-900 rounded-sm m-0.5"></div>
                        </div>
                      </div>
                    </div>
                  
                    {/* 聊天界面 */}
                    <div className="h-[calc(100%-3.5rem)] bg-gray-50 p-4 overflow-y-auto">
                      <div className="space-y-4">
                        {/* AI消息 */}
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <MessageCircle className="w-4 h-4 text-white" />
                          </div>
                          <div className="bg-white rounded-2xl rounded-tl-md p-4 max-w-xs shadow-sm">
                            <p className="text-sm text-gray-800">{getTranslation('promo.aiAssistant.messages.ai1')}</p>
                          </div>
                        </div>

                        {/* 用户消息 */}
                        <div className="flex items-start space-x-3 justify-end">
                          <div className="bg-blue-600 rounded-2xl rounded-tr-md p-4 max-w-xs">
                            <p className="text-sm text-white">{getTranslation('promo.aiAssistant.messages.user1')}</p>
                          </div>
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-gray-600" />
                          </div>
                        </div>

                        {/* AI消息 */}
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <MessageCircle className="w-4 h-4 text-white" />
                          </div>
                          <div className="bg-white rounded-2xl rounded-tl-md p-4 max-w-xs shadow-sm">
                            <p className="text-sm text-gray-800">{getTranslation('promo.aiAssistant.messages.ai2')}</p>
                          </div>
                        </div>

                        {/* 用户消息 */}
                        <div className="flex items-start space-x-3 justify-end">
                          <div className="bg-blue-600 rounded-2xl rounded-tr-md p-4 max-w-xs">
                            <p className="text-sm text-white">{getTranslation('promo.aiAssistant.messages.user2')}</p>
                          </div>
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-gray-600" />
                          </div>
                        </div>

                        {/* AI消息 */}
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <MessageCircle className="w-4 h-4 text-white" />
                          </div>
                          <div className="bg-white rounded-2xl rounded-tl-md p-4 max-w-xs shadow-sm">
                            <p className="text-sm text-gray-800">{getTranslation('promo.aiAssistant.messages.ai3')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 书籍管理页面展示 */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4 text-gray-900">{getTranslation('promo.bookManagement.title')}</h3>
            <p className="text-gray-600 text-lg">{getTranslation('promo.bookManagement.description')}</p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="relative">
              {/* iPhone 框架 - 书籍管理页面 */}
              <div className="w-80 h-[640px] bg-gray-900 rounded-[3.5rem] p-1 shadow-2xl">
                {/* 刘海屏 */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-10"></div>
                <div className="w-full h-full bg-black rounded-[3rem] p-2">
                  <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                    {/* 状态栏 */}
                    <div className="h-14 bg-white flex items-center justify-between px-8 text-sm font-semibold text-gray-900 relative z-20">
                      <span className="text-black">9:41</span>
                      <div className="flex items-center space-x-1">
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-gray-900 rounded-full"></div>
                          <div className="w-1 h-1 bg-gray-900 rounded-full"></div>
                          <div className="w-1 h-1 bg-gray-900 rounded-full"></div>
                        </div>
                        <div className="w-6 h-3 border-2 border-gray-900 rounded-sm ml-2">
                          <div className="w-4 h-1.5 bg-gray-900 rounded-sm m-0.5"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* 书籍管理界面 */}
                    <div className="h-[calc(100%-3.5rem)] bg-gray-50 overflow-y-auto">
                      {/* 顶部导航 */}
                      <div className="bg-white px-4 py-3 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <h1 className="text-lg font-semibold text-gray-900">{getTranslation('promo.bookManagement.myBooks')}</h1>
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                              <Library className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm text-gray-600">127{getTranslation('promo.bookManagement.bookCount')}</span>
                          </div>
                        </div>
                      </div>

                      {/* 搜索栏 */}
                      <div className="p-4 bg-white">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input 
                            type="text" 
                            placeholder={getTranslation('promo.bookManagement.searchPlaceholder')} 
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      {/* 分类标签 */}
                      <div className="px-4 pb-3 bg-white">
                        <div className="flex space-x-2 overflow-x-auto">
                          <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium whitespace-nowrap">{getTranslation('promo.bookManagement.categories.all')}</span>
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium whitespace-nowrap">{getTranslation('promo.bookManagement.categories.tech')}</span>
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium whitespace-nowrap">{getTranslation('promo.bookManagement.categories.literature')}</span>
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium whitespace-nowrap">{getTranslation('promo.bookManagement.categories.management')}</span>
                        </div>
                      </div>

                      {/* 书籍列表 */}
                      <div className="px-4 space-y-3 pb-4">
                        {/* 书籍卡片1 */}
                        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                          <div className="flex items-start space-x-3">
                            <div className="w-12 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded flex items-center justify-center">
                              <Library className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 text-sm truncate">JavaScript高级程序设计</h3>
                              <p className="text-xs text-gray-500 mt-1">Nicholas C. Zakas</p>
                              <div className="flex items-center mt-2 space-x-2">
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded">{getTranslation('promo.bookManagement.categories.tech')}</span>
                                <span className="text-xs text-gray-400">2024-01-15</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            </div>
                          </div>
                        </div>

                        {/* 书籍卡片2 */}
                        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                          <div className="flex items-start space-x-3">
                            <div className="w-12 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded flex items-center justify-center">
                              <Library className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 text-sm truncate">百年孤独</h3>
                              <p className="text-xs text-gray-500 mt-1">加西亚·马尔克斯</p>
                              <div className="flex items-center mt-2 space-x-2">
                                <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded">{getTranslation('promo.bookManagement.categories.literature')}</span>
                                <span className="text-xs text-gray-400">2024-01-10</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            </div>
                          </div>
                        </div>

                        {/* 书籍卡片3 */}
                        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                          <div className="flex items-start space-x-3">
                            <div className="w-12 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded flex items-center justify-center">
                              <Library className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 text-sm truncate">从0到1</h3>
                              <p className="text-xs text-gray-500 mt-1">彼得·蒂尔</p>
                              <div className="flex items-center mt-2 space-x-2">
                                <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-xs rounded">{getTranslation('promo.bookManagement.categories.management')}</span>
                                <span className="text-xs text-gray-400">2024-01-08</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 功能展示 */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4 text-gray-900">{getTranslation('promo.features.title')}</h3>
            <p className="text-gray-600 text-lg">{getTranslation('promo.features.description')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature: any, index: number) => (
              <div key={index} className="p-8 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 定价方案 */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4 text-gray-900">{getTranslation('promo.pricing.title')}</h3>
            <p className="text-gray-600 text-lg">{getTranslation('promo.pricing.description')}</p>
          </div>

          {/* 早期用户活动 */}
          <EarlyBirdCampaign locale={locale} getTranslation={getTranslation} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingPlans.map((plan: any, index: number) => (
              <div 
                key={index}
                className={`relative p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                  plan.popular ? 'border-blue-500 shadow-lg' : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      {getTranslation('promo.pricing.plans.monthly.popular')}
                    </div>
                  </div>
                )}
                
                <div className="text-center">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2 text-sm">{plan.period}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-6 text-left">
                    {(plan.features as string[]).map((feature: string, featureIndex: number) => (
                      <div key={featureIndex} className="flex items-center text-gray-700">
                        <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-xs">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button className={`w-full py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                    plan.popular 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}>
                    {getTranslation('promo.pricing.selectPlan')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 成就展示 */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4 text-gray-900">{getTranslation('promo.achievements.title')}</h3>
            <p className="text-gray-600 text-lg">{getTranslation('promo.achievements.description')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement: any, index: number) => (
              <div key={index} className="flex items-center p-6 bg-white rounded-xl shadow-sm">
                <div className="text-blue-600 mr-4">
                  {achievement.icon}
                </div>
                <span className="text-gray-700 font-medium">{achievement.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 数据可视化展示 - iPhone屏幕 */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4 text-gray-900">{getTranslation('promo.insights.title')}</h3>
            <p className="text-gray-600 text-lg">{getTranslation('promo.insights.description')}</p>
          </div>

          <div className="flex justify-center">
            <div className="relative">
              {/* iPhone 框架 - 更真实的iPhone外观 */}
              <div className="w-80 h-[640px] bg-gray-900 rounded-[3.5rem] p-1 shadow-2xl">
                {/* 刘海屏 */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-10"></div>
                <div className="w-full h-full bg-black rounded-[3rem] p-2">
                  <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                    {/* 状态栏 */}
                    <div className="h-14 bg-white flex items-center justify-between px-8 text-sm font-semibold text-gray-900 relative z-20">
                      <span className="text-black">9:41</span>
                      <div className="flex items-center space-x-1">
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-gray-900 rounded-full"></div>
                          <div className="w-1 h-1 bg-gray-900 rounded-full"></div>
                          <div className="w-1 h-1 bg-gray-900 rounded-full"></div>
                        </div>
                        <div className="w-6 h-3 border-2 border-gray-900 rounded-sm ml-2">
                          <div className="w-4 h-1.5 bg-gray-900 rounded-sm m-0.5"></div>
                        </div>
                      </div>
                    </div>
                  
                    {/* 数据统计界面 */}
                    <div className="h-[calc(100%-3.5rem)] bg-gray-50 p-4 overflow-y-auto">
                      <div className="space-y-6">
                        {/* 藏书分布 */}
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                          <div className="flex items-center mb-3">
                            <PieChart className="w-5 h-5 text-blue-600 mr-2" />
                            <h4 className="font-semibold text-gray-900">{getTranslation('promo.insights.distribution')}</h4>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">{getTranslation('promo.insights.categories.tech')}</span>
                              <span className="text-sm font-semibold">35%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div className="bg-blue-600 h-1.5 rounded-full" style={{width: '35%'}}></div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">{getTranslation('promo.insights.categories.literature')}</span>
                              <span className="text-sm font-semibold">28%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div className="bg-green-600 h-1.5 rounded-full" style={{width: '28%'}}></div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">{getTranslation('promo.insights.categories.management')}</span>
                              <span className="text-sm font-semibold">22%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div className="bg-purple-600 h-1.5 rounded-full" style={{width: '22%'}}></div>
                            </div>
                          </div>
                        </div>

                        {/* 阅读统计 */}
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                          <div className="flex items-center mb-3">
                            <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                            <h4 className="font-semibold text-gray-900">{getTranslation('promo.insights.readingStats')}</h4>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600 mb-1">127</div>
                              <div className="text-xs text-gray-600">{getTranslation('promo.insights.stats.newThisMonth')}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600 mb-1">4.2</div>
                              <div className="text-xs text-gray-600">{getTranslation('promo.insights.stats.weeklyAverage')}</div>
                            </div>
                          </div>
                        </div>

                        {/* 收藏趋势 */}
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                          <div className="flex items-center mb-3">
                            <Activity className="w-5 h-5 text-purple-600 mr-2" />
                            <h4 className="font-semibold text-gray-900">{getTranslation('promo.insights.collectionTrends')}</h4>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">{getTranslation('promo.insights.stats.collectedThisMonth')}</span>
                              <span className="text-sm font-semibold text-purple-600">+15本</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">{getTranslation('promo.insights.stats.mostPopular')}</span>
                              <span className="text-sm font-semibold text-gray-900">{getTranslation('promo.insights.categories.tech')}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">{getTranslation('promo.insights.stats.averageRating')}</span>
                              <span className="text-sm font-semibold text-yellow-600">4.8★</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h3 className="text-4xl font-bold mb-6">{getTranslation('promo.cta.title')}</h3>
          <p className="text-xl text-blue-100 mb-12">{getTranslation('promo.cta.description')}</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-12 py-4 bg-white text-blue-600 rounded-lg font-semibold text-xl hover:bg-gray-100 transition-all duration-300 shadow-lg">
              {getTranslation('promo.cta.startNow')}
              <ArrowRight className="w-6 h-6 ml-2 inline" />
            </button>
            <div className="text-blue-200 text-sm">
              <Star className="w-4 h-4 inline mr-1" />
              {getTranslation('promo.cta.freeTrial')}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}