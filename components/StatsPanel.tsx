'use client'

import { Stats } from '@/types'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts'

interface StatsPanelProps {
  stats: Stats
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316']

const formatHMS = (seconds: number) => {
  const sec = Math.max(0, Math.floor(seconds || 0))
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export default function StatsPanel({ stats }: StatsPanelProps) {
  const categoryData = Object.entries(stats.category_stats).map(([name, value]) => ({
    name,
    value
  }))

  const statusData = [
    { name: '已读', value: stats.read_books, color: '#10b981' },
    { name: '未读', value: stats.unread_books, color: '#f59e0b' }
  ]

  const authorData = Object.entries(stats.author_stats).slice(0, 5).map(([name, value]) => ({
    name: name.length > 8 ? name.substring(0, 8) + '...' : name,
    value
  }))

  const yearData = Object.entries(stats.year_stats)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(([year, count]) => ({
      year: parseInt(year),
      count
    }))

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">藏书统计</h3>
      
      {/* 总体统计 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-semibold text-gray-900">
            {stats.total_books}
          </div>
          <div className="text-sm text-gray-600">总藏书</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-gray-900">
            {stats.read_books}
          </div>
          <div className="text-sm text-gray-600">已读</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-gray-900">
            {stats.recent_books}
          </div>
          <div className="text-sm text-gray-600">近30天新增</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-gray-900">
            {stats.reading_progress}%
          </div>
          <div className="text-sm text-gray-600">阅读进度</div>
        </div>
      </div>

      {/* 阅读时长统计 */}
      {(stats.total_read_seconds !== undefined || stats.today_read_seconds !== undefined) && (
        <div className="mb-6 p-4 bg-gray-50 rounded-md">
          <h4 className="text-sm font-medium text-gray-700 mb-3">阅读时长</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-xl font-semibold text-gray-900">
                {formatHMS(stats.today_read_seconds ?? 0)}
              </div>
              <div className="text-sm text-gray-600">今日阅读</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold text-gray-900">
                {formatHMS(stats.total_read_seconds ?? 0)}
              </div>
              <div className="text-sm text-gray-600">总阅读时长</div>
            </div>
          </div>
        </div>
      )}

      {/* 阅读状态饼图 */}
      {stats.total_books > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">阅读状态</h4>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 热门作者 */}
      {authorData.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">热门作者</h4>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={authorData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={60}
                fontSize={10}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 出版年份趋势 */}
      {yearData.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">出版年份分布</h4>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={yearData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 分类统计 */}
      {categoryData.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">分类统计</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={60}
                fontSize={12}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {stats.total_books === 0 && (
        <div className="text-center text-gray-500 py-8">
          <p>暂无数据</p>
          <p className="text-sm mt-1">添加图书后查看统计</p>
        </div>
      )}
    </div>
  )
}
