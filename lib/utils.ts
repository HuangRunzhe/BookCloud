// 动态获取后端URL
const getBackendUrl = () => {
  if (typeof window !== 'undefined') {
    // 客户端环境
    const hostname = window.location.hostname
    const protocol = window.location.protocol
    
    // 如果是本地开发环境
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8000'
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
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
  
  // 如果是相对路径，添加后端URL前缀
  return `${getBackendUrl()}${normalizedPath}`
}

// 获取缩略图URL（若传入的是原图路径 /uploads/xxx.jpg，则转换为 /uploads/thumbs/thumb_xxx.jpg）
export function getThumbUrl(imagePath?: string): string {
  if (!imagePath) return ''
  if (imagePath.startsWith('http')) return imagePath // 远程URL不转换

  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
  // 已经是缩略图则直接返回
  if (path.includes('/uploads/thumbs/')) return `${getBackendUrl()}${path}`

  const fileName = path.split('/').pop() || ''
  const thumbPath = `/uploads/thumbs/thumb_${fileName}`
  return `${getBackendUrl()}${thumbPath}`
}
