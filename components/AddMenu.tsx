'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, ChevronDown, BookOpen, Upload, FileText } from 'lucide-react'

interface AddMenuProps {
  onBookUpdate: () => void
}

export default function AddMenu({ onBookUpdate }: AddMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-primary flex items-center space-x-2"
      >
        <Plus className="h-4 w-4" />
        <span>添加图书</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* 下拉菜单 */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-20">
            <div className="py-1">
              <Link
                href="/add"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <BookOpen className="h-4 w-4 mr-3 text-blue-600" />
                <div>
                  <div className="font-medium">单本添加</div>
                  <div className="text-xs text-gray-500">手动添加一本图书</div>
                </div>
              </Link>
              
              <Link
                href="/batch-add"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <FileText className="h-4 w-4 mr-3 text-green-600" />
                <div>
                  <div className="font-medium">批量添加</div>
                  <div className="text-xs text-gray-500">通过ISBN批量添加</div>
                </div>
              </Link>
              
              <Link
                href="/batch-upload"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Upload className="h-4 w-4 mr-3 text-purple-600" />
                <div>
                  <div className="font-medium">批量上传</div>
                  <div className="text-xs text-gray-500">先上传封面再填写</div>
                </div>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
