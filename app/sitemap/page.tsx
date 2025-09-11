export default function SitemapPage() {
  const pages = [
    { url: '/', title: '首页', description: '书云智能图书管理系统主页' },
    { url: '/landing', title: '产品介绍', description: '了解书云的功能特色和优势' },
    { url: '/login', title: '用户登录', description: '登录您的书云账户' },
    { url: '/register', title: '免费注册', description: '注册新的书云账户' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">网站地图</h1>
          
          <div className="space-y-6">
            {pages.map((page, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                <h2 className="text-xl font-semibold text-blue-600 mb-2">
                  <a href={page.url} className="hover:underline">
                    {page.title}
                  </a>
                </h2>
                <p className="text-gray-600">{page.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  链接: <a href={page.url} className="text-blue-500 hover:underline">{page.url}</a>
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">关于书云</h3>
            <p className="text-blue-800 mb-4">
              书云是专业的智能图书管理系统，帮助用户轻松管理个人图书收藏，
              支持AI推荐、批量操作等强大功能。让您的图书管理更简单高效。
            </p>
            <div>
              <a 
                href="https://github.com/HuangRunzhe/BookCloud" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
                查看 GitHub 开源项目
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
