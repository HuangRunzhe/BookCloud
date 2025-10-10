'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Book, ReadingSession, ReadingStats } from '@/types'
import { getBook, deleteBook } from '@/lib/api'
import { startReading, stopReading, getReadingStats, addReadingManual } from '@/lib/api'
import { ArrowLeft, Edit, Trash2, BookOpen, Calendar, Tag, User } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { getImageUrl, getThumbUrl } from '@/lib/utils'

export default function BookDetail() {
  const params = useParams()
  const router = useRouter()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [activeSession, setActiveSession] = useState<ReadingSession | null>(null)
  const [stats, setStats] = useState<ReadingStats | null>(null)
  const [note, setNote] = useState('')
  const [tick, setTick] = useState(0)
  const [focusMode, setFocusMode] = useState(false)
  const [localStartMs, setLocalStartMs] = useState<number | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [showManual, setShowManual] = useState(false)
  const [manualH, setManualH] = useState<number>(0)
  const [manualM, setManualM] = useState<number>(0)
  const [manualS, setManualS] = useState<number>(0)
  const [manualDate, setManualDate] = useState<string>('')

  useEffect(() => {
    if (params.id) {
      loadBook()
      loadStats()
    }
  }, [params.id])

  // 计时器心跳（每秒刷新一次界面显示）
  useEffect(() => {
    if (!activeSession) return
    const timer = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(timer)
  }, [activeSession])

  // 进入页面时，若最近一条会话未结束，恢复本地计时
  useEffect(() => {
    const tryRestore = async () => {
      if (!params.id) return
      try {
        const s = await getReadingStats(Number(params.id))
        setStats(s)
        const ongoing = s.sessions.find((x) => !x.end_time)
        if (ongoing) {
          setActiveSession(ongoing)
          // 用服务端start_time恢复本地起点
          const t = Date.parse(ongoing.start_time)
          if (!isNaN(t)) setLocalStartMs(t)
          setFocusMode(true)
        }
      } catch (e) {
        // ignore
      }
    }
    tryRestore()
  }, [params.id])

  const loadBook = async () => {
    try {
      setLoading(true)
      const bookData = await getBook(Number(params.id))
      console.log('图书详情数据:', bookData)
      if (bookData.cover_image) {
        console.log('封面图片路径:', bookData.cover_image)
        console.log('缩略图URL:', getThumbUrl(bookData.cover_image))
        console.log('原图URL:', getImageUrl(bookData.cover_image))
      }
      setBook(bookData)
    } catch (error) {
      console.error('加载图书详情失败:', error)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const s = await getReadingStats(Number(params.id))
      setStats(s)
    } catch (e) {
      console.error('加载阅读统计失败:', e)
    }
  }

  const handleStart = async () => {
    try {
      const session = await startReading(Number(params.id), undefined)
      setActiveSession(session)
      setLocalStartMs(Date.now())
      setNote('')
      setFocusMode(true)
      await loadStats()
    } catch (e) {
      console.error('开始计时失败:', e)
      alert('开始计时失败，请重试')
    }
  }

  const handleStop = async () => {
    if (!activeSession) return
    try {
      const session = await stopReading(activeSession.id, undefined)
      setActiveSession(null)
      setLocalStartMs(null)
      setNote('')
      setFocusMode(false)
      await loadStats()
      
      // 通知首页更新统计数据
      window.dispatchEvent(new CustomEvent('readingStatsUpdated'))
    } catch (e: any) {
      console.error('停止计时失败:', e)
      const msg = e?.response?.data?.detail || '停止计时失败，请重试'
      // 小于1分钟的提示：不计入，但允许结束
      if (typeof msg === 'string' && msg.includes('再多坚持一下')) {
        setToast(msg)
        setTimeout(() => setToast(null), 2000)
        // 结束本地会话，不计入统计
        setActiveSession(null)
        setLocalStartMs(null)
        setFocusMode(false)
        await loadStats()
        
        // 通知首页更新统计数据
        window.dispatchEvent(new CustomEvent('readingStatsUpdated'))
      } else {
        setToast('停止计时失败，请重试')
        setTimeout(() => setToast(null), 2000)
      }
    }
  }

  const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`)
  const formatHMS = (seconds: number) => {
    const sec = Math.max(0, Math.floor(seconds || 0))
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    const s = sec % 60
    return `${pad2(h)}:${pad2(m)}:${pad2(s)}`
  }

  const getElapsedSeconds = () => {
    if (localStartMs) {
      return Math.max(0, Math.floor((Date.now() - localStartMs) / 1000))
    }
    if (activeSession) {
      const t = Date.parse(activeSession.start_time)
      if (!isNaN(t)) {
        return Math.max(0, Math.floor((Date.now() - t) / 1000))
      }
    }
    return 0
  }

  const handleDelete = async () => {
    if (!book || !confirm('确定要删除这本书吗？')) return
    
    try {
      setDeleting(true)
      await deleteBook(book.id)
      router.push('/')
    } catch (error) {
      console.error('删除失败:', error)
      alert('删除失败，请重试')
    } finally {
      setDeleting(false)
    }
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

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">图书不存在</p>
          <Link href="/" className="btn-primary mt-4">
            返回首页
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {toast && (
          <div className="fixed top-4 inset-x-0 z-50 flex justify-center">
            <div className="bg-yellow-100 border border-yellow-300 text-yellow-900 px-4 py-2 rounded shadow animate-fade-in-fast">
              {toast}
            </div>
          </div>
        )}
        <div className="max-w-4xl mx-auto">
          {/* 头部 */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>返回首页</span>
            </Link>
            
            <div className="flex items-center space-x-2">
              <Link
                href={`/book/${book.id}/edit`}
                className="btn-secondary flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>编辑</span>
              </Link>
              
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                <span>{deleting ? '删除中...' : '删除'}</span>
              </button>
            </div>
          </div>

          {/* 图书详情 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
              {/* 封面 */}
              <div className="lg:col-span-1">
                <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                  {book.cover_image ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={getImageUrl(book.cover_image)}
                        alt={book.title}
                        width={600}
                        height={800}
                        quality={90}
                        unoptimized
                        priority
                        sizes="(max-width: 1024px) 80vw, 400px"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('图片加载失败:', e)
                          const target = e.target as HTMLImageElement
                          const original = getImageUrl(book.cover_image)
                          // 原图也失败则降级为原生img（避免Image优化器缓存）
                          const fallbackImg = document.createElement('img')
                          fallbackImg.src = original
                          fallbackImg.alt = book.title
                          fallbackImg.className = 'w-full h-full object-cover'
                          target.parentNode?.replaceChild(fallbackImg, target)
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="h-24 w-24 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* 图书信息 */}
              <div className="lg:col-span-2 space-y-6">
                {/* 阅读计时器 */}
                <div className={`rounded-lg border p-4 ${focusMode ? 'bg-blue-50 border-blue-200' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600">今日阅读</div>
                      <div className="text-xl font-semibold">{formatHMS((stats?.today_seconds ?? 0) + (activeSession ? getElapsedSeconds() : 0))}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 text-right">总计</div>
                      <div className="text-xl font-semibold text-right">{formatHMS(stats?.total_seconds ?? 0)}</div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <button onClick={() => setShowManual(true)} className="text-sm text-gray-600 hover:text-gray-900 underline">手动录入</button>
                    {activeSession ? (
                      <button onClick={handleStop} className="btn-danger whitespace-nowrap">结束阅读</button>
                    ) : (
                      <button onClick={handleStart} className="btn-success whitespace-nowrap">开始阅读</button>
                    )}
                  </div>
                  {activeSession && (
                    <div className="mt-4">
                      <div className="text-center text-4xl font-bold text-blue-700">{formatHMS(getElapsedSeconds())}</div>
                      <div className="text-center text-sm text-gray-600 mt-1">专注时间</div>
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {book.title}
                  </h1>
                  
                  <div className="flex items-center space-x-4 text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{book.author}</span>
                    </div>
                    
                    {book.published_date && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(book.published_date).getFullYear()}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-4">
                    {book.category && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                        <Tag className="h-3 w-3 mr-1" />
                        {book.category}
                      </span>
                    )}
                    
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      book.status === '已读' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {book.status}
                    </span>
                  </div>
                </div>

                {/* 详细信息 */}
                <div className="space-y-4">

                  {book.description && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">图书描述</h3>
                      <p className="text-gray-900 leading-relaxed">
                        {book.description}
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">添加时间：</span>
                        <span>{new Date(book.created_at).toLocaleDateString('zh-CN')}</span>
                      </div>
                      {book.updated_at && (
                        <div>
                          <span className="font-medium">更新时间：</span>
                          <span>{new Date(book.updated_at).toLocaleDateString('zh-CN')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 专注模式全屏层 */}
        {focusMode && book && (
          <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm animate-fade-in-fast">
            <div className="absolute top-4 left-4">
              <button onClick={handleStop} className="btn-danger">结束阅读</button>
            </div>
            <div className="h-full w-full flex flex-col items-center justify-center p-6">
              <div className="w-56 h-72 sm:w-64 sm:h-96 rounded-xl overflow-hidden shadow-lg border bg-gray-100 animate-scale-in">
                <img src={getImageUrl(book.cover_image)} alt={book.title} className="w-full h-full object-cover" />
              </div>
              <h1 className="mt-6 text-2xl sm:text-3xl font-bold text-gray-900 text-center px-4 line-clamp-2">{book.title}</h1>
              <div className="mt-2 text-gray-600">{book.author}</div>
              <div className="mt-8 text-5xl sm:text-6xl font-extrabold text-blue-700 tracking-wider animate-pulse-slow">
                {formatHMS(getElapsedSeconds())}
              </div>
              <div className="mt-2 text-sm text-gray-500">专注时间</div>
            </div>
          </div>
        )}

        {/* 手动录入弹层 */}
        {showManual && (
          <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">手动录入阅读时长</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">日期（可选）</label>
                  <input type="date" value={manualDate} onChange={(e) => setManualDate(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">时长（码表）</label>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">小时</div>
                      <select value={manualH} onChange={(e) => setManualH(Number(e.target.value))} className="input-field h-32 overflow-auto">
                        {Array.from({ length: 24 }).map((_, i) => (
                          <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">分钟</div>
                      <select value={manualM} onChange={(e) => setManualM(Number(e.target.value))} className="input-field h-32 overflow-auto">
                        {Array.from({ length: 60 }).map((_, i) => (
                          <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">秒</div>
                      <select value={manualS} onChange={(e) => setManualS(Number(e.target.value))} className="input-field h-32 overflow-auto">
                        {Array.from({ length: 60 }).map((_, i) => (
                          <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <button onClick={() => setShowManual(false)} className="btn-secondary">取消</button>
                <button
                  onClick={async () => {
                    try {
                      if (!book) return
                      const secs = Math.max(0, manualH * 3600 + manualM * 60 + manualS)
                      if (secs < 60) {
                        setToast('最少1分钟')
                        setTimeout(() => setToast(null), 1500)
                        return
                      }
                      await addReadingManual(book.id, secs, manualDate || undefined)
                      setShowManual(false)
                      setManualH(0); setManualM(0); setManualS(0)
                      setManualDate('')
                      await loadStats()
                      
                      // 通知首页更新统计数据
                      window.dispatchEvent(new CustomEvent('readingStatsUpdated'))
                      
                      setToast('已录入阅读时长')
                      setTimeout(() => setToast(null), 1500)
                    } catch (e) {
                      setToast('录入失败，请重试')
                      setTimeout(() => setToast(null), 1500)
                    }
                  }}
                  className="btn-primary"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
