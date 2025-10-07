'use client'

import React, { useState, useEffect } from 'react'
import { Clock, Users, Gift, AlertCircle } from 'lucide-react'

interface EarlyBirdCampaignProps {
  locale: 'zh' | 'en'
  getTranslation: (key: string) => string
}

export default function EarlyBirdCampaign({ locale, getTranslation }: EarlyBirdCampaignProps) {
  const [remainingSpots, setRemainingSpots] = useState(23) // 模拟剩余名额
  const [timeLeft, setTimeLeft] = useState({
    days: 7,
    hours: 12,
    minutes: 30,
    seconds: 45
  })

  // 模拟倒计时
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-xl p-6 text-white mb-8 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full translate-y-12 -translate-x-12"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Gift className="w-6 h-6" />
            <h3 className="text-xl font-bold">
              {getTranslation('promo.pricing.earlyBird.title')}
            </h3>
          </div>
          <div className="flex items-center space-x-1 bg-white bg-opacity-20 px-3 py-1 rounded-full">
            <Users className="w-4 h-4" />
            <span className="text-sm font-semibold">
              {remainingSpots} {getTranslation('promo.pricing.earlyBird.remaining')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold mb-2">
              {getTranslation('promo.pricing.earlyBird.description')}
            </h4>
            <p className="text-red-100 mb-4">
              {getTranslation('promo.pricing.earlyBird.benefit')}
            </p>
            <p className="text-sm font-semibold text-yellow-200">
              {getTranslation('promo.pricing.earlyBird.urgent')}
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{timeLeft.days}</div>
                <div className="text-xs opacity-80">天</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{timeLeft.hours}</div>
                <div className="text-xs opacity-80">时</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{timeLeft.minutes}</div>
                <div className="text-xs opacity-80">分</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{timeLeft.seconds}</div>
                <div className="text-xs opacity-80">秒</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-2 text-sm">
              <Clock className="w-4 h-4" />
              <span>活动倒计时</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center space-x-2 text-sm bg-white bg-opacity-20 rounded-lg p-3">
          <AlertCircle className="w-4 h-4" />
          <span>仅限前50名用户，注册后立即生效，永久免费使用所有功能</span>
        </div>
      </div>
    </div>
  )
}
