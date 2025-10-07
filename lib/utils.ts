// 动态获取后端URL
export const getBackendUrl = () => {
  if (typeof window !== 'undefined') {
    // 客户端环境
    const hostname = window.location.hostname
    const protocol = window.location.protocol
    
    // 如果是本地开发环境
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8000'
    } else if (hostname === 'bc.aikits.sbs') {
      return 'https://bcbk.aikits.sbs'
    } else if (hostname === 'bcbk.aikits.sbs') {
      return 'https://bcbk.aikits.sbs'
    }
    
    // 如果是生产环境，使用相同的协议和主机名
    return `${protocol}//${hostname}:8000`
  }
  // 服务端环境
  return 'http://localhost:8000'
}

export function getImageUrl(imagePath?: string): string {
  if (!imagePath) return ''
  
  // 如果已经是完整的URL，直接返回
  if (imagePath.startsWith('http')) {
    return imagePath
  }
  
  // 确保路径以斜杠开头
  let normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
  // 兼容历史数据：根据文件名智能补全目录
  if (!normalizedPath.startsWith('/uploads/')) {
    const fileName = normalizedPath.split('/').pop() || ''
    // 详情页应显示“原图”（现有存储为 compressed_ 前缀），做智能映射：
    if (fileName.startsWith('thumb_')) {
      // thumb_xxx => compressed_xxx 放在 /uploads
      normalizedPath = `/uploads/compressed_${fileName.replace(/^thumb_/, '')}`
    } else if (fileName.startsWith('compressed_')) {
      normalizedPath = `/uploads/${fileName}`
    } else {
      // 原始名 xxx.jpg => 假定服务端只存 compressed_xxx.jpg
      normalizedPath = `/uploads/compressed_${fileName}`
    }
  } else {
    // 已经以 /uploads/ 开头的旧记录
    // /uploads/thumbs/thumb_xxx.jpg => /uploads/compressed_xxx.jpg
    if (normalizedPath.startsWith('/uploads/thumbs/')) {
      const fileName = normalizedPath.split('/').pop() || ''
      const base = fileName.replace(/^thumb_/, '')
      normalizedPath = `/uploads/compressed_${base}`
    } else {
      // /uploads/xxx.jpg 且不以 compressed_ 开头 => /uploads/compressed_xxx.jpg
      const fileName = normalizedPath.split('/').pop() || ''
      if (!fileName.startsWith('compressed_')) {
        normalizedPath = `/uploads/compressed_${fileName}`
      }
    }
  }
  
  // 如果是相对路径，添加后端URL前缀
  return `${getBackendUrl()}${normalizedPath}`
}

// 获取缩略图URL（若传入的是原图路径 /uploads/xxx.jpg，则转换为 /uploads/thumbs/thumb_xxx.jpg）
export function getThumbUrl(imagePath?: string): string {
  if (!imagePath) return ''
  // 已经是完整URL，直接返回（可能是第三方封面）
  if (imagePath.startsWith('http')) return imagePath

  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
  // 如果已经是缩略图路径则返回
  if (path.includes('/uploads/thumbs/')) return `${getBackendUrl()}${path}`

  // 推断缩略图文件名
  const fileName = path.split('/').pop() || ''
  let thumbFile = fileName
  if (fileName.startsWith('compressed_')) {
    thumbFile = fileName.replace('compressed_', 'thumb_')
  } else if (!fileName.startsWith('thumb_')) {
    thumbFile = `thumb_${fileName}`
  }
  const thumbPath = `/uploads/thumbs/${thumbFile}`
  return `${getBackendUrl()}${thumbPath}`
}
