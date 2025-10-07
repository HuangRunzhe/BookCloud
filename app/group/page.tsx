'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function GroupPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl shadow p-6 md:p-8">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">用户交流群</h1>
            <p className="text-gray-600 mt-2">扫码加入群聊，获取最新更新与交流</p>
          </div>
          <div className="mt-8 flex justify-center">
            <div className="bg-gray-50 p-6 rounded-xl border">
              <Image src="/Group1QR.png" alt="用户交流群二维码" width={300} height={300} className="rounded-md" />
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link href="/" className="text-blue-600 hover:underline">返回首页</Link>
          </div>
        </div>
      </div>
    </div>
  )
}


