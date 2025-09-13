'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import PermissionGuard from '@/components/PermissionGuard'

interface Payment {
  id: number
  user_id: number
  amount: number
  payment_type: string
  status: string
  payment_method?: string
  transaction_id?: string
  qr_code_url?: string
  paid_at?: string
  expires_at?: string
  created_at: string
}

export default function PaymentPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | null>(null)
  const [selectedMethod, setSelectedMethod] = useState<'wechat' | 'alipay' | null>(null)
  const [currentPayment, setCurrentPayment] = useState<Payment | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    fetchPayments()
  }, [user, router])

  const getApiBaseUrl = () => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:8000'
      } else if (hostname === 'bc.aikits.sbs') {
        return 'https://bcbk.aikits.sbs'
      } else if (hostname === 'bcbk.aikits.sbs') {
        return 'https://bcbk.aikits.sbs'
      } else {
        return `https://${hostname}:8000`
      }
    }
    return 'http://localhost:8000'
  }

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${getApiBaseUrl()}/payments/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPayments(data)
      }
    } catch (error) {
      console.error('获取支付记录失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const createPayment = async (paymentType: string, paymentMethod: string) => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/payments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          payment_type: paymentType,
          payment_method: paymentMethod
        })
      })

      if (response.ok) {
        const payment = await response.json()
        setCurrentPayment(payment)
        setShowPaymentModal(true)
        await fetchPayments()
      } else {
        alert('创建支付订单失败')
      }
    } catch (error) {
      console.error('创建支付订单失败:', error)
      alert('创建支付订单失败')
    }
  }

  const handlePayment = (plan: 'monthly' | 'yearly', method: 'wechat' | 'alipay') => {
    setSelectedPlan(plan)
    setSelectedMethod(method)
    createPayment(plan, method)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN')
  }

  const getPaymentStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'PENDING': '待支付',
      'PAID': '已支付',
      'EXPIRED': '已过期',
      'CANCELLED': '已取消'
    }
    return statusMap[status] || status
  }

  const getMembershipStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'FREE': '免费用户',
      'MONTHLY': '月费会员',
      'YEARLY': '年费会员',
      'LIFETIME': '终身会员'
    }
    return statusMap[status] || status
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <PermissionGuard>
      <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 当前会员状态 */}
        <div className="card-elevated mb-8 animate-fade-in">
          <div className="px-8 py-6 border-b border-secondary-100">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold gradient-text mb-2">💎 会员中心</h1>
                <p className="text-secondary-600">管理您的会员状态和支付记录</p>
              </div>
              <Link
                href="/"
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>返回首页</span>
              </Link>
            </div>
          </div>
          <div className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-secondary-800 mb-2">当前状态</h2>
                <div className="flex items-center space-x-3">
                  <span className={`badge ${
                    user?.membership_status === 'FREE' ? 'badge-secondary' :
                    user?.membership_status === 'MONTHLY' ? 'badge-primary' :
                    user?.membership_status === 'YEARLY' ? 'badge-success' :
                    'badge-warning'
                  }`}>
                    {getMembershipStatusText(user?.membership_status || 'FREE')}
                  </span>
                  {user?.membership_expires_at && (
                    <span className="text-sm text-secondary-500">
                      到期时间: {formatDate(user.membership_expires_at)}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-secondary-600 mb-1">图书数量</p>
                <p className="text-3xl font-bold text-primary-600">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* 会员套餐 */}
        <div className="card-elevated mb-8 animate-fade-in">
          <div className="px-8 py-6 border-b border-secondary-100">
            <h2 className="text-2xl font-bold gradient-text mb-2">🎯 选择会员套餐</h2>
            <p className="text-secondary-600">升级会员享受更多功能</p>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 月费套餐 */}
              <div className="card p-8 hover:shadow-glow transition-all duration-300 group cursor-pointer">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-secondary-800 mb-2">月费会员</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-primary-600">¥12.9</span>
                    <span className="text-secondary-600 text-lg">/月</span>
                  </div>
                  <p className="text-secondary-600 mb-6">适合短期使用</p>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={() => handlePayment('monthly', 'wechat')}
                    className="btn-success w-full text-base py-3"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8.5 12.5h2.5v-2.5H8.5v2.5zm0-5h2.5v-2.5H8.5v2.5zm5 5h2.5v-2.5h-2.5v2.5zm0-5h2.5v-2.5h-2.5v2.5z"/>
                    </svg>
                    微信支付
                  </button>
                  <button
                    onClick={() => handlePayment('monthly', 'alipay')}
                    className="btn-primary w-full text-base py-3"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    支付宝
                  </button>
                </div>
              </div>

              {/* 年费套餐 */}
              <div className="card p-8 hover:shadow-glow-success transition-all duration-300 group cursor-pointer relative border-2 border-success-200">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-success-500 to-success-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg">🔥 推荐</span>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-success-100 to-success-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-secondary-800 mb-2">年费会员</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-success-600">¥129</span>
                    <span className="text-secondary-600 text-lg">/年</span>
                  </div>
                  <p className="text-secondary-600 mb-6">相当于月费8折，更划算</p>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={() => handlePayment('yearly', 'wechat')}
                    className="btn-success w-full text-base py-3"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8.5 12.5h2.5v-2.5H8.5v2.5zm0-5h2.5v-2.5H8.5v2.5zm5 5h2.5v-2.5h-2.5v2.5zm0-5h2.5v-2.5h-2.5v2.5z"/>
                    </svg>
                    微信支付
                  </button>
                  <button
                    onClick={() => handlePayment('yearly', 'alipay')}
                    className="btn-primary w-full text-base py-3"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    支付宝
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 支付记录 */}
        <div className="card-elevated animate-fade-in">
          <div className="px-8 py-6 border-b border-secondary-100">
            <h2 className="text-2xl font-bold gradient-text mb-2">📋 支付记录</h2>
            <p className="text-secondary-600">查看您的所有支付历史</p>
          </div>
          <div className="p-8">
            {payments.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-secondary-700 mb-2">暂无支付记录</h3>
                <p className="text-secondary-500">您还没有进行过任何支付</p>
              </div>
            ) : (
              <div className="overflow-x-auto scrollbar-thin">
                <table className="min-w-full divide-y divide-secondary-200">
                  <thead className="bg-gradient-to-r from-secondary-50 to-primary-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">
                        订单号
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">
                        金额
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">
                        类型
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">
                        支付方式
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">
                        状态
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase tracking-wider">
                        创建时间
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/50 divide-y divide-secondary-200">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-primary-50/50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-secondary-800">
                          #{payment.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary-600">
                          ¥{payment.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-700">
                          {payment.payment_type === 'monthly' ? '月费' : '年费'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-700">
                          {payment.payment_method === 'wechat' ? '微信支付' : '支付宝'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`badge ${
                            payment.status === 'PAID' ? 'badge-success' :
                            payment.status === 'PENDING' ? 'badge-warning' :
                            payment.status === 'EXPIRED' ? 'badge-danger' :
                            'badge-secondary'
                          }`}>
                            {getPaymentStatusText(payment.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                          {formatDate(payment.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* 支付模态框 */}
        {showPaymentModal && currentPayment && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-md card-elevated animate-scale-in">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold gradient-text">
                    {selectedPlan === 'monthly' ? '月费会员' : '年费会员'} - 支付
                  </h3>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="text-secondary-400 hover:text-secondary-600 transition-colors duration-200 p-1 hover:bg-secondary-100 rounded-lg"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-primary-600">¥{currentPayment.amount}</span>
                  </div>
                  <p className="text-secondary-600 text-lg">
                    支付方式: {selectedMethod === 'wechat' ? '微信支付' : '支付宝'}
                  </p>
                </div>

                <div className="text-center mb-8">
                  <p className="text-secondary-600 mb-6">请使用{selectedMethod === 'wechat' ? '微信' : '支付宝'}扫描下方二维码完成支付</p>
                  {currentPayment.qr_code_url && (
                    <div className="flex justify-center">
                      <div className="p-4 bg-white rounded-2xl shadow-medium">
                        <img
                          src={currentPayment.qr_code_url}
                          alt="支付二维码"
                          width={200}
                          height={200}
                          className="rounded-xl"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-r from-warning-50 to-warning-100 border border-warning-200 rounded-2xl p-6 mb-8">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-warning-100 rounded-full flex items-center justify-center">
                        <svg className="h-5 w-5 text-warning-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-semibold text-warning-800">
                        支付完成后，会员状态将自动更新。如遇问题请联系客服。
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="btn-secondary px-6 py-3"
                  >
                    关闭
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </PermissionGuard>
  )
}
