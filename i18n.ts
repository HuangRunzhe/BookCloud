import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

// 支持的语言列表
export const locales = ['zh', 'en'] as const
export type Locale = (typeof locales)[number]

// 默认语言
export const defaultLocale: Locale = 'zh'

// 语言配置
export const localeConfig = {
  zh: {
    name: '中文',
    flag: '🇨🇳',
    dir: 'ltr'
  },
  en: {
    name: 'English',
    flag: '🇺🇸',
    dir: 'ltr'
  }
}

export default getRequestConfig(async ({ locale }) => {
  // 验证语言是否支持
  if (!locales.includes(locale as any)) notFound()

  return {
    messages: (await import(`./messages/${locale}.json`)).default
  }
})
