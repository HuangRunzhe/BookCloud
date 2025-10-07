// 设备语言检测和自动切换
export interface DeviceLanguage {
  primary: string
  languages: string[]
  isChinese: boolean
  isEnglish: boolean
}

// 检测设备语言
export function detectDeviceLanguage(): DeviceLanguage {
  if (typeof window === 'undefined') {
    return {
      primary: 'zh',
      languages: ['zh'],
      isChinese: true,
      isEnglish: false
    }
  }
  
  const primaryLang = navigator.language || (navigator as any).userLanguage || 'zh'
  const allLangs = navigator.languages || [primaryLang]
  
  // 检查是否包含中文
  const hasChinese = allLangs.some(lang => 
    lang.toLowerCase().startsWith('zh') || 
    lang.toLowerCase().includes('chinese') ||
    lang.toLowerCase().includes('cns')
  )
  
  // 检查是否包含英文
  const hasEnglish = allLangs.some(lang => 
    lang.toLowerCase().startsWith('en') || 
    lang.toLowerCase().includes('english')
  )
  
  return {
    primary: primaryLang,
    languages: allLangs,
    isChinese: hasChinese,
    isEnglish: hasEnglish
  }
}

// 根据设备语言推荐界面语言
export function getRecommendedLanguage(): 'zh' | 'en' {
  const deviceLang = detectDeviceLanguage()
  
  // 如果设备支持中文，优先使用中文
  if (deviceLang.isChinese) {
    return 'zh'
  }
  
  // 如果设备支持英文，使用英文
  if (deviceLang.isEnglish) {
    return 'en'
  }
  
  // 根据主要语言判断
  const primaryLang = deviceLang.primary.toLowerCase()
  if (primaryLang.startsWith('zh')) {
    return 'zh'
  }
  
  // 默认返回英文
  return 'en'
}

// 综合检测用户语言偏好
export function detectUserLanguage(): 'zh' | 'en' {
  // 1. 首先检查localStorage中是否有用户手动选择
  if (typeof window !== 'undefined') {
    const savedLang = localStorage.getItem('locale') as 'zh' | 'en'
    if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
      return savedLang
    }
  }
  
  // 2. 根据设备语言自动检测
  return getRecommendedLanguage()
}

// 检查是否需要显示语言切换提示
export function shouldShowLanguagePrompt(): boolean {
  if (typeof window === 'undefined') return false
  
  // 如果用户已经手动选择过语言，不显示提示
  const hasUserChoice = localStorage.getItem('locale')
  if (hasUserChoice) return false
  
  // 如果设备语言与推荐语言不匹配，显示提示
  const deviceLang = detectDeviceLanguage()
  const recommendedLang = getRecommendedLanguage()
  
  // 如果设备支持中文但推荐英文，或设备支持英文但推荐中文，显示提示
  if ((deviceLang.isChinese && recommendedLang === 'en') || 
      (deviceLang.isEnglish && recommendedLang === 'zh')) {
    return true
  }
  
  return false
}
