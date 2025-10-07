'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { locales, type Locale, localeConfig } from '@/i18n'

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
  localeConfig: typeof localeConfig
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('zh')
  const router = useRouter()
  const pathname = usePathname()

  // 从 URL 路径中提取语言
  useEffect(() => {
    const pathSegments = pathname.split('/')
    const pathLocale = pathSegments[1] as Locale
    if (locales.includes(pathLocale)) {
      setLocaleState(pathLocale)
    } else {
      // 如果没有语言前缀，默认为中文
      setLocaleState('zh')
    }
  }, [pathname])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    
    // 更新 URL 路径
    const pathSegments = pathname.split('/')
    if (locales.includes(pathSegments[1] as Locale)) {
      pathSegments[1] = newLocale
    } else {
      // 如果没有语言前缀，添加语言前缀
      pathSegments.splice(1, 0, newLocale)
    }
    
    const newPath = pathSegments.join('/')
    router.push(newPath)
  }

  // 简单的翻译函数（实际项目中应该使用 next-intl）
  const t = (key: string): string => {
    // 这里可以添加更复杂的翻译逻辑
    // 暂时返回 key，实际使用时会被 next-intl 的 useTranslations 替换
    return key
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, localeConfig }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
