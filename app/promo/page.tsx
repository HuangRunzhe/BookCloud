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

export default function PromoPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const stats = [
    { number: "50+", label: "注册用户", icon: <Users className="w-6 h-6" /> },
    { number: "2,000+", label: "管理书籍", icon: <BookOpen className="w-6 h-6" /> },
    { number: "99.9%", label: "系统稳定性", icon: <Shield className="w-6 h-6" /> },
    { number: "24/7", label: "在线服务", icon: <Clock className="w-6 h-6" /> }
  ]

  const features = [
    {
      icon: <Database className="w-8 h-8" />,
      title: "智能数据库",
      description: "基于AI的书籍信息自动完善与分类管理"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "收藏分析",
      description: "深度分析您的藏书结构，提供收藏建议"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "快速搜索",
      description: "毫秒级响应，支持多维度智能检索"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "统计报告",
      description: "详细的藏书数据统计与可视化报告"
    }
  ]

  const pricingPlans = [
    {
      name: "免费版",
      price: "¥0",
      period: "永久免费",
      features: ["最多40本书籍", "基础搜索功能", "简单统计"],
      popular: false
    },
    {
      name: "月费版",
      price: "¥12.9",
      period: "每月",
      features: ["无限制书籍管理", "AI智能分类", "高级搜索", "详细统计", "数据导出"],
      popular: true
    },
    {
      name: "年费版",
      price: "¥129",
      period: "每年",
      features: ["所有月费版功能", "优先客服支持", "专属功能", "终身更新"],
      popular: false
    }
  ]

  const achievements = [
    { icon: <Award className="w-5 h-5" />, text: "基于AI技术的创新图书管理" },
    { icon: <Star className="w-5 h-5" />, text: "简洁易用的界面设计" },
    { icon: <Target className="w-5 h-5" />, text: "专注家庭图书馆管理" },
    { icon: <Activity className="w-5 h-5" />, text: "持续优化用户体验" }
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
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
                  书云
                </h1>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-light mb-6 text-gray-700">
                智能家庭图书馆管理系统
              </h2>
              
              <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                基于AI技术的现代化家庭图书管理平台，让您的实体书籍收藏井然有序
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="px-8 py-4 bg-blue-600 rounded-lg text-white font-semibold text-lg hover:bg-blue-700 transition-all duration-300 shadow-lg">
                  立即体验
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                </button>
                <button className="px-8 py-4 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold text-lg hover:bg-gray-50 transition-all duration-300">
                  观看演示
                </button>
              </div>
            </div>

            {/* 统计数据 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {stats.map((stat, index) => (
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
            <h3 className="text-3xl font-bold mb-4 text-gray-900">AI智能助手</h3>
            <p className="text-gray-600 text-lg">与AI探讨您的藏书，获得专业建议</p>
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
                            <p className="text-sm text-gray-800">您好！我看到您的藏书中有很多技术类书籍，建议您可以按编程语言分类整理，这样查找会更方便。</p>
                          </div>
                        </div>

                        {/* 用户消息 */}
                        <div className="flex items-start space-x-3 justify-end">
                          <div className="bg-blue-600 rounded-2xl rounded-tr-md p-4 max-w-xs">
                            <p className="text-sm text-white">好的，那我的文学类书籍应该怎么分类呢？</p>
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
                            <p className="text-sm text-gray-800">文学类可以按体裁分类：小说、散文、诗歌，或者按作者国籍分类。我注意到您有《百年孤独》，建议按拉美文学归类。</p>
                          </div>
                        </div>

                        {/* 用户消息 */}
                        <div className="flex items-start space-x-3 justify-end">
                          <div className="bg-blue-600 rounded-2xl rounded-tr-md p-4 max-w-xs">
                            <p className="text-sm text-white">太棒了！能帮我生成一个分类标签吗？</p>
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
                            <p className="text-sm text-gray-800">当然！我为您生成了"拉美文学"标签，已自动应用到相关书籍。您还可以创建更多自定义标签。</p>
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
            <h3 className="text-3xl font-bold mb-4 text-gray-900">书籍管理界面</h3>
            <p className="text-gray-600 text-lg">直观易用的图书管理体验</p>
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
                          <h1 className="text-lg font-semibold text-gray-900">我的藏书</h1>
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                              <Library className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm text-gray-600">127本</span>
                          </div>
                        </div>
                      </div>

                      {/* 搜索栏 */}
                      <div className="p-4 bg-white">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input 
                            type="text" 
                            placeholder="搜索书籍..." 
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      {/* 分类标签 */}
                      <div className="px-4 pb-3 bg-white">
                        <div className="flex space-x-2 overflow-x-auto">
                          <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium whitespace-nowrap">全部</span>
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium whitespace-nowrap">技术类</span>
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium whitespace-nowrap">文学类</span>
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium whitespace-nowrap">管理类</span>
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
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded">技术类</span>
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
                                <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded">文学类</span>
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
                                <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-xs rounded">管理类</span>
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
            <h3 className="text-3xl font-bold mb-4 text-gray-900">核心功能</h3>
            <p className="text-gray-600 text-lg">专业级家庭图书馆管理解决方案</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
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
            <h3 className="text-3xl font-bold mb-4 text-gray-900">选择方案</h3>
            <p className="text-gray-600 text-lg">灵活定价，满足不同需求</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index}
                className={`relative p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                  plan.popular ? 'border-blue-500 shadow-lg' : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      推荐
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
                    {plan.features.map((feature, featureIndex) => (
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
                    选择方案
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
            <h3 className="text-3xl font-bold mb-4 text-gray-900">产品特色</h3>
            <p className="text-gray-600 text-lg">专为家庭图书管理设计的创新平台</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement, index) => (
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
            <h3 className="text-3xl font-bold mb-4 text-gray-900">数据洞察</h3>
            <p className="text-gray-600 text-lg">基于真实数据的藏书管理分析</p>
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
                            <h4 className="font-semibold text-gray-900">藏书分布</h4>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">技术类</span>
                              <span className="text-sm font-semibold">35%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div className="bg-blue-600 h-1.5 rounded-full" style={{width: '35%'}}></div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">文学类</span>
                              <span className="text-sm font-semibold">28%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div className="bg-green-600 h-1.5 rounded-full" style={{width: '28%'}}></div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">管理类</span>
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
                            <h4 className="font-semibold text-gray-900">阅读统计</h4>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600 mb-1">127</div>
                              <div className="text-xs text-gray-600">本月新增</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600 mb-1">4.2</div>
                              <div className="text-xs text-gray-600">周均阅读</div>
                            </div>
                          </div>
                        </div>

                        {/* 收藏趋势 */}
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                          <div className="flex items-center mb-3">
                            <Activity className="w-5 h-5 text-purple-600 mr-2" />
                            <h4 className="font-semibold text-gray-900">收藏趋势</h4>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">本月收藏</span>
                              <span className="text-sm font-semibold text-purple-600">+15本</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">最受欢迎</span>
                              <span className="text-sm font-semibold text-gray-900">技术类</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">平均评分</span>
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
          <h3 className="text-4xl font-bold mb-6">开始您的智能家庭图书馆管理之旅</h3>
          <p className="text-xl text-blue-100 mb-12">加入数万用户的选择，体验专业级藏书管理</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-12 py-4 bg-white text-blue-600 rounded-lg font-semibold text-xl hover:bg-gray-100 transition-all duration-300 shadow-lg">
              立即开始
              <ArrowRight className="w-6 h-6 ml-2 inline" />
            </button>
            <div className="text-blue-200 text-sm">
              <Star className="w-4 h-4 inline mr-1" />
              免费试用，无需信用卡
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}