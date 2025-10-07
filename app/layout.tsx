import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { LanguageProvider } from '@/contexts/LanguageContext'

export const metadata: Metadata = {
  title: '书云 - AI驱动的家庭藏书管理系统 | 智能分析、全平台支持、终身免费',
  description: '书云是专业的家庭藏书管理平台，融合AI技术提供智能分析、阅读建议和个性化推荐。支持全平台使用，前50名用户终身免费。让您的家庭图书馆管理更智能高效。',
  keywords: '家庭藏书管理,AI图书分析,智能图书馆,藏书统计,阅读分析,图书推荐,家庭图书馆,AI助手,藏书分类,阅读习惯分析,图书收藏管理,智能推荐系统',
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
    title: '书云 - AI驱动的家庭藏书管理系统',
    description: '专业的家庭藏书管理平台，融合AI技术提供智能分析、阅读建议和个性化推荐。前50名用户终身免费。',
    url: 'https://bc.aikits.sbs',
    siteName: '书云',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '书云 - AI驱动的家庭藏书管理系统',
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '书云 - AI驱动的家庭藏书管理系统',
    description: '专业的家庭藏书管理平台，融合AI技术提供智能分析、阅读建议和个性化推荐。前50名用户终身免费。',
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
        <LanguageProvider>
          <AuthProvider>
            <div className="min-h-screen bg-gray-50">
              {children}
            </div>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
