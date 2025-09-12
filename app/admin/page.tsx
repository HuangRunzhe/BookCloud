'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import PermissionGuard from '@/components/PermissionGuard'

interface User {
  id: number
  username: string
  email: string
  nickname?: string
  is_active: boolean
  is_admin: boolean
  membership_status: string
  membership_expires_at?: string
  can_use_system: boolean
  created_at: string
  book_count: number
}

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

export default function AdminPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'users' | 'payments'>('users')
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null)
  const [transactionId, setTransactionId] = useState('')

  // 检查管理员权限
  useEffect(() => {
    if (!user || !user.is_admin) {
      router.push('/')
      return
    }
    fetchData()
  }, [user, router])

  const getApiBaseUrl = () => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:8000'
      } else if (hostname === 'bc.aikits.sbs') {
        return 'http://bcbk.aikits.sbs'
      } else if (hostname === 'bcbk.aikits.sbs') {
        return 'http://bcbk.aikits.sbs'
      } else {
        return `http://${hostname}:8000`
      }
    }
    return 'http://localhost:8000'
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const [usersRes, paymentsRes] = await Promise.all([
        fetch(`${getApiBaseUrl()}/admin/users/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch(`${getApiBaseUrl()}/admin/payments/?page=1&page_size=100`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      ])

      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setUsers(usersData)
      }

      if (paymentsRes.ok) {
        const paymentsData = await paymentsRes.json()
        console.log('支付记录数据:', paymentsData)
        setPayments(paymentsData)
      } else {
        console.error('获取支付记录失败:', paymentsRes.status, await paymentsRes.text())
      }
    } catch (error) {
      console.error('获取数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateUserPermissions = async (userId: number, updates: Partial<User>) => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/admin/users/${userId}/permissions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        await fetchData()
        setEditingUser(null)
      } else {
        alert('更新失败')
      }
    } catch (error) {
      console.error('更新用户权限失败:', error)
      alert('更新失败')
    }
  }

  const updatePaymentStatus = async (paymentId: number, status: string) => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/admin/payments/${paymentId}/status?status=${status}&transaction_id=${transactionId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        await fetchData()
        setEditingPayment(null)
        setTransactionId('')
        alert('支付状态更新成功')
      } else {
        alert('更新失败')
      }
    } catch (error) {
      console.error('更新支付状态失败:', error)
      alert('更新失败')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN')
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

  const getPaymentStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'PENDING': '待支付',
      'PAID': '已支付',
      'EXPIRED': '已过期',
      'CANCELLED': '已取消'
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
    <PermissionGuard requireAdmin={true}>
      <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">管理员控制台</h1>
                <p className="mt-1 text-sm text-gray-600">管理用户权限和支付记录</p>
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

          {/* 标签页 */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                用户管理
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'payments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                支付记录
              </button>
            </nav>
          </div>

          {/* 用户管理 */}
          {activeTab === 'users' && (
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        用户信息
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        会员状态
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        权限状态
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        图书数量
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        注册时间
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.nickname || user.username}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.membership_status === 'FREE' ? 'bg-gray-100 text-gray-800' :
                            user.membership_status === 'MONTHLY' ? 'bg-blue-100 text-blue-800' :
                            user.membership_status === 'YEARLY' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {getMembershipStatusText(user.membership_status)}
                          </span>
                          {user.membership_expires_at && (
                            <div className="text-xs text-gray-500 mt-1">
                              到期: {formatDate(user.membership_expires_at)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.can_use_system ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.can_use_system ? '可使用' : '已禁用'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.book_count}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setEditingUser(user)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            编辑权限
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 支付记录 */}
          {activeTab === 'payments' && (
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600">共 {payments.length} 条支付记录</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        用户ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        金额
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        类型
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        支付方式
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        状态
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        创建时间
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payments.map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.user_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ¥{payment.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.payment_type === 'monthly' ? '月费' : '年费'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.payment_method === 'wechat' ? '微信支付' : '支付宝'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            payment.status === 'PAID' ? 'bg-green-100 text-green-800' :
                            payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            payment.status === 'EXPIRED' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {getPaymentStatusText(payment.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(payment.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setEditingPayment(payment)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              更新状态
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* 编辑用户权限模态框 */}
        {editingUser && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  编辑用户权限 - {editingUser.nickname || editingUser.username}
                </h3>
                <form onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.target as HTMLFormElement)
                  updateUserPermissions(editingUser.id, {
                    can_use_system: formData.get('can_use_system') === 'on',
                    membership_status: formData.get('membership_status') as string,
                    membership_expires_at: formData.get('membership_expires_at') as string || undefined
                  })
                }}>
                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="can_use_system"
                        defaultChecked={editingUser.can_use_system}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm text-gray-700">允许使用系统</span>
                    </label>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      会员状态
                    </label>
                    <select
                      name="membership_status"
                      defaultValue={editingUser.membership_status}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="FREE">免费用户</option>
                      <option value="MONTHLY">月费会员</option>
                      <option value="YEARLY">年费会员</option>
                      <option value="LIFETIME">终身会员</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      会员到期时间
                    </label>
                    <input
                      type="datetime-local"
                      name="membership_expires_at"
                      defaultValue={editingUser.membership_expires_at ? 
                        new Date(editingUser.membership_expires_at).toISOString().slice(0, 16) : ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setEditingUser(null)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      保存
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* 编辑支付状态模态框 */}
        {editingPayment && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  更新支付状态 - 订单 #{editingPayment.id}
                </h3>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    用户ID: {editingPayment.user_id} | 金额: ¥{editingPayment.amount} | 类型: {editingPayment.payment_type === 'monthly' ? '月费' : '年费'}
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    交易ID（可选）
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="输入交易ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPayment(null)
                      setTransactionId('')
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    取消
                  </button>
                  <button
                    onClick={() => updatePaymentStatus(editingPayment.id, '已支付')}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    标记为已支付
                  </button>
                  <button
                    onClick={() => updatePaymentStatus(editingPayment.id, '已取消')}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    标记为已取消
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
