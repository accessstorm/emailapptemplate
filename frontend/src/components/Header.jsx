export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      {/* Left side */}
      <div className="flex items-center gap-4">
        {/* Menu button */}
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <span className="text-xl">☰</span>
        </button>
        
        {/* Gmail logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="text-xl font-normal text-gray-700">Gmail</span>
        </div>
      </div>

      {/* Search bar */}
      <div className="flex-1 max-w-2xl mx-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">🔍</span>
          </div>
          <input
            type="text"
            placeholder="Search mail"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button className="text-gray-400 hover:text-gray-600">
              <span>🔧</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Help */}
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <span className="text-lg">❓</span>
        </button>
        
        {/* Settings */}
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <span className="text-lg">⚙️</span>
        </button>
        
        {/* Google Apps */}
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <span className="text-lg">⊞</span>
        </button>
        
        {/* Profile */}
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center ml-2">
          <span className="text-white font-bold text-sm">J</span>
        </div>
      </div>
    </header>
  );
}
