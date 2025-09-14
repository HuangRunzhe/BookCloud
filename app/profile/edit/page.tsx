'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, Save, Upload, User as UserIcon } from 'lucide-react'
import Link from 'next/link'
import { getBackendUrl } from '@/lib/utils'

interface UserProfile {
  id: number
  username: string
  email: string
  nickname?: string
  avatar?: string
  gender?: string
  age?: number
  bio?: string
  location?: string
  is_admin: boolean
}

export default function EditProfilePage() {
  const router = useRouter()
  const { user, token, refreshUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    nickname: '',
    avatar: '',
    gender: '',
    age: '',
    bio: '',
    location: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        nickname: user.nickname || '',
        avatar: user.avatar || '',
        gender: user.gender || '',
        age: user.age?.toString() || '',
        bio: user.bio || '',
        location: user.location || ''
      })
    } else {
      router.push('/login')
    }
  }, [user, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const updateData = {
        nickname: formData.nickname || null,
        avatar: formData.avatar || null,
        gender: formData.gender || null,
        age: formData.age ? parseInt(formData.age) : null,
        bio: formData.bio || null,
        location: formData.location || null
      }

      const response = await fetch(`${getBackendUrl()}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      })

      if (response.ok) {
        // 更新成功后刷新用户信息并重定向到个人主页
        await refreshUser()
        router.push('/profile')
      } else {
        const errorData = await response.json()
        console.error('更新失败:', errorData)
        alert(`更新失败: ${errorData.detail || '请重试'}`)
      }
    } catch (error) {
      console.error('更新失败:', error)
      alert('更新失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/profile"
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">编辑个人资料</h1>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* 头像 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  头像
                </label>
                <div className="flex items-center space-x-4">
                  {formData.avatar ? (
                    <img
                      src={formData.avatar}
                      alt="头像预览"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <UserIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  
                  <div>
                    <input
                      type="url"
                      name="avatar"
                      value={formData.avatar}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="输入头像URL"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      请输入图片URL地址
                    </p>
                  </div>
                </div>
              </div>

              {/* 基本信息 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    昵称
                  </label>
                  <input
                    type="text"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="请输入昵称"
                    maxLength={50}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    性别
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="">请选择</option>
                    <option value="男">男</option>
                    <option value="女">女</option>
                    <option value="其他">其他</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    年龄
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="请输入年龄"
                    min="0"
                    max="150"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    所在地
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="请输入所在地"
                    maxLength={100}
                  />
                </div>
              </div>

              {/* 个人简介 */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  个人简介
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="input-field"
                  placeholder="介绍一下自己..."
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.bio.length}/500
                </p>
              </div>
            </div>

            {/* 提交按钮 */}
            <div className="flex justify-end space-x-4">
              <Link
                href="/profile"
                className="btn-secondary"
              >
                取消
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{saving ? '保存中...' : '保存'}</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
