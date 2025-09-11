import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

export const metadata: Metadata = {
  title: '书云 - 智能图书管理系统 | 藏书管理、AI推荐、批量操作',
  description: '书云是专业的个人图书管理系统，支持藏书管理、AI智能推荐、批量添加、阅读统计等功能。让您的图书收藏管理更简单高效。',
  keywords: '图书管理,藏书管理,个人图书馆,图书收藏,AI推荐,阅读统计,图书分类,电子书管理,图书数据库',
  authors: [{ name: '书云团队' }],
  creator: '书云',
  publisher: '书云',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://bc.aikits.sbs'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: '书云 - 智能图书管理系统',
    description: '专业的个人图书管理系统，支持藏书管理、AI推荐、批量操作等功能',
    url: 'https://bc.aikits.sbs',
    siteName: '书云',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '书云 - 智能图书管理系统',
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '书云 - 智能图书管理系统',
    description: '专业的个人图书管理系统，支持藏书管理、AI推荐、批量操作等功能',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="font-sans">
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
