'use client'

import React, { useState, useEffect } from 'react'
import { locales, type Locale, localeConfig } from '@/i18n'
import { detectUserLanguage, detectDeviceLanguage } from '@/lib/geoDetection'

export default function LanguageSwitcher() {
  const [locale, setLocaleState] = useState<Locale>('zh')
  const [isAutoDetected, setIsAutoDetected] = useState(false)

  // 自动检测设备语言
  useEffect(() => {
    const detectedLang = detectUserLanguage()
    setLocaleState(detectedLang)
    
    // 检查是否是自动检测的语言
    const deviceLang = detectDeviceLanguage()
    const hasUserChoice = localStorage.getItem('locale')
    setIsAutoDetected(!hasUserChoice && (deviceLang.isChinese || deviceLang.isEnglish))
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)
    setIsAutoDetected(false)
    
    // 触发页面重新渲染以更新翻译
    window.location.reload()
  }

  return (
    <div className="relative">
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className={`appearance-none bg-white border rounded-lg px-3 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-lg ${
          isAutoDetected ? 'border-blue-300 bg-blue-50' : 'border-gray-300'
        }`}
        title={isAutoDetected ? '根据您的设备语言自动选择' : '选择界面语言'}
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {localeConfig[loc].flag} {localeConfig[loc].name}
            {isAutoDetected && loc === locale ? ' (自动检测)' : ''}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
      {isAutoDetected && (
        <div className="absolute -bottom-6 left-0 text-xs text-blue-600 whitespace-nowrap">
          已根据设备语言自动选择
        </div>
      )}
    </div>
  )
}
