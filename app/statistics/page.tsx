'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts'
import { 
  BookOpen, 
  TrendingUp, 
  Calendar, 
  User, 
  Star,
  Clock,
  Target,
  Award,
  Brain,
  MessageSquare
} from 'lucide-react'
import Link from 'next/link'

interface DetailedStats {
  total_books: number
  read_books: number
  unread_books: number
  reading_progress: number
  category_stats: { [key: string]: number }
  author_stats: { [key: string]: number }
  year_stats: { [key: string]: number }
  recent_books: number
  reading_goals: {
    monthly_goal: number
    yearly_goal: number
    current_month: number
    current_year: number
  }
  top_categories: Array<{ name: string; count: number; percentage: number }>
  top_authors: Array<{ name: string; count: number; percentage: number }>
  reading_trends: Array<{ month: string; books_read: number; books_added: number }>
  ai_insights: string
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C']

export default function StatisticsPage() {
  const router = useRouter()
  const { user, refreshUser } = useAuth()
  const [stats, setStats] = useState<DetailedStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [aiInsights, setAiInsights] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    if (user) {
      loadDetailedStats()
    } else {
      router.push('/login')
    }
  }, [user, router])

  const loadDetailedStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const apiBaseUrl = window.location.hostname === 'localhost' ? 'http://localhost:8000' : 
        window.location.hostname === 'bc.aikits.sbs' ? 'https://bcbk.aikits.sbs' :
        window.location.hostname === 'bcbk.aikits.sbs' ? 'https://bcbk.aikits.sbs' :
        `${window.location.protocol}//${window.location.hostname}:8000`
      
      const response = await fetch(`${apiBaseUrl}/stats/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        
        // 计算百分比和趋势数据
        const totalBooks = data.total_books
        const topCategories = Object.entries(data.category_stats || {})
          .map(([name, count]) => ({
            name,
            count: count as number,
            percentage: totalBooks > 0 ? Math.round((count as number / totalBooks) * 100) : 0
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 8)

        const topAuthors = Object.entries(data.author_stats || {})
          .map(([name, count]) => ({
            name,
            count: count as number,
            percentage: totalBooks > 0 ? Math.round((count as number / totalBooks) * 100) : 0
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10)

        // 生成阅读趋势数据（模拟最近12个月）
        const readingTrends = generateReadingTrends(data)

        const detailedStats: DetailedStats = {
          ...data,
          top_categories: topCategories,
          top_authors: topAuthors,
          reading_trends: readingTrends,
          reading_goals: {
            monthly_goal: 5,
            yearly_goal: 50,
            current_month: data.recent_books || 0,
            current_year: data.read_books || 0
          },
          ai_insights: ''
        }

        setStats(detailedStats)
        
        // 优先使用缓存的AI洞察，但如果没有则生成新的
        if (user?.ai_insights) {
          console.log('使用缓存的AI洞察')
          setAiInsights(user.ai_insights)
        } else {
          console.log('生成新的AI洞察')
          generateAIInsights(detailedStats)
        }
      }
    } catch (error) {
      console.error('加载统计失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateReadingTrends = (data: any) => {
    const trends = []
    const currentDate = new Date()
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const month = date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short' })
      
      // 模拟数据，实际应该从数据库获取
      const booksRead = Math.floor(Math.random() * 8) + 1
      const booksAdded = Math.floor(Math.random() * 12) + 2
      
      trends.push({
        month,
        books_read: booksRead,
        books_added: booksAdded
      })
    }
    
    return trends
  }

  const generateAIInsights = async (stats: DetailedStats) => {
    console.log('开始生成AI洞察')
    setAiLoading(true)
    try {
      const token = localStorage.getItem('token')
      const apiBaseUrl = window.location.hostname === 'localhost' ? 'http://localhost:8000' : 
        window.location.hostname === 'bc.aikits.sbs' ? 'https://bcbk.aikits.sbs' :
        window.location.hostname === 'bcbk.aikits.sbs' ? 'https://bcbk.aikits.sbs' :
        `${window.location.protocol}//${window.location.hostname}:8000`
      
      const response = await fetch(`${apiBaseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          question: `请分析我的阅读数据并给出详细的阅读建议和洞察：

总藏书：${stats.total_books}本
已读：${stats.read_books}本
未读：${stats.unread_books}本
阅读进度：${stats.reading_progress}%

热门分类：${stats.top_categories.slice(0, 5).map(c => `${c.name}(${c.count}本)`).join('、')}
热门作者：${stats.top_authors.slice(0, 5).map(a => `${a.name}(${a.count}本)`).join('、')}

请从以下角度分析：
1. 阅读习惯分析
2. 阅读偏好总结
3. 阅读建议和优化方向
4. 推荐阅读计划
5. 知识结构建议

请用专业但易懂的语言，给出具体可执行的建议。`
        })
      })

      if (response.ok) {
        const data = await response.json()
        let insights = data.answer
        
        // 清理可能被包装在代码块中的内容
        insights = insights.replace(/```markdown\n([\s\S]*?)\n```/g, '$1')
        insights = insights.replace(/```mermaid\n([\s\S]*?)\n```/g, '') // 移除Mermaid图表
        insights = insights.replace(/```\n([\s\S]*?)\n```/g, (match: string, content: string) => {
          // 如果内容包含表格语法，则提取出来
          if (content.includes('|') && content.includes('---')) {
            return content
          }
          // 如果是Mermaid图表，移除
          if (content.includes('mermaid') || content.includes('radarChart') || content.includes('graph')) {
            return ''
          }
          return match
        })
        
        // 清理行内的Mermaid代码
        insights = insights.replace(/mermaid\s+radarChart[\s\S]*?(?=\n\n|\n$|$)/g, '')
        insights = insights.replace(/```[\s\S]*?```/g, '') // 移除剩余的代码块
        
        // 清理多余的空行
        insights = insights.replace(/\n\s*\n\s*\n/g, '\n\n')
        
        setAiInsights(insights)
        
        // 保存AI洞察到后端
        try {
          await fetch(`${apiBaseUrl}/auth/ai-insights`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ insights })
          })
          
          // 刷新用户数据以更新缓存
          await refreshUser()
        } catch (error) {
          console.error('保存AI洞察失败:', error)
        }
      }
    } catch (error) {
      console.error('AI分析失败:', error)
      setAiInsights('AI分析暂时不可用，请稍后重试。')
    } finally {
      setAiLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载统计数据中...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
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
                href="/"
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                返回首页
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* 页面标题 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">阅读统计</h1>
            <p className="text-gray-600">深入了解您的阅读习惯和偏好</p>
          </div>

          {/* 核心指标卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">总藏书</p>
                  <p className="text-3xl font-bold text-primary-600">{stats.total_books}</p>
                </div>
                <BookOpen className="h-8 w-8 text-primary-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">已读</p>
                  <p className="text-3xl font-bold text-green-600">{stats.read_books}</p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">阅读进度</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.reading_progress}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">本月新增</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.recent_books}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>

          {/* 图表区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* 分类分布饼图 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">藏书分类分布</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.top_categories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {stats.top_categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* 热门作者柱状图 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">热门作者</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.top_authors.slice(0, 8)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 阅读趋势 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">阅读趋势</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats.reading_trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="books_read" 
                  stackId="1" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  name="已读"
                />
                <Area 
                  type="monotone" 
                  dataKey="books_added" 
                  stackId="2" 
                  stroke="#82ca9d" 
                  fill="#82ca9d" 
                  name="新增"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* 阅读目标 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">月度目标</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>本月已读</span>
                    <span>{stats.reading_goals.current_month} / {stats.reading_goals.monthly_goal}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${Math.min((stats.reading_goals.current_month / stats.reading_goals.monthly_goal) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  还需阅读 {Math.max(stats.reading_goals.monthly_goal - stats.reading_goals.current_month, 0)} 本书完成月度目标
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">年度目标</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>本年已读</span>
                    <span>{stats.reading_goals.current_year} / {stats.reading_goals.yearly_goal}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${Math.min((stats.reading_goals.current_year / stats.reading_goals.yearly_goal) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  还需阅读 {Math.max(stats.reading_goals.yearly_goal - stats.reading_goals.current_year, 0)} 本书完成年度目标
                </p>
              </div>
            </div>
          </div>

          {/* AI 阅读洞察 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-6 w-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">AI 阅读洞察</h3>
              </div>
              <button
                onClick={() => stats && generateAIInsights(stats)}
                disabled={aiLoading}
                className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {aiLoading ? '生成中...' : '重新生成'}
              </button>
            </div>
            
            {aiLoading ? (
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                <span>AI正在分析您的阅读数据...</span>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed overflow-auto">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-4">
                        <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-gray-50">
                        {children}
                      </thead>
                    ),
                    tbody: ({ children }) => (
                      <tbody className="bg-white divide-y divide-gray-200">
                        {children}
                      </tbody>
                    ),
                    tr: ({ children }) => (
                      <tr className="hover:bg-gray-50">
                        {children}
                      </tr>
                    ),
                    th: ({ children }) => (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                        {children}
                      </td>
                    )
                  }}
                >
                  {aiInsights || '正在生成AI洞察...'}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
